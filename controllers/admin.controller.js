const Product = require('../models/product.model');


exports.getAddProduct = (req,res,next) => {
    res.render('admin/add-product',{
      pageTitle:'Add Product',
      path:'/admin/add-product',
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
            if(!product) return res.redirect('/')
            res.render('admin/edit-product',{
            pageTitle:'Edit Product',
            path:'/admin/edit-product',
            product:product
            });
        })
        .catch(err => {
            console.log(err);
        })
}


exports.getAllProducts = (req,res,next) => {
  Product.fetchAll()
            .then(products => {
                res.render('admin/all-products',{
                prods: products,
                pageTitle:'Admin Products',
                path:'/admin/all-products',
                });
            }).catch(err=>{
                console.log(err);
            })
   
  }




exports.postAddProduct = (req,res,next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    
    // USING SEQUELIZE TO MANAGE CREATE PRODUCT AND INSERT THE USER ID AUTOMATIC
    // req.user.createProduct({
    //     title: title,
    //     price:price,
    //     imageUrl:imageUrl,
    //     description:description,
    // })
    //USING MONGODB TO MANAGE CREATE PRODUCT

    const product = new Product(title,price,description,imageUrl)
    product.save()
         .then(()=>{
            res.redirect('/admin/all-products')
         })
        .catch(err=>{
            console.log(err);
        });

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
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    
    const product = new Product(
                    updatedTitle,
                    updatedPrice,
                    updatedDescription,
                    updatedImageUrl,
                    prodId
            );
    product.save()
    .then(resut=>{
        console.log('UPDATED')
        res.redirect('/admin/all-products')
    })
    // const updatedProduct = new Product(prodId,updatedTitle,updatedImageUrl,updatedPrice,updatedDescription);
    // updatedProduct.save();
}


// exports.postDeleteProduct = (req,res,next) => {
//     const prodId = req.body.productId;
//     //Product.deleteById(prodId);
//     Product.findByPk(prodId)
//         .then(product => {
//             console.log(product,'prod');
//             return product.destroy();
//         })
//         .then(result=>{
//             res.redirect('/admin/all-products');
//         })
//         .catch(err=>{
//             console.log(err);
//         })
// }



