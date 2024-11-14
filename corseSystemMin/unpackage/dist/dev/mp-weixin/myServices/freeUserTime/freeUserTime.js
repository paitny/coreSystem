"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const courseSkeleton = () => "../../components/courseSkeleton/courseSkeleton.js";
const _sfc_main = {
  data() {
    return {
      termName: "",
      //当前学年
      isRotated: false,
      todayMonth: 0,
      todayDay: 0,
      todayWeek: 0,
      courseCachekey: "course",
      statusBarHeight: 0,
      navBarHeight: 82 + 11,
      nowWeek: 1,
      totalWeek: 20,
      showSwitchWeek: false,
      weekDayCount: 7,
      startDate: "2024/9/2",
      weekIndexText: ["一", "二", "三", "四", "五", "六", "日"],
      nowMonth: 1,
      colorList: [
        "#efdee8",
        "#eadde6",
        "#e2e1e6",
        "#dae3ea",
        "#edd2e5",
        "#e6d4e2",
        "#dbd9e7",
        "#c9d9e8",
        "#ecc6df",
        "#becfed",
        "#e0c9e5",
        "#cdcde5"
      ],
      courseColor: {},
      courseColorCachekey: "courseColor",
      weekCalendar: [1, 2, 3, 4, 5, 6, 7],
      firstEntry: true,
      courseList: [],
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
      windowWidth: 0
    };
  },
  components: {
    courseSkeleton
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  created() {
    this.statusBarHeight = common_vendor.index.getSystemInfoSync()["statusBarHeight"];
    const {
      windowWidth
    } = common_vendor.index.getSystemInfoSync();
    this.windowWidth = windowWidth;
  },
  onLoad() {
    this.getTodayDate();
    this.getCurrentSemester();
    this.getWeekDates();
    this.getNowWeek();
  },
  methods: {
    buildCourseColor() {
      const courseColor = {};
      let colorIndex = 0;
      this.courseList.map((item) => {
        if (courseColor[item.section] === void 0) {
          courseColor[item.section] = this.colorList[colorIndex];
          colorIndex++;
        }
      });
      this.courseColor = courseColor;
      common_vendor.index.setStorageSync(this.courseColorCachekey, courseColor);
    },
    checkLogin() {
      common_vendor.index.$http.post("/api/login/min/check", {
        id: common_vendor.index.getStorageSync("userInfo")._id
      }).then((res) => {
        if (res.data.code === 0 || res.data.code === 2) {
          return common_vendor.index.showModal({
            content: "登录注册才有权限噢！",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.navigateTo({
                  url: "../../pagesMe/login/index"
                });
              }
            }
          });
        } else if (res.data.code === 1) {
          this.updateFn(this.nowWeek);
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
        url: `../../subpkg-common/freeUser/freeUser?info=${JSON.stringify(this.courseList[index])}`
      });
    },
    swiperChange(e) {
      const index = e.detail.current;
      this.updateFn(index + 1);
      this.switchWeekFn(index + 1);
    },
    indexOf(arr, value) {
      return arr.indexOf(value) > -1;
    },
    showPopup() {
      this.showSwitchWeek = true;
    },
    hidePopup() {
      this.showSwitchWeek = false;
    },
    handleButtonClick(num) {
      this.showSwitchWeek = false;
      this.switchWeekFn(num);
      this.updateFn(num);
    },
    switchWeekFn(week) {
      this.nowWeek = week;
      this.getWeekDates();
    },
    getNowWeek() {
      const nowDate = (/* @__PURE__ */ new Date()).getTime();
      const startDate = new Date(this.startDate);
      const time = nowDate - startDate;
      const nowWeek = Math.ceil(time / 1e3 / 60 / 60 / 24 / 7);
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
      const daysOfWeek = ["一", "二", "三", "四", "五", "六", "日"];
      const dayOfWeekIndex = date.getDay();
      const dayOfWeek = daysOfWeek[(dayOfWeekIndex + 6) % 7];
      return {
        year,
        month,
        day,
        dayOfWeek
      };
    },
    update() {
      this.isRotated = !this.isRotated;
      this.updateFn(this.nowWeek);
      this.getTodayDate();
      this.checkLogin();
    },
    initializeWeekData(targetWeekNum) {
      const totalDays = 7;
      const totalSections = 10;
      const result = [];
      for (let day = 1; day <= totalDays; day++) {
        for (let section = 1; section <= totalSections; section++) {
          result.push({
            weekNum: targetWeekNum,
            week: day,
            // 星期几
            day,
            // 天数（1到7对应周一到周日）
            section,
            // 第几节课
            sectionCount: 1,
            // 节次数量，默认为1
            weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
          });
        }
      }
      return result;
    },
    updateFn(weekNum) {
      this.loading = true;
      this.courseList = this.initializeWeekData(weekNum);
      console.log(this.courseList);
      this.buildCourseColor();
      setTimeout(() => {
        this.loading = false;
      }, 10);
    },
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
    }
  },
  onPullDownRefresh() {
    this.update(this.nowWeek);
    this.getTodayDate();
    common_vendor.index.showToast({
      title: "刷新成功",
      icon: "success",
      duration: 800
    });
    setTimeout(function() {
      common_vendor.index.stopPullDownRefresh();
    }, 1e3);
  }
};
if (!Array) {
  const _easycom_courseSkeleton2 = common_vendor.resolveComponent("courseSkeleton");
  _easycom_courseSkeleton2();
}
const _easycom_courseSkeleton = () => "../../components/courseSkeleton/courseSkeleton.js";
if (!Math) {
  _easycom_courseSkeleton();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
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
    m: common_vendor.f($data.totalWeek, (itemWeek, weekIndex, i0) => {
      return common_vendor.e($data.loading ? {
        a: "592ebe4e-0-" + i0
      } : {
        b: common_vendor.f($data.courseList, (item, index, i1) => {
          return common_vendor.e({
            a: $options.indexOf(item.weeks, weekIndex + 1)
          }, $options.indexOf(item.weeks, weekIndex + 1) ? {
            b: $data.courseColor[item.section],
            c: item.sectionCount * 140 + "rpx",
            d: (item.section - 1) * 150 + "rpx",
            e: (item.week - 1) * (($data.windowWidth - 50) / 7) + "px"
          } : {}, {
            f: index,
            g: common_vendor.o(($event) => $options.navCourse(index), index)
          });
        })
      }, {
        c: weekIndex
      });
    }),
    n: $data.loading,
    o: $data.nowWeek - 1,
    p: $data.firstEntry ? 0 : 300,
    q: common_vendor.o((...args) => $options.swiperChange && $options.swiperChange(...args)),
    r: $data.statusBarHeight * 2 + "px",
    s: common_vendor.f(20, (num, index, i0) => {
      return {
        a: common_vendor.t(num),
        b: num,
        c: common_vendor.o(($event) => $options.handleButtonClick(num), num),
        d: $data.nowWeek == index + 1 ? 1 : ""
      };
    }),
    t: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args)),
    v: common_vendor.o(() => {
    }),
    w: $data.showSwitchWeek,
    x: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
