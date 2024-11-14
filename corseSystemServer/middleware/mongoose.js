const mongoose = require("mongoose");

const dbURI = "mongodb://127.0.0.1:27017/itstudent";

// 连接数据库
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 监听成功连接
mongoose.connection.on("connected", () => {
  console.log(`Mongoose 已连接到 ${dbURI}`);
});

// 监听连接失败
mongoose.connection.on("error", (err) => {
  console.log("Mongoose 连接错误:", err);
});

// 监听断开连接
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose 已断开连接");
});

// 关闭数据库连接时
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Mongoose 连接已关闭，进程结束");
  process.exit(0);
});
