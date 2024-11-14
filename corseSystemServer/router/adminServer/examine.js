const express = require("express")
const router = express.Router()
const UserExam= require("../../db/userExam")
const Exam = require("../../db/publishedIssues");

router.post('/publish-exam', async (req, res) => {
    try {
        const { title,termTopic, startTime, endTime } = req.body;

        // 创建考试对象
        const exam = new Exam({
            title,
            termTopic,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
        });
        // 保存考试对象到数据库
        await exam.save();

        res.json({ message: '考试发布成功！' });
    } catch (error) {
        console.error('Failed to publish exam:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/updateScores', async (req, res) => {
    try {
        const { userExamId,singleChoiceScore,fillScore, essayScore, thinkingScore,reviewer } = req.body;

        // 根据 userExamId 查找用户考试数据
        const userExam = await UserExam.findById(userExamId);

        if (!userExam) {
            return res.status(404).json({ message: '试卷不存在' });
        }

        // 更新字段
        userExam.singleChoiceScore=singleChoiceScore||userExam.singleChoiceScore
        userExam.fillScore = fillScore || userExam.fillScore;
        userExam.essayScore = essayScore || userExam.essayScore;
        userExam.thinkingScore = thinkingScore || userExam.thinkingScore;
        userExam.reviewer=reviewer||userExam.reviewer;

        // 计算 totalScore
        userExam.totalScore =userExam.singleChoiceScore+userExam.fillScore + userExam.essayScore + userExam.thinkingScore;

        // 保存更新后的用户考试数据
        await userExam.save();

        res.status(200).json({ message: '阅卷保存成功' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/delete', async (req, res) => {
    try {
        const {userExamId} = req.body;
        const userExam = await UserExam.findById(userExamId);
        if (!req.session.userInfo.admin || !req.session.userInfo.adminPlus) {
            return res.status(403).json({ message: '非超级管理员无法操作' });
        }else if (!userExam) {
            // 根据 userExamId 查找用户考试数据
            return res.status(404).json({ message: '不存在该考试数据' });
        }

        // 删除用户考试数据
        await UserExam.findByIdAndRemove(userExamId);

        res.json({ message: '试卷删除成功' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//删除考核发布
router.delete('/deletePublish', async (req, res) => {
    try {
        const {ExamId} = req.body;
        if (!req.session.userInfo.admin || !req.session.userInfo.adminPlus) {
            return res.status(403).json({ message: '非超级管理员无法操作' });
        }
        // 根据 userExamId 查找用户考试数据
        const isExam = await Exam.findById(ExamId);
        if (!isExam) {
            return res.status(404).json({ message: '不存在该考核' });
        }

        // 删除用户考试数据
        await Exam.findByIdAndRemove(ExamId);

        res.json({ message: '考核删除成功' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/updateExamCreate', async (req, res) => {
    try {
        const { id,title,termTopic ,startTime,endTime } = req.body;
        // 根据 userExamId 查找用户考试数据
        const userExam = await Exam.findById(id);

        if (!id) {
            return res.status(404).json({ message: '修改成功' });
        }

        // 更新字段
        userExam.title=title||userExam.title
        userExam.termTopic=termTopic || userExam.termTopic
        userExam.startTime = startTime || userExam.startTime;
        userExam.endTime = endTime || userExam.endTime;


        // 保存更新后的用户考试数据
        await userExam.save();

        res.status(200).json({ message: '更改成功' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get("/searchExam", async (req, res) => {
    const { query } = req.query;

    try {
        const results = await Exam.searchExam(query);
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
module.exports = router
