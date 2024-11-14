"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {},
  onShareAppMessage() {
    return {
      title: "信工服务中心",
      path: "/pages/home/index"
    };
  },
  onShareTimeline() {
    return {
      title: "信工服务中心",
      path: "/pages/home/index"
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(8, (item, index, i0) => {
      return {
        a: index
      };
    }),
    b: common_vendor.f(3, (item, index, i0) => {
      return {
        a: index
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-94ec6496"]]);
wx.createComponent(Component);
