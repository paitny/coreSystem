"use strict";
const common_vendor = require("../../common/vendor.js");
const Utils_semesterUtils = require("../../Utils/semesterUtils.js");
const myServices_common_xlsx = require("../common/xlsx.js");
const Utils_getNowWeek = require("../../Utils/getNowWeek.js");
const common_assets = require("../../common/assets.js");
const loading = () => "../../components/loading/loading.js";
const _sfc_main = {
  data() {
    return {
      weekMap: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      options: [
        {
          text: "修改",
          style: {
            backgroundColor: "#4d6398"
          }
        },
        {
          text: "删除",
          style: {
            backgroundColor: "#dd524d"
          }
        }
      ],
      semesters: [],
      activeData: [],
      filteredActiveData: [],
      baseURL: "",
      userId: "",
      selectedSemester: Utils_semesterUtils.getCurrentSemester(),
      isloading: true,
      loading: false,
      page: 1,
      total: 0,
      searchKeyword: "",
      weeks: Array.from({
        length: 20
      }, (v, k) => k + 1),
      selectedWeek: 0,
      startDate: "2024/9/2",
      // 开学日期
      totalWeek: 25
      // 周总数
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  components: {
    loading
  },
  methods: {
    getNowWeek() {
      const nowWeek = Utils_getNowWeek.getNowWeek(this.startDate, this.totalWeek);
      this.selectedWeek = nowWeek - 1;
    },
    onWeekChange(event) {
      this.selectedWeek = event.detail.value;
      this.page = 1;
      this.activeData = [];
      this.getActiveData();
    },
    formatDateString(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    toVisualizing(shouldAttend, actualAttend, leave, absent, week, weekday, name, rawSection, results, geade, className, level) {
      common_vendor.index.navigateTo({
        url: "../../subpkg-visualization/ClassVisualization/ClassVisualization?shouldAttend=" + shouldAttend + "&actualAttend=" + actualAttend + "&leave=" + leave + "&absent=" + absent + "&title=" + name + "&time=第" + week + "周 " + this.weekMap[weekday] + " " + rawSection + "&results=" + JSON.stringify(results) + "&className=" + geade + className + level
      });
    },
    clickImg(index, imageUrls) {
      const urls = [];
      for (const name of imageUrls) {
        console.log(name);
        urls.push(this.baseURL + name);
      }
      common_vendor.index.previewImage({
        urls,
        // 图片的URL数组
        current: index
        // 当前显示图片的索引
      });
    },
    onSemesterChange(event) {
      const index = event.detail.value;
      this.selectedSemester = this.semesters[index];
      this.page = 1;
      this.activeData = [];
      this.isloading = true;
      this.getActiveData();
    },
    getSemster() {
      common_vendor.index.$http.get("/api/get/semesters").then((res) => {
        res.data.data.forEach((item) => {
          this.semesters.push(item.name);
        });
      });
    },
    onClick(e, id, course, grade, className, level, cover, results, weekday, index, isProvide) {
      let {
        content
      } = e;
      if (content.text === "删除") {
        this.deleteItem(id, course, grade, className, level, cover, index);
      } else if (content.text === "修改") {
        this.updateActivity(course, grade, className, level, results, cover, weekday, isProvide);
      }
    },
    swipeChange(e) {
    },
    process(id, audit, title, index) {
      common_vendor.index.showModal({
        content: "您确定要驳回" + title + "活动?",
        success: (e) => {
          if (e.confirm) {
            common_vendor.index.$http.post("/api/itVolunteer/update-audit", {
              id,
              audit: !audit
            }).then((res) => {
              common_vendor.index.showToast({
                icon: "none",
                title: res.data.message
              });
              this.activeData.splice(index, 1);
              this.lazyLoading();
            });
          }
        }
      });
    },
    change(e, audit) {
    },
    parseDateStringAndFormat(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
    },
    updateActivity(course, grade, className, level, results, photo, weekday, isProvide) {
      const serializedCourse = JSON.stringify(course);
      const result = JSON.stringify(results);
      common_vendor.index.navigateTo({
        url: `/subpkg-common/attendanceCourse/attendanceCourse?grade=${grade}&class=${className}&level=${level}&course=${encodeURIComponent(serializedCourse)}&week=${this.weeks[this.selectedWeek]}&weekday=${weekday}&results=${result}&photo=${JSON.stringify(photo)}&isProvide=${JSON.stringify(isProvide)}`
      });
    },
    deleteItem(id, course, grade, className, level, cover, index) {
      common_vendor.index.showModal({
        content: "您确定要删除" + grade + className + level + "的" + course.name + "查课数据?",
        success: (e) => {
          if (e.confirm) {
            common_vendor.index.$http.post("/api/aiCourse/deleteCourseFeedback", {
              id,
              photo: cover
            }).then((res) => {
              this.activeData.splice(index, 1);
              this.lazyLoading();
              common_vendor.index.showToast({
                icon: "none",
                title: res.data.msg
              });
            });
          }
        }
      });
    },
    downloadAndWriteToFile(week, weekday, name, rawSection, results) {
      const coursetitle = name + "第" + week + "周" + this.weekMap[weekday] + rawSection;
      myServices_common_xlsx.exportCheckCourseToExcel(results, coursetitle);
    },
    getActiveData() {
      this.loading = true;
      common_vendor.index.$http.get("/api/get/getClassInfo", {
        termName: this.selectedSemester,
        page: this.page,
        userId: this.userInfo._id,
        week: parseInt(this.selectedWeek) + 1
      }).then((res) => {
        if (res.statusCode === 404) {
          this.activeData = [];
          this.loading = false;
          this.isloading = false;
        } else if (res.errMsg == "request:ok") {
          this.total = res.data.total;
          setTimeout(() => {
            this.loading = false;
            this.isloading = false;
            this.activeData = this.activeData.map((item) => {
              const newItem = res.data.data.find((t) => t._id === item._id);
              return newItem ? {
                ...item,
                ...newItem
              } : item;
            }).concat(
              res.data.data.filter((newItem) => !this.activeData.some((item) => item._id === newItem._id))
            );
          }, 1e3);
        }
      }).catch((error) => {
        if (error) {
          this.isloading = true;
        }
      });
    },
    application(userData) {
      common_vendor.index.navigateTo({
        url: `../../subpkg-visualization/checkCourseData/checkCourseData?results=${JSON.stringify(userData)}`
      });
    },
    toCheckCourseCount() {
      common_vendor.index.navigateTo({
        url: `../../subpkg-visualization/checkCourseCount/checkCourseCount?week=${this.weeks[this.selectedWeek]}`
      });
    },
    lazyLoading() {
      this.page = this.page;
      this.getActiveData();
    }
  },
  onLoad(options) {
    this.isSign = options.sign;
    this.baseURL = common_vendor.index.baseURL;
    this.getNowWeek();
    this.getSemster();
    this.lazyLoading();
  },
  onReachBottom() {
    if (this.activeData.length < this.total) {
      this.page++;
      this.loading = true;
      this.getActiveData();
    } else {
      common_vendor.index.showToast({
        title: "我是有底线的噢",
        icon: "none",
        duration: 1800
      });
    }
  },
  onPullDownRefresh() {
    this.lazyLoading();
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
  const _easycom_loading2 = common_vendor.resolveComponent("loading");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  (_easycom_loading2 + _easycom_uni_icons2 + _easycom_uni_swipe_action_item2)();
}
const _easycom_loading = () => "../../components/loading/loading.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_swipe_action_item = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
if (!Math) {
  (_easycom_loading + _easycom_uni_icons + _easycom_uni_swipe_action_item)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t("《" + $data.selectedSemester + "》"),
    b: $data.semesters,
    c: common_vendor.o((...args) => $options.onSemesterChange && $options.onSemesterChange(...args)),
    d: common_vendor.t($data.weeks[$data.selectedWeek]),
    e: $data.weeks,
    f: $data.selectedWeek,
    g: common_vendor.o((...args) => $options.onWeekChange && $options.onWeekChange(...args)),
    h: $data.activeData.length === 0
  }, $data.activeData.length === 0 ? {
    i: common_assets._imports_0$4
  } : {}, {
    j: $data.isloading
  }, $data.isloading ? {} : common_vendor.e({
    k: _ctx.userInfo.admin || _ctx.userInfo.position.includes("学习部")
  }, _ctx.userInfo.admin || _ctx.userInfo.position.includes("学习部") ? {
    l: common_vendor.f($data.activeData, (item, index, i0) => {
      return {
        a: `${$data.baseURL}${item.photo[0]}`,
        b: common_vendor.o(($event) => $options.clickImg(0, item.photo), item._id),
        c: common_vendor.t(item.week),
        d: common_vendor.t($data.weekMap[item.weekday]),
        e: common_vendor.t($options.formatDateString(item.createdAt)),
        f: common_vendor.t(item.grade + item.class + item.level),
        g: common_vendor.t(item.course.name),
        h: common_vendor.t(item.counsellor),
        i: common_vendor.t(item.checker),
        j: common_vendor.t(item.shouldAttend),
        k: common_vendor.t(item.actualAttend),
        l: common_vendor.t(item.leave),
        m: common_vendor.t(item.absent),
        n: common_vendor.o(($event) => $options.application(item.results), item._id),
        o: "1b580bb9-2-" + i0 + "," + ("1b580bb9-1-" + i0),
        p: common_vendor.t(item.shouldAttend),
        q: "1b580bb9-3-" + i0 + "," + ("1b580bb9-1-" + i0),
        r: common_vendor.t(item.actualAttend),
        s: "1b580bb9-4-" + i0 + "," + ("1b580bb9-1-" + i0),
        t: common_vendor.t(item.leave + item.absent),
        v: common_vendor.o(($event) => $options.downloadAndWriteToFile(item.week, item.weekday, item.course.name, item.course.rawSection, item.results), item._id),
        w: common_vendor.o(($event) => $options.toVisualizing(item.shouldAttend, item.actualAttend, item.leave, item.absent, item.week, item.weekday, item.course.name, item.course.rawSection, item.results, item.grade, item.class, item.level), item._id),
        x: common_vendor.o(($event) => $options.onClick($event, item._id, item.course, item.grade, item.class, item.level, item.photo, item.results, item.weekday, index, item.isProvide), item._id),
        y: common_vendor.o(($event) => $options.change($event, item.audit), item._id),
        z: item._id,
        A: "1b580bb9-1-" + i0,
        B: item._id
      };
    }),
    m: common_vendor.p({
      type: "person-filled",
      size: "20"
    }),
    n: common_vendor.p({
      type: "flag-filled",
      size: "20"
    }),
    o: common_vendor.p({
      type: "flag",
      size: "20"
    }),
    p: common_vendor.p({
      ["right-options"]: $data.options
    })
  } : {
    q: common_vendor.f($data.activeData, (item, index, i0) => {
      return {
        a: `${$data.baseURL}${item.photo[0]}`,
        b: common_vendor.o(($event) => $options.clickImg(0, item.photo), item._id),
        c: common_vendor.t(item.week),
        d: common_vendor.t($data.weekMap[item.weekday]),
        e: common_vendor.t($options.formatDateString(item.createdAt)),
        f: common_vendor.t(item.grade + item.class + item.level),
        g: common_vendor.t(item.course.name),
        h: common_vendor.t(item.counsellor),
        i: common_vendor.t(item.shouldAttend),
        j: common_vendor.t(item.actualAttend),
        k: common_vendor.t(item.leave),
        l: common_vendor.t(item.absent),
        m: common_vendor.o(($event) => $options.application(item.results), item._id),
        n: "1b580bb9-5-" + i0,
        o: common_vendor.t(item.shouldAttend),
        p: "1b580bb9-6-" + i0,
        q: common_vendor.t(item.actualAttend),
        r: "1b580bb9-7-" + i0,
        s: common_vendor.t(item.leave + item.absent),
        t: common_vendor.o(($event) => $options.downloadAndWriteToFile(item.week, item.weekday, item.course.name, item.course.rawSection, item.results), item._id),
        v: common_vendor.o(($event) => $options.toVisualizing(item.shouldAttend, item.actualAttend, item.leave, item.absent, item.week, item.weekday, item.course.name, item.course.rawSection, item.results, item.grade, item.class, item.level), item._id),
        w: item._id
      };
    }),
    r: common_vendor.p({
      type: "person-filled",
      size: "20"
    }),
    s: common_vendor.p({
      type: "flag-filled",
      size: "20"
    }),
    t: common_vendor.p({
      type: "flag",
      size: "20"
    })
  }, {
    v: $data.loading
  }, $data.loading ? {} : {}, {
    w: $data.activeData.length > 0 && $data.activeData.length === $data.total
  }, $data.activeData.length > 0 && $data.activeData.length === $data.total ? {
    x: common_vendor.t($data.total)
  } : {}, {
    y: common_vendor.o((...args) => $options.toCheckCourseCount && $options.toCheckCourseCount(...args))
  }));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
