const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件
let Schema = mongoose.Schema
let userSchema = new Schema({
    //用户名
    user: {
        type: String,
        required: true
    },
    //姓名
    name: {
        type: String,
        default: "暂无"
    },
    nickName: {
        type: String,
        default: "暂无"
    },
    //密码
    pass: {
        type: String,
        required: true,
        set(value) {
            return bcrypt.hashSync(value, 10)
        },
    },

    //头像
    photo: {
        type: String,
        default: "/file/photo/default.jpg"
    },
    //是否管理员
    admin: {
        type: Boolean,
        default: false
    },
    //超级管理员（可注销用户）
    adminPlus: {
        type: Boolean,
        default: false
    },
    //秘钥
    secret: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        default: Date.now
    },
    appState: {
        type: Boolean,
        default: false
    }
    ,
    isMember: {
        type: Boolean,
        default: false
    },
    class: {
        type: String,
        default: "暂无"
    },
    faculty:{
        type: String,
        default: "暂无"
    },
    //机构
    institution: {
        type: String,
        default: "暂无"
    },
    //寝室
    chamber: {
        type: String,
        default: "暂无"
    },
    //职位
    position: {
        type: String,
        default: "普通用户"
    },
    //性别
    sex: {
        type: String,
        default: "暂无"
    },
    //手机号
    phone: {
        type: String,
        default: "暂无"
    },
    //学号
    num: {
        type: String,
        default: '暂无'
    },
    //年级
    grade: {
        type: String,
        default: '暂无'
    },
    //辅导员
    counsellor: {
        type: String,
        default: '暂无'
    },
    //本学期是否是三大机构学生干部
    isCadre: {
        type: Boolean,
        default: false
    },
    due: {
        type: String,
        default: "暂无"
    },
    levels: {
        type: String,
        default: "暂无"
    },
    //个性标签
    personality:{
        type: String,
        default: "暂无"
    },
    activityIds: {
        type: [String], // 你的 activityIds 的类型可能是其他类型，请根据实际情况调整
        default: []     // 设置默认值为空数组
    },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    },
    province:{
        type:String,
        default:"未知"
    }
})
userSchema.plugin(softDeletePlugin);
userSchema.statics.searchUser = function (query) {
    const regExpQuery = new RegExp(query, "i"); // 创建不区分大小写的正则表达式
    // 取 regExpQuery 的前三个字符
    const gradeQuery = regExpQuery.source.slice(0, 5);
    // 取 regExpQuery 的第三个字符开始
    const classes = query.match(/\d{4}(.+)/) ? query.match(/\d{4}(.+)/)[1] : ''
    const classesQuery = classes.replace(/(?:本|专升本|专|级)/g, '')
    const levelsQuery = query.match(/专升本|本|专/gi) ? query.match(/专升本|本|专/gi)[0] : '';
    return this.find({
        $or: [
            {user: regExpQuery},
            {name: regExpQuery},
            {institution: regExpQuery},
            {num: regExpQuery},
            {counsellor: regExpQuery},
            {position: regExpQuery},
            {grade: regExpQuery},
            {class: regExpQuery},
            {due: regExpQuery},
            {chamber: regExpQuery},
            {nickName: regExpQuery},
            {levels: regExpQuery},
            {faculty: regExpQuery},
            {$and: [{grade: new RegExp(gradeQuery)}, {class: classesQuery}, {levels: levelsQuery}]},

        ]
    })
};
module.exports = mongoose.model("user", userSchema)







