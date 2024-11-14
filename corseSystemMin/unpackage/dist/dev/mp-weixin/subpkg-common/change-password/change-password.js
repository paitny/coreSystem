"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      isPasswordValid: false,
      isFormValid: false
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  watch: {
    newPassword: function() {
      this.validatePassword();
      this.validateForm();
    },
    confirmNewPassword: function() {
      this.validateForm();
    }
  },
  methods: {
    ...common_vendor.mapMutations(["loginOut"]),
    validatePassword() {
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
      this.isPasswordValid = passwordRegex.test(this.newPassword);
    },
    validateForm() {
      this.isFormValid = this.isPasswordValid && this.currentPassword !== "" && this.newPassword !== "" && this.confirmNewPassword !== "" && this.newPassword.trim() === this.confirmNewPassword.trim();
    },
    removeStore() {
      common_vendor.index.removeStorage({
        key: "userinfo",
        // 要清除的数据的键名
        success: () => {
          console.log("数据清除成功");
        },
        fail: (err) => {
          console.log("数据清除失败", err);
        }
      });
      common_vendor.index.removeStorage({
        key: "token",
        // 要清除的数据的键名
        success: () => {
          console.log("数据清除成功");
        },
        fail: (err) => {
          console.log("数据清除失败", err);
        }
      });
    },
    toLogout() {
      common_vendor.index.showModal({
        content: "确定要修改密码吗?",
        success: (e) => {
          if (e.confirm) {
            this.changePassword();
            setTimeout(() => {
              this.loginOut();
              this.removeStore();
              common_vendor.index.switchTab({
                url: "/pages/me/me"
              });
            }, 200);
          }
        }
      });
    },
    async changePassword() {
      if (!this.isFormValid) {
        common_vendor.index.showToast({
          title: "请填写有效的密码信息",
          icon: "none"
        });
        return;
      }
      common_vendor.index.$http.post("/api/modify/change-password", {
        userId: this.userInfo._id,
        currentPassword: this.currentPassword,
        newPassword: this.newPassword
      }).then((res) => {
        if (res.statusCode === 200) {
          common_vendor.index.showToast({
            title: "密码修改成功,请重新登录",
            icon: "none",
            duration: 1500
          });
        } else {
          common_vendor.index.showToast({
            title: res.data.message,
            icon: "none"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.currentPassword,
    b: common_vendor.o(($event) => $data.currentPassword = $event.detail.value),
    c: $data.newPassword,
    d: common_vendor.o(($event) => $data.newPassword = $event.detail.value),
    e: $data.confirmNewPassword,
    f: common_vendor.o(($event) => $data.confirmNewPassword = $event.detail.value),
    g: common_vendor.o((...args) => $options.toLogout && $options.toLogout(...args)),
    h: !$data.isFormValid
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5aa2aa4e"]]);
wx.createPage(MiniProgramPage);
