"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  name: "notice",
  data() {
    return {
      notice: "",
      hideNotice: true
    };
  },
  methods: {
    switchNotice() {
      this.hideNotice = false;
    },
    async getNewsList() {
      const {
        data
      } = await common_vendor.index.$http.get("/api/get/latestNotice");
      this.notice = data.noticeComment;
    }
  },
  mounted() {
    this.getNewsList();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.hideNotice
  }, $data.hideNotice ? {
    b: common_assets._imports_0$9,
    c: common_vendor.t($data.notice),
    d: common_vendor.o((...args) => $options.switchNotice && $options.switchNotice(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
