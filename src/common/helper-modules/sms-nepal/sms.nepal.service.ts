import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { safeError } from 'src/common/helper-functions/safe-error.helper';

@Injectable()
export class SmsNepalService {
  constructor(private readonly configService: ConfigService) {}
  async sendSms(mobile: string, message: string) {
    try {
      const response = await axios({
        method: 'POST',
        url: process.env.SOCIAIR_SMS_URL,
        headers: {
          Authorization: `Bearer ${process.env.SOCIAIR_SMS_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        data: {
          message: message,
          mobile: mobile,
        },
      });
      return response;
    } catch (error) {
      if (
        error.response.data.message &&
        error.response.data.message ==
          'Sorry! SMS could not be sent. Invalid mobile number'
      ) {
        throw new NotFoundException();
      }
      if (
        error.response.data.error &&
        error.response.data.error.includes('Invalid token')
      ) {
        throw new UnauthorizedException();
      }
      throw new InternalServerErrorException();
    }
  }
}

// call the function
// const smsHistoryRepository = this.dataSource.getRepository(SmsHistory);
// const mobileNumbers = [`2342421`, `239842094`];

// let invalidMobileNumber: string[] = [];
// for (const mobileNumber of mobileNumbers) {
//   let message = `TOWN DEVELOPMENT FUND PROJECT TEST for mobile messaging: ${mobileNumber}.`;

//   const [successMessage, error] = await safeError(
//     this.smsService.sendSms(mobileNumber, message),
//   );

//   const smsHistoryInstance = new SmsHistory();
//   smsHistoryInstance.phoneNumber = Number(mobileNumber);

//   if (error) {
//     if (error instanceof NotFoundException) {
//       invalidMobileNumber.push(mobileNumber);
//       smsHistoryInstance.error = `Invalid Mobile Number.`;
//       smsHistoryInstance.status = false;
//       let newSmsHistoryInstance =
//         smsHistoryRepository.create(smsHistoryInstance);
//       const [savedSmsHistory, __error] = await safeError(
//         smsHistoryRepository.save(newSmsHistoryInstance),
//       );
//       if (__error)
//         throw new InternalServerErrorException(
//           `Error while saving SMS history for phone number: ${mobileNumber}`,
//         );
//       continue;
//     } else if (error instanceof UnauthorizedException) {
//       throw new UnauthorizedException(
//         'Invalid SOCIAIR token. Please contact the responsible authority.',
//       );
//     } else if (error instanceof InternalServerErrorException) {
//       throw new InternalServerErrorException(
//         `Error while we were sending SMS to: ${mobileNumber}`,
//       );
//     } else throw error;
//   }
//   smsHistoryInstance.message = message;
//   smsHistoryInstance.status = true;
//   let newSmsHistoryInstance =
//     smsHistoryRepository.create(smsHistoryInstance);

//   const [savedSmsHistory, _error] = await safeError(
//     smsHistoryRepository.save(newSmsHistoryInstance),
//   );
//   if (_error) {
//     console.log(_error, 'meow');
//     throw new InternalServerErrorException(
//       `Error while saving SMS history for phone number: ${mobileNumber}`,
//     );
//   }
// }
// return { success: true, smsNotSentTo: invalidMobileNumber };

//On Success
// {
//   "message": "Success! SMS has been sent",
//   "ntc": 1,
//   "ncell": 0,
//   "smartcell": 0
//  }

//On Failure
// {
//   "message": "Unauthenticated."
// }

// or

// {
//   "message": "Sorry! SMS could not be sent. Invalid mobile number",
//   "ntc": 0,
//   "ncell": 0,
//   "smartcell": 0,
//   "other": 1,
//   "invalid_number": [
//       "984956362"
//   ]
// }
