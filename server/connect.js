const mongoose = require("mongoose");
mongoose.set("strict", true);

async function connectToMongoDB(url) {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); 
  }
}

module.exports = {
  connectToMongoDB,
};
