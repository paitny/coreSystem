const express = require("express")
const router = express.Router()
const trendDB= require("../../db/trends")

const path = require("path")
const fs = require("fs");


//活动删除
router.delete("/delete", async (req, res) => {
    let {id,imageArr} = req.body
    try{
    // 遍历每个图片路径，删除对应的文件
    imageArr.forEach(imagePath => {
        try {
            fs.unlinkSync(path.resolve(__dirname, "../../public" + imagePath.filename)); // 删除文件

        } catch (err) {
            console.error(`Error deleting: ${imagePath}`);
        }
    });
    await trendDB.findByIdAndRemove(id)

        return res.send({
            code: 0,
            msg: "删除完成"
        })}catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }


})


module.exports = router
