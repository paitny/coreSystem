"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      baseURL: "",
      photo: "",
      user: "",
      nickName: "",
      phone: "",
      number: 2,
      flag: false,
      random: ""
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  onLoad() {
    this.baseURL = common_vendor.index.baseURL;
    this.getUserInfo();
  },
  watch: {
    userInfo() {
      this.random = `?_=${Date.now()}`;
    }
  },
  methods: {
    getImageUrl(imgurl) {
      return this.baseURL + imgurl + "?timestamp=" + Date.now();
    },
    saveinfo() {
      common_vendor.index.$http.post("/api/modify/userInfo", { id: this.userInfo._id, nickName: this.nickName, phone: this.phone });
      common_vendor.index.showToast({
        title: "修改成功",
        icon: "success",
        duration: 800
      });
    },
    getUserInfo() {
      common_vendor.index.$http.get("/api/get/userId", { id: this.userInfo._id }).then((res) => {
        this.photo = this.getImageUrl(res.data.data.photo);
        this.nickName = res.data.data.nickName;
        this.phone = res.data.data.phone;
      });
    },
    uploadImage() {
      common_vendor.index.chooseImage({
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          common_vendor.index.uploadFile({
            url: "https://wypty.cn/api/modify/photo",
            //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: "file",
            header: {
              "content-type": "multipart/form-data",
              authorization: "Bearer " + common_vendor.index.getStorageSync("token"),
              id: common_vendor.index.getStorageSync("userInfo")._id
            },
            success: (res) => {
              this.photo = "";
              this.photo = data;
              this.userInfo.photo = data.data;
              let _userInfo = common_vendor.index.getStorageSync("userInfo");
              _userInfo.photo = data.data;
              common_vendor.index.setStorageSync("userInfo", _userInfo);
              this.getUserInfo();
            }
          });
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: `url(${$options.getImageUrl(_ctx.userInfo.photo)})`,
    b: common_vendor.p({
      type: "right",
      size: "20"
    }),
    c: common_vendor.o((...args) => $options.uploadImage && $options.uploadImage(...args)),
    d: common_vendor.o([($event) => $data.nickName = $event.detail.value, (...args) => _ctx.onName && _ctx.onName(...args)]),
    e: $data.nickName,
    f: common_vendor.p({
      type: "right",
      size: "20"
    }),
    g: $data.phone,
    h: common_vendor.o(($event) => $data.phone = $event.detail.value),
    i: common_vendor.p({
      type: "right",
      size: "20"
    }),
    j: common_vendor.o((...args) => $options.saveinfo && $options.saveinfo(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
