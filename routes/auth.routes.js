const express = require("express");
const { body,check } = require("express-validator")
const authController = require('../controllers/auth.controller');
const User = require('../models/user.model');

const router = express.Router();

router.get('/signup',authController.getSignup);

router.get('/login',authController.getLogin);
router.get('/logout',authController.getLogout);
router.get('/forget-password',authController.getResetPassword);
router.get('/password-sent',authController.getPasswordSent);
router.get('/resetpassword/:token',authController.getNewPassword);

router.post('/signup-form',
  [
      check('email')
      .isEmail()
      .withMessage('*Please provide a valid email')
      .custom((value,{req}) => {
        //    if(value == 'test@gmail.com'){
        //        throw new Error('This Email address is forbiden')
        //    }
        //    return true
        return User.findOne({
            email:req.body.email
          })
          .then((userDoc) => {
            if(userDoc){
                return Promise.reject('E-mail already exist, Try another one')
            }
          })
        })
        .normalizeEmail(), // sanitizing
        body('password','Password should contain only number and text and at least 8 characters.')
            .isLength({min:8})
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
           .trim()  //sanitizing data
           .custom((value,{req})=>{
            if(value !== req.body.password){
                throw new Error('Passwords have to match!');
            }
            return true;
        })
  
    ],
      authController.postSignup
);

router.post(
  '/usrlogin',
  [
    check('email')
    .isEmail()
    .withMessage('*Please provide a valid email')
    .normalizeEmail(), // sanitizing
    body('password','Password has to be valid.')
          .isLength({min:8})
          .isAlphanumeric()
          .trim()
      ],
      authController.postLogin);
router.post('/resetpassword',authController.postResetPassword);
router.post('/newpassword',authController.postNewPassword);

module.exports = router;