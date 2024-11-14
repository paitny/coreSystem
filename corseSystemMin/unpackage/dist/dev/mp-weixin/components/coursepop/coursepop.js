"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    isPopupVisible: Boolean,
    missingHours: Number
    // 新增的属性，表示缺课学时
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  data() {
    return {
      baseURL: ""
    };
  },
  mounted() {
    console.log(common_vendor.index.baseURL);
    this.baseURL = common_vendor.index.baseURL;
  },
  methods: {
    hidePopup() {
      this.$emit("hidePopup");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.isPopupVisible
  }, $props.isPopupVisible ? common_vendor.e({
    b: common_vendor.t(_ctx.userInfo.name),
    c: $props.missingHours >= 11 && $props.missingHours <= 20
  }, $props.missingHours >= 11 && $props.missingHours <= 20 ? {
    d: common_vendor.t($props.missingHours)
  } : {}, {
    e: $props.missingHours >= 21 && $props.missingHours <= 30
  }, $props.missingHours >= 21 && $props.missingHours <= 30 ? {
    f: common_vendor.t($props.missingHours)
  } : {}, {
    g: $props.missingHours >= 31 && $props.missingHours <= 40
  }, $props.missingHours >= 31 && $props.missingHours <= 40 ? {
    h: common_vendor.t($props.missingHours)
  } : {}, {
    i: $props.missingHours >= 41 && $props.missingHours <= 50
  }, $props.missingHours >= 41 && $props.missingHours <= 50 ? {
    j: common_vendor.t($props.missingHours)
  } : {}, {
    k: $props.missingHours > 51
  }, $props.missingHours > 51 ? {
    l: common_vendor.t($props.missingHours)
  } : {}, {
    m: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args)),
    n: common_vendor.o(() => {
    }),
    o: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args))
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0e4ea6e1"]]);
wx.createComponent(Component);
