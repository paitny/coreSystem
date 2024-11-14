"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
let videoAd = null;
const _sfc_main = {
  data() {
    return {
      termName: "",
      nowTermName: "",
      courseList: [],
      firstEntry: true,
      baseURL: ""
    };
  },
  onLoad() {
    this.getCurrentSemester();
    this.baseURL = common_vendor.index.baseURL;
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  methods: {
    //id就是传入的广告位id
    load(id) {
      if (common_vendor.index.createRewardedVideoAd) {
        if (this.userInfo.admin && this.userInfo.adminPlus) {
          this.postAddCourse();
          return;
        }
        videoAd = common_vendor.index.createRewardedVideoAd({
          adUnitId: id
        });
        videoAd.onLoad(() => {
        });
        videoAd.onError((err) => {
          console.error("激励视频光告加载失败", err);
        });
        videoAd.onClose((status) => {
          if (status && status.isEnded || status === void 0) {
            this.postAddCourse();
          } else {
            common_vendor.index.showToast({
              duration: 1500,
              title: "获取失败",
              icon: "none"
            });
          }
        });
      }
    },
    postAddCourse() {
      common_vendor.index.$http.post("/api/course/updateAddCourse", {
        userId: this.userInfo._id,
        name: this.userInfo.name,
        due: this.userInfo.due,
        isCadre: this.userInfo.isCadre,
        institution: this.userInfo.institution,
        position: this.userInfo.position,
        termName: this.termName,
        coursesList: this.courseList
      }).then((res) => {
        if (res.statusCode === 200) {
          return common_vendor.index.showToast({
            icon: "none",
            title: res.data.message,
            duration: 1500
          });
        }
        return common_vendor.index.showToast({
          icon: "success",
          title: "添加成功",
          duration: 1500
        });
      });
    },
    show() {
      if (videoAd) {
        videoAd.show().catch(() => {
          videoAd.load().then(() => videoAd.show()).catch((err) => {
            console.error("激励视频 广告显示失败", err);
          });
        });
      }
    },
    chooseExcel() {
      common_vendor.index.showModal({
        content: "是否在聊天中获取文件",
        success: (e) => {
          if (e.confirm) {
            common_vendor.index.chooseMessageFile({
              count: 1,
              type: "file",
              success: (res) => {
                const filePath = res.tempFiles[0].path;
                const fileType = res.tempFiles[0].name.toLowerCase();
                if (!fileType.endsWith(".xlsx") && !fileType.endsWith(
                  ".xls"
                )) {
                  common_vendor.index.showToast({
                    title: "请选择.xlsx或.xls文件",
                    icon: "none",
                    duration: 2e3
                  });
                  return;
                }
                this.uploadExcel(filePath);
              },
              fail: (err) => {
                console.error("chooseExcel fail", err);
              }
            });
          }
        }
      });
    },
    uploadExcel(filePath) {
      common_vendor.index.showLoading({
        title: "上传中"
      });
      common_vendor.index.uploadFile({
        url: common_vendor.index.uploadURL + "/api/Curriculum/upload",
        // 上传接口的URL
        filePath,
        name: "file",
        formData: {
          "user": "test"
        },
        success: (res) => {
          const data = JSON.parse(res.data);
          this.courseList = [];
          this.courseList = data.data.filter((item) => {
            if (item.name === null || item.num === null || item.section === null || item.sectionCount === null) {
              return false;
            }
            return true;
          });
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: data.msg,
            icon: "success",
            duration: 1e3
          });
        },
        fail: (err) => {
          console.error("uploadExcel fail", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showModal({
            content: err.errMsg,
            showCancel: false
          });
        }
      });
    },
    //获取课程数据
    getcourseListData(firstEntry = false) {
      common_vendor.index.$http.get("/api/get/course", {
        userId: this.userInfo._id,
        termName: this.termName
      }).then((res) => {
        if (!this.firstEntry) {
          common_vendor.index.showToast({
            icon: "success",
            title: "获取成功"
          });
        }
        this.courseList = res.data.data.coursesList;
        this.nowTermName = res.data.data.termName;
      });
    },
    deleteCourse(index) {
      common_vendor.index.$http.delete("/api/course/deleteCourse", {
        userId: this.userInfo._id,
        termName: this.nowTermName,
        index
      }).then((res) => {
        common_vendor.index.showToast({
          title: res.data.message,
          icon: "success",
          duration: 1800
        });
      });
    },
    removeCourseByIndex(indexToRemove) {
      if (indexToRemove >= 0 && indexToRemove < this.courseList.length) {
        this.courseList.splice(indexToRemove, 1);
      }
    },
    // 获取当前学期
    getCurrentSemester() {
      const currentDate = /* @__PURE__ */ new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      let semester;
      let academicYear;
      if (currentMonth >= 9 && currentMonth <= 12) {
        semester = "第一学期";
        academicYear = `${currentYear}-${currentYear + 1}学年度`;
      } else if (currentMonth >= 1 && currentMonth <= 2) {
        semester = "第一学期";
        academicYear = `${currentYear - 1}-${currentYear}学年度`;
      } else if (currentMonth >= 3 && currentMonth <= 6) {
        semester = "第二学期";
        academicYear = `${currentYear - 1}-${currentYear}学年度`;
      } else {
        semester = "暑假/寒假";
        academicYear = `${currentYear - 1}-${currentYear}学年度`;
      }
      this.termName = `${academicYear}${semester}`;
    },
    convertToChineseNumber(num) {
      const chineseNumbers = ["一", "二", "三", "四", "五", "六", "日"];
      if (num >= 1 && num <= 7) {
        return chineseNumbers[num - 1];
      } else {
        return "未知";
      }
    },
    formatSection(section, sectionCount) {
      if (sectionCount === 1) {
        return `[${section}节]`;
      } else {
        const endSection = section + sectionCount - 1;
        return `[${section}-${endSection}节]`;
      }
    },
    formatArray(inputArr) {
      if (!Array.isArray(inputArr) || inputArr.length === 0) {
        return "";
      }
      inputArr.sort((a, b) => a - b);
      let result = [];
      let start = null;
      let end = null;
      for (let i = 0; i < inputArr.length; i++) {
        const num = inputArr[i];
        if (start === null) {
          start = num;
          end = num;
        } else if (num === end + 1) {
          end = num;
        } else {
          if (start === end) {
            result.push(start.toString());
          } else {
            result.push(start + "-" + end);
          }
          start = num;
          end = num;
        }
      }
      if (start === end) {
        result.push(start.toString());
      } else {
        result.push(start + "-" + end);
      }
      const formattedStr = `[${result.join(", ")}周]`;
      return formattedStr;
    },
    subCourse() {
      common_vendor.index.showModal({
        content: "此功能需要观看激励广告",
        success: (e) => {
          if (e.confirm) {
            this.load("adunit-36f40df016ca3710");
            this.show();
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.termName),
    b: $data.courseList.length > 0
  }, $data.courseList.length > 0 ? {} : {}, {
    c: common_vendor.f($data.courseList, (item, index, i0) => {
      return {
        a: common_vendor.t($options.convertToChineseNumber(item.week)),
        b: common_vendor.t(item.name),
        c: common_vendor.t($options.formatSection(item.section, item.sectionCount)),
        d: common_vendor.t($options.formatArray(item.weeks)),
        e: common_vendor.t(item.address),
        f: common_vendor.o(($event) => $options.removeCourseByIndex(index), index),
        g: index
      };
    }),
    d: common_assets._imports_1$5,
    e: $data.courseList.length === 0
  }, $data.courseList.length === 0 ? {
    f: common_vendor.o((...args) => $options.chooseExcel && $options.chooseExcel(...args)),
    g: common_assets._imports_0$7
  } : {}, {
    h: $data.courseList.length > 0
  }, $data.courseList.length > 0 ? {} : {}, {
    i: $data.courseList.length > 0
  }, $data.courseList.length > 0 ? common_vendor.e({
    j: $data.courseList.length > 0
  }, $data.courseList.length > 0 ? {
    k: common_assets._imports_0$7,
    l: common_vendor.o((...args) => $options.chooseExcel && $options.chooseExcel(...args))
  } : {}, {
    m: $data.courseList.length > 0
  }, $data.courseList.length > 0 ? {
    n: common_assets._imports_1$7,
    o: common_vendor.o((...args) => $options.subCourse && $options.subCourse(...args))
  } : {}) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
