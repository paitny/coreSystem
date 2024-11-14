"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      baseURL: "",
      // 初始化定时器为空
      timer: null,
      // 用户输入的关键词
      keyword: "",
      //搜索数据的数组初始化
      searchList: [],
      //搜索历史初始化
      historyList: [],
      // 初始化搜索发现列表
      foundList: []
    };
  },
  methods: {
    handhistoryItem(historyItem) {
      this.keyword = historyItem;
    },
    handFound(handItem) {
      this.keyword = handItem;
    },
    handleView(id) {
      common_vendor.index.navigateTo({
        url: "../../pagesHome/news/news?id=" + id
      });
    },
    delHtmlTag(str) {
      return str.replace(/[^\u4e00-\u9fa5]/g, "");
    },
    //用户输入时可以获取用户输入的内容
    input(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.keyword = e;
        this.getSearchContent();
      }, 500);
    },
    //获取搜索列表的方法
    async getSearchContent() {
      if (this.keyword.length == 0) {
        this.searchList = [];
        return;
      } else {
        await common_vendor.index.$http.get("/api/get/search", { query: this.keyword }).then((res) => {
          this.searchList = res.data.data.results;
          this.saveHistory();
        });
      }
    },
    // 保存历史记录
    saveHistory() {
      if (this.historyList.indexOf(this.keyword) == -1) {
        this.historyList.unshift(this.keyword);
        common_vendor.index.setStorage({
          key: "kw",
          data: JSON.stringify(this.historyList || "[]")
        });
      }
    },
    // 清空历史记录
    clearHistory() {
      this.historyList = [];
      common_vendor.index.removeStorage({
        key: "kw"
      });
      if (his.length == 0) {
        this.his = !this.his;
      }
    },
    async getFoundList() {
      await common_vendor.index.$http.get("/api/route/foundList").then((res) => {
        this.foundList = res.data.foundList;
      });
    }
  },
  onLoad() {
    this.getFoundList();
    this.historyList = JSON.parse(common_vendor.index.getStorageSync("kw"));
    this.baseURL = common_vendor.index.baseURL;
  }
};
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_search_bar2 + _easycom_uni_icons2)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_uni_icons)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.sr("searchBar", "1a049e6d-0"),
    b: common_vendor.o($options.input),
    c: common_vendor.o(($event) => $data.keyword = $event),
    d: common_vendor.p({
      focus: true,
      radius: 20,
      bgColor: "#F7F7F7",
      cancelButton: "none",
      modelValue: $data.keyword
    }),
    e: $data.searchList.length != 0
  }, $data.searchList.length != 0 ? common_vendor.e({
    f: $data.searchList.length != 0
  }, $data.searchList.length != 0 ? {
    g: common_vendor.f($data.searchList, (searchItem, searchIndex, i0) => {
      return {
        a: $data.baseURL + searchItem.cover,
        b: common_vendor.t(searchItem.title),
        c: common_vendor.t($options.delHtmlTag(searchItem.des).substring(0, 14)),
        d: searchIndex,
        e: common_vendor.o(($event) => $options.handleView(searchItem._id), searchIndex)
      };
    })
  } : {}) : common_vendor.e({
    h: common_vendor.o($options.clearHistory),
    i: common_vendor.p({
      type: "trash",
      size: "20",
      color: "#C0C0C0"
    }),
    j: $data.historyList.length != 0
  }, $data.historyList.length != 0 ? {
    k: common_vendor.f($data.historyList, (historyItem, historyIndex, i0) => {
      return {
        a: common_vendor.t(historyItem),
        b: historyIndex,
        c: common_vendor.o(($event) => $options.handhistoryItem(historyItem), historyIndex)
      };
    })
  } : {}, {
    l: common_vendor.p({
      type: "",
      size: "20",
      color: "#C0C0C0"
    }),
    m: common_vendor.f($data.foundList, (foundItem, foundIndex, i0) => {
      return {
        a: common_vendor.t(foundItem),
        b: foundIndex,
        c: common_vendor.o(($event) => $options.handFound(foundItem), foundIndex)
      };
    })
  }));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
