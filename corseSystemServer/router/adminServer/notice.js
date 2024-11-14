const express = require("express")
const router = express.Router()

const noticeDB = require("../../db/notice")
const visitorDB = require("../../db/visitor");
//发布通知
router.post('/', async (req, res) => {
    try {
        const {noticeComment} = req.body
       await noticeDB.create({noticeComment})
        res.send({
            code:200,
            msg:"发布成功"
        })
    } catch (error) {

        res.status(500).json({
            success: false,
            error: '服务器错误',
        });
    }
});
router.get('/get', async (req, res) => {
    try {
        let {page, perPage} = req.query
        let pages = +page || 1
        let perPages = +perPage || 5
        const total = await noticeDB.countDocuments()
        let doc = await noticeDB
            .find({}, {}, {sort: {date: -1},skip: perPages * (pages - 1),
                limit: perPages,})

        res.send({
            code:200,
            msg:"获取成功",
            data:doc,total
        })
    } catch (error) {

        res.status(500).json({
            success: false,
            error: '服务器错误',
        });
    }
});


module.exports = router



