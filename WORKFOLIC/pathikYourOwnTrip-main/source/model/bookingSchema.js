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
        bookingDate: {
            type: String,
        },
        packageId: {
            type: String,
        },
        packageTitle: {
            type: String,
        },
        packageLocation: {
            type: String,
        },
        packageURL: {
            type: String,
        },
        holidayCategory: {
            type: String,
        },
        holidayCategoryPrice: {
            type: String,
        },
        roomCount: {
            type: String,
        },
        adultCount: {
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
        totalAmount: {
            type: String,
        },
        paymentID: {
            type: Object,
        },
        paymentData: {
            type: String,
        },
    },
    { versionKey: false }
);

const bookingSchema = mongoose.model("bookingSchema", schemaData);
module.exports = bookingSchema;
