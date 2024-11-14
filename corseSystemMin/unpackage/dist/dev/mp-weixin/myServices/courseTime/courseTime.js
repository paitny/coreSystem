"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const coursepop = () => "../../components/coursepop/coursepop.js";
const _sfc_main = {
  components: {
    coursepop
  },
  data() {
    return {
      baseURL: "",
      isloading: true,
      semesters: [],
      selectedSemester: this.getCurrentSemester(),
      isPopupVisible: false,
      // 控制弹窗是否显示，初始为不显示
      missingHours: 0,
      // 缺课学时，您可以根据实际情况设置这个值
      activeData: []
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  onLoad() {
    this.baseURL = common_vendor.index.baseURL;
    this.getSemster();
    this.getStudent();
  },
  methods: {
    checkCourseTime() {
      if (this.missingHours >= 11) {
        this.hidePopup();
      }
    },
    getSemster() {
      common_vendor.index.$http.get("/api/get/semesters").then((res) => {
        res.data.data.forEach((item) => {
          this.semesters.push(item.name);
        });
      });
    },
    onSemesterChange(event) {
      const index = event.detail.value;
      this.selectedSemester = this.semesters[index];
      this.getStudent();
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
        semester = "暑假";
        academicYear = `${currentYear - 1}-${currentYear}学年度`;
      }
      return `${academicYear}${semester}`;
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
    // 例如，在某个条件满足时显示弹窗并设置缺课学时
    showPopupWithHours(hours) {
      this.isPopupVisible = true;
      this.missingHours = hours;
    },
    getStudent() {
      common_vendor.index.$http.get("/api/get/studentCourseAbsence", {
        userId: this.userInfo._id,
        grade: this.userInfo.grade,
        class: this.userInfo.class,
        level: this.userInfo.levels,
        termName: this.selectedSemester
      }).then((res) => {
        this.activeData = res.data.absences;
        console.log(res.data);
        this.isloading = false;
        this.missingHours = res.data.totalAbsentHours;
        this.checkCourseTime();
      });
    },
    hidePopup() {
      this.isPopupVisible = !this.isPopupVisible;
    }
  }
};
if (!Array) {
  const _easycom_loading2 = common_vendor.resolveComponent("loading");
  const _easycom_coursepop2 = common_vendor.resolveComponent("coursepop");
  (_easycom_loading2 + _easycom_coursepop2)();
}
const _easycom_loading = () => "../../components/loading/loading.js";
const _easycom_coursepop = () => "../../components/coursepop/coursepop.js";
if (!Math) {
  (_easycom_loading + _easycom_coursepop)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t("《" + $data.selectedSemester + "》"),
    b: $data.semesters,
    c: common_vendor.o((...args) => $options.onSemesterChange && $options.onSemesterChange(...args)),
    d: $data.activeData.length === 0
  }, $data.activeData.length === 0 ? {
    e: common_assets._imports_0$4
  } : {}, {
    f: $data.isloading
  }, $data.isloading ? {} : {}, {
    g: common_vendor.f($data.activeData, (item, k0, i0) => {
      return {
        a: `${$data.baseURL}${item.photo}`,
        b: common_vendor.o(($event) => _ctx.clickImg(item.photo), item._id),
        c: common_vendor.t(item.week),
        d: common_vendor.t(item.rawSection),
        e: common_vendor.t(item.courseName),
        f: common_vendor.t($options.parseDateStringAndFormat(item.date)),
        g: common_vendor.t(item.status === "absent" ? "缺席" : "请假"),
        h: item._id
      };
    }),
    h: common_vendor.o($options.hidePopup),
    i: common_vendor.p({
      isPopupVisible: $data.isPopupVisible,
      missingHours: $data.missingHours
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
