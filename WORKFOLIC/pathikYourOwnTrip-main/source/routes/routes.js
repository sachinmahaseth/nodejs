const express = require("express");
const route = express.Router();
const multer = require("multer");
const path = require("path");
const moment = require("moment");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const fs = require("fs");
const nodemailer = require("nodemailer");
const Jimp = require("jimp");


// current Date
let cDate = moment().format("Do MMM YYYY");
console.log('Current Date: ', cDate);

// meta Data 
const metaDataObj = require("../meta/metaData");

// middleware for authenticating
let isLogin = require("../middleware/isLogin");
let isLogout = require("../middleware/isLogout");


// models for database
const adminSchema = require("../model/adminSchema");
const bookingSchema = require("../model/bookingSchema");
const contactSchema = require("../model/contactSchema");
const packagesSchema = require("../model/packagesSchema");
const popupSchema = require("../model/popupSchema");
const sliderSchema = require("../model/sliderSchema");


// Setup Session
route.use(cookieParser());
const oneDay = 1000 * 60 * 60 * 24 * 1;
route.use(
    session({
        secret: process.env.SECRET_KEY,
        cookie: { maxAge: oneDay },
        saveUninitialized: true,
        resave: true,
    })
);

// setup nodemailer
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS,
    },
});



// setup multer for packages
const packageStorageMulter = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, "public/packages");
    },
    filename: function (request, file, callback) {
        callback(
            null,
            "packagesImg-" + Date.now() + path.extname(file.originalname)
        );
    },
});

// setup multer limitation for packages
const uploadPackageMulter = multer({
    storage: packageStorageMulter,
    limits: {
        fieldSize: 1024 * 1024 * 10,
    },
});


// setup multer for banner and popup
const bannerImgStorage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, "public/banners");
    },
    filename: function (request, file, callback) {
        callback(null, "bannerImg-" + Date.now() + path.extname(file.originalname));
    },
});

// setup multer limitation for banner and popup
const uploadBannerImg = multer({
    storage: bannerImgStorage,
    limits: {
        fieldSize: 1024 * 1024 * 10,
    },
});


// category Array
const categoryListArray = ["Backpacking",
    "Jibhi",
    "Kashmir",
    "Kheerganga",
    "Leh",
    "Manali",
    "McLeodganj",
    "Meghalaya",
    "Sikkim",
    "Spiti",
    "Udaipur",
    "Weekend",
    "Bali",
    "Dubai",
    "Maldives",
    "Singapore",
    "Thailand",
    "Vietnam"];

const domesticListArray = ["Backpacking",
    "Jibhi",
    "Kashmir",
    "Kheerganga",
    "Leh",
    "Manali",
    "McLeodganj",
    "Meghalaya",
    "Sikkim",
    "Spiti",
    "Udaipur",
    "Weekend"];

const internationalListArray = ["Bali",
    "Dubai",
    "Maldives",
    "Singapore",
    "Thailand",
    "Vietnam"];


