const express = require("express");
const router = express.Router();
const activityDB = require("../../db/activity");
const volunteerDB = require("../../db/volunteer");
const userDB = require("../../db/user")
const TopItemDB= require('../../db/topItem')
const fs = require("fs")
const path = require("path");
const axios = require('axios');
const multer = require("multer");
let vtCover_upload = multer({
    storage: multer.diskStorage({
        //文件存储的目录
        destination(req, file, cb) {
            cb(null, path.join(__dirname, '../../public/file/vtCover'))
        },
        //文件的名字
        filename(req, file, cb) {
            let { ext } = path.parse(file.originalname)
            req.vtCover_name = `vtCover-${Date.now()}${ext}`
            cb(null, req.vtCover_name)
        }
    })
}).single('file')

const getCurrentSemester = require('../../utils/semesterUtils');

//上传cover封面图
router.post("/cover", (req, res) => {
    try {
        vtCover_upload(req, res, async (err) => {
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
                msg: "cover上传成功",
                url: `/file/vtCover/${req.vtCover_name}`
            })
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
// 创建活动
router.post("/create", async (req, res) => {
    try {
        // 测试函数
        const currentSemester = getCurrentSemester();
        const {
            userId,
            title,
            description,
            address,
            deadline,
            cover,
            isSign,
            isCheckOut,
            startTime,
            limitPerson,
            groupCode,
            groupNum,
            transpire
        } = req.body;

        const activity = new activityDB({
            userId,
            title,
            description,
            cover: cover || undefined,
            address: address || undefined,
            currentSemester,
            deadline,
            isSign,
            isCheckOut,
            startTime,
            limitPerson,
            groupCode: groupCode || undefined,
            groupNum: groupNum || undefined,
            transpire
        });

        await activity.save();

        res.status(201).json({
            code: 0,
            msg: "活动发布成功",
            activity,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: -1,
            msg: "活动发布失败",
        });
    }
})
// 报名参加活动
// router.post("/application", async (req, res) => {
//     try {
//         const {
//             activityId,
//             faculty,
//             name,
//             sex,
//             ID,
//             grade,
//             classes,
//             phoneNumber,
//             counsellor,
//             levels
//
//         } = req.body;
//
//         // 检查活动截止时间
//         const activity = await activityDB.findById(activityId);
//         if (!activity) {
//             return res.status(404).json({code: -2, msg: "活动不存在"});
//         }
//
//         const currentTime = new Date();
//         if (currentTime > activity.deadline) {
//             return res.status(403).json({code: -3, msg: "活动报名已截止"});
//         }
//
//
//         // 检查是否已经报名
//         let existingRegistration = await volunteerDB.findOne({
//             activityId,
//             ID,
//         });
//
//         // 如果已经报名，更新数据
//         if (existingRegistration) {
//             existingRegistration = await volunteerDB.findOneAndUpdate(
//                 {activityId, ID},
//                 {
//                     $set: {
//                         faculty,
//                         name,
//                         sex,
//                         grade,
//                         classes,
//                         phoneNumber,
//                         counsellor,
//                         levels
//                     },
//                 },
//                 {new: true}
//             );
//
//             return res.status(200).json({
//                 code: 1,
//                 msg: "报名信息已更新",
//                 registration: existingRegistration,
//             });
//         }
//         // 获取当前报名人数和活动人数上限
//         const currentRegistrations = await volunteerDB.countDocuments({activityId});
//         const maxParticipants = activity.limitPerson;
//
//         // 判断是否达到人数上限
//         if (currentRegistrations >= maxParticipants) {
//             return res.status(403).json({code: -4, msg: "报名失败,本场活动报名人数已上限"});
//         }
//         // 如果未报名，保存报名信息
//         const registration = await volunteerDB.create({
//             activityId,
//             faculty,
//             name,
//             sex,
//             ID,
//             grade,
//             classes,
//             phoneNumber,
//             counsellor,
//             levels,
//             semester: getCurrentSemester()
//         });
//
//         res.status(201).json({
//             code: 0,
//             msg: "报名成功",
//             registration,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             code: -1,
//             msg: "报名失败",
//         });
//     }
// });

// router.post("/application", async (req, res) => {
//     try {
//         const {
//             activityId,
//             faculty,
//             name,
//             sex,
//             ID,
//             grade,
//             classes,
//             phoneNumber,
//             counsellor,
//             levels
//         } = req.body;
//
//         // 检查活动是否存在
//         const activity = await activityDB.findById(activityId);
//         if (!activity) {
//             return res.status(404).json({code: -2, msg: "活动不存在"});
//         }
//
//         // 检查活动报名截止时间
//         const currentTime = new Date();
//         if (currentTime > activity.deadline) {
//             return res.status(403).json({code: -3, msg: "活动报名已截止"});
//         }
//         // 检查是否已经报名
//         let existingRegistration = await volunteerDB.findOne({
//             activityId,
//             ID,
//         });
//         // 如果已经报名,更新数据
//         if (existingRegistration) {
//             existingRegistration = await volunteerDB.findOneAndUpdate(
//                 {activityId, ID},
//                 {
//                     $set: {
//                         faculty,
//                         name,
//                         sex,
//                         grade,
//                         classes,
//                         phoneNumber,
//                         counsellor,
//                         levels
//                     },
//                 },
//                 {new: true}
//             );
//
//             return res.status(200).json({
//                 code: 1,
//                 msg: "报名信息已更新",
//                 registration: existingRegistration,
//             });
//         }
//         // 检查用户本学期已经报名的活动的签到情况
//         const userRegistrations = await volunteerDB.find({
//             ID,
//             semester: getCurrentSemester(),
//         });
//
//         let noShowCount = 0;
//         for (const registration of userRegistrations) {
//             const activity = await activityDB.findById(registration.activityId);
//             if (activity.isSign && registration.checkInTime === null) {
//                 noShowCount++;
//             }
//         }
//
//         // 如果用户本学期已经超过3次未签到,则不允许报名
//         if (noShowCount >= 3) {
//             return res.status(403).json({code: -5, msg: "报名失败,您本学期已经缺勤3次及以上,无法继续报名"});
//         }
//
//
//         // 获取当前报名人数和活动人数上限
//         const currentRegistrations = await volunteerDB.countDocuments({activityId});
//         const maxParticipants = activity.limitPerson;
//
//         // 判断是否达到人数上限
//         if (currentRegistrations >= maxParticipants) {
//             return res.status(403).json({code: -4, msg: "报名失败,本场活动报名人数已上限"});
//         }
//
//         // 如果未报名,保存报名信息
//         const registration = await volunteerDB.create({
//             activityId,
//             faculty,
//             name,
//             sex,
//             ID,
//             grade,
//             classes,
//             phoneNumber,
//             counsellor,
//             levels,
//             semester: getCurrentSemester()
//         });
//
//         res.status(201).json({
//             code: 0,
//             msg: "报名成功",
//             registration,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             code: -1,
//             msg: "报名失败",
//         });
//     }
// });
//乐观锁
// router.post("/application", async (req, res) => {
//     try {
//         const {
//             activityId,
//             faculty,
//             name,
//             sex,
//             ID,
//             grade,
//             classes,
//             phoneNumber,
//             counsellor,
//             levels
//         } = req.body;
//
//         // 检查活动是否存在
//         const activity = await activityDB.findById(activityId);
//         if (!activity) {
//             return res.status(404).json({ code: -2, msg: "活动不存在" });
//         }
//
//         // 检查活动报名截止时间
//         const currentTime = new Date();
//         if (currentTime > activity.deadline) {
//             return res.status(403).json({ code: -3, msg: "活动报名已截止" });
//         }
//
//         // 检查用户本学期已经报名的活动的签到情况
//         const userRegistrations = await volunteerDB.find({
//             ID,
//             semester: getCurrentSemester(),
//         });
//
//         let noShowCount = 0;
//         for (const registration of userRegistrations) {
//             const activityData = await activityDB.findById(registration.activityId);
//             if (activityData && activityData.isSign && registration.checkInTime === null) {
//                 noShowCount++;
//             }
//         }
//
//         // 如果用户本学期已经超过3次未签到,则不允许报名或更新报名信息
//         if (noShowCount >= 3) {
//             return res.status(403).json({ code: -5, msg: "操作失败,您本学期已经缺勤3次及以上,无法报名或更新报名信息" });
//         }
//
//         // 获取当前报名人数和活动人数上限
//         const currentRegistrations = await volunteerDB.countDocuments({ activityId });
//         const maxParticipants = activity.limitPerson;
//
//         // 检查是否已经报名
//         const existingRegistration = await volunteerDB.findOne({
//             activityId,
//             ID,
//         });
//
//         if (existingRegistration) {
//             // 如果已经报名,更新报名信息
//             const updatedRegistration = await volunteerDB.findOneAndUpdate(
//                 { activityId, ID },
//                 {
//                     $set: {
//                         faculty,
//                         name,
//                         sex,
//                         grade,
//                         classes,
//                         phoneNumber,
//                         counsellor,
//                         levels
//                     },
//                     $inc: { version: 1 } // 使用 $inc 操作符增加版本号
//                 },
//                 { new: true, returnDocument: 'after' }
//             );
//
//             if (updatedRegistration) {
//                 return res.status(200).json({
//                     code: 1,
//                     msg: "报名信息已更新",
//                     registration: updatedRegistration,
//                 });
//             } else {
//                 return res.status(409).json({ code: -7, msg: "报名信息已被修改,请重试" });
//             }
//         } else if (currentRegistrations >= maxParticipants) {
//             // 如果未报名,且人数已达上限,拒绝报名
//             return res.status(403).json({ code: -4, msg: "报名失败,本场活动报名人数已上限" });
//         } else {
//             // 如果未报名,且人数未达上限,保存报名信息
//             const registration = await volunteerDB.create({
//                 activityId,
//                 faculty,
//                 name,
//                 sex,
//                 ID,
//                 grade,
//                 classes,
//                 phoneNumber,
//                 counsellor,
//                 levels,
//                 semester: getCurrentSemester(),
//                 version: 1 // 初始版本号为 1
//             });
//
//             res.status(201).json({
//                 code: 0,
//                 msg: "报名成功",
//                 registration,
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             code: -1,
//             msg: "操作失败",
//         });
//     }
// });

//悲观锁
router.post("/application", async (req, res) => {
    try {
        const {
            activityId,
            faculty,
            name,
            sex,
            ID,
            grade,
            classes,
            phoneNumber,
            counsellor,
            levels
        } = req.body;

        // 检查活动是否存在
        const activity = await activityDB.findById(activityId);
        if (!activity) {
            return res.status(404).json({ code: -2, msg: "活动不存在" });
        }
        //检查活动是否通过审核
        if (activity.audit === false) {
            return res.status(404).json({ code: -2, msg: "活动未通过审核，无法报名，请联系管理员" });
        }
        // 检查活动报名截止时间
        const currentTime = new Date();
        if (currentTime > activity.deadline) {
            return res.status(403).json({ code: -3, msg: "活动报名已截止" });
        }

        // 检查用户本学期已经报名的活动的签到情况
        const userRegistrations = await volunteerDB.find({
            ID,
            semester: getCurrentSemester(),
        });

        let noShowCount = 0;
        for (const registration of userRegistrations) {
            const activityData = await activityDB.findById(registration.activityId);
            if (activityData && activityData.isSign && registration.checkInTime === null) {
                noShowCount++;
            }
        }

        // 如果用户本学期已经超过3次未签到,则不允许报名或更新报名信息
        if (noShowCount >= 3) {
            return res.status(403).json({ code: -5, msg: "报名失败,您本学期已缺勤3次及以上,无法参与活动报名" });
        }

        // 获取当前报名人数和活动人数上限
        const currentRegistrations = await volunteerDB.countDocuments({ activityId });
        const maxParticipants = activity.limitPerson;

        // 检查是否已经报名
        const existingRegistration = await volunteerDB.findOneAndUpdate(
            { activityId, ID },
            {
                $set: {
                    faculty,
                    name,
                    sex,
                    grade,
                    classes,
                    phoneNumber,
                    counsellor,
                    levels
                }
            },
            { new: true, returnDocument: 'after' }
        );

        if (existingRegistration) {
            // 如果已经报名,更新报名信息成功
            return res.status(200).json({
                code: 1,
                msg: "报名信息已更新",
                registration: existingRegistration,
            });
        } else if (currentRegistrations >= maxParticipants) {
            // 如果未报名,且人数已达上限,拒绝报名
            return res.status(403).json({ code: -4, msg: "报名失败,本场活动报名人数已上限" });
        } else {
            // 如果未报名,且人数未达上限,保存报名信息
            const registration = await volunteerDB.create({
                activityId,
                faculty,
                name,
                sex,
                ID,
                grade,
                classes,
                phoneNumber,
                counsellor,
                levels,
                semester: getCurrentSemester()
            });

            res.status(201).json({
                code: 0,
                msg: "报名成功",
                registration,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: -1,
            msg: "报名失败，请重新填报",
        });
    }
});
// 删除报名信息
router.post("/delete", async (req, res) => {
    try {
        const { activityId, ID } = req.body;

        // 检查活动是否存在
        const activity = await activityDB.findById(activityId);
        if (!activity) {
            return res.status(404).json({ code: -2, msg: "活动不存在" });
        }

        // 检查活动报名截止时间
        const currentTime = new Date();
        if (currentTime > activity.deadline) {
            return res.status(403).json({ code: -3, msg: "活动报名已截止，不能删除报名信息" });
        }

        // 检查是否已经报名
        const existingRegistration = await volunteerDB.findOne({
            activityId,
            ID,
        });

        if (!existingRegistration) {
            return res.status(404).json({ code: -4, msg: "您尚未报名该活动" });
        }

        // 删除报名信息
        await volunteerDB.findOneAndDelete({ activityId, ID });

        res.status(200).json({
            code: 0,
            msg: "报名信息删除成功",
            deletedRegistration: existingRegistration,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: -1,
            msg: "删除报名信息失败",
        });
    }
});
//批量存储
router.post("/volunteers/batchInsert", async (req, res) => {
    try {
        // 读取 JSON 文件
        const data = fs.readFileSync(path.join(__dirname, '../../dataJson/volunteer.json'), 'utf8');


        // 解析 JSON 数据
        const jsonData = JSON.parse(data);
        const usersData = jsonData || [];

        const bulkInsertData = [];

        usersData.forEach(userData => {
            if (userData && userData.name && userData.grade && userData.classes && userData.ID && userData.semester && userData.activityId) {
                const {
                    activityId,
                    counsellor,
                    name,
                    grade,
                    classes,
                    levels,
                    ID,
                    semester,

                } = userData;

                try {

                    bulkInsertData.push({
                        activityId: activityId,
                        counsellor: counsellor.trim(),
                        name: name.trim(),
                        grade: grade.trim(),
                        classes: classes.trim(),
                        levels: levels ? levels.trim() : "暂无",
                        ID: ID.trim(),
                        semester: semester.trim(),


                    });
                } catch (error) {
                    console.error("Error creating ObjectId:", error);
                    // Handle the error, log it, or skip the current iteration
                    console.warn(`Skipping invalid activityId: ${activityId}`);
                }
            }
        });

        await volunteerDB.insertMany(bulkInsertData);

        res.status(200).json({ message: '批量数据存储成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
});
router.post("/updateCurrentSemester", async (req, res) => {
    try {
        const newCurrentSemester = await getCurrentSemester();

        // 使用updateMany更新所有已有数据的currentSemester字段
        const result = await activityDB.updateMany({}, { $set: { currentSemester: newCurrentSemester } });

        res.status(200).json({ success: true, message: "Current semester updated successfully", result });
    } catch (error) {
        console.error("Error updating current semester:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
//请求发布者的发布的活动
// router.get("/activeUserId", async (req, res) => {
//     try {
//         let {userId} = req.query
//         const ActiveData = await activityDB.find({userId})
//         res.send({
//             msg: "请求成功",
//             data: ActiveData,
//             code: 202
//         })
//
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             code: -1,
//             msg: "请求失败",
//         });
//     }
// })

// router.get("/activeUserId", async (req, res) => {
//     try {
//         const { userId, currentSemester } = req.query;
//         console.log(userId,currentSemester)
//         // 查找用户信息
//         const user = await userDB.findById(userId);
//         if (!user) {
//             return res.status(404).json({msg: "用户不存在", code: -1});
//         }
//
//         let activeData;
//
//         // 如果用户是管理员（admin 为 true），则请求当前学期的所有活动数据
//         if (user.admin) {
//             activeData = await activityDB.find({ currentSemester }).populate('userId', 'name').sort({ date: -1 });;
//         } else {
//             // 如果用户的职位中包含 "负责人" 这三个字，则请求当前学期由该用户负责的活动数据
//             if (user.position && user.position.includes("负责人")) {
//                 activeData = await activityDB.find({ userId, currentSemester }).populate('userId', 'name').sort({ date: -1 });;
//             } else {
//                 // 其他情况，默认返回空数据
//                 activeData = [];
//             }
//         }
//
//         res.status(200).json({msg: "请求成功", data: activeData, code: 202});
//
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({code: -1, msg: "请求失败"});
//     }
// });
// 定义一个路由，根据 activityId 获取志愿者信息


// router.get("/activeUserId", async (req, res) => {
//     try {
//         const { userId, currentSemester } = req.query;
//         // 查找用户信息
//         const user = await userDB.findById(userId);
//         if (!user) {
//             return res.status(404).json({msg: "用户不存在", code: -1});
//         }
//         let activeData;
//         // 如果用户是管理员（admin 为 true），则请求当前学期的所有活动数据，并计算志愿者统计数据
//         if (user.admin) {
//             activeData = await activityDB.find({ currentSemester }).populate('userId', 'name position',).sort({ date: -1 });
//             // 统计活动相关的 volunteer 表的数据并添加到活动数据中
//             for (let i = 0; i < activeData.length; i++) {
//                 const activityId = activeData[i]._id;
//                 const totalVolunteers = await volunteerDB.countDocuments({ activityId });
//                 console.log(totalVolunteers)
//                 const signedVolunteers = await volunteerDB.countDocuments({ activityId, checkInTime: { $ne: null } });
//                 const unsignedVolunteers = totalVolunteers - signedVolunteers;
//                 activeData[i].volunteerCounts = { activityId, totalVolunteers, signedVolunteers, unsignedVolunteers };
//             }
//         } else {
//             // 如果用户的职位中包含 "负责人" 这三个字，则请求当前学期由该用户负责的活动数据，并计算志愿者统计数据
//             if (user.position && user.position.includes("负责人")) {
//                 activeData = await activityDB.find({ userId, currentSemester }).populate('userId', 'name position',).sort({ date: -1 });
//                 // 统计活动相关的 volunteer 表的数据并添加到活动数据中
//                 for (let i = 0; i < activeData.length; i++) {
//                     const activityId = activeData[i]._id;
//                     const totalVolunteers = await volunteerDB.countDocuments({ activityId });
//                     const signedVolunteers = await volunteerDB.countDocuments({ activityId, checkInTime: { $ne: null } });
//                     const unsignedVolunteers = totalVolunteers - signedVolunteers;
//                     activeData[i].volunteerCounts = { activityId, totalVolunteers, signedVolunteers, unsignedVolunteers };
//                 }
//             } else {
//                 // 其他情况，默认返回空数据
//                 activeData = [];
//             }
//         }
//
//         res.status(200).json({msg: "请求成功", data: activeData, code: 202});
//
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({code: -1, msg: "请求失败"});
//     }
// });
router.get("/activeUserId", async (req, res) => {
    try {
        const { userId, currentSemester } = req.query;
        const { page } = req.query || 1; // 获取当前页码,默认为第一页
        const limit = 10; // 每页返回的记录数
        const skip = (page - 1) * limit; // 计算需要跳过的记录数
        const user = await userDB.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: "用户不存在", code: -1 });
        }

        let activeData;
        let total; // 新增total变量,用于存储总记录数
        if (user.admin) {
            activeData = await activityDB.find({
                currentSemester,
                audit: true
            }).populate('userId', 'name position',).sort({ date: -1 })
                .skip(skip)
                .limit(limit);
            total = await activityDB.countDocuments({
                currentSemester,
                audit: true
            });
            for (let i = 0; i < activeData.length; i++) {
                const activityId = activeData[i]._id;
                const totalVolunteers = await volunteerDB.countDocuments({ activityId });


                const signedVolunteers = await volunteerDB.countDocuments({ activityId, checkInTime: { $ne: null } });

                const studentIds = await volunteerDB.distinct("ID", { activityId });
                const studentLeaderCount = await userDB.countDocuments({ num: { $in: studentIds }, isCadre: true });

                const unsignedVolunteers = totalVolunteers - signedVolunteers;
                const UnparticipatedStudentsCadre = await userDB.countDocuments({ isCadre: true }) - studentLeaderCount
                activeData[i].volunteerCounts = {
                    activityId,
                    totalVolunteers,
                    signedVolunteers,
                    unsignedVolunteers,
                    UnparticipatedStudentsCadre,
                    studentLeaderVolunteers: studentLeaderCount,
                };
            }
        } else {
            if (user.position && user.position.includes("负责人") || user.position.includes("部长")) {
                activeData = await activityDB.find({
                    userId,
                    currentSemester,
                    audit: true
                }).populate('userId', 'name position',).sort({ date: -1 })
                    .skip(skip)
                    .limit(limit);
                // 获取符合条件的总记录数
                total = await activityDB.countDocuments({
                    userId,
                    currentSemester,
                    audit: true
                });
                for (let i = 0; i < activeData.length; i++) {
                    const activityId = activeData[i]._id;
                    const totalVolunteers = await volunteerDB.countDocuments({ activityId });
                    const signedVolunteers = await volunteerDB.countDocuments({ activityId, checkInTime: { $ne: null } });

                    const studentIds = await volunteerDB.distinct("ID", { activityId });
                    const studentLeaderCount = await userDB.countDocuments({ num: { $in: studentIds }, isCadre: true });

                    const unsignedVolunteers = totalVolunteers - signedVolunteers;
                    const UnparticipatedStudentsCadre = await userDB.countDocuments({ isCadre: true }) - studentLeaderCount

                    activeData[i].volunteerCounts = {
                        activityId,
                        totalVolunteers,
                        signedVolunteers,
                        unsignedVolunteers,
                        UnparticipatedStudentsCadre,
                        studentLeaderVolunteers: studentLeaderCount,
                    };
                }
            } else {
                activeData = [];
                total = 0; // 没有数据时设置total为0
            }
        }

        res.status(200).json({ msg: "请求成功", data: { list: activeData, total }, code: 202 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, msg: "请求失败" });
    }
});

router.get("/myPublishActivity", async (req, res) => {
    try {
        const { userId, currentSemester } = req.query;
        const user = await userDB.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: "用户不存在", code: -1 });
        }

        let activeData;

        if (user.admin) {
            activeData = await activityDB.find({
                currentSemester,
                audit: false
            }).populate('userId', 'name position',).sort({ date: -1 });

            for (let i = 0; i < activeData.length; i++) {
                const activityId = activeData[i]._id;
                const totalVolunteers = await volunteerDB.countDocuments({ activityId });


                const signedVolunteers = await volunteerDB.countDocuments({ activityId, checkInTime: { $ne: null } });

                const studentIds = await volunteerDB.distinct("ID", { activityId });
                const studentLeaderCount = await userDB.countDocuments({ num: { $in: studentIds }, isCadre: true });

                const unsignedVolunteers = totalVolunteers - signedVolunteers;
                const UnparticipatedStudentsCadre = await userDB.countDocuments({ isCadre: true }) - studentLeaderCount
                activeData[i].volunteerCounts = {
                    activityId,
                    totalVolunteers,
                    signedVolunteers,
                    unsignedVolunteers,
                    UnparticipatedStudentsCadre,
                    studentLeaderVolunteers: studentLeaderCount,
                };
            }
        } else {
            if (user.position && user.position.includes("负责人") || user.position.includes("部长")) {
                activeData = await activityDB.find({
                    userId,
                    currentSemester,
                    audit: false
                }).populate('userId', 'name position',).sort({ date: -1 });

                for (let i = 0; i < activeData.length; i++) {
                    const activityId = activeData[i]._id;
                    const totalVolunteers = await volunteerDB.countDocuments({ activityId });
                    const signedVolunteers = await volunteerDB.countDocuments({ activityId, checkInTime: { $ne: null } });

                    const studentIds = await volunteerDB.distinct("ID", { activityId });
                    const studentLeaderCount = await userDB.countDocuments({ num: { $in: studentIds }, isCadre: true });

                    const unsignedVolunteers = totalVolunteers - signedVolunteers;
                    const UnparticipatedStudentsCadre = await userDB.countDocuments({ isCadre: true }) - studentLeaderCount

                    activeData[i].volunteerCounts = {
                        activityId,
                        totalVolunteers,
                        signedVolunteers,
                        unsignedVolunteers,
                        UnparticipatedStudentsCadre,
                        studentLeaderVolunteers: studentLeaderCount,
                    };
                }
            } else {
                activeData = [];
            }
        }

        res.status(200).json({ msg: "请求成功", data: activeData, code: 202 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, msg: "请求失败" });
    }
});

router.get("/auditCount", async (req, res) => {
    try {
        const { userId } = req.query;
        const user = await userDB.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: "用户不存在", code: -1 });
        }
        let activeCount;
        if (user.admin) {
            activeCount = await activityDB.find({ audit: false }).countDocuments();
        } else {
            if (user.position && user.position.includes("负责人") || user.position.includes("部长")) {
                activeCount = await activityDB.find({
                    userId,
                    audit: false
                }).countDocuments();
            } else {
                activeCount = 0;
            }
        }
        res.status(200).json({ msg: "请求成功", data: activeCount, code: 202 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, msg: "请求失败" });
    }
});

// Endpoint to get volunteer data based on activityId
router.get("/volunteersID", async (req, res) => {
    try {
        const { activityId, lable } = req.query
        // 根据 activityId 获取志愿者
        const volunteers = await volunteerDB.find({ activityId }).exec();

        // 从志愿者中提取 ID
        const volunteerIDs = volunteers.map((volunteer) => volunteer.ID);

        let cadreUsers;

        if (lable === "普通学生") {
            cadreUsers = await userDB.find({ num: { $in: volunteerIDs }, isCadre: false }).exec();
            // 如果 index 为 3，只查询通过 ID 查找到的 isCadre 为 true 的用户
        } else if (lable === "学生干部") {
            cadreUsers = await userDB.find({ num: { $in: volunteerIDs }, isCadre: true }).exec();
        } else if (lable === "未参与学生干部") {
            // 如果 index 为 4，查询所有 isCadre 为 true 的用户，除了通过 ID 查找到的
            cadreUsers = await userDB.find({ num: { $nin: volunteerIDs }, isCadre: true }).exec();
        } else {

            // 其他情况返回错误
            return res.status(400).json({ error: "无效的参数值" });
        }

        // 只选择所需字段
        const result = cadreUsers.map((user) => ({
            photo: user.photo,
            name: user.name,
            sex: user.sex,
            institution: user.institution,
            position: user.position,
            class: user.class,
            levels: user.levels,
            num: user.num,
            counsellor: user.counsellor,
            phone: user.phone,
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "内部服务器错误" });
    }
});
router.get("/userActivity", async (req, res) => {
    try {
        const { num, userId, currentSemester } = req.query;

        // 查找用户信息
        const user = await userDB.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "用户不存在", code: -1 });
        }

        // 查找该用户参与的活动
        const userActivities = await volunteerDB.find({ ID: num, semester: currentSemester });
        const activityIds = userActivities.map(activity => activity.activityId);

        // 查询对应的活动数据
        let activeData = await activityDB.find({ _id: { $in: activityIds } })
            .populate('userId', 'name position')
            .sort({ date: -1 });

        // 循环遍历活动数据，查询每个活动对应的志愿者记录并统计人数
        for (let i = 0; i < activeData.length; i++) {
            const activityId = activeData[i]._id;

            // 统计未删除的志愿者数量
            const totalVolunteers = await volunteerDB.countDocuments({ activityId, isDeleted: false });
            const signedVolunteers = await volunteerDB.countDocuments({
                activityId,
                checkInTime: { $ne: null },
                isDeleted: false
            });
            const unsignedVolunteers = totalVolunteers - signedVolunteers;

            // 查询活动的签到和签退时间
            const checkInRecords = await volunteerDB.find({
                activityId,
                ID: num,
                isDeleted: false
            }).select('checkInTime checkOutTime');

            // 将统计数据和签到、签退时间添加到活动数据中
            activeData[i].volunteerCounts = { totalVolunteers, signedVolunteers, unsignedVolunteers };

            // 过滤掉 null 值，确保返回的数组只包含有效的签到和签退时间
            activeData[i].checkInTimes = checkInRecords.map(record => record.checkInTime).filter(time => time !== null) || [];
            activeData[i].checkOutTimes = checkInRecords.map(record => record.checkOutTime).filter(time => time !== null) || [];

        }

        // 如果没有签到记录，则确保返回的数组为空
        activeData.forEach(activity => {
            if (!activity.checkInTimes.length) {
                activity.checkInTimes = [];
            }
            if (!activity.checkOutTimes.length) {
                activity.checkOutTimes = [];
            }
        });

        res.status(200).json({ msg: "请求成功", data: activeData, code: 202 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, msg: "请求失败" });
    }
});




