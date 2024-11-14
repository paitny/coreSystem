const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件
let activitySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    deadline: {
        type: Date,
        required: true,
    },
    startTime: {
        type: Date,
        default: Date.now()
    },
    currentSemester: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        default: "/file/vtCover/default.jpg"
    },
    isSign: {
        type: Boolean,
        default: false
    },
    isCheckOut:{
        type: Boolean,
        default: false
    },
    address: {
        type: String,
        default: "暂无"
    },
    date: {
        type: Number,
        default: Date.now
    },

    volunteerCounts: {
        type: Object
    },
    checkInTimes: {
        type: Object
    },
    checkOutTimes:{
        type: Object
    },

    //人数限制
    limitPerson: {
        type: Number,
        required: true
    },
    audit: {
        type: Boolean,
        default: false
    },
    groupCode:{
        type: String,
        default: "/file/vtCover/groupCode.png"
    },
    groupNum:{
        type: String,
        default: "暂无"
    },
    quantization:{
      type:Boolean,
      default:true
    },
    transpire:{
        type:Boolean,
        default:true
    },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    }
});
activitySchema.plugin(softDeletePlugin);
activitySchema.statics.searchActivity = function (query) {
    const regExpQuery = new RegExp(query, "i"); // 创建不区分大小写的正则表达式
    return this.find({
        $or: [
            {title: regExpQuery},
            {description: regExpQuery},
            {currentSemester: regExpQuery},
            {address: regExpQuery}
        ],
    })
        .sort({date: -1}) // 根据日期降序排序
        .exec();
};
module.exports = mongoose.model("activity", activitySchema);


