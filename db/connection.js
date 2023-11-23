const mongoose = require('mongoose');
var conn = mongoose.connect('mongodb+srv://sachinmahaseth200319:sachinmahaseth@cluster0.n4wflrg.mongodb.net/demoproject?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
.then(() => console.log('connection successfully..'))
.catch((err) => console.log(err));


module.exports = conn; 