const express = require("express")
const router = express.Router()
const courseDB = require("../../db/course")
const userDB = require("../../db/user")
const getCurrentCourseSemester=require("../../utils/semesterUtils")
const aiCourseDB=require("../../db/aiCourse")
router.post("/add", async (req, res) => {
    try {
        const {userId, termName, coursesList} = req.body;

        // 检查coursesList是否为对象
        if (typeof coursesList !== 'object' || Array.isArray(coursesList)) {
            res.status(400).json({error: '课程必须是对象'});
            return;
        }

        // 查找现有课程记录
        const existingCourse = await courseDB.findOne({userId, termName}).exec();

        if (existingCourse) {
            // 检查现有course.coursesList中是否存在具有相同rawSection和week的课程
            const courseExists = existingCourse.coursesList.some(existingCourse => {
                //比较rawSection和week属性以确定它们是否匹配
                return (
                    existingCourse.week === coursesList.week &&
                    existingCourse.section === coursesList.section &&
                    existingCourse.sectionCount === coursesList.sectionCount&&
                    existingCourse.weeks.includes(coursesList.weeks)
                );
            });

            if (courseExists) {
                return res.status(200).json({message: '已添加周节'});
            } else {
                // 未找到具有相同rawSection和周值的课程，请继续添加
                existingCourse.coursesList.push(coursesList);
                await existingCourse.save();
                res.status(200).json({message: '已添加到现有记录'});
            }
        } else {
            // 未找到具有相同rawSection和周值的课程，请继续添加
            await courseDB.create({
                userId,
                termName,
                coursesList: [coursesList] // 将单个课程对象包裹在数组中
            });
            res.status(201).json({message: '已创建新记录'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: '服务器错误'});
    }
});

router.post('/deleteCourse', async (req, res) => {
    try {
        const {userId, termName, index} = req.body;

        // 根据 userId 查找用户的课程信息
        const course = await courseDB.findOne({userId, termName}).exec();

        if (!course) {
            return res.status(404).json({message: '用户课程信息未找到'});
        }

        // 验证 index 是否在有效范围内
        if (index < 0 || index >= course.coursesList.length) {
            return res.status(400).json({message: '无效的索引'});
        }

        // 删除指定索引的课程
        course.coursesList.splice(index, 1);

        // 保存更新后的课程信息
        await course.save();

        return res.status(200).json({message: '课程删除成功'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: '服务器错误'});
    }
});
router.post("/importAdd", async (req, res) => {
    try {
        const { userId, name, due, isCadre, institution, position, termName, coursesList } = req.body;
        // 检查coursesList是否为数组
        if (!Array.isArray(coursesList)) {
            res.status(400).json({ error: 'coursesList must be an array' });
            return;
        }

        // 查找现有课程记录
        const existingCourse = await courseDB.findOne({ userId, termName }).exec();

        if (existingCourse) {
            // 更新现有Course.coursesList
            existingCourse.coursesList = coursesList;
            await existingCourse.save();
            res.status(200).json({ message: '已更新现有记录' });
        } else {
            // 如果找不到现有课程记录，请创建一个新记录
            const newCourseRecord = await courseDB.create({
                userId,
                name,
                due,
                isCadre,
                institution,
                position,
                termName,
                coursesList
            });
            res.status(201).json({ message: '已创建新记录', newCourseRecord });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
});
// router.post("/updateAddCourse", async (req, res) => {
//     try {
//         const { userId, name, due, isCadre, institution, position, termName, coursesList } = req.body;
//         console.log(userId, termName, due);
//
//         // 检查coursesList是否为数组
//         if (!Array.isArray(coursesList)) {
//             res.status(400).json({ error: 'coursesList must be an array' });
//             return;
//         }
//
//         // 查找现有课程记录
//         const existingCourse = await courseDB.findOne({ userId, termName }).exec();
//
//         if (existingCourse) {
//             // 检查现有Course.coursesList中是否存在具有相同rawSection和week值的课程
//             const coursesExist = coursesList.some(newCourse => {
//                 return existingCourse.coursesList.some(existingCourse => {
//                     // 比较rawSection和week属性以确定它们是否匹配
//                     return (
//                         existingCourse.week === newCourse.week &&
//                         existingCourse.section === newCourse.section &&
//                         existingCourse.sectionCount === newCourse.sectionCount
//                     );
//                 });
//             });
//
//             if (coursesExist) {
//                 return res.status(200).json({ message: '已添加周节' });
//             } else {
//                 // 未找到具有相同rawSection和周值的课程，请继续添加
//                 existingCourse.coursesList.push(...coursesList);
//                 await existingCourse.save();
//                 res.status(200).json({ message: '已添加到现有记录' });
//             }
//         } else {
//             // 如果找不到现有课程记录，请创建一个新记录
//             const newCourseRecord = await courseDB.create({
//                 userId,
//                 name,
//                 due,
//                 isCadre,
//                 institution,
//                 position,
//                 termName,
//                 coursesList
//             });
//             res.status(201).json({ message: '已创建新记录', newCourseRecord });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: '服务器错误' });
//     }
// });
router.post("/updateAddCourse", async (req, res) => {
    try {
        const { userId, name, due, isCadre, institution, position, termName, coursesList } = req.body;


        // 检查coursesList是否为数组
        if (!Array.isArray(coursesList)) {
            res.status(400).json({ error: 'coursesList must be an array' });
            return;
        }

        // 查找现有课程记录
        const existingCourse = await courseDB.findOne({ userId, termName }).exec();

        if (existingCourse) {
            // 更新现有Course.coursesList
            existingCourse.coursesList = coursesList;
            await existingCourse.save();
            res.status(200).json({ message: '已更新现有记录' });
        } else {
            // 如果找不到现有课程记录，请创建一个新记录
            const newCourseRecord = await courseDB.create({
                userId,
                name,
                due,
                isCadre,
                institution,
                position,
                termName,
                coursesList
            });
            res.status(201).json({ message: '已创建新记录', newCourseRecord });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 更新课程列表中的某项课程
router.post('/updateCourse', async (req, res) => {
    try {
        const {userId, termName, index, updatedCourse} = req.body;

        // 根据 userId 查找用户的课程信息
        const course = await courseDB.findOne({userId, termName});

        if (!course) {
            return res.status(404).json({message: '用户课程信息未找到'});
        }

        // 验证 index 是否在有效范围内
        if (index < 0 || index >= course.coursesList.length) {
            return res.status(400).json({message: '无效的索引'});
        }

        // 更新指定索引的课程数据
        course.coursesList[index] = updatedCourse;

        // 保存更新后的课程信息
        await course.save();

        return res.status(200).json({message: '课程更新成功'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: '服务器错误'});
    }
});


// 查找课程列表中的某项课程并返回
router.get('/getCourseByIndex', async (req, res) => {
    try {
        const {userId, termName, index} = req.query; // 从查询参数中获取 userId 和 index

        // 根据 userId 查找用户的课程信息
        const course = await courseDB.findOne({userId, termName});

        if (!course) {
            return res.status(404).json({message: '用户课程信息未找到'});
        }

        // 验证 index 是否在有效范围内
        if (index < 0 || index >= course.coursesList.length) {
            return res.status(400).json({message: '无效的索引'});
        }

        // 获取指定索引的课程数据
        const courseByIndex = course.coursesList[index];

        // 返回指定索引的课程数据
        return res.send({
            code: 200,
            message: "查询成功",
            data: courseByIndex
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: '服务器错误'});
    }
});


// 定义删除课程的路由
router.post('/termDelete', async (req, res) => {
    try {
        const {userId, termName} = req.body;

        // 使用 Mongoose 查询匹配条件的记录并删除
        const result = await courseDB.deleteOne({userId, termName});

        if (result.deletedCount === 0) {
            return res.status(404).json({message: '没有找到匹配的记录'});
        }

        res.json({message: '记录已成功删除'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '删除记录时出错'});
    }
});

router.get('/studentfreeTime', async (req, res) => {
    try {
        const {targetPosition} = req.query;

        // 查询符合指定职位的用户
        const users = await userDB.find({position: targetPosition});

        // 查询所有课程
        const courses = await courseDB.find();

        const weekRange = [...Array(20).keys()].map((x) => x + 1); // 学期中的周数范围
        const freeTimeArray = [];

        for (let week of weekRange) {
            for (let day = 1; day <= 7; day++) {
                for (let section = 1; section <= 12; section++) {
                    let hasCourse = false;

                    courses.forEach(course => {
                        course.coursesList.forEach(courseInfo => {
                            if (
                                courseInfo.week === day &&
                                courseInfo.weeks.includes(week) &&
                                section >= courseInfo.section && // 当前 section 大于或等于课程的开始节
                                section < courseInfo.section + courseInfo.sectionCount // 当前 section 小于课程的结束节
                            ) {
                                hasCourse = true;
                            }
                        });
                    });

                    if (!hasCourse) {
                        const freeUsers = users.filter(user => {
                            return !courses.some(course => {
                                return course.coursesList.some(courseInfo => {
                                    return (
                                        courseInfo.week === day &&
                                        courseInfo.weeks.includes(week) &&
                                        section >= courseInfo.section && // 当前 section 大于或等于课程的开始节
                                        section < courseInfo.section + courseInfo.sectionCount // 当前 section 小于课程的结束节
                                    );
                                }) && course.userId === user.userId;
                            });
                        });

                        if (freeUsers.length > 0) {
                            freeTimeArray.push({
                                week,
                                day,
                                section,
                                user_info: freeUsers.map(user => `${user.name || 'Unknown'} (${user.position || 'Unknown'})`)
                            });
                        }
                    }
                }
            }
        }

        res.json(freeTimeArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


// 辅助函数：找到没有课程的学生
// function findUsersWithNoClassByWeek(courses, targetWeekNum) {
//     const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
//     const result = [];
//
//     // 假设一学期有20周，一周有7天，一天有10节课
//     const totalWeeks = 20;
//     const totalDays = 7;
//     const totalSections = 10;
//
//     for (let weekNum = 1; weekNum <= totalWeeks; weekNum++) {
//         for (let day = 1; day <= totalDays; day++) {
//             for (let section = 1; section <= totalSections; section++) {
//                 const usersWithNoClass = new Set();
//
//                 for (const course of courses) {
//                     const userCourses = course.coursesList;
//                     let hasClass = false;
//
//                     for (const userCourse of userCourses) {
//                         if (
//                             userCourse.week === day &&
//                             userCourse.weeks.includes(weekNum) &&
//                             section >= userCourse.section &&
//                             section < userCourse.section + userCourse.sectionCount
//                         ) {
//                             hasClass = true;
//                             break;
//                         }
//                     }
//
//                     if (!hasClass) {
//                         // 使用对象来存储学生信息，包括姓名、职位和电话
//                         const userInfo = {
//                             name: course.name,
//                             institution:course.institution,
//                             position: course.position,
//                             phone: course.phone
//                         };
//                         usersWithNoClass.add(userInfo);
//                     }
//                 }
//
//                 const uniqueUsersWithNoClass = Array.from(usersWithNoClass);
//
//                 result.push({
//                     weekNum,
//                     week: day,
//                     day,
//                     section,
//                     sectionCount: 1,
//                     weeks,
//                     user_info: uniqueUsersWithNoClass
//                 });
//             }
//         }
//     }
//
//     // 返回目标周的结果
//     return result.filter(item => item.weekNum === targetWeekNum);
// }

// 辅助函数：找到没有课程的学生
function findUsersWithNoClassByWeek(courses, targetWeekNum) {
    const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const result = [];

    // 假设一学期有20周，一周有7天，一天有10节课
    const totalWeeks = 20;
    const totalDays = 7;
    const totalSections = 10;

    for (let weekNum = 1; weekNum <= totalWeeks; weekNum++) {
        for (let day = 1; day <= totalDays; day++) {
            for (let section = 1; section <= totalSections; section++) {
                const usersWithNoClass = new Set();

                for (const course of courses) {
                    const userCourses = course.coursesList;
                    let hasClass = false;

                    for (const userCourse of userCourses) {
                        if (
                            userCourse.week === day &&
                            userCourse.weeks.includes(weekNum) &&
                            section >= userCourse.section &&
                            section < userCourse.section + userCourse.sectionCount
                        ) {
                            hasClass = true;
                            break;
                        }
                    }

                    if (!hasClass) {
                        const userInfo = `${course.name} [${course.institution===course.position.includes(course.institution)?course.position:course.institution}]${course.position}`;
                        usersWithNoClass.add(userInfo);
                    }
                }

                const uniqueUsersWithNoClass = Array.from(usersWithNoClass);

                result.push({
                    weekNum,
                    week:day,
                    day,
                    section,
                    sectionCount: 1,
                    weeks,
                    user_info: uniqueUsersWithNoClass
                });
            }
        }
    }

    return result.filter(item => item.weekNum === targetWeekNum);
}
// 辅助函数：找到指定周、指定星期、指定节次没有课程的学生
function findUsersWithNoClassByWeekCadre(courses, targetWeekNum, targetDay, targetSection) {
    const result = new Set(); // 使用Set避免重复

    // 遍历每个课程数据
    for (const course of courses) {
        const userCourses = course.coursesList || [];
        let hasClass = false;

        // 检查该用户的课程表
        for (const userCourse of userCourses) {
            // 数据验证，确保 userCourse 有效
            if (!userCourse || !userCourse.weeks || typeof userCourse.section === 'undefined') {
                continue; // 跳过无效数据
            }

            // 检查用户的课程是否在指定周和指定星期，并且覆盖了指定节次
            if (
                userCourse.week === targetDay && // 目标星期几
                userCourse.weeks.includes(targetWeekNum) && // 目标周
                targetSection >= userCourse.section && // 节次开始
                targetSection < userCourse.section + userCourse.sectionCount // 节次结束
            ) {
                hasClass = true;
                break;
            }
        }

        // 如果该用户在指定时间段没有课程，将其信息添加到结果中
        if (!hasClass) {
            const userInfo = {
                name: course.name,
                institution: course.institution,
                position: course.position,
                phone: course.phone
            };
            result.add(JSON.stringify(userInfo)); // 用字符串化来避免重复对象
        }
    }

    // 将 Set 转换为数组并解析回对象
    const uniqueUsersWithNoClass = Array.from(result).map(item => JSON.parse(item));

    // 返回该时间段的用户信息
    return {
        weekNum: targetWeekNum,
        week: targetDay,
        section: targetSection,
        user_info: uniqueUsersWithNoClass
    };
}

router.get('/findUsersWithNoClassByWeek', async (req, res) => {
    const { targetWeekNum } = req.query;

    try {
        // 获取当前学期
        const termName = getCurrentCourseSemester();

        // 从用户表中查找所有是干部的学生
        const users = await userDB.find({
            isCadre: true,
            due: "第19届",
            institution: { $in: ["学生分会", "分团委", "校友分会"] }
        });

        // 用于存储所有学生的课程信息
        let coursesAll = [];

        // 根据年级、班级和学期获取每个学生的课程信息
        for (const user of users) {
            const courses = await aiCourseDB.find({
                grade: user.grade,
                className: user.class,
                levels:user.level,
                termName: termName
            });
            user.coursesList = courses.length > 0 ? courses[0].coursesList : [];
            coursesAll.push(user);
        }

        // 找到特定周没有课程的学生
        const usersWithNoClassByWeek = findUsersWithNoClassByWeek(coursesAll, parseInt(targetWeekNum));
        const startTime = '2024/9/2';

        res.json({ usersWithNoClassByWeek, startTime });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
});

router.get('/findUsersWithNoClassByWeekCadre', async (req, res) => {
    const { targetWeekNum, targetDay, targetSection, userId } = req.query;

    try {
        // 获取当前学期
        const termName = getCurrentCourseSemester();

        // 从用户表中查找指定的用户信息
        const currentUser = await userDB.findById(userId);

        // 如果找不到用户，返回错误
        if (!currentUser) {
            return res.status(404).json({ message: '用户未找到' });
        }

        // 设置查询条件
        let userQuery = {
            isCadre: true,
            due: "第19届",
        };

        // 判断用户角色
        if (currentUser.admin===true) {
            console.log(1)
            // 如果是admin，查询所有相关的机构
            userQuery.institution = { $in: ["分团委", "学生分会", "校友分会", "分团委学生社团管理部"] }; // 允许的多个机构
        } else if (currentUser.position.includes('部长')) {
            console.log(2)
            // 如果是部长，只查询该用户所在部门的干事和部长
            const basePosition = currentUser.position.replace(/(部长|干事|副部长|队长)/, '');
            console.log(basePosition)
            userQuery = {
                institution: currentUser.institution,
                position: { $regex: new RegExp(basePosition) }
            };
        } else {
            // 如果既不是admin也不是部长，返回权限不足
            return res.status(403).json({ message: '权限不足' });
        }

        // 从用户表中查找符合条件的学生
        const users = await userDB.find(userQuery);
        console.log(users)
        // 用于存储所有学生的课程信息
        let coursesAll = [];

        // 根据年级、班级和学期获取每个学生的课程信息
        for (const user of users) {
            const courses = await aiCourseDB.find({
                grade: user.grade,
                className: user.class,
                levels: user.level,
                termName: termName
            });
            user.coursesList = courses.length > 0 ? courses[0].coursesList : [];
            coursesAll.push(user);
        }

        // 找到特定周没有课程的学生
        const usersWithNoClassByWeek = findUsersWithNoClassByWeekCadre(coursesAll, parseInt(targetWeekNum), parseInt(targetDay), parseInt(targetSection));
        const startTime = '2024/9/2';

        res.json({ usersWithNoClassByWeek, startTime });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
});


router.get('/allcourse', async (req, res) => {
    const all = await courseDB.find()
    res.json(all);
});



router.get('/findUsersWithNoClass', async (req, res) => {

    const totalDays = 7; // 假设一周7天
    const totalSections = 10; // 假设10个截面
    const targetWeeks = 16; // 第1至16周

    try {
        const all = await courseDB.find({ isCadre: true, due: "第18届", institution: { $in: ["学生分会", "分团委", "校友分会"] } });
        const usersWithNoClass = findUsersWithNoClass(all, totalDays, totalSections, targetWeeks);
        res.json(usersWithNoClass);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function findUsersWithNoClass(courses, totalDays, totalSections, targetWeeks) {
    const result = [];

    for (let day = 1; day <= totalDays; day++) {
        for (let section = 1; section <= totalSections; section++) {
            const usersWithNoClassSet = new Set();

            // 检查学生是否在1-16周内没有上课
            let hasNoClassForWeeks = true;
            for (let weekNum = 1; weekNum <= targetWeeks; weekNum++) {
                hasNoClassForWeeks = courses.every(course => {
                    const userCourses = course.coursesList;
                    return !userCourses.some(userCourse =>
                        userCourse.week === day &&
                        section >= userCourse.section &&
                        section < userCourse.section + userCourse.sectionCount &&
                        !userCourse.weeks.includes(weekNum)
                    );
                });

                if (!hasNoClassForWeeks) {
                    break;
                }
            }

            if (hasNoClassForWeeks) {
                courses.forEach(course => {
                    const userCourses = course.coursesList;
                    userCourses
                        .filter(userCourse =>
                            userCourse.week === day &&
                            section >= userCourse.section &&
                            section < userCourse.section + userCourse.sectionCount &&
                            userCourse.weeks.every(weekNum => weekNum >= 1 && weekNum <= targetWeeks)
                        )
                        .forEach(userCourse => {
                            usersWithNoClassSet.add({
                                week: userCourse.week,
                                section: userCourse.section,
                                name: course.name,
                                position: course.position,
                                studentInfo: userCourse.studentInfo //包含学生信息
                            });
                        });
                });
            }

            const usersWithNoClassArray = Array.from(usersWithNoClassSet);

            result.push({
                day,
                section,
                userInfo: usersWithNoClassArray
            });
        }
    }

    return result;
}

// 定义一个路由，根据 userId 获取相关课程数据
router.get('/userCourses', async (req, res) => {
    try {
        const { userId } = req.params;

        // 查找符合指定 userId 的课程数据
        const courses = await courseDB.find({ userId });

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: '未找到符合该 userId 的课程数据' });
        }

        // 将课程数据以 JSON 形式发送响应
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
});
// 定义一个路由，根据 courseId 删除课程数据
router.post('/coursesDelete', async (req, res) => {
    try {
        const { courseId } = req.params;

        // 查找并删除指定课程数据
        const deletedCourse = await courseDB.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            return res.status(404).json({ message: '未找到指定的课程数据' });
        }

        // 发送成功的响应
        res.status(200).json({ message: '课程删除成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
});


router.post("/aiCourse", async (req, res) => {
    try {
        const { courseInfoId,grade,className, level, termName, coursesList } = req.body;

        console.log(courseInfoId,grade,className, level)
        // 检查coursesList是否为数组
        if (!Array.isArray(coursesList)) {
            res.status(400).json({ error: 'coursesList must be an array' });
            return;
        }

        // 查找现有课程记录
        const existingCourse = await aiCourseDB.findOne({ courseInfoId, termName }).exec();

        if (existingCourse) {
            // 更新现有Course.coursesList
            existingCourse.coursesList = coursesList;
            await existingCourse.save();
            res.status(200).json({ message: '已更新现有记录' });
        } else {
            // 如果找不到现有课程记录，请创建一个新记录
            const newCourseRecord = await aiCourseDB.create({
                courseInfoId,
                grade,
                className,
                level,
                termName,
                coursesList
            });
            res.status(201).json({ message: '已创建新记录', newCourseRecord });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
});

module.exports = router



