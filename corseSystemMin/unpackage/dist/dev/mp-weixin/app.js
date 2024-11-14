"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/Schedule/Schedule.js";
  "./pages/leave/leave.js";
  "./pages/me/me.js";
  "./pages/ranking/ranking.js";
  "./pagesMe/login/login.js";
  "./pagesNav/home-homepage/home-homepage.js";
  "./pagesNav/home-regiment/home-regiment.js";
  "./pagesNav/home-selfmanaged/home-selfmanaged.js";
  "./pagesNav/home-Application/home-Application.js";
  "./pagesNav/home-student/home-student.js";
  "./pagesNav/societies/societies.js";
  "./pagesHome/news/news.js";
  "./pagesHome/institution/institution.js";
  "./pagesHome/Departments/Departments.js";
  "./pagesHome/application/active.js";
  "./pagesHome/activity/latest.js";
  "./pagesHome/activity/institution.js";
  "./pagesHome/activity/volunteer.js";
  "./pagesHome/home/organization.js";
  "./pagesHome/home/overview.js";
  "./pagesHome/home/speciality.js";
  "./subpkg-common/setting/setting.js";
  "./subpkg-common/courseInfo/courseInfo.js";
  "./subpkg-common/webview/webview.js";
  "./subpkg-common/freeUser/freeUser.js";
  "./subpkg-common/sendLeave/sendLeave.js";
  "./subpkg-common/search/search.js";
  "./subpkg-common/updateCourse/updateCourse.js";
  "./subpkg-common/modify/modify.js";
  "./subpkg-common/testPaper/testPaper.js";
  "./subpkg-common/change-password/change-password.js";
  "./subpkg-common/printFoot/printFoot.js";
  "./subpkg-common/feedback/feedback.js";
  "./subpkg-common/grades/grades.js";
  "./subpkg-common/attendanceCourse/attendanceCourse.js";
  "./subpkg-common/editCheckCourse/editCheckCourse.js";
  "./myServices/addCourse/addCourse.js";
  "./myServices/courseImport/courseImport.js";
  "./myServices/courseMg/courseMg.js";
  "./myServices/freeUserTime/freeUserTime.js";
  "./myServices/studentCadres/studentCadres.js";
  "./myServices/member/member.js";
  "./myServices/examination/examination.js";
  "./myServices/eventRelease/eventRelease.js";
  "./myServices/eventMg/eventMg.js";
  "./myServices/updateRelease/updateRelease.js";
  "./myServices/eventRw/eventRw.js";
  "./myServices/checkCourse/checkCourse.js";
  "./myServices/courseFaceback/courseFaceback.js";
  "./myServices/courseTime/courseTime.js";
  "./subpkg-activity/signPage/signPage.js";
  "./subpkg-activity/myCollect/myCollect.js";
  "./subpkg-activity/General/General.js";
  "./subpkg-visualization/myActivity/myActivity.js";
  "./subpkg-visualization/Visualization/Visualization.js";
  "./subpkg-visualization/studentActivity/studentActivity.js";
  "./subpkg-visualization/ClassVisualization/ClassVisualization.js";
  "./subpkg-visualization/checkCourseData/checkCourseData.js";
  "./subpkg-visualization/checkCourseCount/checkCourseCount.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  onShow: function() {
    console.log(1);
    const updateManager = common_vendor.index.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        updateManager.onUpdateReady((res2) => {
          common_vendor.index.showModal({
            title: "更新提示",
            content: "新版本已经准备好，是否重启应用？",
            success(res3) {
              if (res3.confirm) {
                updateManager.applyUpdate();
              }
            }
          });
        });
        updateManager.onUpdateFailed((res2) => {
          common_vendor.index.showModal({
            title: "更新提示",
            content: "检查到有新版本，但下载失败，请检查网络设置",
            success(res3) {
              if (res3.confirm) {
                updateManager.applyUpdate();
              }
            }
          });
        });
      }
    });
    this.getUserLocation();
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  },
  comments: {},
  methods: {
    getUserLocation() {
      common_vendor.index.request({
        url: "https://2024.ipchaxun.com/",
        // IP API 的 URL
        method: "GET",
        success: (res) => {
          if (res.statusCode === 200) {
            const data = res.data.data[1];
            console.log(res.data.data[1]);
            this.getProvince(data);
          } else {
            this.getProvince("未知");
            console.log("获取位置失败:", res);
          }
        },
        fail: (error) => {
          console.log("请求失败:", error);
        }
      });
    },
    ...common_vendor.mapMutations(["loginOut", "loginSuccess"]),
    getProvince(location) {
      common_vendor.index.$http.get("/api/get/province", {
        ip: location
      }).then((res) => {
        this.checkLogin(res.data.data);
      });
    },
    removeStore() {
      common_vendor.index.removeStorage({
        key: "userInfo",
        // 要清除的数据的键名
        success: () => {
          console.log("数据清除成功");
        },
        fail: (err) => {
          console.log("数据清除失败", err);
        }
      });
      common_vendor.index.removeStorage({
        key: "token",
        // 要清除的数据的键名
        success: () => {
          console.log("数据清除成功");
        },
        fail: (err) => {
          console.log("数据清除失败", err);
        }
      });
    },
    checkLogin(province) {
      common_vendor.index.$http.post("/api/login/min/check", {
        id: common_vendor.index.getStorageSync("userInfo")._id,
        province
      }).then((res) => {
        if (res.data.code === 0) {
          this.loginOut();
          this.removeStore();
          setTimeout(() => {
            this.$forceUpdate();
          }, 200);
        } else if (res.data.code === 2) {
          this.loginOut();
          this.removeStore();
          setTimeout(() => {
            this.$forceUpdate();
          }, 200);
        } else if (res.data.code === 1) {
          common_vendor.index.setStorageSync("userInfo", res.data.data);
          common_vendor.index.getStorage({
            key: "userInfo",
            // 你存储的数据的键名
            success: (res2) => {
              console.log(res2);
              this.$store.commit("loginSuccess", res2.data.data);
            },
            fail: (err) => {
              console.log("获取本地存储失败", err);
            }
          });
          this.$forceUpdate();
        }
      });
    }
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(store_index.store);
  return {
    app
  };
}
common_vendor.index.$http = common_vendor.$http;
common_vendor.$http.beforeRequest = function(options) {
  options.header = {
    authorization: "Bearer " + common_vendor.index.getStorageSync("token"),
    id: common_vendor.index.getStorageSync("userInfo")._id
  };
};
common_vendor.$http.afterRequest = function() {
  setTimeout(function() {
    common_vendor.index.hideLoading();
  }, 800);
};
common_vendor.index.$showMsg = function(title = "数据加载失败", duration = 1500) {
  common_vendor.index.showToast({
    title,
    duration,
    icon: "none"
  });
};
const staticURL = "/static";
const up = "";
common_vendor.index.baseURL = "https://wypty.cn" + staticURL;
common_vendor.index.uploadURL = "https://wypty.cn" + up;
common_vendor.$http.baseUrl = "https://wypty.cn";
createApp().app.mount("#app");
exports.createApp = createApp;
