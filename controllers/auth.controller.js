const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator")


const User = require('../models/user.model');


exports.getSignup = (req,res,next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  };
  res.render('auth/signup',{
      path:'/signup',
      pageTitle:'Account Sign up',
      errorMessage: message,
      oldInput: {
        email:"", 
        password:"",
         confirmPassword:""
      },
      validationErrors: []
  });
}


exports.getLogin = (req,res,next) => {
    let message = req.flash('error');
    if(message.length > 0){
      message = message[0];
    }else{
      message = null;
    }
    res.render('auth/login',{
        path:'/Login',
        pageTitle:'Account Sign in',
        errorMessage: message,
        oldInput: {
          email:"", 
          password:"",
        },
        validationErrors: []
    });
}

exports.getResetPassword = (req,res,next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('auth/reset-password',{
      path:'',
      pageTitle:'Reset Password',
      errorMessage: message 
  });
}

exports.getNewPassword = (req,res,next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: {$gt: Date.now()}
  })
  .then(user => {
    let message = req.flash('error');
    if(message.length > 0){
      message = message[0];
    }else{
      message = null;
    }
    res.render('auth/new-password',{
        path:'',
        pageTitle:'Set New Password',
        errorMessage: message ,
        userId: user._id.toString(),
        passwordToken: token
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}

exports.getPasswordSent = (req,res,next) => {
  res.render('auth/password-sent',{
      path:'',
      pageTitle:'Reset Password',
  });
}

exports.getLogout = (req,res,next) => {
  if (req.session) {
    req.session.destroy(function () {
      res.redirect('/');              
  });
      
  }
}






exports.postSignup = (req,res,next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('auth/signup',{
      path:'/signup',
      pageTitle:'Account Sign up',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email:email, 
        password:password,
         confirmPassword:confirmPassword
      },
      validationErrors: errors.array()
  });
  }

  if(!email.trim() || !password.trim() || !confirmPassword){
    req.flash('error','*All fields are required');
    return res.redirect('/signup');
  }
  // MOVE TO AUTHROUTES
  // User.findOne({
  //   email:email
  // })
  // .then((userDoc) => {
  //   if(userDoc){
  //     req.flash('error','E-mail already exist, Try another one');
  //     return res.redirect('/signup');
   // }else{  })

    return bcrypt
      .hash(password,12)
      .then(hashedPassword => {
        const user = new User({
          name: 'no name',
          email:email,
          password: hashedPassword,
          cart: { items: [] }
      });
      return user.save();
      })
      .then(result => {
        res.redirect('/login');
      })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });

}

exports.postLogin = (req,res,next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('auth/login',{
    path:'/Login',
    pageTitle:'Account Sign in',
    errorMessage: errors.array()[0].msg,
    oldInput: {
      email:email, 
      password:password,
    },
    validationErrors: errors.array()
    });
  }
  User.findOne({email:email})
      .then(user => {
        if(!user){
          //req.flash('error','Invalid email or password');
          //return res.redirect('/login'); 
          return res.status(422).render('auth/login',{
            path:'/Login',
            pageTitle:'Account Sign in',
            errorMessage: 'Invalid email or password',
            oldInput: {
              email:email, 
              password:password,
            },
            validationErrors: []
            });
        }
        bcrypt
            .compare(password,user.password)
            .then(passwordMatch => {
                if(passwordMatch){
                  req.session.isLoggedIn = true;
                  req.session.user = user;
                  return req.session.save(err => {
                    return res.redirect('/');
                  })
                }
                //return res.redirect('/login');
                return res.status(422).render('auth/login',{
                  path:'/Login',
                  pageTitle:'Account Sign in',
                  errorMessage: 'Invalid email or password',
                  oldInput: {
                    email:email, 
                    password:password,
                  },
                  validationErrors: []
                  });
            })
            .catch(err => {
              res.redirect('/login');
            })
      });
       
}

exports.postResetPassword = (req,res,next) => {
  crypto.randomBytes(32,(err,buffer) => {
    if(err){
      req.flash('error','Unable to send reset link,Try again');
      return res.redirect('/forget-password')
    }
    const token = buffer.toString('hex');
    User.findOne({
      email: req.body.email
    }).then(user => {
      if(!user){
        req.flash('error','No existing account with that email');
        return res.redirect('/forget-password')

      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save()
    })
    .then(result => {
      console.log(`http://localhost:3000/resetpassword/${token}`);
      
      res.redirect('/password-sent');

      // transporter.sendmail({
      //   to: req.body.email,
      //   from:'shop@mailer.com',
      //   subject:'Password reset',
      //   html:`
      //      <p> You request a password reset<p>
      //      <p> Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password</p>
      //   `
      // })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  })
}

exports.postNewPassword = (req,res,next) => {
  const newPassword = req.body.password;
  const confirmpassword = req.body.confirmpassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: {$gt: Date.now()},
    _id: userId
  })
  .then(user => {
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  })
  .then(hashedPassword => {
     resetUser.password = hashedPassword;
     resetUser.resetToken= null;
     resetUser.resetTokenExpiration = undefined;
     resetUser.save();
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })

   
}