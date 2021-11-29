const nodemailer = require("nodemailer");
const Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

exports.handleUserVerification = (user) => {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    title: "Email Confirmation",
    html: ` <!DOCTYPE html>
             <html>
              <head>               
              </head>
               <body>
               <h1 style="color:orange;">Ticket Express </h1>
               <br>
               <h4> Hello ${user.firstname} ${user.lastname} </h4>
               <br>
               <p style="color:gray;"> Thank you for registering with us </p>
               <br>
               <p><a href="http://localhost/verify?id=${user.id}"> Click Here </a> To Complete Your Registration </p>
               </body>
             </html>`,
  };

  try {
    const mailResponse = await Transporter.sendMail(mailOptions);

    if (mailResponse) {
      return mailResponse;
    }
  } catch (err) {
    return false;
  }
};

exports.handlePasswordReset = (user) => {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    title: "Password Reset",
    html: ` <!DOCTYPE html>
             <html>
              <head>               
              </head>
               <body>
               <h1 style="color:orange;">Ticket Express </h1>
               <br>
               <h4> Hello ${user.firstname} ${user.lastname} </h4>
               <br>
               <p><a href="http://localhost/resetpassword?id=${user.id}"> Click Here </a> To Reset Your Password </p>
               </body>
             </html>`,
  };

  try {
    const mailResponse = await Transporter.sendMail(mailOptions);

    if (mailResponse) {
      return mailResponse;
    }
  } catch (err) {
    return false;
  }
};
