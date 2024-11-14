"use strict";
const myfun = {
  //首页时间转化
  dateTime(e) {
    let old = new Date(e);
    let now = /* @__PURE__ */ new Date();
    old.getTime();
    let h = old.getHours();
    let m = old.getMinutes();
    let Y = old.getFullYear();
    let M = old.getMonth() + 1;
    let D = old.getDate();
    now.getTime();
    now.getHours();
    now.getMinutes();
    let nY = now.getFullYear();
    let nM = now.getMonth() + 1;
    let nD = now.getDate();
    if (D === nD && M === nM && Y === nY) {
      if (h < 10) {
        h = "0" + h;
      }
      if (m < 10) {
        m = "0" + m;
      }
      return h + ":" + m;
    }
    if (D + 1 === nD && M === nM && Y === nY) {
      if (h < 10) {
        h = "0" + h;
      }
      if (m < 10) {
        m = "0" + m;
      }
      return "昨天 " + h + ":" + m;
    } else {
      return Y + "/" + M + "/" + D;
    }
  },
  //间隔时间差
  spaceTime(old, now) {
    old = new Date(old);
    now = new Date(now);
    var told = old.getTime();
    var tnow = now.getTime();
    if (told > tnow + 1e3 * 60 * 5) {
      return now;
    } else {
      return "";
    }
  }
};
exports.myfun = myfun;
