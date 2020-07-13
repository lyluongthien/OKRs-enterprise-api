import * as nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (email: string, url: string): Promise<void> => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    // host: 'smtp.domain.com',
    // port: 25,
    // secure: true,
    service: 'gmail',
    auth: {
      user: 'sp.flame.okrs@gmail.com', // generated ethereal user
      pass: 'flameOkrs@123', // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'phanduc0908@gmail.com',
    to: email,
    cc: ['ducnmhe130666@fpt.edu.vn', 'quangnvse05839@fpt.edu.vn'],
    subject: '[Flame-OKRs] | Lấy lại mật khẩu',
    html: ` <p>Chúng tôi đã nhận được yêu cầu đổi mật khẩu của bạn.</p>
            <p>Bạn vui lòng truy cập đường link dưới đây để đổi mật khẩu.</p>
            <a href="${url}">${url}</a>`,
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};
