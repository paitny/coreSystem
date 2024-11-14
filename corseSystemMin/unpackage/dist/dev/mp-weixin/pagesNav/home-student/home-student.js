"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      studentOrginData: [],
      baseURL: ""
    };
  },
  onLoad() {
    this.baseURL = common_vendor.index.baseURL;
    this.getstudentOrginData();
  },
  methods: {
    getstudentOrginData() {
      common_vendor.index.$http.get("/api/get/getAllStudentOrgs").then((res) => {
        this.studentOrginData = res.data;
      });
    },
    gothisDepartments(id, name) {
      common_vendor.index.navigateTo({
        url: "/pagesHome/Departments/Departments?id=" + id + "&institution=" + name
      });
    }
  },
  onShareAppMessage() {
    return {
      title: "学生机构",
      path: "/pagesNav/home-student/home-student"
    };
  },
  onShareTimeline() {
    return {
      title: "学生机构",
      path: "/pagesNav/home-student/home-student"
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.studentOrginData, (item, k0, i0) => {
      return {
        a: `${$data.baseURL}${item.cover}`,
        b: common_vendor.t(item.due),
        c: common_vendor.t(item.name),
        d: item._id,
        e: common_vendor.o(($event) => $options.gothisDepartments(item._id, item.name), item._id)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
