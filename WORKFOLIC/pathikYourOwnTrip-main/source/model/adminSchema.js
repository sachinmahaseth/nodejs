const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaData = new Schema(
  {
    username: {
      type: String,
    },
    mobile: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    popUpImg:{
      type: String,
    }
  },
  { versionKey: false }
);

const adminSchema = mongoose.model("adminSchema", schemaData);
module.exports = adminSchema;
