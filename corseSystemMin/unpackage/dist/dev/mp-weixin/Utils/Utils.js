"use strict";
const common_vendor = require("../common/vendor.js");
var interstitialAd = null;
let interstitial = {
  //id就是传入的广告位id
  load(id) {
    if (common_vendor.index.createInterstitialAd) {
      interstitialAd = common_vendor.index.createInterstitialAd({
        adUnitId: id
      });
      interstitialAd.onLoad(() => {
        console.log("插屏 广告加载成功");
      });
      interstitialAd.onError((err) => {
        console.log("插屏 广告加载失败", err);
      });
      interstitialAd.onClose((res) => {
        console.log("插屏 广告关闭", res);
      });
    }
  },
  show() {
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err);
      });
    }
  }
};
let videoAd = null;
let rewardedVideoAd = {
  //id就是传入的广告位id
  load(id) {
    console.log(id);
    if (common_vendor.index.createRewardedVideoAd) {
      videoAd = common_vendor.index.createRewardedVideoAd({
        adUnitId: id
      });
      videoAd.onLoad(() => {
      });
      videoAd.onError((err) => {
        console.error("激励视频光告加载失败", err);
      });
      videoAd.onClose((res) => {
      });
    }
  },
  show() {
    if (videoAd) {
      videoAd.show().catch(() => {
        videoAd.load().then(() => videoAd.show()).catch((err) => {
          console.error("激励视频 广告显示失败", err);
        });
      });
    }
  }
};
const Utils = {
  interstitial,
  rewardedVideoAd
};
exports.Utils = Utils;
