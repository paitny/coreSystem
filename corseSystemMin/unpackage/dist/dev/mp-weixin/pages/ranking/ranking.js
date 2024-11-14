"use strict";
const common_vendor = require("../../common/vendor.js");
const rankingLoad = () => "../../components/ranking-skeleton/ranking-skeleton.js";
const _sfc_main = {
  data() {
    return {
      showload: true,
      baseURL: "",
      students: [],
      currentSlide: 0,
      slideInterval: null
    };
  },
  onLoad() {
    this.baseURL = common_vendor.index.baseURL;
    this.getRanking();
    this.startSlider();
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  components: {
    rankingLoad
  },
  onShareAppMessage() {
    return {
      title: "智数活动排名",
      path: "/pages/ranking/ranking"
    };
  },
  onShareTimeline() {
    return {
      title: "智数活动排名",
      path: "/pages/ranking/ranking"
    };
  },
  methods: {
    formatTime(timestamp) {
      const totalSeconds = Math.floor(timestamp / 1e3);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor(totalSeconds % 3600 / 60);
      const seconds = totalSeconds % 60;
      return `${hours}小时 ${minutes}分钟 ${seconds}秒`;
    },
    async getRanking() {
      try {
        const res = await common_vendor.index.$http.get("/api/itVolunteer/user-activity-ranking");
        if (res.errMsg == "request:ok") {
          const newRanking = res.data;
          this.updateRanking(newRanking);
          this.showload = false;
        }
      } catch (error) {
        console.error("获取排名数据失败:", error);
      }
    },
    updateRanking(newRanking) {
      const oldRankingMap = new Map(this.students.map((student) => [student._id, student]));
      this.students = newRanking.map((student) => {
        const oldStudent = oldRankingMap.get(student._id);
        if (oldStudent) {
          return {
            ...oldStudent,
            ...student
          };
        }
        return student;
      });
      this.students.sort((a, b) => {
        if (b.activityCount === a.activityCount) {
          return a.totalRegistrationTime - b.totalRegistrationTime;
        }
        return b.activityCount - a.activityCount;
      });
    },
    startSlider() {
      this.currentSlide = (this.currentSlide + 1) % this.students.length;
    },
    stopSlider() {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    },
    getNumberStyle(index) {
      let backgroundColor = "#f0f0f0";
      let color = "#333";
      switch (index) {
        case 0:
          backgroundColor = "#ffd700";
          color = "#fff";
          break;
        case 1:
          backgroundColor = "#c0c0c0";
          color = "#000";
          break;
        case 2:
          backgroundColor = "#cd7f32";
          color = "#fff";
          break;
      }
      return {
        backgroundColor,
        color
      };
    }
  },
  mounted() {
    this.getRanking();
  },
  beforeDestroy() {
    clearInterval(this.interval);
    this.stopSlider();
  }
};
if (!Array) {
  const _component_rankingLoad = common_vendor.resolveComponent("rankingLoad");
  _component_rankingLoad();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showload
  }, $data.showload ? {} : {
    b: common_vendor.f($data.students, (student, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.s($options.getNumberStyle(index)),
        c: $data.baseURL + student.avatar,
        d: common_vendor.t(student.nickname),
        e: common_vendor.t(student.grade),
        f: common_vendor.t(student.class),
        g: common_vendor.t(student.level),
        h: common_vendor.t(student.totalRegistrationTime),
        i: common_vendor.t(student.activityCount),
        j: student._id,
        k: common_vendor.n(student.userId === _ctx.userInfo._id ? "rotate" : "stop")
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d21fa7e5"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
