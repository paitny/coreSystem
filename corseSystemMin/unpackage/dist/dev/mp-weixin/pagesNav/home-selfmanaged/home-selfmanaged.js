"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      chooseTab: 0,
      //当前选中的选项卡：默认选中第一个~
      list: []
    };
  },
  onLoad() {
    this.getlistData();
  },
  methods: {
    clickTab: function(e) {
      this.chooseTab = e.target.dataset.choose;
    },
    getlistData() {
      common_vendor.index.$http.get("/api/route/competitionData").then((res) => {
        this.list = res.data;
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.list, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.n($data.chooseTab == index ? "active" : ""),
        c: index,
        d: common_vendor.o((...args) => $options.clickTab && $options.clickTab(...args), item.id),
        e: item.id
      };
    }),
    b: common_vendor.f($data.list, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t(item.content),
        c: common_vendor.s($data.chooseTab != index ? "display:none" : "")
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
