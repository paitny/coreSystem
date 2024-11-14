"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      list: []
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  onLoad() {
    this.baseURL = common_vendor.index.baseURL;
    common_vendor.index.$http.get("/api/get/query", {
      due: this.userInfo.due,
      institution: this.userInfo.institution,
      position: this.userInfo.position
    }).then((res) => {
      this.list = this.customSort(res.data);
    });
    setTimeout(() => {
      this.loading = false;
    }, 1e3);
  },
  methods: {
    customSort(data) {
      const roleOrder = {
        "副书记": 1,
        "学生办公室主任": 2,
        "主席": 3,
        "副主席": 4,
        "部长": 5,
        "副部长": 6,
        "队长": 7,
        "副队长": 8,
        "干事": 9
      };
      const regex = /(\S+)/;
      return data.sort((a, b) => {
        const matchA = a.position.match(regex);
        const matchB = b.position.match(regex);
        const roleA = matchA ? matchA[0] : null;
        const roleB = matchB ? matchB[0] : null;
        const orderA = roleA && roleOrder[roleA] !== void 0 ? roleOrder[roleA] : Infinity;
        const orderB = roleB && roleOrder[roleB] !== void 0 ? roleOrder[roleB] : Infinity;
        if (orderA !== Infinity && orderB !== Infinity) {
          return orderA - orderB;
        } else {
          return a.position.localeCompare(b.position);
        }
      });
    },
    goMakePhone(phone, position, name) {
      common_vendor.index.showModal({
        content: "您确定要给" + position + name + "打电话嘛！",
        success: (e) => {
          if (e.confirm) {
            this.makePhone(phone);
          }
        }
      });
    },
    makePhone(phone) {
      const phoneRegex = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      const phoneNumber = String(phone);
      if (phoneRegex.test(phoneNumber)) {
        common_vendor.index.makePhoneCall({
          phoneNumber
        });
      } else {
        return common_vendor.index.showToast({
          icon: "none",
          title: "该手机号不正确，无法拨打",
          duration: 1500
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.list, (item, index, i0) => {
      return {
        a: `${_ctx.baseURL}${item.photo}`,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.sex),
        d: common_vendor.t(item.institution),
        e: common_vendor.t(item.position),
        f: common_vendor.t(item.grade),
        g: common_vendor.t(item.class),
        h: common_vendor.t(item.phone),
        i: common_vendor.o(($event) => $options.goMakePhone(item.phone, item.position, item.name), index),
        j: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
