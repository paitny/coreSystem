"use strict";
const common_vendor = require("../../common/vendor.js");
const FeedbackPop = () => "../../components/FeedbackPop/FeedbackPop.js";
const _sfc_main = {
  data() {
    return {
      inputUser: "",
      inputname: "",
      inputnum: "",
      inputsex: "请选择",
      gradevalue: "",
      inputclass: "",
      inputlevels: "",
      inputphone: "",
      inputteachar: "",
      activityId: "",
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
      gradeClassArr: [],
      classarray: [],
      levelsarray: [],
      gradearray: [],
      inputfaculty: "",
      isdisabled: true,
      inputquestion: ""
    };
  },
  onLoad(option) {
    this.activityId = option.id;
    this.startTime = option.startTime;
    this.address = option.address;
    this.description = option.description;
    this.limitPerson = option.limitPerson === "undefined" ? "暂无限制" : option.limitPerson + "人";
    this.title = option.title;
    this.deadline = option.deadline;
    this.inputUser = this.userInfo.user;
    this.inputname = this.userInfo.name;
    this.inputnum = this.userInfo.num;
    this.inputsex = this.userInfo.sex || this.sexarray[0];
    this.gradevalue = this.userInfo.grade;
    this.inputphone = this.userInfo.phone;
    this.inputteachar = this.userInfo.counsellor;
    this.inputclass = this.userInfo.class;
    this.inputlevels = this.userInfo.levels;
    this.inputfaculty = this.userInfo.faculty === "暂无" ? this.facultyarray[0] : this.userInfo.faculty || this.facultyarray[0];
    this.contributor.groupNum = option.groupNum;
    this.contributor.groupCode = option.groupCode;
    this.contributor.baseURL = common_vendor.index.baseURL;
  },
  mounted() {
    this.loadData();
    this.updateCountdown();
    this.countdownInterval = setInterval(this.updateCountdown, 1e3);
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  components: {
    FeedbackPop
  },
  watch: {
    gradevalue(newGrade) {
      this.loadClasses();
    }
  },
  methods: {
    async loadData() {
      common_vendor.index.$http.get("/api/get/gradeClass").then((res) => {
        this.gradeClassArr = res.data;
        this.gradearray = res.data.map((item) => item.grade);
        const gradeData = res.data.find((item) => item.grade === this.userInfo.grade);
        if (gradeData) {
          this.gradevalue = gradeData.grade;
          this.classarray = gradeData.classNames;
          this.levelsarray = gradeData.levels;
          this.inputclass = this.userInfo.class || gradeData.classNames[0];
          this.inputlevels = this.userInfo.levels || gradeData.levels[0];
        } else {
          this.gradevalue = this.gradearray[0];
          this.loadClasses();
        }
      });
    },
    loadClasses() {
      const {
        classNames,
        levels
      } = this.getClassesAndLevelsByGrade(this.gradevalue);
      this.classarray = classNames;
      this.levelsarray = levels;
      this.inputclass = classNames[0] || "";
      this.inputlevels = levels[0] || "";
    },
    // 根据年级获取对应的班级和层次
    getClassesAndLevelsByGrade(grade) {
      const filteredData = this.gradeClassArr.find((item) => item.grade === grade);
      return filteredData ? {
        classNames: filteredData.classNames,
        levels: filteredData.levels
      } : {
        classNames: [],
        levels: []
      };
    },
    ongradeChange(e) {
      this.gradevalue = this.gradearray[e.detail.value];
    },
    onClassChange(e) {
      this.inputclass = this.classarray[e.detail.value];
    },
    onLevelChange(e) {
      this.inputlevels = this.levelsarray[e.detail.value];
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
      if (!this.validateField(this.inputname, "姓名") || !this.validateField(this.gradevalue, "年级") || !this.validateField(this.inputclass, "班级") || !this.validateField(this.inputteachar, "辅导员") || !this.validateField(this.inputquestion, "反馈问题") || !this.validateField(this.inputUser, "账号和学号") || !this.validateField(this.inputphone, "手机号")) {
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
      } else if (!/^\d{8,15}$/.test(this.inputUser)) {
        return common_vendor.index.showToast({
          title: "账号和学号输入有误",
          icon: "none"
        });
      }
      common_vendor.index.$http.post("/api/feedback/create", {
        account: this.inputUser,
        name: this.inputname,
        sex: this.inputsex,
        studentId: this.inputUser,
        grade: this.gradevalue,
        classes: this.inputclass,
        phoneNumber: this.inputphone,
        counsellor: this.inputteachar,
        level: this.inputlevels,
        faculty: this.inputfaculty,
        phone: this.inputphone,
        description: this.inputquestion
      }).then((res) => {
        console.log(res);
        if (res.statusCode === 201) {
          common_vendor.index.showToast({
            duration: 3e3,
            icon: "none",
            title: res.data.msg
          });
          this.isPopupVisible = true;
        } else {
          return common_vendor.index.showToast({
            duration: 3e3,
            icon: "none",
            title: res.data.msg
          });
        }
      });
    },
    application() {
      common_vendor.index.showModal({
        content: "您确定要提交当前反馈信息",
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
      title: "芯系小助手账号问题反馈",
      path: "/subpkg-common/feedback/feedback"
    };
  },
  onShareTimeline() {
    return {
      title: "芯系小助手账号问题反馈",
      path: "subpkg-common/feedback/feedback"
    };
  }
};
if (!Array) {
  const _easycom_FeedbackPop2 = common_vendor.resolveComponent("FeedbackPop");
  _easycom_FeedbackPop2();
}
const _easycom_FeedbackPop = () => "../../components/FeedbackPop/FeedbackPop.js";
if (!Math) {
  _easycom_FeedbackPop();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isPopupVisible
  }, $data.isPopupVisible ? {
    b: common_vendor.o($options.hidePopup),
    c: common_vendor.p({
      isPopupVisible: $data.isPopupVisible,
      contributor: $data.contributor
    })
  } : {}, {
    d: common_vendor.t($data.inputfaculty),
    e: common_vendor.o((...args) => $options.onPickerChangefaculty && $options.onPickerChangefaculty(...args)),
    f: $data.facultyarray,
    g: $data.inputUser,
    h: common_vendor.o(($event) => $data.inputUser = $event.detail.value),
    i: $data.inputname,
    j: common_vendor.o(($event) => $data.inputname = $event.detail.value),
    k: common_vendor.t($data.inputsex),
    l: common_vendor.o((...args) => $options.onPickerChangeSex && $options.onPickerChangeSex(...args)),
    m: $data.sexarray,
    n: $data.isdisabled,
    o: $data.inputUser,
    p: common_vendor.o(($event) => $data.inputUser = $event.detail.value),
    q: $data.isdisabled
  }, $data.isdisabled ? {
    r: common_vendor.t($data.gradevalue),
    s: common_vendor.o((...args) => $options.ongradeChange && $options.ongradeChange(...args)),
    t: $data.gradearray,
    v: common_vendor.t($data.inputclass),
    w: common_vendor.o((...args) => $options.onClassChange && $options.onClassChange(...args)),
    x: $data.classarray,
    y: common_vendor.t($data.inputlevels),
    z: common_vendor.o((...args) => $options.onLevelChange && $options.onLevelChange(...args)),
    A: $data.levelsarray
  } : {
    B: $data.gradevalue,
    C: common_vendor.o(($event) => $data.gradevalue = $event.detail.value),
    D: $data.inputclass,
    E: common_vendor.o(($event) => $data.inputclass = $event.detail.value),
    F: $data.inputlevels,
    G: common_vendor.o(($event) => $data.inputlevels = $event.detail.value)
  }, {
    H: $data.inputphone,
    I: common_vendor.o(($event) => $data.inputphone = $event.detail.value),
    J: $data.inputteachar,
    K: common_vendor.o(($event) => $data.inputteachar = $event.detail.value),
    L: $data.inputquestion,
    M: common_vendor.o(($event) => $data.inputquestion = $event.detail.value),
    N: common_vendor.o((...args) => $options.application && $options.application(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
