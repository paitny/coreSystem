const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

// 创建一个 Schema
const courseFeedbackSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    photo: {
        type: Array,
        required:true
    },
    //学期
    termName: {
        type: String,
        default: "暂无"
    },
    course: {
        type: Object, // 课程信息，可以根据需要定义更具体的字段
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    counsellor: {
        type: String,
        default: "暂无"
    },
    shouldAttend: {
        type: Number,
        required: true
    },
    week: {
        type: Number,
        required: true
    },
    weekday: {
        type: Number,
        required: true
    },
    actualAttend: {
        type: Number,
        required: true
    },
    absent: {
        type: Number,
        required: true
    },
    leave: {
        type: Number,
        required: true
    },
    checker: {
        type: String,
        required: true
    },

    isProvide:{
        type:Boolean,
        default:false
    },
    remarks: {
        type: String
    },
    results: {
        type: Array // 学生考勤结果，可以根据需要定义更具体的结构
    },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
courseFeedbackSchema.plugin(softDeletePlugin);
courseFeedbackSchema.statics.searchCheckCourse = function (query) {
    const regExpQuery = new RegExp(query, "i"); // 创建不区分大小写的正则表达式
    // 取 regExpQuery 的前三个字符
    const gradeQuery = regExpQuery.source.slice(0, 5);
    // 取 regExpQuery 的第三个字符开始
    const classes = query.match(/\d{4}(.+)/) ? query.match(/\d{4}(.+)/)[1] : ''
    const classesQuery = classes.replace(/(?:本|专升本|专|级)/g, '')
    const levelsQuery = query.match(/专升本|本|专/gi) ? query.match(/专升本|本|专/gi)[0] : '';
    return this.find({
        $or: [
            {grade: regExpQuery},
            {class: regExpQuery},
            {level: regExpQuery},
            {faculty: regExpQuery},
            {termName:regExpQuery},
            {counsellor:regExpQuery},
            {shouldAttend:regExpQuery},
            {week:regExpQuery},
            {weekday:regExpQuery},
            {actualAttend:regExpQuery},
            {absent:regExpQuery},
            {leave:regExpQuery},
            {checker:regExpQuery},
            {remarks:regExpQuery},

            {$and: [{grade: new RegExp(gradeQuery)}, {class: classesQuery}, {level: levelsQuery}]},

        ]
    })
};
// 创建一个模型并导出

module.exports = mongoose.model('courseFeedback', courseFeedbackSchema);
