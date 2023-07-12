import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
    name : {
        type:String,
        required:true,
        unique:true
    },
    slug:{
        type:String,
        lowercase:true
    }
});

export default mongoose.model('Category',categorySchema);

/* 
Note:- slug library is installed to add "-" in name when there is space in the
name it is used because it helps us to improve seo of the website.
*/
