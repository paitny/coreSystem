"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "emjo",
  props: {
    height: {
      type: Number,
      default: 260
    }
  },
  data() {
    return {
      emoji: [
        ["😀", "😁", "😂", "🤣", "😃", "😄", "😅"],
        ["😆", "😉", "😊", "😋", "😎", "😍", "😘"],
        ["😗", "😙", "😚", "☺", "🙂", "🤗", "🤔"],
        ["😐", "😑", "😶", "🙄", "😏", "😣", "😥"],
        ["😮", "🤐", "😯", "😪", "😫", "😴", "😌"],
        ["😛", "😜", "😝", "🤤", "😒", "😓", "😔"],
        ["😕", "🙃", "🤑", "😲", "☹", "🙁", "😖"],
        ["😞", "😟", "😤", "😢", "😭", "😦", "😧"],
        ["😨", "😩", "😬", "😰", "😱", "😳", "😵"],
        ["😡", "😠", "😷", "🤒", "🤕", "🤢", "🤧"],
        ["😇", "🤠", "🤡", "🤥", "🤓", "😈", "👿"],
        ["👹", "👺", "💀", "👻", "👽", "🤖", "💩"],
        ["😺", "😸", "😹", "😻", "😼", "😽", "🙀"],
        ["😿", "😾", "🏻", "🏼", "🏽", "🏾", "🏿"],
        ["🗣", "👤", "👥", "👫", "👬", "👭", "👂"],
        ["👂🏻", "👂🏼", "👂🏽", "👂🏾", "👂🏿", "👃", "👃🏻"],
        ["👃🏼", "👃🏽", "👃🏾", "👃🏿", "👣", "👀", "👁"],
        ["👅", "👄", "💋", "👓", "🕶", "👔", "👕"],
        ["👖", "👗", "👘", "👙", "👚", "👛", "👜"],
        ["👝", "🎒", "👞", "👟", "👠", "👡", "👢"],
        ["👑", "👒", "🎩", "🎓", "⛑", "💄", "💍"],
        ["🌂", "💼"]
      ]
    };
  },
  methods: {
    clickEmoji(item) {
      this.$emit("emoji", item);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.emoji, (line, i, i0) => {
      return {
        a: common_vendor.f(line, (item, index, i1) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.o(($event) => $options.clickEmoji(item), index)
          };
        }),
        b: i
      };
    }),
    b: $props.height + "px"
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
