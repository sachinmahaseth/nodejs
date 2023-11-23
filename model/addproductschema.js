var mongoose = require('mongoose');

const productSchema =new mongoose.Schema({
    productname:{
        type:String,
        // required:true
    },
    productdetail:{
        type:String,
        // required:true
    },
    productprice:{
        type:String,
        // required:true
    },
    productimage:{
        type:String,
        // required:true
    },
})

const addProduct =new mongoose.model('addproduct',productSchema);
module.exports = addProduct;