"use strict";
const common_vendor = require("../../common/vendor.js");
const Utils_semesterUtils = require("../../Utils/semesterUtils.js");
const _sfc_main = {
  data() {
    return {
      showSwitchWeek: false,
      type1: false,
      type2: false,
      type3: false,
      type4: false,
      termName: Utils_semesterUtils.getCurrentSemester(),
      info: {
        name: "",
        num: "",
        credit: "",
        totalHours: "",
        lectureHours: "",
        computeHours: "",
        category: "",
        teachMethod: "",
        method: "",
        teacher: "",
        weeks: [],
        section: Number,
        address: "",
        rawWeeks: "",
        rawSection: "",
        week: Number,
        sectionCount: 1
      }
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  onLoad(options) {
    this.generateRandomNumber();
  },
  methods: {
    generateRandomNumber() {
      let randomNumber = Math.floor(Math.random() * 9e7) + 1e7;
      this.info.num = randomNumber;
    },
    formatSection(section, sectionCount) {
      if (sectionCount === 1) {
        return `[${section}节]`;
      } else {
        const endSection = section + sectionCount - 1;
        return `[${section}-${endSection}节]`;
      }
    },
    formatArray(inputArr) {
      if (!Array.isArray(inputArr) || inputArr.length === 0) {
        return "";
      }
      inputArr.sort((a, b) => a - b);
      let result = [];
      let start = null;
      let end = null;
      for (let i = 0; i < inputArr.length; i++) {
        const num = inputArr[i];
        if (start === null) {
          start = num;
          end = num;
        } else if (num === end + 1) {
          end = num;
        } else {
          if (start === end) {
            result.push(start.toString());
          } else {
            result.push(start + "-" + end);
          }
          start = num;
          end = num;
        }
      }
      if (start === end) {
        result.push(start.toString());
      } else {
        result.push(start + "-" + end);
      }
      const formattedStr = `[${result.join(", ")}周]`;
      return formattedStr;
    },
    isSelected(num) {
      return this.info.weeks.includes(num);
    },
    toggleSelection(num) {
      if (this.isSelected(num)) {
        const index = this.info.weeks.indexOf(num);
        if (index !== -1) {
          this.info.weeks.splice(index, 1);
        }
      } else {
        this.info.weeks.push(num);
      }
      this.info.rawWeeks = this.formatArray(this.info.weeks);
    },
    // 显示弹窗
    showPopup1() {
      this.type1 = true;
      this.showSwitchWeek = true;
    },
    showPopup2() {
      this.type2 = true;
      this.showSwitchWeek = true;
    },
    showPopup3() {
      this.type3 = true;
      this.showSwitchWeek = true;
    },
    showPopup4() {
      this.type4 = true;
      this.showSwitchWeek = true;
    },
    // 隐藏弹窗
    hidePopup() {
      this.showSwitchWeek = false;
      this.type1 = false;
      this.type2 = false;
      this.type3 = false;
      this.type4 = false;
    },
    // 处理按钮点击事件
    handleButtonClick1(num) {
      this.info.week = num;
      this.showSwitchWeek = false;
      this.type1 = false;
    },
    handleButtonClick2(num) {
      this.info.section = num;
      this.showSwitchWeek = false;
      this.type2 = false;
      this.info.rawSection = this.formatSection(this.info.section, this.info.sectionCount);
    },
    handleButtonClick3(num) {
      this.info.sectionCount = num;
      this.showSwitchWeek = false;
      this.type3 = false;
      this.info.rawSection = this.formatSection(this.info.section, this.info.sectionCount);
    },
    subCourse() {
      if (this.info.name.trim() == "") {
        return common_vendor.index.showToast({
          title: "无课程名",
          icon: "error",
          duration: 1500
          // 持续时间为1.5秒
        });
      } else if (this.info.week === void 0 || this.info.week === null || isNaN(this.info.week)) {
        return common_vendor.index.showToast({
          title: "无星期",
          icon: "error",
          duration: 1500
          // 持续时间为1.5秒
        });
      } else if (this.info.rawWeeks.trim() == "") {
        return common_vendor.index.showToast({
          title: "无周数",
          icon: "error",
          duration: 1500
          // 持续时间为1.5秒
        });
      } else if (this.info.rawSection.trim() == "") {
        return common_vendor.index.showToast({
          title: "无节数",
          icon: "error",
          duration: 1500
          // 持续时间为1.5秒
        });
      }
      common_vendor.index.$http.post("/api/course/add", {
        userId: this.userInfo._id,
        termName: this.termName,
        coursesList: this.info
      }).then((res) => {
        if (res.statusCode === 200) {
          return common_vendor.index.showToast({
            icon: "error",
            title: res.data.message,
            duration: 1500
          });
        }
        return common_vendor.index.showToast({
          icon: "success",
          title: "添加成功",
          duration: 1500
        });
      });
    },
    convertToChineseNumber(num) {
      const chineseNumbers = ["一", "二", "三", "四", "五", "六", "日"];
      if (num >= 1 && num <= 7) {
        return chineseNumbers[num - 1];
      } else {
        return "未知";
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.termName),
    b: $data.info.num,
    c: common_vendor.o(($event) => $data.info.num = $event.detail.value),
    d: $data.info.name,
    e: common_vendor.o(($event) => $data.info.name = $event.detail.value),
    f: common_vendor.t($options.convertToChineseNumber($data.info.week)),
    g: common_vendor.o((...args) => $options.showPopup1 && $options.showPopup1(...args)),
    h: $data.info.rawWeeks,
    i: common_vendor.o(($event) => $data.info.rawWeeks = $event.detail.value),
    j: common_vendor.o((...args) => $options.showPopup4 && $options.showPopup4(...args)),
    k: $data.info.section,
    l: common_vendor.o(($event) => $data.info.section = $event.detail.value),
    m: common_vendor.o((...args) => $options.showPopup2 && $options.showPopup2(...args)),
    n: $data.info.sectionCount,
    o: common_vendor.o(($event) => $data.info.sectionCount = $event.detail.value),
    p: common_vendor.o((...args) => $options.showPopup3 && $options.showPopup3(...args)),
    q: $data.info.rawSection,
    r: common_vendor.o(($event) => $data.info.rawSection = $event.detail.value),
    s: $data.info.teacher,
    t: common_vendor.o(($event) => $data.info.teacher = $event.detail.value),
    v: $data.info.address,
    w: common_vendor.o(($event) => $data.info.address = $event.detail.value),
    x: $data.info.category,
    y: common_vendor.o(($event) => $data.info.category = $event.detail.value),
    z: $data.info.method,
    A: common_vendor.o(($event) => $data.info.method = $event.detail.value),
    B: $data.type1
  }, $data.type1 ? {
    C: common_vendor.f(7, (num, index, i0) => {
      return {
        a: common_vendor.t($options.convertToChineseNumber(num)),
        b: num,
        c: common_vendor.o(($event) => $options.handleButtonClick1(num), num),
        d: $data.info.week == index + 1 ? 1 : ""
      };
    }),
    D: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args)),
    E: common_vendor.o(() => {
    })
  } : {}, {
    F: $data.type2
  }, $data.type2 ? {
    G: common_vendor.f(12, (num, index, i0) => {
      return {
        a: common_vendor.t(num),
        b: num,
        c: common_vendor.o(($event) => $options.handleButtonClick2(num), num),
        d: $data.info.section == index + 1 ? 1 : ""
      };
    }),
    H: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args)),
    I: common_vendor.o(() => {
    })
  } : {}, {
    J: $data.type3
  }, $data.type3 ? {
    K: common_vendor.f(12, (num, index, i0) => {
      return {
        a: common_vendor.t(num),
        b: num,
        c: common_vendor.o(($event) => $options.handleButtonClick3(num), num),
        d: $data.info.sectionCount == index + 1 ? 1 : ""
      };
    }),
    L: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args)),
    M: common_vendor.o(() => {
    })
  } : {}, {
    N: $data.type4
  }, $data.type4 ? {
    O: common_vendor.f(20, (num, index, i0) => {
      return {
        a: common_vendor.t(num),
        b: index,
        c: $options.isSelected(num) ? 1 : "",
        d: common_vendor.o(($event) => $options.toggleSelection(num), index)
      };
    }),
    P: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args)),
    Q: common_vendor.o(() => {
    })
  } : {}, {
    R: $data.showSwitchWeek,
    S: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args)),
    T: common_vendor.o((...args) => $options.subCourse && $options.subCourse(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
