const express = require("express")
const router = express.Router()

//鉴权
router.use((req, res, next) => {
  if (!req.session.userInfo || !req.session.userInfo.admin) {
    return res.send({
      code: 6,
      msg: "您不是管理员",
    })
  }
  next()
})

//check
router.post("/check", (req, res) => {
  try{
  res.send({
    code: 0,
    msg: "您拥有管理员权限",
    data:req.session.userInfo
  })}catch (error) {
    console.error(error);
    res.status(500).json({ message: '内部服务器错误' });
  }
})



//用户
router.use("/consumer",require("./consumer"))
//音乐
router.use("/music",require("./music"))
//信工新闻
router.use("/news",require("./itNews"))
//志愿者
router.use("/volunteer",require("./volunteer"))
//学生机构
//志愿者
router.use("/StudentOrg",require("./studentOrg"))

router.use("/trends",require("./trends"))
router.use("/alumnus",require("./alumnus"))
router.use("/get",require("./dataMg"))
router.use("/examine",require("./examine"))
router.use("/analysis",require("./analysis"))
router.use("/notice",require("./notice"))
router.use("/updateData",require("./updateData"))
router.use("/checkCourse",require("./courseFaceback"))
module.exports = router




