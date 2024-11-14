export function getNowWeek(startDate, totalWeek) {
  const nowDate = new Date().getTime();

  // 校验startDate是否为有效的日期
  startDate = new Date(startDate);
  if (isNaN(startDate.getTime())) {
    throw new Error("Invalid start date");
  }

  // 校验totalWeek是否为正整数
  if (!Number.isInteger(totalWeek) || totalWeek <= 0) {
    throw new Error("Total weeks must be a positive integer");
  }

  const timeDiff = nowDate - startDate.getTime();
  
  // 如果startDate大于当前日期，返回第一周（课程尚未开始）
  if (timeDiff < 0) {
    return 1;
  }

  let nowWeek = Math.ceil(timeDiff / 1000 / 60 / 60 / 24 / 7);

  // 如果当前周数超过总周数，循环返回第一周
  if (nowWeek > totalWeek) {
    nowWeek = 1;
  }

  return nowWeek;
}

export function getTomorrowWeek(startDate, totalWeek) {
  const tomorrow = new Date().getTime() + 24 * 60 * 60 * 1000; // 获取明天的时间戳
  const tomorrowStartDate = new Date(startDate);
  const time = tomorrow - tomorrowStartDate.getTime();
  let tomorrowWeek = Math.ceil(time / 1000 / 60 / 60 / 24 / 7);

  if (tomorrowWeek > totalWeek) {
    tomorrowWeek = 1;
  }

  return tomorrowWeek;
}