"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      swierIndex: 0,
      currentNavtab: 0,
      navTab: ["校园动态", "最新活动", "校园活动"],
      list: [],
      img: "https://www.pp3.cn/uploads/allimg/200820/14-200R0092153.jpg",
      heightEle: 0,
      baseURL: ""
    };
  },
  onLoad(options) {
    this.baseURL = common_vendor.index.baseURL;
    this.switchTab(this.navTab[options.index], parseInt(options.index));
  },
  methods: {
    switchTab(itemName, index) {
      this.currentNavtab = index;
      common_vendor.index.$http.get("/api/get/itNews/class", {
        newClass: itemName
      }).then((res) => {
        this.list = [];
        this.list = res.data.data;
        this.heightEle = res.data.data.length * 204;
      });
    },
    onChangeTab(e) {
      this.switchTab(this.navTab[e.detail.current], e.detail.current);
    },
    news(id) {
      common_vendor.index.navigateTo({
        url: "/pagesHome/news/news?id=" + id
      });
    },
    // 去掉中文字符以外的字符
    delHtmlTag(str) {
      return str.replace(/[^\u4e00-\u9fa5]/g, "");
    },
    // 时间格式
    date(time) {
      return common_vendor.hooks(time).format("YYYY-MM-DD");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.navTab, (itemName, index, i0) => {
      return {
        a: common_vendor.t(itemName),
        b: $data.currentNavtab === index ? 1 : "",
        c: index,
        d: common_vendor.o(($event) => $options.switchTab(itemName, index), index)
      };
    }),
    b: common_vendor.f($data.navTab, (itemNav, index, i0) => {
      return {
        a: common_vendor.f($data.list, (item, idx, i1) => {
          return {
            a: common_vendor.t(item.title.substring(0, 10)),
            b: common_vendor.t(item.title.length > 10 ? "..." : ""),
            c: common_vendor.t($options.delHtmlTag(item.des).substring(0, 14)),
            d: common_vendor.t(item.des.length > 10 ? "..." : ""),
            e: common_vendor.t(item.pv),
            f: common_vendor.t($options.date(item.date)),
            g: `${$data.baseURL}${item.cover}`,
            h: common_vendor.o(($event) => $options.news(item._id), idx),
            i: idx
          };
        }),
        b: index
      };
    }),
    c: common_assets._imports_1,
    d: common_vendor.o((...args) => $options.onChangeTab && $options.onChangeTab(...args)),
    e: $data.currentNavtab,
    f: $data.heightEle + "rpx"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
