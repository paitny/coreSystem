"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      list: [],
      pathID: "",
      uid: ""
    };
  },
  onLoad(options) {
    this.pathID = options.id;
    this.recordText();
    this.getNew();
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  methods: {
    getNew() {
      common_vendor.index.$http.get("/api/get/newsId", {
        id: this.pathID
      }).then((res) => {
        this.list = res.data.data.doc;
      });
    },
    inspectLogin(url, collectId) {
      common_vendor.index.$http.post("/api/login/min/check", {
        id: this.userInfo._id
      }).then((res) => {
        if (res.data.code === 0) {
          common_vendor.index.showToast({
            title: "未登录",
            icon: "error",
            duration: 800
          });
        } else if (res.data.code === 2) {
          common_vendor.index.showToast({
            title: "token已过期",
            icon: "error",
            duration: 800
          });
        } else if (res.data.code === 1) {
          common_vendor.index.$http.post(url, {
            id: collectId,
            userId: this.userInfo._id
          }).then((res2) => {
            this.getNew();
            common_vendor.index.showToast({
              title: res2.data.msg,
              icon: "none",
              duration: 1500
            });
          });
        }
      });
    },
    handTrendCollect(id) {
      this.inspectLogin("/api/news/collect", id);
    },
    recordText() {
      common_vendor.index.$http.post("/api/get/foot", {
        newsId: this.pathID,
        userId: this.userInfo._id
      });
    },
    // 时间格式
    date(time) {
      return common_vendor.hooks(time).format("YYYY-MM-DD");
    }
  },
  onShareAppMessage() {
    return {
      title: this.list.title,
      path: "/pagesHome/news/news?id=" + this.pathID
    };
  },
  onShareTimeline() {
    return {
      title: this.list.title,
      path: "/pagesHome/news/news?id=" + this.pathID
    };
  }
};
if (!Array) {
  const _easycom_uni_fav2 = common_vendor.resolveComponent("uni-fav");
  _easycom_uni_fav2();
}
const _easycom_uni_fav = () => "../../uni_modules/uni-fav/components/uni-fav/uni-fav.js";
if (!Math) {
  _easycom_uni_fav();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.list.title),
    b: common_vendor.t($options.date($data.list.date)),
    c: common_vendor.t($data.list.pv),
    d: common_vendor.o(($event) => $options.handTrendCollect($data.list._id)),
    e: common_vendor.p({
      checked: _ctx.userInfo._id && $data.list.collects.includes(_ctx.userInfo._id),
      circle: true,
      ["bg-color"]: "#dd524d",
      ["bg-color-checked"]: "#007aff",
      ["fg-color"]: "#ffffff",
      ["fg-color-checked"]: "#ffffff"
    }),
    f: $data.list.des
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
