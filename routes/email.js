var express = require('express');
var router = express.Router();

const {emailController} = require('../controller/email')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a email routes');
});
  // create users routes
 router.post('/sendResetemail', emailController.sendPasswordResetEmail)
 // login routes
 router.post('/password/reset/:userid/:token', emailController.receiveNewPassword)
 
 // contactUs routes
 router.post('/contactUs', emailController.contactUs)



module.exports = router;
