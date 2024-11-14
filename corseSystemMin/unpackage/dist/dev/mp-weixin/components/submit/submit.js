"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const emoji = () => "../emjo/emjo.js";
const _sfc_main = {
  name: "submit",
  data() {
    return {
      chatText: "",
      isrecord: false,
      toc: "../../static/img/yy.png",
      isemoj: true,
      isShow: true
    };
  },
  components: {
    emoji
  },
  methods: {
    getElementStyIe: function() {
      const query = common_vendor.index.createSelectorQuery().in(this);
      query.select(".submit").boundingClientRect((data) => {
        this.$emit("hight", data.height);
      }).exec();
    },
    emoji(e) {
      console.log(e);
      this.chatText = this.chatText + e;
      this.handleFocus();
      this.change();
    },
    //点击切换音频
    records() {
      if (this.isrecord) {
        this.isrecord = false;
        this.toc = "../../static/img/yy.png";
      } else {
        this.isrecord = true;
        this.toc = "../../static/img/jp.png";
      }
    },
    clickemoj() {
      this.isemoj = !this.isemoj;
      setTimeout(() => {
        this.getElementStyIe();
      }, 10);
    },
    submitChat() {
      this.$emit("submit", this.chatText);
      setTimeout(() => {
        this.chatText = "";
        this.isShow = true;
      }, 0);
    },
    handleFocus(event) {
      console.log("聚焦事件");
    },
    handleBlur(event) {
      console.log("失焦事件");
    },
    change() {
      if (this.chatText.length > 0) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    }
  }
};
if (!Array) {
  const _component_emoji = common_vendor.resolveComponent("emoji");
  _component_emoji();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.toc,
    b: common_vendor.o((...args) => $options.records && $options.records(...args)),
    c: $data.isrecord ? 1 : "",
    d: common_vendor.o([($event) => $data.chatText = $event.detail.value, (...args) => $options.change && $options.change(...args)]),
    e: common_vendor.o((...args) => $options.handleFocus && $options.handleFocus(...args)),
    f: common_vendor.o((...args) => $options.handleBlur && $options.handleBlur(...args)),
    g: $data.chatText,
    h: !$data.isrecord ? 1 : "",
    i: common_assets._imports_0$10,
    j: common_vendor.o((...args) => $options.clickemoj && $options.clickemoj(...args)),
    k: $data.isShow
  }, $data.isShow ? {
    l: common_assets._imports_1$8
  } : {
    m: common_vendor.o((...args) => $options.submitChat && $options.submitChat(...args))
  }, {
    n: common_vendor.o($options.emoji),
    o: $data.isemoj ? 1 : ""
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
