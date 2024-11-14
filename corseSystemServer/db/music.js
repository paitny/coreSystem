const mongoose = require("mongoose")
let Schema = mongoose.Schema
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

let musicSchema = new Schema({
    //歌曲名
    name: {
        type: String,
        default:"暂无歌名"
    },

    //歌曲演唱者
    artist: {
        type: String,
        default:"暂无演唱者"

    },
    url:{
        type:String,
        required:true
    },
    //封面
    cover:{
        type: String,
        default: "/file/mcover/default.jpg"
    },
    //歌词
    lrc: {
        type: String,
        default: "/file/lyric/default.lrc"
    },
    //上传日期
    theme:{
        type:String,
        default:"#626aef"

    },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    },
    date:{
        type: Number,
        default: Date.now
    }
})
musicSchema.plugin(softDeletePlugin);
module.exports = mongoose.model("music", musicSchema)







