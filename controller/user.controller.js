const db = require("../model");
const { hash, compare } = require("bcrypt");

exports.getUserDetails = async (req, res) => {
  try {
    const user = await db.users.findOne({
      where: { id: req.id },
      include: db.roles,
    });

    if (!user) {
      throw new Error("User does not exist");
    }

    const {
      firstname,
      lastname,
      email,
      role: { roleName },
    } = user;

    res.status(200).send({
      firstname,
      lastname,
      email,
      role: roleName,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

exports.resetUserPassword = async (req, res) => {      
     const { currentPassword, newPassword } = req.body;
     try{
         const user = await db.users.findOne({ id: req.id });
          if(!user){
            res.status(404).send({
                 message: 'User Not Found'
            })
            return;
          }

        const isPassword = await compare(currentPassword, user.password);


          if(!isPassword) {
              res.status(402).send({
                message: 'Incorrect password'
              })           
              return;
          }

         const hashedPassword = await hash(newPassword, 10);          

          const response = await db.users.update({ password: hashedPassword  },{ where: { id:req.id} });

          if(response.length === 1){
              res.status(200).send({
                message: 'Password successfully changed'
              })
          }
     } 
     catch(err){
        res.status(401).send({
          message: err.message
        })
     }       
}