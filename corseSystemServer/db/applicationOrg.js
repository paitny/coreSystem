const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

const ApplicationOrgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true,
        enum: ['男', '女']
    },
    ID: {
        type: String,
        required: true,
        unique: true
    },
    grade: {
        type: String,
        required: true,
        enum: ['2021级', '2022级', '2023级', '2024级']
    },
    classes: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    counsellor: {
        type: String,
        required: true
    },
    organizationValue: {
        type: String,
        required: true,
        enum: ['学生分会', '分团委', '校友分会', '学生公寓自我管理委员会分会', '分团委学生社团管理部']
    },
    semester: {
        type: String,
        required: true,
    },
    departmentValue: {
        type: String,
        required: true
    },
    applicationTime: {
        type: Number,
        default: Date.now
    },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    }
}, { timestamps: true });
ApplicationOrgSchema.plugin(softDeletePlugin);
module.exports = mongoose.model('ApplicationOrg', ApplicationOrgSchema);
