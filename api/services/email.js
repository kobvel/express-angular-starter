import Nodemailer from 'nodemailer';

module.exports = app => {
  const service = {};
  const config = app.config.config;
  const transporter = Nodemailer.createTransport({
    service: config.emailService,
    auth: config.auth,
  });

  service.sendEmail = (email, subject, content) => {
    const mailOptions = {
      to: email,
      subject,
      html: '<b>' + content + '</b>',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Enviado: ' + info.response);
      }
    });
  };

  // service.sendEmail('sergio.baldani@gmail.com', '1111', '2222');

  return service;
};
