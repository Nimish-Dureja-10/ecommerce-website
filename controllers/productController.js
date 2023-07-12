import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from 'fs';
import slugify from "slugify";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

export const createProductController = async (req,res) => {
    try {
        const {name,slug,description,price,quantity,category,shipping} = req.fields;
        const {photo} = req.files;
        //validation
        switch(true){
            case !name:
                return res.status(500).send({
                    error:"Name is required"
                });
            case !description:
                return res.status(500).send({
                    error:"Description is required"
                });
            case !price:
                return res.status(500).send({
                    error:"Price is required"
                });
            case !quantity:
                return res.status(500).send({
                    error:"Quantity is required"
                });
            case !category:
                return res.status(500).send({
                    error:"Category is required"
                });
            case !photo && photo.size > 2000000:
                return res.status(500).send({
                    error:"Photo is required and should be less then 2mb"
                });
        }
        const products = new productModel({...req.fields,slug:slugify(name)});
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"Products Created Successfully",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Failed to Create Product"
        });
    }
};


//get all products
export const getProductController = async (req,res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1});
        res.status(200).send({
            success:true,
            totalCount:products.length,
            message :  "All Products",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Failed To Fetch Products",
            error
        });
    }
};

//get single product
export const getSingleProductController = async (req,res) => {
    try {
        const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category");
        res.status(200).send({
            success:true,
            message:"Product Detail",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Failed To Fetch Product Detail",
            error    
        })
    }
};

//get photo of product
export const productPhotoController = async (req,res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if(product.photo.data){
            res.set("Content-type",product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Failed To Fetch Image",
            error
        });
    }
};

//delete product
export const deleteProductController = async (req,res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success:true,
            message:"Product Deleted Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Failed To Delete Product",
            error
        });
    }
};

//update product
export const updateProductController = async (req,res) => {
    try {
        const {name,slug,description,price,quantity,category,shipping} = req.fields;
        const {photo} = req.files;
        //validation
        switch(true){
            case !name:
                return res.status(500).send({
                    error:"Name is required"
                });
            case !description:
                return res.status(500).send({
                    error:"Description is required"
                });
            case !price:
                return res.status(500).send({
                    error:"Price is required"
                });
            case !quantity:
                return res.status(500).send({
                    error:"Quantity is required"
                });
            case !category:
                return res.status(500).send({
                    error:"Category is required"
                });
            case photo && photo.size > 2000000:
                return res.status(500).send({
                    error:"Photo is required and should be less then 2mb"
                });
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid,{
            ...req.fields,slug:slugify(name)},{new:true}
        );
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"Products Created Successfully",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Failed to Update Product"
        });
    }
};

//filter product controller
export const productFiltersController = async (req,res) => {
    try {
        const {checked,radio} = req.body;
        let args = {};
        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = { $gte : radio[0], $lte : radio[1] };
        const products = await productModel.find(args);
        res.status(200).send({
            success:true,
            products
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Failed To Fetch Filtered Products"
        })
    }
};

//pagination for products
//product count controller
export const productCountController = async (req,res) => {
    try {   
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success:true,
            total,
            message:"Total Count Of Products"
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Error in counting products"
        });
    }
};

export const productListController = async (req,res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({}).select("-photo").skip((page-1) * perPage).limit(perPage).sort({createdAt:-1});
        res.status(200).send({
            success:true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Failed to get page",
            error
        })
    }
};

//search product controller
export const searchProductController = async (req,res) => {
    try {
        const {keyword} = req.params;
        const result = await productModel.find({
            $or : [
                {name:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}}
            ]
        }).select("-photo");
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Failed to search product",
            error
        });
    }
};

export const relatedProductController = async (req,res) => {
    try {
        const {pid,cid} = req.params;
        const products = await productModel.find({
            category:cid,
            _id:{$ne:pid}
        }).select("-photo").limit(3).populate("category");
        res.status(200).send({
            success:true,
            products
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Failed to fetch similar products"
        });
    }
};

//product category controller
export const productCategoryController = async (req,res) =>{
    try {
        const category = await categoryModel.findOne({slug:req.params.slug});
        const products = await productModel.find({category}).populate("category");
        res.status(200).send({
            success:true,
            message:"Products in this Category",
            products,
            category
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Failed to fetch products in selected category",
            error
        })
    }
};

//payment gateway api
//get token from braintree
export const braintreeTokenController = async (req,res) => {
    try {
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err);
            }else{
                res.status(200).send(response);
            }
        })
    } catch (error) {
        console.log(error);
    }
};

//payment on braintree
export const braintreePaymentController = async (req,res) => {
    try {
        const {cart,nonce} = req.body;
        let total = 0;
        cart.map((i) => {total += i.price});
        let newTranscation = gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            }
        },function(error,result){
            if(result){
                const order = new orderModel({
                    products: cart,
                    payment : result,
                    buyer : req.user._id
                }).save();
                res.json({ok:true});
            }else{
                res.status(500).send(error);
            }
        });
    } catch (error) {
        console.log(error);
    }
};