"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const acGroup = () => "../../components/acGroup/acGroup.js";
const QRCode = () => "../../components/QRCode/QRCode.js";
const _sfc_main = {
  data() {
    return {
      showDialog: false,
      inputname: "",
      inputnum: "",
      inputsex: "请选择",
      gradevalue: "",
      inputclass: "",
      inputphone: "",
      inputteachar: "",
      activityId: "",
      title: "",
      deadline: "",
      countdown: "",
      // 添加倒计时数据
      countdownInterval: null,
      sexarray: ["男", "女"],
      startTime: "",
      address: "",
      description: "",
      limitPerson: "",
      isPopupVisible: false,
      contributor: {},
      facultyarray: [
        "人工智能与大数据学院",
        "文法学院",
        "外国语学院",
        "经济管理学院",
        "艺术学院",
        "传媒与演艺学院",
        "教育学院",
        "会计学院",
        "建筑学院",
        "马克思主义学院",
        "体育与大健康学院"
      ],
      inputfaculty: "",
      isdisabled: true
    };
  },
  onShow() {
    this.checkLogin();
  },
  onLoad(option) {
    this.activityId = option.id;
    this.startTime = option.startTime;
    this.address = option.address;
    this.description = option.description;
    this.limitPerson = option.limitPerson === "undefined" ? "暂无限制" : option.limitPerson + "人";
    this.title = option.title;
    this.deadline = option.deadline;
    this.contributor.groupNum = option.groupNum;
    this.contributor.groupCode = option.groupCode;
    this.contributor.baseURL = common_vendor.index.baseURL;
    this.getActiveInfo(option.id);
  },
  mounted() {
    this.updateCountdown();
    this.countdownInterval = setInterval(this.updateCountdown, 1e3);
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  components: {
    acGroup,
    QRCode
  },
  methods: {
    closeDialog() {
      this.showDialog = !this.showDialog;
    },
    handlePreviewQRCode() {
      this.$refs.childComponent.previewQRCode();
    },
    getActiveInfo(id) {
      common_vendor.index.$http.get("/api/itVolunteer/activityId", {
        activityId: id
      }).then((res) => {
        this.activityId = res.data.data._id;
        this.startTime = res.data.data.startTime;
        this.address = res.data.data.address;
        this.description = res.data.data.description;
        this.limitPerson = res.data.data.limitPerson === "undefined" ? "暂无限制" : res.data.data.limitPerson + "人";
        this.title = res.data.data.title;
        this.deadline = res.data.data.deadline;
        this.contributor.groupNum = res.data.data.groupNum;
        this.contributor.groupCode = res.data.data.groupCode;
        this.contributor.baseURL = common_vendor.index.baseURL;
      });
    },
    checkLogin() {
      common_vendor.index.$http.post("/api/login/min/check", {
        id: common_vendor.index.getStorageSync("userInfo")._id
      }).then((res) => {
        if (res.data.code === 0) {
          return common_vendor.index.showModal({
            content: "登录注册才能报名噢！",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.navigateTo({
                  url: "/pagesMe/login/login?type=2"
                });
              }
            }
          });
        } else if (res.data.code === 2) {
          return common_vendor.index.showModal({
            content: "登录注册才能报名噢！",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.navigateTo({
                  url: "/pagesMe/login/login?type=2"
                });
              }
            }
          });
        } else if (res.data.code === 1) {
          common_vendor.index.getStorage({
            key: "userInfo",
            // 你存储的数据的键名
            success: (res2) => {
              this.$store.commit("loginSuccess", res2.data);
              this.inputname = this.userInfo.name;
              this.inputnum = this.userInfo.num;
              this.inputsex = this.userInfo.sex;
              this.gradevalue = this.userInfo.grade;
              this.inputphone = this.userInfo.phone;
              this.inputteachar = this.userInfo.counsellor;
              this.inputclass = this.userInfo.class;
              this.inputfaculty = this.userInfo.faculty === "暂无" ? this.facultyarray[0] : this.userInfo.faculty;
            },
            fail: (err) => {
              console.log("获取本地存储失败", err);
            }
          });
          this.$forceUpdate();
        }
      });
    },
    hidePopup() {
      this.isPopupVisible = false;
    },
    parseDateStringAndFormat(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
    },
    updateActivity(id, title, deadline, description, isSign, mdUrl) {
      common_vendor.index.navigateTo({
        url: "../../myServices/updateRelease/updateRelease?id=" + id + "&title=" + title + "&deadline=" + deadline + "&description=" + description + "&isSign=" + isSign + "&mdUrl=" + mdUrl
      });
    },
    deleteInfo() {
      common_vendor.index.$http.post("/api/itVolunteer/delete", {
        activityId: this.activityId,
        ID: this.inputnum
      }).then((res) => {
        common_vendor.index.showToast({
          icon: "none",
          title: res.data.msg
        });
      });
    },
    deleteSelfInfo() {
      common_vendor.index.showModal({
        content: "您确定要取消" + this.title + "活动报名",
        success: (e) => {
          if (e.confirm) {
            this.deleteInfo();
          }
        }
      });
    },
    validateField(value, fieldName) {
      if (value.trim() === "") {
        common_vendor.index.showToast({
          title: fieldName + "不能为空",
          icon: "none"
        });
        return false;
      }
      return true;
    },
    onPickerChangeSex(e) {
      this.inputsex = this.sexarray[e.detail.value];
    },
    onPickerChangefaculty(e) {
      this.inputfaculty = this.facultyarray[e.detail.value];
      if (this.inputfaculty === "人工智能与大数据学院") {
        this.isdisabled = true;
        this.inputnum = this.userInfo.num;
      } else {
        this.inputnum = "";
        this.isdisabled = false;
      }
    },
    handsubmit() {
      if (!this.userInfo.user) {
        this.checkLogin();
      } else {
        if (!this.validateField(this.inputname, "姓名") || !this.validateField(this.gradevalue, "年级") || !this.validateField(this.inputclass, "班级") || !this.validateField(this.inputteachar, "辅导员") || !this.validateField(this.activityId, "必要参数")) {
          return;
        }
        if (!/^1[3456789]\d{9}$/.test(this.inputphone)) {
          return common_vendor.index.showToast({
            title: "请输入正确的手机号",
            icon: "none"
          });
        } else if (this.inputsex !== "男" && this.inputsex !== "女") {
          return common_vendor.index.showToast({
            title: "性别输入有误",
            icon: "none"
          });
        } else if (!/^\d{8,15}$/.test(this.inputnum)) {
          return common_vendor.index.showToast({
            title: "学号输入有误",
            icon: "none"
          });
        }
        common_vendor.index.$http.post("/api/itVolunteer/application", {
          activityId: this.activityId,
          name: this.inputname,
          sex: this.inputsex,
          ID: this.inputnum,
          grade: this.gradevalue,
          classes: this.inputclass,
          phoneNumber: this.inputphone,
          counsellor: this.inputteachar,
          levels: this.userInfo.levels,
          faculty: this.inputfaculty
        }).then((res) => {
          if (res.statusCode === 403) {
            return common_vendor.index.showToast({
              duration: 3e3,
              icon: "none",
              title: res.data.msg
            });
          } else if (res.statusCode === 500) {
            return common_vendor.index.showToast({
              duration: 3e3,
              icon: "none",
              title: res.data.msg
            });
          }
          common_vendor.index.showToast({
            duration: 3e3,
            icon: "none",
            title: res.data.msg
          });
          this.isPopupVisible = true;
        });
      }
    },
    application() {
      common_vendor.index.showModal({
        content: "您确定要参与" + this.title,
        success: (e) => {
          if (e.confirm) {
            this.handsubmit();
          }
        }
      });
    },
    updateCountdown() {
      const targetDate = new Date(this.deadline);
      const currentDate = /* @__PURE__ */ new Date();
      const timeDifference = targetDate - currentDate;
      if (timeDifference <= 0) {
        clearInterval(this.countdownInterval);
        this.countdown = "该活动已到截止时间";
      } else {
        const days = Math.floor(timeDifference / (1e3 * 60 * 60 * 24));
        const hours = Math.floor(timeDifference % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
        const minutes = Math.floor(timeDifference % (1e3 * 60 * 60) / (1e3 * 60));
        const seconds = Math.floor(timeDifference % (1e3 * 60) / 1e3);
        this.countdown = `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`;
      }
    }
  },
  onShareAppMessage() {
    return {
      title: this.title,
      path: "/pagesHome/application/active?id=" + this.activityId + "&title=" + this.title + "&deadline=" + this.deadline + "&startTime=" + this.startTime + "&address=" + this.address + "&description=" + this.description + "&limitPerson=" + this.limitPerson.substring(0, this.limitPerson.length - 1) + "&groupCode=" + this.contributor.groupCode + "&groupNum=" + this.contributor.groupNum
    };
  },
  onShareTimeline() {
    return {
      title: this.title,
      path: "/pagesHome/application/active?id=" + this.activityId + "&title=" + this.title + "&deadline=" + this.deadline + "&startTime=" + this.startTime + "&address=" + this.address + "&description=" + this.description + "&limitPerson=" + this.limitPerson + "&groupCode=" + this.contributor.groupCode + "&groupNum=" + this.contributor.groupNum
    };
  }
};
if (!Array) {
  const _easycom_acGroup2 = common_vendor.resolveComponent("acGroup");
  const _easycom_QRCode2 = common_vendor.resolveComponent("QRCode");
  (_easycom_acGroup2 + _easycom_QRCode2)();
}
const _easycom_acGroup = () => "../../components/acGroup/acGroup.js";
const _easycom_QRCode = () => "../../components/QRCode/QRCode.js";
if (!Math) {
  (_easycom_acGroup + _easycom_QRCode)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.title),
    b: $data.isPopupVisible
  }, $data.isPopupVisible ? {
    c: common_vendor.o($options.hidePopup),
    d: common_vendor.p({
      isPopupVisible: $data.isPopupVisible,
      contributor: $data.contributor
    })
  } : {}, {
    e: common_vendor.t($data.countdown),
    f: common_vendor.t($options.parseDateStringAndFormat($data.startTime)),
    g: common_vendor.t($data.address),
    h: common_vendor.t($data.limitPerson),
    i: common_vendor.t($data.description),
    j: common_assets._imports_1$5,
    k: common_vendor.o((...args) => $options.deleteSelfInfo && $options.deleteSelfInfo(...args)),
    l: common_vendor.t($data.inputfaculty),
    m: common_vendor.o((...args) => $options.onPickerChangefaculty && $options.onPickerChangefaculty(...args)),
    n: $data.facultyarray,
    o: $data.inputname,
    p: common_vendor.o(($event) => $data.inputname = $event.detail.value),
    q: common_vendor.t($data.inputsex),
    r: common_vendor.o((...args) => $options.onPickerChangeSex && $options.onPickerChangeSex(...args)),
    s: $data.sexarray,
    t: $data.isdisabled,
    v: $data.inputnum,
    w: common_vendor.o(($event) => $data.inputnum = $event.detail.value),
    x: $data.gradevalue,
    y: common_vendor.o(($event) => $data.gradevalue = $event.detail.value),
    z: $data.inputclass,
    A: common_vendor.o(($event) => $data.inputclass = $event.detail.value),
    B: _ctx.userInfo.levels,
    C: common_vendor.o(($event) => _ctx.userInfo.levels = $event.detail.value),
    D: $data.inputphone,
    E: common_vendor.o(($event) => $data.inputphone = $event.detail.value),
    F: $data.inputteachar,
    G: common_vendor.o(($event) => $data.inputteachar = $event.detail.value),
    H: common_vendor.o((...args) => $options.application && $options.application(...args)),
    I: common_vendor.sr("childComponent", "2e44db40-1"),
    J: common_vendor.p({
      userId: _ctx.userInfo._id,
      activityId: $data.activityId,
      activityTitle: $data.title,
      showDialog: $data.showDialog,
      closeDialog: $options.closeDialog
    }),
    K: common_assets._imports_1$6,
    L: common_vendor.o((...args) => $options.handlePreviewQRCode && $options.handlePreviewQRCode(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
