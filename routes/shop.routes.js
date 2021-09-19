const path = require('path');
const express = require("express");
const rootDir = require('../util/path')
const shopController = require('../controllers/shop.controller');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products',shopController.getProducts);
// router.get('/product/_list/:productId',shopController.getProduct);
// router.get('/cart',shopController.getCart);

// // router.get('/checkout',shopController.getCheckout);
// router.get('/order',shopController.getOrders);

// router.post('/create-order',shopController.postOrder);
// router.post('/cart',shopController.postCart);
// router.post('/cart-delete-item',shopController.postCartDelete);

module.exports = router;