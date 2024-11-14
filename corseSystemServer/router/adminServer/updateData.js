const express = require("express");
const router = express.Router();
const userDB = require("../../db/user")
const rand = require("random-key")
const mongoose = require('mongoose');
const feedbackDB = require('../../db/feedback')
const ClassInfo = require('../../db/ClassInfo')
//批量更新辅导员
router.post("/updateCounsellor", async (req, res) => {
    try {
        const {grade, className, levels, counsellor} = req.body;
        // 检查参数是否存在
        if (!grade || !className || !levels || !counsellor) {
            return res.status(400).json({message: "缺少必需的参数"});
        }

        // 执行批量更新
        const result = await userDB.updateMany(
            {grade, class: className, levels}, // 查询条件
            {$set: {counsellor}} // 更新字段
        );
// 执行批量更新
        await ClassInfo.updateMany(
            {grade, class: className, level: levels}, // 查询条件
            {$set: {counsellor}} // 更新字段
        );
        res.json({message: "辅导员更新成功", result});
    } catch (error) {
        console.error("更新辅导员时出错:", error);
        res.status(500).json({message: "内部服务器错误"});
    }
});
//学生干部取消
router.post('/updateCancelUserCadre', async (req, res) => {
    try {
        const {userId} = req.body;

        // 更新用户信息
        await userDB.findByIdAndUpdate(userId, {
            institution: "暂无",
            position: "普通用户",
            isCadre: false,
            due: "暂无"
        });
        const user = await userDB.findById(userId);

        res.status(200).json({message: "用户信息已更新", user});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "更新用户信息时出错"});
    }
});
// POST请求，接收用户ID和要更新的字段值
router.post('/updateCadre', async (req, res) => {

    const {userId, institution, position, isCadre, due} = req.body; // 假设前端发送的请求中包含了要更新的字段值
    try {
        // 查询用户信息
        const user = await userDB.findById(userId);
        if (!user) {
            return res.status(404).json({message: '用户不存在'});
        }

        // 更新用户信息
        if (institution) user.institution = institution;
        if (position) user.position = position;
        if (isCadre !== undefined) user.isCadre = isCadre;
        if (due) user.due = due;

        // 保存更新后的用户信息
        await user.save();

        return res.status(200).json({message: '设置成功', user: user});
    } catch (err) {
        console.error('Error updating user info:', err);
        return res.status(500).json({message: '服务器错误'});
    }
});
// //批量注册用户
// router.post("/updateUsersFromJson", async (req, res) => {
//     try {
//         const { regUsersData } = req.body;
//
//         const usersData = regUsersData; // 将JSON字符串解析为数组
//
//         // 使用 Promise.all 对每个用户进行更新或注册
//         const updatePromises = usersData.map(async userData => {
//             // 在这里对每个字段进行去空格处理
//             const {
//                 num,
//                 name,
//                 sex,
//                 grade,
//                 class: className,
//                 counsellor,
//                 levels,
//                 faculty,
//                 phone,
//                 chamber,
//                 ...otherFields
//             } = userData;
//
//             // 对每个字段去空格
//             const trimmedNum = num ? num.trim() : undefined;
//             const trimmedName = name ? name.trim() : undefined;
//             const trimmedSex = sex ? sex.trim() :undefined;
//             const trimmedGrade = grade ? grade.trim() : undefined;
//             const trimmedClassName = className ? className.trim() : undefined;
//             const trimmedCounsellor = counsellor ? counsellor.trim() :undefined;
//             const trimmedLevels = levels ? levels.trim() : undefined;
//             const trimmedFaculty = faculty ? faculty.trim() : undefined;
//             const trimmedPhone = phone ? phone.trim() : undefined;
//             const trimmedChamber = chamber ? chamber.trim() : undefined;
//
//             // 查找用户
//             let existingUser = await userDB.findOne({ user: trimmedNum }).exec();
//
//             if (!existingUser) {
//                 // 如果用户不存在，创建新用户
//                 existingUser = await userDB.create({
//                     user: trimmedNum,
//                     num: trimmedNum,
//                     name: trimmedName,
//                     sex: trimmedSex,
//                     grade: trimmedGrade,
//                     class: trimmedClassName,
//                     counsellor: trimmedCounsellor,
//                     levels: trimmedLevels,
//                     faculty: trimmedFaculty,
//                     phone: trimmedPhone,
//                     chamber: trimmedChamber,
//                     pass: trimmedNum.slice(-6),
//                     secret: rand.generate(),
//                     ...otherFields // 其他字段的默认值
//                 });
//                 return { user: trimmedNum, message: '新用户注册成功' };
//             } else {
//                 // 用户存在，更新用户字段
//                 if (trimmedNum) existingUser.num = trimmedNum;
//                 if (trimmedName) existingUser.name = trimmedName;
//                 if (trimmedSex) existingUser.sex = trimmedSex;
//                 if (trimmedGrade) existingUser.grade = trimmedGrade;
//                 if (trimmedClassName) existingUser.class = trimmedClassName;
//                 if (trimmedCounsellor) existingUser.counsellor = trimmedCounsellor;
//                 if (trimmedLevels) existingUser.levels = trimmedLevels;
//                 if (trimmedFaculty) existingUser.faculty = trimmedFaculty;
//                 if (trimmedPhone) existingUser.phone = trimmedPhone;
//                 if (trimmedChamber) existingUser.chamber = trimmedChamber;
//
//                 // 保存更新后的用户
//                 await existingUser.save();
//                 return { user: trimmedNum, message: '用户信息更新成功' };
//             }
//         });
//
//         // 等待所有更新操作完成
//         const results = await Promise.all(updatePromises);
//
//         res.status(200).json({ results });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: '服务器错误' });
//     }
// });


