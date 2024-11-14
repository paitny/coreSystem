"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      title: "",
      address: "",
      description: "",
      deadline: "",
      // 结束时间
      startTime: "",
      limitPerson: Number,
      showTimePicker: false,
      // 控制是否显示时间选择器
      showDatePicker: true,
      // 控制日期选择器显示与隐藏
      id: "",
      tu: "",
      baseURL: "",
      photoUrls: [],
      // 图片的URL
      uploadedImages: [],
      photoUploadSecond: [],
      //第二次上传
      switchValue: false,
      // 开关的初始状态
      isSign: false,
      // 默认状态下为false
      ifShowGroup: false,
      GroupCodeUrl: [],
      GroupCode: "",
      //群码上传
      uploadedGroupCodeImages: [],
      photoUploadGroupCodeSecond: [],
      groupNum: "",
      switchValue2: false,
      switchValue3: true
    };
  },
  onLoad() {
    this.baseURL = common_vendor.index.baseURL;
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  methods: {
    toggleSwitch() {
    },
    onSwitchChange(e) {
      this.switchValue = e.detail.value;
    },
    onSwitchChange2(e) {
      if (this.switchValue) {
        this.switchValue2 = e.detail.value;
      } else {
        this.switchValue2 = false;
        return common_vendor.index.showToast({
          icon: "error",
          title: "未设置签到"
        });
      }
    },
    onSwitchChange3(e) {
      this.switchValue3 = e.detail.value;
    },
    onGroupSwitchChange(e) {
      this.ifShowGroup = e.detail.value;
      this.GroupCode = "";
      this.GroupCodeUrl = [];
    },
    limitTitle() {
      if (this.title.length > 40) {
        this.title = this.title.substring(0, 40);
        common_vendor.index.showToast({
          title: "最多只能输入40个字符",
          icon: "none"
        });
      }
    },
    limitDescription() {
      if (this.description.length > 400) {
        this.description = this.description.substring(0, 400);
        common_vendor.index.showToast({
          title: "最多只能输入400个字符",
          icon: "none"
        });
      }
    },
    choosePhoto(type) {
      if (type === 1) {
        if (this.GroupCodeUrl.length >= 1) {
          common_vendor.index.chooseImage({
            count: 1,
            sourceType: ["camera", "album"],
            success: (res) => {
              this.GroupCodeUrl.splice(0, 1, ...res.tempFilePaths);
              this.upLoadImage(type);
            }
          });
        } else {
          common_vendor.index.chooseImage({
            count: 1,
            sourceType: ["camera", "album"],
            success: (res) => {
              this.GroupCodeUrl.push(...res.tempFilePaths);
              this.upLoadImage(type);
            }
          });
        }
      } else if (type === 2) {
        if (this.photoUrls.length >= 1) {
          common_vendor.index.chooseImage({
            count: 1,
            sourceType: ["camera", "album"],
            success: (res) => {
              this.photoUrls.splice(0, 1, ...res.tempFilePaths);
              this.upLoadImage(type);
            }
          });
        } else {
          common_vendor.index.chooseImage({
            count: 1,
            sourceType: ["camera", "album"],
            success: (res) => {
              this.photoUrls.push(...res.tempFilePaths);
              this.upLoadImage(type);
            }
          });
        }
      }
    },
    onDateTimeChange(e) {
      this.deadline = e;
    },
    checkTimeChange(e) {
      this.startTime = e;
    },
    submitInfo() {
      common_vendor.index.showModal({
        content: "您确定要发布此活动！",
        success: (e) => {
          if (e.confirm) {
            this.submitLeave();
          }
        }
      });
    },
    async submitLeave() {
      if (this.title.trim() === "") {
        return common_vendor.index.showToast({
          icon: "none",
          title: "请输入活动题目"
        });
      } else if (isNaN(this.limitPerson)) {
        return common_vendor.index.showToast({
          icon: "none",
          title: "请输入数字"
        });
      } else if (this.description.trim() === "") {
        return common_vendor.index.showToast({
          icon: "none",
          title: "请输入活动描述"
        });
      } else if (this.deadline.trim() === "") {
        return common_vendor.index.showToast({
          icon: "none",
          title: "请选择活动结束时间"
        });
      } else if (this.startTime.trim() === "") {
        return common_vendor.index.showToast({
          icon: "none",
          title: "请选择活动开始时间"
        });
      } else if (this.ifShowGroup === true) {
        if (this.groupNum === "") {
          return common_vendor.index.showToast({
            icon: "none",
            title: "请输入活动群号码"
          });
        } else if (this.GroupCode === "") {
          return common_vendor.index.showToast({
            icon: "none",
            title: "请上传群二维码"
          });
        }
      } else if (this.tu === "") {
        return common_vendor.index.showToast({
          icon: "none",
          title: "请上传活动照片"
        });
      }
      this.leaveSubmit();
    },
    async upLoadImage(type) {
      this.uploadedGroupCodeImages.length;
      if (type === 1) {
        if (this.uploadedGroupCodeImages.length === 0) {
          await this.GroupCodeUrl.forEach((item) => {
            common_vendor.index.uploadFile({
              url: common_vendor.index.uploadURL + "/api/itVolunteer/cover",
              filePath: item,
              name: "file",
              formData: {},
              header: {
                "content-type": "multipart/form-data"
              },
              success: (uploadFileRes) => {
                const images = JSON.parse(uploadFileRes.data);
                this.uploadedGroupCodeImages.push(images.data);
                const filePath = images.url;
                this.GroupCode = filePath;
                common_vendor.index.showToast({
                  title: "图片上传成功",
                  icon: "none"
                });
              }
            });
          });
        } else if (this.uploadedGroupCodeImages.length > 0) {
          await this.photoUploadGroupCodeSecond.forEach((item) => {
            common_vendor.index.uploadFile({
              url: common_vendor.index.uploadURL + "/api/itVolunteer/cover",
              filePath: item,
              name: "file",
              formData: {},
              header: {
                "content-type": "multipart/form-data"
              },
              success: (uploadFileRes) => {
                const images = JSON.parse(uploadFileRes.data);
                this.uploadedGroupCodeImages.push(images.data);
                const filePath = images.url;
                this.groupCode = filePath;
                this.photoUploadGroupCodeSecond = [];
                common_vendor.index.showToast({
                  title: "图片上传成功",
                  icon: "none"
                });
              }
            });
          });
        }
      } else if (type === 2) {
        if (this.uploadedImages.length === 0) {
          await this.photoUrls.forEach((item) => {
            common_vendor.index.uploadFile({
              url: common_vendor.index.uploadURL + "/api/itVolunteer/cover",
              filePath: item,
              name: "file",
              formData: {},
              header: {
                "content-type": "multipart/form-data"
              },
              success: (uploadFileRes) => {
                const images = JSON.parse(uploadFileRes.data);
                this.uploadedImages.push(images.data);
                const filePath = images.url;
                this.tu = filePath;
                common_vendor.index.showToast({
                  title: "图片上传成功",
                  icon: "none"
                });
              }
            });
          });
        } else if (this.uploadedImages.length > 0) {
          await this.photoUploadSecond.forEach((item) => {
            common_vendor.index.uploadFile({
              url: common_vendor.index.uploadURL + "/api/itVolunteer/cover",
              filePath: item,
              name: "file",
              formData: {},
              header: {
                "content-type": "multipart/form-data"
              },
              success: (uploadFileRes) => {
                const images = JSON.parse(uploadFileRes.data);
                this.uploadedImages.push(images.data);
                const filePath = images.url;
                this.tu = filePath;
                this.photoUploadSecond = [];
                common_vendor.index.showToast({
                  title: "图片上传成功",
                  icon: "none"
                });
              }
            });
          });
        }
      }
    },
    leaveSubmit() {
      common_vendor.index.$http.post("/api/itVolunteer/create", {
        userId: this.userInfo._id,
        title: this.title,
        description: this.description,
        deadline: this.deadline,
        cover: this.tu,
        isSign: this.switchValue,
        // 更新签到状态
        isCheckOut: this.switchValue2,
        address: this.address,
        startTime: this.startTime,
        limitPerson: this.limitPerson,
        groupCode: this.GroupCode,
        groupNum: this.groupNum,
        transpire: this.switchValue3
      }).then((res) => {
        common_vendor.index.showToast({
          icon: "none",
          title: res.data.msg
        });
        if (this.isSign === true) {
          this.sign = "true";
        } else {
          this.sign = "false";
        }
        common_vendor.index.navigateTo({
          url: "/myServices/eventRw/eventRw"
        });
        this.title = "";
        this.description = "";
        this.deadline = "";
        this.tu = "";
        this.switchValue = "";
        this.address = "";
        this.startTime = "";
        this.limitPerson = "";
        this.photoUrls = [];
      }).catch((error) => {
        console.error("活动发布失败", error);
        common_vendor.index.showToast({
          icon: "none",
          title: "活动发布失败"
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  _easycom_uni_datetime_picker2();
}
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
if (!Math) {
  _easycom_uni_datetime_picker();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o([($event) => $data.title = $event.detail.value, (...args) => $options.limitTitle && $options.limitTitle(...args)]),
    b: $data.title,
    c: common_vendor.o([($event) => $data.address = $event.detail.value, (...args) => $options.limitTitle && $options.limitTitle(...args)]),
    d: $data.address,
    e: common_vendor.o([($event) => $data.limitPerson = $event.detail.value, (...args) => $options.limitTitle && $options.limitTitle(...args)]),
    f: $data.limitPerson,
    g: common_vendor.o([($event) => $data.description = $event.detail.value, (...args) => $options.limitDescription && $options.limitDescription(...args)]),
    h: $data.description,
    i: common_vendor.o($options.onDateTimeChange),
    j: common_vendor.o(($event) => $data.deadline = $event),
    k: common_vendor.p({
      type: "datetime",
      modelValue: $data.deadline
    }),
    l: common_vendor.o($options.checkTimeChange),
    m: common_vendor.o(($event) => $data.startTime = $event),
    n: common_vendor.p({
      type: "datetime",
      modelValue: $data.startTime
    }),
    o: common_vendor.o((...args) => $options.onSwitchChange && $options.onSwitchChange(...args)),
    p: $data.switchValue,
    q: $data.switchValue
  }, $data.switchValue ? {
    r: common_vendor.o((...args) => $options.onSwitchChange2 && $options.onSwitchChange2(...args)),
    s: $data.switchValue2
  } : {}, {
    t: common_vendor.o((...args) => $options.onSwitchChange3 && $options.onSwitchChange3(...args)),
    v: $data.switchValue3,
    w: common_vendor.o((...args) => $options.onGroupSwitchChange && $options.onGroupSwitchChange(...args)),
    x: $data.ifShowGroup,
    y: $data.ifShowGroup
  }, $data.ifShowGroup ? common_vendor.e({
    z: $data.groupNum,
    A: common_vendor.o(($event) => $data.groupNum = $event.detail.value),
    B: common_vendor.o(($event) => $options.choosePhoto(1)),
    C: $data.GroupCodeUrl.length > 0
  }, $data.GroupCodeUrl.length > 0 ? {
    D: $data.GroupCodeUrl[0]
  } : {}) : {}, {
    E: common_vendor.o(($event) => $options.choosePhoto(2)),
    F: $data.photoUrls.length > 0
  }, $data.photoUrls.length > 0 ? {
    G: $data.photoUrls[0]
  } : {}, {
    H: common_vendor.o((...args) => $options.submitInfo && $options.submitInfo(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
