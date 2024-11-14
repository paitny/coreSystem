const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

// 定义学生课程模型
const aiCourseSchema = new mongoose.Schema({
    courseInfoId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "ClassInfo"
    },
    // 学期
    termName: {
        type: String,
        default: "暂无"
    },
    // 年级
    grade: {
        type: String,
        required: true
    },
    // 班级
    className: {
        type: String,
        required: true
    },
    // 层次
    level: {
        type: String,
        required: true
    },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    },
    // 课程列表
    coursesList: [
        {
            // 课程名
            name: {
                type: String,
                default: "暂无"
            },
            // 课程编码
            num: {
                type: String,
                default: "暂无"
            },
            // 学分
            credit: {
                type: String,
                default: "暂无"
            },
            // 总课时
            totalHours: {
                type: String,
                default: "暂无"
            },
            lectureHours: {
                type: String,
                default: "暂无"
            },
            computeHours: {
                type: String,
                default: "暂无"
            },
            // 课程类别
            category: {
                type: String,
                default: "暂无"
            },
            // 教学方法
            teachMethod: {
                type: String,
                default: "暂无"
            },
            // 考试方法
            method: {
                type: String,
                default: "暂无"
            },
            // 教师
            teacher: {
                type: String,
                default: "暂无"
            },
            // 周次
            weeks: {
                type: [Number],
                default: [0] // 默认为一个空数组
            },
            // 节次
            section: {
                type: Number,
                default: 0 // 默认为0
            },
            // 上课地点
            address: {
                type: String,
                default: "暂无"
            },
            // 节次原始数据
            rawWeeks: {
                type: String,
                default: "暂无"
            },
            rawSection: {
                type: String,
                default: "暂无"
            },
            // 星期几
            week: {
                type: Number,
                default: 0 // 默认为0
            },
            // 连续几节
            sectionCount: {
                type: Number,
                default: 0 // 默认为0
            },
        },
    ],
});
aiCourseSchema.plugin(softDeletePlugin);


module.exports = mongoose.model("aiCourse", aiCourseSchema);
