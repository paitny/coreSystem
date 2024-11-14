const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件


const commentSchema = new mongoose.Schema({
    dynamicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trend', // 动态模型的名称
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    //被回复的评论id
    replyCommentId:{
        type: mongoose.Schema.Types.ObjectId
    },
    replyUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    userAvatar: {
        type: String // 添加用户头像字段
    },
    userName: {
        type: String // 添加用户名字段
    },
    text: {
        type: String,
        required: true
    },

    date: {
        type: Number,
        default: Date.now
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    },
    replies: [mongoose.Schema.Types.Mixed] // 使用 Mixed 类型来嵌套子评论
}, { timestamps: true });
commentSchema.plugin(softDeletePlugin);
module.exports = mongoose.model('Comment', commentSchema);
