// models/exam.js

const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    termTopic:{type: String, default: "暂无"},
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    },
    date: {
        type: Number,
        default: Date.now
    },
});
examSchema.plugin(softDeletePlugin);
examSchema.statics.searchExam = function (query) {
    const regExpQuery = new RegExp(query, "i"); // 创建不区分大小写的正则表达式
    return this.find({
        $or: [
            { title: regExpQuery }
        ],
    })
        .sort({ date: -1 }) // 根据日期降序排序
        .exec();
};
const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
