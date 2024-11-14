"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      baseURL: "",
      departmentsData: [],
      institution: ""
    };
  },
  onLoad(options) {
    this.institution = options.institution;
    this.baseURL = common_vendor.index.baseURL;
    common_vendor.index.$http.get("/api/get/departments", {
      id: options.id
    }).then((res) => {
      this.departmentsData = res.data.data;
    });
  },
  methods: {
    handInstitution(id) {
      common_vendor.index.navigateTo({
        url: "/pagesHome/institution/institution?id=" + id + "&institution=" + this.institution
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.departmentsData, (item, k0, i0) => {
      return {
        a: `${$data.baseURL}${item.cover}`,
        b: common_vendor.t(item.name),
        c: item._id,
        d: common_vendor.o(($event) => $options.handInstitution(item._id), item._id)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
