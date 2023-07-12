import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js"
import {hashPassword,comparePassword} from "../helpers/authHelper.js"
import JWT from "jsonwebtoken";

//REGISTER ROUTE USING METHOD POST
export const registerController = async (req,res) =>{
    try{
        const {name,email,password,phone,address,answer} = req.body;
        //validations
        if(!name){
            return res.send({message:"Name is Required"});
        }
        if(!email){
            return res.send({message:"Email is Required"});
        }
        if(!password){
            return res.send({message:"Password is Required"});
        }
        if(!phone){
            return res.send({message:"Phone No. is Required"});
        }
        if(!address){
            return res.send({message:"Address is Required"});
        }
        if(!answer){
            return res.send({message:"Answer is Required"});
        }
        //check existing user
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(200).send({
                success:true,
                message:"Alredy Registered Please Login"
            })
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save user
        const user = await new userModel({name,email,phone,address,password:hashedPassword,answer}).save();
        
        res.status(201).send({
            success:false,
            message:"User Registered Successfully",
            user
        });


    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Registeration",
            error
        })
    }
};

//LOGIN ROUTE USING METHOD POST
export const loginController = async (req,res) => {
    try {
        const {email,password} = req.body;
        //validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid Email or Password"
            });
        }
        //check user
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email not found"
            });
        }
        const match = await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Incorrect Password"
            });
        }
        //create token 
        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'3d'});
        res.status(200).send({
            success:true,
            message:"Login Successful",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role
            },
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success :false,
            message :"Failed to Login",
            error
        });
    }
};

//forgot controller
export const forgotPasswordController = async (req,res) => {
    try {
        const {email,answer,newPassword} = req.body;
        if(!email){
            res.status(500).send({message:"Email is required"});
        }
        if(!answer){
            res.status(500).send({message:"Answer is required"});
        }
        if(!newPassword){
            res.status(500).send({message:"New Password is required"});
        }
        //check
        const user = await userModel.findOne({email,answer});
        //validation 
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Wrong Email or Answer"
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success:true,
            message : "Password Reset Succesfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error
        });

    }
};

//update profile controller
export const updateProfileController = async (req,res) => {
    try {
        const {name,email,password,phone,address} = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        if(password && password.length < 6){
            return res.json({error:"Password is Required and it should be greater then 6 characters."})
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            name : name || user.name,
            email : email || user.email,
            password : hashedPassword || user.password,
            phone : phone || user.phone,
            address : address || user.address
        },{new:true});
        res.status(200).send({
            success:true,
            message:"User Profile Updated Successfully",
            updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message:"Failed to update user profile",
            error
        });
    }
};


//user orders controller
export const getOrdersController = async (req,res) => {
    try {
        const orders = await orderModel.find({buyer:req.user._id}).populate("products").populate("buyer");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error
        });
    }
};

//all orders controller
export const getAllOrdersController = async (req,res) => {
    try {
        const orders = await orderModel.find({}).populate("products").populate("buyer").sort({createdAt:"-1"});
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Failed to fetch all orders details",
            error
        });
    }
};

//order status controller
export const orderStatusController = async (req,res) =>{
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        const orders = await orderModel.findByIdAndUpdate(orderId,{status:status},{new:true});
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Failed to update order status",
            error
        });
    }
};

//get all user controller
export const getAllUserController = async (req,res) => {
    try {
        const users = await userModel.find({});
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Failed to Fetch Details of Users",
            error
        });
    }
};

//test controller
export const testController = (req,res) =>{
    return res.send("Protect route");
};