"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    contributor: {
      type: Object,
      required: true
    },
    isPopupVisible: Boolean
  },
  methods: {
    hidePopup() {
      this.$emit("hidePopup");
    }
  },
  data() {
    return {};
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.contributor.avatar,
    b: common_vendor.t($props.contributor.name),
    c: common_vendor.t($props.contributor.gender),
    d: common_vendor.t($props.contributor.nickName),
    e: common_vendor.t($props.contributor.grade),
    f: common_vendor.t($props.contributor.className),
    g: common_vendor.t($props.contributor.counsellor),
    h: common_vendor.t($props.contributor.position),
    i: common_vendor.t($props.contributor.personality || _ctx.暂无),
    j: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args)),
    k: common_vendor.o(() => {
    }),
    l: $props.isPopupVisible,
    m: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1eb7b860"]]);
wx.createComponent(Component);
