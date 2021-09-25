const http = require("http");
const path = require('path');
const express = require("express");
const bodyParser = require('body-parser');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
//mongoose
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDBSessionStore = require('connect-mongodb-session')(session); //session store

const errorController = require('./controllers/error.controller');
const MONGODB_URI = 'mongodb+srv://Emmanuel:B55nWv_-JL2N-Xw@cluster0.wo1wx.mongodb.net/shop';


//const mongoConnect = require("./util/database.mongodb").mongoConnect;
const User = require('./models/user.model');

const app = express();
const store = new mongoDBSessionStore({
    uri:MONGODB_URI,
    collection: 'sessions'
});
// CSRF CALL
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const shopRoutes = require('./routes/shop.routes');

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        callback(null,file.filename + '-' + file.originalname);
    }
})

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage}).single('image'));
app.use('/static',express.static(path.join(__dirname,'public')));
//session
app.use(
    session({
        secret: 'my secret', 
        resave:false, 
        saveUninitialized:false,
        store:store
    }));
// CSRF INITIALIZE
app.use(csrfProtection);
app.use(flash());

app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

//RECEVING USER
app.use((req,res,next) =>{
    if(!req.session.user){
       return next();
    }
    User.findById(req.session.user._id)
        .then((user) => {
            if(!user){
               return next();
            }
            req.user = user;
            next();
        })
        .catch(err =>{
           next(new Error(err));
        })
});

app.use(authRoutes);

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use('/internal-error',errorController.get500);

app.use(errorController.get404);

app.use((error,req,res,next)=> {
    //res.redirect('/internal-error');
    res.status(500).render('500',{
        pageTitle:'Internal Error',
        path:'',
        isAuthenticated: req.session.isLoggedIn,
    });
});

mongoose.connect((MONGODB_URI))
       .then(result => { 
        //    User.findOne().then(_user => {
        //        if(!_user){
        //            const user = new User({
        //                name:'Max',
        //                email:'max@gmail.com',
        //                cart:{
        //                    items:[]
        //                }
        //            });
        //            user.save();

        //        }
         //  })
           app.listen(3000);
       })
       .catch(err => console.log(err));
 
    //    ezekel 18:20
    //    psalm 120