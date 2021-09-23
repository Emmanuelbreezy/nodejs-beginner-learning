//WORKING WITH MONGOOSE - SIMPLIER
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type:String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = mongoose.model('Product', productSchema);




















//WORKING WITH MONGODB

// const mongodb = require('mongodb');
// const getDb = require('../util/database.mongodb').getDb;

// class Product {
//     constructor(title,price,description,imageUrl,id,userId){
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ? new mongodb.ObjectId(id) : null;  //check if the id is valid
//         this.userId = userId;
//     }

//     save(){
//         const db = getDb();
//         let dbOp;
//         if(this._id){
//           dbOp = db.collection('products').updateOne({_id: this._id}, {
//               $set: this
//           });
//         }else{
//            dbOp = db.collection('products').insertOne(this);
//         }
//         return dbOp.then(result => {
//                     console.log(result);
//                 })
//                 .catch(err => {
//             console.log(err);
//         })
//     }

//     static fetchAll(){
//         const db = getDb();
//         return db.collection('products')
//                 .find()
//                 .toArray()
//                 .then(products => {
//                     return products;
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 })
//     }

//     static findById(prodId){
//         const db = getDb();
//         return db
//             .collection('products')
//             .find({_id: new mongodb.ObjectId(prodId)})
//             .next()
//             .then(product => {
//                 console.log(product);
//                 return product;
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     static deleteById(prodId){
//         const db = getDb();
//         return db.collection("products")
//                 .deleteOne({_id: new mongodb.ObjectId(prodId)})
//                 .then(result => {
//                     console.log('deleted!!')
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 })
//     }
// }

// module.exports = Product;


//WORKING WITH SEQUELIZE

// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Product  = sequelize.define('products',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey: true
//     },
//     title:Sequelize.STRING,
//     price:{
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     imageUrl:{
//         type: Sequelize.STRING,
//         allowNull:false,
//     },
//     description:{
//         type: Sequelize.STRING,
//         allowNull:false
//     },
//     createdAt:{
//        type: Sequelize.DATE
//     },
// });




// // WORKING WITH RAW MYSQL DATABASE
// const db =  require('../util/database');

// const Cart = require('./carts.model');
// module.exports = class Product {
//     constructor(id,title,imageUrl,price,description){
//         this.id= id;
//         this.title = title;
//         this.imageUrl  = imageUrl;
//         this.price  =  price;
//         this.description = description;
//     }
    
//     save(){
//      return db.execute('INSERT INTO products (title,price,description,imageUrl) VALUES (?,?,?,?)',
//      [this.title,this.price,this.description,this.imageUrl]);
//     }

//     static deleteById(id){
       
//     }

//     static fetchAll(){
//       return db.execute('SELECT * FROM products');
//     }

//     static findById(id){
//         return db.execute('SELECT * FROM products WHERE products.id=?',[id]);
//     }
// }


//OLD CODE FETCHING AND SAVING TO FILE project.json
// const Cart = require('./carts.model');
// const fs = require('fs');
// const path = require('path');
// const p = path.join(path.dirname(process.mainModule.filename), 'data','product.json');

// const getProductsFromFile = (cb) => {
//     if (typeof cb != "function") return 'not a function'
//         fs.readFile(p, (err, fileContent)=>{
//             if(err){
//               cb([]);
              
//             }else{
//              cb(JSON.parse(fileContent));

//             }
//         });
// }

// module.exports = class Product {
//     constructor(id,title,imageUrl,price,description){
//         this.id= id;
//         this.title = title;
//         this.imageUrl  = imageUrl;
//         this.price  =  price;
//         this.description = description;
//     }
    
//     save(){
//         getProductsFromFile(products => {
//             if(this.id){
//                 const existingProductIndex = products.findIndex(prod => prod.id === this.id);
//                 const updateProducts = [...products];
//                 updateProducts[existingProductIndex] = this;
//                 fs.writeFile(p, JSON.stringify(updateProducts), (err) => {
//                     console.log(err)
//                 })
//             }else{
//                 this.id = Math.random().toString();
//                 products.push(this);
//                 fs.writeFile(p, JSON.stringify(products), (err) => {
//                     console.log(err)
//                 });
//             }
//         });
        
       
//     }

//     static deleteById(id){
//         getProductsFromFile(products => {
//             const singleProduct = products.find(prod => prod.id === id);
//             const updateProducts = products.filter(prod => prod.id !== id);
//             console.log(updateProducts,'updateProducts')
//             fs.writeFile(p, JSON.stringify(updateProducts), (err) => {
//                 console.log(err)
//                 if(!err){
//                    Cart.deleteProduct(id,singleProduct.price);
//                 }
//             })
            
//         });
//     }

//     static fetchAll(cb){
//         getProductsFromFile(cb)
//     }

//     static findById(id, cb){
//         getProductsFromFile(products => {
//             const product = products.find(p => p.id === id);
//             cb(product);
//         })
//     }
// }