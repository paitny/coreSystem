const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

let volunteerSchema = new Schema({
    activityId: {
        type: Schema.Types.ObjectId,
        ref: "activity",
        required: true,
    },
    faculty: {
        type: String,
        default: "暂无"
    },
    name: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        default: "暂无"
    },
    ID: {
        type: String,
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },
    classes: {
        type: String,
        required: true,
    },
    levels: {
        type: String,
        default: "暂无"
    },
    semester: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        default: "暂无"
    },
    counsellor: {
        type: String,
        required: true,
    },
    registrationTime: {
        type: Number,
        default: Date.now
    },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    },
    checkInTime: {
        type: Number, // 或者使用 Date 类型，根据实际需求选择
        default: null, // 或者其他默认值，表示未签到
    },
    checkOutTime: {
        type: Number, // 或者使用 Date 类型，根据实际需求选择
        default: null, // 表示未签退
    },
    hasCheckedOut: {
        type: Boolean,
        default: false, // 默认值为 false，表示未签退
    }
});

volunteerSchema.plugin(softDeletePlugin);

// 添加复合唯一索引
volunteerSchema.index({ activityId: 1, ID: 1 }, { unique: true });

module.exports = mongoose.model("volunteer", volunteerSchema);
