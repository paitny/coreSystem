"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      options: [{
        text: "删除",
        style: {
          backgroundColor: "#dd524d"
        }
      }],
      list: [],
      baseURL: "",
      aid: "",
      switchValue: false,
      buttonDisabled: false,
      isDisabled: false,
      buttonText: "签到",
      buttonColor: "#007aff",
      checkInTime: null,
      message: "",
      isShow: false,
      activityId: "",
      keyword: "",
      lable: "",
      isloading: true
    };
  },
  onLoad(options) {
    this.baseURL = common_vendor.index.baseURL;
    this.getuserInfo(JSON.parse(options.results), options.label);
  },
  computed: {
    // 根据搜索关键词过滤数据列表
    list() {
      return this.list.filter(
        (item) => item.name.toLowerCase().includes(this.keyword.toLowerCase())
      );
    }
  },
  methods: {
    getuserInfo(userData, label) {
      if (label === "请假") {
        this.list = userData.filter((item) => item.status === "leave");
      } else if (label === "缺席") {
        this.list = userData.filter((item) => item.status === "absent");
      } else if (label === "实到") {
        this.list = userData.filter((item) => item.status !== "absent" && item.status !== "leave");
      } else {
        this.list = userData;
      }
      setTimeout(() => {
        this.isloading = false;
      }, 500);
    },
    onClick(e, id, name) {
      let {
        content
      } = e;
      if (content.text === "删除") {
        this.deleteUserInfo(id, name);
      }
    },
    goMakePhone(phone, grade, classes, name) {
      common_vendor.index.showModal({
        content: "您确定要给" + grade + classes + name + "打电话嘛！",
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
    },
    handleCheckIn(id, item) {
      common_vendor.index.$http.post("/api/itVolunteer/check-in", {
        volunteerId: id
      }).then((res) => {
        const updatedItemIndex = this.list.findIndex((i) => i._id === id);
        if (updatedItemIndex !== -1) {
          this.$set(this.list[updatedItemIndex], "checkInTime", res.data.checkInTime);
          this.$set(this.list[updatedItemIndex], "buttonText", "已签到");
          this.$set(this.list[updatedItemIndex], "disabled", true);
        }
        common_vendor.index.showToast({
          duration: 1500,
          title: res.data.message,
          icon: "none"
        });
      });
    },
    deleteUserInfo(id, name) {
      common_vendor.index.showModal({
        content: "您确定要删除" + name + "的报名信息?",
        success: (e) => {
          if (e.confirm) {
            common_vendor.index.$http.delete("/api/itVolunteer/deleteVtInfo", {
              id
            }).then((res) => {
              common_vendor.index.showToast({
                icon: "none",
                title: res.data.msg
              });
              this.getuserInfo();
            });
          }
        }
      });
    },
    getButtonColor(checkInTime) {
      if (checkInTime === null && this.isDisabled === false) {
        return "#007aff";
      } else {
        return "gray";
      }
    },
    getButtonText(checkInTime) {
      if (checkInTime === null && this.isDisabled === false) {
        return "签到";
      } else {
        return "已签到";
      }
    },
    showTost() {
      common_vendor.index.showToast({
        duration: 1500,
        title: "该活动无需签到",
        icon: "none"
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_loading2 = common_vendor.resolveComponent("loading");
  (_easycom_uni_search_bar2 + _easycom_loading2)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_loading = () => "../../components/loading/loading.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_loading)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.sr("searchBar", "f1603646-0"),
    b: common_vendor.o(($event) => $data.keyword = $event),
    c: common_vendor.p({
      focus: false,
      radius: 20,
      bgColor: "#F7F7F7",
      cancelButton: "none",
      modelValue: $data.keyword
    }),
    d: $data.isloading
  }, $data.isloading ? {} : common_vendor.e({
    e: $options.list.length === 0
  }, $options.list.length === 0 ? {} : {}, {
    f: common_vendor.f($options.list, (item, k0, i0) => {
      return {
        a: `${$data.baseURL}${item.photo}`,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.num),
        d: common_vendor.t(item.institution),
        e: common_vendor.t(item.position),
        f: common_vendor.t(item.counsellor),
        g: common_vendor.t(item.phone),
        h: common_vendor.o(($event) => $options.goMakePhone(item.phone, item.institution, item.position, item.name), item._id),
        i: common_vendor.t(item.status === "leave" ? "请假" : item.status === "absent" ? "缺席" : "已到"),
        j: item._id
      };
    })
  }));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f1603646"]]);
wx.createPage(MiniProgramPage);
