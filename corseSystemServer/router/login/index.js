const express = require("express")
const router = express.Router()
const userDB = require("../../db/user")
const visitorDB = require("../../db/visitor")
//用户密码加密
const bcrypt = require("bcrypt")
//生成token
const jwt = require("jsonwebtoken")
//中间件
// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (token == null) {
//         return res.sendStatus(401); // 未授权
//     }
//
//     jwt.verify(token, req.secret, (err, user) => {
//         if (err) {
//             return res.sendStatus(403); // Token 验证失败
//         }
//
//         req.user = user; // 将用户信息保存在 req 对象中
//         next();
//     });
// }
//添加访客
async function addVisitor(req) {
    try {
        let userID = req.session.userInfo._id;

        // 检查用户是否已经有“网页版”记录
        let web = await visitorDB.findOne({visitor: userID, userType: "网页版"});

        if (web) {
            // 如果用户已经有“网页版”记录，更新访问日期
            await visitorDB.findOneAndUpdate({visitor: userID, userType: "网页版"}, {date: Date.now()});
        } else {
            // 如果用户没有“网页版”记录，添加“网页版”记录
            await visitorDB.create({
                visitor: userID,
                userType: "网页版"
            });
        }
    } catch (e) {
        // 处理错误
        console.log(e);
    }
}

