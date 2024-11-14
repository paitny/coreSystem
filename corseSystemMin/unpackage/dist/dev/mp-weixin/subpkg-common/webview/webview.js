"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      externalLink: ""
      // 外部链接的URL
    };
  },
  onLoad(options) {
    if (options && options.url) {
      this.externalLink = options.url;
    }
  },
  methods: {
    onWebviewMessage(e) {
      console.log("Received message from webview:", e.detail);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.externalLink,
    b: common_vendor.o((...args) => $options.onWebviewMessage && $options.onWebviewMessage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
