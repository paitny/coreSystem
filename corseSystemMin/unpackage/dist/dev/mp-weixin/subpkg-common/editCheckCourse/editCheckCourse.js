"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      results: [],
      actualAttend: 0,
      leaveCount: 0,
      absentCount: 0
    };
  },
  onLoad(options) {
    console.log(options);
    this.results = JSON.parse(decodeURIComponent(options.results));
    this.results.forEach((user) => {
      user.status = "not marked";
    });
  },
  methods: {
    markLeave(user) {
      if (user.status === "leave")
        return;
      this.updateCounts(user, "leave");
    },
    markAbsent(user) {
      if (user.status === "absent")
        return;
      this.updateCounts(user, "absent");
    },
    markPresent(user) {
      if (user.status === "present")
        return;
      this.updateCounts(user, "present");
    },
    updateCounts(user, newStatus) {
      switch (user.status) {
        case "leave":
          this.leaveCount--;
          break;
        case "absent":
          this.absentCount--;
          break;
        case "present":
          this.actualAttend--;
          break;
      }
      user.status = newStatus;
      switch (newStatus) {
        case "leave":
          this.leaveCount++;
          break;
        case "absent":
          this.absentCount++;
          break;
        case "present":
          this.actualAttend++;
          break;
      }
    },
    submitAttendance() {
      const feedbackData = {
        actualAttend: this.actualAttend,
        leaveCount: this.leaveCount,
        absentCount: this.absentCount,
        results: this.results
      };
      common_vendor.index.navigateBack({
        url: `/subpkg-common/attendanceCourse/attendanceCourse?feedbackData=${encodeURIComponent(JSON.stringify(feedbackData))}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.results, (user, k0, i0) => {
      return {
        a: common_vendor.t(user.name),
        b: common_vendor.o(($event) => $options.markLeave(user), user._id),
        c: common_vendor.o(($event) => $options.markAbsent(user), user._id),
        d: common_vendor.o(($event) => $options.markPresent(user), user._id),
        e: user._id
      };
    }),
    b: common_vendor.o((...args) => $options.submitAttendance && $options.submitAttendance(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
