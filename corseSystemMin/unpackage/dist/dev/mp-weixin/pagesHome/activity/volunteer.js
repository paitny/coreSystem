"use strict";
const common_vendor = require("../../common/vendor.js");
const Utils_semesterUtils = require("../../Utils/semesterUtils.js");
const common_assets = require("../../common/assets.js");
const loading = () => "../../components/loading/loading.js";
const _sfc_main = {
  data() {
    return {
      activeData: [],
      baseURL: "",
      termName: Utils_semesterUtils.getCurrentSemester(),
      isloading: true,
      loading: false,
      page: 1,
      total: 0
    };
  },
  components: {
    loading
  },
  methods: {
    getActiveData() {
      common_vendor.index.$http.get("/api/get/newActive", {
        page: this.page,
        semester: this.termName
      }).then((res) => {
        if (res.errMsg == "request:ok") {
          this.total = res.data.data.total;
          const existingIds = new Set(this.activeData.map((item) => item._id));
          const newItems = res.data.data.list.filter((item) => !existingIds.has(item._id));
          this.activeData = [...this.activeData, ...newItems];
          setTimeout(() => {
            this.loading = false;
            this.isloading = false;
          }, 1e3);
        }
      }).catch((error) => {
        if (error) {
          this.isloading = true;
        }
      });
    },
    //检测是否登录
    checkLogin(id, title, deadline, startTime, address, description, limitPerson, groupCode, groupNum) {
      common_vendor.index.$http.post("/api/login/min/check", {
        id: common_vendor.index.getStorageSync("userInfo")._id
      }).then((res) => {
        if (res.data.code === 0) {
          return common_vendor.index.showModal({
            content: "登录注册才有权限噢！",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.navigateTo({
                  url: "/pagesMe/login/login?type=2"
                });
              }
            }
          });
        } else if (res.data.code === 2) {
          return common_vendor.index.showModal({
            content: "登录注册才有权限噢！",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.navigateTo({
                  url: "/pagesMe/login/login?type=2"
                });
              }
            }
          });
        } else if (res.data.code === 1) {
          common_vendor.index.navigateTo({
            url: "/pagesHome/application/active?id=" + id + "&title=" + title + "&deadline=" + deadline + "&startTime=" + startTime + "&address=" + address + "&description=" + description + "&limitPerson=" + limitPerson + "&groupCode=" + groupCode + "&groupNum=" + groupNum
          });
        }
      });
    },
    application(id, title, deadline, startTime, address, description, limitPerson, groupCode, groupNum) {
      this.checkLogin(id, title, deadline, startTime, address, description, limitPerson, groupCode, groupNum);
    },
    loadMore() {
    }
  },
  onLoad() {
    this.getActiveData();
    this.baseURL = common_vendor.index.baseURL;
  },
  onShareAppMessage() {
    return {
      title: "活动",
      path: "/pagesHome/activity/volunteer"
    };
  },
  onShareTimeline() {
    return {
      title: "活动",
      path: "/pagesHome/activity/volunteer"
    };
  },
  onReachBottom() {
    if (this.activeData.length < this.total) {
      this.loading = true;
      this.page++;
      this.getActiveData();
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
  const _easycom_loading2 = common_vendor.resolveComponent("loading");
  _easycom_loading2();
}
const _easycom_loading = () => "../../components/loading/loading.js";
if (!Math) {
  _easycom_loading();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.termName),
    b: $data.isloading
  }, $data.isloading ? {} : common_vendor.e({
    c: $data.activeData.length === 0
  }, $data.activeData.length === 0 ? {
    d: common_assets._imports_0$4
  } : {}, {
    e: common_vendor.f($data.activeData, (item, k0, i0) => {
      return {
        a: `${$data.baseURL}${item.cover}`,
        b: common_vendor.t(item.title),
        c: common_vendor.o(($event) => $options.application(item._id, item.title, item.deadline, item.startTime, item.address, item.description, item.limitPerson, item.groupCode, item.groupNum), item._id),
        d: item._id
      };
    }),
    f: $data.loading
  }, $data.loading ? {} : {}, {
    g: $data.activeData.length === $data.total && $data.activeData.length > 0
  }, $data.activeData.length === $data.total && $data.activeData.length > 0 ? {
    h: common_vendor.t($data.total)
  } : {}));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
