const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`DB connected to ${connection.connection.host}`);
  } catch (error) {
    // console.log(`Error: ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
