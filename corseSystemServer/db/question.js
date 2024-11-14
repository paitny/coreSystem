// models/question.js
const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

const optionSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    }
});
optionSchema.plugin(softDeletePlugin);
const questionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['single-choice', 'fill-in-the-blank', 'essay','thinking'],
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    //考核对象
    targetsUser:{
        type: String,
        required: true,
    },
    options: {
        type: [optionSchema], // 修改为包含选项详细信息的数组
    },
    answer: {
        type: String,
    },
    publicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});
questionSchema.plugin(softDeletePlugin);
module.exports = mongoose.model('Question', questionSchema);
