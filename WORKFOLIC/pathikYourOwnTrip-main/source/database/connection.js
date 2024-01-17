const mongoose = require("mongoose");
const MONGOURL = process.env.MONGOURL;
mongoose.set("strictQuery", true);

const dbConnect = async () => {
  try {
    // const connectionParams = {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // };

    await mongoose.connect(MONGOURL);

    console.log("Connected to Database Successfully");

    mongoose.connection.on("error", (err) => {
      console.error("Error While Connecting to Database:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB Connection Disconnected");
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

module.exports = dbConnect;
