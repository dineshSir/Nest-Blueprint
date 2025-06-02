import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(
    to: string,
    subject: string,
    incommingHtml: string,
    context: Record<string, any>,
  ) {
    let finalizedHTML = incommingHtml;
    Object.keys(context).forEach((key) => {
      const placeholder = new RegExp(`{{{\\s*${key}\\s*}}}`, 'g');
      finalizedHTML = finalizedHTML.replace(placeholder, context[key]);
    });

    await this.mailerService.sendMail({
      to,
      subject,
      html: finalizedHTML,
    });
  }
}

//calling function example
// for (let i = 0; i < 50; i++) {
//   await this.emailService.sendMail(
//     `pratikchalise808@gmail.com`,
//     `it a test from Dinesh`,
//     helloTemplate,
//     { name: `Dinesh` },
//   );
// }
