// semesterUtils.js

function excludeByYear() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0 = January, 11 = December

    // 判断当前学年，9月到12月为当前年，1月到8月为前一年
    const academicYear = (currentMonth >= 8) ? currentYear : currentYear - 1;

    const excludedConditions = [];
    excludedConditions.push({
        $or: [
            { $and: [{ grade: `${academicYear - 1}级`, level: '专升本' }] },
            { $and: [{ grade: `${academicYear - 2}级`, level: '专' }] },
            { $and: [{ grade: `${academicYear - 3}级`, level: '本' }] },
            { $and: [{ grade: `${academicYear - 3}级`, level: '专' }] },
            { $and: [{ grade: `${academicYear - 3}级`, level: '专升本' }] },
            { $and: [{ grade: { $lt: `${currentYear - 4}级` }, level: { $in: ['本', '专', '专升本'] } }] }, // 排除与当前年差值大于4年的本、专、专升本
        ],
    });
    return { $nor: excludedConditions };
}




// 导出函数以便在其他文件中使用
module.exports = excludeByYear;
