"use strict";
const common_vendor = require("../../common/vendor.js");
const Utils_semesterUtils = require("../../Utils/semesterUtils.js");
const myServices_common_xlsx = require("../common/xlsx.js");
const common_assets = require("../../common/assets.js");
const loading = () => "../../components/loading/loading.js";
const _sfc_main = {
  data() {
    return {
      optionsList: [],
      sendActivityId: "",
      title: "",
      showDialog: false,
      semesters: [],
      activeData: [],
      filteredActiveData: [],
      baseURL: "",
      userId: "",
      selectedSemester: Utils_semesterUtils.getCurrentSemester(),
      isloading: true,
      loading: false,
      page: 1,
      total: 0,
      searchKeyword: "",
      topItems: []
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  components: {
    loading
  },
  mounted() {
    this.loadTopItems();
  },
  methods: {
    initializeOptionsList() {
      this.optionsList = this.filteredActiveData.map((item) => {
        const isTop = this.topItems.some((topItem) => topItem._id === item._id);
        return [
          {
            text: isTop ? "取消置顶" : "置顶",
            style: {
              backgroundColor: isTop ? "#ff7f50" : "#f5a623"
            }
          },
          {
            text: "xlsx",
            style: {
              backgroundColor: "#217647"
            }
          },
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
        ];
      });
    },
    closeDialog() {
      this.showDialog = !this.showDialog;
    },
    async handlePreviewQRCode(id, title) {
      this.sendActivityId = id;
      this.title = title;
      this.$refs.childComponent.previewQRCode(id);
    },
    onSearch() {
      if (this.searchKeyword.trim() === "") {
        this.getActiveData();
        this.filteredActiveData = this.activeData;
        this.total = this.activeData.length;
        this.lazyLoading();
      } else {
        common_vendor.index.$http.get("/api/get/searchActive", {
          query: this.searchKeyword,
          userId: this.userInfo._id,
          currentSemester: this.selectedSemester
        }).then((res) => {
          if (res.data.code === 202) {
            this.filteredActiveData = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            common_vendor.index.showToast({
              title: "搜索失败",
              icon: "none"
            });
          }
        }).catch((err) => {
          console.error(err);
          common_vendor.index.showToast({
            title: "搜索出错",
            icon: "none"
          });
        });
      }
    },
    toVisualizing(id, isSign, isCheckOut, volunteerCounts, title, audit) {
      common_vendor.index.navigateTo({
        url: "../../subpkg-visualization/Visualization/Visualization?isSign=" + isSign + "&volunteerCounts=" + JSON.stringify(volunteerCounts) + "&title=" + title + "&id=" + id + "&audit=" + audit + "&isCheckOut=" + isCheckOut
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
      this.page = 1;
      this.activeData = [];
      this.isloading = true;
      this.getActiveData();
      this.loadTopItems();
    },
    getSemster() {
      common_vendor.index.$http.get("/api/get/semesters").then((res) => {
        res.data.data.forEach((item) => {
          this.semesters.push(item.name);
        });
      });
    },
    moveToTop(index, id) {
      const item = this.filteredActiveData.splice(index, 1)[0];
      this.filteredActiveData.unshift(item);
      let topItems = common_vendor.index.getStorageSync("topItems") || [];
      if (!topItems.some((topItem) => topItem._id === item._id)) {
        topItems.push(item);
        this.topItems.push(item);
        common_vendor.index.setStorageSync("topItems", topItems);
      }
      common_vendor.index.$http.post("/api/itVolunteer/top-items-save", {
        activityId: id,
        userId: this.userInfo._id,
        currentSemester: this.selectedSemester
      }).then((res) => {
        common_vendor.index.showToast({
          title: "已置顶",
          icon: "success"
        });
      });
    },
    updateItems() {
      this.filteredActiveData = [...this.filteredActiveData];
      this.topItems.forEach((topItem) => {
        const index = this.filteredActiveData.findIndex((item) => item._id === topItem._id);
        if (index !== -1) {
          const [movedItem] = this.filteredActiveData.splice(index, 1);
          this.filteredActiveData.unshift(movedItem);
        }
      });
    },
    removeTop(index) {
      const item = this.filteredActiveData[index];
      this.topItems = this.topItems.filter((topItem) => topItem._id !== item._id);
      common_vendor.index.setStorageSync("topItems", this.topItems);
      this.updateItems();
      common_vendor.index.$http.post("/api/itVolunteer/top-items-cancle", {
        activityId: item._id,
        userId: this.userInfo._id,
        currentSemester: this.selectedSemester
      }).then((res) => {
        common_vendor.index.showToast({
          title: "已取消置顶",
          icon: "success"
        });
      });
    },
    loadTopItems() {
      common_vendor.index.$http.get("/api/itVolunteer/top-items-user", {
        userId: this.userInfo._id,
        currentSemester: this.selectedSemester
      }).then((res) => {
        this.topItems = [];
        this.topItems = res.data.data.list || [];
        common_vendor.index.setStorageSync("topItems", this.topItems);
        const topItems = common_vendor.index.getStorageSync("topItems") || [];
        topItems.forEach((topItem) => {
          const isItemExists = this.activeData.some((item) => item._id === topItem._id);
          const isCurrentSemester = topItem.currentSemester === this.selectedSemester;
          if (!isItemExists && isCurrentSemester) {
            this.activeData.unshift(topItem);
          }
        });
      });
    },
    // 处理点击事件，根据点击选项执行操作
    onClick(e, id, title, deadline, description, isSign, mdUrl, address, limitPerson, startTime, groupNum, groupCode, index, isCheckOut, transpire) {
      let {
        content
      } = e;
      switch (content.text) {
        case "删除":
          this.deleteItem(id, title, mdUrl, index);
          break;
        case "修改":
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
            groupCode,
            isCheckOut,
            transpire
          );
          break;
        case "xlsx":
          this.downloadAndWriteToFile(id, title, isSign, isCheckOut);
          break;
        case "置顶":
          this.moveToTop(index, id);
          break;
        case "取消置顶":
          this.removeTop(index);
          break;
        default:
          console.warn("未识别的操作");
      }
    },
    swipeChange(e) {
    },
    process(id, audit, title, index) {
      common_vendor.index.showModal({
        content: "您确定要驳回" + title + "活动?",
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
              this.activeData.splice(index, 1);
              this.lazyLoading();
            });
          }
        }
      });
    },
    change(e, id, index) {
      const isTop = this.topItems.some((item) => item._id === id);
      this.optionsList[index] = this.optionsList[index].map((option, idx) => {
        if (idx === 0) {
          return {
            text: isTop ? "取消置顶" : "置顶",
            style: {
              backgroundColor: isTop ? "#ff7f50" : "#f5a623"
            }
          };
        }
        return option;
      });
    },
    // getCurrentSemester() {
    // 	const currentDate = new Date();
    // 	const currentYear = currentDate.getFullYear();
    // 	const currentMonth = currentDate.getMonth() + 1;
    // 	let semester;
    // 	if ((currentMonth >= 9 && currentMonth <= 12) || (currentMonth >= 1 && currentMonth < 3)) {
    // 		semester = '第一学期';
    // 	} else if (currentMonth >= 3 && currentMonth <= 6) {
    // 		semester = '第二学期';
    // 	} else {
    // 		semester = '寒假/暑假';
    // 	}
    // 	const academicYear = `${currentYear-1}-${currentYear}学年度`;
    // 	return `${academicYear}${semester}`;
    // },
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
    updateActivity(id, title, deadline, description, isSign, mdUrl, address, limitPerson, startTime, groupNum, groupCode, isCheckOut, transpire) {
      common_vendor.index.navigateTo({
        url: "../updateRelease/updateRelease?id=" + id + "&title=" + title + "&deadline=" + deadline + "&description=" + description + "&isSign=" + isSign + "&mdUrl=" + mdUrl + "&address=" + address + "&limitPerson=" + limitPerson + "&startTime=" + startTime + "&groupNum=" + groupNum + "&groupCode=" + groupCode + "&isCheckOut=" + isCheckOut + "&transpire=" + transpire
      });
    },
    deleteItem(id, title, cover, index) {
      common_vendor.index.showModal({
        content: "您确定要删除活动" + title + "?",
        success: (e) => {
          if (e.confirm) {
            common_vendor.index.$http.post("/api/itVolunteer/deleteActivity", {
              id,
              vtCover: cover
            }).then((res) => {
              this.activeData.splice(index, 1);
              this.lazyLoading();
              common_vendor.index.showToast({
                icon: "none",
                title: res.data.msg
              });
            });
          }
        }
      });
    },
    downloadAndWriteToFile(id, title, isSign, isCheckOut) {
      common_vendor.index.$http.get("/api/itVolunteer/volunteers", {
        activityId: id
      }).then((res) => {
        if (res.data.message === "该活动暂无人参与") {
          this.message = res.data.message;
        } else {
          this.list = res.data;
          myServices_common_xlsx.exportToExcel(res.data, title, isSign, isCheckOut);
        }
      });
    },
    getActiveData() {
      this.loading = true;
      common_vendor.index.$http.get("/api/itVolunteer/activeUserId", {
        userId: this.userInfo._id,
        currentSemester: this.selectedSemester,
        page: this.page
      }).then((res) => {
        if (res.errMsg == "request:ok") {
          this.total = res.data.data.total;
          setTimeout(() => {
            this.loading = false;
            this.isloading = false;
            this.activeData = this.activeData.map((item) => {
              const newItem = res.data.data.list.find((t) => t._id === item._id);
              return newItem ? {
                ...item,
                ...newItem
              } : item;
            }).concat(
              res.data.data.list.filter((newItem) => !this.activeData.some((item) => item._id === newItem._id))
            );
            this.filteredActiveData = this.activeData;
            this.initializeOptionsList();
            this.loadTopItems();
          }, 1e3);
        }
      }).catch((error) => {
        if (error) {
          this.isloading = true;
        }
      });
    },
    application(id, isSign, title, audit, isCheckOut) {
      common_vendor.index.navigateTo({
        url: "../../subpkg-activity/signPage/signPage?id=" + id + "&isSign=" + isSign + "&title=" + title + "&audit=" + audit + "&isCheckOut=" + isCheckOut
      });
    },
    lazyLoading() {
      this.page = this.page;
      this.getActiveData();
      this.loadTopItems();
    }
  },
  onShow() {
    this.lazyLoading();
  },
  onLoad(options) {
    this.isSign = options.sign;
    this.baseURL = common_vendor.index.baseURL;
    this.getSemster();
    this.lazyLoading();
  },
  onReachBottom() {
    if (this.activeData.length < this.total) {
      this.page++;
      this.loading = true;
      this.getActiveData();
    } else {
      common_vendor.index.showToast({
        title: "我是有底线的噢",
        icon: "none",
        duration: 1800
      });
    }
  },
  onPullDownRefresh() {
    this.lazyLoading();
    common_vendor.index.showToast({
      title: "刷新成功",
      icon: "success",
      duration: 800
    });
    setTimeout(function() {
      common_vendor.index.stopPullDownRefresh();
    }, 1e3);
  }
};
if (!Array) {
  const _easycom_loading2 = common_vendor.resolveComponent("loading");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_swipe_action2 = common_vendor.resolveComponent("uni-swipe-action");
  const _easycom_QRCode2 = common_vendor.resolveComponent("QRCode");
  (_easycom_loading2 + _easycom_uni_icons2 + _easycom_uni_swipe_action_item2 + _easycom_uni_swipe_action2 + _easycom_QRCode2)();
}
const _easycom_loading = () => "../../components/loading/loading.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_swipe_action_item = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_swipe_action = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.js";
const _easycom_QRCode = () => "../../components/QRCode/QRCode.js";
if (!Math) {
  (_easycom_loading + _easycom_uni_icons + _easycom_uni_swipe_action_item + _easycom_uni_swipe_action + _easycom_QRCode)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t("《" + $data.selectedSemester + "》"),
    b: $data.semesters,
    c: common_vendor.o((...args) => $options.onSemesterChange && $options.onSemesterChange(...args)),
    d: common_vendor.o([($event) => $data.searchKeyword = $event.detail.value, (...args) => $options.onSearch && $options.onSearch(...args)]),
    e: $data.searchKeyword,
    f: $data.filteredActiveData.length === 0
  }, $data.filteredActiveData.length === 0 ? {
    g: common_assets._imports_0$4
  } : {}, {
    h: $data.isloading
  }, $data.isloading ? {} : common_vendor.e({
    i: common_vendor.f($data.filteredActiveData, (item, index, i0) => {
      return common_vendor.e({
        a: `${$data.baseURL}${item.cover}`,
        b: common_vendor.o(($event) => $options.clickImg(item.cover), item._id),
        c: common_vendor.t(item.title.substring(0, 12)),
        d: common_vendor.t(item.title.length > 15 ? "..." : ""),
        e: common_vendor.t($options.parseDateStringAndFormat(item.startTime)),
        f: common_vendor.t(item.address),
        g: common_vendor.t(item.userId.position === "普通用户" ? "" : item.userId.position),
        h: common_vendor.t(item.userId.name),
        i: item.audit
      }, item.audit ? {} : {}, {
        j: common_vendor.o(($event) => $options.application(item._id, item.isSign, item.title, item.audit, item.isCheckOut), item._id),
        k: "1e58027a-3-" + i0 + "," + ("1e58027a-2-" + i0),
        l: common_vendor.t(item.volunteerCounts.totalVolunteers),
        m: item.isSign
      }, item.isSign ? {
        n: "1e58027a-4-" + i0 + "," + ("1e58027a-2-" + i0),
        o: common_vendor.p({
          type: "flag-filled",
          size: "20"
        }),
        p: common_vendor.t(item.volunteerCounts.signedVolunteers)
      } : {}, {
        q: item.isSign
      }, item.isSign ? {
        r: "1e58027a-5-" + i0 + "," + ("1e58027a-2-" + i0),
        s: common_vendor.p({
          type: "flag",
          size: "20"
        }),
        t: common_vendor.t(item.volunteerCounts.unsignedVolunteers)
      } : {}, {
        v: _ctx.userInfo.admin && item.audit
      }, _ctx.userInfo.admin && item.audit ? {
        w: common_vendor.o(($event) => $options.process(item._id, item.audit, item.title, index), item._id)
      } : {}, {
        x: common_vendor.o(($event) => $options.handlePreviewQRCode(item._id, item.title), item._id),
        y: common_vendor.o(($event) => $options.toVisualizing(item._id, item.isSign, item.isCheckOut, item.volunteerCounts, item.title, item.audit), item._id),
        z: common_vendor.o(($event) => $options.onClick($event, item._id, item.title, item.deadline, item.description, item.isSign, item.cover, item.address, item.limitPerson, item.startTime, item.groupNum, item.groupCode, index, item.isCheckOut, item.transpire), item._id),
        A: common_vendor.o(($event) => $options.change($event, item._id, index), item._id),
        B: item._id,
        C: "1e58027a-2-" + i0 + "," + ("1e58027a-1-" + i0),
        D: common_vendor.p({
          ["right-options"]: $data.optionsList[index]
        }),
        E: item._id,
        F: "1e58027a-1-" + i0
      });
    }),
    j: common_vendor.p({
      type: "person-filled",
      size: "20"
    }),
    k: $data.loading
  }, $data.loading ? {} : {}, {
    l: $data.filteredActiveData.length === $data.total && $data.activeData.length > 0
  }, $data.filteredActiveData.length === $data.total && $data.activeData.length > 0 ? {
    m: common_vendor.t($data.total)
  } : {}), {
    n: common_vendor.sr("childComponent", "1e58027a-6"),
    o: common_vendor.p({
      userId: _ctx.userInfo._id,
      activityId: $data.sendActivityId,
      activityTitle: $data.title,
      showDialog: $data.showDialog,
      closeDialog: $options.closeDialog
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
