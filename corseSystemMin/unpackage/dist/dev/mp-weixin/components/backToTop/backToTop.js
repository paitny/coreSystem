"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  name: "viewTop",
  data() {
    return {
      topShow: false
    };
  },
  props: {
    scrollTop: {
      type: Number,
      default: 0
    }
  },
  methods: {
    topData(e) {
      this.topShow = e > 600;
    },
    goTop() {
      common_vendor.index.pageScrollTo({
        scrollTop: this.scrollTop,
        duration: 300
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.topShow
  }, $data.topShow ? {
    b: common_assets._imports_0$11,
    c: common_vendor.o(($event) => $options.goTop())
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
