const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "e4d8c64566c0bd",
      pass: "4e533ab65de4bc"
    }
  });
