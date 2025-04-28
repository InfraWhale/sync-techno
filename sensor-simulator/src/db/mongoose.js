const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

function connectDB() {
  const uri = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
  mongoose.connect(uri);

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB 연결 실패"));
  db.once("open", () => {
    console.log("MongoDB 연결 성공");
  });
}

module.exports = connectDB;
