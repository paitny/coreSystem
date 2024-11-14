const express = require("express")
const userDB = require("../../db/user");
const departmentDB = require("../../db/department");
const StudentOrgDB = require("../../db/studentOrg");
const alumnusDB = require("../../db/alumnus");
const path = require("path");
const volunteerDB = require("../../db/volunteer");
const router = express.Router()
const examDB = require('../../db/publishedIssues')
const UserExam = require('../../db/userExam')
const activeDB = require("../../db/activity");
const gradeClassDB = require("../../db/GradeClass")
const Feedback = require("../../db/feedback")
const visitorDB = require("../../db/visitor");
const ClassInfo = require("../../db/ClassInfo")
const courseFeedbackDB = require("../../db/CourseFeedback");
const classInfoDB = require("../../db/ClassInfo");
const semesterCourseUtils = require("../../utils/semesterCourseUtils");
const excludeClass = require('../../utils/excludeClass');

async function updateUsersWithActivities(usersData, activitiesData) {
    usersData.forEach(user => {
        // 检查是否存在activityIds属性，如果不存在那就添加activityIds数组
        if (!user.hasOwnProperty("activityIds")) {
            user.activityIds = [];
        }

        activitiesData.forEach(activity => {
            if (user.user == activity.ID) {
                user.activityIds.push(activity.activityId);
            }
        });
    });

    return usersData;
}

