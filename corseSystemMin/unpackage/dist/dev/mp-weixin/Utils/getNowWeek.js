"use strict";
function getNowWeek(startDate, totalWeek) {
  const nowDate = (/* @__PURE__ */ new Date()).getTime();
  startDate = new Date(startDate);
  if (isNaN(startDate.getTime())) {
    throw new Error("Invalid start date");
  }
  if (!Number.isInteger(totalWeek) || totalWeek <= 0) {
    throw new Error("Total weeks must be a positive integer");
  }
  const timeDiff = nowDate - startDate.getTime();
  if (timeDiff < 0) {
    return 1;
  }
  let nowWeek = Math.ceil(timeDiff / 1e3 / 60 / 60 / 24 / 7);
  if (nowWeek > totalWeek) {
    nowWeek = 1;
  }
  return nowWeek;
}
exports.getNowWeek = getNowWeek;