route.get("/", async (req, res) => {
    try {

        let adminData = await adminSchema.findOne({});
        let popUpImg = adminData.popUpImg;

        let slidersData = await sliderSchema.find({}).sort({ _id: -1 });


        let packageData = await packagesSchema.aggregate([
            {
                $group: {
                    _id: {
                        packageCategory: "$packageCategory",
                        packageLocation: "$packageLocation"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.packageCategory",
                    packageLocations: {
                        $push: {
                            packageLocation: "$_id.packageLocation",
                            count: "$count"
                        }
                    }
                }
            }
        ])

        const domesticData = packageData.find(category => category._id === 'Domestic').packageLocations;

        let allPackageData = await packagesSchema.aggregate([
            {
                $group: {
                    _id: '$packageLocation',
                    products: { $push: '$$ROOT' }
                }
            }
        ]).sort({ _id: -1 });


        res.status(200).render('home', { popUpImg, slidersData, domesticData, allPackageData });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
});


route.get("/international", async (req, res) => {
    try {
        let adminData = await adminSchema.findOne({});
        let popUpImg = adminData.popUpImg;
        let slidersData = await sliderSchema.find({}).sort({ _id: -1 });

        const pipeline = [
            // Match documents with the main_category set to "international"
            { $match: { packageCategory: 'International' } },
            // Group documents by sub_category and count the number of documents in each group
            { $group: { _id: '$packageLocation', count: { $sum: 1 }, packages: { $push: '$$ROOT' } } },
            { $sort: { _id: 1 } },
        ];

        const allInternationalData = await packagesSchema.aggregate(pipeline);

        res.status(200).render('international', { popUpImg, allInternationalData, slidersData });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
});

route.get("/domestic", async (req, res) => {
    try {
        let adminData = await adminSchema.findOne({});
        let popUpImg = adminData.popUpImg;
        let slidersData = await sliderSchema.find({}).sort({ _id: -1 });

        const pipeline = [
            // Match documents with the main_category set to "international"
            { $match: { packageCategory: 'Domestic' } },
            // Group documents by sub_category and count the number of documents in each group
            { $group: { _id: '$packageLocation', count: { $sum: 1 }, packages: { $push: '$$ROOT' } } },
            { $sort: { _id: 1 } },
        ];

        const allDomesticData = await packagesSchema.aggregate(pipeline);


        res.status(200).render('domestic', { popUpImg, allDomesticData, slidersData });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
});

route.get("/blogs", async (req, res) => {
    try {
        let adminData = await adminSchema.findOne({});
        let popUpImg = adminData.popUpImg;
        res.status(200).render('blogs', { popUpImg });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
});


route.get("/about", async (req, res) => {
    try {
        let adminData = await adminSchema.findOne({});
        let popUpImg = adminData.popUpImg;
        res.status(200).render('about', { popUpImg });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
});


route.get("/contact", async (req, res) => {
    try {
        let adminData = await adminSchema.findOne({});
        let popUpImg = adminData.popUpImg;
        res.status(200).render('contact', { popUpImg });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
});

route.get("/category/:location", async (req, res) => {
    try {

        let location = req.params.location;

        let adminData = await adminSchema.findOne({});
        let popUpImg = adminData.popUpImg;

        let packagesData = await packagesSchema.find({ packageLocation: location }).sort({ _id: -1 });

        res.status(200).render('singleCategory', { popUpImg, location, packagesData });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
});


route.get("/category/:location/:packageURL", async (req, res) => {
    try {
        let adminData = await adminSchema.findOne({});
        let popUpImg = adminData.popUpImg;

        let location = req.params.location;
        let packageURL = req.params.packageURL;

        let packageData = await packagesSchema.findOne({ packageURL, packageLocation: location });

        let relatedPackageData = await packagesSchema.find({ packageLocation: location }).sort({ _id: -1 });

        res.status(200).render('singlePackage', { popUpImg, packageData, relatedPackageData });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
});




// -------------- ADMIN ROUTES -------------- //


// login

route.post("/authLogin", async (req, res) => {
    try {
        let { username, password } = req.body;

        let checkUsername = await adminSchema.findOne({ username });

        if (checkUsername) {

            // check password
            if (checkUsername.password === password) {
                // Store Admin id into Session
                req.session.user_id = checkUsername._id.toHexString();
                res.status(201).json({
                    success: true,
                    message: "User Login Successfully"
                });
            } else {
                console.log("Invalid Password");
                res.status(201).json({
                    success: false,
                    message: "Invalid Credentials"
                });
            }
        } else {
            console.log("Invalid Username");
            res.status(201).json({
                success: false,
                message: "Invalid Credentials"
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('errors/page500');
    }
})


route.get("/admin", isLogin, async (req, res) => {
    res.status(200).redirect("/dashboard");
});


route.get("/login", isLogout, async (req, res) => {
    try {
        res.status(200).render('admin/authLogin');
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
});


route.get("/authForgot", isLogout, async (req, res) => {
    try {
        res.status(200).render('admin/authForgot');
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
});


route.get("/dashboard", isLogin, async (req, res) => {
    try {
        let bookingData = await bookingSchema.find({}).sort({ _id: -1 });

        let totalPackages = await packagesSchema.countDocuments()
        let totalBooking = await bookingSchema.countDocuments()
        let totalContactRes = await contactSchema.countDocuments()
        let totalPopupRes = await popupSchema.countDocuments()

        res.status(200).render("admin/authAdmin", {
            bookingData, totalPackages, totalBooking, totalContactRes, totalPopupRes
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
})


route.get("/addPackage", isLogin, async (req, res) => {
    try {

        let bookingData = await bookingSchema.find({}).sort({ _id: -1 });

        let totalPackages = await packagesSchema.countDocuments()
        let totalBooking = await bookingSchema.countDocuments()
        let totalContactRes = await contactSchema.countDocuments()
        let totalPopupRes = await popupSchema.countDocuments()

        res.status(200).render("admin/authAddPackage", { totalPackages, totalBooking, totalContactRes, totalPopupRes, bookingData });

    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
});

route.get("/popupResponse", isLogin, async (req, res) => {
    try {
        let formData = await popupSchema.find({}).sort({ _id: -1 })

        let totalPackages = await packagesSchema.countDocuments()
        let totalBooking = await bookingSchema.countDocuments()
        let totalContactRes = await contactSchema.countDocuments()
        let totalPopupRes = await popupSchema.countDocuments()

        res.status(200).render("admin/authPopupRes", { formData, totalPackages, totalBooking, totalContactRes, totalPopupRes });

    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
})


route.get("/contactResponse", isLogin, async (req, res) => {
    try {
        let formData = await contactSchema.find({}).sort({ _id: -1 })

        let totalPackages = await packagesSchema.countDocuments()
        let totalBooking = await bookingSchema.countDocuments()
        let totalContactRes = await contactSchema.countDocuments()
        let totalPopupRes = await popupSchema.countDocuments()

        res.status(200).render("admin/authContactRes", { formData, totalPackages, totalBooking, totalContactRes, totalPopupRes });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
})




route.get("/authCat/:category", isLogin, async (req, res) => {
    try {
        let category = req.params.category

        if (category == "Domestic" || category == "International") {


            let categoryName = category.replace("_", " ")
            let totalPackages = await packagesSchema.countDocuments()
            let totalBooking = await bookingSchema.countDocuments()
            let totalContactRes = await contactSchema.countDocuments()
            let totalPopupRes = await popupSchema.countDocuments()

            let packageData = await packagesSchema.aggregate([
                {
                    $group: {
                        _id: {
                            packageCategory: "$packageCategory",
                            packageLocation: "$packageLocation"
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: "$_id.packageCategory",
                        packageLocations: {
                            $push: {
                                packageLocation: "$_id.packageLocation",
                                count: "$count"
                            }
                        }
                    }
                }
            ])

            const domesticData = packageData.find(category => category._id === 'Domestic');

            const internationalData = packageData.find(category => category._id === 'International');


            if (category == "Domestic") {
                res.status(200).render("admin/authCategory", { categoryList: domesticData.packageLocations, categoryName, totalPackages, totalBooking, totalContactRes, totalPopupRes });

            } else if (category == "International") {
                res.status(200).render("admin/authCategory", { categoryList: internationalData.packageLocations, categoryName, totalPackages, totalBooking, totalContactRes, totalPopupRes });
            }

        } else {
            res.status(404).render("errors/page404");
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
})



route.get("/authLoc/:location", isLogin, async (req, res) => {
    try {
        let location = req.params.location
        const checkCategory = categoryListArray.includes(location);
        if (checkCategory === true) {
            let packageData = await packagesSchema.find({ packageLocation: location }).sort({ _id: -1 })
            let categoryName = location.replace("_", " ")
            let totalPackages = await packagesSchema.countDocuments()
            let totalBooking = await bookingSchema.countDocuments()
            let totalContactRes = await contactSchema.countDocuments()
            let totalPopupRes = await popupSchema.countDocuments()
            res.status(200).render("admin/authLocation", { packageData, categoryName, totalPackages, totalBooking, totalContactRes, totalPopupRes });
        } else {
            res.status(404).render("page404");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})


route.get("/siteSetting", isLogin, async (req, res) => {
    try {
        let adminData = await adminSchema.findOne({});
        let popImgFileName = adminData.popUpImg;
        let slidersData = await sliderSchema.find({}).sort({ _id: -1 })

        let totalPackages = await packagesSchema.countDocuments();
        let totalBooking = await bookingSchema.countDocuments();
        let totalContactRes = await contactSchema.countDocuments();
        let totalPopupRes = await popupSchema.countDocuments();


        let packageData = await packagesSchema.aggregate([
            {
                $group: {
                    _id: {
                        packageCategory: "$packageCategory",
                        packageLocation: "$packageLocation"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.packageCategory",
                    packageLocations: {
                        $push: {
                            packageLocation: "$_id.packageLocation",
                            count: "$count"
                        }
                    }
                }
            }
        ])

        let locations = [];

        const domesticData = packageData.find(category => category._id === 'Domestic');
        const internationalData = packageData.find(category => category._id === 'International');

        domesticData.packageLocations.forEach(element => {
            locations.push(element.packageLocation);
        });
        internationalData.packageLocations.forEach(element => {
            locations.push(element.packageLocation);
        });
        let totalLocation = locations.sort()

        res.status(200).render("admin/authSiteSetting", { popImgFileName, slidersData, totalPackages, totalBooking, totalContactRes, totalPopupRes, totalLocation });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
})

route.get("/edit/:packId", isLogin, isLogin, async (req, res) => {
    try {
        let _id = req.params.packId
        let packageData = await packagesSchema.findOne({ _id });

        let totalPackages = await packagesSchema.countDocuments()
        let totalBooking = await bookingSchema.countDocuments()
        let totalContactRes = await contactSchema.countDocuments()
        let totalPopupRes = await popupSchema.countDocuments()

        res.status(200).render("admin/authEditPackage", { packageData, totalPackages, totalBooking, totalContactRes, totalPopupRes });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
})



// -------------- admin POST API -------------//



route.post("/deletePackage", isLogin, async (req, res) => {
    try {
        let { _id } = req.body
        let targetPackage = await packagesSchema.findOne({ _id });
        let packageLocation = targetPackage.packageLocation;
        const imgPathForDel = path.join(
            __dirname,
            "..",
            "..",
            "public",
            "packages"
        );

        let oldImgPath = `${imgPathForDel}/${targetPackage.packageImg}`;
        fs.unlink(oldImgPath, async (err) => {
            if (err) {
                console.error(`Error deleting the file: ${err}`);
                res.status(500).render('errors/page500');
            } else {
                console.log(`File ${oldImgPath} has been deleted`);
                await packagesSchema.deleteOne({ _id });
                res.status(201).redirect(`/auth/${packageLocation}`);
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
})


// add new packages

route.post(
    "/addPackages",
    uploadPackageMulter.single("packageImg"), isLogin,
    async (req, res) => {
        try {
            let {
                packageCategory,
                packageLocation,
                packageTitle,
                packagePrice,
                packageDuration,
                packageMeal,
                packageDepartureCity,
                packageTransportation,
                packageOverview,
                packageItineraryTxt,
                packageIncludesTxt,
                packageExcludesTxt,
                budgetPrice,
                standardPrice,
                deluxePrice,
                luxuryPrice,
                premiumPrice,
                datesList,
            } = req.body;

            let packageImg = `${req.file.fieldname}${Date.now()}.jpeg`;

            // De-Structure Itinerary

            const itineraryArr = packageItineraryTxt
                .split("@@")
                .filter((part) => part.trim() !== "");

            let packageItinerary = [];

            for (let i = 0; i < itineraryArr.length; i++) {
                const iti = itineraryArr[i]
                    .split("##")
                    .filter((part) => part.trim() !== "");
                packageItinerary.push(iti);
            }


            // De-Structure includes & excludes

            const packageIncludes = packageIncludesTxt
                .split("##")
                .filter((part) => part.trim() !== "");

            const packageExcludes = packageExcludesTxt
                .split("##")
                .filter((part) => part.trim() !== "");

            let targetWidth = 600;
            let targetHeight = 389;

            Jimp.read(req.file.path)
                .then(image => {
                    // Calculate the center coordinates for cropping
                    const centerX = Math.floor(image.bitmap.width / 2 - targetWidth / 2);
                    const centerY = Math.floor(image.bitmap.height / 2 - targetHeight / 2);

                    // Crop the image
                    image.crop(centerX, centerY, targetWidth, targetHeight);

                    // Save the cropped image
                    return image.write(`./public/packages/${packageImg}`);
                })
                .then(async () => {
                    console.log('Image cropped and saved successfully!');
                    try {

                        fs.unlinkSync(req.file.path);

                        await packagesSchema.insertMany({
                            cDate,
                            packageURL: packageTitle.replace(/\s/g, "-"),
                            packageCategory,
                            packageLocation,
                            packageTitle,
                            packagePrice,
                            packageImg,
                            packageDuration,
                            packageMeal,
                            packageDepartureCity,
                            packageTransportation,
                            packageOverview,
                            packageItinerary,
                            packageIncludes,
                            packageExcludes,
                            priceCategory: {
                                budgetPrice,
                                standardPrice,
                                deluxePrice,
                                luxuryPrice,
                                premiumPrice,
                            },
                            datesList
                        });

                        res.status(201).redirect("/addPackage");

                    } catch (unlinkError) {
                        console.error('Error deleting file:', unlinkError);
                        console.error('Error deleting file');
                        return res.status(500).render('errors/page500');
                    }
                })
                .catch(err => {
                    console.error('Error Cropping Error:', err);
                    return res.status(500).render('errors/page500');
                });
        } catch (error) {
            console.error(error);
            res.status(500).render('errors/page500');
        }
    }
);


route.get("/getStatisticsChart", isLogin, async (req, res) => {
    try {

        let packageData = await packagesSchema.aggregate([
            {
                $group: {
                    _id: {
                        packageCategory: "$packageCategory",
                        packageLocation: "$packageLocation"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.packageCategory",
                    packageLocations: {
                        $push: {
                            packageLocation: "$_id.packageLocation",
                            count: "$count"
                        }
                    }
                }
            }
        ])

        let labels = [];
        let count = [];

        const domesticData = packageData.find(category => category._id === 'Domestic');

        domesticData.packageLocations.forEach(element => {
            labels.push(element.packageLocation)
            count.push(element.count)
        });

        res.status(201).json({
            success: true,
            labels,
            count
        });

    } catch (error) {
        console.error(error);
        return res.status(500).render('errors/page500');
    }
})


// update existing package

route.post(
    "/updatePackages", isLogin, async (req, res) => {
        try {
            let {
                packId,
                packageCategory,
                packageLocation,
                packageTitle,
                packagePrice,
                packageDuration,
                packageMeal,
                packageDepartureCity,
                packageTransportation,
                packageOverview,
                packageItineraryTxt,
                packageIncludesTxt,
                packageExcludesTxt,
                budgetPrice,
                standardPrice,
                deluxePrice,
                luxuryPrice,
                premiumPrice,
                datesList,
            } = req.body;

            const itineraryArr = packageItineraryTxt
                .split("@@")
                .filter((part) => part.trim() !== "");


            let packageItinerary = [];

            for (let i = 0; i < itineraryArr.length; i++) {
                const iti = itineraryArr[i]
                    .split("##")
                    .filter((part) => part.trim() !== "");
                packageItinerary.push(iti);
            }

            const packageIncludes = packageIncludesTxt
                .split("##")
                .filter((part) => part.trim() !== "");

            const packageExcludes = packageExcludesTxt
                .split("##")
                .filter((part) => part.trim() !== "");

            await packagesSchema.updateMany({ _id: packId }, {
                $set: {
                    cDate,
                    packageURL: packageTitle.replace(/\s/g, "-"),
                    packageCategory,
                    packageLocation,
                    packageTitle,
                    packagePrice,
                    packageDuration,
                    packageMeal,
                    packageDepartureCity,
                    packageTransportation,
                    packageOverview,
                    packageItinerary,
                    packageIncludes,
                    packageExcludes,
                    priceCategory: {
                        budgetPrice,
                        standardPrice,
                        deluxePrice,
                        luxuryPrice,
                        premiumPrice,
                    },
                    datesList
                }
            });

            res.status(201).redirect(`edit/${packId}`);

        } catch (error) {
            console.error(error);
            res.status(500).render('errors/page500');
        }
    }
);


route.post("/popForm", async (req, res) => {
    try {
        let { name, mobile, email, peopleCount, destination, } = req.body
        await popupSchema.insertMany({ cDate, name, mobile, email, peopleCount, destination })
        res.status(201).json({
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
});

route.post("/contactForm", async (req, res) => {
    try {
        let { name, mobile, email, message } = req.body
        await contactSchema.insertMany({ cDate, name, mobile, email, message })
        res.status(201).json({
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
});


route.post(
    '/uploadPopUp',
    uploadBannerImg.single('popImg'), isLogin,
    async (req, res) => {
        try {
            let cropFileName = `${req.file.fieldname}${Date.now()}.jpeg`;
            let adminData = await adminSchema.findOne({});
            let oldImgFIle = adminData.popUpImg;

            let targetWidth = 400;
            let targetHeight = 400;

            const image = await Jimp.read(req.file.path);

            // Calculate the center coordinates for cropping
            const centerX = Math.floor(image.bitmap.width / 2 - targetWidth / 2);
            const centerY = Math.floor(image.bitmap.height / 2 - targetHeight / 2);

            // Crop the image
            image.crop(centerX, centerY, targetWidth, targetHeight);

            // Save the cropped image
            image.write(`./public/banners/${cropFileName}`);

            console.log('Image cropped and saved successfully!');

            // Delete the original file
            fs.unlinkSync(req.file.path);

            // Update the database with the new image filename
            await adminSchema.updateOne({ popUpImg: cropFileName });

            // Delete the old image file
            const imgPathForDel = path.join(__dirname, '..', '..', 'public', 'banners');
            let oldImgPath = `${imgPathForDel}/${oldImgFIle}`;
            fs.unlinkSync(oldImgPath);

            console.log(`File ${oldImgPath} has been deleted`);
            res.status(201).redirect('/siteSetting');
        } catch (error) {
            console.error(error);
            res.status(500).render('errors/page500');
        }
    }
);



route.post("/changePass", isLogin, async (req, res) => {
    try {
        let { oldPassword, newPassword } = req.body
        let adminData = await adminSchema.findOne();
        if (oldPassword == adminData.password) {
            await adminSchema.updateOne({ password: newPassword })
            res.status(201).json({
                success: true,
                message: 'Password Changed Successfully'
            });
        } else {
            res.status(201).json({
                success: false,
                message: 'Try Again, Incorrect Password'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
});



route.post(
    '/uploadSlide',
    uploadBannerImg.single('slideImg'), isLogin,
    async (req, res) => {
        try {

            let { packageCategory } = req.body;

            let cropFileName = `${req.file.fieldname}${Date.now()}.jpeg`;

            let targetWidth = 1350;
            let targetHeight = 380;

            const image = await Jimp.read(req.file.path);

            // Calculate the center coordinates for cropping
            const centerX = Math.floor(image.bitmap.width / 2 - targetWidth / 2);
            const centerY = Math.floor(image.bitmap.height / 2 - targetHeight / 2);

            // Crop the image
            image.crop(centerX, centerY, targetWidth, targetHeight);

            // Save the cropped image
            image.write(`./public/banners/${cropFileName}`);

            // Delete the original file
            fs.unlinkSync(req.file.path);

            // Update the database with the new image filename
            await sliderSchema.insertMany({ cDate, packageLocation: packageCategory, sliderImg: cropFileName });

            res.status(201).redirect('/siteSetting');
        } catch (error) {
            console.error(error);
            res.status(500).render('errors/page500');
        }
    }
);


route.post("/bookPackage", async (req, res) => {
    try {

        let { bookingDate, packageId, holidayCategory, roomCount, adultCount, name, mobile, email, } = req.body;

        let packageData = await packagesSchema.findOne({ _id: packageId })

        let totalAmount = "";
        if (holidayCategory === "Budget") {
            totalAmount = packageData.priceCategory.budgetPrice * adultCount;
        } else if (holidayCategory === "Standard") {
            totalAmount = packageData.priceCategory.standardPrice * adultCount;
        } else if (holidayCategory === "Deluxe") {
            totalAmount = packageData.priceCategory.deluxePrice * adultCount;
        } else if (holidayCategory === "Luxury") {
            totalAmount = packageData.priceCategory.luxuryPrice * adultCount;
        } else if (holidayCategory === "Premium") {
            totalAmount = packageData.priceCategory.premiumPrice * adultCount;
        }

        await bookingSchema.insertMany({
            cDate,
            bookingDate,
            packageId,
            packageTitle: packageData.packageTitle,
            packageLocation: packageData.packageLocation,
            packageURL: packageData.packageURL,
            holidayCategory,
            holidayCategoryPrice: totalAmount / adultCount,
            roomCount,
            adultCount,
            name,
            mobile,
            email,
            totalAmount,
            paymentID: "",
            paymentData: ""
        })

        res.status(201).json({
            success: true,
            message: "Booked Successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).render('errors/page500');
    }
});


// logout admin
route.post("/logout", isLogin, async (req, res) => {
    try {
        req.session.destroy();
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader("Clear-Site-Data", "\"cache\"");
        res.redirect("/login");
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('errors/page500');
    }
});



module.exports = route;