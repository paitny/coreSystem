const express = require("express")
const router = express.Router()
const userDB = require("../../db/user")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//鉴权
// router.use((req, res, next) => {
//     const authHeader = req.headers.authorization
//     console.log(req.headers.id)
//     let doc =  userDB.findById(req.headers.id)
//     const token = authHeader && authHeader.split(' ')[1];
//     console.log(token)
//     if (!token||!req.headers.id) {
//         return res.send({code:0, msg: '用户未登录'});  // 未授权
//     }
//
//     jwt.verify(token, doc.secret, (err) => {
//         if (err) {
//             return res.send({code:2, msg: '验证失败'}); // Token 验证失败
//         }
//         res.send({code:1, msg: '用户已登录'});
//     })
//     next()
// })

//用户名修改
router.post("/user", async (req, res) => {
    let {user} = req.body
try{
    //验证符不符合规则
    if (!/^[\w\u4e00-\u9fa5\u0800-\u4e00\uac00-\ud7ff]{2,8}$/.test(user)) {
        return res.send({
            code: 1,
            msg: "用户名格式不正确"
        })
    }

    //验证新旧用户名是否一样
    if (user === req.session.userInfo.user) {
        return res.send({
            code: 7,
            msg: "新用户名与原用户名相同"
        })
    }

    //验证用户名是否已存在
    let doc = await userDB.findOne({user})
    if (doc) {
        return res.send({
            code: 2,
            msg: "用户已存在"
        })
    }

    //修改用户名
    await userDB.findByIdAndUpdate(req.session.userInfo._id, {user})
    //更新session
    req.session.userInfo.user = user
    //返回前端
    res.send({
        code: 0,
        msg: "用户名修改完成",
        data: req.session.userInfo
    })} catch (error) {
    console.error(error);
    res.status(500).json({ message: '内部服务器错误' });
}
})

//密码修改
router.post("/pass", async (req, res) => {
    let {oldPass, pass} = req.body
    try{
    let _id = req.session.userInfo._id

    //先验证新密码格式
    if (!/^[\w\[\]\/\\~`|<>,.?;':"{}!@#$%^&*()_+=-]{6,18}$/.test(pass)){
        return res.send({
            code: 1,
            msg: "密码格式错误"
        })
    }

    //旧密码对不对
    let doc = await userDB.findById(_id)
    if (doc.pass !== oldPass){
        return res.send({
            code: 5,
            msg: "原密码不正确"
        })
    }

    //新密码与旧密码一样
    if (oldPass === pass){
        return res.send({
            code: 8,
            msg: "新旧密码相同"
        })
    }

    //修改密码
    await userDB.findByIdAndUpdate(_id,{pass})
    //销毁session
    req.session.destroy()
    //返回前端
    res.send({
        code: 0,
        msg: "密码修改成功"
    })} catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }

})
//用户信息修改
router.post("/userInfo", async (req, res) => {
    let {id,nickName,phone} = req.body
    try{
    await userDB.findByIdAndUpdate(id, {nickName,phone})
    //返回前端
    res.send({
        code: 0,
        msg: "修改成功"
    })} catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }

})
//批量去空格
router.post('/removeWhitespaces', async (req, res) => {
    try {
        // 获取所有用户
        const users = await userDB.find();

        // 使用修剪后的字符串字段更新每个用户
        const updatedUsers = await Promise.all(users.map(async (user) => {
            const updatedUser = await userDB.findByIdAndUpdate(
                user._id,
                {
                    $set: {
                        user: user.user.trim(),
                        name: user.name.trim(),
                        nickName: user.num.trim(),
                        // 根据需要添加其他字段
                    }
                },
                { new: true } //返回更新后的文档
            );
            return updatedUser;
        }));

        res.json({ success: true, message: 'Whitespaces removed successfully', updatedUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


router.post('/resetPasswords', async (req, res) => {
    try {
        // Find all users
        const users = await userDB.find();

        // 使用新的散列密码（用户字段的最后六个字符）更新每个用户
        const updatedUsers = await Promise.all(users.map(async (user) => {
            const newPassword = user.user.slice(-6); // 获取用户字段的最后六个字符


            const updatedUser = await userDB.findByIdAndUpdate(
                user._id,
                {
                    $set: {
                        pass: newPassword,
                    }
                },
                { new: true } // 返回更新后的文档
            );
            return updatedUser;
        }));

        res.json({ success: true, message: 'Passwords reset successfully', updatedUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

//头像上传
router.use("/photo", require("./uploadPhoto"))

//小程序密码修改
router.post('/change-password', async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        console.log(userId, currentPassword, newPassword)
        // 通过userId查找用户
        const user = await userDB.findById(userId);

        // 检查提供的当前密码是否与存储的哈希密码匹配
        const isPasswordValid = await bcrypt.compare(currentPassword, user.pass);

        if (!isPasswordValid) {
            return res.status(401).json({ message: '当前密码不正确' });
        }

        // 哈希新密码并更新数据库中用户的密码
        const hashedNewPassword = newPassword
        user.pass = hashedNewPassword;

        // 保存更新后的用户对象
        await user.save();

        res.status(200).json({ message: '密码修改成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
});

module.exports = router



