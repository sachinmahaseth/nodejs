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
    packageURL: {
      type: String,
    },
    packageCategory: {
      type: String,
    },
    packageLocation: {
      type: String,
    },
    packageTitle: {
      type: String,
    },
    packagePrice: {
      type: String,
    },
    packageImg: {
      type: String,
    },
    packageDuration: {
      type: String,
    },
    packageMeal: {
      type: String,
    },
    packageDepartureCity: {
      type: String,
    },
    packageTransportation: {
      type: String,
    },
    packageOverview: {
      type: String,
    },
    packageItinerary: {
      type: Array,
    },
    packageIncludes: {
      type: Array,
    },
    packageExcludes: {
      type: Array,
    },
    priceCategory: {
      budgetPrice: String,
      standardPrice: String,
      deluxePrice: String,
      luxuryPrice: String,
      premiumPrice: String,
    },

    datesList: {
      type: String,
    },
  },
  { versionKey: false }
);

const packagesSchema = mongoose.model("packagesSchema", schemaData);
module.exports = packagesSchema;