const GradeClass = require('../../db/GradeClass'); // 导入 GradeClass 模型


function removeDuplicatesByGradeClassLevels(array) {
    // 使用一个Map来存储唯一对象
    const uniqueMap = new Map();

    // 遍历原始数组
    array.forEach(item => {
        // 创建一个键，该键是grade、class和levels的组合，以固定顺序拼接
        const key = `${item.grade}-${item.class}-${item.levels}`;

        // 如果Map中不存在这个键，则将对象添加到Map中
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
        }
    });

    // 将Map中的值转换回数组
    const uniqueArray = Array.from(uniqueMap.values());

    return uniqueArray;
}


async function addClassesAndLevelsToGrade(classLevelArray) {
    try {
        // 遍历数组中的每个元素
        for (const {grade, class: className, levels} of classLevelArray) {
            // 查找年级记录
            let gradeRecord = await GradeClass.findOne({grade});

            if (!gradeRecord) {
                // 如果找不到年级记录，则创建一个新的年级记录
                gradeRecord = GradeClass.create({
                    grade,
                    classNames: [className],
                    levels: [levels] // 初始化levels数组
                });
            }

            // 检查班级名称是否已存在于classNames数组中
            if (!gradeRecord.classNames.includes(className)) {
                gradeRecord.classNames.push(className);
            } else {
                console.log(`班级名称 ${className} 已存在于年级 ${grade} 的 classNames 数组中，不会重复添加。`);
            }

            // 检查层次是否已存在于levels数组中
            if (!gradeRecord.levels.includes(levels)) {
                gradeRecord.levels.push(levels);
            } else {
                console.log(`层次 ${levels} 已存在于年级 ${grade} 的 levels 数组中，不会重复添加。`);
            }

            // 保存年级记录
            await gradeRecord.save();

            // 输出更新日志
            console.log(`成功更新年级 ${grade}，班级名称 ${className} 和层次 ${levels}`);
        }
    } catch (error) {
        console.error('添加年级、班级名称和层次时发生错误:', error);
        // 根据需要处理错误，例如返回错误信息给客户端
        throw error;
    }
}

