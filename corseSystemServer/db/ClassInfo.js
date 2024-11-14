const mongoose = require("mongoose");
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件



const classInfoSchema = new mongoose.Schema({
    faculty:{
        type: String,
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
        required: true
    },
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
classInfoSchema.plugin(softDeletePlugin);
classInfoSchema.statics.searchClass = function (query) {
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
            {counsellor:regExpQuery},
            {$and: [{grade: new RegExp(gradeQuery)}, {class: classesQuery}, {level: levelsQuery}]},

        ]
    })
};
classInfoSchema.index({faculty:1, grade: 1, class: 1, level: 1, counsellor: 1 }, { unique: true });

module.exports = mongoose.model("ClassInfo", classInfoSchema);
