const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const musicDB = require("../../db/music")
const fs = require("fs");


let music_upload = multer({
    storage: multer.diskStorage({
        //文件存储的目录
        destination(req, file, cb) {
            cb(null, path.join(__dirname, '../../public/file/music'))
        },
        //文件的名字
        filename(req, file, cb) {
            let {ext} = path.parse(file.originalname)
            req.music_name = `music-${Date.now()}${ext}`
            cb(null, req.music_name)
        }
    })
}).single('file')
//歌词上传
let lyric_upload = multer({
    storage: multer.diskStorage({
        //文件存储的目录
        destination(req, file, cb) {
            cb(null, path.join(__dirname, '../../public/file/lyric'))
        },
        //文件的名字
        filename(req, file, cb) {
            let {ext} = path.parse(file.originalname)
            req.lyric_name = `lyric-${Date.now()}${ext}`
            cb(null, req.lyric_name)
        }
    })
}).single('file')
//封面上传
let cover_upload = multer({
    storage: multer.diskStorage({
        //文件存储的目录
        destination(req, file, cb) {
            cb(null, path.join(__dirname, '../../public/file/mcover'))
        },
        //文件的名字
        filename(req, file, cb) {
            let {ext} = path.parse(file.originalname)
            req.cover_name = `cover-${Date.now()}${ext}`
            cb(null, req.cover_name)
        }
    })
}).single('file')
//上传音乐
router.post("/musicAdd", (req, res) => {
    try{
    music_upload(req, res, async (err) => {
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
            msg: "音乐上传成功",
            url: `/file/music/${req.music_name}`
        })
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

//上传歌词
router.post("/lrc", (req, res) => {
    try{
    lyric_upload(req, res, async (err) => {
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
            msg: "歌词上传成功",
            url: `/file/lyric/${req.lyric_name}`
        })
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
//上传cover封面图
router.post("/cover", (req, res) => {
    try{
    cover_upload(req, res, async (err) => {
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
            url: `/file/mcover/${req.cover_name}`
        })
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
//音乐发表
router.post("/add", async (req, res) => {
    let {name, artist, url, lrc, cover, theme} = req.body
    try{
    let doc = await musicDB.create({
        name: name || undefined,
        artist: artist || undefined,
        url,
        lrc: lrc || undefined,
        cover: cover || undefined,
        theme: theme || undefined,
    })

    res.send({
        code: 0,
        msg: "音乐发布成功",
        data: {id: doc._id}
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
//音乐修改
router.post("/update", async (req, res) => {
    let {id, doc, musicUrl} = req.body
    try{
    let url = path.resolve(__dirname, "../../public" + musicUrl)
    if (musicUrl === "/file/mcover/default.jpg" || musicUrl === "/file/lyric/default.lrc" || !musicUrl) {
        await musicDB.findByIdAndUpdate(id, doc)
        return res.send({
            code: 0,
            msg: "修改成功"
        })
    }
    fs.unlinkSync(url)
    await musicDB.findByIdAndUpdate(id, doc)
    res.send({
        code: 0,
        msg: "修改成功"
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

//音乐删除
router.delete("/delete", async (req, res) => {
    let {id, mcUrl, mcCover, mcLrc} = req.body
    try{
    let musicUrl = path.resolve(__dirname, "../../public" + mcUrl)
    let musicCover = path.resolve(__dirname, "../../public" + mcCover)
    let musicLrc = path.resolve(__dirname, "../../public" + mcLrc)
    if (mcCover === "/file/mcover/default.jpg" || mcLrc==="/file/lyric/default.lrc") {
        fs.unlinkSync(musicUrl)
        await musicDB.findByIdAndRemove(id)
        return res.send({
            code: 0,
            msg: "删除完成"
        })
    }
    fs.unlinkSync(musicUrl)
    fs.unlinkSync(musicCover)
    fs.unlinkSync(musicLrc)
    await musicDB.findByIdAndRemove(id)
    res.send({
        code: 0,
        msg: "删除完成"
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})


module.exports = router



