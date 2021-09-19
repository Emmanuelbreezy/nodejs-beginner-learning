const http = require("http");
const path = require('path');
const express = require("express");
const bodyParser = require('body-parser');
//mongoose
const mongoose = require('mongoose');

const errorController = require('./controllers/error.controller');
//const mongoConnect = require("./util/database.mongodb").mongoConnect;
//const User = require('./models/user.model');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoute = require('./routes/admin.routes');

const shopRoutes = require('./routes/shop.routes');

app.use(bodyParser.urlencoded({extended: false}));
app.use('/static',express.static(path.join(__dirname,'public')));
//RECEVING USER
// app.use((req,res,next) =>{
//     User.findById("6144c59c8d78dbb5a33e236f")
//         .then((user) => {
//             req.user = new User(user.name,user.email,user.cart,user._id);
//             next();
//         })
//         .catch(err =>{
//             console.log(err);
//         })
// });

app.use('/admin',adminRoute);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose.connect(('mongodb+srv://Emmanuel:B55nWv_-JL2N-Xw@cluster0.wo1wx.mongodb.net/shop?retryWrites=true&w=majority'))
       .then(result => {
           app.listen(3000);
       })
       .catch(err => console.log(err));
 