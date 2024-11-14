const express = require("express")
const userDB = require("../../db/user");
const newsDB=require("../../db/news")
const musicDB=require("../../db/music")
const visitorDB=require("../../db/visitor")
const  trendsDB=require("../../db/trends")
const volunteerDB=require("../../db/volunteer")
const studentOrgDB=require("../../db/studentOrg")
const departmentDB=require("../../db/department")
const alumnusDB=require("../../db/alumnus")
const publishedIssuesDB=require("../../db/publishedIssues")
const router = express.Router()
// 返回前端路由表
router.get('/', async (req, res) => {
    try{
    let userCount=await userDB.countDocuments({})
    let newsCount=await newsDB.countDocuments({})
    let musicCount=await musicDB.countDocuments({})
    let visitorCount=await visitorDB.countDocuments({})
    let trendsCount=await trendsDB.countDocuments({})
    let volunteerCount=await volunteerDB.countDocuments({})
    let studentOrgCount=await studentOrgDB.countDocuments({})
    let departmentCount=await departmentDB.countDocuments({})
    let alumnusCount=await alumnusDB.countDocuments({})
    let publishedIssuesCount=await publishedIssuesDB.countDocuments({})
    res.send({
        msg:"请求成功",
        data:{userCount,newsCount,musicCount,visitorCount,trendsCount,volunteerCount,studentOrgCount,departmentCount,alumnusCount,publishedIssuesCount}
    })} catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

module.exports = router



