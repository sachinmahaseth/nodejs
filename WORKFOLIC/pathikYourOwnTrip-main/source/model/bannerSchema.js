const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaData = new Schema(
  {
    bannerCategory: {
      type: String,
    },
    bannerImg: {
      type: String,
    },
  },
  { versionKey: false }
);

const bannerSchema = mongoose.model("bannerData", schemaData);
module.exports = bannerSchema;
