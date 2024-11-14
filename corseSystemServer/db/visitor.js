const mongoose = require("mongoose")
let Schema = mongoose.Schema
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

let visitorSchema = new Schema({

    //存用户id
    visitor: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    userType: {
        type: String,
        require: true
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
visitorSchema.plugin(softDeletePlugin);
// 添加复合唯一索引
visitorSchema.index({ visitor: 1, userType: 1 }, { unique: true });
module.exports = mongoose.model("visitor", visitorSchema)







