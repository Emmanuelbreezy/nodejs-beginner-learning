const path = require('path');
const express = require("express");
const rootDir = require('../util/path')
const shopController = require('../controllers/shop.controller');
const isAuth = require('../middleware/is-auth.middleware');


const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products',shopController.getProducts);
router.get('/product/_list/:productId',shopController.getProduct);
router.get('/cart',isAuth,shopController.getCart);

router.get('/orders',isAuth,shopController.getOrders);
router.get('/orders/:orderId',isAuth,shopController.getInvoice);
router.get('/checkout',isAuth,shopController.getCheckout);
router.get('/checkout/success',isAuth,shopController.getCheckoutSuccess);
router.get('/checkout/cancel',isAuth,shopController.getCheckout);


// router.post('/create-order',isAuth,shopController.postOrder);
router.post('/addcart',isAuth,shopController.postCart);
router.post('/cart-delete-item',isAuth,shopController.postCartDelete);

module.exports = router;