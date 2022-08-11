const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const con = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
    })
    console.log(`MongoDB connected : ${con.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

console.log(connectDB());
module.exports = connectDB
