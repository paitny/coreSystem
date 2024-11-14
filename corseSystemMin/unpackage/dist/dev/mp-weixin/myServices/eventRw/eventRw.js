"use strict";
const common_vendor = require("../../common/vendor.js");
const Utils_semesterUtils = require("../../Utils/semesterUtils.js");
const myServices_common_xlsx = require("../common/xlsx.js");
const common_assets = require("../../common/assets.js");
const loading = () => "../../components/loading/loading.js";
const _sfc_main = {
  data() {
    return {
      options: [
        {
          text: "修改",
          style: {
            backgroundColor: "#4d6398"
          }
        },
        {
          text: "删除",
          style: {
            backgroundColor: "#dd524d"
          }
        }
      ],
      semesters: [],
      activeData: [],
      baseURL: "",
      userId: "",
      selectedSemester: Utils_semesterUtils.getCurrentSemester(),
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
    toVisualizing(id, isSign, volunteerCounts, title, audit) {
      common_vendor.index.navigateTo({
        url: "../../subpkg-visualization/Visualization/Visualization?isSign=" + isSign + "&volunteerCounts=" + JSON.stringify(volunteerCounts) + "&title=" + title + "&id=" + id + "&audit=" + audit
      });
    },
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
      this.isloading = true;
      this.getActiveData();
    },
    getSemster() {
      common_vendor.index.$http.get("/api/get/semesters").then((res) => {
        res.data.data.forEach((item) => {
          this.semesters.push(item.name);
        });
      });
    },
    onClick(e, id, title, deadline, description, isSign, mdUrl, address, limitPerson, startTime, groupNum, groupCode) {
      let {
        content
      } = e;
      if (content.text === "删除") {
        this.deleteItem(id, title, mdUrl);
      } else if (content.text === "修改") {
        this.updateActivity(
          id,
          title,
          deadline,
          description,
          isSign,
          mdUrl,
          address,
          limitPerson,
          startTime,
          groupNum,
          groupCode
        );
      }
    },
    swipeChange(e) {
    },
    process(id, audit, title) {
      common_vendor.index.showModal({
        content: "您确定要通过" + title + "活动的审核?",
        success: (e) => {
          if (e.confirm) {
            common_vendor.index.$http.post("/api/itVolunteer/update-audit", {
              id,
              audit: !audit
            }).then((res) => {
              common_vendor.index.showToast({
                icon: "none",
                title: res.data.message
              });
              this.getActiveData();
            });
          }
        }
      });
    },
    change(e, audit) {
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
    updateActivity(id, title, deadline, description, isSign, mdUrl, address, limitPerson, startTime, groupNum, groupCode) {
      common_vendor.index.navigateTo({
        url: "../updateRelease/updateRelease?id=" + id + "&title=" + title + "&deadline=" + deadline + "&description=" + description + "&isSign=" + isSign + "&mdUrl=" + mdUrl + "&address=" + address + "&limitPerson=" + limitPerson + "&startTime=" + startTime + "&groupNum=" + groupNum + "&groupCode=" + groupCode
      });
    },
    deleteItem(id, title, cover) {
      common_vendor.index.showModal({
        content: "您确定要删除活动" + title + "?",
        success: (e) => {
          if (e.confirm) {
            common_vendor.index.$http.post("/api/itVolunteer/deleteActivity", {
              id,
              vtCover: cover
            }).then((res) => {
              common_vendor.index.showToast({
                icon: "none",
                title: res.data.msg
              });
              this.getActiveData();
            });
          }
        }
      });
    },
    downloadAndWriteToFile(id, title, isSign) {
      common_vendor.index.$http.get("/api/itVolunteer/volunteers", {
        activityId: id
      }).then((res) => {
        if (res.data.message === "该活动暂无人参与") {
          this.message = res.data.message;
        } else {
          this.list = res.data;
          myServices_common_xlsx.exportToExcel(res.data, title, isSign);
        }
      });
    },
    getActiveData() {
      common_vendor.index.$http.get("/api/itVolunteer/myPublishActivity", {
        userId: this.userInfo._id,
        currentSemester: this.selectedSemester
      }).then((res) => {
        if (res.errMsg == "request:ok") {
          this.activeData = res.data.data;
          console.log(this.userInfo._id, this.selectedSemester);
          setTimeout(() => {
            this.isloading = false;
          }, 500);
        }
      }).catch((error) => {
        if (error) {
          this.isloading = true;
        }
      });
    },
    application(id, isSign, title, audit) {
      if (this.userInfo.admin === false) {
        return common_vendor.index.showToast({
          duration: 3e3,
          title: `${title}活动正在审核中无法查看报名详情!`,
          icon: "none"
        });
      } else {
        common_vendor.index.navigateTo({
          url: "../../subpkg-activity/signPage/signPage?id=" + id + "&isSign=" + isSign + "&title=" + title + "&audit=" + audit
        });
      }
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
  }, $data.isloading ? {} : {
    g: common_vendor.f($data.activeData, (item, k0, i0) => {
      return common_vendor.e({
        a: `${$data.baseURL}${item.cover}`,
        b: common_vendor.o(($event) => $options.clickImg(item.cover), item._id),
        c: common_vendor.t(item.title.substring(0, 12)),
        d: common_vendor.t(item.title.length > 15 ? "..." : ""),
        e: common_vendor.t($options.parseDateStringAndFormat(item.startTime)),
        f: common_vendor.t(item.address),
        g: common_vendor.t(item.userId.position),
        h: common_vendor.t(item.userId.name),
        i: item.audit
      }, item.audit ? {} : {}, {
        j: common_vendor.o(($event) => $options.application(item._id, item.isSign, item.title, item.audit), item._id)
      }, _ctx.userInfo.admin ? common_vendor.e({
        k: "4bc30a19-2-" + i0 + "," + ("4bc30a19-1-" + i0),
        l: common_vendor.p({
          type: "person-filled",
          size: "20"
        }),
        m: common_vendor.t(item.volunteerCounts.totalVolunteers),
        n: item.isSign
      }, item.isSign ? {
        o: "4bc30a19-3-" + i0 + "," + ("4bc30a19-1-" + i0),
        p: common_vendor.p({
          type: "flag-filled",
          size: "20"
        }),
        q: common_vendor.t(item.volunteerCounts.signedVolunteers)
      } : {}, {
        r: item.isSign
      }, item.isSign ? {
        s: "4bc30a19-4-" + i0 + "," + ("4bc30a19-1-" + i0),
        t: common_vendor.p({
          type: "flag",
          size: "20"
        }),
        v: common_vendor.t(item.volunteerCounts.unsignedVolunteers)
      } : {}) : {}, _ctx.userInfo.admin ? common_vendor.e({
        w: _ctx.userInfo.admin && item.audit === false
      }, _ctx.userInfo.admin && item.audit === false ? {
        x: common_vendor.o(($event) => $options.process(item._id, item.audit, item.title), item._id)
      } : {}, {
        y: common_vendor.o(($event) => $options.downloadAndWriteToFile(item._id, item.title, item.isSign), item._id),
        z: common_vendor.o(($event) => $options.toVisualizing(item._id, item.isSign, item.volunteerCounts, item.title, item.audit), item._id)
      }) : {}, {
        A: common_vendor.o(($event) => $options.onClick($event, item._id, item.title, item.deadline, item.description, item.isSign, item.cover, item.address, item.limitPerson, item.startTime, item.groupNum, item.groupCode), item._id),
        B: common_vendor.o(($event) => $options.change($event, item.audit), item._id),
        C: item._id,
        D: "4bc30a19-1-" + i0,
        E: item._id
      });
    }),
    h: _ctx.userInfo.admin,
    i: _ctx.userInfo.admin,
    j: common_vendor.p({
      ["right-options"]: $data.options
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
