const mongoose = require('mongoose');
let Schema = mongoose.Schema
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

// 定义学生课程模型
const courseSchema = new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    //学期
    termName: {
      type: String,
      default: "暂无"
    },
  //学生姓名
  name:{
    type: String,
    required: true
  },
  //是否学生干部
  isCadre:{
     type:Boolean,
     required:true
  },
  //机构
  institution:{
    type: String,
    required: true
  },
  //哪届学生干部
  due:{
    type: String,
    required: true
  },
  isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
  deletedAt: {
    type: Date,
    default: null,  // 允许为 null
    required: false // 可选字段
  },
  //职位
  position:{
    type: String,
    required: true
  },
    //课程列表
    coursesList: [
      {
        //课程名
        name: {
          type: String,
          default: "暂无"
        },
        //课程编码
        num: {
          type: String,
          default: "暂无"
        },
        //学分
        credit: {
          type: String,
          default: "暂无"
        },
        //总课时
        totalHours: {
          type: String,
          default: "暂无"
        },
        lectureHours: {
          type: String,
          default: "暂无"
        },
        computeHours: {
          type: String,
          default: "暂无"
        },
        //课程类别
        category: {
          type: String,
          default: "暂无"
        },
        //老师级别
        teachMethod: {
          type: String,
          default: "暂无"
        },
        //考试方法
        method: {
          type: String,
          default: "暂无"
        },
        //教师
        teacher: {
          type: String,
          default: "暂无"
        },
        //周次
        weeks: {
          type: Array,
          default: [0] // 默认为一个空数组，你可以根据需要进行更改
        },
        //那节开始
        section: {
          type: Number,
          default: 0 // 默认为0，你可以根据需要进行更改
        },
        //上课地点
        address: {
          type: String,
          default: "暂无"
        },
        //节次
        rawWeeks: {
          type: String,
          default: "暂无"
        },
        rawSection: {
          type: String,
          default: "暂无"
        },
        //星期几
        week: {
          type: Number,
          default: 0 // 默认为0，你可以根据需要进行更改
        },
        //连续几节
        sectionCount: {
          type: Number,
          default: 0 // 默认为0，你可以根据需要进行更改
        },
      },
    ],
  });
courseSchema.plugin(softDeletePlugin);
courseSchema.index({ userId: 1, termName: 1 }, { unique: true });

module.exports = mongoose.model("course", courseSchema)


