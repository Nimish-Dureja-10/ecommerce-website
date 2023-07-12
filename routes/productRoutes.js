import express from "express";
import { createProductController, deleteProductController, getProductController, getSingleProductController, productPhotoController, updateProductController, productFiltersController, productCountController, productListController, searchProductController, relatedProductController, productCategoryController, braintreeTokenController, braintreePaymentController } from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import formidable from "express-formidable"

const router = express.Router();

//routes
//create product
router.post("/create-product",requireSignIn,isAdmin,formidable(),createProductController);

//get all products
router.get("/get-product",getProductController)

//get single products 
router.get("/get-product/:slug",getSingleProductController);

//get product photo
router.get('/product-photo/:pid',productPhotoController);

//delete product
router.delete('/delete-product/:pid',deleteProductController);

//update product
router.put("/update-product/:pid",requireSignIn,isAdmin,formidable(),updateProductController);

//filter products
router.post("/product-filters",productFiltersController);

//pagination of products
//count products
router.get("/product-count",productCountController);

//product per page
router.get("/product-list/:page",productListController);

//serch through input box
router.get("/search/:keyword", searchProductController);

//similar products
router.get("/related-product/:pid/:cid",relatedProductController);

//category wise products
router.get("/product-category/:slug",productCategoryController);

//payment routes
//get token
router.get("/braintree/token",braintreeTokenController);

//payment
router.post("/braintree/payment",requireSignIn,braintreePaymentController);

export default router;