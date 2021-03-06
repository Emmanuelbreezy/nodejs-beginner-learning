const http = require("http");
const path = require('path');
const express = require("express");
const bodyParser = require('body-parser');
const errorController = require('./controllers/error.controller');
const sequelize = require("./util/database");

const Product = require('./models/product.model');
const User    = require('./models/user.model');
const Cart =require('./models/carts.model');
const CartItem = require('./models/carts-item.model');
//ORDER IMPORT
const Order =require('./models/order.model');
const OrderItem = require('./models/order-item.model');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
// app.set('views', 'vi');

const adminRoute = require('./routes/admin.routes');
const shopRoutes = require('./routes/shop.routes');

// db.execute('SELECT * FROM products')
// .then((result) => {
//     console.log(result[0]);
// })
// .catch();

app.use(bodyParser.urlencoded({extended: false}));
app.use('/static',express.static(path.join(__dirname,'public')));
//RECEVING USER
app.use((req,res,next) =>{
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err =>{
            console.log(err);
        })
});

app.use('/admin',adminRoute);
app.use(shopRoutes);
app.use(errorController.get404);

Product.belongsTo(User, {
    constraints: true, onDelete:'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through:CartItem});
// Product.belongsToMany(Cart, {through:CartItem});

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});


sequelize
    //.sync({force:true})
    .sync()
    .then(result => {
      return User.findByPk(1);
    })
    .then((user) => {
         if(!user){
            return User.create({
                 name:'Max',
                 email:'max@gmai.com'
             })
         }
         return user;

      })
      .then((user)=>{
        user.createCart();
        }) 
    .then((user)=>{
        app.listen(3000)
        }) 
    .catch(err=>{
        console.log(err);
        })



 