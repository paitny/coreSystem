// scheduler.js

const schedule = require('node-schedule');
const Semester = require('../db/semester');

async function scheduleCreateSemesterData() {
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // 月份是从0开始计数的，所以需要加1

        let semesterName;

        if (currentMonth >= 6 && currentMonth <= 12) {
            semesterName = `${currentYear}-${currentYear + 1}学年度第一学期`;
        } else {
            semesterName = `${currentYear - 1}-${currentYear}学年度第二学期`;
        }

        const existingSemester = await Semester.findOne({ name: semesterName });
        if (!existingSemester) {
            await Semester.create({ name: semesterName });
        } else {
            console.log(`当前学期 ${semesterName} 已存在，无需添加`);
        }
    } catch (error) {
        console.error('创建学期数据时出错：', error);
    }
}

const ruleMarch = new schedule.RecurrenceRule();
ruleMarch.month = 2;

const ruleSeptember = new schedule.RecurrenceRule();
ruleSeptember.month = 8;

schedule.scheduleJob(ruleMarch, async () => {
    console.log('三月定时任务触发');
    await scheduleCreateSemesterData();
});

schedule.scheduleJob(ruleSeptember, async () => {
    console.log('九月定时任务触发');
    await scheduleCreateSemesterData();
});

module.exports = { scheduleCreateSemesterData };
