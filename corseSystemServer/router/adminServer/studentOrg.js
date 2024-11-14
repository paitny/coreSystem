const express = require('express');
const router = express.Router();
const Department = require('../../db/department'); // 替换成你的模型路径
const StudentOrg = require('../../db/studentOrg');
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // 替换成你的模型路径


let SOCover_upload = multer({
    storage: multer.diskStorage({
        //文件存储的目录
        destination(req, file, cb) {
            cb(null, path.join(__dirname, '../../public/file/studentOrgCover'))
        },
        //文件的名字
        filename(req, file, cb) {
            let {ext} = path.parse(file.originalname)
            req.studentOrgCover_name = `studentOrgCover-${Date.now()}${ext}`
            cb(null, req.studentOrgCover_name)
        }
    })
}).single('file')

//上传cover封面图
router.post("/cover", (req, res) => {
    try{
    SOCover_upload(req, res, async (err) => {
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
            url: `/file/studentOrgCover/${req.studentOrgCover_name}`
        })
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})


router.post('/create', async (req, res) => {
    try {
        const {due, description, cover, name} = req.body;

        const newStudentOrg = new StudentOrg({due, description, name, cover});

        const savedStudentOrg = await newStudentOrg.save();
        res.status(201).json({msg: "创建机构成功"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: '无法创建学生组织'});
    }
});
// 创建部门
router.post('/departments', async (req, res) => {
    try {
        const {studentOrgId, name, description, qq, weibo, email, phone, leader, cover, poster} = req.body;
        console.log(poster)
        const newDepartment = new Department({
            studentOrgId,
            name,
            description: description || "暂无",
            qq: qq || "暂无",
            weibo: weibo || "暂无",
            email: email || "暂无",
            phone: phone || "暂无",
            leader: leader || "暂无",
            cover: cover || undefined,
            poster: poster || undefined
        });

        await newDepartment.save();

        res.status(201).json({msg: "创建部门成功"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: '无法创建部门'});
    }
});
router.post("/update", async (req, res) => {
    let {id, doc, mdUrl} = req.body
    try{
    if (!mdUrl) {
        await StudentOrg.findByIdAndUpdate(id, doc)
        return res.send({
            code: 0,
            msg: "修改成功"
        })
    } else if (mdUrl === "/file/studentOrgCover/default.jpg") {
        await StudentOrg.findByIdAndUpdate(id, doc)
        return res.send({
            code: 0,
            msg: "修改成功"
        })
    }
    let url = path.resolve(__dirname, "../../public" + mdUrl)
    fs.unlinkSync(url)
    await StudentOrg.findByIdAndUpdate(id, doc)

    res.send({
        code: 0,
        msg: "修改成功"
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
//活动删除
router.delete("/delete", async (req, res) => {
    let {id, orgCover} = req.body
   try{
    let coverUrl = path.resolve(__dirname, "../../public" + orgCover)
    if (orgCover === "/file/studentOrgCover/default.jpg") {
        await StudentOrg.findByIdAndRemove(id)
        return res.send({
            code: 0,
            msg: "删除完成"
        })
    }
    await fs.unlinkSync(coverUrl)
    await StudentOrg.findByIdAndRemove(id)

    res.send({
        code: 0,
        msg: "删除完成"
    })}catch (error) {
       console.error(error);
       res.status(500).json({ message: '内部服务器错误' });
   }
})
router.post("/updateDepartment", async (req, res) => {
    let {id, doc, mdUrl} = req.body
    try{
    if (!mdUrl) {
        await Department.findByIdAndUpdate(id, doc)
        return res.send({
            code: 0,
            msg: "修改成功"
        })
    } else if (mdUrl === "/file/studentOrgCover/default.jpg") {
        await Department.findByIdAndUpdate(id, doc)
        return res.send({
            code: 0,
            msg: "修改成功"
        })
    }
    let url = path.resolve(__dirname, "../../public" + mdUrl)
    fs.unlinkSync(url)
    await Department.findByIdAndUpdate(id, doc)

    res.send({
        code: 0,
        msg: "修改成功"
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
router.delete("/deleteDepartment", async (req, res) => {
    let {id, departmentUrl} = req.body
    try{
    let coverUrl = path.resolve(__dirname, "../../public" + departmentUrl)
    if (departmentUrl === "/file/studentOrgCover/default.jpg") {
        await Department.findByIdAndRemove(id)
        return res.send({
            code: 0,
            msg: "删除完成"
        })
    }
    await fs.unlinkSync(coverUrl)
    await Department.findByIdAndRemove(id)

    res.send({
        code: 0,
        msg: "删除完成"
    })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
module.exports = router;
