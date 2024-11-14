"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchQuery: ""
    };
  },
  computed: {
    filteredDataList() {
      if (!this.searchQuery) {
        return this.dataList;
      }
      return this.dataList.filter(
        (item) => item.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    selectItem(item) {
      this.$emit("item-selected", item);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.show
  }, $props.show ? {
    b: common_vendor.o((...args) => _ctx.closeDialog && _ctx.closeDialog(...args)),
    c: $data.searchQuery,
    d: common_vendor.o(($event) => $data.searchQuery = $event.detail.value),
    e: common_vendor.f($options.filteredDataList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: common_vendor.o(($event) => $options.selectItem(item), index)
      };
    }),
    f: common_vendor.o((...args) => $options.close && $options.close(...args)),
    g: common_vendor.o(() => {
    }),
    h: common_vendor.o((...args) => $options.close && $options.close(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-32f55f16"]]);
wx.createComponent(Component);
