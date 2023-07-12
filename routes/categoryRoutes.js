import express from "express";
import { categoryController, createcategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js";
import {requireSignIn,isAdmin} from "../middleware/authMiddleware.js"

const router = express.Router();

//routes
//create category
router.post("/create-category",requireSignIn,isAdmin,createcategoryController);

//update category
router.put("/update-category/:id",requireSignIn,isAdmin,updateCategoryController);

//get all category
router.get("/get-category",categoryController);

//single category
router.get("/single-category/:slug",singleCategoryController);

//delete category
router.delete("/delete-category/:id",requireSignIn,isAdmin,deleteCategoryController)

export default router;