// router.post("/updateUsersFromJson", async (req, res) => {
//     try {
//         const { regUsersData } = req.body;
//         await saveToDatabase(regUsersData)
//         const usersData = regUsersData; // 将JSON字符串解析为数组
// // 调用函数批量创建或更新年级记录
//
//         // 使用 Promise.all 对每个用户进行更新或注册
//         const updatePromises = usersData.map(async userData => {
//             // 在这里对每个字段进行去空格处理
//             const {
//                 num,
//                 name,
//                 sex,
//                 grade,
//                 class: className,
//                 counsellor,
//                 levels,
//                 faculty,
//                 phone,
//                 chamber,
//                 ...otherFields
//             } = userData;
//
//             // 对每个字段去空格
//             const trimmedNum = num ? num.trim() : undefined;
//             const trimmedName = name ? name.trim() : undefined;
//             const trimmedSex = sex ? sex.trim() : undefined;
//             const trimmedGrade = grade ? grade.trim() : undefined;
//             const trimmedClassName = className ? className.trim() : undefined;
//             const trimmedCounsellor = counsellor ? counsellor.trim() : undefined;
//             const trimmedLevels = levels ? levels.trim() : undefined;
//             const trimmedFaculty = faculty ? faculty.trim() : undefined;
//             const trimmedPhone = phone ? phone.trim() : undefined;
//             const trimmedChamber = chamber ? chamber.trim() : undefined;
//
//
//
//             // 查找用户
//             let existingUser = await userDB.findOne({ user: trimmedNum }).exec();
//
//             if (!existingUser) {
//                 // 如果用户不存在，创建新用户
//                 existingUser = await userDB.create({
//                     user: trimmedNum,
//                     num: trimmedNum,
//                     name: trimmedName,
//                     sex: trimmedSex,
//                     grade: trimmedGrade,
//                     class: trimmedClassName,
//                     counsellor: trimmedCounsellor,
//                     levels: trimmedLevels,
//                     faculty: trimmedFaculty,
//                     phone: trimmedPhone,
//                     chamber: trimmedChamber,
//                     pass: trimmedNum.slice(-6),
//                     secret: rand.generate(),
//                     ...otherFields // 其他字段的默认值
//                 });
//
//                 return { user: trimmedNum, message: '新用户注册成功' };
//
//
//             } else {
//                 // 用户存在，更新用户字段
//                 if (trimmedNum) existingUser.num = trimmedNum;
//                 if (trimmedName) existingUser.name = trimmedName;
//                 if (trimmedSex) existingUser.sex = trimmedSex;
//                 if (trimmedGrade) existingUser.grade = trimmedGrade;
//                 if (trimmedClassName) existingUser.class = trimmedClassName;
//                 if (trimmedCounsellor) existingUser.counsellor = trimmedCounsellor;
//                 if (trimmedLevels) existingUser.levels = trimmedLevels;
//                 if (trimmedFaculty) existingUser.faculty = trimmedFaculty;
//                 if (trimmedPhone) existingUser.phone = trimmedPhone;
//                 if (trimmedChamber) existingUser.chamber = trimmedChamber;
//
//                 // 保存更新后的用户
//                 await existingUser.save();
//                 return { user: trimmedNum, message: '用户信息更新成功' };
//
//
//
//             }
//
//
//         });
//
//         // 等待所有更新操作完成
//         const results = await Promise.all(updatePromises);
//
//         res.status(200).json({ results });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: '服务器错误' });
//     }
// });
//


router.post("/updateUsersFromJson", async (req, res) => {
    try {
        const {regUsersData} = req.body;
        console.log(regUsersData)
        await saveToDatabase(regUsersData)
        await handleUserData(regUsersData)
        // 开启事务
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 批量处理用户数据
            const results = await Promise.all(regUsersData.map(async userData => {
                // 去除空格
                const trimmedUserData = trimUserData(userData);


                // 查找用户
                let existingUser = await userDB.findOne({user: trimmedUserData.num}).exec();

                if (!existingUser) {
                    // 创建新用户
                    existingUser = await userDB.create({
                        ...trimmedUserData,
                        pass: trimmedUserData.num.slice(-6).length >= 6 ? trimmedUserData.num.slice(-6) : '123456',
                        secret: rand.generate(),
                        nickName:generateRandomNickName(),
                    });

                    return {user: trimmedUserData.num, message: '新用户注册成功'};
                } else {
                    // 更新用户
                    Object.assign(existingUser, trimmedUserData);
                    await existingUser.save();

                    return {user: trimmedUserData.num, message: '用户信息更新成功'};
                }
            }));

            // 提交事务
            await session.commitTransaction();

            res.status(200).json({results});
        } catch (error) {
            // 回滚事务
            await session.abortTransaction();
            throw error;
        } finally {
            // 结束事务
            await session.endSession();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: '服务器错误'});
    }
});

