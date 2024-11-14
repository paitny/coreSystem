"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const loading = () => "../../components/loading/loading.js";
const activityData = () => "../../components/activityData/activityData.js";
const _sfc_main = {
  data() {
    return {
      options: [{
        text: "删除",
        style: {
          backgroundColor: "#dd524d"
        }
      }],
      showUpload: true,
      list: [],
      baseURL: "",
      aid: "",
      switchValue: false,
      buttonDisabled: false,
      isDisabled: false,
      message: "",
      isShow: false,
      activityId: "",
      keyword: "",
      isloading: true,
      activityName: "",
      audit: Boolean,
      isCheckOut: Boolean,
      checkInTime: {}
      // 用于存储每个用户的签到时间
    };
  },
  components: {
    loading,
    activityData
  },
  onLoad(options) {
    this.baseURL = common_vendor.index.baseURL;
    this.activityId = options.id;
    this.activityName = options.title;
    this.isShow = JSON.parse(options.isSign);
    this.audit = JSON.parse(options.audit);
    this.isCheckOut = JSON.parse(options.isCheckOut);
    this.getuserInfo();
  },
  computed: {
    filteredList() {
      return this.list.filter(
        (item) => item.name.toLowerCase().includes(this.keyword.toLowerCase()) || item.ID.toLowerCase().includes(this.keyword.toLowerCase()) || item.grade.toLowerCase().includes(this.keyword.toLowerCase()) || item.classes.toLowerCase().includes(this.keyword.toLowerCase()) || item.levels.toLowerCase().includes(this.keyword.toLowerCase()) || item.counsellor.toLowerCase().includes(this.keyword.toLowerCase()) || item.phoneNumber.toLowerCase().includes(this.keyword.toLowerCase())
      );
    }
  },
  methods: {
    handleUploadSuccess(data) {
      this.list = data.data;
      this.showUpload = false;
    },
    handlebranchSuccess(data) {
      this.getuserInfo();
      this.showUpload = true;
    },
    userInput() {
      this.sortByCheckInTime();
    },
    getuserInfo() {
      common_vendor.index.$http.get("/api/itVolunteer/volunteers", {
        activityId: this.activityId
      }).then((res) => {
        this.isloading = true;
        if (res.errMsg === "request:ok") {
          if (res.data.message === "该活动暂无人参与") {
            this.message = res.data.message;
            this.isloading = false;
          } else {
            this.list = res.data.map((item) => ({
              ...item,
              disabled: item.checkInTime !== null && item.checkOutTime !== null
              // 禁用逻辑
            }));
            this.sortByCheckInTime();
            this.isloading = false;
          }
        }
      }).catch((error) => {
        if (error) {
          this.isloading = true;
        }
      });
    },
    onClick(e, id, name) {
      let {
        content
      } = e;
      if (content.text === "删除") {
        this.deleteUserInfo(id, name);
      }
    },
    // 添加一个新的方法,实现按照签到状态进行排序
    sortByCheckInTime() {
      return this.list.sort((a, b) => {
        if (a.checkInTime === null && b.checkInTime !== null) {
          return -1;
        } else if (a.checkInTime !== null && b.checkInTime === null) {
          return 1;
        } else if (a.checkOutTime === null && b.checkOutTime !== null) {
          return -1;
        } else if (a.checkOutTime !== null && b.checkOutTime === null) {
          return 1;
        } else {
          return 0;
        }
      });
    },
    handleSignToggle(item) {
      const now = /* @__PURE__ */ new Date();
      if (item.checkInTime === null) {
        this.handleCheckIn(item._id, item);
      } else if (this.isCheckOut && item.checkOutTime === null) {
        const checkInTime = new Date(item.checkInTime);
        const timeDiff = (now - checkInTime) / 1e3 / 60;
        if (timeDiff >= 5) {
          this.handleCheckOut(item._id, item);
        } else {
          common_vendor.index.showToast({
            title: "签到5分钟后才能签退",
            icon: "none",
            duration: 2e3
          });
        }
      }
    },
    handleCheckIn(id, item) {
      common_vendor.index.$http.post("/api/itVolunteer/check-in", {
        volunteerId: id
      }).then((res) => {
        const updatedItemIndex = this.list.findIndex((i) => i._id === id);
        if (updatedItemIndex !== -1) {
          const currentTime = /* @__PURE__ */ new Date();
          this.$set(this.list[updatedItemIndex], "checkInTime", currentTime);
          this.$set(this.checkInTime, id, currentTime);
          this.$set(this.list[updatedItemIndex], "checkOutTime", null);
          this.$set(this.list[updatedItemIndex], "disabled", false);
        }
        common_vendor.index.showToast({
          duration: 1500,
          title: res.data.message,
          icon: "none"
        });
      });
    },
    handleCheckOut(id, item) {
      common_vendor.index.$http.post("/api/itVolunteer/check-out", {
        volunteerId: id
      }).then((res) => {
        const updatedItemIndex = this.list.findIndex((i) => i._id === id);
        if (updatedItemIndex !== -1) {
          this.$set(this.list[updatedItemIndex], "checkOutTime", res.data.checkOutTime);
          this.$set(this.list[updatedItemIndex], "disabled", true);
        }
        common_vendor.index.showToast({
          duration: 1500,
          title: res.data.message,
          icon: "none"
        });
      });
    },
    goMakePhone(phone, grade, classes, levels, name) {
      common_vendor.index.showModal({
        content: "您确定要给" + grade + classes + levels + name + "打电话嘛！",
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
          title: "该手机号不正确,无法拨打",
          duration: 1500
        });
      }
    },
    deleteUserInfo(id, name) {
      common_vendor.index.showModal({
        content: "您确定要删除" + name + "的报名信息?",
        success: (e) => {
          if (e.confirm) {
            common_vendor.index.$http.post("/api/itVolunteer/deleteVtInfo", {
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
    getButtonColor(item) {
      if (this.isCheckOut) {
        if (item.checkInTime === null) {
          return "#007aff";
        } else if (item.checkOutTime !== null) {
          return "gray";
        } else if (this.canSignOut(item)) {
          return "#FFA500";
        } else {
          return "red";
        }
      } else {
        if (item.checkInTime === null) {
          return "#007aff";
        } else {
          return "gray";
        }
      }
    },
    getButtonText(item) {
      if (this.isCheckOut) {
        if (item.checkInTime === null) {
          return "签到";
        } else if (item.checkOutTime !== null) {
          return "已签退";
        } else if (this.canSignOut(item)) {
          return "签退";
        } else {
          return "未签退";
        }
      } else {
        if (item.checkInTime === null) {
          return "签到";
        } else {
          return "已签到";
        }
      }
    },
    canSignOut(item) {
      if (!item.checkInTime)
        return false;
      const now = /* @__PURE__ */ new Date();
      const checkInTime = new Date(item.checkInTime);
      const timeDiff = (now - checkInTime) / 1e3 / 60;
      return timeDiff >= 5;
    },
    // getButtonColor(item) {
    // 	if (this.isCheckOut) {
    // 		if (item.checkInTime === null) {
    // 			return '#007aff'; // 签到按钮颜色
    // 		} else if (item.checkOutTime !== null) {
    // 			return 'gray'; // 已签退按钮颜色
    // 		} else {
    // 			return '#FFA500'; // 签退按钮颜色
    // 		}
    // 	} else {
    // 		if (item.checkInTime === null) {
    // 			return '#007aff'; // 签到按钮颜色
    // 		} else {
    // 			return 'gray'; // 签退按钮颜色
    // 		}
    // 	}
    // },
    // getButtonText(item) {
    // 	if (this.isCheckOut) {
    // 		if (item.checkInTime === null) {
    // 			return '签到';
    // 		} else if (item.checkOutTime !== null) {
    // 			return '已签退';
    // 		} else {
    // 			return '签退';
    // 		}
    // 	} else {
    // 		if (item.checkInTime === null) {
    // 			return '签到';
    // 		} else {
    // 			return '已签到';
    // 		}
    // 	}
    // },
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
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_activityData2 = common_vendor.resolveComponent("activityData");
  (_easycom_uni_search_bar2 + _easycom_loading2 + _easycom_uni_swipe_action_item2 + _easycom_activityData2)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_loading = () => "../../components/loading/loading.js";
const _easycom_uni_swipe_action_item = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_activityData = () => "../../components/activityData/activityData.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_loading + _easycom_uni_swipe_action_item + _easycom_activityData)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.sr("searchBar", "cba20186-0"),
    b: common_vendor.o($options.userInput),
    c: common_vendor.o(($event) => $data.keyword = $event),
    d: common_vendor.p({
      focus: false,
      radius: 20,
      bgColor: "#F7F7F7",
      cancelButton: "none",
      modelValue: $data.keyword
    }),
    e: $data.list.length === 0
  }, $data.list.length === 0 ? {
    f: common_vendor.t($data.message)
  } : {}, {
    g: $data.isloading
  }, $data.isloading ? {} : {
    h: common_vendor.f($options.filteredList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.ID),
        c: common_vendor.t(item.grade),
        d: common_vendor.t(item.classes),
        e: common_vendor.t(item.levels),
        f: common_vendor.t(item.counsellor),
        g: common_vendor.t(item.phoneNumber),
        h: common_vendor.o(($event) => $options.goMakePhone(item.phoneNumber, item.grade, item.classes, item.levels, item.name), index)
      }, $data.isShow ? {
        i: common_vendor.t($options.getButtonText(item)),
        j: common_vendor.o(($event) => $options.handleSignToggle(item), index),
        k: item.disabled,
        l: $options.getButtonColor(item)
      } : {
        m: common_assets._imports_0$8,
        n: common_vendor.o((...args) => $options.showTost && $options.showTost(...args), index)
      }, {
        o: common_vendor.o(($event) => $options.onClick($event, item._id, item.name), index),
        p: "cba20186-2-" + i0,
        q: index
      });
    }),
    i: $data.isShow,
    j: common_vendor.p({
      ["right-options"]: $data.options,
      ["left-options"]: $data.options
    })
  }, {
    k: common_vendor.o($options.handleUploadSuccess),
    l: common_vendor.o($options.handlebranchSuccess),
    m: common_vendor.p({
      activityId: $data.activityId,
      isShow: $data.showUpload,
      currentName: $data.activityName,
      isaudit: $data.audit
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cba20186"]]);
wx.createPage(MiniProgramPage);
