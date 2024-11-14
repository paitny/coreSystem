export const formatTime = (time:any) => {
  let date = new Date(time / 1),
    year = date.getFullYear(),
    month = ('0' + (date.getMonth() + 1)).slice(-2),
    day = ('0' + date.getDate()).slice(-2),
    hour = ('0' + date.getHours()).slice(-2),
    minute = ('0' + date.getMinutes()).slice(-2),
    second = ('0' + date.getSeconds()).slice(-2);
  // 2022-06-21 19:38:26
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`

}

export const formatDate = (time:any) => {
  let date = new Date(time / 1),
    year = date.getFullYear(),
    month = ('0' + (date.getMonth() + 1)).slice(-2),
    day = ('0' + date.getDate()).slice(-2),
    week = date.getDay(),
    weekTxt = '周一';

  switch (week) {
    case 0:
      weekTxt = '周日'
      break;
    case 1:
      weekTxt = '周一'
      break;
    case 2:
      weekTxt = '周二'
      break;
    case 3:
      weekTxt = '周三'
      break;
    case 4:
      weekTxt = '周四'
      break;
    case 5:
      weekTxt = '周五'
      break;
    case 6:
      weekTxt = '周六'
      break;
  }

  return `${year}-${month}-${day} ${weekTxt}`

}

export const formatDetail = (time:any) => {
  let date = new Date(time / 1),
    hour = ('0' + date.getHours()).slice(-2),
    minute = ('0' + date.getMinutes()).slice(-2),
    second = ('0' + date.getSeconds()).slice(-2);
  //  19:38:26
  return `${hour}:${minute}:${second}`
}
