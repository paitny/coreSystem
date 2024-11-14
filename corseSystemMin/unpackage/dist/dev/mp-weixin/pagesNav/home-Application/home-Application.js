"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      baseURL: "",
      // list:[],
      list: ["aa", "bb", "cc", "dd"],
      screenHeight: 0
    };
  },
  onLoad() {
    this.baseURL = common_vendor.index.baseURL;
    common_vendor.index.$http.get("/api/route/teacher").then((res) => {
      this.list = res.data;
    }), // 系统信息的概念
    common_vendor.index.getSystemInfo({
      success: (res) => {
        this.screenHeight = res.windowHeight;
      }
    }), common_vendor.index.getSystemInfo({
      success: function(res) {
        res.windowHeight;
      }
    });
    setTimeout(() => {
      this.loading = false;
    }, 1e3);
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.list, (item, index, i0) => {
      return {
        a: common_vendor.t(item.position),
        b: `${$data.baseURL}${item.img}`,
        c: common_vendor.t(item.name),
        d: common_vendor.t(item.office),
        e: common_vendor.t(item.introduction),
        f: index
      };
    }),
    b: $data.screenHeight + "px"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
