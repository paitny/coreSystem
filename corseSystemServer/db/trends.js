const mongoose = require("mongoose")
let Schema = mongoose.Schema
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

let trendSchema = new Schema({

    //存用户id
    publisherId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    leaveType:{
        type:String,
        required: true
    },
    leaveContent:{
        type:String,
        required: true
    },
    images:{
      type:Array,
      required:true
    },
    //审核
    process:{
        type:Boolean,
        default:true
    },
    //点赞
    likes: [
        {type: Schema.Types.ObjectId}
    ],
    nickNameLikes:{
        type:Array
    },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    },
    //发表日期
    date: {
        type: Number,
        default: Date.now
    }
})
trendSchema.plugin(softDeletePlugin);
module.exports = mongoose.model("trend", trendSchema)







