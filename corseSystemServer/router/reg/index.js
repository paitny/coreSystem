const express = require("express")
const router = express.Router()
const userDB = require("../../db/user")
const fs = require("fs")
//生成随机秘钥
const rand = require("random-key")
const ClassInfo = require("../../db/ClassInfo")
const gradeClassDB = require("../../db/GradeClass")
const path = require("path");
const asyncHandler = require('express-async-handler')
// //注册提交
// router.post("/", async (req, res) => {
//         try {
//             let {user, pass} = req.body
//
//             let secret = rand.generate()
//             //验证数据
//             if (!/^[\w\u4e00-\u9fa5\u0800-\u4e00\uac00-\ud7ff]{2,15}$/.test(user) || !/^[\w\[\]\/\\~`|<>,.?;':"{}!@#$%^&*()_+=-]+$/.test(pass)) {
//                 return res.send({
//                     code: 1,
//                     msg: "数据格式错误,请用手机号注册登录"
//                 })
//             }
//
//             //验证用户是否存在
//             let doc = await userDB.findOne({user})
//             if (doc) {
//                 return res.send({
//                     code: 2,
//                     msg: "用户已存在"
//                 })
//             }
//
//             //存到数据库
//             await userDB.create({user, pass, secret})
//
//             //返回成功数据
//             res.send({
//                 code: 0,
//                 msg: "注册成功"
//             })
//         } catch
//             (error) {
//             res.status(500).json({code: 500, msg: '服务器内部错误', error: error.message});
//         }
//     }
// )
// 创建批量注册接口

router.post("/", async (req, res) => {
    try {
        let {user, pass} = req.body;

        let secret = rand.generate();

        // 验证数据
        const phoneRegex = /^\d{11}$/; // 11位电话号码正则表达式
        const studentIdRegex = /^\d{8,12}$/; // 8-12位学号正则表达式
        const passRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/; // 包含英文数字和符号的密码正则表达式

        if (!(phoneRegex.test(user) || studentIdRegex.test(user))) {
            return res.send({
                code: 1,
                msg: "请用学号或手机号注册"
            });
        }

        if (!passRegex.test(pass)) {
            return res.send({
                code: 1,
                msg: "密码格式不正确"
            });
        }

        // 验证用户是否存在
        let doc = await userDB.findOne({user});
        if (doc) {
            return res.send({
                code: 2,
                msg: "用户已存在"
            });
        }

        // 存到数据库
        await userDB.create({user, pass, secret});

        // 返回成功数据
        res.send({
            code: 0,
            msg: "注册成功"
        });
    } catch (error) {
        res.status(500).json({code: 500, msg: '服务器内部错误', error: error.message});
    }
});


router.post('/register/batch', asyncHandler(async (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../../dataJson/userCreate.json'), 'utf8');
        const usersData = JSON.parse(data);

        const registrationPromises = [];

        for (const userData of usersData.users) {
            if (!userData.user || !userData.num) {
                console.error('无效的用户数据，跳过注册:', userData);
                continue;
            }

            // Trim spaces from the "user" field
            const trimmedUser = userData.user.trim();

            // 检查是否已经存在相同的用户
            const existingUser = await userDB.findOne({user: trimmedUser});
            if (existingUser) {
                console.log(`用户已存在，跳过注册: ${trimmedUser}`);
                continue;
            }

            userData.user = trimmedUser;
            userData.num = userData.num.trim();
            userData.pass = userData.num.slice(-6).length >= 6 ? userData.num.slice(-6) : '123456';
            userData.secret = rand.generate();

            const newUser = new userDB(userData);
            await newUser.save();
            console.log(`成功注册用户: ${newUser.user}`);
            registrationPromises.push(newUser);
        }

        await Promise.all(registrationPromises);
        console.log('批量注册完成');
        res.json({message: '成功批量注册用户'});
    } catch (error) {
        console.error('批量注册失败', error);
        res.status(500).json({error: '批量注册失败'});
    }
}));
//学生干部名单更新
router.post('/userInfoUpdate', asyncHandler(async (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../../dataJson/userCreate.json'), 'utf8');
        const usersData = JSON.parse(data);

        const registrationPromises = [];

        for (const userData of usersData.users) {
            if (!userData.user || !userData.num) {
                console.error('无效的用户数据，跳过注册:', userData);
                continue;
            }

            // 查找是否已经存在相同的用户
            const existingUser = await userDB.findOne({user: userData.user});

            if (existingUser) {
                // 如果用户已存在，更新用户信息
                existingUser.num = userData.num;

                await existingUser.save();
                console.log(`已存在用户，更新信息: ${existingUser.user}`);
            } else {
                // 如果用户不存在，创建新用户
                userData.pass = userData.num.slice(-6).length >= 6 ? userData.num.slice(-6) : '123456';
                userData.secret = rand.generate();

                const newUser = new userDB(userData);
                await newUser.save();
                console.log(`成功注册用户: ${newUser.user}`);
                registrationPromises.push(newUser);
            }
        }

        await Promise.all(registrationPromises);
        console.log('批量注册完成');
        res.json({message: '成功批量注册用户'});
    } catch (error) {
        console.error('批量注册失败', error);
        res.status(500).json({error: '批量注册失败'});
    }
}));

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

