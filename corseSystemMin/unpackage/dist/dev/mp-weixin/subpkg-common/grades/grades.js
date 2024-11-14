"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      name: "",
      studentId: "",
      grades: null
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  onLoad() {
    this.name = this.userInfo.name;
    this.studentId = this.userInfo.num;
  },
  onShareAppMessage() {
    return {
      title: "学干考核成绩查询",
      path: "/subpkg-common/grades/grades"
    };
  },
  onShareTimeline() {
    return {
      title: "学干考核成绩查询",
      path: "/subpkg-common/grades/grades"
    };
  },
  methods: {
    async searchGrade() {
      if (this.name === "" || this.studentId === "") {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      try {
        const response = await common_vendor.index.$http.get("/api/get/grades", {
          name: this.name,
          num: this.studentId
        });
        if (response.statusCode === 200) {
          this.grades = response.data;
        } else {
          common_vendor.index.showToast({
            title: `查询失败，${response.data.message}`,
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "查询出错",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.name,
    b: common_vendor.o(($event) => $data.name = $event.detail.value),
    c: $data.studentId,
    d: common_vendor.o(($event) => $data.studentId = $event.detail.value),
    e: common_vendor.o((...args) => $options.searchGrade && $options.searchGrade(...args)),
    f: $data.grades !== null
  }, $data.grades !== null ? {
    g: common_vendor.t($data.grades.termTopic),
    h: common_vendor.t($data.grades.name),
    i: common_vendor.t($data.grades.num),
    j: common_vendor.t($data.grades.institution),
    k: common_vendor.t($data.grades.department),
    l: common_vendor.t($data.grades.singleChoiceScore),
    m: common_vendor.t($data.grades.fillScore),
    n: common_vendor.t($data.grades.essayScore),
    o: common_vendor.t($data.grades.thinkingScore),
    p: common_vendor.t($data.grades.totalScore),
    q: common_vendor.t($data.grades.rank)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
