// your-express-app.js
const bodyParser = require('body-parser');
const express = require("express");
const http = require('http');
const initializeSocketLogic = require('./socket/index');
const { scheduleCreateSemesterData } = require('./middleware/scheduler');

require("./middleware/mongoose");

const app = express();
const server = http.createServer(app);
initializeSocketLogic(server);
scheduleCreateSemesterData()
// 设置请求体大小限制为 50MB

app.use(require("./middleware/log"))
app.use(require("./middleware/session"));
app.use(require("./middleware/cors"));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
// error handler
app.use(function (err, req, res, next) {
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.use("/api", require("./router/index"));

const PORT = process.env.PORT || 5200;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);  // 使用 logger 记录日志

});
