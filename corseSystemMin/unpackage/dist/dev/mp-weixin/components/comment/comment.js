"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    isVisible: Boolean,
    trendId: String,
    comments: Array
  },
  data() {
    return {
      commentText: "",
      startY: 0,
      // 触摸开始的Y坐标
      lastY: 0,
      // 上一次触摸的Y坐标
      replying: false,
      replyTarget: null,
      // 目标回复的索引
      replyUser: null,
      // 追加回复的用户信息
      baseURL: "",
      parentCommentId: "",
      replyUserId: "",
      placeholderText: "",
      replyCommentId: ""
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"]),
    totalComments() {
      let count = this.comments.length;
      this.comments.forEach((comment) => {
        count += comment.replies.length;
      });
      return count;
    }
  },
  mounted() {
    this.baseURL = common_vendor.index.baseURL;
    this.placeholderText = "请输入评论内容，系统自动识别敏感词汇";
    console.log(this.comments);
  },
  methods: {
    getImageKey(imageUrl) {
      return imageUrl;
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
    handleInputChange() {
      if (!this.commentText.trim()) {
        this.replying = false;
        this.parentCommentId = "";
        this.replyUserId = "";
        this.replyCommentId = "";
        this.placeholderText = "请输入评论内容，系统自动识别敏感词汇";
      }
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
          if (this.commentText.trim() !== "") {
            if (this.replying) {
              this.submitReply();
              this.$emit("getComments");
              this.placeholderText = "请输入评论内容，系统自动识别敏感词汇";
            } else {
              this.submitNewComment();
              this.$emit("getComments");
              this.placeholderText = "请输入评论内容，系统自动识别敏感词汇";
            }
          }
        }
      });
    },
    closeCommentSection() {
      this.$emit("close");
    },
    submitComment() {
      if (this.commentText.trim() === "") {
        return common_vendor.index.showToast({
          duration: 1800,
          title: "内容不能为空",
          icon: "none"
        });
      }
      this.checkLogin();
    },
    submitNewComment() {
      common_vendor.index.$http.post("/api/trends/comments", {
        dynamicId: this.trendId,
        userId: this.userInfo._id,
        text: this.commentText
      }).then((res) => {
        common_vendor.index.showToast({
          duration: 2500,
          title: res.data.message,
          icon: "none"
        });
      }).catch((error) => {
        console.error("评论提交失败", error);
      });
      this.comments.push({
        text: this.commentText,
        user: {
          nickname: this.userInfo.nickName,
          avatar: this.userInfo.photo,
          date: /* @__PURE__ */ new Date()
        },
        replies: []
      });
      this.commentText = "";
    },
    startReply(commentIndex, replyUserName = null, id, userId, replyCommentId) {
      this.replyUserId = userId;
      this.replying = true;
      this.replyTarget = commentIndex;
      this.parentCommentId = id;
      this.replyCommentId = replyCommentId || id;
      if (replyUserName) {
        this.replyUser = replyUserName;
        this.placeholderText = `@${replyUserName} `;
      } else {
        this.replyUser = null;
      }
    },
    submitReply() {
      common_vendor.index.$http.post("/api/trends/comments", {
        dynamicId: this.trendId,
        userId: this.userInfo._id,
        text: this.commentText,
        parentCommentId: this.parentCommentId,
        replyUserId: this.replyUserId,
        replyCommentId: this.replyCommentId
      }).then((res) => {
        common_vendor.index.showToast({
          duration: 2500,
          title: res.data.message,
          icon: "none"
        });
      }).catch((error) => {
        console.error("回复提交失败", error);
      });
      if (this.commentText.trim() !== "") {
        const comment = this.comments[this.replyTarget];
        comment.replies.push({
          text: this.commentText,
          user: {
            nickname: this.userInfo.nickName,
            avatar: this.userInfo.photo,
            date: /* @__PURE__ */ new Date()
          }
        });
        this.commentText = "";
        this.replying = false;
        this.replyUser = null;
        this.replyTarget = null;
      }
    },
    handleTouchstart(event) {
      this.startY = event.touches[0].clientY;
    },
    handleTouchend(event) {
      const deltaY = event.changedTouches[0].clientY - this.startY;
      if (deltaY < 0) {
        return;
      }
      const threshold = 50;
      if (deltaY >= threshold) {
        this.closeCommentSection();
      }
    },
    handleTouchmove(event) {
      event.stopPropagation();
    }
  }
};
if (!Array) {
  const _component_transition = common_vendor.resolveComponent("transition");
  _component_transition();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($options.totalComments > 0 ? $options.totalComments + "条评论" : "暂无评论"),
    b: common_vendor.o((...args) => $options.closeCommentSection && $options.closeCommentSection(...args)),
    c: common_vendor.f($props.comments, (comment, commentIndex, i0) => {
      return common_vendor.e({
        a: $options.getImageUrl(comment.user.avatar),
        b: $options.getImageKey(comment.user.avatar),
        c: common_vendor.t(comment.user.nickname),
        d: common_vendor.t(comment.text),
        e: common_vendor.t($options.formatTimestamp(comment.date)),
        f: common_vendor.t(comment.user.province),
        g: common_vendor.o(($event) => $options.startReply(commentIndex, comment.user.nickname, comment._id, comment.userId), commentIndex),
        h: comment.replies.length > 0
      }, comment.replies.length > 0 ? {
        i: common_vendor.f(comment.replies, (reply, replyIndex, i1) => {
          return common_vendor.e({
            a: $options.getImageUrl(reply.user.avatar),
            b: $options.getImageKey(reply.user.avatar),
            c: common_vendor.t(reply.user.nickname),
            d: comment._id !== reply.replyCommentId && reply._id !== reply.replyCommentId
          }, comment._id !== reply.replyCommentId && reply._id !== reply.replyCommentId ? {} : {}, {
            e: comment._id !== reply.replyCommentId && reply._id !== reply.replyCommentId
          }, comment._id !== reply.replyCommentId && reply._id !== reply.replyCommentId ? {
            f: common_vendor.t(reply.replyUser.nickname)
          } : {}, {
            g: common_vendor.t(reply.text),
            h: common_vendor.t($options.formatTimestamp(reply.date)),
            i: common_vendor.t(reply.user.province),
            j: common_vendor.o(($event) => $options.startReply(commentIndex, reply.user.nickname, comment._id, reply.userId, reply._id), replyIndex),
            k: replyIndex
          });
        })
      } : {}, {
        j: commentIndex
      });
    }),
    d: common_vendor.o(() => {
    }),
    e: common_vendor.o(() => {
    }),
    f: $data.placeholderText,
    g: common_vendor.o([($event) => $data.commentText = $event.detail.value, (...args) => $options.handleInputChange && $options.handleInputChange(...args)]),
    h: $data.commentText,
    i: common_vendor.t($data.replying ? "提交回复" : "提交评论"),
    j: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args)),
    k: $props.isVisible ? 1 : "",
    l: common_vendor.o((...args) => $options.handleTouchmove && $options.handleTouchmove(...args)),
    m: common_vendor.o((...args) => $options.handleTouchstart && $options.handleTouchstart(...args)),
    n: common_vendor.o((...args) => $options.handleTouchend && $options.handleTouchend(...args)),
    o: common_vendor.p({
      name: "slide"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
