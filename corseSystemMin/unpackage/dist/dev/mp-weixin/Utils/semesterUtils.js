"use strict";
function getCurrentSemester() {
  const currentDate = /* @__PURE__ */ new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  let semester;
  let academicYear;
  if (currentMonth >= 9 && currentMonth <= 12) {
    semester = "第一学期";
    academicYear = `${currentYear}-${currentYear + 1}学年度`;
  } else if (currentMonth >= 1 && currentMonth <= 2) {
    semester = "第一学期";
    academicYear = `${currentYear - 1}-${currentYear}学年度`;
  } else if (currentMonth >= 3 && currentMonth <= 6) {
    semester = "第二学期";
    academicYear = `${currentYear - 1}-${currentYear}学年度`;
  } else {
    semester = "暑假/寒假";
    academicYear = `${currentYear - 1}-${currentYear}学年度`;
  }
  return `${academicYear}${semester}`;
}
exports.getCurrentSemester = getCurrentSemester;