//反馈处理
router.post("/updateUsersFromJsonFeed", async (req, res) => {
    try {
        const {id, regUsersData} = req.body;
        console.log(regUsersData)
        await saveToDatabase(regUsersData)
        // 开启事务
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 批量处理用户数据
            const results = await Promise.all(regUsersData.map(async userData => {
                // 去除空格
                const trimmedUserData = trimUserData(userData);

                // 查找用户
                let existingUser = await userDB.findOne({user: trimmedUserData.num}).exec();

                if (!existingUser) {
                    // 创建新用户
                    existingUser = await userDB.create({
                        ...trimmedUserData,
                        pass: trimmedUserData.num.slice(-6).length>=6?trimmedUserData.num.slice(-6):'123456',
                        secret: rand.generate()
                    });
                    await feedbackDB.findByIdAndUpdate(id, {isRead: true})
                    return {user: trimmedUserData.num, message: '新用户注册成功'};

                } else {
                    // 更新用户
                    Object.assign(existingUser, trimmedUserData);
                    await existingUser.save();
                    await feedbackDB.findByIdAndUpdate(id, {isRead: true})
                    return {user: trimmedUserData.num, message: '用户信息更新成功'};
                }
            }));

            // 提交事务
            await session.commitTransaction();

            res.status(200).json({results});
        } catch (error) {
            // 回滚事务
            await session.abortTransaction();
            throw error;
        } finally {
            // 结束事务
            await session.endSession();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: '服务器错误'});
    }
});
//
// 生成随机昵称的函数
function generateRandomNickName() {
    const adjectives =  [
        "星空旅人", "梦里寻她", "云端漫步", "半生琉璃", "独酌清风", "时光行者", "晚风不凉", "梦醒时分",
        "青柠微凉", "花落无声", "月影流萤", "星河长明", "沧海一粟", "江南烟雨", "南风知我意", "北城以北",
        "浅笑嫣然", "夜未央", "晴天娃娃", "时光如歌", "凉薄之心", "繁花似锦", "微风拂面", "晨曦微露",
        "流年未央", "锦瑟年华", "北极星光", "静听风雨", "月下独酌", "微光倾城", "流光易逝", "樱花落尽",
        "初晴微光", "星夜无眠", "南风寄梦", "时光沙漏", "幻夜星辰", "浅忆流年", "雨夜浅思", "心随风动",
        "静待时光", "寂寞烟火", "浮生若梦", "时光清浅", "陌上花开", "紫陌风尘", "浅夏时光", "苍蓝星海",
        "梦幻泡影", "墨染青衣", "风轻云淡", "海棠依旧", "晨光熹微", "一念执着", "沐雨橙风", "夏日微风",
        "逐梦之翼", "落花如雨", "夏日清风", "月夜思君", "心若止水", "云水禅心", "故人已归", "星辰大海",
        "光阴如梭", "北辰孤星", "朝花夕拾", "念念不忘", "清风明月", "时光旧巷", "深海未眠", "寒风萧瑟",
        "流星划过", "风花雪月", "千年一梦", "烟雨红尘", "梦随心动", "南山南", "北海北", "云卷云舒",
        "月下逐鹿", "风雨同舟", "岁月静好", "浅笑安然", "孤灯独影", "流年似水", "沧海桑田", "暮雨潇潇",
        "风吹柳絮", "半夏微凉", "暗香疏影", "夏夜微凉", "浅蓝心事", "浮生若梦", "梦中人", "暖风拂面",
        "旧梦如烟", "月夜清风", "寒冬暖阳", "浮世清欢", "九天星辰", "南城旧梦", "流浪诗人", "镜花水月",
        "暮色迷离", "浮生未歇", "听风者", "花开半夏", "陌上人如玉", "千里暮云平", "夜雨寄北", "南山南风",
        "孤岛听风", "雨打芭蕉", "凉雨初夏", "秋水伊人", "山水如画", "晴空万里", "南风轻拂", "北方有风",
        "夜未央", "似水流年", "流年似梦", "风起云涌", "夕阳西下", "云淡风轻", "长夜孤灯", "心有猛虎",
        "浮光掠影", "月下独酌", "花舞月影", "流云逝水", "星河万里", "微笑向暖", "碧海蓝天", "心若浮云",
        "如梦似幻", "静守时光", "花落谁家", "北城旧梦", "云海苍茫", "时光荏苒", "浮生若茶", "月色如水",
        "孤月独行", "落叶知秋", "南城故事", "风继续吹", "云中漫步", "千秋万代", "阳光正好", "雪中送炭",
        "流年偷换", "岁月如歌", "相见不如怀念", "风轻云淡", "梦的彼岸", "似梦非梦", "云烟过眼", "风中的少年",
        "水墨青花", "听雨眠", "烟雨江南", "浅夏繁花", "雨过天晴", "相思成灾", "流云飞渡", "孤星泪",
        "秋叶红", "微笑如花", "深海流星", "梦中星河", "风过无痕", "月夜星河", "流云似锦", "时光邮差",
        "北岸晨风", "南风轻语", "星光坠落", "山水不相逢", "陌路人", "红尘客", "梦的远方", "浅笑春风",
        "光与影", "雨过天晴", "星落凡尘", "花间一壶酒", "云端孤影", "月下寻梦", "星夜如画", "九霄云外",
        "烟雨楼台", "紫霞仙子", "风中的蒲公英", "流浪的诗人", "江南忆", "落花有意", "孤独旅人", "秋风凉",
        "梦的远方", "南风轻拂", "北城旧事", "风中追梦", "流年如歌", "星空下的回忆", "夜未央", "暮色微凉",
        "浅笑依然", "风过无声", "孤云独影", "落花流水", "旧梦难追", "阳光正好", "月下美人", "一叶知秋"
    ];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];

    return `${randomAdjective}`;
}
router.post("/updateUsersFromJsonCadre", async (req, res) => {
    try {
        const {due, regUsersData} = req.body;
        console.log(regUsersData)
        await saveToDatabase(regUsersData)
        // 开启事务
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 批量处理用户数据
            const results = await Promise.all(regUsersData.map(async userData => {
                // 去除空格
                const trimmedUserData = trimCadreData(userData);

                // 查找用户
                let existingUser = await userDB.findOne({user: trimmedUserData.num}).exec();

                if (!existingUser) {
                    // 创建新用户
                    existingUser = await userDB.create({
                        ...trimmedUserData,
                        pass: trimmedUserData.num.slice(-6).length >= 6 ? trimmedUserData.num.slice(-6) : '123456',
                        secret: rand.generate(),
                        due,
                        isCadre: true
                    });

                    return {user: trimmedUserData.num, message: '新用户注册成功'};
                } else {
                    // 更新用户
                    // 更新用户
                    Object.assign(existingUser, trimmedUserData, {due, isCadre: true});
                    await existingUser.save();

                    return {user: trimmedUserData.num, message: '用户信息更新成功'};
                }
            }));

            // 提交事务
            await session.commitTransaction();

            res.status(200).json({results});
        } catch (error) {
            // 回滚事务
            await session.abortTransaction();
            throw error;
        } finally {
            // 结束事务
            await session.endSession();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: '服务器错误'});
    }
});

