"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const goLogin = () => "../../components/goLogin/goLogin.js";
const Pop = () => "../../components/pop/pop.js";
const morePop = () => "../../components/morePop/morePop.js";
let videoAd = null;
const _sfc_main = {
  data() {
    return {
      copiedText: "https://sit.cdcas.edu.cn",
      baseURL: "",
      userType: [],
      volunteerCount: "",
      trendCount: "",
      courseCount: "",
      userExamCount: "",
      userFoots: "",
      MyServicesData: [],
      random: "",
      getContributorData: [],
      isPopupVisible: false,
      contributor: {},
      countAudit: 0,
      visibleServices: [],
      showMoreButton: false,
      isVisible: false,
      MyServicesDataPop: []
    };
  },
  components: {
    goLogin,
    Pop,
    morePop
  },
  watch: {
    userInfo() {
      this.random = `?_=${Date.now()}`;
    }
  },
  // 得到属性userInfo
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  onShow() {
    this.getCount();
    this.getMyServices();
    this.getAuditCount();
  },
  onLoad() {
    common_vendor.index.getStorage({
      key: "userInfo",
      // 你存储的数据的键名
      success: (res) => {
        this.$store.commit("loginSuccess", res.data);
        this.getCount();
      },
      fail: (err) => {
        console.log("获取本地存储失败", err);
      }
    });
    this.baseURL = common_vendor.index.baseURL;
    this.getMyServices();
    this.getContributor();
  },
  methods: {
    closeCommentSection() {
      this.isVisible = false;
    },
    showMoreServices() {
      this.isVisible = true;
    },
    getProvince(location) {
      common_vendor.index.$http.get("/api/get/province", {
        ip: location
      }).then((res) => {
        this.checkLogin(res.data.data);
      });
    },
    getUserLocation() {
      common_vendor.index.request({
        url: "https://ipapi.co/json/",
        // IP API 的 URL
        method: "GET",
        success: (res) => {
          if (res.statusCode === 200) {
            const data = res.data;
            const location = data.region || data.city;
            this.getProvince(location);
          } else {
            console.log("获取位置失败:", res);
          }
        },
        fail: (error) => {
          console.log("请求失败:", error);
        }
      });
    },
    getAuditCount() {
      common_vendor.index.$http.get("/api/itVolunteer/auditCount", {
        userId: this.userInfo._id
      }).then((res) => {
        this.countAudit = res.data.data;
      });
    },
    getImageUrl(imgurl) {
      return this.baseURL + imgurl + "?timestamp=709920";
    },
    //id就是传入的广告位id
    load(id) {
      console.log(id);
      if (common_vendor.index.createRewardedVideoAd) {
        videoAd = common_vendor.index.createRewardedVideoAd({
          adUnitId: id
        });
        videoAd.onLoad(() => {
        });
        videoAd.onError((err) => {
          console.error("激励视频光告加载失败", err);
        });
        videoAd.onClose((status) => {
          if (status && status.isEnded || status === void 0) {
            this.isPopupVisible = true;
          } else {
            common_vendor.index.showToast({
              duration: 1500,
              title: "获取失败",
              icon: "none"
            });
          }
        });
      }
    },
    show() {
      if (videoAd) {
        videoAd.show().catch(() => {
          videoAd.load().then(() => videoAd.show()).catch((err) => {
            console.error("激励视频 广告显示失败", err);
          });
        });
      }
    },
    showPopup(contributor) {
      common_vendor.index.showModal({
        content: "贡献者详情需观看激励广告后可查看",
        success: (e) => {
          if (e.confirm) {
            if (this.userInfo.admin && this.userInfo.adminPlus) {
              this.contributor = contributor;
              this.isPopupVisible = true;
              return;
            }
            this.load("adunit-a96ef049dea42dda");
            this.show();
            this.contributor = contributor;
          }
        }
      });
    },
    hidePopup() {
      this.isPopupVisible = false;
    },
    // async getMyServices() {
    // 	await uni.$http.get('/api/route/myServices').then((res) => {
    // 		this.MyServicesData = res.data
    // 		if (this.userInfo.admin === true) {
    // 			this.MyServicesData[2].shouldShow = !this.MyServicesData[2].shouldShow;
    // 			this.MyServicesData[0].shouldShow = !this.MyServicesData[0].shouldShow;
    // 		}
    // 		if (this.userInfo.isCadre === true || this.userInfo.admin === true) {
    // 			this.MyServicesData[1].shouldShow = !this.MyServicesData[1].shouldShow;
    // 		}
    // 		if (this.userInfo.isCadre === true || this.userInfo.admin === true) {
    // 			this.MyServicesData[3].shouldShow = !this.MyServicesData[3].shouldShow;
    // 		}
    // 		if (this.userInfo.admin === true || this.userInfo.position.includes("部长") || this.userInfo
    // 			.position.includes("负责人")) {
    // 			this.MyServicesData[7].shouldShow = !this.MyServicesData[7].shouldShow;
    // 		}
    // 		if (this.userInfo.admin === true || this.userInfo.position.includes("部长") || this.userInfo
    // 			.position.includes("负责人")) {
    // 			this.MyServicesData[8].shouldShow = !this.MyServicesData[8].shouldShow;
    // 		}
    // 		if (this.userInfo.admin === true || this.userInfo.position.includes("部长") || this.userInfo
    // 			.position.includes("负责人")) {
    // 			this.MyServicesData[9].shouldShow = !this.MyServicesData[9].shouldShow;
    // 		}
    // 		if (this.userInfo.admin === true || this.userInfo.position.includes("学习部")) {
    // 			this.MyServicesData[10].shouldShow = !this.MyServicesData[10].shouldShow;
    // 		}
    // 		if (this.userInfo.admin === true || this.userInfo.position.includes("学习部") || this.userInfo
    // 			.class.includes("辅导员")) {
    // 			this.MyServicesData[11].shouldShow = !this.MyServicesData[11].shouldShow;
    // 		}
    // 	})
    // },
    // async getMyServices() {
    //   const userInfo = {
    //     admin: this.userInfo.admin,
    //     isCadre: this.userInfo.isCadre,
    //     position: this.userInfo.position,
    //     class: this.userInfo.class
    //   };
    //   // 使用 POST 请求将用户信息发送到后端
    //   const res = await uni.$http.post('/api/route/myServices', userInfo);
    //   this.MyServicesData = res.data;
    // },
    async getMyServices() {
      try {
        const userInfo = {
          admin: common_vendor.index.getStorageSync("userInfo").admin,
          isCadre: common_vendor.index.getStorageSync("userInfo").isCadre,
          position: common_vendor.index.getStorageSync("userInfo").position,
          class: common_vendor.index.getStorageSync("userInfo").class
        };
        const res = await common_vendor.index.$http.post("/api/route/myServicesLimit", userInfo);
        const allServices = res.data;
        this.MyServicesDataPop = res.data;
        const visibleServices = allServices.filter((service) => service.shouldShow);
        if (visibleServices.length > 8) {
          this.visibleServices = visibleServices.slice(0, 8);
          this.showMoreButton = true;
        } else {
          this.visibleServices = visibleServices;
          this.showMoreButton = false;
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        common_vendor.index.showToast({
          title: "请登录",
          icon: "none"
        });
      }
    },
    openExternalLink() {
      common_vendor.index.navigateTo({
        url: "/subpkg-common/webview/webview?url=" + this.copiedText
        // 将URL替换为你想要跳转的外部链接
      });
    },
    //联系客服
    makePhone() {
      common_vendor.index.makePhoneCall({
        phoneNumber: "17366904803"
      });
    },
    trendCountClick() {
      common_vendor.index.showToast({
        duration: 1500,
        title: "此功能正在开发中...",
        icon: "none"
      });
    },
    getCount() {
      common_vendor.index.$http.get("/api/get/getStatistics", {
        num: this.userInfo.num,
        userId: this.userInfo._id
      }).then((res) => {
        this.volunteerCount = "";
        this.volunteerCount = res.data.data.volunteerCount;
        this.trendCount = "";
        this.trendCount = res.data.data.trendCount;
        this.courseCount = "";
        this.courseCount = res.data.data.courseCount;
        this.userFoots = "";
        this.userFoots = res.data.data.userFoots;
      });
    },
    //退出登录
    ...common_vendor.mapMutations(["loginOut"]),
    removeStore() {
      common_vendor.index.removeStorage({
        key: "userInfo",
        // 要清除的数据的键名
        success: () => {
          console.log("数据清除成功");
        },
        fail: (err) => {
          console.log("数据清除失败", err);
        }
      });
      common_vendor.index.removeStorage({
        key: "token",
        // 要清除的数据的键名
        success: () => {
          console.log("数据清除成功");
        },
        fail: (err) => {
          console.log("数据清除失败", err);
        }
      });
    },
    gotoFeeds(url) {
      common_vendor.index.switchTab({
        url
      });
    },
    getContributor() {
      common_vendor.index.$http.get("/api/get/getUserByFixedNum").then((res) => {
        this.getContributorData = res.data;
      });
    },
    btnPage(url) {
      common_vendor.index.navigateTo({
        url
      });
    },
    copyUrl() {
      common_vendor.index.setClipboardData({
        data: this.copiedText,
        success() {
          common_vendor.index.showToast({
            title: "链接已复制",
            icon: "success"
          });
        },
        fail() {
          common_vendor.index.showToast({
            title: "复制失败",
            icon: "none"
          });
        }
      });
    },
    checkLogin(province) {
      console.log(province);
      common_vendor.index.$http.post("/api/login/min/check", {
        id: this.userInfo._id,
        province
      }).then((res) => {
        if (res.data.code === 0) {
          this.loginOut();
          this.removeStore();
          setTimeout(() => {
            this.$forceUpdate();
          }, 200);
        } else if (res.data.code === 2) {
          this.loginOut();
          this.removeStore();
          setTimeout(() => {
            this.$forceUpdate();
          }, 200);
        } else if (res.data.code === 1) {
          common_vendor.index.setStorageSync("userInfo", res.data.data);
          common_vendor.index.getStorage({
            key: "userInfo",
            // 你存储的数据的键名
            success: (res2) => {
              this.$store.commit("loginSuccess", res2.data);
            },
            fail: (err) => {
              console.log("获取本地存储失败", err);
            }
          });
          this.$forceUpdate();
        }
      });
    }
  },
  mounted() {
  },
  async onPullDownRefresh() {
    await this.getCount();
    await this.getUserLocation();
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
  const _component_Pop = common_vendor.resolveComponent("Pop");
  const _easycom_morePop2 = common_vendor.resolveComponent("morePop");
  const _easycom_goLogin2 = common_vendor.resolveComponent("goLogin");
  (_component_Pop + _easycom_morePop2 + _easycom_goLogin2)();
}
const _easycom_morePop = () => "../../components/morePop/morePop.js";
const _easycom_goLogin = () => "../../components/goLogin/goLogin.js";
if (!Math) {
  (_easycom_morePop + _easycom_goLogin)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.userInfo.user
  }, _ctx.userInfo.user ? common_vendor.e({
    b: `url(${$data.baseURL}${_ctx.userInfo.photo}${$data.random})`,
    c: common_vendor.o(($event) => $options.btnPage("/subpkg-common/setting/setting")),
    d: common_vendor.t(_ctx.userInfo.name),
    e: common_vendor.t(_ctx.userInfo.province ? _ctx.userInfo.province : "未知"),
    f: common_vendor.t(_ctx.userInfo.grade === "暂无" ? "" : _ctx.userInfo.grade),
    g: common_vendor.t(_ctx.userInfo.class === "暂无" ? "" : _ctx.userInfo.class),
    h: common_vendor.t(_ctx.userInfo.levels === "暂无" ? "" : _ctx.userInfo.levels),
    i: _ctx.userInfo.num === "213817310403" || _ctx.userInfo.num === "211060150310" || _ctx.userInfo.num === "221060860127" || _ctx.userInfo.num === "213817311132" || _ctx.userInfo.num === "211060450120"
  }, _ctx.userInfo.num === "213817310403" || _ctx.userInfo.num === "211060150310" || _ctx.userInfo.num === "221060860127" || _ctx.userInfo.num === "213817311132" || _ctx.userInfo.num === "211060450120" ? {
    j: common_assets._imports_0$2,
    k: common_vendor.t(_ctx.userInfo.position)
  } : _ctx.userInfo.isCadre || _ctx.userInfo.admin ? {
    m: common_assets._imports_1$3,
    n: common_vendor.t(_ctx.userInfo.position)
  } : {
    o: common_assets._imports_2$2,
    p: common_vendor.t(_ctx.userInfo.position)
  }, {
    l: _ctx.userInfo.isCadre || _ctx.userInfo.admin,
    q: common_vendor.o(($event) => $options.btnPage("/subpkg-common/setting/setting")),
    r: common_assets._imports_3,
    s: common_vendor.o(($event) => $options.btnPage("/subpkg-common/setting/setting")),
    t: common_vendor.t($data.volunteerCount || 0),
    v: common_vendor.o(($event) => $options.btnPage("/subpkg-visualization/myActivity/myActivity")),
    w: common_vendor.t($data.trendCount || 0),
    x: common_vendor.o((...args) => $options.trendCountClick && $options.trendCountClick(...args)),
    y: common_vendor.t($data.courseCount || 0),
    z: common_vendor.o(($event) => $options.btnPage("/subpkg-activity/myCollect/myCollect")),
    A: common_vendor.t($data.userFoots || 0),
    B: common_vendor.o(($event) => $options.btnPage("/subpkg-common/printFoot/printFoot")),
    C: !(_ctx.userInfo.adminPlus && _ctx.userInfo.admin)
  }, !(_ctx.userInfo.adminPlus && _ctx.userInfo.admin) ? {} : {}, {
    D: common_vendor.f($data.visibleServices, (item, index, i0) => {
      return common_vendor.e({
        a: `${$data.baseURL}${item.img}`,
        b: common_vendor.t(item.title),
        c: item.id === 9 && $data.countAudit > 0
      }, item.id === 9 && $data.countAudit > 0 ? {
        d: common_vendor.t($data.countAudit)
      } : {}, {
        e: common_vendor.o(($event) => $options.btnPage(item.page), item.id),
        f: item.id,
        g: item.shouldShow
      });
    }),
    E: $data.showMoreButton
  }, $data.showMoreButton ? common_vendor.e({
    F: common_assets._imports_4,
    G: $data.countAudit > 0
  }, $data.countAudit > 0 ? {
    H: common_vendor.t($data.countAudit)
  } : {}, {
    I: common_vendor.o((...args) => $options.showMoreServices && $options.showMoreServices(...args))
  }) : {}, {
    J: $data.isPopupVisible
  }, $data.isPopupVisible ? {
    K: common_vendor.o($options.hidePopup),
    L: common_vendor.p({
      isPopupVisible: $data.isPopupVisible,
      contributor: $data.contributor
    })
  } : {}, {
    M: common_vendor.sr("comment", "19c123a7-1"),
    N: common_vendor.o($options.btnPage),
    O: common_vendor.o($options.closeCommentSection),
    P: common_vendor.o(_ctx.getComments),
    Q: common_vendor.p({
      comments: $data.MyServicesDataPop,
      isVisible: $data.isVisible,
      countAudit: $data.countAudit
    }),
    R: common_vendor.o((...args) => $options.makePhone && $options.makePhone(...args)),
    S: common_vendor.f($data.getContributorData, (item, k0, i0) => {
      return {
        a: `${$data.baseURL}${item.photo}`,
        b: common_vendor.t(item.nickName),
        c: item._id,
        d: common_vendor.o(($event) => $options.showPopup({
          avatar: $data.baseURL + item.photo,
          name: item.name,
          gender: item.sex,
          grade: item.grade,
          className: item.class,
          nickName: item.nickName,
          counsellor: item.counsellor,
          personality: item.personality,
          position: item.position
        }), item._id)
      };
    })
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-19c123a7"]]);
wx.createPage(MiniProgramPage);
