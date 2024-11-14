"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      collegeNavData: [],
      baseURL: ""
    };
  },
  onLoad() {
    this.baseURL = common_vendor.index.baseURL;
    this.getcollegeNavData();
  },
  methods: {
    getcollegeNavData() {
      common_vendor.index.$http.get("/api/route/collegeNav").then((res) => {
        this.collegeNavData = res.data;
      });
    },
    gopage(url) {
      common_vendor.index.navigateTo({
        url
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.collegeNavData, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: item.id,
        c: common_vendor.o(($event) => $options.gopage(item.page), item.id)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
