const session = require("express-session")
const MongoStore = require("connect-mongo")
module.exports = session({
  //秘钥字符串，服务端生成session的签名，可随意写
  secret: "paity",
  //给前端设置cookie相关的设置，一般配置maxAge即可
  cookie: {maxAge:15*24*60*60*1000},
  //向服务发送请求后，是否重置cookie时间，建议true
  rolling: true,
  //是否强制重新保存session，即使它没有发生变化，建议false
  resave: false,
  //是否在session还未初始化时就存储，有利于前后鉴权，建议true
  saveUninitialized: true,
  //让session存储到数据库
  store: MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1:27017/itstudent"
  })
})






