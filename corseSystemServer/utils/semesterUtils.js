// semesterUtils.js

function getCurrentSemester() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 月份是从0开始计数的，所以需要加1

    let semester;

    if (currentMonth >= 7 && currentMonth <= 12) {
        semester = `${currentYear}-${currentYear + 1}学年度第一学期`;
    } else {
        semester = `${currentYear - 1}-${currentYear}学年度第二学期`;
    }

    return semester;
}

// 导出函数以便在其他文件中使用
module.exports = getCurrentSemester;
