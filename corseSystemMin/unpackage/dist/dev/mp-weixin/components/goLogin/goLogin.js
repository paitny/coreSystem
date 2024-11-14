"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      type: 1
    };
  },
  onShareAppMessage() {
    return {
      title: "首页",
      path: "/pages/me/me"
    };
  },
  onShareTimeline() {
    return {
      title: "首页",
      path: "/pages/me/me"
    };
  },
  onLoad() {
  },
  methods: {
    login() {
      this.type = 2;
      common_vendor.index.navigateTo({
        url: "/pagesMe/login/login?type=" + this.type
      });
    },
    register() {
      this.type = 1;
      common_vendor.index.navigateTo({
        url: "/pagesMe/login/login?type=" + this.type
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.login && $options.login(...args)),
    b: common_vendor.o((...args) => $options.register && $options.register(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
