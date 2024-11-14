const express = require("express")
const router = express.Router()

router.use("/get",require("./get/index"))
//注册
router.use("/reg",require("./reg/index"))
//登录
router.use("/login",require("./login/index"))
//返回各种json数据
router.use("/route",require("./data/index"))
//管理员
router.use("/adminServer", require("./adminServer/index"))
//志愿者
router.use("/itVolunteer", require("./volunteer/index"))
//课表添加

router.use("/course", require("./course/index"))
router.use("/Curriculum", require("./courseUpload/index"))
router.use("/trends", require("./trends/index"))
router.use("/modify", require("./modify/index"))
router.use("/examinationOrg", require("./examinationOrg/index"))
router.use("/news", require("./news/index"))
router.use("/feedback", require("./feedback/index"))
router.use("/aiCourse", require("./aiCourse/index"))
router.use("/ApplicationOrg", require("./ApplicationOrg/index"))
router.use("/softDelete", require("./softDelete"))
//滕馨悦
const userRouter = require('./students/user');
const addInfotbRouter = require('./students/addinfotb');
const addScoretbRouter = require('./students/addscoretb');

router.use('/users', userRouter);
router.use('/addinfotb', addInfotbRouter);
router.use('/addscoretb', addScoretbRouter);
//小金
const userRouter2 = require('./studentglod/user');
const studentRouter = require('./studentglod/student');
router.use('/useres', userRouter2);
router.use('/students', studentRouter);
module.exports = router