router.get('/volunteers', async (req, res) => {
    try {
        const { activityId } = req.query;

        // 查找符合指定 activityId 的志愿者信息
        const volunteers = await volunteerDB.find({ activityId });

        if (!volunteers || volunteers.length === 0) {
            return res.status(404).json({ message: '该活动暂无人参与' });
        }

        // 将志愿者信息以 JSON 形式发送响应
        res.status(200).json(volunteers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
});
//报名信息删除
router.post("/deleteVtInfo", async (req, res) => {
    let { id } = req.body
    try {
        await volunteerDB.findByIdAndRemove(id)

        res.send({
            code: 0,
            msg: "删除完成"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

// 定义一个路由，处理志愿者签到操作
router.post('/check-in', async (req, res) => {
    try {
        const { volunteerId } = req.body;

        // 查找指定志愿者
        const volunteer = await volunteerDB.findById(volunteerId);

        if (!volunteer) {
            return res.status(404).json({ message: '未找到指定的志愿者' });
        }

        // 如果已经签到过，返回错误信息
        if (volunteer.checkInTime) {
            return res.status(400).json({ message: '该志愿者已经签到过了' });
        }

        // 更新签到时间为当前时间
        volunteer.checkInTime = Date.now();

        // 保存更新后的志愿者信息
        await volunteer.save();

        // 发送成功的响应
        res.status(200).json({ message: '签到成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
});
// 签退接口
router.post("/check-out", async (req, res) => {
    const { volunteerId } = req.body;

    if (!volunteerId) {
        return res.status(400).json({ message: "志愿者ID不能为空" });
    }

    try {
        // 查找志愿者
        const volunteer = await volunteerDB.findById(volunteerId);

        if (!volunteer) {
            return res.status(404).json({ message: "未找到志愿者" });
        }

        // 检查是否已签到
        if (volunteer.checkInTime === null) {
            return res.status(400).json({ message: "志愿者尚未签到，无法签退" });
        }

        // 检查是否已签退
        if (volunteer.hasCheckedOut) {
            return res.status(400).json({ message: "志愿者已签退" });
        }

        // 更新签退时间和状态
        volunteer.checkOutTime = Date.now(); // 设置当前时间为签退时间
        volunteer.hasCheckedOut = true; // 设置已签退状态

        // 保存更新
        await volunteer.save();

        return res.status(200).json({ message: "签退成功", checkOutTime: volunteer.checkOutTime });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "服务器错误" });
    }
});
//活动修改
router.post("/update", async (req, res) => {
    let { id, doc, mdUrl } = req.body
    try {
        if (!mdUrl) {
            await activityDB.findByIdAndUpdate(id, doc)
            return res.send({
                code: 0,
                msg: "修改成功"
            })
        } else if (mdUrl === "/file/vtCover/default.jpg") {
            await activityDB.findByIdAndUpdate(id, doc)
            return res.send({
                code: 0,
                msg: "修改成功"
            })
        }
        let url = path.resolve(__dirname, "../../public" + mdUrl)
        fs.unlinkSync(url)
        await activityDB.findByIdAndUpdate(id, doc)

        res.send({
            code: 0,
            msg: "修改成功"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

// 定义一个路由，根据 userId 获取所有相关数据
router.get('/userActivities', async (req, res) => {
    try {
        const { userId } = req.query;

        // 查找符合指定 userId 的所有活动数据
        const activities = await activityDB.find({ userId });

        if (!activities || activities.length === 0) {
            return res.status(404).json({ message: '您未参与任何活动' });
        }

        // 将活动数据以 JSON 形式发送响应
        res.status(200).json(activities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
});

router.post("/deleteActivity", async (req, res) => {
    let { id, vtCover } = req.body
    try {
        let coverUrl = path.resolve(__dirname, "../../public" + vtCover)
        if (vtCover === "/file/vtCover/default.jpg") {
            await activityDB.findByIdAndRemove(id)
            return res.send({
                code: 0,
                msg: "删除完成"
            })
        }

        await activityDB.findByIdAndRemove(id)

        res.send({
            code: 0,
            msg: "删除完成"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

router.post('/activities/batchInsertUserId', async (req, res) => {
    try {

        let userId = "65427d108ddedbe227bb8b97"
        // 检查是否提供了 userId
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        // 查询所有活动数据，且 userId 字段为空的活动
        const activitiesToUpdate = await activityDB.find({ userId: { $exists: false } });

        // 批量更新活动数据的 userId
        const updatedActivities = await Promise.all(activitiesToUpdate.map(async activity => {
            activity.userId = userId;
            return await activity.save();
        }));

        res.status(200).json({ message: 'UserIds inserted successfully', updatedActivities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});
router.post('/activities/updateUserId', async (req, res) => {
    try {
        let userId = "65427d108ddedbe227bb8b97"// 从请求体中获取 userId

        // 检查是否提供了 userId
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        // 更新所有活动数据的 userId 字段
        const result = await activityDB.updateMany({}, { $set: { userId } });

        res.status(200).json({ message: 'UserIds updated successfully', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/update-audit', async (req, res) => {
    const { id, audit } = req.body; // 从URL中获取活动ID
    try {
        // 使用findByIdAndUpdate更新audit字段
        const updatedActivity = await activityDB.findByIdAndUpdate(
            id, // 活动ID
            { $set: { audit: audit } }, // 更新audit字段
            { new: true, runValidators: true } // 返回更新后的文档，并运行验证器
        );

        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.json({
            message: '操作成功',
            activity: updatedActivity
        });
    } catch (error) {
        console.error('Error updating activity audit:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// POST请求，用于批量存储志愿者数据
router.post('/branchVolunteers', async (req, res) => {
    try {
        const { activityId, volunteers } = req.body; // 前端提供的活动ID、志愿者数据数组和学期

        // 定义批量创建或更新志愿者的函数
        async function batchCreateOrUpdateVolunteers(volunteersData) {
            try {
                // 遍历每个志愿者数据
                const createdOrUpdatedVolunteers = await Promise.all(
                    volunteersData.map(async volunteerData => {
                        // 尝试在数据库中查找符合条件的志愿者
                        let existingVolunteer = await volunteerDB.findOne({
                            activityId: volunteerData.activityId,
                            ID: volunteerData.ID
                        });

                        // 如果找到了符合条件的志愿者，则更新其字段
                        if (existingVolunteer) {
                            // 更新除了 activityId 和 ID 之外的其他字段
                            for (let key in volunteerData) {
                                if (key !== 'activityId' && key !== 'ID') {
                                    existingVolunteer[key] = volunteerData[key];
                                }
                            }
                            await existingVolunteer.save();
                            return existingVolunteer;
                        } else {
                            // 如果未找到符合条件的志愿者，则创建新的志愿者实例并保存到数据库
                            const newVolunteer = new volunteerDB(volunteerData);
                            await newVolunteer.save();
                            return newVolunteer;
                        }
                    })
                );

                return createdOrUpdatedVolunteers;
            } catch (error) {
                console.error("Error creating or updating volunteers:", error);
                throw error;
            }
        }

        // 使用定义在路由处理程序内部的函数批量创建或更新志愿者，并为每个志愿者设置相同的 activityId 和学期
        const createdVolunteers = await batchCreateOrUpdateVolunteers(volunteers.map(volunteer => ({
            ...volunteer,
            activityId,
            semester: getCurrentSemester()
        })));
        res.status(201).json({
            message: '导入成功',
            volunteers: createdVolunteers
        });
        // 返回创建成功的志愿者数据
    } catch (error) {
        console.error("Error creating volunteers:", error);
        res.status(500).json({ message: '内部服务器错误' });
    }
});


// // 获取用户本学期参加活动的次数并进行排名
// router.get("/user-activity-ranking", async (req, res) => {
//     try {
//         // 获取当前学期（你需要根据实际情况获取当前学期）
//         const currentSemester = "2023-2024学年度第二学期"; // 这里只是一个示例
//
//         // 聚合查询
//         const aggregationResult = await volunteerDB.aggregate([
//             // 匹配当前学期的活动
//             { $match: { semester: currentSemester } },
//             // 分组统计每个用户的活动次数
//             {
//                 $group: {
//                     _id: "$ID",
//                     activityCount: { $sum: 1 },
//                     user: { $first: "$name" },
//                     faculty: { $first: "$faculty" },
//                     grade: { $first: "$grade" },
//                     class: { $first: "$classes" },
//                     level: { $first: "$levels" }
//                 }
//             },
//             // 按活动次数排序
//             { $sort: { activityCount: -1 } },
//             // 只获取前100名
//             { $limit: 100 }
//         ]);
//
//         // 获取用户的详细信息
//         const userIds = aggregationResult.map(item => item._id);
//         const users = await userDB.find({ num: { $in: userIds } });
//
//         // 合并用户信息和活动统计
//         const result = aggregationResult.map(item => {
//             const user = users.find(user => user.num === item._id);
//             return {
//                 avatar: user ? user.photo : 'https://img2.woyaogexing.com/2018/12/04/4e0fc5f077aa6421!480x480.jpg', // 默认头像
//                 nickname: user ? user.nickName : '暂无',
//                 grade: item.grade,
//                 class: item.class,
//                 level: item.level,
//                 activityCount: item.activityCount
//             };
//         });
//
//         res.json(result);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("服务器错误");
//     }
// });

// // 获取用户本学期参加活动的次数并进行排名
// router.get("/user-activity-ranking", async (req, res) => {
//     try {
//         // 获取当前学期（你需要根据实际情况获取当前学期）
//         const currentSemester = getCurrentSemester(); // 这里只是一个示例
//
//         // 聚合查询
//         const aggregationResult = await volunteerDB.aggregate([
//             // 先匹配当前学期的活动
//             { $match: { semester: currentSemester } },
//             // 关联活动表获取活动的详细信息
//             {
//                 $lookup: {
//                     from: "activities", // 你的活动集合名称
//                     localField: "activityId",
//                     foreignField: "_id",
//                     as: "activity"
//                 }
//             },
//             { $unwind: "$activity" },
//             // 过滤掉不需要签到或用户没有签到的活动，或者quantization为false的活动
//             {
//                 $match: {
//                     $or: [
//                         {
//                             "activity.isSign": true,
//                             checkInTime: { $ne: null }
//                         },
//                         {
//                             "activity.isSign": false,
//                             "activity.quantization": true
//                         }
//                     ]
//                 }
//             },
//             // 分组统计每个用户的活动次数
//             {
//                 $group: {
//                     _id: "$ID",
//                     activityCount: { $sum: 1 },
//                     user: { $first: "$name" },
//                     faculty: { $first: "$faculty" },
//                     grade: { $first: "$grade" },
//                     class: { $first: "$classes" },
//                     level: { $first: "$levels" }
//                 }
//             },
//             // 按活动次数排序
//             { $sort: { activityCount: -1 } },
//             // 只获取前100名
//             { $limit: 100 }
//         ]);
//
//         // 获取用户的详细信息
//         const userIds = aggregationResult.map(item => item._id);
//         const users = await userDB.find({ num: { $in: userIds } });
//
//         // 合并用户信息和活动统计
//         const result = aggregationResult.map(item => {
//             const user = users.find(user => user.num === item._id);
//             return {
//                 avatar: user ? user.photo : 'https://img2.woyaogexing.com/2018/12/04/4e0fc5f077aa6421!480x480.jpg', // 默认头像
//                 nickname: user ? user.nickName : '暂无',
//                 grade: item.grade,
//                 class: item.class,
//                 level: item.level,
//                 activityCount: item.activityCount
//             };
//         });
//
//         res.json(result);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("服务器错误");
//     }
// });

// router.get("/user-activity-ranking", async (req, res) => {
//     try {
//         const currentSemester = "2023-2024学年度第二学期"; // 获取当前学期
//
//         const aggregationResult = await volunteerDB.aggregate([
//             // 先匹配当前学期的活动
//             { $match: { semester: currentSemester } },
//             // 关联活动表获取活动的详细信息
//             {
//                 $lookup: {
//                     from: "activities", // 你的活动集合名称
//                     localField: "activityId",
//                     foreignField: "_id",
//                     as: "activity"
//                 }
//             },
//             { $unwind: "$activity" },
//             // 过滤掉不需要签到或用户没有签到的活动，或者quantization为false的活动
//             {
//                 $match: {
//                     $or: [
//                         {
//                             "activity.isSign": true,
//                             checkInTime: { $ne: null }
//                         },
//                         {
//                             "activity.isSign": false,
//                             "activity.quantization": true
//                         }
//                     ]
//                 }
//             },
//             // 计算每个用户的活动次数和注册时间的总和
//             {
//                 $group: {
//                     _id: "$ID",
//                     activityCount: { $sum: 1 },
//                     totalRegistrationTime: { $sum: "$registrationTime" }, // 累计注册时间
//                     user: { $first: "$name" },
//                     faculty: { $first: "$faculty" },
//                     grade: { $first: "$grade" },
//                     class: { $first: "$classes" },
//                     level: { $first: "$levels" }
//                 }
//             },
//             // 按活动次数排序
//             { $sort: { activityCount: -1 } },
//             // 只获取前100名
//             { $limit: 100 }
//         ]);
//
//         // 获取用户的详细信息
//         const userIds = aggregationResult.map(item => item._id);
//         const users = await userDB.find({ num: { $in: userIds } });
//
//         // 合并用户信息和活动统计
//         const result = aggregationResult.map(item => {
//             const user = users.find(user => user.num === item._id);
//             return {
//                 avatar: user ? user.photo : 'https://img2.woyaogexing.com/2018/12/04/4e0fc5f077aa6421!480x480.jpg', // 默认头像
//                 nickname: user ? user.nickName : '暂无',
//                 grade: item.grade,
//                 class: item.class,
//                 level: item.level,
//                 activityCount: item.activityCount,
//                 totalRegistrationTime: item.totalRegistrationTime // 显示累计注册时间
//             };
//         });
//
//         res.json(result);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("服务器错误");
//     }
// });

router.get("/user-activity-ranking", async (req, res) => {
    try {
        const currentSemester = getCurrentSemester(); // 获取当前学期

        const aggregationResult = await volunteerDB.aggregate([
            // 先匹配当前学期的活动
            { $match: { semester: currentSemester } },
            // 关联活动表获取活动的详细信息
            {
                $lookup: {
                    from: "activities", // 你的活动集合名称
                    localField: "activityId",
                    foreignField: "_id",
                    as: "activity"
                }
            },
            { $unwind: "$activity" },
            // 过滤掉不需要签到或用户没有签到的活动，或者quantization为false的活动
            {
                $match: {
                    $or: [
                        {
                            "activity.isSign": true,
                            checkInTime: { $ne: null }
                        },
                        {
                            "activity.isSign": false,
                            "activity.quantization": true
                        }
                    ]
                }
            },
            // 计算每个用户的活动次数和注册时间的总和
            {
                $group: {
                    _id: "$ID",
                    activityCount: { $sum: 1 },
                    totalRegistrationTime: { $sum: "$registrationTime" }, // 累计注册时间
                    user: { $first: "$name" },
                    faculty: { $first: "$faculty" },
                    grade: { $first: "$grade" },
                    class: { $first: "$classes" },
                    level: { $first: "$levels" }
                }
            },
            // 按活动次数排序，活动次数相同的情况下按累计注册时间排序（时间戳最小的在前面）
            { $sort: { activityCount: -1, totalRegistrationTime: 1 } },
            // 只获取前100名
            { $limit: 100 }
        ]);

        // 获取用户的详细信息
        const userIds = aggregationResult.map(item => item._id);
        const users = await userDB.find({ num: { $in: userIds } });

        // 合并用户信息和活动统计
        const result = aggregationResult.map(item => {
            const user = users.find(user => user.num === item._id);
            return {
                avatar: user ? user.photo : 'https://img2.woyaogexing.com/2018/12/04/4e0fc5f077aa6421!480x480.jpg', // 默认头像
                nickname: user ? user.nickName : '暂无',
                grade: item.grade,
                class: item.class,
                level: item.level,
                activityCount: item.activityCount,
                totalRegistrationTime: item.totalRegistrationTime // 显示累计注册时间
            };
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("服务器错误");
    }
});


router.get('/activityId', async (req, res) => {
    try {
        const { activityId } = req.query; // 从请求参数中获取活动 ID

        // 查询活动数据
        const activity = await activityDB.findById(activityId).where({ isDeleted: false }).exec();

        // 检查活动是否存在
        if (!activity) {
            return res.status(404).json({
                code: 1,
                msg: '活动未找到'
            });
        }

        // 返回活动数据及 appid 和 mykey
        res.json({
            code: 0,
            msg: '成功获取活动',
            data: activity,

        });
    } catch (error) {
        console.error('获取活动时出错:', error);
        res.status(500).json({
            code: 2,
            msg: '服务器内部错误'
        });
    }
});

router.post('/generateQRCode', async (req, res) => {
    const { userId, activityId } = req.body
    console.log(userId, activityId)
    const mykey = '5f2ddedd1c4c286fa51287aeaa983751'
    try {
        // 获取 access_token
        const tokenResponse = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxaeded387c33641c2&secret=${mykey}`);
        const accessToken = tokenResponse.data.access_token;

        // 生成二维码
        const qrCodeResponse = await axios.post(`https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${accessToken}`, {
            path: `pagesHome/application/active?enterpriseId=${userId}&id=${activityId}`
        }, {
            responseType: 'arraybuffer'
        });

        // 将二维码转换为 Base64
        const qrCodeBase64 = Buffer.from(qrCodeResponse.data, 'binary').toString('base64');

        // 返回二维码图片
        res.json({
            code: 0,
            msg: '二维码生成成功',
            data: `data:image/png;base64,${qrCodeBase64}`
        });
    } catch (error) {
        console.error('二维码生成失败:', error);
        res.status(500).json({
            code: 2,
            msg: '二维码生成失败'
        });
    }
});



router.get('/top-items-user', async (req, res) => {
    const { userId, currentSemester } = req.query;

    try {
        // 找到对应的置顶项目
        const topItems = await TopItemDB.find({ userId, currentSemester })
            .populate('activityId'); // 根据需要只返回活动的字段

        const activities = topItems.map(item => item.activityId);

        const results = await Promise.all(activities.map(async (activity) => {
            const activityId = activity._id;
            const totalVolunteers = await volunteerDB.countDocuments({ activityId });
            const signedVolunteers = await volunteerDB.countDocuments({ activityId, checkInTime: { $ne: null } });
            const studentIds = await volunteerDB.distinct("ID", { activityId });
            const studentLeaderCount = await userDB.countDocuments({ num: { $in: studentIds }, isCadre: true });
            const unsignedVolunteers = totalVolunteers - signedVolunteers;
            const unparticipatedStudentsCadre = await userDB.countDocuments({ isCadre: true }) - studentLeaderCount;

            return {
                ...activity.toObject(), // Convert Mongoose Document to plain object
                volunteerCounts: {
                    activityId,
                    totalVolunteers,
                    signedVolunteers,
                    unsignedVolunteers,
                    unparticipatedStudentsCadre,
                    studentLeaderVolunteers: studentLeaderCount,
                }
            };
        }));

        res.status(200).json({ msg: "请求成功", data: { list: results }, code: 202 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: -1, msg: "请求失败" });
    }
});


router.post('/top-items-cancle', async (req, res) => {
    const { activityId, userId, currentSemester } = req.body; // 使用 req.body 获取请求体中的数据
    console.log( activityId, userId, currentSemester);

    try {
        const result = await TopItemDB.findOneAndDelete({ activityId, userId, currentSemester }); // 软删除
      
        
        if (!result) {
            return res.status(404).json({ message: '置顶项目未找到' });
        }
        res.status(200).json({ message: '取消置顶成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.post('/top-items-save', async (req, res) => {
    const { activityId, userId, currentSemester } = req.body;
    console.log(activityId, userId, currentSemester);
    
    try {
        const newTopItem = new TopItemDB({ activityId, userId, currentSemester });
        await newTopItem.save();

        // 使用 populate 获取活动数据
        const savedTopItem = await TopItemDB.findById(newTopItem._id)
            .populate('activityId') // 只返回需要的活动字段
            

        res.status(201).json(savedTopItem.activityId); // 只返回活动数据
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;










