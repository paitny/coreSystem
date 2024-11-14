const mongoose = require("mongoose")
let Schema = mongoose.Schema
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

const topItemSchema =new Schema({
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'activity' // 关联到活动模型
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user' // 关联到用户模型
    },
    currentSemester: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    }
  
});
topItemSchema.plugin(softDeletePlugin);
// 中间件：在更新时自动更新 updatedAt 字段
topItemSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const TopItem = mongoose.model('TopItem', topItemSchema);

module.exports = TopItem;
