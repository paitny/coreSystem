const express = require("express")
const router = express.Router()
const path = require('path')
const fs = require("fs")
const userDB = require("../../db/user")
const visitorDB = require("../../db/visitor")
const newsDB = require("../../db/news")
const musicDB = require("../../db/music")
const activeDB = require("../../db/activity")
const volunteerDB = require("../../db/volunteer")
const StudentOrgDB = require('../../db/studentOrg'); // 引入学生组织模型
const departmentDB = require("../../db/department")
const courseDB = require("../../db/course")
const alumnusDB = require("../../db/alumnus")
const UserExam = require("../../db/userExam");
const trendDB = require("../../db/trends")
const footDB = require("../../db/foot")
const noticeDB = require("../../db/notice")
const semesterDB = require("../../db/semester")
const svgCaptcha = require('svg-captcha');
const gradeClassDB = require("../../db/GradeClass");
const PunchinLocation = require("../../db/PunchinLocation")
const Punchin = require("../../db/Punchin")
const publishedIssues = require('../../db/publishedIssues')
const aiCourseDB = require("../../db/aiCourse")
const provinceMap = {
    'Anhui': '安徽',
    'Beijing': '北京',
    'Chongqing': '重庆',
    'Fujian': '福建',
    'Gansu': '甘肃',
    'Guangdong': '广东',
    'Guangxi': '广西',
    'Guizhou': '贵州',
    'Hainan': '海南',
    'Hebei': '河北',
    'Heilongjiang': '黑龙江',
    'Henan': '河南',
    'Hong Kong': '中国香港',
    'Hubei': '湖北',
    'Hunan': '湖南',
    'Inner Mongolia': '内蒙古',
    'Jiangsu': '江苏',
    'Jiangxi': '江西',
    'Jilin': '吉林',
    'Liaoning': '辽宁',
    'Macau': '澳门',
    'Ningxia': '宁夏',
    'Qinghai': '青海',
    'Shaanxi': '陕西',
    'Shandong': '山东',
    'Shanghai': '上海',
    'Shanxi': '山西',
    'Sichuan': '四川',
    'Taiwan': '中国台湾',
    'Tianjin': '天津',
    'Tibet': '西藏',
    'Xinjiang': '新疆',
    'Yunnan': '云南',
    'Zhejiang': '浙江'
};

const semesterCourseUtils = require("../../utils/semesterCourseUtils")
const courseFeedbackDB = require("../../db/CourseFeedback");
const classInfoDB = require("../../db/ClassInfo");

