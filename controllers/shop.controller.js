const fs = require('fs');
const path = require('path');
const stripe = require('stripe')('sk_test_3S58yh2AyvZM2goVGn5jzRbL00tjZDPy2s');
const pdfDocument = require('pdfkit');

const Product = require('../models/product.model');
//const Cart = require('../models/carts.model');
const Order = require('../models/order.model');

const ITEMS_PER_PAGE = 2;

  exports.getIndex = (req,res,next) => {
      Product.find()
            .then(products => {
              console.log(req.session.isLoggedIn,'[]');
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
    const page = +req.query.page || 1;  // turn the return string to number '1' to 1
    let totalItems;
    // monogoose
    Product.find().countDocuments().then(numProducts => {
         totalItems = numProducts;
           return Product.find().skip((page - 1) * ITEMS_PER_PAGE)
                          .limit(ITEMS_PER_PAGE)
            }).then(products => {
                res.render('shop/product-list',{
                prods: products,
                pageTitle:'All Products',
                path:'/products',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
                });
            }).catch(err=>{
                console.log(err);
            });
            
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
    // mongoose 
      Product.findById(prodId)
        .then(product=>{
          var disprice = product.price - 0.5;
          disprice.toFixed(2);
          res.render('shop/product-detail',{
            pageTitle:product.title,
            product: product,
            path:'/products',
            discountprice: disprice,
          });
        })
        .catch(err=>{
          console.log(err);
        })
   }


 exports.getCart = (req,res,next) => {
      req.user
      .populate('cart.items.productId')
      .then(user => {
          const products = user.cart.items;
          console.log(products,'---');
          res.render('shop/cart',{
          pageTitle:'Your Cart',
          path:'/cart',
          products:products,
        });
      })
      .catch(err=> console.log(err))
  
  }
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
  //``}

  exports.getInvoice = (req,res,next) => {
     const orderId = req.params.orderId;
     Order.findById(orderId).then(order => {
       if(!order){
          return next(new Error('No order found'));
       }
      //  if(order.user.userId.toString() === req.user._id.toString()){
      //    return next(new Error('Unauthorized'));
      //  }
       const invoicename = 'invoice-' + orderId + '.pdf';
       const invoicePath = path.join('protectedData','invoices', invoicename);

       const pdfDoc = new pdfDocument();
       res.setHeader('Content-Type','application/pdf');
       res.setHeader('Content-Disposition', 
         'inline;filename="'+ invoicename + '"');
       pdfDoc.pipe(fs.WriteStream(invoicePath));
       pdfDoc.pipe(res);
       pdfDoc.fontSize(26).text('Invoice',{
         underline: true
       })

       pdfDoc.text('.....................................................');
       let totalPrice = 0;
       order.products.forEach(prod => {
         totalPrice += prod.quantity * prod.product.price;
         pdfDoc.fontSize(14).text(prod.product.title + '-' + prod.quantity + 'x' + '$' + prod.product.price);
       });
      
       pdfDoc.text('  ');
       pdfDoc.text('  ');
       pdfDoc.text('  ');
       pdfDoc.fontSize(23).text('Total Price: $' + totalPrice);
       pdfDoc.end();

      //  fs.readFile(invoicePath, (err,data) => {
      //    if(err){
      //     return next();
      //    }
      //   res.setHeader('Content-Type','application/pdf');
      //   res.setHeader('Content-Disposition', 'attachment;filename="'+ invoicename + '"');
      //   res.send(data);
      //  })


      // const file = fs.createReadStream(invoicePath)
      // res.setHeader('Content-Type','application/pdf');
      // res.setHeader('Content-Disposition', 
      //   'inline;filename="'+ invoicename + '"');
      // file.pipe(res);

     }).catch(err => next(err));

    
  }

  exports.getCheckout = (req,res,next) => {
    let products;
    let total;
    req.user
    .populate('cart.items.productId')
    .then(user => {
        products = user.cart.items;
        total = 0;
        products.forEach(p => {
          total += p.quantity * p.productId.price
        });
        return stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: products.map(p => {
             return {
                name: p.productId.title,
                description: p.productId.description,
                amount: p.productId.price * 100,
                currency: 'usd',
                quantity: p.quantity
             }
          }),
          success_url:req.protocol + '://' + req.get('host') + '/checkout/success',
          cancel_url:req.protocol + '://' + req.get('host') + '/checkout/cancel',
        });
    })
    .then(session => {
      res.render('shop/checkout',{
        pageTitle:'Checkout',
        path:'/checkout',
        products: products,
        totalSum: total,
        sessionId: session.id
      });
    })
    .catch(err=> console.log(err))
  }
  

  exports.getCheckoutSuccess = (req,res,next) => {
  req.user
  .populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items.map(i => {
      return {quantity: i.quantity, product: {...i.productId._doc}}
    })
    const order = new Order({
      user:{
        email: req.user.email,
        userId: req.user
      },
      products: products
    });
    return order.save();
  })
  .then(result => {
    return req.user.clearCart();
  })
  .then(() => {
    res.redirect('/orders')
  })
 .catch(err => console.log(err));    
}








  exports.postCart = (req,res,next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
           .then(product => {
             return req.user.addToCart(product);
            })
            .then(result => {
              console.log(result);
              res.redirect('/cart');
           })
    // let newQuantity = 1;
    // let fetchCart;
    // req.user.getCart()
    //         .then(cart => {
    //           console.log(cart,'[00000000]')
    //           fetchCart = cart;
    //           return cart.getProducts({where: {id: prodId}});
    //         })
    //         .then(products => {
    //           let product;
    //           if(products.length > 0){
    //             product = products[0];
    //           }
    //           if(product){
    //             const oldQuantity = product.cartItem.quantity;
    //             newQuantity = oldQuantity + 1;
    //             return product;
    //           }
    //           return Product.findByPk(prodId)
    //         })
    //         .then((product) => {
    //           return fetchCart.addProduct(product,
    //             { through: {quantity: newQuantity} 
    //           })
    //         })
    //         .then(()=>{
    //           res.redirect('/cart');
    //         })
    //         .catch(err=> console.log(err))
   
}


exports.postCartDelete = (req,res,next) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId)
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

//DONT EXIST ANYMORE
// exports.postOrder = (req,res,next) => {
//   req.user
//   .populate('cart.items.productId')
//   .then(user => {
//     const products = user.cart.items.map(i => {
//       return {quantity: i.quantity, product: {...i.productId._doc}}
//     })
//     const order = new Order({
//       user:{
//         email: req.user.email,
//         userId: req.user
//       },
//       products: products
//     });
//     return order.save();
//   })
//   .then(result => {
//     return req.user.clearCart();
//   })
//   .then(() => {
//     res.redirect('/order')
//   })
//  .catch(err => console.log(err));

         
//}

exports.getOrders = (req,res,next) => {
  Order.find({"user.userId": req.user._id})
          .then(orders => {
            console.log(orders,']')
              res.render('shop/orders',{
                pageTitle:'Your Orders',
                path:'/orders',
                orders:orders,
              })
          })
          .catch(err => console.log(err))
  
}




