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
    peopleCount: {
      type: String,
    },
    destination: {
      type: String,
    }
  },
  { versionKey: false }
);

const popupSchema = mongoose.model("popupSchema", schemaData);
module.exports = popupSchema;
