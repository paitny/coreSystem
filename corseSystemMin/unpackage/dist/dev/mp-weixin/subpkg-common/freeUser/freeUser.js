"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const BackToTop = () => "../../components/backToTop/backToTop.js";
const _sfc_main = {
  data() {
    return {
      info: [],
      // 课程和用户信息
      isShow: true,
      // 是否显示信息
      searchQuery: "",
      // 搜索框输入值
      filteredUserInfo: [],
      // 存储经过搜索过滤后的用户信息
      freeUserInfo: []
    };
  },
  components: {
    BackToTop
  },
  onLoad(options) {
    let info = JSON.parse(options.info);
    this.info = info;
    this.getFreeUserInfo();
  },
  onPageScroll(e) {
    this.$refs.VT.topData(e.scrollTop);
  },
  methods: {
    // 获取空闲学生干部信息
    getFreeUserInfo() {
      common_vendor.index.$http.get("/api/course/findUsersWithNoClassByWeekCadre", {
        targetWeekNum: this.info.weekNum,
        targetDay: this.info.day,
        targetSection: this.info.section,
        userId: common_vendor.index.getStorageSync("userInfo")._id
      }).then((res) => {
        if (res.errMsg == "request:ok") {
          this.info.user_info = this.customSort(res.data.usersWithNoClassByWeek.user_info);
          this.filteredUserInfo = this.info.user_info;
          setTimeout(() => {
            this.isShow = false;
          }, 1e3);
        }
      }).catch((error) => {
        console.error(error);
        if (error) {
          this.showload = true;
        }
      });
    },
    customSort(data) {
      const roleOrder = {
        "分团委副书记": 1,
        "分团委学生办公室主任": 2,
        "学生分会主席": 3,
        "学生分会副主席": 4,
        "校友分会会长": 5,
        "对外联络部部长": 6,
        "对外联络部副部长": 7,
        "对外联络部干事": 8,
        "体育部部长": 9,
        "体育部副部长": 10,
        "体育部干事": 11,
        "秘书处部长": 12,
        "秘书处副部长": 13,
        "秘书处干事": 14,
        "文艺部部长": 15,
        "文艺部副部长": 16,
        "文艺部干事": 17,
        "生活权益部部长": 18,
        "生活权益部副部长": 19,
        "生活权益部干事": 20,
        "学习部部长": 21,
        "学习部副部长": 22,
        "学习部干事": 23,
        "辩论队队长": 24,
        "辩论队副队长": 25,
        "辩论队干事": 26,
        "青年志愿者服务中心部长": 27,
        "青年志愿者服务中心副部长": 28,
        "青年志愿者服务中心干事": 29,
        "记者团部长": 30,
        "记者团副部长": 31,
        "记者团干事": 32,
        "技术部部长": 33,
        "技术部副部长": 34,
        "技术部干事": 35,
        "组织部部长": 36,
        "组织部副部长": 37,
        "组织部干事": 38,
        "宣传部部长": 39,
        "宣传部副部长": 40,
        "宣传部干事": 41,
        "联络部部长": 42,
        "联络部副部长": 43,
        "联络部干事": 44
      };
      return data.sort((a, b) => {
        const orderA = roleOrder[a.position] || 999;
        const orderB = roleOrder[b.position] || 999;
        return orderA - orderB;
      });
    },
    // 将数字转换为中文
    convertToChineseNumber(num) {
      const chineseNumbers = ["一", "二", "三", "四", "五", "六", "日"];
      return num >= 1 && num <= 7 ? chineseNumbers[num - 1] : "未知";
    },
    ChineseNumber(num) {
      const chineseNumbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
      return num >= 1 && num <= 12 ? chineseNumbers[num - 1] : "未知";
    },
    // 过滤用户信息，搜索功能
    filterUserInfo() {
      const query = this.searchQuery.toLowerCase();
      this.filteredUserInfo = this.info.user_info.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(query);
        const institutionMatch = item.institution.toLowerCase().includes(query);
        const positionMatch = item.position.toLowerCase().includes(query);
        return nameMatch || institutionMatch || positionMatch;
      });
    },
    // 拨打电话功能
    makePhone(phone) {
      const phoneRegex = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      if (phoneRegex.test(phone)) {
        common_vendor.index.makePhoneCall({
          phoneNumber: phone
        });
      } else {
        common_vendor.index.showToast({
          icon: "none",
          title: "该手机号不正确，无法拨打",
          duration: 1500
        });
      }
    },
    // 点击拨打电话
    makeCall(phone, position, name) {
      if (phone) {
        common_vendor.index.showModal({
          content: `您确定要给 ${position} ${name} 打电话嘛！`,
          success: (e) => {
            if (e.confirm) {
              this.makePhone(phone);
            }
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "未提供电话号码",
          icon: "none"
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_loading2 = common_vendor.resolveComponent("loading");
  const _component_BackToTop = common_vendor.resolveComponent("BackToTop");
  (_easycom_loading2 + _component_BackToTop)();
}
const _easycom_loading = () => "../../components/loading/loading.js";
if (!Math) {
  _easycom_loading();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o([($event) => $data.searchQuery = $event.detail.value, (...args) => $options.filterUserInfo && $options.filterUserInfo(...args)]),
    b: $data.searchQuery,
    c: common_vendor.t($data.info.weekNum),
    d: common_vendor.t($options.convertToChineseNumber($data.info.week)),
    e: common_vendor.t($options.ChineseNumber($data.info.section)),
    f: $data.isShow
  }, $data.isShow ? {} : {
    g: common_vendor.f($data.filteredUserInfo, (item, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.institution === item.position.includes(item.institution) ? " " : item.institution),
        d: common_vendor.t(item.position),
        e: common_vendor.o(($event) => $options.makeCall(item.phone, item.position, item.name), index),
        f: index
      };
    }),
    h: common_assets._imports_0$5
  }, {
    i: common_vendor.sr("VT", "02550a8d-1"),
    j: common_vendor.p({
      scrollTop: _ctx.top
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
