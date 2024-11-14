"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    previewImage() {
      common_vendor.index.previewImage({
        urls: ["https://wypty.cn/static/file/material/Organization.png"],
        // 图片的URL数组
        current: 0
        // 当前显示图片的索引
      });
    }
  },
  onShareAppMessage() {
    return {
      title: "人工智能与大数据学院组织机构图",
      path: "/pagesHome/home/organization"
    };
  },
  onShareTimeline() {
    return {
      title: "人工智能与大数据学院组织机构图",
      path: "/pagesHome/home/organization"
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.previewImage && $options.previewImage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
