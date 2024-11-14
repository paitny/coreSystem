"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      testData: []
    };
  },
  mounted() {
    this.getTest();
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  methods: {
    parseDateStringAndFormat(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
    },
    getTest() {
      common_vendor.index.$http.get("/api/examinationOrg/exams").then((res) => {
        this.testData = res.data;
      });
    },
    goTestPage(id, termTopic) {
      common_vendor.index.$http.post("/api/examinationOrg/checkSaveUserExam", {
        examId: id,
        userId: this.userInfo._id
      }).then((res) => {
        if (res.statusCode === 403) {
          return common_vendor.index.showToast({
            icon: "none",
            title: res.data.msg
          });
        } else if (res.statusCode === 400) {
          return common_vendor.index.showToast({
            icon: "none",
            title: res.data.msg
          });
        } else if (res.statusCode === 200) {
          common_vendor.index.navigateTo({
            url: "../../subpkg-common/testPaper/testPaper?id=" + id + "&termTopic=" + termTopic
          });
          common_vendor.index.showToast({
            icon: "none",
            title: res.data.msg
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.testData, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t($options.parseDateStringAndFormat(item.startTime)),
        c: common_vendor.t($options.parseDateStringAndFormat(item.endTime)),
        d: common_vendor.o(($event) => $options.goTestPage(item._id, item.termTopic), item._id),
        e: item._id
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-885954df"]]);
wx.createPage(MiniProgramPage);
