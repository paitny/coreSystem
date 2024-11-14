const express = require('express')
const router = express.Router()
const newsDB=require("../../db/news")
router.post("/collect", async (req, res) => {
    try {
        // 获取评论的 id 和用户 id
        let { id, userId } = req.body;

        // 检查 id 是否存在
        if (!id) {
            return res.status(400).json({ code: 1, msg: "id格式不正确" });
        }

        // 修改数据库
        let doc = await newsDB.findById(id);

        // 检测 doc 是否存在
        if (!doc) {
            return res.status(400).json({ code: 1, msg: "id格式不正确" });
        }

        // 判断是否已经收藏
        if (doc.collects.includes(userId)) {
            // 已收藏 -- 删除 collects 字段里面的当前用户 id
            await newsDB.findByIdAndUpdate(id, { $pull: { collects: userId } });
            return res.status(200).json({ code: 0, msg: "取消收藏成功" });
        } else {
            // 未收藏 -- collects 字段添加当前用户 id
            await newsDB.findByIdAndUpdate(id, { $push: { collects: userId } });
            return res.status(200).json({ code: 0, msg: "收藏成功" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, msg: "服务器错误" });
    }
});
router.get('/Collect', async (req, res) => {
    try {
        const {userId} = req.query;

        // 查询包含该用户id的视频数据
        const doc = await newsDB.find({ collects: userId });

        res.send({
            code: 0,
            msg: "请求完成",
            data: doc
        })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});
module.exports = router
