"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      info: [],
      infoRef: [
        {
          key: "rawWeeks",
          title: "周数"
        },
        {
          key: "rawSection",
          title: "节数"
        },
        {
          key: "address",
          title: "地址"
        },
        {
          key: "teacher",
          title: "老师"
        },
        {
          key: "credit",
          title: "学分"
        },
        {
          key: "category",
          title: "类型"
        },
        {
          key: "method",
          title: "考查"
        }
      ]
    };
  },
  onLoad(options) {
    let info = options.info || "";
    if (info == "") {
      common_vendor.wx$1.showToast({
        title: "页面不存在",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack({
          delta: 1
        });
      }, 1500);
      return;
    }
    info = JSON.parse(info);
    info.rawSection = info.rawSection;
    this.info = info;
  },
  methods: {
    getCurrentSemester() {
      const currentDate = /* @__PURE__ */ new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      let semester;
      if (currentMonth >= 9 && currentMonth <= 12) {
        semester = "第一学期";
      } else if (currentMonth >= 3 && currentMonth <= 6) {
        semester = "第二学期";
      } else {
        semester = "寒假/暑假";
      }
      const academicYear = `${currentYear}-${currentYear + 1}学年度`;
      return `${academicYear}${semester}`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.info.name),
    b: common_vendor.f($data.infoRef, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t($data.info[item.key]),
        c: item
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
