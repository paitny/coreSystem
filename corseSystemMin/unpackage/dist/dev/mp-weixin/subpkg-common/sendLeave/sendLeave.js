"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      leaveType: "",
      // 留言类型
      leaveContent: "",
      // 留言内容
      photoUrls: [],
      // 图片的URL
      uploadedImages: [],
      photoUploadSecond: []
      //第二次上传
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  methods: {
    choosePhoto() {
      if (this.photoUrls.length >= 3) {
        return common_vendor.index.showToast({
          icon: "none",
          title: "只能添加三张图片哦"
        });
      }
      common_vendor.index.chooseImage({
        count: 3 - this.photoUrls.length,
        // 最多可选取的剩余照片数量
        sourceType: ["camera", "album"],
        // 同时支持相机和相册
        success: (res) => {
          if (this.uploadedImages.length > 0) {
            this.photoUrls.push(...res.tempFilePaths);
            this.photoUploadSecond.push(...res.tempFilePaths);
            this.upLoadImage();
          } else if (this.uploadedImages.length === 0) {
            this.photoUrls.push(...res.tempFilePaths);
            this.upLoadImage();
          }
        }
      });
    },
    removePhoto(index) {
      common_vendor.index.$http.delete("/api/trends/delete", {
        imageURL: this.uploadedImages[index].filename
      }).then((res) => {
        this.uploadedImages.splice(index, 1);
        this.photoUrls.splice(index, 1);
        common_vendor.index.showToast({
          icon: "none",
          title: res.data.data.msg,
          duration: 1500
        });
      });
    },
    submitInfo() {
      common_vendor.index.showModal({
        content: "您确定要发布此动态！",
        success: (e) => {
          if (e.confirm) {
            this.submitLeave();
          }
        }
      });
    },
    async submitLeave() {
      if (this.leaveType.trim() === "") {
        return common_vendor.index.showToast({
          icon: "none",
          title: "请输入留言类型"
        });
      } else if (this.leaveContent.trim() === "") {
        return common_vendor.index.showToast({
          icon: "none",
          title: "请输入留言内容"
        });
      } else if (this.photoUrls.length === 0) {
        return common_vendor.index.showToast({
          icon: "none",
          title: "请上传照片"
        });
      }
      this.leaveSubmit();
    },
    async upLoadImage() {
      if (this.uploadedImages.length === 0) {
        await this.photoUrls.forEach((item) => {
          common_vendor.index.uploadFile({
            url: common_vendor.index.uploadURL + "/api/trends/uploadImages",
            filePath: item,
            name: "file",
            formData: {},
            header: {
              "content-type": "multipart/form-data"
            },
            success: (uploadFileRes) => {
              const images = JSON.parse(uploadFileRes.data);
              this.uploadedImages.push(images.data[0]);
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
            url: common_vendor.index.uploadURL + "/api/trends/uploadImages",
            filePath: item,
            name: "file",
            formData: {},
            header: {
              "content-type": "multipart/form-data"
            },
            success: (uploadFileRes) => {
              const images = JSON.parse(uploadFileRes.data);
              this.uploadedImages.push(images.data[0]);
              this.photoUploadSecond = [];
              common_vendor.index.showToast({
                title: "图片上传成功",
                icon: "none"
              });
            }
          });
        });
      }
    },
    leaveSubmit() {
      common_vendor.index.$http.post("/api/trends/submitLeave", {
        publisherId: this.userInfo._id,
        leaveType: this.leaveType,
        leaveContent: this.leaveContent,
        imgArr: this.uploadedImages
      }).then(() => {
        this.leaveType = "", this.leaveContent = "";
        this.photoUrls = [];
        this.uploadedImages = [];
        common_vendor.index.switchTab({
          url: "/pages/leave/leave"
        });
        common_vendor.index.showToast({
          icon: "none",
          title: "发表成功，等待管理员审核"
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.leaveType,
    b: common_vendor.o(($event) => $data.leaveType = $event.detail.value),
    c: $data.leaveContent,
    d: common_vendor.o(($event) => $data.leaveContent = $event.detail.value),
    e: common_vendor.o((...args) => $options.choosePhoto && $options.choosePhoto(...args)),
    f: $data.photoUrls.length > 0
  }, $data.photoUrls.length > 0 ? {
    g: common_vendor.f($data.photoUrls, (url, index, i0) => {
      return {
        a: url,
        b: common_vendor.o(($event) => $options.removePhoto(index), index),
        c: index
      };
    })
  } : {}, {
    h: common_vendor.o((...args) => $options.submitInfo && $options.submitInfo(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
