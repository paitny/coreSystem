const mongoose = require("mongoose")
let Schema = mongoose.Schema
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

let studentOrgSchema = new Schema({
    due: {
        type: String, required: true
    },
    name: {type: String, required: true},
    description: {
        type: String,
        default: "暂无"
    },
    cover:{
        type: String,
        default:"/file/studentOrgCover/default.jpg"
    },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    },
//日期
    date: {
        type: Number,
        default: Date.now
    }
})
studentOrgSchema.plugin(softDeletePlugin);
module.exports = mongoose.model("studentOrg", studentOrgSchema)







