"use strict";
const common_vendor = require("../../common/vendor.js");
const checkCourseCountLoad = () => "../../components/checkCourse-skeleton/checkCourse-skeleton.js";
const _sfc_main = {
  data() {
    return {
      showload: true,
      baseURL: "",
      currentWeek: "",
      students: [],
      filteredStudents: [],
      searchQuery: ""
    };
  },
  onLoad(options) {
    this.currentWeek = options.week;
    this.baseURL = common_vendor.index.baseURL;
    this.getRanking();
  },
  components: {
    checkCourseCountLoad
  },
  methods: {
    async getRanking() {
      try {
        const res = await common_vendor.index.$http.get("/api/aiCourse/class-checks", {
          week: this.currentWeek
        });
        if (res.errMsg == "request:ok") {
          this.students = res.data;
          this.filteredStudents = res.data;
          setTimeout(() => {
            this.showload = false;
          }, 1e3);
        }
      } catch (error) {
        console.error("获取排名数据失败:", error);
      }
    },
    filterStudents() {
      const query = this.searchQuery.toLowerCase();
      this.filteredStudents = this.students.filter((student) => {
        return student.counsellor.toLowerCase().includes(query) || student.grade.toLowerCase().includes(query) || student.class.toLowerCase().includes(query) || student.level.toLowerCase().includes(query);
      });
    },
    toCheckCoursePage(grade, className, level) {
      common_vendor.index.navigateTo({
        url: `../../myServices/checkCourse/checkCourse?grade=${grade}&className=${className}&level=${level}`
      });
    },
    getNumberStyle(index) {
      let backgroundColor = "#f0f0f0";
      let color = "#333";
      switch (index) {
        case 0:
          backgroundColor = "#ffd700";
          color = "#fff";
          break;
        case 1:
          backgroundColor = "#c0c0c0";
          color = "#000";
          break;
        case 2:
          backgroundColor = "#cd7f32";
          color = "#fff";
          break;
      }
      return {
        backgroundColor,
        color
      };
    }
  },
  mounted() {
    this.getRanking();
  },
  beforeDestroy() {
    clearInterval(this.interval);
    this.stopSlider();
  }
};
if (!Array) {
  const _component_checkCourseCountLoad = common_vendor.resolveComponent("checkCourseCountLoad");
  const _component_transition_group = common_vendor.resolveComponent("transition-group");
  (_component_checkCourseCountLoad + _component_transition_group)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showload
  }, $data.showload ? {} : {
    b: common_vendor.t($data.currentWeek),
    c: common_vendor.o([($event) => $data.searchQuery = $event.detail.value, (...args) => $options.filterStudents && $options.filterStudents(...args)]),
    d: $data.searchQuery,
    e: common_vendor.f($data.filteredStudents, (student, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.s($options.getNumberStyle(index)),
        c: common_vendor.t(student.counsellor),
        d: common_vendor.t(student.grade),
        e: common_vendor.t(student.class),
        f: common_vendor.t(student.level),
        g: common_vendor.t(student.checkCount),
        h: student._id,
        i: common_vendor.o(($event) => $options.toCheckCoursePage(student.grade, student.class, student.level), student._id)
      };
    }),
    f: common_vendor.p({
      name: "fade",
      tag: "view"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-984b225d"]]);
wx.createPage(MiniProgramPage);
