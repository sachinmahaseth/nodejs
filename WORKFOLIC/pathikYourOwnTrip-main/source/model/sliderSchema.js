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
    packageLocation: {
      type: String,
    },
    sliderImg: {
      type: String,
    },

  },
  { versionKey: false }
);

const sliderSchema = mongoose.model("sliderSchema", schemaData);
module.exports = sliderSchema;
