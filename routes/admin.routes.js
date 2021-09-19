const path = require('path');
const express = require("express");
const rootDir = require('../util/path')
const adminController = require('../controllers/admin.controller');
const router = express.Router();

 router.get('/add-product',adminController.getAddProduct);
// router.get('/edit-product/_update/:productId',adminController.getEditProduct);
// router.get('/all-products',adminController.getAllProducts);

 router.post('/product',adminController.postAddProduct);
// router.post('/edit-product/',adminController.postEditProduct);
// router.post('/delete-product',adminController.postDeleteProduct);
module.exports = router;