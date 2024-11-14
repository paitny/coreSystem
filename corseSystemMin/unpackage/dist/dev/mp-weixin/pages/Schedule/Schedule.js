"use strict";
const common_vendor = require("../../common/vendor.js");
const Utils_Utils = require("../../Utils/Utils.js");
const Utils_getNowWeek = require("../../Utils/getNowWeek.js");
const Utils_semesterUtils = require("../../Utils/semesterUtils.js");
const common_assets = require("../../common/assets.js");
const classPop = () => "../../components/classPop/classPop.js";
const courseSkeleton = () => "../../components/courseSkeleton/courseSkeleton.js";
const _sfc_main = {
  data() {
    return {
      showDialog: false,
      classList: [],
      // 班级信息数组
      selectedClass: "",
      // 记录用户选择的班级
      classPopShow: false,
      termName: "",
      //当前学年
      isRotated: false,
      todayMonth: 0,
      todayDay: 0,
      todayWeek: 0,
      courseCachekey: "course",
      courseColorCachekey: "courseColor",
      // 状态栏高度
      statusBarHeight: 0,
      // 导航栏高度
      navBarHeight: 82 + 11,
      nowWeek: 1,
      // 当前周
      totalWeek: 25,
      // 周总数
      showSwitchWeek: false,
      // 显示选择周数弹窗
      weekDayCount: 7,
      startDate: "2024/9/2",
      // 开学日期
      weekIndexText: ["一", "二", "三", "四", "五", "六", "日"],
      nowMonth: 1,
      // 当前周的月份
      colorList: [
        "#BEADFA",
        "#D0BFFF",
        "#DFCCFB",
        "#8E8FFA",
        "#FFCB42",
        "#F875AA",
        "#D8B4F8",
        "#7743DB",
        "#D0A2F7",
        "#64CCC5",
        "#39A7FF",
        "#39A7FF",
        "#86469C",
        "#BC7FCD",
        "#FB9AD1",
        "#FFCDEA",
        "#8B93FF",
        "#5755FE",
        "#FF71CD",
        "#41C9E2"
      ],
      courseColor: {},
      weekCalendar: [1, 2, 3, 4, 5, 6, 7],
      firstEntry: true,
      courseList: [],
      // Initialize with your data
      time: [
        "8:30~9:15",
        "9:20~10:05",
        "10:20~11:05",
        "11:10~11:55",
        "13:40~14:25",
        "14:30~15:15",
        "15:30~16:15",
        "16:20~17:05",
        "18:40~19:25",
        "19:30~20:15"
      ],
      loading: true,
      shareUserId: "",
      windowWidth: 0,
      userId: "",
      platform: "",
      waterText: ""
    };
  },
  components: {
    courseSkeleton,
    classPop
  },
  created() {
    this.statusBarHeight = common_vendor.index.getSystemInfoSync()["statusBarHeight"];
    common_vendor.index.getSystemInfo({
      success: (res) => {
        this.windowWidth = res.windowWidth;
        this.platform = res.platform;
      }
    });
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  onLoad(options) {
    this.termName = Utils_semesterUtils.getCurrentSemester();
    this.shareUserId = options.id;
    this.userId = this.shareUserId || common_vendor.index.getStorageSync("userInfo")._id;
    this.getTodayDate();
    this.getWeekDates();
    this.getNowWeek();
    this.update();
    this.getCourse();
    this.waterText = "芯系小助手";
  },
  methods: {
    handleItemSelected(item) {
      console.log("Selected item:", item);
      this.onClassSelect(item);
      this.closeDialog();
    },
    // 关闭弹窗的方法
    closeDialog() {
      this.showDialog = false;
    },
    onClassSelect(gradeClassName) {
      const gradeMatch = gradeClassName.match(/^(\d+级)/);
      const classMatch = gradeClassName.match(/(\D+?\d+班)/);
      const levelMatch = gradeClassName.match(/\(([^)]+)\)/);
      const grade = gradeMatch ? gradeMatch[0] : "";
      const className = classMatch ? gradeClassName.split(grade)[1].split("(")[0] : "";
      const level = levelMatch ? levelMatch[1] : "";
      this.waterText = grade + className + level;
      this.getCourseClass(grade, className, level);
    },
    getCourseClass(grade, className, level) {
      common_vendor.index.$http.get("/api/get/alternative", {
        grade,
        className,
        level,
        termName: this.termName
      }).then((res) => {
        if (res.errMsg == "request:ok") {
          this.courseList = res.data.data.result.coursesList;
          this.startDate = "";
          this.startDate = res.data.data.startTime;
          this.buildCourseColor();
          if (!this.firstEntry) {
            common_vendor.index.showToast({
              icon: "success",
              title: "更新成功"
            });
          }
          setTimeout(() => {
            this.loading = false;
          }, 1e3);
          this.getTodayDate();
          common_vendor.index.setStorageSync(this.courseCachekey, res.data.data);
        }
      });
    },
    getcounsellorclass() {
      if (this.userInfo.class === "辅导员") {
        common_vendor.index.$http.get("/api/aiCourse/search-by-counsellor", {
          counsellor: this.userInfo.name
        }).then((res) => {
          this.classList = res.data.classList;
          this.showDialog = true;
        });
      } else {
        common_vendor.index.$http.get("/api/aiCourse/search-by-class", {
          counsellor: this.userInfo.name
        }).then((res) => {
          this.classList = res.data.classList;
          this.showDialog = true;
        });
      }
    },
    goOthterProgram() {
      common_vendor.index.showModal({
        content: "数智课程表小程序正式上线啦，你是否要去体验呢！",
        success: (e) => {
          if (e.confirm) {
            this.skip();
          }
        }
      });
    },
    skip() {
      common_vendor.index.navigateToMiniProgram({
        // appid  写你要跳转的小程序的 appid
        appId: "wxef891dcddac6ee45",
        // 路径写  src下的路径,假如你跳转的是pages下的页面,就可以写pages/index
        path: "pages/index/index",
        extraData: {
          // 'type': 'out'
        },
        // 这个不写的话会显示开发环境,不能正常跳转,写上就能正常跳转了
        envVersion: "develop",
        success(res) {
          common_vendor.index.showToast({
            title: "跳转成功"
          });
        },
        fail(err) {
          common_vendor.index.showToast({
            title: "跳转失败",
            icon: "error"
          });
        }
      });
    },
    calculateLeft(week) {
      let leftpx;
      if ((this.platform === "iPad" || this.platform === "devtools") && this.windowWidth >= 1024) {
        leftpx = (week - 1) * ((this.windowWidth - 130) / 7);
      } else if ((this.platform === "iPad" || this.platform === "devtools") && this.windowWidth >= 768) {
        leftpx = (week - 1) * ((this.windowWidth - 100) / 7);
      } else if ((this.platform === "ios" || this.platform === "devtools") && this.windowWidth >= 393 && this.windowWidth < 430) {
        leftpx = (week - 1) * ((this.windowWidth - 50) / 7);
      } else if ((this.platform === "ios" || this.platform === "devtools") && this.windowWidth <= 320) {
        leftpx = (week - 1) * ((this.windowWidth - 40) / 7);
      } else if (this.platform === "ios" || this.platform === "devtools") {
        leftpx = (week - 1) * ((this.windowWidth - 57) / 7);
      } else if (this.windowWidth >= 540 || this.platform === "devtools" && this.windowWidth >= 540) {
        leftpx = (week - 1) * ((this.windowWidth - 67) / 7);
      } else {
        leftpx = (week - 1) * ((this.windowWidth - 45) / 7);
      }
      const leftRPx = leftpx * (750 / this.windowWidth);
      return leftRPx;
    },
    isAdd() {
      if (this.userInfo.adminPlus && this.userInfo.admin) {
        return;
      } else {
        Utils_Utils.Utils.interstitial.load("adunit-2790969bd4775c12");
        Utils_Utils.Utils.interstitial.show();
      }
    },
    //检测是否登录
    checkLogin(type) {
      common_vendor.index.$http.post("/api/login/min/check", {
        id: common_vendor.index.getStorageSync("userInfo")._id
      }).then((res) => {
        if (res.data.code === 0) {
          this.loading = false;
          this.waterText = "芯系小助手";
          return common_vendor.index.showModal({
            content: "登录注册可享一键导课表！",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.navigateTo({
                  url: "/pagesMe/login/login?type=2"
                });
              }
            }
          });
        } else if (res.data.code === 2) {
          this.loading = false;
          this.waterText = "芯系小助手";
          return common_vendor.index.showModal({
            content: "登录注册可享一键导课表！",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.navigateTo({
                  url: "/pagesMe/login/login?type=2"
                });
              }
            }
          });
        } else if (res.data.code === 1) {
          if (type === 1) {
            return common_vendor.index.showModal({
              content: "你是否要去添加课表！",
              success: (e) => {
                if (e.confirm) {
                  common_vendor.index.navigateTo({
                    url: "/myServices/courseImport/courseImport"
                  });
                }
              }
            });
          } else {
            common_vendor.index.setStorageSync("userInfo", res.data.data);
            common_vendor.index.getStorage({
              key: "userInfo",
              // 你存储的数据的键名
              success: (res2) => {
                this.$store.commit("loginSuccess", res2.data);
              },
              fail: (err) => {
                console.log("获取本地存储失败", err);
              }
            });
            this.$forceUpdate();
            this.loading = false;
            this.waterText = this.userInfo.grade === "暂无" ? "" : this.userInfo.grade + this.userInfo.class === "暂无" ? "" : this.userInfo.class + this.userInfo.levels === "暂无" ? "" : this.userInfo.levels + this.userInfo.name === "暂无" ? "" : this.userInfo.name;
          }
        }
      });
    },
    formatDate(day, month, week) {
      const formattedDay = day < 10 ? "0" + day : String(day);
      if (week === "一" && day === 1) {
        return "01日";
      } else if (day === 1) {
        const nextMonth = month === 12 ? "01" : ("0" + (month + 1)).slice(-2);
        return nextMonth + "月";
      } else {
        return formattedDay + "日";
      }
    },
    navCourse(index) {
      common_vendor.index.navigateTo({
        url: `../../subpkg-common/courseInfo/courseInfo?info=${JSON.stringify(this.courseList[index])}`
      });
    },
    swiperChange(e) {
      if (e.detail.source == "") {
        this.firstEntry = false;
        return;
      }
      const index = e.detail.current;
      this.switchWeekFn(index + 1);
    },
    indexOf(arr, value) {
      if (arr.indexOf(value) > -1) {
        return true;
      }
      return false;
    },
    // 显示弹窗
    showPopup() {
      this.showSwitchWeek = true;
    },
    // 隐藏弹窗
    hidePopup() {
      this.showSwitchWeek = false;
    },
    // 处理按钮点击事件
    handleButtonClick(num) {
      this.showSwitchWeek = false;
      this.switchWeekFn(num);
    },
    switchWeekFn(week) {
      this.nowWeek = week;
      this.getWeekDates();
    },
    getNowWeek() {
      const nowWeek = Utils_getNowWeek.getNowWeek(this.startDate, this.totalWeek);
      this.nowWeek = nowWeek;
      this.getWeekDates();
    },
    getWeekDates() {
      const startDate = new Date(this.startDate);
      const addTime = (this.nowWeek - 1) * 7 * 24 * 60 * 60 * 1e3;
      const firstDate = startDate.getTime() + addTime;
      const {
        month: nowMonth
      } = this.getDateObject(new Date(firstDate));
      const weekCalendar = [];
      for (let i = 0; i < this.weekDayCount; i++) {
        const date = new Date(firstDate + i * 24 * 60 * 60 * 1e3);
        const {
          day
        } = this.getDateObject(date);
        weekCalendar.push(day);
      }
      this.nowMonth = nowMonth;
      this.weekCalendar = weekCalendar;
    },
    getDateObject(date = /* @__PURE__ */ new Date()) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];
      const dayOfWeekIndex = date.getDay();
      const dayOfWeek = daysOfWeek[dayOfWeekIndex];
      return {
        year,
        month,
        day,
        dayOfWeek
        // 返回星期名称
      };
    },
    getCourse() {
      const cache = common_vendor.index.getStorageSync(this.courseCachekey).result.coursesList;
      const courseColorCachekey = common_vendor.index.getStorageSync(this.courseColorCachekey);
      if (cache) {
        this.courseList = cache;
        if (!courseColorCachekey) {
          this.buildCourseColor();
        } else {
          this.courseColor = courseColorCachekey;
        }
        return;
      }
      this.updateFn(true);
    },
    update() {
      this.isRotated = !this.isRotated;
      this.updateFn();
      this.checkLogin();
    },
    //公共的更新方法
    updateFn(firstEntry = false) {
      this.loading = true;
      common_vendor.index.$http.get("/api/get/course", {
        userId: this.userId,
        termName: this.termName
      }).then((res) => {
        if (res.statusCode === 404) {
          this.getClassCourse();
        } else if (res.errMsg == "request:ok") {
          this.courseList = res.data.data.result.coursesList;
          this.startDate = "";
          this.startDate = res.data.data.startTime;
          this.waterText = this.userInfo.grade + this.userInfo.class + this.userInfo.levels + this.userInfo.name;
          this.buildCourseColor();
          if (!this.firstEntry) {
            common_vendor.index.showToast({
              icon: "success",
              title: "更新成功"
            });
          }
          setTimeout(() => {
            this.loading = false;
          }, 1e3);
          this.getTodayDate();
          common_vendor.index.setStorageSync(this.courseCachekey, res.data.data);
        }
      });
    },
    getClassCourse() {
      common_vendor.index.$http.get("/api/get/alternative", {
        grade: this.userInfo.grade,
        className: this.userInfo.class,
        level: this.userInfo.levels,
        termName: this.termName
      }).then((res) => {
        if (res.errMsg == "request:ok") {
          this.courseList = res.data.data.result.coursesList;
          this.startDate = "";
          this.startDate = res.data.data.startTime;
          this.waterText = this.userInfo.grade + this.userInfo.class + this.userInfo.levels;
          this.buildCourseColor();
          if (!this.firstEntry) {
            common_vendor.index.showToast({
              icon: "success",
              title: "更新成功"
            });
          }
          setTimeout(() => {
            this.loading = false;
          }, 1e3);
          this.getTodayDate();
          common_vendor.index.setStorageSync(this.courseCachekey, res.data.data);
        }
      });
    },
    // 公共方法获取课表颜色
    buildCourseColor() {
      const courseColor = {};
      let colorIndex = 0;
      this.courseList.map((item) => {
        if (courseColor[item.name] === void 0) {
          courseColor[item.name] = this.colorList[colorIndex];
          colorIndex++;
        }
      });
      this.courseColor = courseColor;
      common_vendor.index.setStorageSync(this.courseColorCachekey, courseColor);
    },
    // 获取今天日期
    getTodayDate() {
      const {
        month,
        day,
        dayOfWeek
      } = this.getDateObject();
      this.todayMonth = month;
      this.todayDay = day;
      this.todayWeek = dayOfWeek;
      this.getNowWeek();
    }
  },
  onPullDownRefresh() {
    this.userId = common_vendor.index.getStorageSync("userInfo")._id;
    this.update();
    this.getTodayDate();
    common_vendor.index.showToast({
      title: "刷新成功",
      icon: "success",
      duration: 800
    });
    setTimeout(function() {
      common_vendor.index.stopPullDownRefresh();
    }, 1e3);
  },
  onShareAppMessage() {
    return {
      title: this.userInfo.name + "的课表",
      path: "pages/Schedule/Schedule?id=" + this.userInfo._id
    };
  },
  onShareTimeline() {
    return {
      title: this.userInfo.name + "的课表",
      path: "pages/Schedule/Schedule?id=" + this.userInfo._id
    };
  }
};
if (!Array) {
  const _easycom_courseSkeleton2 = common_vendor.resolveComponent("courseSkeleton");
  const _easycom_classPop2 = common_vendor.resolveComponent("classPop");
  (_easycom_courseSkeleton2 + _easycom_classPop2)();
}
const _easycom_courseSkeleton = () => "../../components/courseSkeleton/courseSkeleton.js";
const _easycom_classPop = () => "../../components/classPop/classPop.js";
if (!Math) {
  (_easycom_courseSkeleton + _easycom_classPop)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_assets._imports_0,
    c: $data.isRotated ? 1 : "",
    d: common_vendor.o((...args) => $options.update && $options.update(...args)),
    e: common_vendor.t($data.nowWeek),
    f: common_assets._imports_1$1,
    g: common_vendor.o((...args) => $options.showPopup && $options.showPopup(...args)),
    h: $data.statusBarHeight + "px",
    i: $data.statusBarHeight + "px",
    j: common_vendor.t($data.nowMonth < 10 ? "0" + $data.nowMonth : $data.nowMonth),
    k: common_vendor.f($data.weekIndexText, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.t($options.formatDate($data.weekCalendar[index], $data.nowMonth, item)),
        c: index,
        d: $data.nowMonth && $data.todayMonth == $data.todayMonth && $data.todayDay == $data.weekCalendar[index] && item == $data.todayWeek ? 1 : ""
      };
    }),
    l: common_vendor.f(12, (item, index, i0) => {
      return {
        a: common_vendor.t(index + 1 > 9 ? index + 1 : "0" + (index + 1)),
        b: common_vendor.t($data.time[index]),
        c: index
      };
    }),
    m: common_vendor.t($data.waterText),
    n: common_vendor.f($data.totalWeek, (itemWeek, weekIndex, i0) => {
      return common_vendor.e($data.courseList.length === 0 ? {
        a: common_assets._imports_2,
        b: common_vendor.o(($event) => $options.checkLogin(1), weekIndex)
      } : {}, $data.loading ? {
        c: "f264fbf6-0-" + i0
      } : {
        d: common_vendor.f($data.courseList, (item, index, i1) => {
          return common_vendor.e({
            a: $options.indexOf(item.weeks, weekIndex + 1)
          }, $options.indexOf(item.weeks, weekIndex + 1) ? {
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.address ? item.address : "未知"),
            d: $data.courseColor[item.name],
            e: item.sectionCount > 3 ? item.sectionCount * 140 + 20 + "rpx" : item.sectionCount * 140 + "rpx",
            f: (item.section - 1) * 150 + "rpx",
            g: $options.calculateLeft(item.week) + "rpx"
          } : {}, {
            h: index,
            i: common_vendor.o(($event) => $options.navCourse(index), index)
          });
        })
      }, {
        e: weekIndex
      });
    }),
    o: $data.courseList.length === 0,
    p: $data.loading,
    q: $data.nowWeek - 1,
    r: common_vendor.o((...args) => $options.swiperChange && $options.swiperChange(...args)),
    s: $data.statusBarHeight * 2 + "px",
    t: common_vendor.f(20, (num, index, i0) => {
      return {
        a: common_vendor.t(num),
        b: num,
        c: common_vendor.o(($event) => $options.handleButtonClick(num), num),
        d: $data.nowWeek === index + 1 ? 1 : ""
      };
    }),
    v: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args)),
    w: common_vendor.o(() => {
    }),
    x: $data.showSwitchWeek,
    y: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args)),
    z: _ctx.userInfo.class === "辅导员" || _ctx.userInfo.admin === true
  }, _ctx.userInfo.class === "辅导员" || _ctx.userInfo.admin === true ? {
    A: common_vendor.o((...args) => $options.getcounsellorclass && $options.getcounsellorclass(...args))
  } : {}, {
    B: common_vendor.o($options.closeDialog),
    C: common_vendor.o($options.handleItemSelected),
    D: common_vendor.p({
      show: $data.showDialog,
      dataList: $data.classList
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
