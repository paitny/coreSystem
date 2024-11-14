const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const newsDB = require("../../db/news")
const fs = require("fs");
const { log } = require("console")
const activityDB = require("../../db/activity");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/file/uploads')); // 将文件保存到 'uploads' 文件夹
    },
    //文件的名字
    filename(req, file, cb) {
        let {ext} = path.parse(file.originalname)
        req.conent_name = `conent-${Date.now()}${ext}`
        cb(null, req.conent_name)
    }
});

const upload = multer({ storage });

let cover_upload = multer({
    storage: multer.diskStorage({
        //文件存储的目录
        destination(req, file, cb) {
            cb(null, path.join(__dirname, '../../public/file/cover'))
        },
        //文件的名字
        filename(req, file, cb) {
            let {ext} = path.parse(file.originalname)
            req.cover_name = `cover-${Date.now()}${ext}`
            cb(null, req.cover_name)
        }
    })
}).single('file')

router.post('/upload', upload.single('upload'), (req, res) => {
    try {
        const staticURL = process.env.NODE_ENV === "development" ? '' : 'https://wypty.cn'
        console.log(staticURL);
        // 文件上传成功后，req.file 包含上传的文件信
        const fileUrl = `${staticURL}/static/file/uploads/${req.conent_name}`; // 文件的 URL

        // 返回成功响应
        res.status(200).json({
            success: true,
            url: fileUrl,
        });
    } catch (error) {
        // 处理错误
        console.error(error);
        res.status(500).json({
            success: false,
            error: '文件上传失败',
        });
    }
});

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
            url: `/file/cover/${req.cover_name}`
        })
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})


router.post("/conentCover", (req, res) => {
    try{
    conent_upload(req, res, async (err) => {
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
            urls: `/file/cover/${req.conent_name}`
        })
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
//文章发表
router.post("/add", async (req, res) => {
    let {title, des, cover, radio} = req.body
try{
    let doc = await newsDB.create({
        title: title || undefined,
        des: des || undefined,
        cover: cover || undefined,
        author: req.session.userInfo.user,
        class: radio ||undefined
    })

    res.send({
        code: 0,
        msg: "文章发表成功",
        data: {id: doc._id}
    })}catch (error) {
    console.error(error);
    res.status(500).json({ message: '内部服务器错误' });
}
})

//文章修改
router.post("/update", async (req, res) => {
    let {id, doc, mdUrl} = req.body
    try{
    console.log(id,doc)
    if (!mdUrl) {
        await newsDB.findByIdAndUpdate(id, doc)
        return res.send({
            code: 0,
            msg: "修改成功"
        })
    } else if (mdUrl === "/file/cover/default.jpg") {
        await newsDB.findByIdAndUpdate(id, doc)
        return res.send({
            code: 0,
            msg: "修改成功"
        })
    }
    let url = path.resolve(__dirname, "../../public" + mdUrl)
    fs.unlinkSync(url)
    await newsDB.findByIdAndUpdate(id, doc)

    res.send({
        code: 0,
        msg: "修改成功"
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

//文章删除
router.delete("/delete", async (req, res) => {
    let {id, newsCover} = req.body
    try{
    let coverUrl = path.resolve(__dirname, "../../public" + newsCover)
    if (newsCover === "/file/cover/default.jpg") {
        await newsDB.findByIdAndRemove(id)
        return res.send({
            code: 0,
            msg: "删除完成"
        })
    }

    await newsDB.findByIdAndRemove(id)

    res.send({
        code: 0,
        msg: "删除完成"
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

router.get("/searchNews", async (req, res) => {
    const { query } = req.query;

    try {
        const results = await newsDB.searchNews(query);
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