async function addMinVisitor(req) {
    try {
        let userID = req._id;

        // 先看存没存当前用户的小程序记录
        let miniProgramDoc = await visitorDB.findOne({visitor: userID, userType: "小程序"});

        if (miniProgramDoc) {
            // 用户已存在小程序记录，更新访问日期
            await visitorDB.findOneAndUpdate({visitor: userID, userType: "小程序"}, {date: Date.now()});
        } else {
            // 不存在小程序记录，添加小程序记录
            await visitorDB.create({
                visitor: userID,
                userType: "小程序"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
}


//登录
router.post("/", async (req, res) => {
    try {


        let {user, pass} = req.body

        //验证数据格式
        if (
            !/^[\w\u4e00-\u9fa5\u0800-\u4e00\uac00-\ud7ff()（）]{2,15}$/.test(user) ||
            !/^[\w\[\]\/\\~`|<>,.?;':"{}!@#$%^&*()_+=-]+$/.test(pass)
        ) {
            return res.send({
                code: 1,
                msg: "数据格式错误"
            });
        }

        //验证用户名和密码
        let doc = await userDB.findOne({user})

        //用户不存在
        if (!doc) {
            return res.send({
                code: 3,
                msg: "用户不存在"
            })
        }
        //验证密码是否正确
        const IsLoginPassword = bcrypt.compareSync(pass, doc.pass)
        //验证密码
        if (!IsLoginPassword) {
            return res.send({
                code: 5,
                msg: "密码错误"
            })
        }
//生成token值
        let token = jwt.sign({id: String(doc._id)}, doc.secret)
        //登录成功
        let userInfo = {
            user: doc.user,
            _id: doc._id,
            photo: doc.photo,
            admin: doc.admin,
            token: token,
            adminPlus: doc.adminPlus,
            sex: doc.sex,
            phone: doc.phone,
            institution:doc.institution,
            position: doc.position,
            name: doc.name
        }
        req.session.userInfo = userInfo

        //更新visitor
        await addVisitor(req)
        res.send({
            code: 0,
            msg: "登录成功",
            data: userInfo
        })
    } catch (error) {
        res.status(500).json({code: 500, msg: '服务器内部错误', error: error.message});
    }
})

//检测是否登录
router.post("/check", async (req, res) => {
    try {
        let data = req.session.userInfo
        if (data) {
            //更新visitor
            await addVisitor(req)
            //登录过的
            res.send({
                code: 0,
                msg: "已经登录",
                data
            })
        } else {
            //没有登陆过的
            res.send({
                code: 1,
                msg: "未登录",
                data: {}
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
})
//退出登录
router.post("/out", (req, res) => {
    try {
        req.session.destroy() //销毁session
        res.send({
            code: 0,
            msg: "退出登录完成"
        })
    } catch (error) {
        res.status(500).json({code: 500, msg: '服务器内部错误', error: error.message});
    }
})
//小程序登录接口
// router.post("/min", async (req, res) => {
//     try {
//         let {user, pass, province} = req.body
//
//         //验证数据格式
//         if (
//             !/^[\w\u4e00-\u9fa5\u0800-\u4e00\uac00-\ud7ff()（）]{2,15}$/.test(user) ||
//             !/^[\w\[\]\/\\~`|<>,.?;':"{}!@#$%^&*()_+=-]+$/.test(pass)
//         ) {
//             return res.send({
//                 code: 1,
//                 msg: "数据格式错误"
//             });
//         }
//
//         //验证用户名和密码
//
//         let doc = await userDB.findOne({user})
//
//         //用户不存在
//         if (!doc) {
//             return res.send({
//                 code: 3,
//                 msg: "用户不存在"
//             })
//         }
//         //验证密码是否正确
//         const IsLoginPassword = bcrypt.compareSync(pass, doc.pass)
//         //验证密码
//         if (!IsLoginPassword) {
//             return res.send({
//                 code: 5,
//                 msg: "密码错误"
//             })
//         }
//         let token = jwt.sign({id: String(doc._id)}, doc.secret, {expiresIn: '90d'})
//         req.token = token
//         req.secret = doc.secret
//         await addMinVisitor(doc)
//         await userDB.findOneAndUpdate({user: user}, {$set: {province: province}}, {upsert: true, new: true})
//         res.send({
//             code: 0,
//             msg: "登录成功",
//             data: {token, doc}
//         })
//     } catch (error) {
//         res.status(500).json({code: 500, msg: '服务器内部错误', error: error.message});
//     }
// })

router.post("/min", async (req, res) => {
    try {
        let {user, pass, province} = req.body

        //验证数据格式
        if (
            !/^[\w\u4e00-\u9fa5\u0800-\u4e00\uac00-\ud7ff()（）]{2,15}$/.test(user) ||
            !/^[\w\[\]\/\\~`|<>,.?;':"{}!@#$%^&*()_+=-]+$/.test(pass)
        ) {
            return res.send({
                code: 1,
                msg: "数据格式错误"
            });
        }

        //验证用户名和密码
        let doc = await userDB.findOne({user})

        //用户不存在
        if (!doc) {
            return res.send({
                code: 3,
                msg: "用户不存在"
            })
        }

        //验证密码是否正确
        const IsLoginPassword = bcrypt.compareSync(pass, doc.pass)
        //验证密码
        if (!IsLoginPassword) {
            return res.send({
                code: 5,
                msg: "密码错误"
            })
        }

        let token = jwt.sign({id: String(doc._id)}, doc.secret, {expiresIn: '90d'})
        req.token = token
        req.secret = doc.secret

        try {
            await addMinVisitor(doc)
        } catch (error) {
            console.error('Error in addMinVisitor:', error)
        }

        try {
            await userDB.findOneAndUpdate({user: user}, {$set: {province: province}}, {upsert: true, new: true})
        } catch (error) {
            console.error('Error in userDB.findOneAndUpdate:', error)
        }

        res.send({
            code: 0,
            msg: "登录成功",
            data: {token, doc}
        })
    } catch (error) {
        console.error('Error in /min route:', error)
        res.status(500).json({code: 500, msg: '服务器内部错误', error: error.message});
    }
})

router.post('/min/check', async (req, res) => {
    try {

        // 用户已登录，可以使用 req.user 中的信息进行处理
        let {id, province} = req.body
        console.log(id,province)
        const authHeader = req.headers.authorization


        const token = authHeader && authHeader.split(' ')[1];
        if (!token || !id) {
            return res.send({code: 0, msg: '用户未登录'});  // 未授权
        }
        await userDB.findByIdAndUpdate(id, { $set: { province: province } }, { new: true })
        let doc = await userDB.findById(id)
        console.log(doc)
        jwt.verify(token, doc.secret, (err) => {
            if (err) {
                return res.send({code: 2, msg: '验证失败'}); // Token 验证失败
            }
            addMinVisitor(doc)
            res.send({code: 1, msg: '用户已登录', data: doc});
        })
    } catch (error) {
        res.status(500).json({code: 500, msg: '服务器内部错误', error: error.message});
    }
})

// router.post('/min/check', async (req, res) => {
//     try {
//         const authHeader = req.headers.authorization;
//
//         if (!authHeader) {
//             return res.status(401).json({ code: 0, msg: '用户未登录' });
//         }
//
//         const token = authHeader.split(' ')[1];
//         if (!token) {
//             return res.status(401).json({ code: 0, msg: '用户未登录' });
//         }
//
//         const { id, province } = req.body;
//
//         if (!id || !province) {
//             return res.status(400).json({ code: 0, msg: '请求参数不完整' });
//         }
//
//         // 查询用户信息
//         const doc = await userDB.findById(id);
//         if (!doc) {
//             return res.status(404).json({ code: 0, msg: '用户不存在' });
//         }
//
//         // 验证Token
//         jwt.verify(token, doc.secret, (err) => {
//             if (err) {
//                 return res.status(403).json({ code: 2, msg: 'Token验证失败' });
//             }
//
//             // 更新用户省份信息
//             userDB.findByIdAndUpdate(id, { $set: { province: province } }, { upsert: true, new: true })
//                 .then(updatedUser => {
//                     // 处理最小化访客
//                     addMinVisitor(updatedUser);
//                     res.status(200).json({ code: 1, msg: '用户已登录', data: updatedUser });
//                 })
//                 .catch(updateError => {
//                     res.status(500).json({ code: 3, msg: '更新用户信息失败', error: updateError.message });
//                 });
//         });
//     } catch (error) {
//         res.status(500).json({ code: 500, msg: '服务器内部错误', error: error.message });
//     }
// });

module.exports = router



















