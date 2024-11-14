"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  props: {
    activityId: {
      type: String,
      required: true
    },
    isShow: {
      type: Boolean,
      required: true
    },
    currentName: {
      type: String,
      required: true
    },
    isaudit: {
      type: Boolean,
      required: true
    }
  },
  data() {
  },
  computed: {
    // 根据 isShow 属性决定是否显示上传悬浮窗
    isShowUpload() {
      return this.isShow;
    }
  },
  methods: {
    chooseExcel() {
      common_vendor.index.showModal({
        content: "是否在聊天中获取文件",
        success: (e) => {
          if (e.confirm) {
            if (this.isaudit === false) {
              return common_vendor.index.showToast({
                title: "该活动未审核，无法导入",
                duration: 3e3,
                icon: "none"
              });
            } else {
              common_vendor.index.chooseMessageFile({
                count: 1,
                type: "file",
                success: (res) => {
                  const filePath = res.tempFiles[0].path;
                  const fileType = res.tempFiles[0].name.toLowerCase();
                  if (!fileType.endsWith(".xlsx") && !fileType.endsWith(
                    ".xls"
                  )) {
                    common_vendor.index.showToast({
                      title: "请选择.xlsx或.xls文件",
                      icon: "none",
                      duration: 2e3
                    });
                    return;
                  }
                  this.uploadExcel(filePath);
                },
                fail: (err) => {
                  console.error("chooseExcel fail", err);
                }
              });
            }
          }
        }
      });
    },
    uploadExcel(filePath) {
      common_vendor.index.showLoading({
        title: "上传中"
      });
      common_vendor.index.uploadFile({
        url: common_vendor.index.uploadURL + "/api/Curriculum/uploadActivity",
        // 上传接口的URL
        filePath,
        name: "file",
        formData: {
          "user": "test"
        },
        success: (res) => {
          const data = JSON.parse(res.data);
          common_vendor.index.showToast({
            title: "该活动未审核，无法导入",
            duration: 3e3,
            icon: "none"
          });
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: data.msg + "，数据预览中，点击右下角按钮存储",
            icon: "none",
            duration: 5e3
          });
          this.$emit("upload-success", data);
          this.userData = data.data;
        },
        fail: (err) => {
          console.error("uploadExcel fail", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showModal({
            content: err.errMsg,
            showCancel: false
          });
        }
      });
    },
    branchActivity() {
      common_vendor.index.showModal({
        content: "您确定要导入" + this.currentName + "活动的报名数据?",
        success: (e) => {
          if (e.confirm) {
            common_vendor.index.$http.post("/api/itVolunteer/branchVolunteers", {
              activityId: this.activityId,
              volunteers: this.userData
            }).then((res) => {
              console.log(res);
              this.$emit("upload-branchSuccess", res.data);
              common_vendor.index.showToast({
                icon: "none",
                title: res.data.message
              });
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.isShowUpload
  }, $options.isShowUpload ? {
    b: common_vendor.o((...args) => $options.chooseExcel && $options.chooseExcel(...args)),
    c: common_assets._imports_0$7,
    d: common_vendor.o((...args) => _ctx.handleClick && _ctx.handleClick(...args))
  } : {
    e: common_assets._imports_1$7,
    f: common_vendor.o(($event) => $options.branchActivity())
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d87e95f2"]]);
wx.createComponent(Component);