// 定义一个路由来为每个用户插入随机昵称
router.get('/updateNickNamesForEmptyOrDefault', async (req, res) => {
    try {
        // 查找没有昵称或者昵称为 "暂无" 的用户
        const users = await userDB.find({
            $or: [
                { nickName: { $exists: false } },  // nickName 字段不存在
                { nickName: '' },                 // nickName 为空字符串
                { nickName: '暂无' }              // nickName 为 "暂无"
            ]
        });

        users.forEach(async (user) => {
            // 为符合条件的用户生成随机昵称
            user.nickName = generateRandomNickName();
            await user.save(); // 保存更改后的用户文档
        });

        res.json({ message: '随机昵称已成功更新为没有昵称或昵称为“暂无”的用户文档。' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: '无法更新用户的随机昵称。' });
    }
});
router.post("/updateUsersFromJson", async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../../dataJson/userCreate.json');
        const data = fs.readFileSync(filePath, 'utf8');

        const jsonData = JSON.parse(data);
        const usersData = jsonData.users || [];

        // 使用 Promise.all 对每个用户进行更新或注册
        const updatePromises = usersData.map(async (userData) => {
            // 在这里对每个字段进行去空格处理
            const {
                user,
                num,
                name,
                sex,
                grade,
                class: className,
                counsellor,
                levels,
                nickName, // 添加 nickName 字段
                ...otherFields
            } = userData;

            // 对每个字段去空格
            const trimmedUser = user.trim();
            const trimmedNum = num.trim();
            const trimmedName = name.trim();
            const trimmedSex = sex.trim();
            const trimmedGrade = grade.trim();
            const trimmedClassName = className.trim();
            const trimmedCounsellor = counsellor.trim();
            const trimmedLevels = levels.trim();
            const trimmedNickName = nickName ? nickName.trim() : ''; // 处理 nickName 字段

            // 查找用户
            let existingUser = await userDB.findOne({ user: trimmedUser }).exec();

            if (!existingUser) {
                // 如果用户不存在，创建新用户，并生成随机昵称
                const randomNickName = trimmedNickName || generateRandomNickName(); // 如果有 nickName 就用，没有则生成随机昵称
                existingUser = await userDB.create({
                    user: trimmedUser,
                    num: trimmedNum,
                    name: trimmedName,
                    sex: trimmedSex,
                    grade: trimmedGrade,
                    class: trimmedClassName,
                    counsellor: trimmedCounsellor,
                    levels: trimmedLevels,
                    nickName: randomNickName, // 设置随机昵称
                    pass: trimmedUser.slice(-6).length >= 6 ? trimmedUser.slice(-6) : '123456',
                    secret: rand.generate(),
                    ...otherFields // 其他字段的默认值
                });
                return { user: trimmedUser, message: '新用户注册成功', nickName: randomNickName };
            } else {
                // 用户存在，更新用户字段
                existingUser.num = trimmedNum || existingUser.num;
                existingUser.name = trimmedName || existingUser.name;
                existingUser.sex = trimmedSex || existingUser.sex;
                existingUser.grade = trimmedGrade || existingUser.grade;
                existingUser.class = trimmedClassName || existingUser.class;
                existingUser.counsellor = trimmedCounsellor || existingUser.counsellor;
                existingUser.levels = trimmedLevels || existingUser.levels;

                // 如果没有昵称，设置为随机昵称
                if (!existingUser.nickName || existingUser.nickName.trim() === '') {
                    existingUser.nickName = generateRandomNickName();
                }

                // 保存更新后的用户
                await existingUser.save();
                return { user: trimmedUser, message: '用户信息更新成功', nickName: existingUser.nickName };
            }
        });

        // 等待所有更新操作完成
        const results = await Promise.all(updatePromises);

        res.status(200).json({ results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
});


//批量更新用户数据
// router.post("/updateUsersFromJson", async (req, res) => {
//     try {
//         const filePath = path.join(__dirname, '../../dataJson/userCreate.json');
//         const data = fs.readFileSync(filePath, 'utf8');
//
//         const jsonData = JSON.parse(data);
//         const usersData = jsonData.users || [];
//
//         // 使用 Promise.all 对每个用户进行更新或注册
//         const updatePromises = usersData.map(async userData => {
//             // 在这里对每个字段进行去空格处理
//             const {
//                 user,
//                 num,
//                 name,
//                 sex,
//                 grade,
//                 class: className,
//                 counsellor,
//                 levels,
//                 ...otherFields
//             } = userData;
//
//             // 对每个字段去空格
//             const trimmedUser = user.trim();
//             const trimmedNum = num.trim();
//             const trimmedName = name.trim();
//             const trimmedSex = sex.trim();
//             const trimmedGrade = grade.trim();
//             const trimmedClassName = className.trim();
//             const trimmedCounsellor = counsellor.trim();
//             const trimmedLevels = levels.trim();
//
//             // 查找用户
//             let existingUser = await userDB.findOne({user: trimmedUser}).exec();
//
//             if (!existingUser) {
//                 // 如果用户不存在，创建新用户
//                 existingUser = await userDB.create({
//                     user: trimmedUser,
//                     num: trimmedNum,
//                     name: trimmedName,
//                     sex: trimmedSex,
//                     grade: trimmedGrade,
//                     class: trimmedClassName,
//                     counsellor: trimmedCounsellor,
//                     levels: trimmedLevels,
//                     pass: trimmedUser.slice(-6).length >= 6 ? trimmedUser.slice(-6) : '123456',
//                     secret: rand.generate(),
//                     ...otherFields // 其他字段的默认值
//                 });
//                 return {user: trimmedUser, message: '新用户注册成功'};
//             } else {
//                 // 用户存在，更新用户字段
//                 existingUser.num = trimmedNum || existingUser.num;
//                 existingUser.name = trimmedName || existingUser.name;
//                 existingUser.sex = trimmedSex || existingUser.sex;
//                 existingUser.grade = trimmedGrade || existingUser.grade;
//                 existingUser.class = trimmedClassName || existingUser.class;
//                 existingUser.counsellor = trimmedCounsellor || existingUser.counsellor;
//                 existingUser.levels = trimmedLevels || existingUser.levels;
//
//                 // 保存更新后的用户
//                 await existingUser.save();
//                 return {user: trimmedUser, message: '用户信息更新成功'};
//             }
//         });
//
//         // 等待所有更新操作完成
//         const results = await Promise.all(updatePromises);
//
//         res.status(200).json({results});
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({error: '服务器错误'});
//     }
// });



// 批量更新学生干部用户数据
// router.post('/updateStudentOrgUsers', async (req, res) => {
//     try {
//         const data = fs.readFileSync(path.join(__dirname, '../../dataJson/updateOrg.json'), 'utf8');
//         const jsonData = JSON.parse(data);
//
//         // Assuming your users are in an array called "users"
//         const usersData = jsonData.users || [];
//
//         const bulkOps = usersData.map(userData => {
//             const {
//                 user,
//                 name,
//                 sex,
//                 grade,
//                 class: userClass,
//                 counsellor,
//                 levels,
//                 institution,
//                 position,
//                 phone,
//                 chamber,
//                 isCadre,
//                 due
//             } = userData;
//             // Trim spaces from the "user" field
//             const trimmedUser = user.trim();
//             const updateQuery = {
//                 user: trimmedUser,
//             };
//
//             const updateData = {
//                 name: name.trim(),
//                 sex: sex.trim(),
//                 num: user.trim(),
//                 grade: grade.trim(),
//                 class: userClass.trim(),
//                 levels: levels.trim(),
//                 counsellor: counsellor.trim(),
//                 institution: institution.trim(),
//                 position: position.trim(),
//                 chamber: chamber.trim(),
//                 phone: phone.trim(),
//                 isCadre: isCadre.trim(),
//                 due: due.trim(),
//             };
//
//             return {
//                 updateOne: {
//                     filter: updateQuery,
//                     update: {$set: updateData},
//                     upsert: true,
//                 },
//             };
//         });
//
//         if (bulkOps.length > 0) {
//             await userDB.bulkWrite(bulkOps);
//             res.status(200).json({message: 'Bulk update completed.'});
//         } else {
//             res.status(400).json({message: 'No updates provided.'});
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({message: 'Internal Server Error'});
//     }
// });

router.post("/updateStudentOrgUsers", async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../../dataJson/updateOrg.json');
        const data = fs.readFileSync(filePath, 'utf8');

        const jsonData = JSON.parse(data);
        const usersData = jsonData.users || [];

        // 使用 Promise.all 对每个用户进行更新或注册
        const updatePromises = usersData.map(async userData => {
            // 在这里对每个字段进行去空格处理
            const {
                user,
                num,
                name,
                sex,
                grade,
                class: className,
                counsellor,
                levels,
                chamber, // Add additional fields
                phone,
                position,
                institution,
                isCadre,
                due,
                ...otherFields
            } = userData;

            // 对每个字段去空格
            const trimmedUser = user.trim();
            const trimmedNum = num.trim();
            const trimmedName = name.trim();
            const trimmedSex = sex.trim();
            const trimmedGrade = grade.trim();
            const trimmedClassName = className.trim();
            const trimmedCounsellor = counsellor.trim();
            const trimmedLevels = levels.trim();
            const trimmedChamber = chamber.trim(); // Trim additional fields
            const trimmedPhone = phone.trim();
            const trimmedPosition = position.trim();
            const trimmedInstitution = institution.trim();
            const trimmedIsCadre = isCadre.trim();
            const trimmedDue = due.trim();

            // 查找用户
            let existingUser = await userDB.findOne({user: trimmedUser}).exec();

            if (!existingUser) {
                // 如果用户不存在，创建新用户
                await userDB.create({
                    user: trimmedUser,
                    num: trimmedNum,
                    name: trimmedName,
                    sex: trimmedSex,
                    grade: trimmedGrade,
                    class: trimmedClassName,
                    counsellor: trimmedCounsellor,
                    levels: trimmedLevels,
                    pass: trimmedUser.slice(-6).length >= 6 ? trimmedUser.slice(-6) : '123456',
                    secret: rand.generate(),
                    chamber: trimmedChamber, // Include additional fields
                    phone: trimmedPhone,
                    position: trimmedPosition,
                    institution: trimmedInstitution,
                    isCadre: trimmedIsCadre,
                    due: trimmedDue,
                    ...otherFields // 其他字段的默认值
                });
                return {user: trimmedUser, message: '新用户注册成功'};
            } else {
                // 用户存在，更新用户字段
                existingUser.num = trimmedNum || existingUser.num;
                existingUser.name = trimmedName || existingUser.name;
                existingUser.sex = trimmedSex || existingUser.sex;
                existingUser.grade = trimmedGrade || existingUser.grade;
                existingUser.class = trimmedClassName || existingUser.class;
                existingUser.counsellor = trimmedCounsellor || existingUser.counsellor;
                existingUser.levels = trimmedLevels || existingUser.levels;

                // 更新额外的字段
                existingUser.chamber = trimmedChamber || existingUser.chamber;
                existingUser.phone = trimmedPhone || existingUser.phone;
                existingUser.position = trimmedPosition || existingUser.position;
                existingUser.institution = trimmedInstitution || existingUser.institution;
                existingUser.isCadre = trimmedIsCadre || existingUser.isCadre;
                existingUser.due = trimmedDue || existingUser.due;

                // 保存更新后的用户
                await existingUser.save();
                return {user: trimmedUser, message: '用户信息更新成功'};
            }
        });

        // 等待所有更新操作完成
        const results = await Promise.all(updatePromises);

        res.status(200).json({results});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: '服务器错误'});
    }
});

