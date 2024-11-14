"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const loading = () => "../../components/loading/loading.js";
const _sfc_main = {
  data() {
    return {
      options: [{
        text: "删除",
        style: {
          backgroundColor: "#dd524d"
        }
      }],
      semesters: [],
      activeData: [],
      baseURL: "",
      userId: "",
      selectedSemester: this.getCurrentSemester(),
      isloading: true
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  components: {
    loading
  },
  methods: {
    clickImg(photoImg) {
      let imgsArray = [];
      imgsArray[0] = this.baseURL + photoImg;
      common_vendor.index.previewImage({
        current: 0,
        urls: imgsArray
      });
    },
    onSemesterChange(event) {
      const index = event.detail.value;
      this.selectedSemester = this.semesters[index];
      this.getActiveData();
    },
    getSemster() {
      common_vendor.index.$http.get("/api/get/semesters").then((res) => {
        res.data.data.forEach((item) => {
          this.semesters.push(item.name);
        });
      });
    },
    onClick(e, id, title) {
      let {
        content
      } = e;
      if (content.text === "删除") {
        console.log(e.index);
        this.deleteItem(id, title, e.index);
      }
    },
    swipeChange(e) {
    },
    change() {
    },
    // 获取当前学期
    getCurrentSemester() {
      const currentDate = /* @__PURE__ */ new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      let semester;
      let academicYear;
      if (currentMonth >= 9 && currentMonth <= 12) {
        semester = "第一学期";
        academicYear = `${currentYear}-${currentYear + 1}学年度`;
      } else if (currentMonth >= 1 && currentMonth <= 2) {
        semester = "第一学期";
        academicYear = `${currentYear - 1}-${currentYear}学年度`;
      } else if (currentMonth >= 3 && currentMonth <= 6) {
        semester = "第二学期";
        academicYear = `${currentYear - 1}-${currentYear}学年度`;
      } else {
        semester = "暑假/寒假";
        academicYear = `${currentYear - 1}-${currentYear}学年度`;
      }
      return `${academicYear}${semester}`;
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
    deleteItem(id, title, index) {
      common_vendor.index.showModal({
        content: "您确定要删除您报名的" + title + "信息?",
        success: (e) => {
          if (e.confirm) {
            common_vendor.index.$http.post("/api/itVolunteer/delete", {
              activityId: id,
              ID: this.userInfo.num
            }).then((res) => {
              console.log();
              if (res.statusCode === 403 || res.statusCode === 404 || res.statusCode === 500) {
                return common_vendor.index.showToast({
                  icon: "none",
                  title: res.data.msg
                });
              }
              common_vendor.index.showToast({
                icon: "none",
                title: res.data.msg
              });
              this.activeData.splice(index, 1);
            });
          }
        }
      });
    },
    getActiveData() {
      common_vendor.index.$http.get("/api/itVolunteer/userActivity", {
        userId: this.userInfo._id,
        currentSemester: this.selectedSemester,
        num: this.userInfo.num
      }).then((res) => {
        this.isloading = true;
        if (res.errMsg == "request:ok") {
          this.activeData = res.data.data;
          setTimeout(() => {
            this.isloading = false;
          }, 500);
        }
      }).catch((error) => {
        if (error) {
          this.isloading = true;
        }
      });
    }
  },
  onShow() {
    this.getActiveData();
  },
  onLoad(options) {
    this.isSign = options.sign;
    this.baseURL = common_vendor.index.baseURL;
    this.getSemster();
  }
};
if (!Array) {
  const _easycom_loading2 = common_vendor.resolveComponent("loading");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  (_easycom_loading2 + _easycom_uni_icons2 + _easycom_uni_swipe_action_item2)();
}
const _easycom_loading = () => "../../components/loading/loading.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_swipe_action_item = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
if (!Math) {
  (_easycom_loading + _easycom_uni_icons + _easycom_uni_swipe_action_item)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t("《" + $data.selectedSemester + "》"),
    b: $data.semesters,
    c: common_vendor.o((...args) => $options.onSemesterChange && $options.onSemesterChange(...args)),
    d: $data.activeData.length === 0
  }, $data.activeData.length === 0 ? {
    e: common_assets._imports_0$4
  } : {}, {
    f: $data.isloading
  }, $data.isloading ? {} : {}, {
    g: common_vendor.f($data.activeData, (item, k0, i0) => {
      return common_vendor.e({
        a: `${$data.baseURL}${item.cover}`,
        b: common_vendor.o(($event) => $options.clickImg(item.cover), item._id),
        c: common_vendor.t(item.title.substring(0, 12)),
        d: common_vendor.t(item.title.length > 15 ? "..." : ""),
        e: common_vendor.t($options.parseDateStringAndFormat(item.startTime)),
        f: common_vendor.t(item.address),
        g: common_vendor.t(item.userId.position === "普通用户" ? "" : item.userId.position),
        h: common_vendor.t(item.userId.name),
        i: item.quantization
      }, item.quantization ? {} : {}, {
        j: !item.isSign && item.quantization || item.isSign && item.isCheckOut && item.checkOutTimes.length > 0 && item.checkInTimes.length > 0 && item.quantization || item.isSign && item.isCheckOut === false && item.checkInTimes.length > 0 && item.quantization
      }, !item.isSign && item.quantization || item.isSign && item.isCheckOut && item.checkOutTimes.length > 0 && item.checkInTimes.length > 0 && item.quantization || item.isSign && item.isCheckOut === false && item.checkInTimes.length > 0 && item.quantization ? {} : {}, {
        k: "1d2e4cb2-2-" + i0 + "," + ("1d2e4cb2-1-" + i0),
        l: common_vendor.t(item.volunteerCounts.totalVolunteers),
        m: item.isSign && item.isCheckOut && item.checkOutTimes.length === 0 && item.checkInTimes.length > 0
      }, item.isSign && item.isCheckOut && item.checkOutTimes.length === 0 && item.checkInTimes.length > 0 ? {} : item.isSign && item.isCheckOut && item.checkOutTimes.length > 0 && item.checkInTimes.length > 0 ? {} : item.isSign && item.isCheckOut === false && item.checkInTimes.length > 0 ? {} : item.isSign && item.checkInTimes.length === 0 ? {} : {}, {
        n: item.isSign && item.isCheckOut && item.checkOutTimes.length > 0 && item.checkInTimes.length > 0,
        o: item.isSign && item.isCheckOut === false && item.checkInTimes.length > 0,
        p: item.isSign && item.checkInTimes.length === 0,
        q: common_vendor.o(($event) => $options.onClick($event, item._id, item.title, item.cover), item._id),
        r: common_vendor.o($options.change, item._id),
        s: "1d2e4cb2-1-" + i0,
        t: item._id
      });
    }),
    h: common_vendor.p({
      type: "person-filled",
      size: "20"
    }),
    i: common_vendor.p({
      ["right-options"]: $data.options,
      ["left-options"]: $data.options
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
