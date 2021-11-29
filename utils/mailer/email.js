const nodemailer = require("nodemailer")

exports.transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port:2525,
  auth: {
    user: "3ef59b67298ed4",
    pass: "608e3e183ae710"
  }
})

exports.getPasswordResetURL = (user, token) =>
  `http://localhost:3000/email/password/reset/${user.id}/${token}`

exports.resetPasswordTemplate = (user, url) => {
  const from ="TicketExpress.com"
  const to = user.email
  const subject = "🌻 Ticket Express Password Reset 🌻"
  const html = `
  <p>Hey ${user.firstname},</p>
  <p>We heard that you lost your Ticket Express password. Sorry about that!</p>
  <p>But don’t worry! You can use the following link to reset your password:</p>
  <a href=${url}>${url}</a>
  <p>If you don’t use this link within 1 hour, it will expire.</p>
  <p>Do something outside today! </p>
  <p>–Your customers at Ticket Express</p>
  `

  return { from, to, subject, html }
}
