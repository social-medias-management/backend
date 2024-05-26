const nodemailer = require("nodemailer");
// const nodemailerConfig = require("./nodemailerConfig");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Sudarshandn1999@gmail.com",
      pass: "kpla quvu qhmv jdzg",
    },
  });

  return transporter.sendMail(
    {
      from: '"Sudarshan 👻" <sudarshandn199@gmail.com>',
      to,
      subject,
      html,
    },
    (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    }
  );
};

module.exports = sendEmail;
