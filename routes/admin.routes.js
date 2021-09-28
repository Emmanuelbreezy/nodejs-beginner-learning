const path = require('path');
const express = require("express");
const rootDir = require('../util/path')
const adminController = require('../controllers/admin.controller');
const isAuth = require('../middleware/is-auth.middleware');
const router = express.Router();

 router.get('/add-product',isAuth,adminController.getAddProduct);
 router.get('/edit-product/_update/:productId',isAuth,adminController.getEditProduct);
 router.get('/all-products',isAuth,adminController.getAllProducts);

 router.post('/product',isAuth,adminController.postAddProduct);
 router.post('/edit-product/',isAuth,adminController.postEditProduct);

 router.delete('/delete-product/:productId',isAuth,adminController.deleteProduct);

module.exports = router;

