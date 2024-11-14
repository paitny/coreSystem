const mongoose = require("mongoose")
let Schema = mongoose.Schema
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件
let alumnusSchema = new Schema({
    //姓名
    name: {
        type: String,
        default: "暂无"
    },
    //头像
    photo: {
        type: String,
        default: "/file/photo/default.jpg"
    },
    //年级
    grade: {
        type: String,
        default: '暂无'
    },
    classes: {
        type: String,
        default: "无"
    },
    //职位
    position: {
        type: String,
        default: "普通用户"
    },
    //性别
    sex: {
        type: String,
        default: "暂无"
    },
    salary:{
        type: String,
        default: "暂无"
    },
    description:{
        type: String,
        default: "暂无"
    },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    },
    date: {
        type: Number,
        default: Date.now
    }

})
alumnusSchema.plugin(softDeletePlugin);
alumnusSchema.statics.searchUser = function (query) {
    const regExpQuery = new RegExp(query, "i"); // 创建不区分大小写的正则表达式
    return this.find({
        $or: [
            { name: regExpQuery },
            { num: regExpQuery },
            { position: regExpQuery },
            { grade: regExpQuery },
            { classes: regExpQuery },
        ],
    })
        .sort({ date: -1 }) // 根据日期降序排序
        .exec();
};
module.exports = mongoose.model("alumnus", alumnusSchema)







