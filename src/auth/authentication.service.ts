import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { safeError } from 'src/common/helper-functions/safe-error.helper';
import { SignUpDto } from './dtos/sign-up.dto';
import jwtConfig from 'src/configurations/jwt.config';
import { ConfigType } from '@nestjs/config';
import { HashingService } from 'src/common/helper-modules/hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { runInTransaction } from 'src/common/helper-functions/transaction.helper';
import { In, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { SignInDto } from './dtos/sign-in.dto';
import { randomUUID } from 'crypto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { RefreshTokenIdsStorage } from 'src/common/helper-modules/redis/redis-refresh-token.service';
import { ActiveUserData } from './interfaces/active-user-data.interfce';
import { SignUpUserDto } from './dtos/sign-up-user.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const [message, error] = await safeError(
      runInTransaction(async (queryRunner: QueryRunner) => {
        const roleRepository = queryRunner.manager.getRepository(Role);
        const [regularRole, _error] = await safeError(
          roleRepository.findOne({
            where: { name: 'regular' },
          }),
        );
        if (_error)
          throw new InternalServerErrorException(
            `Error getting role to assign to the new user.`,
          );
        if (!regularRole)
          throw new NotFoundException(
            "Error assigning default 'regular' role to the user, check if the role exist.",
          );

        const userRepository = queryRunner.manager.getRepository(User);
        const existingUser = await userRepository.findOne({
          where: { email: signUpDto.email },
        });
        if (existingUser)
          throw new ConflictException(
            `Email already registered in the system.`,
          );

        const hashedPassword = await this.hashingService.hash(
          signUpDto.password,
        );

        const userInstance = Object.assign(new User(), {
          email: signUpDto.email,
          password: hashedPassword,
          roles: [regularRole],
        });

        const user = userRepository.create(userInstance);
        const savedUser = await userRepository.save(user);

        return {
          success: true,
          message: `User created and saved successfully.`,
        };
      }),
    );
    if (error) throw error;
    return message;
  }

  async signUpUser(signUpUserDto: SignUpUserDto) {
    const [message, error] = await safeError(
      runInTransaction(async (queryRunner: QueryRunner) => {
        const userRepository = queryRunner.manager.getRepository(User);
        const existingUser = await userRepository.findOne({
          where: { email: signUpUserDto.email },
        });
        if (existingUser)
          throw new ConflictException(
            `Email already registered in the system.`,
          );

        const roleRepository = queryRunner.manager.getRepository(Role);
        const incommingRoleIds = signUpUserDto.roleIds.filter((id) => id !== 1); //dont allow to create a super user
        const roleInstances = await queryRunner.manager.find(Role, {
          where: { id: In(incommingRoleIds) },
        });

        const foundRoleIds = roleInstances.map(
          (roleInstance: Role) => roleInstance.id,
        );

        const missingRoleIds = incommingRoleIds.filter(
          (id: number) => !foundRoleIds.includes(id),
        );
        if (missingRoleIds.length > 0)
          throw new NotFoundException(
            `Role/s not found for id/s: ${missingRoleIds.join(', ')}`,
          );

        const hashedPassword = await this.hashingService.hash(
          signUpUserDto.password,
        );

        const userInstance = Object.assign(new User(), {
          email: signUpUserDto.email,
          password: hashedPassword,
          roles: roleInstances,
        });

        const user = userRepository.create(userInstance);
        const savedUser = await userRepository.save(user);

        return {
          success: true,
          message: `User created and saved successfully.`,
        };
      }),
    );
    if (error) throw error;
    return message;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOne({
      select: ['id', 'email', 'password', 'roles'],
      where: { email: signInDto.email },
      relations: ['roles'],
    });
    if (!user) throw new UnauthorizedException(`User does not exist.`);
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException(`Password does not match.`);
    }
    return await this.generateTokens(user);
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        // { email: user.email, role: user.role } this was for Roles Guard
        { email: user.email, roles: user.roles.map((role) => role.name) },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId: refreshTokenId,
      }),
    ]);

    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );

      const user = await this.usersRepository.findOne({
        select: ['id', 'email', 'roles'],
        where: { id: sub },
        relations: ['roles'],
      });
      if (!user)
        throw new NotFoundException('This person is not the user anymore.');

      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );

      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }

      return await this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(`Unauthorized to access resource.`);
    }
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      } as ActiveUserData,
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
