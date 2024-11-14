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
    copyText(text) {
      common_vendor.index.setClipboardData({
        data: text,
        success() {
          common_vendor.index.showToast({
            title: "群号已复制",
            icon: "success"
          });
        }
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
    hidePopup() {
      this.$emit("hidePopup");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args)),
    b: common_vendor.o(() => {
    }),
    c: $props.isPopupVisible,
    d: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e3e48a82"]]);
wx.createComponent(Component);
