const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    contact_name:{
        type: String,
        required:true
    },
    contact_number:{
        type: Number,
        required:true
    },
    contact_email:{
        type:String,
        required:true
    },
    contact_message:{
        type: String,
        required:true
    },


});

const contactUser = new mongoose.model('viewcontacts', contactSchema);
module.exports = contactUser;