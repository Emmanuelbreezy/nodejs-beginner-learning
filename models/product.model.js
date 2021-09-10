//WORKING WITH SEQUELIZE

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product  = sequelize.define('products',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey: true
    },
    title:Sequelize.STRING,
    price:{
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl:{
        type: Sequelize.STRING,
        allowNull:false,
    },
    description:{
        type: Sequelize.STRING,
        allowNull:false
    },
    createdAt:{
       type: Sequelize.DATE
    },
});

module.exports = Product;


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