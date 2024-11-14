"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      loginForm: {
        user: "",
        //手机号码
        pass: "",
        //密码
        province: ""
      },
      placeholderUser: "请输入学号",
      placeholderPass: "初始密码为学号后六位",
      showPassword: true,
      //是否显示密码
      showClearIcon: false,
      //是否显示清除按钮
      showBox: true,
      type: 2,
      //登录的状态 - - - 1是注册用户、2是密码登录
      isChecked: false
      // 勾选按钮状态
    };
  },
  computed: {
    ...common_vendor.mapState(["userInfo"])
  },
  onLoad(options) {
    this.type = options.type;
    this.getProvince();
  },
  methods: {
    handleChange(e) {
      if (e.detail.value.length > 0) {
        this.isChecked = true;
      } else {
        this.isChecked = false;
      }
    },
    handleUserAgrement() {
      common_vendor.wx$1.downloadFile({
        url: "https://wypty.cn/static/file/userAgreement/userAgree.pdf ",
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
    handlePrivacy() {
      common_vendor.wx$1.downloadFile({
        url: "https://wypty.cn/static/file/userAgreement/privacy.pdf ",
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
    // 切换登录的方式
    setLoginType(type) {
      this.type = type;
      if (type === 1) {
        this.placeholderUser = "请输入学号或手机号";
        this.placeholderPass = "必须包含数字英文符号";
      } else {
        this.placeholderUser = "请输入学号";
        this.placeholderPass = "初始密码为学号后六位";
      }
    },
    // 判断是否显示清除按钮
    clearInput: function(event) {
      this.loginForm.user = event.detail.value;
      if (event.detail.value.length > 0) {
        this.showClearIcon = true;
        this.showBox = false;
      } else {
        this.showClearIcon = false;
        this.showBox = true;
      }
    },
    // 清除内容/隐藏按钮
    clearIcon: function() {
      this.loginForm.user = "";
      this.showClearIcon = false;
      this.showBox = true;
    },
    // 显示隐藏密码
    changePassword() {
      this.showPassword = !this.showPassword;
    },
    getProvince(ip) {
      common_vendor.index.$http.get("/api/get/province", {
        ip
      }).then((res) => {
        this.province = res.data.data;
      });
    },
    // 密码登录
    async Login() {
      if (this.isChecked) {
        let that = this.loginForm;
        if (!that.user) {
          common_vendor.index.showToast({
            title: "请输入正确的用户名",
            icon: "none"
          });
          return false;
        }
        if (that.type == 2 && !that.pass) {
          common_vendor.index.showToast({
            title: "请输入密码",
            icon: "none"
          });
          return false;
        }
        if (that.type == 1 && !that.testValue) {
          common_vendor.index.showToast({
            title: "请输入验证码",
            icon: "none"
          });
          return false;
        }
        const {
          data
        } = await common_vendor.index.$http.post("/api/login/min", this.loginForm);
        if (data.code) {
          return common_vendor.index.showLoading({
            title: data.msg
          });
        }
        common_vendor.index.showLoading({
          title: data.msg,
          icon: "exception",
          duration: 150
        });
        common_vendor.index.setStorage({
          key: "userInfo",
          // 设置存储数据的键名
          data: data.data.doc,
          // 设置要存储的数据
          success: () => {
            console.log("数据保存成功");
          },
          fail: (err) => {
            console.log("数据保存失败", err);
          }
        });
        common_vendor.index.setStorage({
          key: "token",
          // 设置存储数据的键名
          data: data.data.token,
          // 设置要存储的数据
          success: () => {
            console.log("数据保存成功");
          },
          fail: (err) => {
            console.log("数据保存失败", err);
          }
        });
        this.loginSuccess(data.data.doc);
        var pages = getCurrentPages();
        console.log(pages);
        var prevPage = pages[pages.length - 2].route;
        console.log(prevPage);
        if (prevPage === "pages/index/index") {
          common_vendor.index.navigateBack({
            url: "pages/index/index",
            success() {
              let page = getCurrentPages().pop();
              if (page == void 0 || page == null)
                return;
              page.onLoad();
              common_vendor.index.showToast({
                duration: 1e3,
                title: "登录成功",
                icon: "success"
              });
            }
          });
        } else if (prevPage === "pages/leave/leave") {
          common_vendor.index.navigateBack({
            url: "pages/leave/leave",
            success() {
              let page = getCurrentPages().pop();
              if (page == void 0 || page == null)
                return;
              page.onLoad();
              common_vendor.index.showToast({
                duration: 1e3,
                title: "登录成功",
                icon: "success"
              });
            }
          });
        } else if (prevPage === "pages/Schedule/Schedule") {
          common_vendor.index.navigateBack({
            url: "pages/Schedule/Schedule",
            success() {
              let page = getCurrentPages().pop();
              if (page == void 0 || page == null)
                return;
              page.onLoad();
              common_vendor.index.showToast({
                duration: 1e3,
                title: "登录成功",
                icon: "success"
              });
            }
          });
        } else if (prevPage === "pagesMe/me/me") {
          common_vendor.index.navigateBack({
            url: "pagesMe/me/me",
            success() {
              let page = getCurrentPages().pop();
              if (page == void 0 || page == null)
                return;
              page.onLoad();
              common_vendor.index.showToast({
                duration: 1e3,
                title: "登录成功",
                icon: "success"
              });
            }
          });
        } else if (prevPage === "pagesHome/activity/volunteer") {
          common_vendor.index.navigateBack({
            url: "pagesHome/activity/volunteer",
            success() {
              let page = getCurrentPages().pop();
              if (page == void 0 || page == null)
                return;
              page.onLoad();
              common_vendor.index.showToast({
                duration: 1e3,
                title: "登录成功",
                icon: "success"
              });
            }
          });
        } else if (prevPage === "pagesHome/application/active") {
          common_vendor.index.navigateBack({
            url: "pagesHome/application/active",
            success() {
              let page = getCurrentPages().pop();
              if (page == void 0 || page == null)
                return;
              page.onLoad();
              common_vendor.index.showToast({
                duration: 1e3,
                title: "登录成功",
                icon: "success"
              });
            }
          });
        } else {
          common_vendor.index.navigateBack({
            url: "pagesMe/me/me",
            success() {
              let page = getCurrentPages().pop();
              if (page == void 0 || page == null)
                return;
              page.onLoad();
              common_vendor.index.showToast({
                duration: 1e3,
                title: "登录成功",
                icon: "success"
              });
            }
          });
        }
      } else {
        common_vendor.index.showToast({
          title: "请先勾选按钮",
          icon: "none"
        });
      }
    },
    ...common_vendor.mapMutations(["loginSuccess"]),
    async reg() {
      if (this.isChecked) {
        const {
          data
        } = await common_vendor.index.$http.post("/api/reg", this.loginForm);
        if (data.code) {
          return common_vendor.index.showLoading({
            title: data.msg,
            icon: "exception",
            duration: 1800
          });
        }
        common_vendor.index.showLoading({
          title: data.msg,
          icon: "exception",
          duration: 1800
        });
        this.Login();
        this.loginSuccess(data.data);
      } else {
        common_vendor.index.showToast({
          title: "请先勾选按钮",
          icon: "none"
        });
      }
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
  return common_vendor.e({
    a: $data.type == 2
  }, $data.type == 2 ? {} : {}, {
    b: $data.type == 1
  }, $data.type == 1 ? {} : {}, {
    c: $data.placeholderUser,
    d: common_vendor.o([($event) => $data.loginForm.user = $event.detail.value, (...args) => $options.clearInput && $options.clearInput(...args)]),
    e: $data.loginForm.user,
    f: $data.showClearIcon
  }, $data.showClearIcon ? {
    g: common_vendor.o($options.clearIcon),
    h: common_vendor.p({
      type: "closeempty",
      color: "#808080",
      size: "20"
    })
  } : {}, {
    i: $data.showBox
  }, $data.showBox ? {} : {}, {
    j: $data.placeholderPass,
    k: $data.showPassword,
    l: $data.loginForm.pass,
    m: common_vendor.o(($event) => $data.loginForm.pass = $event.detail.value),
    n: common_vendor.o($options.changePassword),
    o: common_vendor.p({
      type: "eye-filled",
      color: "#808080",
      size: "25"
    }),
    p: $data.type == 2
  }, $data.type == 2 ? {
    q: common_vendor.o(($event) => $options.setLoginType(1))
  } : {}, {
    r: $data.type == 1
  }, $data.type == 1 ? {
    s: common_vendor.o(($event) => $options.setLoginType(2))
  } : {}, {
    t: $data.type == 2
  }, $data.type == 2 ? {
    v: !$data.isChecked,
    w: common_vendor.o(($event) => $options.Login())
  } : {}, {
    x: $data.type == 1
  }, $data.type == 1 ? {
    y: !$data.isChecked,
    z: common_vendor.o(($event) => $options.reg())
  } : {}, {
    A: common_vendor.o((...args) => $options.handleChange && $options.handleChange(...args)),
    B: common_vendor.o((...args) => $options.handleUserAgrement && $options.handleUserAgrement(...args)),
    C: common_vendor.o((...args) => $options.handlePrivacy && $options.handlePrivacy(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2e80cbef"]]);
wx.createPage(MiniProgramPage);