// 去除空格的函数
function trimUserData(userData) {
    const {
        num,
        user,
        name,
        sex,
        grade,
        class: className,
        counsellor,
        levels,
        faculty,
        phone,
        chamber,
        due,
        ...otherFields
    } = userData;

    return {
        user: String(num) ? String(num).trim() : undefined,
        num: String(num) ? String(num).trim() : undefined,
        name: name ? name.trim() : undefined,
        sex: sex ? sex.trim() : undefined,
        grade: grade ? grade.trim() : undefined,
        class: className ? className.trim() : undefined,
        counsellor: counsellor ? counsellor.trim() : undefined,
        levels: levels ? levels.trim() : undefined,
        faculty: faculty ? faculty.trim() : undefined,
        phone: String(phone) ? String(phone).trim() : undefined,
        ...otherFields
    };
}

// 去除空格的函数
function trimCadreData(userData) {
    const {
        num,
        user,
        name,
        sex,
        grade,
        class: className,
        counsellor,
        levels,
        faculty,
        phone,
        chamber,
        ...otherFields
    } = userData;

    return {
        user: String(num) ? String(num).trim() : undefined,
        num: String(num) ? String(num).trim() : undefined,
        name: name ? name.trim() : undefined,
        sex: sex ? sex.trim() : undefined,
        chamber: chamber ? chamber.trim() : undefined,
        grade: grade ? grade.trim() : undefined,
        class: className ? className.trim() : undefined,
        counsellor: counsellor ? counsellor.trim() : undefined,
        levels: levels ? levels.trim() : undefined,
        faculty: faculty ? faculty.trim() : undefined,
        phone: String(phone) ? String(phone).trim() : undefined,
        ...otherFields
    };
}

