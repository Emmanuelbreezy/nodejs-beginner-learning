const express = require("express");
const { check, } = require("express-validator")
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/signup',authController.getSignup);

router.get('/login',authController.getLogin);
router.get('/logout',authController.getLogout);
router.get('/forget-password',authController.getResetPassword);
router.get('/password-sent',authController.getPasswordSent);
router.get('/resetpassword/:token',authController.getNewPassword);

router.post('/signup-form',check('email').isEmail().withMessage('Please provide a valid email'),authController.postSignup);
router.post('/usrlogin',authController.postLogin);
router.post('/resetpassword',authController.postResetPassword);
router.post('/newpassword',authController.postNewPassword);

module.exports = router;