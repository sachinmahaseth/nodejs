const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaData = new Schema(
    {
        Date: {
            type: Date,
            default: new Date()
        },
        cDate: {
            type: String,
        },
        name: {
            type: String,
        },
        mobile: {
            type: String,
        },
        email: {
            type: String,
        },
        message: {
            type: String,
        },
    },
    { versionKey: false }
);

const contactSchema = mongoose.model("contactSchema", schemaData);
module.exports = contactSchema;
