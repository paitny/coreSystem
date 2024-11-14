const express = require("express")
const router = express.Router()
const activityDB = require("../../db/activity")
const volunteerDB=require("../../db/volunteer")
const multer = require("multer")
const path = require("path")
const fs = require("fs");
const userDB=require("../../db/user")
let vtCover_upload = multer({
    storage: multer.diskStorage({
        //文件存储的目录
        destination(req, file, cb) {
            cb(null, path.join(__dirname, '../../public/file/vtCover'))
        },
        //文件的名字
        filename(req, file, cb) {
            let { ext } = path.parse(file.originalname)
            req.vtCover_name = `vtCover-${Date.now()}${ext}`
            cb(null, req.vtCover_name)
        }
    })
}).single('file')
function updateUsersWithActivities(usersData, activitiesData) {
    usersData.forEach(user => {
        activitiesData.forEach(activity => {
            if (user.user === activity.ID) {
                user.activityIds.push(activity.activityId);
            }
        });
    });

    return usersData;
}

const getCurrentSemester = require('../../utils/semesterUtils');

//上传cover封面图
router.post("/cover", (req, res) => {
    try{
    vtCover_upload(req, res, async (err) => {
        //上传失败
        if (err) {
            return res.send({
                code: 9,
                msg: "上传失败"
            })
        }
        //上传成功
        res.send({
            code: 0,
            msg: "cover上传成功",
            url: `/file/vtCover/${req.vtCover_name}`
        })
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

// 创建活动
router.post("/create", async (req, res) => {
    try {
        // 测试函数
        const currentSemester = getCurrentSemester();
        const { title, description, deadline, cover } = req.body;

        const activity = new activityDB({
            title,
            description,
            cover,
            currentSemester,
            deadline
        });

        await activity.save();

        res.status(201).json({
            code: 0,
            msg: "活动发布成功",
            activity,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: -1,
            msg: "活动发布失败",
        });
    }
});
//活动修改
router.post("/update", async (req, res) => {
    let {id, doc, mdUrl} = req.body
  try{
    if (!mdUrl) {
        await activityDB.findByIdAndUpdate(id, doc)
        return res.send({
            code: 0,
            msg: "修改成功"
        })
    } else if (mdUrl === "/file/vtCover/default.jpg") {
        await activityDB.findByIdAndUpdate(id, doc)
        return res.send({
            code: 0,
            msg: "修改成功"
        })
    }
    let url = path.resolve(__dirname, "../../public" + mdUrl)
    fs.unlinkSync(url)
    await activityDB.findByIdAndUpdate(id, doc)

    res.send({
        code: 0,
        msg: "修改成功"
    })}catch (error) {
      console.error(error);
      res.status(500).json({ message: '内部服务器错误' });
  }
})
//活动删除
router.delete("/delete", async (req, res) => {
    let {id, vtCover} = req.body
    try{
    let coverUrl = path.resolve(__dirname, "../../public" + vtCover)
    if (vtCover === "/file/vtCover/default.jpg") {
        await activityDB.findByIdAndRemove(id)
        return res.send({
            code: 0,
            msg: "删除完成"
        })
    }

    await activityDB.findByIdAndRemove(id)

    res.send({
        code: 0,
        msg: "删除完成"
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

//报名信息删除
router.delete("/deleteVtInfo", async (req, res) => {
    let {id} = req.body
    try{
    await volunteerDB.findByIdAndRemove(id)

    res.send({
        code: 0,
        msg: "删除完成"
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
//班级量化表实现
router.post("/studentQuantification", async (req, res) => {
    // const { grade, userClass, levels } = req.query;
    try{
    const grade="2021级"
    const userClass="物联网工程1班"
    const levels="本"
    const query = {};
    if (grade) query.grade = new RegExp(grade, "i");
    if (userClass) query.class = new RegExp(userClass, "i");
    if (levels) query.levels = new RegExp(levels, "i");
    const users = await userDB.find(query).sort({ date: -1 }).exec();

    let updatedUsersData = updateUsersWithActivities(usersData, activitiesData);



    res.send({
        code: 0,
        msg: "获取成功",
        data:updatedUsersData
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

router.get("/searchVt", async (req, res) => {
    const { query } = req.query;

    try {
        const results = await activityDB.searchActivity(query);
        res.send({
            code: 0,
            msg: "请求完成",
            data: results
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "服务器错误" });
    }
});


router.post('/quantization', async (req, res) => {
    try {
        const {activityId,quantization} = req.body;

        console.log(quantization)
        // 查找并更新活动
        const updatedActivity = await activityDB.findByIdAndUpdate(
            activityId,
            { quantization },
            { new: true }
        );

        if (!updatedActivity) {
            return res.status(404).json({ error: '该活动不存在' });
        }

        res.json({msg:"设置成功"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
});
module.exports = router
