"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const loading = () => "../../components/loading/loading.js";
const _sfc_main = {
  data() {
    return {
      termName: "",
      nowTermName: "",
      courseList: [],
      isloading: true
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  onLoad() {
    this.getCurrentSemester();
    this.getcourseListData();
  },
  components: {
    loading
  },
  methods: {
    //获取课程数据
    getcourseListData() {
      this.isloading = true;
      common_vendor.index.$http.get("/api/get/course", {
        userId: this.userInfo._id,
        termName: this.termName
      }).then((res) => {
        if (res.statusCode === 404) {
          setTimeout(() => {
            this.isloading = false;
          }, 100);
          return common_vendor.index.showModal({
            content: "暂无数据，是否需要去添加！",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.navigateTo({
                  url: "/myServices/courseImport/courseImport"
                });
              }
            }
          });
        } else {
          if (res.errMsg == "request:ok") {
            this.courseList = [];
            this.courseList = res.data.data.result.coursesList;
            this.nowTermName = res.data.data.result.termName;
            setTimeout(() => {
              this.isloading = false;
            }, 100);
          }
        }
      }).catch((error) => {
        if (error) {
          this.isloading = true;
        }
      });
    },
    deleteCourse(index) {
      common_vendor.index.$http.post("/api/course/deleteCourse", {
        userId: this.userInfo._id,
        termName: this.nowTermName,
        index
      }).then((res) => {
        common_vendor.index.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1800
        });
      });
    },
    toDelete(index) {
      if (this.courseList.length === 1) {
        this.DeleteTerm();
      } else {
        common_vendor.index.showModal({
          content: "确定要删除此课程嘛！",
          success: (e) => {
            if (e.confirm) {
              this.deleteCourse(index);
              this.courseList.splice(index, 1);
            }
          }
        });
      }
    },
    goUpdateCourse(item, index) {
      common_vendor.index.navigateTo({
        url: `../../subpkg-common/updateCourse/updateCourse?nowTermName=${this.nowTermName}&index=${index}`
      });
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
    DeleteTerm() {
      common_vendor.index.showModal({
        content: `您确定要删除${this.termName}的课程嘛！`,
        success: (e) => {
          if (e.confirm) {
            common_vendor.index.$http.post("/api/course/termDelete", {
              userId: this.userInfo._id,
              termName: this.termName
            }).then((res) => {
              common_vendor.index.showToast({
                icon: "none",
                title: res.data.message,
                duration: 1500
              });
            });
            this.courseList = [];
          }
        }
      });
    }
  },
  onPullDownRefresh() {
    this.getcourseListData();
    common_vendor.index.showToast({
      title: "刷新成功",
      icon: "success",
      duration: 800
    });
    setTimeout(function() {
      common_vendor.index.stopPullDownRefresh();
    }, 500);
  }
};
if (!Array) {
  const _easycom_loading2 = common_vendor.resolveComponent("loading");
  _easycom_loading2();
}
const _easycom_loading = () => "../../components/loading/loading.js";
if (!Math) {
  _easycom_loading();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.termName),
    b: $data.courseList.length === 0
  }, $data.courseList.length === 0 ? {
    c: common_assets._imports_0$4,
    d: common_vendor.o(($event) => $options.getcourseListData())
  } : {}, {
    e: $data.isloading
  }, $data.isloading ? {} : {
    f: common_vendor.f($data.courseList, (item, index, i0) => {
      return {
        a: common_vendor.t($options.convertToChineseNumber(item.week)),
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.rawSection),
        d: common_vendor.t(item.rawWeeks),
        e: common_vendor.t(item.address),
        f: common_vendor.o(($event) => $options.toDelete(index), index),
        g: common_vendor.o(() => {
        }, index),
        h: index,
        i: common_vendor.o(($event) => $options.goUpdateCourse(item, index), index)
      };
    }),
    g: common_assets._imports_1$5
  }, {
    h: $data.courseList.length > 0
  }, $data.courseList.length > 0 ? {
    i: common_assets._imports_1$5,
    j: common_vendor.o((...args) => $options.DeleteTerm && $options.DeleteTerm(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
