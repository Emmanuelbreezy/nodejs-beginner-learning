const http = require("http");
const path = require('path');
const express = require("express");
const bodyParser = require('body-parser');
const errorController = require('./controllers/error.controller');
const mongoConnect = require("./util/database.mongodb").mongoConnect;

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoute = require('./routes/admin.routes');

const shopRoutes = require('./routes/shop.routes');

app.use(bodyParser.urlencoded({extended: false}));
app.use('/static',express.static(path.join(__dirname,'public')));
//RECEVING USER
app.use((req,res,next) =>{
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err =>{
    //         console.log(err);
    //     })
    next();
});

app.use('/admin',adminRoute);
app.use(shopRoutes);
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
})
 