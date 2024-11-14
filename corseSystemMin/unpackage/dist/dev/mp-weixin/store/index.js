"use strict";
const common_vendor = require("../common/vendor.js");
const store = common_vendor.createStore({
  state: {
    // 用户信息
    userInfo: {}
  },
  mutations: {
    // 更变用户信息
    loginSuccess(state, userInfo) {
      state.userInfo = common_vendor.index.getStorageSync("userInfo") || userInfo;
    },
    // 退出登录清除用户信息
    loginOut(state) {
      state.userInfo = {};
    }
  },
  actions: {},
  modules: {}
});
exports.store = store;
