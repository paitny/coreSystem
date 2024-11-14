"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    activityId: {
      type: String,
      required: true
    },
    activityTitle: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    showDialog: {
      type: Boolean,
      required: true
    },
    closeDialog: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      bufferImg: "",
      errorMessage: "",
      loading: false,
      isLoading: false
    };
  },
  mounted() {
  },
  methods: {
    async generateQRCode(id) {
      this.isLoading = true;
      this.loading = true;
      this.errorMessage = "";
      try {
        const response = await common_vendor.index.$http.post("/api/itVolunteer/generateQRCode", {
          activityId: this.activityId || id,
          userId: this.userId
        });
        if (response.data.code === 0) {
          this.bufferImg = response.data.data;
        } else {
          this.errorMessage = response.data.msg;
        }
      } catch (error) {
        this.errorMessage = "生成二维码失败";
      } finally {
        this.loading = false;
        this.isLoading = false;
      }
    },
    previewQRCode(id) {
      this.bufferImg = "";
      this.generateQRCode(id);
      this.closeDialog();
    },
    previewQ() {
      common_vendor.index.previewImage({
        urls: [this.bufferImg],
        current: this.bufferImg
      });
    },
    downloadQRCode() {
      common_vendor.index.saveImageToPhotosAlbum({
        filePath: this.bufferImg,
        // 图片路径
        success: () => {
          common_vendor.index.showToast({
            title: "下载成功",
            icon: "success"
          });
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "下载失败",
            icon: "none"
          });
        }
      });
    },
    shareQRCode() {
      common_vendor.index.share({
        title: "分享二维码",
        imageUrl: this.bufferImg,
        success: () => {
          common_vendor.index.showToast({
            title: "分享成功",
            icon: "success"
          });
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "分享失败",
            icon: "none"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.showDialog
  }, $props.showDialog ? common_vendor.e({
    b: common_vendor.o((...args) => $props.closeDialog && $props.closeDialog(...args)),
    c: $data.isLoading
  }, $data.isLoading ? {} : {}, {
    d: $data.bufferImg && !$data.isLoading
  }, $data.bufferImg && !$data.isLoading ? {
    e: common_vendor.t($props.activityTitle)
  } : {}, {
    f: $data.bufferImg && !$data.isLoading
  }, $data.bufferImg && !$data.isLoading ? {
    g: $data.bufferImg,
    h: common_vendor.o((...args) => $options.previewQ && $options.previewQ(...args))
  } : {}, {
    i: $data.errorMessage
  }, $data.errorMessage ? {
    j: common_vendor.t($data.errorMessage),
    k: common_vendor.o((...args) => $options.generateQRCode && $options.generateQRCode(...args))
  } : {}, {
    l: common_vendor.o((...args) => $options.generateQRCode && $options.generateQRCode(...args)),
    m: !$data.isLoading
  }, !$data.isLoading ? {
    n: common_vendor.o((...args) => $options.previewQ && $options.previewQ(...args))
  } : {}, {
    o: common_vendor.o(() => {
    }),
    p: common_vendor.o((...args) => $props.closeDialog && $props.closeDialog(...args))
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c71dff12"]]);
wx.createComponent(Component);
