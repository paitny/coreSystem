"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "minNav",
  data() {
    return {
      navList: [],
      baseURL: ""
    };
  },
  mounted() {
    this.baseURL = common_vendor.index.baseURL;
    this.getNavData();
  },
  methods: {
    getNavData() {
      common_vendor.index.$http.get("/api/route/minNav").then((res) => {
        this.navList = res.data;
      });
    },
    option(url) {
      common_vendor.index.navigateTo({
        url
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.navList, (item, index, i0) => {
      return {
        a: `${$data.baseURL}${item.img}`,
        b: common_vendor.o(($event) => $options.option(item.page), index),
        c: common_vendor.t(item.title),
        d: common_vendor.o(($event) => $options.option(item.page), index),
        e: index
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
