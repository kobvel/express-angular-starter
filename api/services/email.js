import Nodemailer from 'nodemailer';

module.exports = app => {
  const service = {};
  const config = app.config.config;
  const transporter = Nodemailer.createTransport({
    service: config.emailService,
    auth: config.auth,
  });

  function sendEmail(mailOptions) {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Enviado: ' + info.response);
      }
    });
  }

  service.sendValidateEmail = (email, id) => {
    const content = 'Please enter <a href=\"' + config.urlBaseClient + '/user/validate/' + id +
    '\"> here </a>';
    const subject = 'Validate Email';
    const mailOptions = {
      to: email,
      subject,
      html: '<b>' + content + '</b>',
    };
    sendEmail(mailOptions);
  };

  return service;
};
