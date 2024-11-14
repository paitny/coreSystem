const express = require('express');
const router = express.Router();
const Alumnus = require('../../db/alumnus');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
let alumnusCover_upload = multer({
    storage: multer.diskStorage({
        //文件存储的目录
        destination(req, file, cb) {
            cb(null, path.join(__dirname, '../../public/file/alumnusCover'))
        },
        //文件的名字
        filename(req, file, cb) {
            let { ext } = path.parse(file.originalname)
            req.alumnusCover_name = `alumnusCover-${Date.now()}${ext}`
            cb(null, req.alumnusCover_name)
        }
    })
}).single('file')

//上传cover封面图
router.post("/cover", (req, res) => {
    try{
    alumnusCover_upload(req, res, async (err) => {
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
            url: `/file/alumnusCover/${req.alumnusCover_name}`
        })
    })} catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
// 创建新校友记录
router.post('/create', async (req, res) => {
    try {
        const { name, cover, grade, classes, description,position, sex ,salary} = req.body;

        // 创建新校友实例
        const newAlumnus = new Alumnus({
            name,
            photo:cover||undefined,
            grade,
            classes,
            position,
            description,
            sex,
            salary
        });

        // 将新校友记录保存到数据库
        const savedAlumnus = await newAlumnus.save();

        res.status(201).json(savedAlumnus); //将新校友记录保存到数据库
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post("/update", async (req, res) => {
    let {id, doc, mdUrl} = req.body
    try{
    if (!mdUrl) {
        await Alumnus.findByIdAndUpdate(id, doc)
        return res.send({
            code: 0,
            msg: "修改成功"
        })
    } else if (mdUrl === "/file/studentOrgCover/default.jpg") {
        await Alumnus.findByIdAndUpdate(id, doc)
        return res.send({
            code: 0,
            msg: "修改成功"
        })
    }else if(!url){

    }
    let url = path.resolve(__dirname, "../../public" + mdUrl)
    fs.unlinkSync(url)
    await Alumnus.findByIdAndUpdate(id, doc)

    res.send({
        code: 0,
        msg: "修改成功"
    })} catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
//活动删除
router.delete("/delete", async (req, res) => {
    let {id, alumnusCover} = req.body
   try{
    let coverUrl = path.resolve(__dirname, "../../public" + alumnusCover)
    if (alumnusCover === "/file/studentOrgCover/default.jpg") {
        await Alumnus.findByIdAndRemove(id)
        return res.send({
            code: 0,
            msg: "删除完成"
        })
    }

    await Alumnus.findByIdAndRemove(id)

    res.send({
        code: 0,
        msg: "删除完成"
    })} catch (error) {
       console.error(error);
       res.status(500).json({ message: '内部服务器错误' });
   }
})
module.exports = router;
