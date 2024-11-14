"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    user: Object
  },
  mounted() {
    console.log(this.user);
  },
  methods: {
    toggleStatus(newStatus) {
      if (this.user.status === newStatus) {
        newStatus = "present";
      }
      this.$emit("update-status", this.user, newStatus);
      this.updateRemarks(newStatus);
    },
    updateRemarks(newStatus) {
      if (!this.user || !this.user.remarks) {
        console.warn("User or remarks is undefined.");
        return;
      }
      let actionText = "";
      switch (newStatus) {
        case "leave":
          actionText = " 请假";
          break;
        case "absent":
          actionText = " 缺席";
          break;
      }
      if (actionText) {
        if (!this.user.remarks.includes(actionText)) {
          this.$set(this.user, "remarks", (this.user.remarks + actionText).trim());
        }
      } else {
        this.user.remarks = this.user.remarks.replace(" 请假", "").replace(" 缺席", "").replace(/\s*,\s*$/, "");
      }
      console.log("Current remarks:", this.user.remarks);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.user.name),
    b: common_vendor.t($props.user.sex),
    c: common_vendor.t($props.user.num),
    d: common_vendor.t($props.user.status === "leave" ? "取消请假" : "请假"),
    e: $props.user.status === "leave" ? 1 : "",
    f: common_vendor.o(($event) => $options.toggleStatus("leave")),
    g: common_vendor.t($props.user.status === "absent" ? "取消缺席" : "缺席"),
    h: $props.user.status === "absent" ? 1 : "",
    i: common_vendor.o(($event) => $options.toggleStatus("absent"))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1d185255"]]);
wx.createComponent(Component);
