    const express = require('express');

const router = express.Router();
const multer = require('multer');


var bcrypt = require('bcrypt');

const regitrationschema = require('../model/signupschema');
const addProductschema = require('../model/addproductschema');
const userContactSchema = require('../model/contactschema');


// const regitrationschema = require('./model/signupschema');

router.get('/', function (req, res) {

    res.render('index');
})

router.get('/shop', function (req, res) {
    res.render("shop");
})
router.get('/about', function (req, res) {
    res.render("about");
})
router.get('/services', function (req, res) {
    res.render("services");
})
router.get('/blog', function (req, res) {
    res.render("blog");
})
router.get('/contact', function (req, res) {
    res.render("contact");
})


router.get('/cart', async (req, res) => {
    try {
        const addData = await addProductschema.find({});
        res.render('cart', { addData: addData });
        console.log(addData);
    } catch (err) {
        console.log(err);
    }
})
router.get('/checkout', function (req, res) {
    res.render("checkout");
})
router.get('/done', function (req, res) {
    res.render("done");
})
router.get('/login', function (req, res) {
    res.render("login");
})

router.post('/login', async (req, res) => {
    var emailid = req.body.emailid;
    createpass = req.body.createpass;

    try {
        var user = await regitrationschema.findOne({ emailid: emailid })
            .exec();
        console.log(user);

        if (!user) {
            res.redirect('/login');
        }
        user.comparePassword(createpass, (error, match) => {
            if (!match) {
                res.redirect('/login')
            }
        });
        req.session.user = user;
        // res.render('/login');s
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
})






// *************************************
router.get('/packagedetail/:id', async (req, res) => {
    try {
        const addData = await addProductschema.findById(req.params.id);
        res.render('packagedetail', { addData: addData });
        console.log(addData);

    } catch (err) {
        console.log(err);
    }
})
////////// SIGN UP PAGE API  ////// 

router.get('/signup', function (req, res) {
    res.render("signup");
})

router.post('/signup', (req, res) => {
    var register = {
        fname: req.body.fname,
        lname: req.body.lname,
        emailid: req.body.emailid,
        createpass: req.body.createpass,
        confirmpass: req.body.confirmpass

    };
    var regpost = new regitrationschema(register);
    regpost.save()
        .then(() =>
            res.json('register succesfully'))
        .catch(err => res.status(404).json('error:' + err));

});





// DASHBOARD
router.get('/dashboard', (req, res) => {
    // if (req.session.user && req.cookies.user_sid) {
    //     res.render("dashboard/index");
    // } else {
    //     res.redirect('/login')
    // }
    res.render('dashboard')
})



// router.get('/dashboard' , function(req,res) {
//     if(req.session.user && req.cookies.user_id) {
//         user.find(function(err,data) {
//             if (err) {
//                 console.log(err);
//             }
//             else{
//                 res.render('dashboard' , {data:data});
//             }
//         });
//     }
//     else{
//         res.redirect('/login')
//     }
// });

// **********************************
router.get('/addproduct', function (req, res) {
    res.render("dashboard/addproduct");
})




// router.post('/addproduct', (req, res) => {
//     var addproducts = {
//         productname: req.body.productname,
//         productdetail: req.body.productdetail,
//         productprice: req.body.productprice,
//         productimage: req.file.filename,
//     };
//     var addpost = new addProductschema(addproducts);
//     addpost.save()
//         .then(() =>
//             res.json('product add successfully'))
//         .catch(err => res.status(404).json('error:' + err));
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload');
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
        // cb(null,uuidv4()+'-'+ Date.now() + path.extname(file.originalname)) // Appending

    }
});


const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpg', 'image/png', 'image/webp'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });


//add product

router.post('/addproduct', upload.single('productimage'), (req, res) => {
    var addproduct = {
        productname: req.body.productname,
        productdetail: req.body.productdetail,
        productprice: req.body.productprice,
        productimage: req.file.filename,
    };

    var addproductpost = new addProductschema(addproduct);
    addproductpost.save()
        .then(() => res.json('submit successfully'))
        .catch(err => res.status(400).json('error' + err))
});


// *******************************************************************
// *************************************************************



router.get('/viewregistration', async (req, res) => {
    try {
        const regData = await regitrationschema.find({});
        res.render('dashboard/viewregistration', { regData: regData });
        console.log(regData);
    } catch (err) {
        console.log(err);
    }
})

router.get("/delete/:id", async (req, res) => {
    try {
        const data = await regitrationschema.findByIdAndRemove(req.params.id);
        // res.redirect('./viewregistration')
        return res.redirect('http://localhost:3000/viewregistration')
    } catch (err) {
        console.log(err)
    }
})




router.get('/edit/:id', async (req, res) => {
    try {
        const editdata = await regitrationschema.findById(req.params.id);
        res.render('dashboard/editregistration', { editdata: editdata });
        console.log(editdata);
    } catch (err) {
        console.log(err)
    }
});


router.post('/edit/:id', async (req, res) => {
    try {
        let editupdate = {
            fname: req.body.fname,
            lname: req.body.lname,
            emailid: req.body.emailid,
            createpass: req.body.createpass,
            confirmpass: req.body.confirmpass
        }
        const data = await regitrationschema.findByIdAndUpdate(req.params.id, editupdate);
        // res.render('dashboard/viewcontact',{data:data});
        res.redirect('../viewregistration');
    } catch (err) {
        console.log(err);
    }
});





// ************************************************
// router.get('/viewproduct', function (req, res) {
//     res.render("dashboard/viewproduct");
// })

router.get('/viewproduct', async (req, res) => {
    try {
        const addData = await addProductschema.find({});
        res.render('dashboard/viewproduct', { addData: addData });
        console.log(addData);
    } catch (err) {
        console.log(err);
    }
})

router.get("/delete2/:id", async (req, res) => {
    try {
        const data = await addProductschema.findByIdAndRemove(req.params.id);
        // res.redirect('./viewregistration')
        return res.redirect('http://localhost:3000/viewproduct')
    } catch (err) {
        console.log(err)
    }
})

// **********************************
// router.get('/viewcontact', function (req, res) {
//     res.render("dashboard/viewcontact");
// })

router.post('/contact', (req, res) => {
    var contacts = {
        contact_name: req.body.contact_name,
        contact_number: req.body.contact_number,
        contact_email: req.body.contact_email,
        contact_message: req.body.contact_message
    };

    var conpost = new userContactSchema(contacts);
    conpost.save()
        .then(() =>
            res.json('contact succesfully'))
        .catch(err => res.status(404).json('error:' + err));
});

router.get('/viewcontact', async (req, res) => {
    try {
        const contactData = await userContactSchema.find({});
        res.render('dashboard/viewcontact', { contactData: contactData });
        console.log(contactData);
    } catch (err) {
        console.log(err);
    }
})
router.get("/deletecon/:id", async (req, res) => {
    try {
        const data = await userContactSchema.findByIdAndRemove(req.params.id);
        // res.redirect('./viewregistration')
        return res.redirect('http://localhost:3000/viewcontact')
    } catch (err) {
        console.log(err)
    }
})





module.exports = router;
