var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

const signupSchema = new mongoose.Schema({
    fname :{
        type:String,
        required:true
    },
    lname :{
        type:String,
        required:true
    },
    emailid :{
        type:String,
        required:true
    },
    createpass :{
        type:String,
        required:true
    },
    confirmpass :{
        type:String,
        required:true
    },
})

signupSchema.pre('save', function(next){
    if(!this.isModified('createpass')){
        return next();
    }
    this.password = bcrypt.hashSync(this.createpass, 10);
    next();
});
signupSchema.methods.comparePassword = function(plaintext , callback){
    return callback(null , bcrypt.compareSync(plaintext, this.createpass));
};


const signupUser =new mongoose.model('signup', signupSchema);
module.exports = signupUser;