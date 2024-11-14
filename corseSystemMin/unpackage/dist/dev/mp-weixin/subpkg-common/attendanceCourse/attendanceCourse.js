"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const AttendanceItem = () => "../../components/AttendanceItem/AttendanceItem.js";
const _sfc_main = {
  components: {
    AttendanceItem
  },
  data() {
    return {
      course: {},
      feedback: {
        grade: "",
        class: "",
        level: "",
        week: "",
        weekday: "",
        shouldAttend: 0,
        actualAttend: 0,
        absent: 0,
        leave: 0,
        checker: "",
        switchValue: "",
        remarks: ""
      },
      baseURL: "",
      photoUrl: "",
      // 存放选择照片后的预览 URL
      photoBase64: "",
      // 存放照片的 base64 数据（可选）
      isPopupVisible: false,
      results: [],
      leaveCount: 0,
      absentCount: 0,
      forweek: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      searchKeyword: "",
      // 搜索关键词
      canvasWidth: 0,
      canvasHeight: 0,
      maxWidth: 0,
      maxHeight: 0,
      originalWidth: 0,
      // 原始图片的宽度
      originalHeight: 0,
      // 原始图片的高度
      watermarkImageUrl: "https://wypty.cn/static/file/material/watermark.png",
      jsonData: {
        idCarImageFront: "",
        idCarImageOpposite: ""
      },
      previewImage: "",
      // 预览图片的路径
      watermarkedImageUrls: []
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"]),
    // 根据搜索关键词过滤显示的学生数据
    filteredResults() {
      if (!this.searchKeyword.trim()) {
        return this.results;
      }
      const keyword = this.searchKeyword.trim().toLowerCase();
      return this.results.filter(
        (user) => user.name.toLowerCase().includes(keyword)
      );
    }
  },
  onLoad(options) {
    common_vendor.index.getSystemInfo({
      success: (res) => {
        this.maxWidth = res.windowWidth * 0.9;
        this.maxHeight = res.windowHeight * 0.9;
      }
    });
    this.baseURL = common_vendor.index.baseURL;
    const results = JSON.parse(options.results);
    this.feedback.grade = options.grade;
    this.feedback.class = options.class;
    this.feedback.level = options.level;
    this.feedback.checker = this.userInfo.name;
    this.feedback.week = options.week;
    this.feedback.weekday = options.weekday;
    this.course = JSON.parse(decodeURIComponent(options.course));
    this.feedback.switchValue = JSON.parse(options.isProvide);
    this.watermarkedImageUrls = JSON.parse(options.photo);
    if (results.length > 0) {
      this.feedback.shouldAttend = results.length;
      this.results = results;
      this.leaveCount = results.filter((user) => user.status === "leave").length;
      this.absentCount = results.filter((user) => user.status === "absent").length;
      this.feedback.leave = this.leaveCount;
      this.feedback.absent = this.absentCount;
      this.feedback.actualAttend = this.feedback.shouldAttend - this.leaveCount - this.absentCount;
    } else {
      this.photoUrl = "";
      this.getClassCount();
    }
  },
  methods: {
    onSwitchChange(e) {
      this.feedback.switchValue = e.detail.value;
    },
    clickImg(index, imageUrls) {
      const urls = [];
      for (const name of imageUrls) {
        urls.push(this.baseURL + name);
      }
      common_vendor.index.previewImage({
        urls,
        // 图片的URL数组
        current: index
        // 当前显示图片的索引
      });
    },
    previewImageFunc() {
      common_vendor.index.previewImage({
        urls: [this.previewImage]
        // 要预览的图片路径列表
      });
    },
    chooseAndAddWatermark() {
      let that = this;
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        // 保留 'original' 以保持最高质量
        sourceType: ["camera"],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          common_vendor.index.getImageInfo({
            src: tempFilePath,
            success: (image) => {
              this.originalWidth = image.width;
              this.originalHeight = image.height;
              this.canvasWidth = this.originalWidth;
              this.canvasHeight = this.originalHeight;
              common_vendor.index.showLoading({
                title: "图片处理中..."
              });
              setTimeout(() => {
                let ctx = common_vendor.index.createCanvasContext("myCanvas", this);
                ctx.drawImage(
                  tempFilePath,
                  0,
                  0,
                  this.canvasWidth,
                  this.canvasHeight
                );
                const timestamp = "北京时间" + this.getCurrentFormattedTime();
                ctx.setFillStyle("white");
                ctx.setFontSize(50);
                const textWidth = ctx.measureText(timestamp).width;
                const textX = (this.canvasWidth - textWidth) / 2;
                const textY = this.canvasHeight - 30;
                ctx.fillText(timestamp, textX, textY);
                common_vendor.index.downloadFile({
                  url: this.watermarkImageUrl,
                  success: (downloadRes) => {
                    if (downloadRes.statusCode === 200) {
                      ctx.drawImage(
                        downloadRes.tempFilePath,
                        20,
                        20,
                        200,
                        200
                      );
                      const userInfoText = this.userInfo.position + this.userInfo.name;
                      const userInfoTextWidth = ctx.measureText(userInfoText).width;
                      const userInfoTextX = (this.canvasWidth - userInfoTextWidth) / 2;
                      const userInfoTextY = textY - 80;
                      ctx.setFontSize(
                        50
                      );
                      ctx.setFillStyle("white");
                      ctx.fillText(
                        userInfoText,
                        userInfoTextX,
                        userInfoTextY
                      );
                      ctx.draw(false, () => {
                        common_vendor.index.canvasToTempFilePath({
                          canvasId: "myCanvas",
                          destWidth: this.originalWidth,
                          // 使用原始图片的宽度
                          destHeight: this.originalHeight,
                          // 使用原始图片的高度
                          fileType: "png",
                          quality: 1,
                          // 设置图片质量为最高
                          success: (res2) => {
                            that.previewImage = res2.tempFilePath;
                            that.uploadImage(
                              res2.tempFilePath
                            );
                          },
                          fail: (err) => {
                            console.error(
                              "Failed to save canvas image:",
                              err
                            );
                            common_vendor.index.hideLoading();
                          }
                        });
                      });
                    } else {
                      console.error(
                        "Failed to download watermark image:",
                        downloadRes
                      );
                      common_vendor.index.hideLoading();
                    }
                  },
                  fail: (err) => {
                    console.error(
                      "Failed to download image:",
                      err
                    );
                    common_vendor.index.hideLoading();
                  }
                });
              }, 500);
            },
            fail: (err) => {
              console.error("Failed to get image info:", err);
            }
          });
        },
        fail: (err) => {
          console.error("Failed to choose image:", err);
        }
      });
    },
    uploadImage(filePath) {
      common_vendor.index.showLoading({
        title: "正在上传中..."
      });
      common_vendor.index.uploadFile({
        url: common_vendor.index.uploadURL + "/api/aiCourse/cover",
        // 替换为你的服务器上传地址
        filePath,
        name: "file",
        formData: {
          user: "test"
        },
        success: (uploadRes) => {
          if (uploadRes.statusCode === 200) {
            this.jsonData.idCarImageFront = JSON.parse(uploadRes.data).url;
            this.photoUrl = JSON.parse(uploadRes.data).url;
            if (this.watermarkedImageUrls.length >= 3) {
              return common_vendor.index.showToast({
                title: "上传失败最多添加三张哟",
                icon: "none"
              });
            } else {
              this.watermarkedImageUrls.push(JSON.parse(uploadRes.data).url);
              common_vendor.index.showToast({
                title: "上传成功",
                icon: "success"
              });
            }
          } else {
            common_vendor.index.showToast({
              title: "上传失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          console.error("Upload failed:", err);
          common_vendor.index.showToast({
            title: "上传失败",
            icon: "none"
          });
        },
        complete: () => {
          common_vendor.index.hideLoading();
        }
      });
    },
    getCurrentFormattedTime() {
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    hidePopup() {
      this.isPopupVisible = !this.isPopupVisible;
    },
    getClassCount() {
      common_vendor.index.$http.get("/api/get/searchClassUser", {
        userId: this.userInfo._id,
        grade: this.feedback.grade,
        class: this.feedback.class,
        levels: this.feedback.level
      }).then((res) => {
        this.feedback.shouldAttend = res.data.data.total;
        this.feedback.actualAttend = res.data.data.total;
        this.results = res.data.data.list;
      }).catch((error) => {
        console.error(error);
      });
    },
    updateCounts(user, newStatus) {
      const currentStatus = user.status;
      switch (currentStatus) {
        case "leave":
          this.leaveCount--;
          break;
        case "absent":
          this.absentCount--;
          break;
      }
      user.status = newStatus;
      switch (newStatus) {
        case "leave":
          this.leaveCount++;
          break;
        case "absent":
          this.absentCount++;
          break;
      }
      this.feedback.leave = this.leaveCount;
      this.feedback.absent = this.absentCount;
      this.feedback.actualAttend = this.feedback.shouldAttend - this.leaveCount - this.absentCount;
    },
    removeImage(index) {
      this.watermarkedImageUrls.splice(index, 1);
    },
    submitFeedback() {
      common_vendor.index.showModal({
        title: "提示",
        content: `您确定要提交 ${this.feedback.grade}${this.feedback.class}${this.feedback.level} 的考勤数据嘛？`,
        success: (res) => {
          if (res.confirm) {
            if (this.watermarkedImageUrls.length === 0) {
              return common_vendor.index.showToast({
                icon: "error",
                title: "请上传查课照片"
              });
            } else {
              const feedbackData = {
                userId: this.userInfo._id,
                course: this.course,
                week: this.feedback.week,
                weekday: this.feedback.weekday,
                grade: this.feedback.grade,
                class: this.feedback.class,
                level: this.feedback.level,
                shouldAttend: this.feedback.shouldAttend,
                actualAttend: this.feedback.actualAttend,
                absent: this.feedback.absent,
                leave: this.feedback.leave,
                checker: this.feedback.checker,
                isProvide: this.feedback.switchValue,
                remarks: this.feedback.remarks,
                results: this.results,
                photo: this.watermarkedImageUrls
                // 添加图片URL
              };
              common_vendor.index.$http.post("/api/aiCourse/courseFeedback", {
                feedbackData
              }).then((res2) => {
                common_vendor.index.showToast({
                  title: res2.data.message,
                  icon: "success"
                });
              }).catch((error) => {
                console.error(error);
              });
            }
          }
        }
      });
    },
    clearSearch() {
      this.searchKeyword = "";
    }
  }
};
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _component_attendance_item = common_vendor.resolveComponent("attendance-item");
  (_easycom_uni_search_bar2 + _component_attendance_item)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
if (!Math) {
  _easycom_uni_search_bar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.course.name),
    b: common_vendor.t($data.feedback.week),
    c: common_vendor.t($data.forweek[$data.feedback.weekday]),
    d: common_vendor.t($data.course.num),
    e: common_vendor.t($data.course.rawSection),
    f: common_vendor.t($data.course.address),
    g: common_vendor.t($data.feedback.grade + $data.feedback.class + $data.feedback.level),
    h: common_vendor.t($data.feedback.shouldAttend),
    i: common_vendor.t($data.feedback.actualAttend),
    j: common_vendor.t($data.feedback.absent),
    k: common_vendor.t($data.feedback.leave),
    l: common_vendor.t($data.feedback.checker),
    m: common_vendor.o((...args) => $options.onSwitchChange && $options.onSwitchChange(...args)),
    n: $data.feedback.switchValue,
    o: common_vendor.o((...args) => $options.chooseAndAddWatermark && $options.chooseAndAddWatermark(...args)),
    p: common_vendor.f($data.watermarkedImageUrls, (item, index, i0) => {
      return {
        a: $data.baseURL + item,
        b: common_vendor.o(($event) => $options.clickImg(index, $data.watermarkedImageUrls), index),
        c: common_vendor.o(($event) => $options.removeImage(index), index),
        d: index
      };
    }),
    q: $data.canvasWidth + "px",
    r: $data.canvasHeight + "px",
    s: common_vendor.o((...args) => $options.previewImageFunc && $options.previewImageFunc(...args)),
    t: $data.feedback.remarks,
    v: common_vendor.o(($event) => $data.feedback.remarks = $event.detail.value),
    w: common_vendor.o((...args) => $options.submitFeedback && $options.submitFeedback(...args)),
    x: $data.isPopupVisible
  }, $data.isPopupVisible ? {
    y: common_vendor.o(($event) => $data.searchKeyword = $event),
    z: common_vendor.p({
      radius: 5,
      bgColor: "#F7F7F7",
      cancelButton: "none",
      placeholder: "输入学生姓名",
      modelValue: $data.searchKeyword
    }),
    A: common_vendor.f($options.filteredResults, (user, k0, i0) => {
      return {
        a: user._id,
        b: common_vendor.o($options.updateCounts, user._id),
        c: "25e549f1-1-" + i0,
        d: common_vendor.p({
          user,
          remarks: $data.feedback.remarks
        })
      };
    }),
    B: common_vendor.o((...args) => $options.hidePopup && $options.hidePopup(...args)),
    C: common_vendor.o(() => {
    }),
    D: common_vendor.o(($event) => $options.hidePopup())
  } : {}, {
    E: common_assets._imports_0$6,
    F: common_vendor.o(($event) => $options.hidePopup())
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-25e549f1"]]);
wx.createPage(MiniProgramPage);
