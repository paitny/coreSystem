const express = require("express")
const router = express.Router()
const aiCourseModel = require("../../db/aiCourse")
const courseFeedbackDB = require("../../db/CourseFeedback")
const getCurrentSemester = require('../../utils/semesterUtils');
const multer = require("multer");
const path = require("path");
const ClassInfoDB = require("../../db/ClassInfo")
const excludeClass = require('../../utils/excludeClass');
const fs = require("fs");
let checkCourse_upload = multer({
    storage: multer.diskStorage({
        //文件存储的目录
        destination(req, file, cb) {
            cb(null, path.join(__dirname, '../../public/file/checkCourse'))
        },
        //文件的名字
        filename(req, file, cb) {
            let { ext } = path.parse(file.originalname)
            req.courseBack_name = `checkCourse-${Date.now()}${ext}`
            cb(null, req.courseBack_name)
        }
    })
}).single('file')
//上传cover封面图
router.post("/cover", (req, res) => {
    try {
        checkCourse_upload(req, res, async (err) => {
            //上传失败
            if (err) {
                return res.send({
                    code: 9,
                    msg: "上传失败"
                })
            }
            //上传成功
            res.send({
                code: 0,
                msg: "查课照片上传成功",
                url: `/file/checkCourse/${req.courseBack_name}`
            })
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
const coursesData = [
    {
        userId: '60d2e5b5c1623d3494b9fcd5',
        termName: '2023-2024学年度第二学期',
        grade: '2023级',
        className: '计算机科学与技术4班',
        level: '本',
        coursesList: [
            {
                name: '数学分析',
                num: 'MA101',
                credit: '3',
                totalHours: '48',
                lectureHours: '32',
                computeHours: '16',
                category: '必修',
                teachMethod: '讲授',
                method: '闭卷考试',
                teacher: '张老师',
                weeks: [1, 2, 3, 4],
                section: 1,
                address: '教学楼A101',
                rawWeeks: '[1-4周]',
                rawSection: '[1节]',
                week: 1,
                sectionCount: 1,
            },
            {
                name: '数学分析',
                num: 'MA101',
                credit: '3',
                totalHours: '48',
                lectureHours: '32',
                computeHours: '16',
                category: '必修',
                teachMethod: '讲授',
                method: '闭卷考试',
                teacher: '张老师',
                weeks: [1, 2, 3, 4],
                section: 1,
                address: '教学楼A101',
                rawWeeks: '[1-4周]',
                rawSection: '[5-6节]',
                week: 1,
                sectionCount: 2,
            },
        ],
    },
];

router.post('/courses', async (req, res) => {
    try {
        // 插入数据到数据库
        const insertedCourses = await aiCourseModel.insertMany(coursesData);

        res.status(201).json({ message: '课程数据存储成功', data: insertedCourses });
    } catch (error) {
        console.error('存储课程数据时出错:', error);
        res.status(500).json({ message: '存储课程数据时出错', error: error.message });
    }
});

router.get('/checkCourses', async (req, res) => {
    try {
        const { termName, grade, className, level, week, weekday } = req.query;
        // 验证必要的查询参数是否存在
        if (!termName || !grade || !className || !level || !week || !weekday) {
            return res.status(400).json({ message: '缺少必要的查询参数' });
        }

        // 将周次和星期转换为整数
        const weeksArray = week.split(',').map(item => parseInt(item.trim())); // 将逗号分隔的字符串转换为整数数组
        const weekdayNumber = parseInt(week);

        // 查询条件：学期名、年级、班级、层次
        const basicQuery = {
            termName,
            grade,
            className,
            level
        };

        // 查询满足基本条件的文档
        const courses = await aiCourseModel.find(basicQuery);

        // 符合进一步条件的课程列表
        let matchedCourses = [];
        const weekdayNum = weekday === '0' ? 7 : weekday
        // 遍历每个文档的课程列表，筛选符合条件的课程
        courses.forEach(course => {
            const matchedCourseList = course.coursesList.filter(course => {
                return course.weeks.includes(parseInt(week)) && course.week === parseInt(weekdayNum);
            });
            matchedCourses.push(...matchedCourseList);
        });

        // 返回成功的响应，包含符合条件的课程列表
        res.status(200).json({ message: '查询成功', matchedCourses });
    } catch (error) {
        console.error('查询课程数据时出错:', error);
        res.status(500).json({ message: '查询课程数据时出错', error: error.message });
    }
});

router.post('/courseFeedback', async (req, res) => {
    const { feedbackData } = req.body;
    try {

        if (feedbackData.photo.length === 0) {
            return res.json({ message: '提交失败,未上传照片' });
        }

        let existingFeedback = await courseFeedbackDB.findOne(
            {
                termName: getCurrentSemester(),
                week: feedbackData.week,
                weekday: feedbackData.weekday,
                grade: feedbackData.grade,
                class: feedbackData.class,
                level: feedbackData.level,
                "course.section": feedbackData.course.section,
                "course.sectionCount": feedbackData.course.sectionCount
            }
        );

        if (existingFeedback) {
            // 如果找到现有记录，则进行更新操作
            existingFeedback = await courseFeedbackDB.findOneAndUpdate(
                {
                    termName: getCurrentSemester(),
                    week: feedbackData.week,
                    weekday: feedbackData.weekday,
                    grade: feedbackData.grade,
                    class: feedbackData.class,
                    level: feedbackData.level,
                    "course.section": feedbackData.course.section,
                    "course.sectionCount": feedbackData.course.sectionCount
                },
                {
                    $set: {
                        userId: feedbackData.userId,
                        photo: feedbackData.photo || undefined,
                        course: feedbackData.course,
                        shouldAttend: feedbackData.shouldAttend,
                        actualAttend: feedbackData.actualAttend,
                        absent: feedbackData.absent,
                        leave: feedbackData.leave,
                        checker: feedbackData.checker,
                        isProvide: feedbackData.isProvide || undefined,
                        remarks: feedbackData.remarks,
                        results: feedbackData.results,
                    },
                },
                { new: true } // 返回更新后的记录
            );

            res.json({ message: '更新成功', feedback: existingFeedback });
        } else {
            // 如果未找到现有记录，则进行创建操作
            const newFeedback = new courseFeedbackDB({
                termName: getCurrentSemester(),
                userId: feedbackData.userId,
                course: feedbackData.course,
                photo: feedbackData.photo,
                week: feedbackData.week,
                weekday: feedbackData.weekday,
                grade: feedbackData.grade,
                class: feedbackData.class,
                level: feedbackData.level,
                shouldAttend: feedbackData.shouldAttend,
                actualAttend: feedbackData.actualAttend,
                absent: feedbackData.absent,
                leave: feedbackData.leave,
                checker: feedbackData.checker,
                isProvide: feedbackData.isProvide || undefined,
                remarks: feedbackData.remarks,
                results: feedbackData.results,
            });

            const savedFeedback = await newFeedback.save();
            res.json({ message: '创建成功', feedback: savedFeedback });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '服务器出错' });
    }
});

router.post("/deleteCourseFeedback", async (req, res) => {
    let { id, photo } = req.body
    try {
        let coverUrl = path.resolve(__dirname, "../../public" + photo)
        if (photo === "/file/checkCourse/default.jpg") {
            await courseFeedbackDB.findByIdAndRemove(id)
            return res.send({
                code: 0,
                msg: "删除完成"
            })
        }
        await fs.unlinkSync(coverUrl)
        await courseFeedbackDB.findByIdAndRemove(id)

        res.send({
            code: 0,
            msg: "删除完成"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})


// 定义一个 API 路由，通过辅导员名字查询班级信息
router.get("/search-by-counsellor", async (req, res) => {
    try {
        const { counsellor } = req.query; // 从查询参数中获取辅导员名字
        if (!counsellor) {
            return res.status(400).json({ error: "辅导员名字是必需的" });
        }

        // 使用正则表达式进行模糊查询
        const regExpQuery = new RegExp(counsellor, "i"); // 不区分大小写的正则表达式

        // 查询数据库，找到所有符合条件的记录
        const results = await ClassInfoDB.find({ counsellor: regExpQuery });

        if (results.length === 0) {
            return res.status(404).json({ message: "未找到相关班级信息" });
        }

        // 将结果中的每条记录的 grade, class, level 字段拼接成一个字符串，并放入数组
        const classList = results.map(result => {
            return `${result.grade}${result.class}(${result.level})`;
        });

        // 返回拼接后的班级信息数组
        res.json({ classList });
    } catch (error) {
        console.error("查询错误:", error);
        res.status(500).json({ error: "服务器错误" });
    }
});


router.get("/search-by-class", async (req, res) => {
    try {
        // 查询数据库，找到所有符合条件的记录，并按 grade 字段倒序排列
        const results = await ClassInfoDB.find(excludeClass()).sort({ _id: -1 });

        if (results.length === 0) {
            return res.status(404).json({ message: "未找到相关班级信息" });
        }

        // 将结果中的每条记录的 grade, class, level 字段拼接成一个字符串，并放入数组
        const classList = results.map(result => {
            return `${result.grade}${result.class}(${result.level})`;
        });

        // 返回拼接后的班级信息数组
        res.json({ classList });
    } catch (error) {
        console.error("查询错误:", error);
        res.status(500).json({ error: "服务器错误" });
    }
});

router.get('/class-checks', async (req, res) => {
    const {week} = req.query;
console.log(week);

    try {
        // 查询所有班级
        const classes = await ClassInfoDB.find(excludeClass());

        // 获取本周的查课数据
        const feedbacks = await courseFeedbackDB.find({
            week: parseInt(week),
            isDeleted: false
        });

        // 创建一个班级次数统计对象
        const checkCounts = {};

        // 统计每个班级的被查课次数
        feedbacks.forEach(feedback => {
            const classKey = `${feedback.grade}-${feedback.class}-${feedback.level}`;
            checkCounts[classKey] = (checkCounts[classKey] || 0) + 1;
        });

        // 准备最终结果
        const results = classes.map(classInfo => {
            const classKey = `${classInfo.grade}-${classInfo.class}-${classInfo.level}`;
            return {
                faculty: classInfo.faculty,
                grade: classInfo.grade,
                class: classInfo.class,
                level: classInfo.level,
                counsellor: classInfo.counsellor,
                checkCount: checkCounts[classKey] || 0 // 若没有被查课，则为 0
            };
        });

        // 按照 checkCount 升序排序
        results.sort((a, b) => a.checkCount - b.checkCount);

        // 返回结果
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误', error });
    }
});


module.exports = router
