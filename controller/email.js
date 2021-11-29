
 const jwt= require("jsonwebtoken")
 const bcrypt= require("bcrypt")
 const db= require("../model/index")
 const{
   transporter,
   getPasswordResetURL,
   resetPasswordTemplate,
   adminEmailTemplate
 } = require("../utils/mailer/email")

 function usePasswordHashToMakeToken({
    password: passwordHash,
    id: userId,
    createdAt
  }) {
    const secret = passwordHash + "-" + createdAt
    const token = jwt.sign({ userId }, secret)
    return token
  }
 
exports.emailController={
  /*** Calling this function with a registered user's email sends an email IRL ***/
  sendPasswordResetEmail: async (req, res) => {
    const { email } = req.body
    // console.log(email)
    let user
    try {
      user = await db.users.findOne({where:{
          email:email
      }})
      const token = usePasswordHashToMakeToken(user)
    //   console.log(token)
      const url = getPasswordResetURL(user, token)
    //   console.log(url)
      const emailTemplate = resetPasswordTemplate(user, url)
    //   console.log(emailTemplate)
      
      const sendEmail = () => {
         transporter.sendMail(emailTemplate, (err, info) => {
          if (err.message) {
           return res.status(400)
           .send("Error sending email", err)
          }
          console.log(`** Email sent **`, info)
            res.status(200)
                .send("Email Sent", info)
        })
      }
      sendEmail()
    } catch (err) {
      res.status(404).json("No user with that email")
    }
   
    
  },
  
  receiveNewPassword : (req, res) => {
    const userP = req.params
    console.log('user id', userP)
    const { password } = req.body
    console.log(password, userP.userid)


     db.users.findOne({ where:{
      id:userP.userid
    } })
      .then(user => {
        const secret = user.password + "-" + user.createdAt
        const payload = jwt.decode(userP.token, secret)
        if (payload.userId === user.id) {
          bcrypt.genSalt(10, function(err, salt) {
            if (err) return
            bcrypt.hash(password, salt, function(err, hash) {
              if (err) return
             
              user.update({ password: hash },{
                    where: { id: userP.userid}
              })
                .then(() => res.status(202).send("Password changed accepted"))
                .catch(err => res.status(500).send(err))
            })
          })
        }
      })
  
      .catch(() => {
        res.status(404).send("Invalid user")
      })
  },
  contactUs: async (req, res) => {
        const user= req.body;
        
        console.log(user.fullname, user.email, user.text)
        const admin= {email:"admin@TickectXpress.com", fullname:"adetayo Tomiwa"}
        const sendAdminEmailTemplate =adminEmailTemplate(user, admin)
        if(!user.fullname || !user.email || !user.text){
            res.status(401)
                .send({message:"fill the required field"})
        }
        const sendAdminEmail = () => {
            transporter.sendMail(sendAdminEmailTemplate, (err, info) => {
             if (err.message) {
              return res.status(400)
              .send("Error sending email", err)
             }
             console.log(`** message sent **`, info)
               res.status(200)
                   .send("message Sent", info)
           })
         }
         sendAdminEmail()

        res.status(200).send({message:"message sent to admin"})

  }
  
} 

