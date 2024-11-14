const mongoose = require("mongoose")
let Schema = mongoose.Schema
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

let noticeSchema = new Schema({


    noticeComment:{
        type:String,
        required: true
    },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    },
    //发布日期
    date: {
        type: Number,
        default: Date.now
    }
})
noticeSchema.plugin(softDeletePlugin);
module.exports = mongoose.model("notice", noticeSchema)







