import * as nodemailer from 'nodemailer';
import accessEnv from '@app/libs/accessEnv';

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (email: string, subject: string, html: string): Promise<void> => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: accessEnv('EMAIL_NAME'),
      pass: accessEnv('EMAIL_PASSWORD'),
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: accessEnv('EMAIL_NAME'),
    to: email,
    subject: subject,
    html: html,
  });

  console.log('Message sent: %s', info.messageId);
};
