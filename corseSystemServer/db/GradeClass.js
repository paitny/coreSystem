const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

// 定义年级、班级、层次模式
const GradeClassSchema = new Schema({
    grade: {
        type: String,
        required: true,
    },
    classNames: {
        type: [{ type: String }],
        required: true,
    },
    levels: {
        type: [{ type: String }],
        required: true,
    },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    },
    createdAt: {
        type: Date,
        default: Date.now // 使用默认值为当前时间
    }
});
GradeClassSchema.plugin(softDeletePlugin);

module.exports = mongoose.model("GradeClass", GradeClassSchema);
