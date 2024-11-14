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
      ifShowGroup: true,
      GroupCodeUrl: [],
      GroupCode: "",
      //群码上传
      uploadedGroupCodeImages: [],
      photoUploadGroupCodeSecond: [],
      groupNum: "",
      deleteUpurl: "",
      deleteUrl: "",
      switchValue3: true,
      switchValue2: false
    };
  },
  onLoad(options) {
    this.baseURL = common_vendor.index.baseURL;
    this.aid = options.id;
    this.title = options.title;
    this.description = options.description;
    this.deadline = options.deadline;
    this.deleteUrl = options.mdUrl;
    this.photoUrls[0] = this.baseURL + options.mdUrl;
    this.GroupCodeUrl[0] = this.baseURL + options.groupCode;
    this.GroupCode = options.groupCode;
    this.groupNum = options.groupNum;
    if (this.groupNum === "暂无") {
      this.ifShowGroup = false;
    }
    this.tu = options.mdUrl;
    this.switchValue = JSON.parse(options.isSign);
    this.limitPerson = options.limitPerson;
    this.startTime = options.startTime;
    this.address = options.address, this.switchValue2 = JSON.parse(options.isCheckOut);
    this.switchValue3 = JSON.parse(options.transpire);
  },
  methods: {
    toggleSwitch() {
    },
    onSwitchChange(e) {
      this.switchValue = e.detail.value;
      this.isSign = this.switchValue;
    },
    onSwitchChange2(e) {
      this.switchValue2 = e.detail.value;
      this.isCheckOut = this.switchValue2;
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
        content: "您确定要修改此活动！",
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
                console.log(uploadFileRes);
                this.uploadedGroupCodeImages.push(images.data);
                const filePath2 = images.url;
                this.GroupCode = filePath2;
                console.log(this.GroupCode);
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
                const filePath2 = images.url;
                this.groupCode = filePath2;
                console.log(this.groupCode);
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
                const filePath2 = images.url;
                this.deleteUpurl = this.deleteUrl;
                this.tu = filePath2;
                this.deleteUrl = this.tu;
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
                this.deleteUpurl = this.deleteUrl;
                this.tu = filePath;
                this.deleteUrl = this.tu;
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
      let doc = {
        title: this.title,
        deadline: this.deadline,
        description: this.description,
        isSign: this.switchValue,
        isCheckOut: this.switchValue2,
        address: this.address,
        startTime: this.startTime,
        limitPerson: this.limitPerson,
        cover: this.tu,
        groupNum: this.groupNum,
        groupCode: this.GroupCode,
        transpire: this.switchValue3
      };
      common_vendor.index.$http.post("/api/itVolunteer/update", {
        id: this.aid,
        doc,
        mdUrl: this.deleteUpurl
      }).then((res) => {
        common_vendor.index.showToast({
          duration: 1500,
          icon: "none",
          title: res.data.msg
        });
        common_vendor.index.navigateBack();
      }).catch((error) => {
        console.error("活动修改失败", error);
        common_vendor.index.showToast({
          icon: "none",
          title: "活动修改失败"
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
