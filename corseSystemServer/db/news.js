
const mongoose = require("mongoose")
let Schema = mongoose.Schema
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

let newsSchema = new Schema({

  //新闻标题
  title: {type: String, default: "暂无标题"},

  //描述
  des: {type: String, default: "暂无描述"},

  //cover地址
  cover: {type: String, default: "/file/cover/default.jpg"},

  //日期
  date: {type: Number, default: Date.now},

  //作者
  author: {type: String, required: true},
  //点赞
  likes: [
    {type: Schema.Types.ObjectId}
  ],
  collects:[
    {type: Schema.Types.ObjectId}
  ],
  //浏览数
  pv: {type: Number, default: 0},
  //文章分类
  class: {type: String, default: "体育赛事"},
  isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
  deletedAt: {
    type: Date,
    default: null,  // 允许为 null
    required: false // 可选字段
  },
  timestamp:{
    type:String,
    default: "暂无"
  }
})
newsSchema.plugin(softDeletePlugin);
newsSchema.statics.searchNews = function (query) {
  const regExpQuery = new RegExp(query, "i"); // 创建不区分大小写的正则表达式
  return this.find({
    $or: [
      { title: regExpQuery },
      { des: regExpQuery },
      { author: regExpQuery },
      { class: regExpQuery },
    ],
  })
      .sort({ date: -1 }) // 根据日期降序排序
      .exec();
};

newsSchema.methods.addVisit = async function(userId) {
  const ViewedNews = require('./foot'); // 浏览记录模型路径

  try {
    // 检查是否已存在相同的浏览记录
    const existingView = await ViewedNews.findOne({ userId, newsId: this._id });
    if (!existingView) {
      const newViewedNews = new ViewedNews({
        userId,
        newsId: this._id
      });
      await newViewedNews.save();
    }
  } catch (error) {
    console.error('Error adding view:', error);
  }
};

module.exports = mongoose.model("news", newsSchema)







