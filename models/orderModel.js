import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    products: [{
        type:mongoose.ObjectId,
        ref:"Products"
    }],
    payment:{},
    buyer:{
        type:mongoose.ObjectId,
        ref:"users"
    },
    status:{
        type:String,
        default:"Not Processed",
        enum:["Not Processed","Processing","Shipped","Delievered","Cancelled"]
    }
},{timestamps:true});

export default mongoose.model('Order',orderSchema);