"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      baseURL: "",
      pathID: "",
      departmentInfo: [],
      institution: ""
    };
  },
  onLoad(options) {
    this.baseURL = common_vendor.index.baseURL;
    this.institution = options.institution;
    this.pathID = options.id;
    this.getdepartmentInfo();
  },
  methods: {
    gopage() {
      common_vendor.index.navigateTo({
        url: "/pagesHome/activity/institution?institution=" + this.institution + "&department=" + this.departmentInfo.name
      });
    },
    getdepartmentInfo() {
      common_vendor.index.$http.get("/api/get/departmentInfo", {
        id: this.pathID
      }).then((res) => {
        this.departmentInfo = res.data.data;
      });
    },
    clickImg(photoImg) {
      let imgsArray = [];
      imgsArray[0] = this.baseURL + photoImg;
      common_vendor.index.previewImage({
        current: 0,
        urls: imgsArray
      });
    },
    MeClick() {
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    }
  },
  onShareAppMessage() {
    return {
      title: this.departmentInfo.name,
      path: "/pagesHome/institution/institution?id=" + this.pathID + "&institution=" + this.institution
    };
  },
  onShareTimeline() {
    return {
      title: this.departmentInfo.name,
      path: "/pagesHome/institution/institution?id=" + this.pathID + "&institution=" + this.institution
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.departmentInfo.name),
    b: `${$data.baseURL}${$data.departmentInfo.cover}`,
    c: common_vendor.o(($event) => $options.clickImg($data.departmentInfo.poster)),
    d: `url(${$data.baseURL}${$data.departmentInfo.poster})`,
    e: common_vendor.t($data.departmentInfo.leader),
    f: common_vendor.t($data.departmentInfo.phone),
    g: common_vendor.t($data.departmentInfo.email),
    h: common_vendor.t($data.departmentInfo.qq),
    i: common_vendor.t($data.departmentInfo.weibo),
    j: common_vendor.t($data.departmentInfo.description),
    k: common_assets._imports_0$3,
    l: common_vendor.o((...args) => _ctx.shareClick && _ctx.shareClick(...args)),
    m: common_assets._imports_1$4,
    n: common_vendor.o((...args) => $options.MeClick && $options.MeClick(...args)),
    o: common_vendor.o((...args) => $options.gopage && $options.gopage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
