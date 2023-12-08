import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class EmailService {
  constructor(private mailerService: MailerService) {}

  sendForgetPasswordEmail(payload: any): void {
    this.mailerService.sendMail({
      to: payload.email ?? 'phidv9855@gmail.com',
      subject: payload.subject ?? 'Testinggggggggggg',
      template: payload.template ?? 'forgot_password',
      context: payload,
    });
  }
}