async function saveToDatabase(data) {
    try {
        for (const item of data) {
            const existingGrade = await GradeClass.findOne({grade: item.grade.trim()});
            if (!existingGrade) {
                await GradeClass.create({
                    grade: item.grade.trim(),
                    classNames: [item.class.trim()],
                    levels: [item.levels.trim()]
                });
            } else {
                if (!existingGrade.classNames.includes(item.class.trim())) {
                    existingGrade.classNames.push(item.class.trim());
                }
                if (!existingGrade.levels.includes(item.levels.trim())) {
                    existingGrade.levels.push(item.levels.trim());
                }
                await existingGrade.save();
            }
        }

    } catch (error) {
        console.error("Error saving data:", error);
    }
}


async function handleUserData(data) {
    try {
        for (const item of data) {
            // 去除空格后的数据
            const faculty = item.faculty.trim();
            const grade = item.grade.trim();
            const className = item.class.trim();
            const level = item.levels.trim();
            const counsellor = item.counsellor.trim();

            // 如果class为"辅导员"，跳过
            if (className === '辅导员') {
                continue;
            }

            // 检查grade是否为数字+级，例如"2023级"
            const gradePattern = /^\d+级$/;
            if (!gradePattern.test(grade)) {
                continue;
            }

            // 检查level是否为"本"、"专"或"专升本"
            const validLevels = ['本', '专', '专升本'];
            if (!validLevels.includes(level)) {
                continue;
            }

            // 查询年级、班级、层次和辅导员信息表
            let classInfo = await ClassInfo.findOne({
                faculty,
                grade,
                class: className,
                level
            });

            // 如果不存在，则创建新记录
            if (!classInfo) {
                classInfo = await ClassInfo.create({
                    faculty,
                    grade,
                    class: className,
                    level,
                    counsellor
                });
            }
        }
    } catch (error) {
        console.error("Error saving data:", error);
    }
}


// 更新用户信息的接口
router.post('/updateUserInfo', async (req, res) => {
    try {
        const {id} = req.body;
        const {name, sex, grade, classes, levels, chamber, phone, num, counsellor} = req.body.data
        // 根据 id 查找并更新用户信息
        const updatedUser = await userDB.findByIdAndUpdate(
            id,
            {
                $set: {
                    name,
                    sex,
                    grade,
                    class: classes,
                    levels,
                    chamber,
                    phone,
                    num,
                    counsellor,
                },
            },
            {new: true}
        );

        if (!updatedUser) {
            return res.status(404).json({message: '用户未找到'});
        }

        res.json({message: '用户信息更新成功', user: updatedUser});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: '服务器错误'});
    }
});

module.exports = router;










