const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

const userExamSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    examineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    termTopic:{type: String, default: "暂无"},
    examData: {
        singleChoiceQuestions: [
            {
                id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
                text: { type:String,  required: true },
                options:{type:Array,required:true},
                answer: { type: String, default: "未作答" },
                correctAnswer:{ type: String, default: "略" },
            },
        ],
        fillInTheBlankQuestions: [
            {
                id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
                text: { type:String,  required: true },
                answer: { type: String, default: "未作答" },
                correctAnswer:{ type: String, default: "略" },
            },
        ],
        essayQuestions: [
            {
                id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
                text: { type:String,  required: true },
                answer: { type: String, default: "未作答" },
                correctAnswer:{ type: String, default: "略" }
            },
        ],
        thinkingQuestions:[
            {
                id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
                text: { type:String,  required: true },
                answer: { type: String, default: "未作答" },
                correctAnswer:{ type: String, default: "略" },
            },
        ],
        // 添加其他题型的字段...
    },
    singleChoiceScore: { type: Number, default: 0 },
    fillScore: { type: Number, default: 0 },
    essayScore: { type: Number, default: 0 },
    thinkingScore: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    reviewer:{type: String, default: "暂无"},
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
});
userExamSchema.plugin(softDeletePlugin);
module.exports = mongoose.model('UserExam', userExamSchema);
