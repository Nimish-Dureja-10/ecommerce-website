import categoryModel from "../models/categoryModel.js";
import slugify from "slugify"

export const createcategoryController = async (req,res) => {
    try {
        const {name} = req.body;
        if(!name){
            return res.status(401).send({
                success:false,
                message:"Name is required"
            });
        }
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(500).send({
                success:true,
                message:"Category Already Exist"
            });
        }
        const category = await new categoryModel({name,slug:slugify(name)}).save();
        res.status(201).send({
            success:true,
            message:"New Category Created",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error in Category"
        });
    }
};

//update category
export const updateCategoryController = async (req,res) => {
    try {
    const {name} = req.body;
    const {id} = req.params;
    const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
    res.status(200).send({
        success:true,
        message:"Category Updated Successfully",
        category
    })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message : "Error in Updating category",
            error
        });
    }
};

//get all category
export const categoryController = async (req,res) => {
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:"All Categories",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting all categories",
            error
        })
    }
};


export const singleCategoryController = async (req,res) => {
    try {
        const category = await categoryModel.findOne({slug:req.params.slug});
        res.status(200).send({
            success:true,
            message:"Got Single Category Successfully",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting category"
        })
    }
};

export const deleteCategoryController = async (req,res) => {
    try {
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"Category Deleted Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error In Deleting Category",
            error
        })
    }
}