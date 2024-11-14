const express = require("express")
const router = express.Router()
const Feedback=require('../../db/feedback')

router.post('/create', async (req, res) => {
    try {
        const { studentId } = req.body;

        // 确保学号存在
        if (!studentId) {
            return res.status(400).json({ msg: "缺少学号" });
        }

        // 获取当天的起始时间
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // 检查是否已有当天未读的反馈
        const existingFeedback = await Feedback.findOne({
            studentId,
            createdAt: { $gte: startOfDay },
            isRead: false
        });

        // 如果存在未读反馈，返回错误信息
        if (existingFeedback) {
            return res.status(400).json({ msg: "您今天已经提交过反馈，且反馈尚未被阅读。" });
        }

        // 如果没有未读反馈，保存新反馈
        const feedback = new Feedback(req.body);
        const savedFeedback = await feedback.save();
        res.status(201).json({ data: savedFeedback, msg: "反馈成功" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "服务器错误" });
    }
});


router.post('/toggle-read', async (req, res) => {
    const { id } = req.body; // 从请求参数中获取反馈记录的 ID
    console.log(id)
    try {
        // 根据 ID 查找反馈记录
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).json({ error: '反馈记录未找到' });
        }

        // 切换 isRead 字段的状态
        feedback.isRead = !feedback.isRead;
        feedback.updatedAt = Date.now(); // 更新更新时间字段

        // 保存更新后的反馈记录
        await feedback.save();

        // 返回更新后的反馈记录
        res.json(feedback);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '服务器错误' });
    }
});
module.exports = router
