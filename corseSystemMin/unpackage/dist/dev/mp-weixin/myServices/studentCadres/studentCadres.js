"use strict";
const common_vendor = require("../../common/vendor.js");
const BackToTop = () => "../../components/backToTop/backToTop.js";
const _sfc_main = {
  data() {
    return {
      // 初始化定时器为空
      timer: null,
      // 用户输入的关键词
      keyword: "",
      //搜索数据的数组初始化
      searchList: [],
      //搜索历史初始化
      historyList: [],
      // 初始化搜索发现列表
      foundList: [],
      baseURL: "",
      loading: false,
      page: 1,
      total: 0
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  components: {
    BackToTop
  },
  onPageScroll(e) {
    this.$refs.VT.topData(e.scrollTop);
  },
  onLoad() {
    this.getFoundList();
    this.historyList = JSON.parse(common_vendor.index.getStorageSync("kwUser"));
    this.baseURL = common_vendor.index.baseURL;
  },
  methods: {
    goMakePhone(phone, position, name) {
      common_vendor.index.showModal({
        content: "您确定要给" + position + name + "打电话嘛！",
        success: (e) => {
          if (e.confirm) {
            this.makePhone(phone);
          }
        }
      });
    },
    makePhone(phone) {
      const phoneRegex = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      const phoneNumber = String(phone);
      if (phoneRegex.test(phoneNumber)) {
        common_vendor.index.makePhoneCall({
          phoneNumber
        });
      } else {
        return common_vendor.index.showToast({
          icon: "none",
          title: "该手机号不正确，无法拨打",
          duration: 1500
        });
      }
    },
    handhistoryItem(historyItem) {
      this.keyword = historyItem;
    },
    handFound(handItem) {
      this.keyword = handItem;
    },
    //用户输入时可以获取用户输入的内容
    input(e) {
      this.page = 1;
      this.searchList = [];
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.keyword = e;
        this.getSearchContent();
      }, 500);
    },
    //获取搜索列表的方法
    async getSearchContent() {
      if (this.keyword === "") {
        this.searchList = [];
        return;
      }
      await common_vendor.index.$http.get("/api/get/searchUser", {
        query: this.keyword,
        userId: this.userInfo._id,
        page: this.page
      }).then((res) => {
        common_vendor.index.showToast({
          icon: "none",
          title: res.data.msg,
          duration: 1500
        });
        this.total = res.data.data.total;
        const existingIds = new Set(this.searchList.map((item) => item._id));
        const newItems = res.data.data.list.filter((item) => !existingIds.has(item._id));
        this.searchList = [...this.searchList, ...newItems];
        setTimeout(() => {
          this.loading = false;
        }, 1e3);
        this.saveHistory();
      });
    },
    // 保存历史记录
    saveHistory() {
      if (this.historyList.indexOf(this.keyword) === -1) {
        this.historyList.unshift(this.keyword);
        common_vendor.index.setStorage({
          key: "kwUser",
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
      await common_vendor.index.$http.get("/api/route/searchUserList").then((res) => {
        this.foundList = res.data.foundList;
      });
    }
  },
  onReachBottom() {
    if (this.searchList.length < this.total) {
      this.loading = true;
      this.page++;
      this.getSearchContent();
    } else {
      common_vendor.index.showToast({
        title: "我是有底线的噢",
        icon: "none",
        duration: 1800
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_BackToTop = common_vendor.resolveComponent("BackToTop");
  (_easycom_uni_search_bar2 + _easycom_uni_icons2 + _component_BackToTop)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_uni_icons)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.sr("searchBar", "71658405-0"),
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
  }, $data.searchList.length != 0 ? common_vendor.e({
    g: common_vendor.f($data.searchList, (item, index, i0) => {
      return {
        a: `${$data.baseURL}${item.photo}`,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.sex),
        d: common_vendor.t(item.institution === "暂无" ? "" : item.institution + "&"),
        e: common_vendor.t(item.position),
        f: common_vendor.t(item.grade),
        g: common_vendor.t(item.class),
        h: common_vendor.t(item.levels),
        i: common_vendor.t(item.num),
        j: common_vendor.t(item.counsellor),
        k: common_vendor.t(item.phone),
        l: common_vendor.o(($event) => $options.goMakePhone(item.phone, item.position, item.name), index),
        m: index
      };
    }),
    h: $data.loading
  }, $data.loading ? {} : {}, {
    i: $data.searchList.length === $data.total
  }, $data.searchList.length === $data.total ? {
    j: common_vendor.t($data.total)
  } : {}) : {}) : common_vendor.e({
    k: common_vendor.o($options.clearHistory),
    l: common_vendor.p({
      type: "trash",
      size: "20",
      color: "#C0C0C0"
    }),
    m: $data.historyList.length != 0
  }, $data.historyList.length != 0 ? {
    n: common_vendor.f($data.historyList, (historyItem, historyIndex, i0) => {
      return {
        a: common_vendor.t(historyItem),
        b: historyIndex,
        c: common_vendor.o(($event) => $options.handhistoryItem(historyItem), historyIndex)
      };
    })
  } : {}, {
    o: common_vendor.p({
      type: "",
      size: "20",
      color: "#C0C0C0"
    }),
    p: common_vendor.f($data.foundList, (foundItem, foundIndex, i0) => {
      return {
        a: common_vendor.t(foundItem),
        b: foundIndex,
        c: common_vendor.o(($event) => $options.handFound(foundItem), foundIndex)
      };
    })
  }), {
    q: common_vendor.sr("VT", "71658405-3"),
    r: common_vendor.p({
      scrollTop: _ctx.top
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