// 返回前端路由表
router.get('/route', async (req, res) => {
    await res.sendFile(path.join(__dirname, '../../dataJson/clientRoute.json'))
})
router.get('/routeOrg', async (req, res) => {
    await res.sendFile(path.join(__dirname, '../../dataJson/org.json'))
})
//请求所有用户
router.get("/user", async (req, res) => {
    let { page, perPage } = req.query
    try {
        let pages = +page || 1
        let perPages = +perPage || 5
        let doc = await userDB.find(
            {},
            {},
            {
                skip: perPages * (pages - 1),
                limit: perPages,
                sort: { _id: 1 }
            }
        )
            .populate("user._id", { pass: 0, __v: 0 })
        const total = await userDB.countDocuments()
        res.send({
            code: 0,
            msg: "请求完成",
            data: doc, total
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
// 路由处理请求所有学生组织的数据
router.get('/getAllStudentOrgs', async (req, res) => {
    try {
        // 使用 Mongoose 的 .find() 方法查询所有学生组织数据
        const studentOrgs = await StudentOrgDB.find();

        // 将查询到的数据返回给客户端
        res.json(studentOrgs);
    } catch (error) {
        // 如果发生错误，返回错误信息
        res.status(500).json({ error: '无法获取学生组织数据' });
    }
});

router.get("/departments", async (req, res) => {

    //活动分页
    let { id } = req.query
    try {
        let doc = await departmentDB.find({ studentOrgId: id })
        res.send({
            code: 0,
            msg: "请求完成",
            data: doc
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

router.get("/departmentInfo", async (req, res) => {
    let { id } = req.query
    try {
        let doc = await departmentDB.findById(id)
        res.send({
            code: 0,
            msg: "请求完成",
            data: doc
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

router.get("/alumnus", async (req, res) => {
    try {
        let doc = await alumnusDB.find({})
        res.send({
            code: 0,
            msg: "请求完成",
            data: doc
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
// router.get("/volunteerInfo", async (req, res) => {
//
//     //活动分页
//     let { id } = req.query
//     let doc = await volunteerDB.find({ activityId: id })
//     res.send({
//         code: 0,
//         msg: "请求完成",
//         data: doc
//     })
// })
router.get("/volunteerInfo", async (req, res) => {
    try {
        //从请求查询中获取志愿者ID
        const { id } = req.query;

        // 按ID获取志愿者信息
        const volunteerDoc = await volunteerDB.find({ activityId: id });

        // 如果未找到志愿者文件，则返回空响应
        if (!volunteerDoc || volunteerDoc.length === 0) {
            return res.send({
                code: 0,
                msg: "未找到志愿者信息",
                data: []
            });
        }

        // 从志愿者文档中提取用户ID
        const userIds = volunteerDoc.map(item => item.ID);

        // 按用户ID获取用户信息
        const userDocs = await userDB.find({ num: { $in: userIds } });

        // 根据num将用户信息映射到志愿者文档（假设num是相应的字段）
        const enhancedVolunteerData = volunteerDoc.map(volunteer => {
            const correspondingUser = userDocs.find(user => user.num === volunteer.ID);

            // 检查correspondentUser是否未定义
            if (!correspondingUser) {
                return {
                    ...volunteer.toObject(),
                    position: '暂无',
                    institution: '暂无',
                    levels: "暂无"
                };
            }

            // 合并用户文档中的其他字段
            const enhancedData = {
                ...volunteer.toObject(),
                position: correspondingUser.position ?? '暂无',
                institution: correspondingUser.institution ?? '暂无',
                levels: correspondingUser.levels ?? '暂无'
            };

            return enhancedData;
        });

        res.send({
            code: 0,
            msg: "请求完成",
            data: enhancedVolunteerData
        });
    } catch (error) {
        console.error("/volteerInfo路由中出错：", error);
        res.status(500).send({
            code: 1,
            msg: "内部服务器错误"
        });
    }
});


router.get('/exams', async (req, res) => {
    try {
        const exams = await examDB.find();
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 获取用户考试数据，包括用户信息
router.get('/userExamsData', async (req, res) => {
    try {
        const { examId } = req.query;
        // 查找用户考试数据
        const userExams = await UserExam.find({ examineId: examId });

        // 创建一个数组来存储用户信息及其考试数据
        let userData = [];

        // 遍历用户考试数据
        for (const userExam of userExams) {
            // 查找用户信息
            const user = await userDB.findById(userExam.userId);

            // 将所需信息添加到 userData 数组中
            userData.push({
                date: userExam.date,
                name: user.name,
                sex: user.sex,
                institution: user.institution,
                position: user.position,
                id: userExam._id,
                totalScore: userExam.totalScore,
            });
        }

        // 定义机构名称的自定义顺序
        const customOrder = ['分团委', '学生分会', '校友分会'];

        // 按照 institution 自定义顺序排序
        userData.sort((a, b) => {
            const orderA = customOrder.indexOf(a.institution);
            const orderB = customOrder.indexOf(b.institution);
            return orderA - orderB;
        });

        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// 获取用户考试数据，包括用户信息

//获取用户试卷
router.get('/ExamsData', async (req, res) => {
    try {
        const { examId } = req.query;
        // 查找用户考试数据
        const userExams = await UserExam.find({ _id: examId });
        // 创建一个数组来存储用户信息及其考试数据
        const userData = [];

        // 遍历用户考试数据
        for (const userExam of userExams) {
            // 查找用户信息
            const user = await userDB.findById(userExam.userId);

            // 将所需信息添加到 userData 数组中
            userData.push({
                name: user.name,
                sex: user.sex,
                institution: user.institution,
                position: user.position,
                id: userExam._id,
                examData: userExam.examData,
                singleChoiceScore: userExam.singleChoiceScore,
                fillScore: userExam.fillScore,
                essayScore: userExam.essayScore,
                thinkingScore: userExam.thinkingScore,
                totalScore: userExam.totalScore,
                termTopic: userExam.termTopic
            });
        }

        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// router.post("/studentQuantification", async (req, res) => {
//     const {grade ,userClass,levels,semester}=req.body
//     let usersData = await userDB.find({
//         grade: grade,
//         class: userClass,
//         levels: levels
//
//     }).sort({ user: 1 }).exec();
//     let activitiesData = await volunteerDB.find({semester:semester});
//     let updatedUsersData = await updateUsersWithActivities(usersData, activitiesData);
//     console.log(updatedUsersData)
//     res.send({
//         code: 0,
//         msg: "查询成功",
//         data: updatedUsersData
//     });
// });

router.post("/studentQuantification", async (req, res) => {
    try {
        const { grade, userClass, levels, semester } = req.body;

        // 查询符合条件的用户数据
        const usersData = await userDB.find({
            grade: grade,
            class: userClass,
            levels: levels
        }).sort({ user: 1 }).exec();

        // 查询符合条件的活动数据
        const activitiesData = await activeDB.find({ currentSemester: semester });

        // 获取需要签到的活动ID列表
        const signRequiredActivityIds = activitiesData.filter(activity => activity.isSign).map(activity => activity._id);

        // 查询符合条件的志愿者数据
        const volunteersData = await volunteerDB.find({
            semester: semester,
            $or: [
                { activityId: { $in: signRequiredActivityIds } },
                { activityId: { $nin: signRequiredActivityIds } }
            ]
        });

        // 过滤出需要返回的志愿者数据
        const filteredVolunteersData = volunteersData.filter(volunteer => {
            const activity = activitiesData.find(activity => activity._id.equals(volunteer.activityId));
            if (activity && activity.isSign) {
                return volunteer.checkInTime !== null;
            }
            return true; // 不需要签到的活动直接返回
        });
        let updatedUsersData = await updateUsersWithActivities(usersData, filteredVolunteersData);
        // 返回符合条件的志愿者数据
        res.send({
            code: 0,
            msg: "查询成功",
            data: updatedUsersData
        });
    } catch (error) {
        console.error("Error in studentQuantification endpoint:", error);
        res.status(500).send({
            code: -1,
            msg: "服务器错误"
        });
    }
});
// router.get("/userData", async (req, res) => {
//     const { query, semester } = req.query;
//     try {
//         // 获取用户数据
//         const results = await userDB.searchUser(query);

//         // 过滤掉 position 为辅导员的数据
//         const filteredResults = results.filter(user => user.institution !== '人工智能与大数据学院');

//         // 查询符合条件的活动数据
//         const activitiesData = await activeDB.find({ currentSemester: semester });

//         // 获取需要签到的活动ID列表
//         const signRequiredActivityIds = activitiesData.filter(activity => activity.isSign).map(activity => activity._id);

//         // 查询符合条件的志愿者数据
//         const volunteersData = await volunteerDB.find({
//             semester: semester,
//             $or: [
//                 { activityId: { $in: signRequiredActivityIds } },
//                 { activityId: { $nin: signRequiredActivityIds } }
//             ]
//         });

//         // 过滤出需要返回的志愿者数据
//         const filteredVolunteersData = volunteersData.filter(volunteer => {
//             const activity = activitiesData.find(activity => activity._id.equals(volunteer.activityId));
//             if (activity && activity.isSign) {
//                 return volunteer.checkInTime !== null;
//             }
//             return true; // 不需要签到的活动直接返回
//         });

//         let updatedUsersData = await updateUsersWithActivities(filteredResults, filteredVolunteersData);

//         // 将具有相同"grade"、"class"和"levels"字段的条目分组
//         let groupedUsersData = {};
//         updatedUsersData.forEach(user => {
//             const key = `${user.grade}-${user.class}-${user.levels}`;
//             if (!groupedUsersData[key]) {
//                 groupedUsersData[key] = [];
//             }
//             groupedUsersData[key].push(user);
//         });

//         // 在每个分组内对数据按照 "user" 字段进行排序
//         Object.values(groupedUsersData).forEach(group => {
//             group.sort((a, b) => {
//                 return a.user.localeCompare(b.user);
//             });
//         });

//         // 将分组后的数据按照原始顺序连接起来
//         updatedUsersData = Object.values(groupedUsersData).flat();

//         // 返回响应
//         res.send({
//             code: 0,
//             msg: "查询成功",
//             data: updatedUsersData
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: '内部服务器错误' });
//     }
// });

// router.get("/userData", async (req, res) => {
//     const {query, semester} = req.query;
//     try {
//         // 获取用户数据
//         const results = await userDB.searchUser(query);
//
//         // 查询符合条件的活动数据
//         const activitiesData = await activeDB.find({currentSemester: semester});
//
//         // 获取需要签到的活动ID列表
//         const signRequiredActivityIds = activitiesData.filter(activity => activity.isSign).map(activity => activity._id);
//
//         // 查询符合条件的志愿者数据
//         const volunteersData = await volunteerDB.find({
//             semester: semester,
//             $or: [
//                 {activityId: {$in: signRequiredActivityIds}},
//                 {activityId: {$nin: signRequiredActivityIds}}
//             ]
//         });
//
//         // 过滤出需要返回的志愿者数据
//         const filteredVolunteersData = volunteersData.filter(volunteer => {
//             const activity = activitiesData.find(activity => activity._id.equals(volunteer.activityId));
//             if (activity && activity.isSign) {
//                 return volunteer.checkInTime !== null;
//             }
//             return true; // 不需要签到的活动直接返回
//         });
//         let updatedUsersData = await updateUsersWithActivities(results, filteredVolunteersData);
//
//         // 将具有相同"grade"、"class"和"levels"字段的条目分组
//         let groupedUsersData = {};
//         updatedUsersData.forEach(user => {
//             const key = `${user.grade}-${user.class}-${user.levels}`;
//             if (!groupedUsersData[key]) {
//                 groupedUsersData[key] = [];
//             }
//             groupedUsersData[key].push(user);
//         });
//
//         // 在每个分组内对数据按照 "user" 字段进行排序
//         Object.values(groupedUsersData).forEach(group => {
//             group.sort((a, b) => {
//                 // 这里假设user字段是字符串类型，如果是其他类型需要进行适当修改
//                 return a.user.localeCompare(b.user);
//             });
//         });
//
//         // 将分组后的数据按照原始顺序连接起来
//         updatedUsersData = Object.values(groupedUsersData).flat();
//
//         // 返回响应
//         res.send({
//             code: 0,
//             msg: "查询成功",
//             data: updatedUsersData
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({message: '内部服务器错误'});
//     }
// });

// router.get("/newActive", async (req, res) => {
//     try {
//         const {currentSemester}=req.query
//         let doc = await activeDB.find({currentSemester:currentSemester}, {}, {sort: {date: 1}});
//         // 最新活动，限制返回结果为一条数据
//
//         if (doc) {
//             res.send({
//                 code: 0,
//                 msg: "查询成功",
//                 data: doc // 返回查询结果的第一条数据
//             });
//         } else {
//             res.status(404).send({
//                 code: -1,
//                 msg: "未找到活动数据"
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({error: '服务器错误'});
//     }
// });


router.get("/userData", async (req, res) => {
    const { query, semester } = req.query;
    try {
        // 获取用户数据
        const results = await userDB.searchUser(query);

        // 过滤掉 position 为辅导员的数据
        const filteredResults = results.filter(user => user.institution !== '人工智能与大数据学院');

        // 查询符合条件的活动数据
        const activitiesData = await activeDB.find({ currentSemester: semester });

        // 获取需要签到的活动ID列表
        const signRequiredActivityIds = activitiesData.filter(activity => activity.isSign).map(activity => activity._id);
        
        // 获取需要签退的活动ID列表
        const checkOutRequiredActivityIds = activitiesData.filter(activity => activity.isCheckOut).map(activity => activity._id);

        // 查询符合条件的志愿者数据
        const volunteersData = await volunteerDB.find({
            semester: semester,
            $or: [
                { activityId: { $in: signRequiredActivityIds } },
                { activityId: { $nin: signRequiredActivityIds } }
            ]
        });

        // 过滤出需要返回的志愿者数据
        const filteredVolunteersData = volunteersData.filter(volunteer => {
            const activity = activitiesData.find(activity => activity._id.equals(volunteer.activityId));
            if (activity) {
                
                // 检查活动是否需要签退
                if (activity.isSign&&activity.isCheckOut) {
                    // 如果活动需要签退，返回已签到且已签退的志愿者
                    return volunteer.checkInTime !== null && volunteer.checkOutTime !== null;
                }// 检查活动是否需要签到
                else if (activity.isSign) {
                    // 如果活动需要签到，返回已签到的志愿者
                    return volunteer.checkInTime !== null;
                }
                // 不需要签到的活动直接返回
                return true;
            }
            return false; // 没有找到对应活动的志愿者不返回
        });

        let updatedUsersData = await updateUsersWithActivities(filteredResults, filteredVolunteersData);

        // 将具有相同"grade"、"class"和"levels"字段的条目分组
        let groupedUsersData = {};
        updatedUsersData.forEach(user => {
            const key = `${user.grade}-${user.class}-${user.levels}`;
            if (!groupedUsersData[key]) {
                groupedUsersData[key] = [];
            }
            groupedUsersData[key].push(user);
        });

        // 在每个分组内对数据按照 "user" 字段进行排序
        Object.values(groupedUsersData).forEach(group => {
            group.sort((a, b) => {
                return a.user.localeCompare(b.user);
            });
        });

        // 将分组后的数据按照原始顺序连接起来
        updatedUsersData = Object.values(groupedUsersData).flat();

        // 返回响应
        res.send({
            code: 0,
            msg: "查询成功",
            data: updatedUsersData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
});


router.get("/newActive", async (req, res) => {
    try {
        const { currentSemester } = req.query;
        const doc = await activeDB.find(
            {
                currentSemester: currentSemester,
                quantization: true
            },
            {},
            { sort: { date: 1 } }
        );

        if (doc) {
            res.send({
                code: 0,
                msg: "查询成功",
                data: doc
            });
        } else {
            res.status(404).send({
                code: -1,
                msg: "未找到满足条件的活动数据"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 获取所有年级、班级和层次数据，并按照 createdAt 字段的倒序排列
router.get('/gradeClass', async (req, res) => {
    try {
        const data = await gradeClassDB.find({}, { grade: 1, classNames: 1, levels: 1, _id: 0 })
            .sort({ createdAt: -1 }); // 排序
        res.json(data);
    } catch (error) {
        console.error('获取数据时出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});


// 获取所有反馈数据,按创建时间降序排列
// 获取所有反馈数据,按创建时间降序排列,未读的在前面
router.get('/feedbacks', async (req, res) => {
    try {
        // 文章分页
        let { page, perPage } = req.query
        let pages = +page || 1
        let perPages = +perPage || 5
        const total = await Feedback.countDocuments()
        let doc = await Feedback
            .find({}, {}, {
                sort: { isRead: 1, createdAt: -1 }, // 先按isRead升序排列,再按createdAt降序排列
                skip: perPages * (pages - 1),
                limit: perPages,
            })

        res.send({
            code: 0,
            msg: "请求完成",
            data: doc, total
        })

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// 获取不重复的年级、层次、班级和辅导员数组
router.get("/getUniqueInfo", async (req, res) => {
    try {
        const { uniqueFaculty, uniqueGrades, uniqueLevels, uniqueClasses, uniqueCounsellors } = await getUniqueInfo();

        res.status(200).json({ uniqueFaculty, uniqueGrades, uniqueLevels, uniqueClasses, uniqueCounsellors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 提取不重复的年级、层次、班级和辅导员信息
async function getUniqueInfo() {
    try {
        // 查询所有班级信息
        const classInfoList = await ClassInfo.find().exec();

        // 提取不重复的年级、层次、班级和辅导员
        const uniqueGrades = [...new Set(classInfoList.map(info => info.grade))];
        const uniqueLevels = [...new Set(classInfoList.map(info => info.level))];
        const uniqueClasses = [...new Set(classInfoList.map(info => info.class))];
        const uniqueCounsellors = [...new Set(classInfoList.map(info => info.counsellor))];
        const uniqueFaculty = [...new Set(classInfoList.map(info => info.faculty))]
        return { uniqueFaculty, uniqueGrades, uniqueLevels, uniqueClasses, uniqueCounsellors };
    } catch (error) {
        console.error("Error fetching unique info:", error);
        throw error;
    }
}

router.post('/order', async (req, res) => {
    const { order } = req.body;
    try {
        for (let i = 0; i < order.length; i++) {
            const article = await activeDB.findById(order[i]);
            article.order = i;
            await article.save();
        }
        res.json({ message: '排序更新成功' });
    } catch (error) {
        res.status(500).json({ message: '排序更新失败', error: error.message });
    }
});

router.get('/classInfo', async (req, res) => {
    try {
        // 文章分页
        let { page, perPage } = req.query
        let pages = +page || 1
        let perPages = +perPage || 5
        const total = await ClassInfo.countDocuments()
        let doc = await ClassInfo
            .find({}, {}, {
                sort: { isRead: 1, createdAt: -1 }, // 先按isRead升序排列,再按createdAt降序排列
                skip: perPages * (pages - 1),
                limit: perPages,
            })

        res.send({
            code: 0,
            msg: "请求完成",
            data: doc, total
        })

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// GET 请求处理程序
router.get('/getClassInfo', async (req, res) => {
    try {

        // 从请求中获取分页参数，设置默认值
        const page = parseInt(req.query.page) || 1; // 当前页码
        const perPage = parseInt(req.query.perPage) || 10; // 每页显示的条数
        const skip = (page - 1) * perPage; // 计算跳过的条目数

        // 查询所有的课程反馈信息，使用 skip 和 perPage 实现分页
        const allCourseFeedback = await courseFeedbackDB.find({ termName: semesterCourseUtils() })
            .skip(skip)
            .limit(perPage)
            .sort({
                createdAt: -1
            })

        if (!allCourseFeedback || allCourseFeedback.length === 0) {
            return res.status(404).json({ message: '未找到任何课程反馈信息' });
        }

        // 创建一个新的数组来存储带有 counsellor 信息的课程反馈
        const courseFeedbackWithCounsellor = [];

        for (let feedback of allCourseFeedback) {
            const { grade, class: className, level } = feedback;

            // 查询 ClassInfo 记录
            const classInfo = await classInfoDB.findOne({ grade, class: className, level });

            // 如果找到对应的 ClassInfo 记录，则将 counsellor 信息添加到反馈中
            if (classInfo) {
                feedback = feedback.toObject(); // 将 Mongoose 文档转换为普通对象
                feedback.counsellor = classInfo.counsellor; // 添加 counsellor 信息
            } else {
                feedback.counsellor = "未找到辅导员"; // 如果没有找到对应的 ClassInfo 记录，设置默认值
            }

            courseFeedbackWithCounsellor.push(feedback); // 将修改后的反馈添加到数组中
        }

        // 获取总记录数，计算总页数
        const totalRecords = await courseFeedbackDB.countDocuments({ termName: semesterCourseUtils() });

        // 返回包含课程反馈信息及其班主任信息的响应
        res.status(200).json({
            data: courseFeedbackWithCounsellor,
            totalRecords // 返回总记录数
        });
    } catch (error) {
        console.error('Error fetching course feedback and class information:', error);
        res.status(500).json({
            success: false,
            message: '内部服务器错误，无法获取课程反馈信息和班主任信息'
        });
    }
});

// GET 请求处理程序
router.get('/getClassInfoWeek', async (req, res) => {
    try {
        // 从请求参数中获取 week 字段的值
        const week = req.query.week;
        // 查询所有的课程反馈信息
        const allCourseFeedback = await courseFeedbackDB.find({ termName: semesterCourseUtils(), week: week });

        if (!allCourseFeedback || allCourseFeedback.length === 0) {
            return res.status(404).json({ message: '未找到任何课程反馈信息' });
        }

        // 创建一个新的数组来存储带有 counsellor 信息的课程反馈
        const courseFeedbackWithCounsellor = [];

        for (let feedback of allCourseFeedback) {
            const { grade, class: className, level } = feedback;

            // 查询 ClassInfo 记录
            const classInfo = await classInfoDB.findOne({ grade, class: className, level });

            // 如果找到对应的 ClassInfo 记录，则将 counsellor 信息添加到反馈中
            if (classInfo) {
                feedback = feedback.toObject(); // 将 Mongoose 文档转换为普通对象
                feedback.counsellor = classInfo.counsellor; // 添加 counsellor 信息
            } else {
                feedback.counsellor = "未找到辅导员"; // 如果没有找到对应的 ClassInfo 记录，设置默认值
            }

            courseFeedbackWithCounsellor.push(feedback); // 将修改后的反馈添加到数组中
        }

        // 返回包含课程反馈信息及其班主任信息的响应
        res.status(200).json(courseFeedbackWithCounsellor);
    } catch (error) {
        console.error('Error fetching course feedback and class information:', error);
        res.status(500).json({
            success: false,
            message: '内部服务器错误，无法获取课程反馈信息和班主任信息'
        });
    }
});


// // 查询每个学生在整个学期的缺课课时数
// router.get('/studentAbsenceSummary', async (req, res) => {
//     try {
//         const { termName } = req.query;

//         let classInfos = await classInfoDB.find({});
//         let summary = [];

//         for (let classInfo of classInfos) {
//             const { grade, class: className, level, counsellor } = classInfo;
//             let query = { grade, class: className, level };
//             if (termName) {
//                 query.termName = termName;
//             }

//             let feedbacks = await courseFeedbackDB.find(query);
//             let studentAbsence = {};
//             let totalAbsences = 0;
//             let totalCourses = 0;

//             feedbacks.forEach(feedback => {
//                 const { course, results } = feedback;
//                 const sectionCount = course.sectionCount;

//                 results.forEach(result => {
//                     const { _id: studentId, name, status } = result;
//                     if (status === 'absent') {
//                         if (!studentAbsence[studentId]) {
//                             studentAbsence[studentId] = { name, absentCourseCount: 0 };
//                         }
//                         studentAbsence[studentId].absentCourseCount += sectionCount;
//                         totalAbsences += sectionCount;
//                     }
//                 });

//                 totalCourses += sectionCount * results.length;
//             });

//             let sectionCountName = Object.values(studentAbsence);
//             let remarks = totalAbsences === 0 ? '无缺课情况' : '';

//             summary.push({
//                 counsellor,
//                 grade,
//                 className: `${className}`,
//                 level,
//                 sectionCountName,
//                 remarks
//             });
//         }

//         // 按辅导员排序
//         summary.sort((a, b) => a.counsellor.localeCompare(b.counsellor));

//         res.json(summary);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });
router.get('/studentAbsenceSummary', async (req, res) => {
    try {
        const { termName } = req.query;

        let classInfos = await classInfoDB.find( excludeClass() );
        let summary = [];

        for (let classInfo of classInfos) {
            const { grade, class: className, level, counsellor } = classInfo;
            let query = { grade, class: className, level };
            if (termName) {
                query.termName = termName;
            }

            let feedbacks = await courseFeedbackDB.find(query);
            let studentAbsence = {};
            let totalAbsences = 0;
            let totalCourses = 0;
            let unprovidedCount = 0; // 统计未提供的次数

            feedbacks.forEach(feedback => {
                const { course, results, isProvide } = feedback;
                const sectionCount = course.sectionCount;

                // 统计未提供的次数
                if (isProvide) {
                    unprovidedCount += 1; // 每次未提供计数加1
                }

                results.forEach(result => {
                    const { _id: studentId, name, status } = result;
                    if (status === 'absent') {
                        if (!studentAbsence[studentId]) {
                            studentAbsence[studentId] = { name, absentCourseCount: 0 };
                        }
                        studentAbsence[studentId].absentCourseCount += sectionCount;
                        totalAbsences += sectionCount;
                    }
                });

                totalCourses += sectionCount * results.length;
            });

            let sectionCountName = Object.values(studentAbsence);
            let remarks = totalAbsences === 0 ? '无缺课情况' : '';

            summary.push({
                counsellor,
                grade,
                className: `${className}`,
                level,
                sectionCountName,
                remarks,
                unprovidedCount // 将未提供的次数加入到汇总中
            });
        }

        // 按辅导员排序
        summary.sort((a, b) => a.counsellor.localeCompare(b.counsellor));

        res.json(summary);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 查询特定学生在本学期的请假和缺席课程
router.get('/studentCourseAbsence', async (req, res) => {
    try {
        const { userId, grade, class: className, level } = req.query;
        console.log(userId, grade, className, level)
        if (!userId || !grade || !className || !level) {
            return res.status(400).json({ error: 'Missing required query parameters' });
        }

        let query = {

            grade,
            class: className,
            level,
        };

        let feedbacks = await courseFeedbackDB.find(query);
        let absences = feedbacks.reduce((acc, feedback) => {
            const { course, results } = feedback;
            results.forEach(result => {
                if (result._id.toString() === userId && (result.status === 'leave' || result.status === 'absent')) {
                    acc.push({
                        courseName: course.name,
                        termName: feedback.termName,
                        status: result.status,
                        date: feedback.createdAt,
                    });
                }
            });
            return acc;
        }, []);

        res.json(absences);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get("/searchClass", async (req, res) => {
    try {
        const { grade, className, level } = req.query;
        // 确保所有参数都存在
        if (!grade || !className || !level) {
            return res.status(400).json({ message: "缺少必需的参数" });
        }

        // 执行查询
        const users = await classInfoDB.find({ grade, class: className, level });

        res.json(users);
    } catch (error) {
        console.error("查询用户时出错:", error);
        res.status(500).json({ message: "内部服务器错误" });
    }
});

router.get("/searchClassAll", async (req, res) => {
    const { query } = req.query;

    try {
        const results = await classInfoDB.searchClass(query);
        res.send({
            code: 0,
            msg: "请求完成",
            data: results
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "服务器错误" });
    }
});

router.get('/processedData', async (req, res) => {
    try {
        const allData = await classInfoDB.find();

        // 创建一个空对象来存储处理后的数据
        const processedData = {};

        // 倒序处理数据
        allData.reverse().forEach(item => {
            // 如果年级尚未存在，则初始化
            if (!processedData[item.grade]) {
                processedData[item.grade] = {};
            }
            // 如果班级尚未存在，则初始化为一个空数组
            if (!processedData[item.grade][item.class]) {
                processedData[item.grade][item.class] = [];
            }
            // 将层次添加到班级对应的层次数组中
            if (!processedData[item.grade][item.class].includes(item.level)) {
                processedData[item.grade][item.class].push(item.level);
            }
        });

        res.json(processedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/attendance/week', async (req, res) => {
    const { week,termName } = req.query;

    try {
        // 查找本周的课程反馈数据
        const feedbackData = await courseFeedbackDB.find({ week,termName});

        // 查找所有班级信息
   
        const allClassInfo = await classInfoDB.find(excludeClass());

        

        // 创建一个映射以便快速查找班级信息
        const classInfoMap = {};
        allClassInfo.forEach(classInfo => {
            const { grade, class: className, level, counsellor } = classInfo;
            classInfoMap[`${grade}-${className}-${level}`] = {
                counsellor,
                grade,
                className,
                level
            };
        });

        // 提取反馈班级信息
        const feedbackClasses = feedbackData.map(f => ({
            grade: f.grade,
            class: f.class,
            level: f.level,
            counsellor: classInfoMap[`${f.grade}-${f.class}-${f.level}`]?.counsellor || "未知", // 通过映射获取辅导员
            termName: f.termName,
            course: f.course,
            shouldAttend: f.shouldAttend,
            week: f.week,
            weekday: f.weekday,
            actualAttend: f.actualAttend,
            absent: f.absent,
            leave: f.leave,
            checker: f.checker,
            isProvide: f.isProvide,
            remarks: f.remarks,
            results: f.results,
            createdAt: f.createdAt,
        }));

        // 获取未在反馈中查到的班级
        const missingClasses = allClassInfo.filter(classInfo => 
            !feedbackClasses.some(f => 
                f.class === classInfo.class && f.grade === classInfo.grade && f.level === classInfo.level
            )
        ).map(classInfo => ({
            grade: classInfo.grade,
            class: classInfo.class,
            level: classInfo.level,
            counsellor: classInfo.counsellor, // 使用 classInfoDB 的辅导员
            termName: "暂无", // 或者其他默认值
            course: {},
            shouldAttend: 0,
            week: week,
            weekday: null,
            actualAttend: 0,
            absent: 0,
            leave: 0,
            checker: null,
            isProvide: false,
            remarks: null,
            results: [],
            createdAt: null
        }));

        // 合并反馈班级和缺失班级
        const result = [...feedbackClasses, ...missingClasses];

        // 按辅导员、班级和年级倒序排序
        result.sort((a, b) => {
            if (a.counsellor === b.counsellor) {
                if (a.class === b.class) {
                    return b.grade.localeCompare(a.grade); // 倒序按年级排序
                }
                return a.class.localeCompare(b.class); // 如果辅导员相同，按班级排序
            }
            return a.counsellor.localeCompare(b.counsellor); // 按辅导员排序
        });

        // 最终按年级倒序排序
        result.sort((a, b) => b.grade.localeCompare(a.grade));

        // 返回最终结果
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router



