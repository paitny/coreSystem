"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const Notice = () => "../../components/notice/notice.js";
const Comment = () => "../../components/comment/comment.js";
const _sfc_main = {
  data() {
    return {
      messages: [],
      // 从后端获取的弹幕数据
      currentBatch: [],
      // 当前显示的消息批次
      messageColors: [],
      // 每条消息的随机颜色
      playStates: [],
      // 控制每条消息的动画状态
      animationDuration: 10,
      // 动画持续时间
      batchSize: 5,
      // 每批显示的消息数量
      batchIndex: 0,
      // 当前批次的索引
      isTransitioning: false,
      // 是否在批次切换中
      currentNavtab: 0,
      tabs: ["最新发布", "前一天发布"],
      list: [],
      heightEle: 0,
      baseURL: "",
      isVisible: false,
      scrollTop: 0,
      trendId: "",
      comments: [],
      notice: ""
    };
  },
  created() {
    this.checkLoginPage();
    this.getMessages();
  },
  onLoad() {
    this.baseURL = common_vendor.index.baseURL;
    this.switchTab(0);
    this.getNewsListNotice();
  },
  components: {
    Notice,
    Comment
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  methods: {
    async getNewsListNotice() {
      const {
        data
      } = await common_vendor.index.$http.get("/api/get/latestNotice");
      this.notice = data.noticeComment;
    },
    getMessages() {
      common_vendor.index.$http.get("/api/trends/latest").then((res) => {
        this.messages = res.data.messages;
        this.generateMessageColors();
        this.initializePlayStates();
        this.setBatchMessages();
        this.startBatchTimer();
        console.log(res.data.messages);
      });
    },
    // 生成随机颜色
    generateMessageColors() {
      this.messageColors = this.messages.map(() => this.getRandomColor());
    },
    // 初始化播放状态
    initializePlayStates() {
      this.playStates = this.messages.map(() => "running");
    },
    // 生成随机颜色
    getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    // 设置当前批次的消息
    setBatchMessages() {
      const startIndex = this.batchIndex * this.batchSize;
      this.currentBatch = this.messages.slice(startIndex, startIndex + this.batchSize);
    },
    // 开始批次滚动的定时器
    startBatchTimer() {
      setInterval(() => {
        if (!this.isTransitioning) {
          this.batchIndex++;
          if (this.batchIndex * this.batchSize >= this.messages.length) {
            this.batchIndex = 0;
          }
          this.isTransitioning = true;
          this.setBatchMessages();
          setTimeout(() => {
            this.isTransitioning = false;
          }, this.animationDuration * 1e3);
        }
      }, this.animationDuration * 1e3);
    },
    // 暂停某条消息
    pauseAnimation(index) {
      this.$set(this.playStates, index, "paused");
    },
    // 恢复某条消息
    resumeAnimation(index) {
      this.$set(this.playStates, index, "running");
    },
    // 点击消息暂停三秒
    pauseForThreeSeconds(index) {
      this.pauseAnimation(index);
      setTimeout(() => {
        this.resumeAnimation(index);
      }, 3e3);
    },
    toggleChildVisibility() {
      this.isVisible = false;
    },
    getImageUrl(imgurl) {
      return this.baseURL + imgurl + "?timestamp=111";
    },
    formatTimestamp(timestamp) {
      var now = /* @__PURE__ */ new Date();
      var timestampDate = new Date(timestamp);
      var diff = now - timestampDate;
      var minutesDiff = Math.floor(diff / (1e3 * 60));
      var hoursDiff = Math.floor(diff / (1e3 * 60 * 60));
      var daysDiff = Math.floor(diff / (1e3 * 60 * 60 * 24));
      if (minutesDiff < 1) {
        return "刚刚";
      } else if (minutesDiff < 60) {
        return minutesDiff + "分钟前";
      } else if (hoursDiff < 24) {
        return hoursDiff + "小时前";
      } else if (daysDiff === 1) {
        return "昨天 " + timestampDate.getHours() + ":" + (timestampDate.getMinutes() < 10 ? "0" : "") + timestampDate.getMinutes();
      } else if (daysDiff < 3) {
        return daysDiff + "天前";
      } else {
        return timestampDate.getFullYear() + "-" + (timestampDate.getMonth() + 1) + "-" + timestampDate.getDate();
      }
    },
    inspectLogin(url, trendId) {
      common_vendor.index.$http.post("/api/login/min/check", {
        id: this.userInfo._id
      }).then((res) => {
        if (res.data.code === 0) {
          common_vendor.index.showToast({
            title: "未登录",
            icon: "error",
            duration: 800
          });
        } else if (res.data.code === 2) {
          common_vendor.index.showToast({
            title: "token已过期",
            icon: "error",
            duration: 800
          });
        } else if (res.data.code === 1) {
          common_vendor.index.$http.post(url, {
            id: trendId,
            userId: this.userInfo._id
          }).then((res2) => {
            common_vendor.index.showToast({
              title: res2.data.msg,
              icon: "none",
              duration: 1500
            });
            this.switchTab(this.currentNavtab);
          });
        }
      });
    },
    handTrendLike(id) {
      this.inspectLogin("/api/trends/like", id);
    },
    closeCommentSection() {
      this.isVisible = false;
    },
    showComment(id) {
      this.trendId = id;
      this.isVisible = true;
      this.getComments();
    },
    getComments() {
      common_vendor.index.$http.get("/api/trends/commentsAll", {
        dynamicId: this.trendId
      }).then((res) => {
        console.log(res);
        this.comments = res.data;
      });
    },
    release() {
      common_vendor.wx$1.downloadFile({
        url: "https://wypty.cn/static/file/userAgreement/ReleaseAgreement.pdf",
        // 自己换个其他的地址（"https://www.xxxxx.com/file/用户协议.pdf"）
        success: function(res) {
          if (res.statusCode != 200) {
            return false;
          }
          var Path = res.tempFilePath;
          common_vendor.wx$1.openDocument({
            filePath: Path,
            fileType: "pdf",
            showMenu: true,
            success: function(res2) {
              console.log("打开成功");
            }
          });
        },
        fail: function(err) {
          console.log(err, "wx.downloadFile fail err");
        }
      });
    },
    regicNet() {
      common_vendor.wx$1.downloadFile({
        url: "https://wypty.cn/static/file/userAgreement/REGNIC.pdf",
        // 自己换个其他的地址（"https://www.xxxxx.com/file/用户协议.pdf"）
        success: function(res) {
          if (res.statusCode != 200) {
            return false;
          }
          var Path = res.tempFilePath;
          common_vendor.wx$1.openDocument({
            filePath: Path,
            fileType: "pdf",
            showMenu: true,
            success: function(res2) {
              console.log("打开成功");
            }
          });
        },
        fail: function(err) {
          console.log(err, "wx.downloadFile fail err");
        }
      });
    },
    switchTab(index) {
      this.currentNavtab = index;
      if (index === 0) {
        common_vendor.index.$http.get("/api/trends/getTrendsForToday").then((res) => {
          this.list = [];
          this.list = res.data;
          this.heightEle = res.data.length * 100;
        });
      } else if (index === 1) {
        common_vendor.index.$http.get("/api/trends/getTrendsForPreviousDay").then((res) => {
          this.list = [];
          this.list = res.data;
          this.heightEle = res.data.length * 100;
        });
      }
    },
    //检测是否登录
    checkLoginPage() {
      common_vendor.index.$http.post("/api/login/min/check", {
        id: common_vendor.index.getStorageSync("userInfo")._id
      }).then((res) => {
        if (res.data.code === 0) {
          return common_vendor.index.showModal({
            content: "登录注册才有权限噢！",
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
            content: "登录注册才有权限噢！",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.navigateTo({
                  url: "/pagesMe/login/login?type=2"
                });
              }
            }
          });
        } else if (res.data.code === 1) {
          common_vendor.index.setStorageSync("userInfo", res.data.data);
          common_vendor.index.getStorage({
            key: "userInfo",
            // 你存储的数据的键名
            success: (res2) => {
              console.log(res2);
              this.$store.commit("loginSuccess", res2.data);
            },
            fail: (err) => {
              console.log("获取本地存储失败", err);
            }
          });
          this.$forceUpdate();
        }
      });
    },
    //检测是否登录
    checkLogin() {
      common_vendor.index.$http.post("/api/login/min/check", {
        id: common_vendor.index.getStorageSync("userInfo")._id
      }).then((res) => {
        if (res.data.code === 0) {
          return common_vendor.index.showModal({
            content: "登录注册才有权限噢！",
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
            content: "登录注册才有权限噢！",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.navigateTo({
                  url: "/pagesMe/login/login?type=2"
                });
              }
            }
          });
        } else if (res.data.code === 1) {
          common_vendor.index.navigateTo({
            url: "../../subpkg-common/sendLeave/sendLeave"
          });
          this.$updateFn();
        }
      });
    },
    sendLeave() {
      this.checkLogin();
    },
    date(time) {
      return common_vendor.hooks(time).format("YYYY-MM-DD");
    },
    previewImage(index, imageUrls) {
      const urls = [];
      for (const name of imageUrls) {
        urls.push(this.baseURL + name.filename);
      }
      common_vendor.index.previewImage({
        urls,
        // 图片的URL数组
        current: index
        // 当前显示图片的索引
      });
    }
  },
  onShareAppMessage() {
    return {
      title: "学生动态",
      path: "/pages/leave/leave"
    };
  },
  onShareTimeline() {
    return {
      title: "学生动态",
      path: "/pages/leave/leave"
    };
  }
};
if (!Array) {
  const _component_Notice = common_vendor.resolveComponent("Notice");
  const _component_Comment = common_vendor.resolveComponent("Comment");
  (_component_Notice + _component_Comment)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.notice),
    b: common_vendor.f($data.tabs, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.n($data.currentNavtab === index ? "f-active-color" : "f-color"),
        c: index,
        d: common_vendor.o(($event) => $options.switchTab(index), index)
      };
    }),
    c: common_vendor.o((...args) => $options.sendLeave && $options.sendLeave(...args)),
    d: common_vendor.f($data.list, (item, index, i0) => {
      return common_vendor.e({
        a: $options.getImageUrl(item.user.photo),
        b: common_vendor.t(item.user.nickName),
        c: common_vendor.t($options.formatTimestamp(item.date)),
        d: common_vendor.t(item.leaveType),
        e: common_vendor.t(item.leaveContent),
        f: common_vendor.f(item.images, (itemImage, index2, i1) => {
          return {
            a: `${$data.baseURL}${itemImage.filename}`,
            b: index2,
            c: common_vendor.o(($event) => $options.previewImage(index2, item.images), index2)
          };
        }),
        g: common_vendor.o(($event) => $options.showComment(item._id), item._id),
        h: _ctx.userInfo._id && item.likes.includes(_ctx.userInfo._id)
      }, _ctx.userInfo._id && item.likes.includes(_ctx.userInfo._id) ? {
        i: common_assets._imports_1$2
      } : {
        j: common_assets._imports_2$1
      }, {
        k: common_vendor.o(($event) => $options.handTrendLike(item._id), item._id),
        l: item.nickNameLikes.length > 0 && item.nickNameLikes[0].nickName !== "暂无"
      }, item.nickNameLikes.length > 0 && item.nickNameLikes[0].nickName !== "暂无" ? {
        m: common_vendor.f(item.nickNameLikes, (likePerson, index2, i1) => {
          return {
            a: common_vendor.t(likePerson.nickName),
            b: common_vendor.t(index2 !== item.nickNameLikes.length - 1 ? "、" : item.nickNameLikes.length > 1 ? "" : ""),
            c: common_vendor.t(index2 === item.nickNameLikes.length - 1 ? "." : ""),
            d: likePerson._id
          };
        }),
        n: common_vendor.t(item.nickNameLikes.length)
      } : {}, {
        o: item._id
      });
    }),
    e: common_assets._imports_0$1,
    f: $data.list.length === 0
  }, $data.list.length === 0 ? {} : {}, {
    g: common_vendor.o((...args) => $options.toggleChildVisibility && $options.toggleChildVisibility(...args)),
    h: common_vendor.sr("comment", "1cac5256-1"),
    i: common_vendor.o($options.closeCommentSection),
    j: common_vendor.o($options.getComments),
    k: common_vendor.p({
      isVisible: $data.isVisible,
      trendId: $data.trendId,
      comments: $data.comments
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
