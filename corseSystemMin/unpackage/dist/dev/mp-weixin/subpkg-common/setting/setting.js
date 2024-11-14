"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      version: ""
    };
  },
  onLoad() {
    const accountInfo = common_vendor.index.getAccountInfoSync();
    this.version = accountInfo.miniProgram.version;
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  methods: {
    ...common_vendor.mapMutations(["loginOut"]),
    navTo(url) {
      common_vendor.index.navigateTo({
        url
      });
    },
    //退出登录
    removeStore() {
      common_vendor.index.removeStorage({
        key: "userInfo",
        // 要清除的数据的键名
        success: () => {
          console.log("数据清除成功");
        },
        fail: (err) => {
          console.log("数据清除失败", err);
        }
      });
      common_vendor.index.removeStorage({
        key: "token",
        // 要清除的数据的键名
        success: () => {
          console.log("数据清除成功");
        },
        fail: (err) => {
          console.log("数据清除失败", err);
        }
      });
    },
    clearStorage() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要清除所有本地存储吗？",
        success: (res) => {
          if (res.confirm) {
            try {
              common_vendor.index.clearStorageSync();
              this.loginOut();
              common_vendor.index.switchTab({
                url: "/pages/me/me"
              });
              common_vendor.index.showToast({
                title: "存储和状态已清除",
                icon: "success",
                duration: 2e3
              });
            } catch (e) {
              common_vendor.index.showToast({
                title: "清除失败",
                icon: "none",
                duration: 2e3
              });
              console.error("清除存储时出错:", e);
            }
          } else if (res.cancel) {
            console.log("用户取消清除操作");
          }
        }
      });
    },
    toLogout() {
      common_vendor.index.showModal({
        content: "确定要退出登录么",
        success: (e) => {
          if (e.confirm) {
            this.loginOut();
            this.removeStore();
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 200);
          }
        }
      });
    },
    //switch
    switchChange(e) {
      let statusTip = e.detail.value ? "打开" : "关闭";
      this.$api.msg(`${statusTip}消息推送`);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.navTo("../modify/modify")),
    b: common_vendor.o(($event) => $options.navTo("../change-password/change-password")),
    c: common_vendor.o(($event) => $options.navTo("../feedback/feedback")),
    d: common_vendor.o(($event) => $options.navTo("../../subpkg-common/grades/grades")),
    e: common_vendor.o((...args) => $options.switchChange && $options.switchChange(...args)),
    f: common_vendor.o((...args) => $options.clearStorage && $options.clearStorage(...args)),
    g: common_vendor.o(($event) => $options.navTo("关于Dcloud")),
    h: common_vendor.t($data.version),
    i: common_vendor.o((...args) => $options.toLogout && $options.toLogout(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
