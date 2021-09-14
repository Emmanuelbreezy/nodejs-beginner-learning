const Product = require('../models/product.model');
//const Cart = require('../models/carts.model');
//const Order = require('../models/order.model');


  exports.getIndex = (req,res,next) => {
      Product.fetchAll()
            .then(products => {
               res.render('shop/index',{
                prods: products,
                pageTitle:'Shop',
                path:'/',
                });
            }).catch(err=>{
                console.log(err);
            });

    // Product.fetchAll().then(([rows,fieldData])=>{
    //   res.render('shop/index',{
    //     prods: rows,
    //     pageTitle:'Shop',
    //     path:'/',
    //     });
    // }).catch(err=>{
    //   console.log(err)
    // });
     
  }

  exports.getProducts = (req,res,next) => {
     Product.fetchAll()
            .then(products => {
                res.render('shop/product-list',{
                prods: products,
                pageTitle:'All Products',
                path:'/products',
                });
            }).catch(err=>{
                console.log(err);
            })
    // Product.fetchAll().then(([rows,fieldData])=>{
    //   res.render('shop/product-list',{
    //     prods: rows,
    //     pageTitle:'All Products',
    //     path:'/products',
    //     });
    // }).catch(err=>{
    //   console.log(err)
    // });
  }

  // exports.getProduct = (req,res,next) => {
  //  const prodId = req.params.productId;
  //   Product.findById(prodId)
  //     .then(product =>{
  //     var disprice = product.price - 0.5;
  //     disprice.toFixed(2);
  //   })
  //   .catch(err=>{
  //     console.log(err)
  //   })

  // }

  exports.getProduct = (req,res,next) => {
    const prodId = req.params.productId;
      Product.findById(prodId)
        .then(product=>{
          var disprice = product.price - 0.5;
          disprice.toFixed(2);
          res.render('shop/product-detail',{
            pageTitle:product.title,
            product: product,
            path:'/products',
            discountprice: disprice
          });
        })
        .catch(err=>{
          console.log(err);
        })
   }


  exports.getCart = (req,res,next) => {
      req.user.getCart()
      .then(cart => {
        return cart.getProducts()
                  .then(product => {
                    console.log(product,' ');
                      res.render('shop/cart',{
                      pageTitle:'Your Cart',
                      path:'/cart',
                      products:product
                    });
                  })
                  .catch(err=> console.log(err))
      })
      .catch(err=> console.log(err))
    //WITHOUT DATABASE
    // Cart.getCart(cart =>{
    //   Product.fetchAll(products => {
    //     const cartProduct= [];
    //     for(product of products){
    //       const cartProductData = cart.products.find(prod => prod.id === product.id)
    //       if(cartProductData){
    //            cartProduct.push({productData:product,qty:cartProductData.qty});
    //       }
    //     }
    //     res.render('shop/cart',{
    //       pageTitle:'Your Cart',
    //       path:'/cart',
    //       products:cartProduct
    //     });
    //   });

    // });
  }

  exports.postCart = (req,res,next) => {
    const prodId = req.body.productId;
    let newQuantity = 1;
    let fetchCart;
    req.user.getCart()
            .then(cart => {
              console.log(cart,'[00000000]')
              fetchCart = cart;
              return cart.getProducts({where: {id: prodId}});
            })
            .then(products => {
              let product;
              if(products.length > 0){
                product = products[0];
              }
              if(product){
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
              }
              return Product.findByPk(prodId)
            })
            .then((product) => {
              return fetchCart.addProduct(product,
                { through: {quantity: newQuantity} 
              })
            })
            .then(()=>{
              res.redirect('/cart');
            })
            .catch(err=> console.log(err))
   
    // Product.findById(prodId,(product)=>{
    //   Cart.addProduct(prodId, product.price)
    // })
    // res.redirect('/cart');
}


exports.postCartDelete = (req,res,next) => {
  const prodId = req.body.productId;
  req.user.getCart()
          .then(cart => {
              return cart.getProducts({where:{ id: prodId }});
          })
          .then(products => {
              const product = products[0];
              return product.cartItem.destroy();
          })
          .then(result =>{
            res.redirect('/cart');
          })
          .catch(err=>{
            console.log(err);
          })
  // Product.findById(prodId,(product)=>{
  //   Cart.deleteProduct(prodId, product.price)
  //   res.redirect('/cart'); 
  // });
}

exports.postOrder = (req,res,next) => {
  let fetchedCart;
  req.user.getCart()
          .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts();
          })
          .then((products) =>{
             return  req.user.createOrder()
             .then(order => {
              return order.addProducts(products.map(product => {
                 product.orderItem = { quantity: product.cartItem.quantity};
                 return product;
               }))
               .catch()
             })
          })
          .then(result => {
            return fetchedCart.setProducts(null);
          })
          .then(result => {
              res.redirect('/order')
          })
          .catch(err => console.log(err))
}

exports.getOrders = (req,res,next) => {
  req.user.getOrders( {include: ['products']})
          .then(orders => {
              res.render('shop/orders',{
                pageTitle:'Your Orders',
                path:'/orders',
                orders:orders
              })
          })
          .catch(err => console.log(err))
  
}



exports.getCheckout = (req,res,next) => {
  res.render('shop/checkout',{
    pageTitle:'Checkout',
    path:'/checkout',
  })
}

