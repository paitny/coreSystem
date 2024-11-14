"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const loading = () => "../../components/loading/loading.js";
const _sfc_main = {
  data() {
    return {
      indexList: [],
      baseURL: "",
      isloading: true
    };
  },
  onLoad() {
    this.baseURL = common_vendor.index.baseURL;
    this.getNewsList();
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  components: {
    loading
  },
  methods: {
    async getNewsList() {
      await common_vendor.index.$http.get("/api/get/footprints", {
        userId: this.userInfo._id
      }).then((res) => {
        if (res.errMsg == "request:ok") {
          this.indexList = res.data.data;
          setTimeout(() => {
            this.isloading = false;
          }, 500);
        }
      }).catch((error) => {
        if (error) {
          this.isloading = true;
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
    timestampToDatetime(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const datetimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return datetimeString;
    }
  }
};
if (!Array) {
  const _easycom_loading2 = common_vendor.resolveComponent("loading");
  _easycom_loading2();
}
const _easycom_loading = () => "../../components/loading/loading.js";
if (!Math) {
  _easycom_loading();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isloading
  }, $data.isloading ? {} : common_vendor.e({
    b: $data.indexList.length === 0
  }, $data.indexList.length === 0 ? {
    c: common_assets._imports_0$4
  } : {}, {
    d: common_vendor.f($data.indexList, (item, idx, i0) => {
      return {
        a: common_vendor.t(item.title.substring(0, 10)),
        b: common_vendor.t(item.title.length > 10 ? "..." : ""),
        c: common_vendor.t($options.delHtmlTag(item.des).substring(0, 14)),
        d: common_vendor.t(item.des.length > 10 ? "..." : ""),
        e: common_vendor.t($options.simplifyNumber(item.pv)),
        f: common_vendor.t($options.timestampToDatetime(item.timestamp)),
        g: `${$data.baseURL}${item.cover}`,
        h: common_vendor.o(($event) => $options.news(item._id), idx),
        i: idx
      };
    }),
    e: common_assets._imports_1
  }));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
