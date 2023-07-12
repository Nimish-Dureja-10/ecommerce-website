import express from "express";
import {registerController,loginController,forgotPasswordController,testController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController, getAllUserController} from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
//Router object

const router = express.Router();

//routing
//register an user - post
router.post("/register",registerController);
//login an user -post
router.post("/login",loginController);

//Forgot Password - post
router.post("/forgotpassword",forgotPasswordController);

//protected user route
router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
});

//protected admin route
router.get("/admin-auth",requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
});

//update profile route
router.put("/profile",requireSignIn,updateProfileController);

//user orders route
router.get("/orders",requireSignIn,getOrdersController);

//all orders route
router.get("/all-orders",requireSignIn,isAdmin,getAllOrdersController);

//orders status update
router.put("/order-status/:orderId",requireSignIn,isAdmin,orderStatusController);

//get all users
router.get("/all-users",requireSignIn,isAdmin,getAllUserController);

//test routes
router.get("/test",requireSignIn,isAdmin,testController);

export default router;