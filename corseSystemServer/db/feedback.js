const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

const feedbackSchema = new Schema({
    faculty: { type: String, required: true }, // 学院
    account: { type: String, required: true }, // 当前账号(学号)
    name: { type: String, required: true }, // 姓名
    sex: { type: String, required: true }, // 性别
    studentId: { type: String, required: true }, // 学号
    grade: { type: String, required: true }, // 年级
    classes: { type: String, required: true }, // 班级
    level: { type: String, required: true }, // 层次
    phone: { type: String, required: true }, // 手机号码
    counsellor: { type: String, required: true }, // 辅导员
    description: { type: String, required: true }, // 问题描述
    isRead: { type: Boolean, default: false }, // 是否已读
    createdAt: { type: Date, default: Date.now }, // 创建时间
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    },
    updatedAt: { type: Date, default: Date.now } // 更新时间
});
feedbackSchema.plugin(softDeletePlugin);
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
