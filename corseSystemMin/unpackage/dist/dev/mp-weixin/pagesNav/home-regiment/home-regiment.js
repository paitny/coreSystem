"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      alumnusData: [],
      baseURL: []
    };
  },
  onLoad() {
    this.baseURL = common_vendor.index.baseURL;
    this.getAlumnusData();
  },
  methods: {
    getAlumnusData() {
      common_vendor.index.$http.get("/api/get/alumnus").then((res) => {
        this.alumnusData = res.data.data;
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.alumnusData, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.classes),
        c: common_vendor.t(item.position),
        d: common_vendor.t(item.salary),
        e: `${$data.baseURL}${item.photo}`,
        f: item._id
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
