const fileHelper = require('../util/file');
const { validationResult } = require('express-validator');
const Product = require('../models/product.model');


exports.getAddProduct = (req,res,next) => {
    res.render('admin/add-product',{
      pageTitle:'Add Product',
      path:'/admin/add-product',
      hasError:false,
      product:{
          title:"",
          price:"",
          description:"",
          imageUrl:"",
      },
      validationError: []
    });
}

exports.getEditProduct = (req,res,next) => {
    const editMode = req.query.edit;
    if(!editMode) return res.redirect('/')
    const prodId = req.params.productId;
    //req.user.getAllProducts({where: {id:prodId}})
   Product.findById(prodId)
         .then(product =>{
            // const _product = product[0];
            if(!product){
                return res.redirect('/')
            } 
            res.render('admin/edit-product',{
            pageTitle:'Edit Product',
            path:'/admin/edit-product',
            product:product,
            isAuthenticated: req.session.isLoggedIn,
            csrfToken: req.csrfToken()
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}


exports.getAllProducts = (req,res,next) => {
  Product.find({
      userId: req.user._id
      })
        //.select('title price -_id')
        //.populate('userId','name')
        .then(products => {
            res.render('admin/all-products',{
            prods: products,
            pageTitle:'Admin Products',
            path:'/admin/all-products',
            });
        }).catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
   
  }




exports.postAddProduct = (req,res,next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    console.log(image,' ',req.file,'ooo')
    if(!image){
        return res.status(422).render('admin/add-product',{
            pageTitle:'Add Product',
            path:'/admin/add-product',
            hasError:true,
            product:{
                title:title,
                price:price,
                description:description,
            },
            errorMessage: 'Attached file is not an image',
            validationError: []
          });
    }
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('admin/add-product',{
            pageTitle:'Add Product',
            path:'/admin/add-product',
            hasError:true,
            product:{
                title:title,
                price:price,
                description:description,
                imageUrl:imageUrl,
            },
            validationError: []
          });
    }
    // from mongoose
    
    const imageUrl = image.path;

    const product = new Product({
        title:title,
        price:price,
        description:description,
        imageUrl:imageUrl,
        userId: req.user
    })
    product.save()
         .then(()=>{
            // return res.status(422).
            res.redirect('/admin/all-products/')
         })
        .catch(err=>{
            //console.log(err);
            //res.redirect('/500')
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    
    // USING SEQUELIZE TO MANAGE CREATE PRODUCT AND INSERT THE USER ID AUTOMATIC
    // req.user.createProduct({
    //     title: title,
    //     price:price,
    //     imageUrl:imageUrl,
    //     description:description,
    // })
    //USING MONGODB TO MANAGE CREATE PRODUCT
   
     //OLD WAY OF CREATING PRODUCT WITHOUT USER ID
    // Product.create({
    //     title: title,
    //     price:price,
    //     imageUrl:imageUrl,
    //     description:description,
    // })
    // .then(()=>{
    //     res.redirect('/')
    // })
    //  .catch(err=>{
    //      console.log(err);
    //  });
     //without sequelize
    // const product = new Product(null,title,imageUrl,price,description);
    //  product
    //  .save().then(()=>{})
    //  .catch(err=>{
    //      console.log(err);
    //  })
}

exports.postEditProduct = (req,res,next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const image = req.file;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    
    // const product = new Product(
    //                 updatedTitle,
    //                 updatedPrice,
    //                 updatedDescription,
    //                 updatedImageUrl,
    //                 prodId
    //         );
    // mongoose
    


    Product.findById(prodId).then(product => {
        if(product.userId.toString() !== req.user._id.toString()){
            return res.redirect('/')
        }else{
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            if(image){
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = image.path;
              }
            return product.save().then(resut=>{
                console.log('UPDATED')
                res.redirect('/admin/all-products')
            })
        }
    })
    
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);  
    })
    // const updatedProduct = new Product(prodId,updatedTitle,updatedImageUrl,updatedPrice,updatedDescription);
    // updatedProduct.save();
}


exports.deleteProduct = (req,res,next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
          .then(product => {
              if(!product){
                  return next(new Error('Product not found'));
              }
            fileHelper.deleteFile(product.imageUrl);
           return Product.deleteOne({
                _id:prodId, userId:req.user._id
            });
          }).then(result=>{
                res.status(200).json({message:"Success"});
            })
            .catch(err=>{
               res.status(500).json({message:"Deleting Failed"});
            })
    //Product.findByPk(prodId)
        // .then(product => {
        //     console.log(product,'prod');
        //     return product.destroy();
        // })
        
}



