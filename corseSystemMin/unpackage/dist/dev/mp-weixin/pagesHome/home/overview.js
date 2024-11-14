"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  onShareAppMessage() {
    return {
      title: "信工学院概况",
      path: "/pagesHome/home/overview"
    };
  },
  onShareTimeline() {
    return {
      title: "信工学院概况",
      path: "/pagesHome/home/overview"
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
