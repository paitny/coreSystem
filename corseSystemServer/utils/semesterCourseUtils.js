// semesterUtils.js

function semesterCourseUtils()
// 获取当前学期
{
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 月份从0开始，所以要加1

    let semester;
    let academicYear;

    if (currentMonth >= 9 && currentMonth <= 12) {
        // 9月到12月属于第一学期，学年度为当年到下一年
        semester = '第一学期';
        academicYear = `${currentYear}-${currentYear + 1}学年度`;
    } else if (currentMonth >= 1 && currentMonth <= 2) {
        // 1月到2月属于第一学期，学年度为上一年到当年
        semester = '第一学期';
        academicYear = `${currentYear - 1}-${currentYear}学年度`;
    } else if (currentMonth >= 3 && currentMonth <= 6) {
        // 3月到6月属于第二学期，学年度为上一年到当年
        semester = '第二学期';
        academicYear = `${currentYear - 1}-${currentYear}学年度`;
    } else {
        // 7月和8月通常是暑假
        semester = '暑假/寒假';
        academicYear = `${currentYear - 1}-${currentYear}学年度`;
    }

    // 返回学年度和学期信息
    return `${academicYear}${semester}`;
}



// 导出函数以便在其他文件中使用
module.exports = semesterCourseUtils;
