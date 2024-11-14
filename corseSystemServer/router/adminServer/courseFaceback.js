const express = require("express")
const router = express.Router()
const path = require("path")
const fs = require("fs");
const courseFeedbackDB = require("../../db/CourseFeedback");
const userDB = require("../../db/user");
const classInfoDB = require("../../db/ClassInfo");
router.delete("/deleteCourseFeedback", async (req, res) => {
    let { id, photo } = req.body;
    try {
        // 先删除数据库中的记录
        await courseFeedbackDB.findByIdAndRemove(id);

        // 检查并删除照片文件
        if (photo && photo !== "/file/checkCourse/default.jpg") {
            let coverUrl = path.resolve(__dirname, "../../public" + photo);

            // 检查文件是否存在
            if (fs.existsSync(coverUrl)) {
                fs.unlinkSync(coverUrl);
            }
        }

        res.send({
            code: 0,
            msg: "删除完成"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
});
router.get("/searchCheckCourse", async (req, res) => {
    const { query } = req.query;
    console.log(query)
    try {
        const results = await courseFeedbackDB.searchCheckCourse(query);
        console.log(results)
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
router.get("/searchClassCheckCourse", async (req, res) => {
    try {
        const {termName,grade, className, levels} = req.query;
        console.log(termName,grade, className, levels)

        // 确保所有参数都存在
        if (!termName||!grade || !className || !levels) {
            return res.status(400).json({message: "缺少必需的参数"});
        }

        // 执行查询
        const users = await courseFeedbackDB.find({termName,grade, class: className, level:levels});

        res.json(users);
    } catch (error) {
        console.error("查询用户时出错:", error);
        res.status(500).json({message: "内部服务器错误"});
    }
});
module.exports = router
