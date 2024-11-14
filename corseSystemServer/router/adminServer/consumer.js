const express = require("express")
const router = express.Router()
//用户注销功能
const userDB = require("../../db/user");
const feedbackDB = require("../../db/feedback");
router.delete("/delete", async (req, res) => {
    let { id } = req.body
    try{
    if (!req.session.userInfo.admin || !req.session.userInfo.adminPlus) {
        return res.send({
            code: 12,
            msg: "你不是管理员和超级管理员，无法进行操作"
        })
    }
    await userDB.findByIdAndRemove(id)
    res.send({
        code: 0,
        msg: "删除完成"
    })} catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

//admin管理员设置
router.post("/admin", async (req, res) => {
    let { id, admin } = req.body
    try{
    if (!req.session.userInfo.admin || !req.session.userInfo.adminPlus) {
        return res.send({
            code: 12,
            msg: "你不是管理员和超级管理员，无法进行操作"
        })
    } else if (req.session.userInfo.admin === true && req.session.userInfo.adminPlus === true) {
        await userDB.findByIdAndUpdate(id, { admin })
        res.send({
            code: 0,
            msg: "添加管理成功"
        })
    }} catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }


})

// 创建重置密码的路由

// 创建重置密码的路由
router.post("/resetPass", async (req, res) => {
    try {
        // Check if the user has admin or adminPlus privileges
        if (!req.session.userInfo.admin && !req.session.userInfo.adminPlus) {
            return res.send({
                code: 12,
                msg: "你不是管理员和超级管理员，无法进行操作",
            });
        }

        // 获取请求中的用户ID、用户名、秘钥
        const { id, user, secret } = req.body;

        // 根据用户名和秘钥查找用户
        const existingUser = await userDB.findOne({ user, secret });

        if (!existingUser) {
            return res.status(404).json({ msg: '用户不存在或秘钥不匹配' });
        }

        // 获取新密码，为user字段后六位
        const newPassword = user.slice(-6);
        // 更新用户文档中的密码字段
        await userDB.findByIdAndUpdate(id, { pass: newPassword });

        return res.status(200).json({ msg: '密码已重置' });
    } catch (error) {
        console.error('重置密码失败:', error);
        return res.status(500).json({ msg: '重置密码失败' });
    }
});

// 用户搜索
router.get("/searchUser", async (req, res) => {
    const { query } = req.query;

    try {
        const results = await userDB.searchUser(query);
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
router.get("/searchUsersAppoint", async (req, res) => {
    try {
        const { grade, className, levels } = req.query;

        // 确保所有参数都存在
        if (!grade || !className || !levels) {
            return res.status(400).json({ message: "缺少必需的参数" });
        }

        // 执行查询
        const users = await userDB.find({ grade, class: className, levels });

        res.json(users);
    } catch (error) {
        console.error("查询用户时出错:", error);
        res.status(500).json({ message: "内部服务器错误" });
    }
});


// 创建重置密码的路由
router.post("/resetPassFeed", async (req, res) => {
    try {
        // Check if the user has admin or adminPlus privileges
        if (!req.session.userInfo.admin && !req.session.userInfo.adminPlus) {
            return res.send({
                code: 12,
                msg: "你不是管理员和超级管理员，无法进行操作",
            });
        }

        // 获取请求中的用户ID、用户名、秘钥
        const { id, user } = req.body;
        console.log(user)
        // 根据用户名和秘钥查找用户
        const existingUser = await userDB.findOne({ user: user });

        if (!existingUser) {
            return res.status(404).json({ msg: '用户不存在或秘钥不匹配' });
        }

        // 获取新密码，为user字段后六位
        const newPassword = user.slice(-6);
        // 更新用户文档中的密码字段
        const updatedUser = await userDB.findOneAndUpdate({ user: user }, { pass: newPassword }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ msg: '用户不存在或更新失败' });
        }

        // 更新 Feedback 文档中的 isRead 字段
        const updatedFeedback = await feedbackDB.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!updatedFeedback) {
            return res.status(404).json({ msg: '反馈信息不存在或更新失败' });
        }

        return res.status(200).json({ msg: '密码已重置' });
    } catch (error) {
        console.error('重置密码失败:', error);
        return res.status(500).json({ msg: '重置密码失败' });
    }
});


module.exports = router
