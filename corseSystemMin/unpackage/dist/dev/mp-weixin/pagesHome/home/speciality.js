"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      specialitiesData: []
    };
  },
  mounted() {
    this.getSpecialities();
  },
  methods: {
    getSpecialities() {
      common_vendor.index.$http.get("/api/route/specialities").then((res) => {
        this.specialitiesData = res.data;
      });
    }
  },
  onShareAppMessage() {
    return {
      title: "人工智能与大数据学院简介",
      path: "/pagesHome/home/speciality"
    };
  },
  onShareTimeline() {
    return {
      title: "人工智能与大数据专业简介",
      path: "/pagesHome/home/speciality"
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.specialitiesData, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.time),
        c: common_vendor.t(item.introduction),
        d: item.id
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
