"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const minNav = () => "../../components/minNav/minNav.js";
const load = () => "../../components/load/load.js";
const _sfc_main = {
  data() {
    return {
      showload: true,
      // heightEle:listNum*204,
      indexList: [],
      baseURL: ""
    };
  },
  components: {
    minNav,
    load
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  onShow() {
  },
  onLoad() {
    this.baseURL = common_vendor.index.baseURL;
    this.getNewList();
  },
  onShareAppMessage() {
    return {
      title: "首页",
      path: "/pages/index/index"
    };
  },
  onShareTimeline() {
    return {
      title: "首页",
      path: "/pages/index/index"
    };
  },
  methods: {
    getNewList() {
      common_vendor.index.$http.get("/api/get/newsLimit").then((res) => {
        if (res.errMsg == "request:ok") {
          this.indexList = res.data.data;
          setTimeout(() => {
            this.showload = false;
          }, 1e3);
        }
      }).catch((error) => {
        console.error(error);
        if (error) {
          this.showload = true;
        }
      });
    },
    chatAI() {
      common_vendor.index.navigateTo({
        url: "/pagesNav/societies/societies"
      });
    },
    skip() {
      common_vendor.index.navigateToMiniProgram({
        // appid  写你要跳转的小程序的 appid
        appId: "wxef891dcddac6ee45",
        // 路径写  src下的路径,假如你跳转的是pages下的页面,就可以写pages/index
        path: "pages/index/index",
        extraData: {
          // 'type': 'out'
        },
        // 这个不写的话会显示开发环境,不能正常跳转,写上就能正常跳转了
        envVersion: "develop",
        success(res) {
          common_vendor.index.showToast({
            title: "跳转成功"
          });
        },
        fail(err) {
          common_vendor.index.showToast({
            title: "跳转失败",
            icon: "error"
          });
        }
      });
    },
    simplifyNumber(num) {
      if (num >= 1e8) {
        return (num / 1e8).toFixed(1) + "m";
      } else if (num >= 1e7) {
        return (num / 1e4).toFixed(1) + "w";
      } else if (num >= 1e4) {
        return (num / 1e4).toFixed(1) + "w";
      } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + "K";
      } else {
        return num.toString();
      }
    },
    goTopage(url) {
      common_vendor.index.navigateTo({
        url
      });
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
  },
  onPullDownRefresh() {
    common_vendor.index.showToast({
      title: "刷新成功",
      icon: "success",
      duration: 800
    });
    setTimeout(function() {
      common_vendor.index.stopPullDownRefresh();
    }, 1e3);
  }
};
if (!Array) {
  const _easycom_load2 = common_vendor.resolveComponent("load");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_minNav2 = common_vendor.resolveComponent("minNav");
  (_easycom_load2 + _easycom_uni_icons2 + _easycom_minNav2)();
}
const _easycom_load = () => "../../components/load/load.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_minNav = () => "../../components/minNav/minNav.js";
if (!Math) {
  (_easycom_load + _easycom_uni_icons + _easycom_minNav)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showload
  }, $data.showload ? {
    b: common_vendor.p({
      selector: "load"
    })
  } : common_vendor.e({
    c: common_vendor.p({
      type: "search",
      size: "26",
      color: "#9F9F9F"
    }),
    d: common_vendor.o(($event) => $options.chatAI()),
    e: common_vendor.o(($event) => $options.goTopage("/pagesHome/activity/volunteer")),
    f: common_vendor.o((...args) => $options.skip && $options.skip(...args)),
    g: common_vendor.o(($event) => $options.goTopage("/pagesHome/activity/latest?index=1")),
    h: !_ctx.userInfo.adminPlus && !_ctx.userInfo.admin
  }, !_ctx.userInfo.adminPlus && !_ctx.userInfo.admin ? {} : {}, {
    i: common_vendor.o(($event) => $options.goTopage("/pagesHome/activity/latest?index=0")),
    j: common_vendor.f($data.indexList, (item, idx, i0) => {
      return {
        a: common_vendor.t(item.title.substring(0, 10)),
        b: common_vendor.t(item.title.length > 10 ? "..." : ""),
        c: common_vendor.t($options.delHtmlTag(item.des).substring(0, 14)),
        d: common_vendor.t(item.des.length > 10 ? "..." : ""),
        e: common_vendor.t($options.simplifyNumber(item.pv)),
        f: common_vendor.t($options.date(item.date)),
        g: `${$data.baseURL}${item.cover}`,
        h: common_vendor.o(($event) => $options.news(item._id), idx),
        i: idx
      };
    }),
    k: common_assets._imports_1
  }));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