//是否禁用某个接口
let allowVideoAccess = true;
router.get("/toggleVideoAccess", (req, res) => {
    try {
        allowVideoAccess = !allowVideoAccess; // 切换接口状态
        res.send({
            code: 0,
            msg: "接口状态已切换",
            allowVideoAccess: allowVideoAccess,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
});
// 定义一个路由来获取省份信息
router.get('/province', async (req, res) => {

    try {
        // 使用 IP 地址定位服务来获取省份信息
        let {ip} = req.query
        console.log(ip)
        
        const province = ip // 提取省份信息; // 提取省份信息
        res.send({
            data: province
        });
    } catch (error) {
        res.status(500).send('无法获取省份信息');
    }
});
// 返回项目功能数组
router.get('/feature', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../../dataJson/feature.json'))
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
})


//通过id请求对应的用户
router.get("/userId", async (req, res) => {
    let {id} = req.query
    try {
        let doc = await userDB
            .findById(id)
            .populate("user._id", {pass: 0, __v: 0})

        res.send({
            code: 0,
            msg: "请求完成",
            data: doc
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
})
//请求visitor
router.get("/visitor", async (req, res) => {
    try {
        //文章分页
        let {page, perPage} = req.query
        let pages = +page || 1
        let perPages = +perPage || 5
        const total = await visitorDB.countDocuments()
        let doc = await visitorDB
            .find({}, {}, {
                sort: {date: -1}, skip: perPages * (pages - 1),
                limit: perPages,
            })
            .populate("visitor", {pass: 0, __v: 0})

        res.send({
            code: 0,
            msg: "请求完成",
            data: doc, total
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
})
//请求体育新闻
router.get("/news", async (req, res) => {
    try {
        //文章分页
        let {page, perPage} = req.query
        let pages = +page || 1
        let perPages = +perPage || 5
        let doc = await newsDB.find(
            {},
            {},
            {
                skip: perPages * (pages - 1),
                limit: perPages,
                sort: {_id: -1}
            }
        )
        //计算文章的总页数
        const total = await newsDB.countDocuments()
        res.send({
            code: 0,
            msg: "请求成功",
            data: doc, total
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
})
//请求所有文章
router.get("/newsAll", async (req, res) => {
    try {
        let doc = await newsDB.find({}, {}, {sort: {date: -1}})
        res.send({
            code: 0,
            msg: "请求成功",
            data: doc
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
})
//请求id对应的新闻
router.get("/newsId", async (req, res) => {
    let {id} = req.query
    let doc = null
    try {
        doc = await newsDB.findById(id)
        if (doc) {

            //pv + 1
            await newsDB.findByIdAndUpdate(id, {$inc: {pv: 1}})

            res.send({
                code: 0,
                msg: "新闻查询成功",
                data: {doc}
            })
        } else {
            res.send({
                code: 11,
                msg: "新闻查询失败"
            })
        }
    } catch (e) {
        if (e.kind === "ObjectId") {
            res.send({
                code: 11,
                msg: "新闻查询失败"
            })
        } else {
            res.send({
                code: 4,
                msg: "服务器错误，请稍后再试"
            })
        }
    }

})
//文章分类
router.get("/itNews/class", async (req, res) => {
    let {newClass} = req.query
    try {
        let doc = await newsDB.find({class: newClass}, {}, {sort: {date: 1}})
        res.send({
            code: 0,
            msg: "请求成功",
            data: doc
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
})
//获取游览量最高的6篇文章
router.get("/newsLimit", async (req, res) => {
    try {
        let doc = await newsDB.find().sort({pv: -1}).limit(6)
        res.send({
            code: 0,
            msg: "请求成功",
            data: doc
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
})
//请求所有音乐信息进行分页操作
router.get("/music", async (req, res) => {
    //文章分页
    let {page, perPage} = req.query
    try {
        let pages = +page || 1
        let perPages = +perPage || 5
        let doc = await musicDB.find(
            {},
            {},
            {
                skip: perPages * (pages - 1),
                limit: perPages,
                sort: {_id: -1}
            }
        )
        const total = await musicDB.countDocuments()
        res.send({
            code: 0,
            msg: "请求完成",
            data: doc, total
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
})
//音乐展示
router.get("/musicAll", async (req, res) => {
    try {
        let doc = await musicDB.find({}, {}, {sort: {_id: -1}})
        res.send({
            code: 0,
            msg: "请求完成",
            data: doc
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
})

//请求志愿者活动接口
router.get("/activeData", async (req, res) => {

    //活动分页
    let {page, perPage} = req.query
    try {
        let pages = +page || 1
        let perPages = +perPage || 5
        let doc = await activeDB.find(
            {},
            {},
            {
                skip: perPages * (pages - 1),
                limit: perPages,
                sort: {_id: -1}
            }
        )
        const total = await activeDB.countDocuments()
        res.send({
            code: 0,
            msg: "请求完成",
            data: doc, total
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
})


router.get("/volunteerInfo", async (req, res) => {

    //活动分页
    let {id} = req.query
    try {
        let doc = await volunteerDB.find({activityId: id})
        res.send({
            code: 0,
            msg: "请求完成",
            data: doc
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
})

// router.get("/newActive", async (req, res) => {
//     let Semester = getCurrentSemester();
//
//
//     try {
//         // 使用find获取最新的15条audit为true的活动记录
//         let docs = await activeDB.find({
//             currentSemester: Semester,
//             audit: true // 新增的条件：audit必须为true
//         }, {}).sort({date: -1}).limit(15); // sort按date降序排列，并限制返回15条记录
//
//         if (docs.length > 0) {
//             res.send({
//                 code: 0,
//                 msg: "请求完成",
//                 data: docs // 返回查询到的活动数据列表
//             });
//         } else {
//             res.status(404).send({
//                 code: -1,
//                 msg: "未找到符合条件活动数据"
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({error: '服务器错误'});
//     }
// });
//课表数据

router.post('/batchInsert', async (req, res) => {
    try {
        // 更新数据库中的所有文档，添加 transpire: true 字段
        await activeDB.updateMany({}, { $set: { transpire: true } });
        res.send('已为数据库中的数据添加新字段成功。');
    } catch (error) {
        res.status(500).send('添加新字段时出错。');
    }
});
router.get('/newActive', async (req, res) => {
    const {semester} = req.query;
    const {page} = req.query || 1; // 获取当前页码,默认为第一页
    const limit = 10; // 每页返回的记录数
    const skip = (page - 1) * limit; // 计算需要跳过的记录数

    try {
        const docs = await activeDB
            .find({
                currentSemester: semester,
                audit: true,
                transpire:true
            })
            .sort({date: -1})
            .skip(skip)
            .limit(limit);

        const total = await activeDB.countDocuments({
            currentSemester: semester,
            audit: true,
            transpire:true
        });
        console.log(total)
        res.status(200).json({
            code: 0,
            msg: '请求完成',
            data: {
                list: docs,
                total
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: '服务器错误'});
    }
});
router.get("/course", async (req, res) => {
    const {userId, termName} = req.query; // 如果参数作为查询字符串传递
    console.log(userId, termName)
    // 或者使用以下方式获取参数，如果参数在请求体中传递
    // const { userId, termName } = req.body;

    if (!userId || !termName) {
        return res.status(400).json({error: '缺少必需的参数'});
    }

    try {
        // 在这里执行你的数据查询操作，使用 userId 和 termName
        // 例如，你可以使用 Mongoose 查询数据库
        const result = await courseDB.findOne({userId, termName});

        if (!result) {
            return res.status(404).json({error: '未找到匹配的数据'});
        }
        let startTime = '2024/9/2'
        // 返回查询结果给前端
        res.send({
            code: 200,
            data: {result, startTime},
            msg: "请求成功"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({error: '服务器错误'});
    }
});
router.get("/alternative", async (req, res) => {
    const {grade, className, level, termName} = req.query; // 如果参数作为查询字符串传递
    // 或者使用以下方式获取参数，如果参数在请求体中传递
    // const { userId, termName } = req.body;
    console.log(grade, className, level, termName)
    if (!grade || !className || !level || !termName) {
        return res.status(400).json({error: '缺少必需的参数'});
    }

    try {
        // 在这里执行你的数据查询操作，使用 userId 和 termName
        // 例如，你可以使用 Mongoose 查询数据库
        const result = await aiCourseDB.findOne({grade, className, level, termName});

        if (!result) {
            return res.status(404).json({error: '未找到匹配的数据'});
        }
        let startTime = '2024/9/2'
        // 返回查询结果给前端
        res.send({
            code: 200,
            data: {result, startTime},
            msg: "请求成功"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({error: '服务器错误'});
    }
});
router.get("/search", async (req, res) => {
    const {query} = req.query;

    try {
        const results = await newsDB.searchNews(query);

        res.send({
            code: 0,
            msg: "请求完成",
            data: {results}
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "服务器错误"});
    }
});

// router.get("/searchActive", async (req, res) => {
//     const {query} = req.query;
//
//     try {
//         const results = await activeDB.searchActivity(query);
//
//         res.send({
//             code: 0,
//             msg: "请求完成",
//             data: {results}
//         })
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({error: "服务器错误"});
//     }
// });


router.get("/searchActive", async (req, res) => {
    const {query, userId, currentSemester} = req.query;
    try {
        const user = await userDB.findById(userId);

        if (!user) {
            return res.status(404).json({msg: "用户不存在", code: -1});
        }

        let searchQuery = {
            $or: [
                {title: {$regex: query, $options: 'i'}},
                {address: {$regex: query, $options: 'i'}},
                {description: {$regex: query, $options: 'i'}}
            ],
            currentSemester,
            audit: true
        };

        if (!user.admin && user.position && user.position.includes("负责人")||user.position.includes("部长")) {
            searchQuery.userId = userId;
        }

        const results = await activeDB.find(searchQuery)
            .populate('userId', 'name position')
            .sort({date: -1});

        for (let i = 0; i < results.length; i++) {
            const activityId = results[i]._id;
            const totalVolunteers = await volunteerDB.countDocuments({activityId});
            const signedVolunteers = await volunteerDB.countDocuments({activityId, checkInTime: {$ne: null}});

            const studentIds = await volunteerDB.distinct("ID", {activityId});
            const studentLeaderCount = await userDB.countDocuments({num: {$in: studentIds}, isCadre: true});

            const unsignedVolunteers = totalVolunteers - signedVolunteers;
            const UnparticipatedStudentsCadre = await userDB.countDocuments({isCadre: true}) - studentLeaderCount;

            results[i].volunteerCounts = {
                activityId,
                totalVolunteers,
                signedVolunteers,
                unsignedVolunteers,
                UnparticipatedStudentsCadre,
                studentLeaderVolunteers: studentLeaderCount,
            };
        }

        res.status(200).json({
            code: 202,
            msg: "请求成功",
            data: {list: results, total: results.length}
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({code: -1, msg: "服务器错误"});
    }
});

// 路由处理请求所有学生组织的数据
router.get('/getAllStudentOrgs', async (req, res) => {
    try {
        // 使用 Mongoose 的 .find() 方法查询所有学生组织数据
        const studentOrgs = await StudentOrgDB.find();

        // 将查询到的数据返回给客户端
        res.json(studentOrgs);
    } catch (error) {
        // 如果发生错误，返回错误信息
        res.status(500).json({error: '无法获取学生组织数据'});
    }
});

router.get("/departments", async (req, res) => {

    //活动分页
    let {id} = req.query
    try {
        let doc = await departmentDB.find({studentOrgId: id})
        res.send({
            code: 0,
            msg: "请求完成",
            data: doc
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
})

router.get("/departmentInfo", async (req, res) => {
    let {id} = req.query
    try {
        let doc = await departmentDB.findById(id)
        res.send({
            code: 0,
            msg: "请求完成",
            data: doc
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
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
        res.status(500).json({message: '内部服务器错误'});
    }
})

// router.get("/query", async (req, res) => {
//     try {
//         const {due, institution, position} = req.query;
//
//         // 构建查询条件对象
//         const query = {};
//         if (due) {
//             query.due = due;
//         }
//         if (institution) {
//             query.institution = institution;
//         }
//         if (position) {
//             // 去掉包含"负责人|干事|部长|副部长|学生办公室主任|副书记|主席|副主席"的部分
//             query.position = {$regex: position.replace(/(负责人|干事|部长|副部长|学生办公室主任|副书记|主席|副主席)/g, ""), $options: "i"};
//         }
//
//          const users = await userDB.find(query).select("-pass").exec();
//
//         res.json(users);
//
//     } catch (error) {
//         res.status(500).json({error: "Internal Server Error"});
//     }
// });
router.get("/query", async (req, res) => {
    try {
        const {due, institution, position} = req.query;

        // 构建查询条件对象
        const query = {};
        if (due) {
            query.due = due;
        }
        if (institution) {
            query.institution = institution;
        }
        if (position) {
            // 使用正则表达式进行模糊匹配
            const regexPattern = position.replace(/(负责人|干事|部长|副部长|学生办公室主任|副书记|主席|副主席|队长|副队长)/g, "");
            query.position = {$regex: regexPattern, $options: "i"};
        }

        let users = await userDB.find(query).select("-pass").exec();  // 调用自定义排序函数

        function customSort(data) {
            /**
             * 定义职位排序的优先级顺序
             */
            const roleOrder = {
                "副书记": 1,
                "学生办公室主任": 2,
                "主席": 3,
                "副主席": 4,
                "部长": 5,
                "副部长": 6,
                "队长": 7,
                "副队长": 8,
                "干事": 9
            };
            const regex = /(\S+)/; // 匹配非空白字符

            return data.sort((a, b) => {
                const matchA = a.position.match(regex);
                const matchB = b.position.match(regex);

                // 获取职位名称
                const roleA = matchA ? matchA[0] : null;
                const roleB = matchB ? matchB[0] : null;

                // 确定排序值
                const orderA = roleA && roleOrder[roleA] !== undefined ? roleOrder[roleA] : Infinity;
                const orderB = roleB && roleOrder[roleB] !== undefined ? roleOrder[roleB] : Infinity;

                if (orderA !== Infinity && orderB !== Infinity) {
                    return orderA - orderB;
                } else {
                    // 如果职位在排序规则中未找到，按字符串进行比较
                    return a.position.localeCompare(b.position);
                }
            });
        }

        res.json(customSort(users));

    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

// router.get("/query", async (req, res) => {
//     try {
//         const { due, institution, position } = req.query;
//
//         // 构建查询条件对象
//         const query = {};
//         if (due) {
//             query.due = due;
//         }
//         if (institution) {
//             query.institution = institution;
//         }
//         if (position) {
//             // 去掉包含"负责人|干事|部长|副部长|学生办公室主任|副书记|主席|副主席"的部分
//             const regexPattern = position.replace(/(负责人|干事|部长|副部长|学生办公室主任|副书记|主席|副主席)/g, "");
//             query.position = {$regex: regexPattern, $options: "i"};
//         }
//
//         let users = await userDB.find(query).select("-pass").exec();
//
//         // 定义职位排序的优先级顺序
//         const positionOrder = {
//             "副书记": 1,
//             "学生办公室主任": 2,
//             "主席": 3,
//             "副主席": 4,
//             "部长": 5,
//             "副部长": 6,
//             "队长": 7,
//             "副队长": 8
//         };
//
//         // 根据职位排序
//         users.sort((a, b) => {
//             const priorityA = getPositionPriority(a.position);
//             const priorityB = getPositionPriority(b.position);
//             return priorityA - priorityB;
//         });
//
//         function getPositionPriority(position) {
//             for (const key in positionOrder) {
//                 if (position.includes(key)) {
//                     return positionOrder[key];
//                 }
//             }
//             // 没有匹配到任何关键词，默认最低优先级
//             return Number.MAX_SAFE_INTEGER;
//         }
//
//         res.json(users);
//
//     } catch (error) {
//         // 提供更详细的错误信息
//         res.status(500).json({ error: `Internal Server Error: ${error.message}` });
//     }
// });
// router.get("/searchUser", async (req, res) => {
//     const {query, userId} = req.query;
//
//     try {
//         const user = await userDB.findById(userId);
//         const results = await userDB.searchUser(query);
//         if (results.length === 0) {
//             return res.send({
//                 code: 4,
//                 msg: "暂无相关数据",
//                 data: []
//             })
//         } else if (results.length > 1000) {
//             return res.send({
//                 code: 6,
//                 msg: "搜索无效，请换个关键字",
//                 data: []
//             })
//         } else if (user && user.admin === true) {
//             res.send({
//                 code: 0,
//                 msg: "查询成功",
//                 data: results || []
//             });
//         } else {
//             res.send({
//                 code: 1,
//                 msg: "您不是管理员",
//                 data: []
//             });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({error: "服务器错误"});
//     }
// });

router.get("/searchUser", async (req, res) => {
    const {query, userId} = req.query;
    console.log(req.query)
    const {page} = req.query || 1; // 获取当前页码,默认为第一页
    const limit = 10; // 每页返回的记录数
    const skip = (page - 1) * limit; // 计算需要跳过的记录数
    try {
        const user = await userDB.findById(userId);
        const results = await userDB.searchUser(query)

            .sort({date: -1}) // 根据日期降序排序
            .skip(skip)
            .limit(limit)
            .exec()
        const total = await userDB.searchUser(query).countDocuments()

        if (user && user.admin === true || ['学习部', '秘书处'].includes(user.position)) {
            res.send({
                code: 0,
                msg: "加载成功",
                data: {list: results, total}
            });
        } else {
            res.send({
                code: 1,
                msg: "您不是管理员",
                data: []
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "服务器错误"});
    }
});

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

router.post("/studentQuantification", async (req, res) => {
    const {grade, userClass, levels, semester} = req.body
    // const grade = "2023级";
    // const userClass = "计算机科学与技术1班";
    // const levels = "本";
    try {


        let usersData = await userDB.find({
            grade: grade,
            class: userClass,
            levels: levels

        }).sort({user: 1}).exec();
        let activitiesData = await volunteerDB.find({semester: semester});
        let updatedUsersData = await updateUsersWithActivities(usersData, activitiesData);

        res.send({
            code: 0,
            msg: "获取成功",
            data: updatedUsersData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
});
// 定义一个根据固定学号获取用户信息的路由
router.get('/getUserByFixedNum', async (req, res) => {
    const fixedStudentNumbers = [
        '213817310403', 
        '231060150133',
        '231060150135',
        '221060250109',
        '231060860429',
        '221060250108',
        '221060860127', 
        '211060450120', 
        '213817311132', 
        '211060150310'
    ];

    try {
        const userInfo = await userDB.aggregate([
            {
                $match: { num: { $in: fixedStudentNumbers } } // 匹配指定的学号
            },
            {
                $addFields: {
                    order: { $indexOfArray: [fixedStudentNumbers, "$num"] } // 添加排序字段
                }
            },
            {
                $sort: { order: 1 } // 按照排序字段进行排序
            },
            {
                $project: {
                    pass: 0, // 从结果中排除 'pass' 字段
                    order: 0 // 可选：排除排序字段
                }
            }
        ]);

        if (!userInfo || userInfo.length === 0) {
            return res.status(404).json({ message: '未找到用户' });
        }

        return res.status(200).json(userInfo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: '服务器内部错误' });
    }
});

// 定义一个根据固定学号获取用户信息的路由
router.get('/getUserByFixedNumForCourse', async (req, res) => {
    const fixedStudentNumbers = ['213817310403', '221030350108', '213817311132', '221030350125', '221030350113'];

    try {
        const userInfo = await userDB.find(
            {num: {$in: fixedStudentNumbers}}, // $in 用于匹配指定的学号
            {pass: 0} // 从结果中排除 'pass' 字段
        );

        if (!userInfo || userInfo.length === 0) {
            return res.status(404).json({message: '未找到用户'});
        }

        return res.status(200).json(userInfo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: '服务器内部错误'});
    }
});
router.get('/getStatistics', async (req, res) => {
    try {
        let {num, userId} = req.query;
        let volunteerCount = await volunteerDB.find({ID: num}).countDocuments()
        let trendCount = await trendDB.find({publisherId: userId}).countDocuments()
        let courseCount = await newsDB.find({collects: userId}).countDocuments()
        let userFoots = await footDB.find({userId}).countDocuments()
        res.send({
            msg: "请求成功",
            code: 200,
            data: {volunteerCount, trendCount, courseCount, userFoots}

        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: '服务器内部错误'});
    }
})


// 获取用户的足迹数据
router.get('/footprints', async (req, res) => {
    try {
        const {userId} = req.query;

        // 查询用户的浏览记录，并按照 timestamp 字段倒序排序
        const viewedNews = await footDB.find({userId}).sort({timestamp: -1});


        // 获取浏览记录对应的新闻详情，并保持与 viewedNews 中顺序一致
        const footprints = [];
        for (const view of viewedNews) {
            const newsDetail = await newsDB.findById(view.newsId);
            if (newsDetail) {
                // 添加 timestamp 字段到新闻详情对象中
                newsDetail.timestamp = view.timestamp;
                footprints.push(newsDetail);
            }
        }

        res.send({
            code: 0,
            msg: "请求完成",
            data: footprints
        });
    } catch (error) {
        res.status(500).json({success: false, error: 'Server Error'});
    }
});


router.post('/foot', async (req, res) => {
    try {
        const {newsId, userId} = req.body;

        const news = await newsDB.findById(newsId);
        if (!news) {
            return res.status(404).json({success: false, error: 'News not found'});
        }

        // 更新用户的浏览记录，并将timestamp字段更新为当前时间
        await footDB.findOneAndUpdate(
            {newsId, userId}, // 查询条件
            {$set: {timestamp: Date.now()}}, // 更新操作，将timestamp字段更新为当前时间
            {upsert: true} // 如果记录不存在，则创建新记录
        );

        // 更新新闻的访问量
        await news.addVisit(userId);

        res.status(200).json({success: true, news});
    } catch (error) {
        res.status(500).json({success: false, error: 'Server Error'});
    }
});
// 获取最新发布的通知
router.get('/latestNotice', async (req, res) => {
    try {
        const latestNotice = await noticeDB.findOne().sort({date: -1});
        if (latestNotice) {
            res.json(latestNotice);
        } else {
            res.status(404).json({message: 'No notices found'});
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});
// 定义获取学期数据的接口
router.get('/semesters', async (req, res) => {
    try {
        // 查询数据库获取所有学期数据
        const semesters = await semesterDB.find();

        // 返回学期数据给客户端
        res.status(200).json({
            success: true,
            data: semesters,
        });
    } catch (error) {
        // 如果查询出错，返回错误信息给客户端
        console.error('获取学期数据时出错:', error);
        res.status(500).json({
            success: false,
            message: '获取学期数据时出错',
        });
    }
});
//自行导入学生干部空闲时间识别
// function ScheduleForCadres(students) {
//     const schedule = [];
//     const weeksRange = { start: 1, end: 5 };
//     const sectionsRange = { start: 1, end: 8 };
//
//     for (let week = weeksRange.start; week <= weeksRange.end; week++) {
//         for (let section = sectionsRange.start; section <= sectionsRange.end; section++) {
//             const availableCadres = [];
//
//             students.forEach((student) => {
//                 if (student.isCadre) {
//                     // 检查学生在这个时间段是否有课，考虑sectionCount
//                     const isBusy = student.coursesList.some((course) => {
//                         return course.week === week &&
//                             section >= course.section &&
//                             section < course.section + course.sectionCount&&
//                             course.weeks.some(weekNum => weekNum >= 1 && weekNum <= 20);
//
//                     });
//
//                     if (!isBusy) {
//                         // 如果学生在这个时间段没有课，将他们的信息添加到availableCadres数组中
//                         availableCadres.push(`${student.institution} ${student.position} ${student.name}`);
//                     }
//                 }
//             });
//
//             // 如果在这个时间段有可用的学生干部，则创建一个时间段对象并添加到结果数组中
//             if (availableCadres.length > 0) {
//                 const timeSlot = {
//                     week,
//                     section,
//                     // 这里不再需要sectionCount，因为它已经在课程信息中定义
//                     availableCadres, // 使用availableCadres而不是userInfo，以更清晰地表达意图
//                 };
//                 schedule.push(timeSlot);
//             }
//         }
//     }
//
//     return schedule; // 返回生成的时间表数组
// }

// function generateScheduleForCadres(students) {
//     const schedule = [];
//     const weeksRange = { start: 1, end: 5 };
//     const sectionsRange = { start: 1, end: 8 };
//     const selectedStudents = new Map(); // 使用 Map 以便存储选择次数
//
//     // 提取生成学生唯一键的逻辑到单独的函数
//     function getStudentKey(student) {
//         return `${student.institution}-${student.position}-${student.name}`;
//     }
//
//     // 初始化选择次数跟踪
//     students.forEach(student => {
//         if (student.isCadre) {
//             const key = getStudentKey(student);
//             selectedStudents.set(key, { count: 0, student });
//         }
//     });
//
//     // 提取检查学生是否有课的逻辑到单独的函数
//     function isStudentAvailableDuringTimeslot(student, week, section) {
//         return !student.coursesList.some(course => {
//             return course.week === week &&
//                 section >= course.section &&
//                 section < course.section + course.sectionCount &&
//                 course.weeks.some(weekNum => weekNum >= 1 && weekNum <= 20);
//         });
//     }
//
//     // 辅助函数：获取学生的选择次数
//     function getSelectionCount(student) {
//         return selectedStudents.get(getStudentKey(student)).count;
//     }
//
//     for (let week = weeksRange.start; week <= weeksRange.end; week++) {
//         for (let section = sectionsRange.start; section <= sectionsRange.end; section++) {
//             // 获取所有可用的学生干部，并根据他们的选择次数进行排序
//             let availableCadres = Array.from(selectedStudents.values())
//                 .map(entry => entry.student)
//                 .filter(student => isStudentAvailableDuringTimeslot(student, week, section));
//
//             // 根据选择次数排序，选择次数最少的在前
//             availableCadres.sort((a, b) => getSelectionCount(a) - getSelectionCount(b));
//
//             // 如果在这个时间段有可用的学生干部，则选择两个并创建一个时间段对象
//             if (availableCadres.length >= 2) {
//                 // 在选择次数最少的学生干部中随机选择两个
//                 const minSelectionCount = getSelectionCount(availableCadres[0]);
//                 const selectedCadresCandidates = availableCadres.filter(cadre => getSelectionCount(cadre) === minSelectionCount);
//                 const selectedCadres = selectedCadresCandidates.sort(() => Math.random() - 0.5).slice(0, 2);
//
//                 // 更新被选择学生干部的选择次数
//                 selectedCadres.forEach(cadre => {
//                     const key = getStudentKey(cadre);
//                     selectedStudents.set(key, { count: getSelectionCount(cadre) + 1, student: cadre });
//                 });
//
//                 const timeSlot = {
//                     week,
//                     section,
//                     availableCadres: selectedCadres.map(cadre => `${cadre.institution} ${cadre.position} ${cadre.name}`),
//                 };
//                 schedule.push(timeSlot);
//             }
//         }
//     }
//
//     return schedule; // 返回生成的时间表数组
// }

// function generateScheduleForCadres(students) {
//     const schedule = [];
//     const weeksRange = { start: 1, end: 5 };
//     const sectionsRange = { start: 1, end: 8 };
//     const timeSlots = []; // 存储所有时间段及其可用学生干部的列表
//     const selectedStudents = new Map(); // 跟踪学生干部的选择次数
//
//     // 初始化选择次数跟踪和时间段列表
//     students.forEach(student => {
//         if (student.isCadre) {
//             const key = `${student.institution}-${student.position}-${student.name}`;
//             selectedStudents.set(key, { count: 0, student });
//         }
//     });
//     function isStudentAvailableDuringTimeslot(student, week, section) {
//         return !student.coursesList.some(course => {
//             return course.week === week &&
//                 section >= course.section &&
//                 section < course.section + course.sectionCount &&
//                 course.weeks.some(weekNum => weekNum >= 1 && weekNum <= 20);
//         });
//     }
//     // 生成时间段列表，每个时间段包含可用学生干部的列表
//     for (let week = weeksRange.start; week <= weeksRange.end; week++) {
//         for (let section = sectionsRange.start; section <= sectionsRange.end; section++) {
//             const availableCadres = Array.from(selectedStudents.values())
//                 .map(entry => entry.student)
//                 .filter(student => isStudentAvailableDuringTimeslot(student, week, section));
//             timeSlots.push({ week, section, availableCadres });
//         }
//     }
//
//     // 根据可用学生干部的数量对时间段进行排序
//     timeSlots.sort((a, b) => a.availableCadres.length - b.availableCadres.length);
//
//     // 处理时间段并分配学生干部
//     while (timeSlots.length > 0) {
//         // 获取具有最少可用学生干部的时间段
//         const timeSlot = timeSlots.shift(); // 移除并返回数组的第一个元素
//         if (timeSlot.availableCadres.length < 2) {
//             // 如果可用学生干部少于2人，则跳过该时间段或采取其他措施
//             continue;
//         }
//
//         // 在可用学生干部中随机选择两个（可以进一步优化为选择选择次数最少的）
//         const selectedCadres = shuffleArray(timeSlot.availableCadres).slice(0, 2);
//
//         // 更新被选择学生干部的选择次数和剩余时间段的可用学生干部列表
//         selectedCadres.forEach(cadre => {
//             const key = `${cadre.institution}-${cadre.position}-${cadre.name}`;
//             selectedStudents.set(key, { count: selectedStudents.get(key).count + 1, student: cadre });
//             updateAvailableCadresForRemainingTimeSlots(timeSlots, cadre, false); // 将此学生干部标记为不可用
//         });
//
//         // 创建一个时间段对象并添加到日程表中
//         const scheduledTimeSlot = {
//             week: timeSlot.week,
//             section: timeSlot.section,
//             availableCadres: selectedCadres.map(cadre => `${cadre.institution} ${cadre.position} ${cadre.name}`),
//         };
//         schedule.push(scheduledTimeSlot);
//     }
//
//     return schedule; // 返回生成的时间表数组
// }
//
// // 辅助函数：打乱数组顺序（Fisher-Yates shuffle）
// function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
// }
//
// // 辅助函数：更新剩余时间段的可用学生干部列表
// function updateAvailableCadresForRemainingTimeSlots(timeSlots, excludedCadre, isAvailable) {
//     timeSlots.forEach(timeSlot => {
//         timeSlot.availableCadres = timeSlot.availableCadres.filter(cadre => {
//             return cadre !== excludedCadre || isAvailable; // 如果isAvailable为false，则排除excludedCadre；否则包含它。
//         });
//     });
// }
//
// // 注意：isStudentAvailableDuringTimeslot 函数需要您根据实际情况实现，以检查学生干部在给定的时间段是否有空。
//
// router.get('/students-without-courses', async (req, res) => {
//     try {
//
//         // 从查询参数中获取termName
//         const termName = semesterCourseUtils();
//         // 执行查询
//         const coursesAll = await courseDB.find({
//             termName: termName,
//             isCadre: true,
//             $nor: [
//                 { institution: "学生分会", position: "秘书处干事" },
//                 // 如果还有其他需要同时排除的机构和职位组合，可以继续添加
//             ],
//             $and: [
//                 { position: { $not: { $regex: '负责人' } } },
//                 { position: { $not: { $regex: '队长' } } },
//                 { position: { $not: { $regex: '辩论队' } } },
//                 { position: { $not: { $regex: '青年志愿者分队' } } },
//                 { position: { $not: { $regex: '组织部' } } },
//             ],
//
//
//             institution: { $in: ['学生分会', '分团委', '校友分会'] }
//         });
//         const courses = generateScheduleForCadres(coursesAll)
//         // 返回查询结果
//         res.status(200).json(courses);
//
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// });
//


// router.get('/without-courses', async (req, res) => {
//     try {
//         // 从查询参数中获取termName
//         const termName = semesterCourseUtils();
//         // 执行查询
//         const coursesAll = await courseDB.find({
//             termName: termName,
//             isCadre: true,
//             $nor: [
//                 { institution: "学生分会", position: "秘书处干事" },
//                 // 如果还有其他需要同时排除的机构和职位组合，可以继续添加
//             ],
//             $and: [
//                 { position: { $not: { $regex: '负责人' } } },
//                 { position: { $not: { $regex: '队长' } } },
//                 { position: { $not: { $regex: '辩论队' } } },
//                 { position: { $not: { $regex: '青年志愿者分队' } } },
//                 { position: { $not: { $regex: '组织部' } } },
//             ],
//
//
//             institution: { $in: ['学生分会', '分团委', '校友分会'] }
//         });
//         const courses = ScheduleForCadres(coursesAll)
//         // 返回查询结果
//         res.status(200).json(courses);
//
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// });

router.get('/students-without-courses', async (req, res) => {
    try {
        const {startWeek,endWeek,peopleNum}=req.query
        console.log(startWeek,endWeek,peopleNum)
        // 从查询参数中获取termName
        const termName = semesterCourseUtils();

        // 从用户表中查找所有是干部的学生
        const users = await userDB.find({
            isCadre: true,
            $nor: [
                {institution: "学生分会", position: "秘书处干事"},
                // 如果还有其他需要同时排除的机构和职位组合，可以继续添加
            ],
            $and: [
                {position: {$not: {$regex: '负责人'}}},
                {position: {$not: {$regex: '部长'}}},
                {position: {$not: {$regex: '书记'}}},
                {position: {$not: {$regex: '队长'}}},
                {position: {$not: {$regex: '主席'}}},
                {position: {$not: {$regex: '分团委学生办公室主任'}}},
                {position: {$not: {$regex: '会长'}}},
                {position: {$not: {$regex: '辩论队'}}},
                {position: {$not: {$regex: '青年志愿者服务中心'}}},
                {position: {$not: {$regex: '组织部'}}},
            ],
            institution: {$in: ['学生分会', '分团委', '校友分会']}
        });

        // 用于存储所有学生的课程信息
        let coursesAll = [];

        // 根据年级、班级和学期获取每个学生的课程信息
        for (const user of users) {
            const courses = await aiCourseDB.find({
                grade: user.grade,
                className: user.class,
                level: user.levels,
                termName: termName
            });
            user.coursesList = courses.length > 0 ? courses[0].coursesList : [];
            coursesAll.push(user);
        }

        const courses = generateScheduleForCadres(coursesAll,startWeek,endWeek,peopleNum);
        // 返回查询结果
        res.status(200).json(courses);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});
router.get('/students-without-courses-max', async (req, res) => {
    try {
        // 从查询参数中获取termName
        const {startWeek,endWeek,peopleNum}=req.query
        const termName = semesterCourseUtils();

        // 从用户表中查找所有是干部的学生
        const users = await userDB.find({
            isCadre: true,
            $nor: [
                {institution: "学生分会", position: "秘书处干事"},
                {institution: "学生分会", position: "体育部部长",name:"邵忆粤"},
                {institution: "学生分会", position: "体育部副部长",name:"舒棋"},
                {institution: "学生分会", position: "对外联络部副部长",name:"王沁茹"}
                // 如果还有其他需要同时排除的机构和职位组合，可以继续添加

            ],
            $and: [
                {position: {$not: {$regex: '书记'}}},
                {position: {$not: {$regex: '主席'}}},
                {position: {$not: {$regex: '分团委学生办公室主任'}}},
                {position: {$not: {$regex: '会长'}}},
                {position: {$not: {$regex: '干事'}}},


            ],
            institution: {$in: ['学生分会', '分团委', '校友分会']}
        });

        // 用于存储所有学生的课程信息
        let coursesAll = [];

        // 根据年级、班级和学期获取每个学生的课程信息
        for (const user of users) {
            const courses = await aiCourseDB.find({
                grade: user.grade,
                className: user.class,
                level: user.levels,
                termName: termName
            });
            user.coursesList = courses.length > 0 ? courses[0].coursesList : [];
            coursesAll.push(user);
        }

        const courses = generateScheduleForCadres(coursesAll,startWeek,endWeek,peopleNum);
        // 返回查询结果
        res.status(200).json(courses);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});
function generateScheduleForCadres(students,startWeek,endWeek,peopleNum) {
    const schedule = [];
    const weeksRange = {start:1 , end: 5};
    const sectionsRange = {start: 1, end: 8};
    const timeSlots = []; // 存储所有时间段及其可用学生干部的列表
    const selectedStudents = new Map(); // 跟踪学生干部的选择次数

    // 初始化选择次数跟踪和时间段列表
    students.forEach(student => {
        if (student.isCadre) {
            const key = `${student.institution}-${student.position}-${student.name}`;
            selectedStudents.set(key, {count: 0, student});
        }
    });

    function isStudentAvailableDuringTimeslot(student, week, section) {
        return !student.coursesList.some(course => {
            return course.week === week &&
                section >= course.section &&
                section < course.section + course.sectionCount &&
                course.weeks.some(weekNum => weekNum >= startWeek && weekNum <= endWeek);
        });
    }

    // 生成时间段列表，每个时间段包含可用学生干部的列表
    for (let week = weeksRange.start; week <= weeksRange.end; week++) {
        for (let section = sectionsRange.start; section <= sectionsRange.end; section++) {
            const availableCadres = Array.from(selectedStudents.values())
                .map(entry => entry.student)
                .filter(student => isStudentAvailableDuringTimeslot(student, week, section));
            timeSlots.push({week, section, availableCadres});
        }
    }

    // 根据可用学生干部的数量对时间段进行排序
    timeSlots.sort((a, b) => a.availableCadres.length - b.availableCadres.length);

    // 处理时间段并分配学生干部
    while (timeSlots.length > 0) {
        // 获取具有最少可用学生干部的时间段
        const timeSlot = timeSlots.shift(); // 移除并返回数组的第一个元素
        if (timeSlot.availableCadres.length < peopleNum) {
            // 如果可用学生干部少于2人，则跳过该时间段或采取其他措施
            continue;
        }

        // 在可用学生干部中随机选择两个（可以进一步优化为选择选择次数最少的）
        const selectedCadres = shuffleArray(timeSlot.availableCadres).slice(0, peopleNum);

        // 更新被选择学生干部的选择次数和剩余时间段的可用学生干部列表
        selectedCadres.forEach(cadre => {
            const key = `${cadre.institution}-${cadre.position}-${cadre.name}`;
            selectedStudents.set(key, {count: selectedStudents.get(key).count + 1, student: cadre});
            updateAvailableCadresForRemainingTimeSlots(timeSlots, cadre, false); // 将此学生干部标记为不可用
        });

        // 创建一个时间段对象并添加到日程表中
        const scheduledTimeSlot = {
            week: timeSlot.week,
            section: timeSlot.section,
            availableCadres: selectedCadres.map(cadre => `${cadre.institution} ${cadre.position} ${cadre.name}`),
        };
        schedule.push(scheduledTimeSlot);
    }

    return schedule; // 返回生成的时间表数组
}

// 辅助函数：打乱数组顺序（Fisher-Yates shuffle）
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 更新剩余时间段中的可用学生干部列表
function updateAvailableCadresForRemainingTimeSlots(timeSlots, selectedCadre, available) {
    timeSlots.forEach(timeSlot => {
        timeSlot.availableCadres = timeSlot.availableCadres.filter(cadre =>
            cadre.name !== selectedCadre.name ||
            cadre.institution !== selectedCadre.institution ||
            cadre.position !== selectedCadre.position
        );
    });
}


router.get('/without-courses', async (req, res) => {
    try {
        // 从查询参数中获取termName
        const {startWeek,endWeek}=req.query
        const termName = semesterCourseUtils();
        console.log(startWeek,endWeek )
        // 从用户表中查找所有是干部的学生
        const users = await userDB.find({
            isCadre: true,
            // $nor: [
            //     {institution: "学生分会", position: "秘书处干事"},
            //     // 如果还有其他需要同时排除的机构和职位组合，可以继续添加
            // ],
            $and: [
                {position: {$not: {$regex: '干事'}}},
                // {position: {$not: {$regex: '队长'}}},
                // {position: {$not: {$regex: '辩论队'}}},
                // {position: {$not: {$regex: '青年志愿者服务中心'}}},
                // {position: {$not: {$regex: '组织部'}}},
            ],
            institution: {$in: ['学生分会', '分团委', '校友分会']}
        });

        // 用于存储所有学生的课程信息
        let coursesAll = [];

        // 根据年级、班级和学期获取每个学生的课程信息
        for (const user of users) {
            const courses = await aiCourseDB.find({
                grade: user.grade,
                className: user.class,
                level: user.levels,
                termName: termName
            });
            user.coursesList = courses.length > 0 ? courses[0].coursesList : [];
            coursesAll.push(user);
        }

        const courses = ScheduleForCadres(coursesAll,startWeek,endWeek);

        // 返回查询结果
        res.status(200).json(courses);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});
router.get('/without-courses-thing', async (req, res) => {
    try {
        // 从查询参数中获取termName

        const termName = semesterCourseUtils();
        const {startWeek,endWeek}=req.query
        // 从用户表中查找所有是干部的学生
        const users = await userDB.find({
            isCadre: true,
            // $nor: [
            //     // {institution: "学生分会", position: "秘书处干事"},
            //     // 如果还有其他需要同时排除的机构和职位组合，可以继续添加
            // ],
            $and: [
                {position: {$not: {$regex: '部长'}}},
                {position: {$not: {$regex: '分团委学生办公室主任'}}},
                {position: {$not: {$regex: '书记'}}},
                 {position: {$not: {$regex: '负责人'}}},
                {position: {$not: {$regex: '主席'}}},
                {position: {$not: {$regex: '队长'}}},
                 {position: {$not: {$regex: '会长'}}},
            ],
            institution: {$in: ['学生分会', '分团委', '校友分会']}
        });

        // 用于存储所有学生的课程信息
        let coursesAll = [];

        // 根据年级、班级和学期获取每个学生的课程信息
        for (const user of users) {
            const courses = await aiCourseDB.find({
                grade: user.grade,
                className: user.class,
                level: user.levels,
                termName: termName
            });
            user.coursesList = courses.length > 0 ? courses[0].coursesList : [];
            coursesAll.push(user);
        }

        const courses = ScheduleForCadres(coursesAll,startWeek,endWeek);

        // 返回查询结果
        res.status(200).json(courses);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});
function ScheduleForCadres(students,startWeek,endWeek) {

    const schedule = [];
    const weeksRange = {start: 1, end: 5};
    const sectionsRange = {start: 1, end: 8};

    for (let week = weeksRange.start; week <= weeksRange.end; week++) {
        for (let section = sectionsRange.start; section <= sectionsRange.end; section++) {
            const availableCadres = [];

            students.forEach((student) => {
                if (student.isCadre) {
                    // 检查学生在这个时间段是否有课，考虑sectionCount
                    const isBusy = student.coursesList.some((course) => {
                        return course.week === week &&
                            section >= course.section &&
                            section < course.section + course.sectionCount &&
                            course.weeks.some(weekNum => weekNum >= startWeek && weekNum <= endWeek);
                    });

                    if (!isBusy) {
                        // 如果学生在这个时间段没有课，将他们的信息添加到availableCadres数组中
                        availableCadres.push(`${student.institution} ${student.position} ${student.name}`);
                    }
                }
            });

            // 如果在这个时间段有可用的学生干部，则创建一个时间段对象并添加到结果数组中
            if (availableCadres.length > 0) {
                const timeSlot = {
                    week,
                    section,
                    // 这里不再需要sectionCount，因为它已经在课程信息中定义
                    availableCadres, // 使用availableCadres而不是userInfo，以更清晰地表达意图
                };
                schedule.push(timeSlot);
            }
        }
    }

    return schedule; // 返回生成的时间表数组
}


// 设置svg图片
router.get("/getSvg", (req, res) => {
    // 创建svg图片
    let captcha = svgCaptcha.create({
        size: 4,
        ignoreChars: '0o1i',
        noise: 2,
        background: '#cc9966',
        width: 100, // 验证码的宽度
        height: 40,
    });
    let {text, data} = captcha

    res.send({code: 1, text, data})
})


router.post('/quantization', async (req, res) => {
    try {
        // 使用 updateMany 更新所有文档
        await activeDB.updateMany({}, {$set: {quantization: true}});

        res.json({
            message: `Updated documents`,
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
});

// 获取所有年级、班级和层次数据
router.get('/gradeClass', async (req, res) => {
    try {
        const data = await gradeClassDB.find({}, {grade: 1, classNames: 1, levels: 1, _id: 0});
        res.json(data);
    } catch (error) {
        console.error('获取数据时出错:', error);
        res.status(500).json({error: '服务器内部错误'});
    }
});

// 获取所有年级、班级和层次数据
router.get('/deleteMissingPass', async (req, res) => {
    try {
        // 查找并删除缺少 pass 字段的用户数据
        const result = await userDB.deleteMany({pass: {$exists: false}});

        res.status(200).json({
            message: `成功删除 ${result.deletedCount} 条缺少 pass 字段的用户数据`,
        });
    } catch (error) {
        console.error('获取数据时出错:', error);
        res.status(500).json({error: '服务器内部错误'});
    }
});


// 处理打卡请求
router.post('/punchin', async (req, res) => {
    const {latitude, longitude} = req.body;
    const punchin = new Punchin({latitude, longitude});
    try {
        await punchin.save();
        res.status(200).send('打卡成功');
    } catch (err) {
        res.status(500).send('服务器错误');
    }
});

// 保存打卡位置
router.post('/punchin-location', async (req, res) => {
    const {latitude, longitude} = req.body;

    const location = new PunchinLocation({latitude, longitude});
    try {
        await location.save();
        res.status(200).send('打卡位置保存成功');
    } catch (err) {
        res.status(500).send('服务器错误');
    }
});

// 获取打卡位置
router.get('/punchin-location', async (req, res) => {
    try {
        const locations = await PunchinLocation.find({});
        res.status(200).json(locations);
    } catch (err) {
        res.status(500).send('服务器错误');
    }
});


// // 定义 /getIP 路由
router.get('/getIP', (req, res) => {

    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // 响应数据
    res.json({clientIP});
});

const jsonFilePath = path.join(__dirname, '../../dataJson/students.json')


// 读取JSON文件
function readJSONFile() {
    return new Promise((resolve, reject) => {
        fs.readFile(jsonFilePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

// 写入JSON文件
function writeJSONFile(data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// 获取所有学生信息
router.get('/students', async (req, res) => {
    try {
        const data = await readJSONFile();
        res.json({student: data.student, user: data.user});
    } catch (err) {
        res.status(500).send('Error reading data');
    }
});

// 根据ID获取学生信息
router.get('/students/:id', async (req, res) => {
    try {
        const data = await readJSONFile();
        const student = data.student.find(s => s.id === req.params.id);
        if (student) {
            res.json(student);
        } else {
            res.status(404).send('Student not found');
        }
    } catch (err) {
        res.status(500).send('Error reading data');
    }
});

// 添加新的学生
router.post('/students', async (req, res) => {
    try {
        const newStudent = req.body;
        const data = await readJSONFile();
        data.student.push(newStudent);
        await writeJSONFile(data);
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(500).send('Error writing data');
    }
});

// 更新学生信息
router.put('/students/:id', async (req, res) => {
    try {
        const data = await readJSONFile();
        const studentIndex = data.student.findIndex(s => s.id === req.params.id);
        if (studentIndex !== -1) {
            data.student[studentIndex] = req.body;
            await writeJSONFile(data);
            res.json(data.student[studentIndex]);
        } else {
            res.status(404).send('Student not found');
        }
    } catch (err) {
        res.status(500).send('Error writing data');
    }
});

// 删除学生
router.delete('/students/:id', async (req, res) => {
    try {
        const data = await readJSONFile();
        const studentIndex = data.student.findIndex(s => s.id === req.params.id);
        if (studentIndex !== -1) {
            const deletedStudent = data.student.splice(studentIndex, 1);
            await writeJSONFile(data);
            res.json(deletedStudent);
        } else {
            res.status(404).send('Student not found');
        }
    } catch (err) {
        res.status(500).send('Error writing data');
    }
});

router.get('/grades', async (req, res) => {
    try {
        const {name, num} = req.query;
        if (!name || !num) {
            return res.status(400).json({message: '名字和学号为必填项'});
        }

        // 查找用户
        const user = await userDB.findOne({name, num});
        if (!user) {
            return res.status(404).json({message: '用户不存在'});
        }
        let examId = '664386abda1c49f06964f466'
        // 查找成绩
        const userExam = await UserExam.findOne({userId: user._id, examineId: examId});
        if (!userExam) {
            return res.status(404).json({message: '该同学未参加考核'});
        }

        // 查找所有学生在同一考试中的成绩，计算排名
        const allExams = await UserExam.find({examineId: examId}).sort({totalScore: -1});
        const exam = await publishedIssues.findById(examId)
        let rank = 1;
        let previousScore = null;
        let sameRankCount = 0;

        for (let i = 0; i < allExams.length; i++) {
            if (allExams[i].totalScore !== previousScore) {
                rank += sameRankCount;
                sameRankCount = 0;
                previousScore = allExams[i].totalScore;
            }

            if (allExams[i].userId.toString() === user._id.toString()) {
                break;
            }

            sameRankCount++;
        }

        const {singleChoiceScore, fillScore, essayScore, thinkingScore, totalScore} = userExam;

        res.json({
            termTopic: exam.termTopic,
            singleChoiceScore,
            fillScore,
            essayScore,
            thinkingScore,
            totalScore,
            institution: user.institution,
            department: user.position,
            name: user.name,
            num: user.num,
            rank
        });
    } catch (error) {
        console.error('Error fetching grades:', error);
        res.status(500).json({message: '内部服务器错误'});
    }
});

router.get("/searchClassUser", async (req, res) => {
    const {query, userId, grade, class: userClass, levels} = req.query;

    try {
        const user = await userDB.findById(userId);
        const searchQuery = {
            ...(query && {$text: {$search: query}}),
            ...(grade && {grade}),
            ...(userClass && {class: userClass}),
            ...(levels && {levels})
        };

        const results = await userDB.find(searchQuery).sort({date: -1}).exec();
        const total = await userDB.countDocuments(searchQuery);

        if (user && (user.admin === true || ['学习部干事', '学习部部长', '学习部副部长', '学习部负责人', '秘书处负责人', '秘书处部长', '秘书处副部长'].includes(user.position))) {
            res.send({
                code: 0,
                msg: "加载成功",
                data: {list: results, total}
            });
        } else {
            res.send({
                code: 1,
                msg: "您不是管理员",
                data: []
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "服务器错误"});
    }
});
// GET 请求处理程序
// router.get('/getClassInfo', async (req, res) => {
//     try {
//         const {termName,userId}=req.query
//         const {page} = req.query || 1; // 获取当前页码,默认为第一页
//         const limit = 10; // 每页返回的记录数
//         const skip = (page - 1) * limit; // 计算需要跳过的记录数
//         // 查询所有的课程反馈信息
//         const allCourseFeedback = await courseFeedbackDB.find({termName}).skip(skip)
//             .limit(limit);
//         const total=await courseFeedbackDB.countDocuments()
//         if (!allCourseFeedback || allCourseFeedback.length === 0) {
//             return res.status(404).json({ message: '未找到任何课程反馈信息' });
//         }
//
//         // 创建一个新的数组来存储带有 counsellor 信息的课程反馈
//         const courseFeedbackWithCounsellor = [];
//
//         for (let feedback of allCourseFeedback) {
//             const { grade, class: className, level } = feedback;
//
//             // 查询 ClassInfo 记录
//             const classInfo = await classInfoDB.findOne({ grade, class: className, level });
//
//             // 如果找到对应的 ClassInfo 记录，则将 counsellor 信息添加到反馈中
//             if (classInfo) {
//                 feedback = feedback.toObject(); // 将 Mongoose 文档转换为普通对象
//                 feedback.counsellor = classInfo.counsellor; // 添加 counsellor 信息
//             } else {
//                 feedback.counsellor = "未找到辅导员"; // 如果没有找到对应的 ClassInfo 记录，设置默认值
//             }
//
//             courseFeedbackWithCounsellor.push(feedback); // 将修改后的反馈添加到数组中
//         }
//
//         // 返回包含课程反馈信息及其班主任信息的响应
//
//         res.status(200).json({
//             success: true,
//             data: courseFeedbackWithCounsellor,
//             total
//         });
//     } catch (error) {
//         console.error('Error fetching course feedback and class information:', error);
//         res.status(500).json({
//             success: false,
//             message: '内部服务器错误，无法获取课程反馈信息和班主任信息'
//         });
//     }
// });

// router.get('/getClassInfo', async (req, res) => {
//     try {
//         const { termName, userId,week } = req.query;
//         console.log(termName, userId,week  )
//         const { page } = req.query || 1;
//         const limit = 10;
//         const skip = (page - 1) * limit;
//
//         // 查询用户信息
//         const user = await userDB.findById(userId);
//
//         if (!user) {
//             return res.status(404).json({ message: '未找到用户信息' });
//         }
//
//         let allCourseFeedback;
//
//         // 如果用户是管理员，返回本学期所有数据
//         if (user.admin === true) {
//             allCourseFeedback = await courseFeedbackDB.find({ termName,week }).skip(skip).limit(limit);
//         } else if (user.position === '学习部干事') {
//             // 如果用户是学习部干事，根据 userId 获取数据
//             allCourseFeedback = await courseFeedbackDB.find({ userId,week }).skip(skip).limit(limit);
//         } else {
//             // 查询用户作为辅导员管理的班级信息
//             const classInfo = await classInfoDB.findOne({ counsellor: user.name });
//             console.log(classInfo)
//             if (!classInfo) {
//                 return res.status(404).json({ message: '未找到班级信息' });
//             }
//
//             // 返回该班级的数据
//             allCourseFeedback = await courseFeedbackDB.find({ termName, week,grade:classInfo.grade,class:classInfo.class,level:classInfo.level })
//                 .skip(skip).limit(limit);
//         }
//
//         const total = await courseFeedbackDB.countDocuments({ termName, week });
//
//         if (!allCourseFeedback || allCourseFeedback.length === 0) {
//             return res.status(404).json({ message: '未找到任何课程反馈信息' });
//         }
//
//         // 创建一个新的数组来存储带有 counsellor 信息的课程反馈
//         const courseFeedbackWithCounsellor = [];
//
//         for (let feedback of allCourseFeedback) {
//             const { grade, class: className, level } = feedback;
//
//             // 查询 ClassInfo 记录
//             const classInfo = await classInfoDB.findOne({ grade, class: className, level });
//
//             // 如果找到对应的 ClassInfo 记录，则将 counsellor 信息添加到反馈中
//             if (classInfo) {
//                 feedback = feedback.toObject(); // 将 Mongoose 文档转换为普通对象
//                 feedback.counsellor = classInfo.counsellor; // 添加 counsellor 信息
//             } else {
//                 feedback.counsellor = "未找到辅导员"; // 如果没有找到对应的 ClassInfo 记录，设置默认值
//             }
//
//             courseFeedbackWithCounsellor.push(feedback); // 将修改后的反馈添加到数组中
//         }
//
//         // 返回包含课程反馈信息及其班主任信息的响应
//         res.status(200).json({
//             success: true,
//             data: courseFeedbackWithCounsellor,
//             total
//         });
//     } catch (error) {
//         console.error('Error fetching course feedback and class information:', error);
//         res.status(500).json({
//             success: false,
//             message: '内部服务器错误，无法获取课程反馈信息和班主任信息'
//         });
//     }
// });

// router.get('/getClassInfo', async (req, res) => {
//     try {
//         const {termName, userId, week} = req.query;
//         const {page} = req.query || 1;

//         const limit = 10;
//         const skip = (page - 1) * limit;

//         // 查询用户信息
//         const user = await userDB.findById(userId);

//         if (!user) {
//             return res.status(404).json({message: '未找到用户信息'});
//         }

//         let allCourseFeedback;

//         // 如果用户是管理员，返回本学期所有数据
//         if (user.admin === true) {
//             allCourseFeedback = await courseFeedbackDB.find({termName, week}).skip(skip).limit(limit);
//         } else if (user.position === '学习部干事') {
//             // 如果用户是学习部干事，根据 userId 获取数据
//             allCourseFeedback = await courseFeedbackDB.find({userId, week}).skip(skip).limit(limit);
//         } else {
//             // 查询用户作为辅导员管理的班级信息
//             const classInfo = await classInfoDB.find({counsellor: user.name});
//             if (!classInfo || classInfo.length === 0) {
//                 return res.status(404).json({message: '未找到班级信息'});
//             }

//             // 获取所有班级的课程反馈数据
//             const feedbackQueries = classInfo.map(info => {
//                 return courseFeedbackDB.find({
//                     termName,
//                     week,
//                     grade: info.grade,
//                     class: info.class,
//                     level: info.level
//                 }).skip(skip).limit(limit);
//             });

//             // 并行执行所有的查询
//             const results = await Promise.all(feedbackQueries);
//             // 合并结果数组
//             allCourseFeedback = results.reduce((acc, val) => acc.concat(val), []);
//         }

//         const total = await courseFeedbackDB.countDocuments({termName, week});

//         if (!allCourseFeedback || allCourseFeedback.length === 0) {
//             return res.status(404).json({message: '未找到任何课程反馈信息'});
//         }

//         // 创建一个新的数组来存储带有 counsellor 信息的课程反馈
//         const courseFeedbackWithCounsellor = [];

//         for (let feedback of allCourseFeedback) {
//             const {grade, class: className, level} = feedback;

//             // 查询 ClassInfo 记录
//             const classInfo = await classInfoDB.findOne({grade, class: className, level});

//             // 如果找到对应的 ClassInfo 记录，则将 counsellor 信息添加到反馈中
//             if (classInfo) {
//                 feedback = feedback.toObject(); // 将 Mongoose 文档转换为普通对象
//                 feedback.counsellor = classInfo.counsellor; // 添加 counsellor 信息
//             } else {
//                 feedback.counsellor = "未找到辅导员"; // 如果没有找到对应的 ClassInfo 记录，设置默认值
//             }

//             courseFeedbackWithCounsellor.push(feedback); // 将修改后的反馈添加到数组中
//         }

//         // 返回包含课程反馈信息及其班主任信息的响应
//         res.status(200).json({
//             success: true,
//             data: courseFeedbackWithCounsellor,
//             total
//         });
//     } catch (error) {
//         console.error('Error fetching course feedback and class information:', error);
//         res.status(500).json({
//             success: false,
//             message: '内部服务器错误，无法获取课程反馈信息和班主任信息'
//         });
//     }
// });
router.get('/getClassInfo', async (req, res) => {
    try {
        const {termName, userId, week} = req.query;
        const {page} = req.query || 1;

        const limit = 10;
        const skip = (page - 1) * limit;

        // 查询用户信息
        const user = await userDB.findById(userId);

        if (!user) {
            return res.status(404).json({message: '未找到用户信息'});
        }

        let allCourseFeedback;

        // 如果用户是管理员，返回本学期所有数据
        if (user.admin === true) {
            allCourseFeedback = await courseFeedbackDB.find({termName, week}).skip(skip).limit(limit).sort({ createdAt: -1 });
        } else if (user.position === '学习部干事') {
            // 如果用户是学习部干事，根据 userId 获取数据
            allCourseFeedback = await courseFeedbackDB.find({userId, week}).skip(skip).limit(limit).sort({ createdAt: -1 });
        } else {
            // 查询用户作为辅导员管理的班级信息
            const classInfo = await classInfoDB.find({counsellor: user.name});
            if (!classInfo || classInfo.length === 0) {
                return res.status(404).json({message: '未找到班级信息'});
            }

            // 获取所有班级的课程反馈数据
            const feedbackQueries = classInfo.map(info => {
                return courseFeedbackDB.find({
                    termName,
                    week,
                    grade: info.grade,
                    class: info.class,
                    level: info.level
                }).skip(skip).limit(limit).sort({ createdAt: -1 });
            });

            // 并行执行所有的查询
            const results = await Promise.all(feedbackQueries);
            // 合并结果数组
            allCourseFeedback = results.reduce((acc, val) => acc.concat(val), []);
        }

        const total = await courseFeedbackDB.countDocuments({termName, week});

        if (!allCourseFeedback || allCourseFeedback.length === 0) {
            return res.status(404).json({message: '未找到任何课程反馈信息'});
        }

        // 创建一个新的数组来存储带有 counsellor 信息的课程反馈
        const courseFeedbackWithCounsellor = [];

        for (let feedback of allCourseFeedback) {
            const {grade, class: className, level} = feedback;

            // 查询 ClassInfo 记录
            const classInfo = await classInfoDB.findOne({grade, class: className, level});

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
        res.status(200).json({
            success: true,
            data: courseFeedbackWithCounsellor,
            total
        });
    } catch (error) {
        console.error('Error fetching course feedback and class information:', error);
        res.status(500).json({
            success: false,
            message: '内部服务器错误，无法获取课程反馈信息和班主任信息'
        });
    }
});


// 查询每个学生在整个学期的缺课课时数
router.get('/studentAbsenceSummary', async (req, res) => {
    try {
        const {termName} = req.query;

        let classInfos = await classInfoDB.find({});
        let summary = [];

        for (let classInfo of classInfos) {
            const {grade, class: className, level} = classInfo;
            let query = {grade, class: className, level};
            if (termName) {
                query.termName = termName;
            }

            let feedbacks = await courseFeedbackDB.find(query);
            let studentAbsence = {};
            let totalAbsences = 0;
            let totalCourses = 0;

            feedbacks.forEach(feedback => {
                const {course, results} = feedback;
                const sectionCount = course.sectionCount;

                results.forEach(result => {
                    const {_id: studentId, name, status} = result;
                    if (status === 'leave' || status === 'absent') {
                        if (!studentAbsence[studentId]) {
                            studentAbsence[studentId] = {name, absentCourseCount: 0};
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
                grade,
                className: `${className}`,
                level,
                sectionCountName,
                remarks
            });
        }

        res.json(summary);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
});


// 查询特定学生在本学期的请假和缺席课程及总缺课课时数
router.get('/studentCourseAbsence', async (req, res) => {
    try {
        const {userId, grade, class: className, level, termName} = req.query;

        if (!userId || !grade || !className || !level) {
            return res.status(400).json({error: 'Missing required query parameters'});
        }

        let query = {
            grade,
            class: className,
            level,
            termName
        };

        let feedbacks = await courseFeedbackDB.find(query);
        let absences = [];
        let totalAbsentHours = 0;

        feedbacks.forEach(feedback => {
            const {course, results} = feedback;
            results.forEach(result => {
                if (result._id.toString() === userId && (result.status === 'leave' || result.status === 'absent')) {
                    absences.push({
                        courseName: course.name,
                        rawSection: course.rawSection,
                        termName: feedback.termName,
                        week: feedback.week,
                        photo: feedback.photo,
                        status: result.status,
                        date: feedback.createdAt,
                        sectionCount: course.sectionCount,
                    });
                    totalAbsentHours += course.sectionCount;
                }
            });
        });

        res.json({
            absences,
            totalAbsentHours,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
});



// 软删除数据
router.get('/deleted-data', async (req, res) => {
    const collections = ['user', 'yourCollection2']; // 添加所有需要查询的集合
    try {
        const results = await Promise.all(collections.map(async (collection) => {
            return await db.collection(collection).find({ deleted: true }).toArray().then(items =>
                items.map(item => ({ ...item, collection })) // 添加集合名称
            );
        }));

        // 合并所有结果
        const combinedDeleted = results.flat();
        res.json(combinedDeleted);
    } catch (error) {
        res.status(500).json({ message: error.message });
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













module.exports = router