// 更新接口
router.post('/updateFaculty', async (req, res) => {
    try {
        // 更新条件：grade字段满足2020级或2021级或2022级或2023级
        const updateCriteria = {
            $or: [
                {grade: '2020级'},
                {grade: '2021级'},
                {grade: '2022级'},
                {grade: '2023级'}
            ]
        };

        // 设置更新内容：将faculty字段更新为指定值
        const updateData = {
            $set: {
                faculty: '人工智能与大数据学院'
            }
        };

        // 设置选项：如果记录不存在就插入一条新记录
        const options = {
            upsert: true
        };

        // 执行更新操作
        const result = await userDB.updateMany(updateCriteria, updateData, options);

        res.json({message: `${result.nModified} 条记录已更新`});
    } catch (error) {
        console.error('更新失败：', error);
        res.status(500).json({error: '更新失败'});
    }
});
router.post("/delete-by-grade", async (req, res) => {
    try {
        const gradeToDelete = "2020级";


        const userDeleteResult = await userDB.deleteMany({grade: gradeToDelete});
        const classInfoDeleteResult = await ClassInfo.deleteMany({grade: gradeToDelete});
        const gradeClassDeleteResult = await gradeClassDB.deleteMany({grade: gradeToDelete})
        res.status(200).json({
            message: "Users and ClassInfo records deleted successfully",
            userDeletedCount: userDeleteResult.deletedCount,
            classInfoDeletedCount: classInfoDeleteResult.deletedCount,
            gradeClassDeleteCount: gradeClassDeleteResult.deletedCount
        });
    } catch (err) {
        res.status(500).json({message: "Error deleting records", error: err});
    }
});
//学生干部撤销
router.post("/update-users", async (req, res) => {
    try {
        // 查找满足条件的用户
        // const usersToUpdate = await userDB.find({due: "第18届", position: {$not: /部长|负责人/}});
        const usersToUpdate = await userDB.find({due: "第18届"});
        console.log(usersToUpdate)
        // 批量更新
        const updatePromises = usersToUpdate.map(user => {
            user.institution = "暂无";
            user.isCadre = false;
            user.due="暂无"
            user.position = "普通用户";
            return user.save();
        });

        await Promise.all(updatePromises);

        res.status(200).send({message: "批量更新成功"});
    } catch (error) {
        console.error("批量更新错误:", error);
        res.status(500).send({error: "批量更新失败"});
    }
});
router.post('/add-isDeleted', async (req, res) => {
    try {
        // 所有模型
        const models = [userDB /*, OtherModel1, OtherModel2, ... */];

        // 遍历所有模型，更新所有文档，添加 `isDeleted: false`
        for (const model of models) {
            await model.updateMany(
                { isDeleted: { $exists: false } }, // 查找没有 `isDeleted` 字段的文档
                { $set: { isDeleted: false } } // 设置 `isDeleted: false`
            );
        }

        res.status(200).json({ message: '所有数据已成功添加 isDeleted: false' });
    } catch (error) {
        res.status(500).json({ error: '添加 isDeleted 字段时出错', details: error });
    }
});
const mongoose = require("mongoose");
const db = mongoose.connection;
router.post("/add-isDeleted-many", async (req, res) => {
    try {
        // 获取数据库中的所有集合
        const collections = await db.db.listCollections().toArray();

        // 遍历每个集合，批量更新
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            console.log(`正在更新集合: ${collectionName}`);

            // 更新集合中的所有文档，添加 isDeleted 字段
            await db.collection(collectionName).updateMany(
                { deletedAt: { $exists: null } }, // 仅更新没有 isDeleted 字段的文档
                { $set: { deletedAt: null } }     // 设置 isDeleted: false
            );

            console.log(`集合 ${collectionName} 更新完成`);
        }

        res.status(200).json({ message: "所有集合更新完成" });
    } catch (err) {
        console.error("更新过程中出现错误:", err);
        res.status(500).json({ error: "更新失败", details: err.message });
    }
});

// 批量删除 position 中包含 "干事" 且 class 不是 2023级 和 2022级 的用户
const courseDB=require("../../db/aiCourse")
router.post("/deletePositions", async (req, res) => {
    try {
        console.log(1)
        // 删除 ClassInfo 中 grade 为 2024级 的数据
        const classDeleteResult = await ClassInfo.deleteMany({ grade: "2024级" });

        // 删除 AiCourse 中 grade 为 2024级 的数据
        const aiCourseDeleteResult = await courseDB.deleteMany({ grade: "2024级" });

        // 删除 User 中 grade 为 2024级 的用户数据
        const userDeleteResult = await userDB.deleteMany({ grade: "2024级" });

        // 返回删除结果
        res.status(200).json({
            message: "删除成功",
            classDeletedCount: classDeleteResult.deletedCount, // 删除的班级信息数量
            aiCourseDeletedCount: aiCourseDeleteResult.deletedCount, // 删除的课程信息数量
            userDeletedCount: userDeleteResult.deletedCount // 删除的用户信息数量
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "删除失败",
            error: error.message
        });
    }
});

module.exports = router



