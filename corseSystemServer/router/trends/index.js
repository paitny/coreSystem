const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const trendDB = require("../../db/trends")
const Comment = require('../../db/comment');
const fs = require("fs");
const userDB = require("../../db/user")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/file/leaveImage')); // 存储图片的目录，确保该目录存在
    },
    //文件的名字
    filename(req, file, cb) {
        let {ext} = path.parse(file.originalname)
        req.conent_name = `leave-${Date.now()}${ext}`
        cb(null, req.conent_name)
    }
})

const upload = multer({storage: storage});


// 处理文件上传
router.post('/uploadImages', upload.array('file', 3), (req, res) => {
    // 处理上传的图片文件，req.files 包含上传的文件信息
try{
    if (req.files && req.files.length > 0) {
        const uploadedFiles = req.files.map((file) => {
            return {
                filename: '/file/leaveImage/' + file.filename,

            };
        })
        // uploadedPhotos.push(...uploadedFiles)
        // 在这里可以将图片信息与留言或用户关联起来，或保存到数据库中

        res.json({success: true, data: uploadedFiles, message: '文件上传成功'});
    } else {
        res.json({success: false, message: '没有上传的文件'});
    }} catch (error) {
    console.error(error);
    res.status(500).json({ message: '内部服务器错误' });
}
});

// 处理提交留言
router.post('/submitLeave', async (req, res) => {
    try {
        const publisherId = req.body.publisherId;
        const leaveType = req.body.leaveType;
        const leaveContent = req.body.leaveContent;
        let photoUrls = req.body.imgArr;
        console.log(photoUrls)
        // 在这里查询数据库，检查是否已经存在相同的 filename

        // 如果不存在相同的数据，创建新的留言数据

        await trendDB.create({
            publisherId,
            leaveType,
            leaveContent,
            images: photoUrls,
        });
        // 返回成功的响应
        res.json({success: true, message: '留言提交成功'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
});

router.delete("/delete", async (req, res) => {
    let {imageURL} = req.body
    try{
    let imgURL = path.resolve(__dirname, "../../public" + imageURL)

    await fs.unlinkSync(imgURL)


    res.send({
        code: 0,
        msg: "删除完成"
    })} catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
// 定义一个路由来获取一个月内 process 为 true 的数据并查询用户的 name 和 photo 字段
// router.get('/getTrendsForToday', async (req, res) => {
//     // 获取当前日期
//     const currentDate = new Date();
//
//     // 获取一个月前的日期
//     const oneMonthAgoDate = new Date();
//     oneMonthAgoDate.setMonth(currentDate.getMonth() - 1);
//
//     try {
//         // 使用 Mongoose 聚合查询
//         const trends = await trendDB.aggregate([
//             {
//                 $match: {
//                     process: true,
//                     date: {
//                         $gte: oneMonthAgoDate.getTime(), // 大于或等于一个月前的日期
//                         $lt: currentDate.getTime(), // 小于当前日期
//                     },
//                 },
//             },
//             {
//                 $lookup: {
//                     from: 'users', // 用户模型的名称
//                     localField: 'publisherId',
//                     foreignField: '_id',
//                     as: 'user',
//                 },
//             },
//             {
//                 $unwind: '$user',
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     leaveType: 1,
//                     leaveContent: 1,
//                     images: 1,
//                     process: 1,
//                     date: 1,
//                     likes:1,
//                     'user.nickName': 1, // 查询用户的 name 字段
//                     'user.photo': 1, // 查询用户的 photo 字段
//                 },
//             },
//             {
//                 $sort: {
//                     date: -1 // 按日期降序排列
//                 },
//             },
//         ]);
//
//         res.json(trends);
//     } catch (err) {
//         res.status(500).json({ error: '无法获取数据' });
//     }
// });


router.get('/getTrendsForToday', async (req, res) => {
    // 获取当前日期
    const currentDate = new Date();

    // 获取一个月前的日期
    const oneMonthAgoDate = new Date();
    oneMonthAgoDate.setMonth(currentDate.getMonth() - 1);

    try {
        // 使用 Mongoose 聚合查询
        const trends = await trendDB.aggregate([
            {
                $match: {
                    process: true,
                    date: {
                        $gte: oneMonthAgoDate.getTime(), // 大于或等于一个月前的日期
                        $lt: currentDate.getTime(), // 小于当前日期
                    },
                },
            },
            {
                $lookup: {
                    from: 'users', // 用户模型的名称
                    localField: 'likes',
                    foreignField: '_id',
                    as: 'nickNameLikes',
                },
            },
            {
                $lookup: {
                    from: 'users', // 用户模型的名称
                    localField: 'publisherId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $project: {
                    _id: 1,
                    leaveType: 1,
                    leaveContent: 1,
                    images: 1,
                    process: 1,
                    date: 1,
                    likes: 1,
                    'nickNameLikes.nickName': 1,
                    'user.nickName': 1,
                    'user.photo': 1,
                },
            },
            {
                $sort: {
                    date: -1 // 按日期降序排列
                },
            },
        ]);

        res.json(trends);
    } catch (err) {
        res.status(500).json({error: '无法获取数据'});
    }
});
router.get('/audit', async (req, res) => {
    try {
        // 使用 Mongoose 聚合查询
        const trends = await trendDB.aggregate([
            {
                $match: {
                    process: false
                },
            },
            {
                $lookup: {
                    from: 'users', // 用户模型的名称
                    localField: 'publisherId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $project: {
                    _id: 1,
                    leaveType: 1,
                    leaveContent: 1,
                    images: 1,
                    process: 1,
                    date: 1,
                    'user.nickName': 1, // 查询用户的 nickName 字段
                    'user.photo': 1, // 查询用户的 photo 字段
                    'user.name': 1// 查询用户的 name 字段
                },
            },
            {
                $sort: {
                    date: -1 // 按日期降序排列
                },
            },
        ]);

        res.json(trends);
    } catch (err) {
        res.status(500).json({error: '无法获取数据'});
    }
});

router.get('/audited', async (req, res) => {
    try {
        // 解构查询参数
        let {page, perPage} = req.query;
        let pageNumber = +page || 1;
        let itemsPerPage = +perPage || 5;
        // 计算跳过的记录数
        let skip = (pageNumber - 1) * itemsPerPage;

        // 获取满足条件的记录总数
        const totalRecords = await trendDB.countDocuments({process: true});

        // 聚合查询
        const trends = await trendDB.aggregate([
            {
                $match: {
                    process: true
                },
            },
            {
                $lookup: {
                    from: 'users', // 用户模型的名称
                    localField: 'publisherId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $project: {
                    _id: 1,
                    leaveType: 1,
                    leaveContent: 1,
                    images: 1,
                    process: 1,
                    date: 1,
                    'user.nickName': 1, // 查询用户的 nickName 字段
                    'user.photo': 1, // 查询用户的 photo 字段
                    'user.name': 1// 查询用户的 name 字段
                },
            },
            {
                $sort: {date: -1} // 按照日期字段倒序排列
            },
            {
                $skip: skip // 跳过记录数
            },
            {
                $limit: itemsPerPage // 限制返回的记录数
            }
        ]);

        res.json({total: totalRecords, data: trends});
    } catch (err) {
        res.status(500).json({error: '无法获取数据'});
    }
});


// 定义一个路由来获取前一天发表的数据并查询用户的 name 和 photo 字段
// router.get('/getTrendsForPreviousDay', async (req, res) => {
//     // 获取当前时间的日期部分
//     const currentDate = new Date();
//     currentDate.setHours(0, 0, 0, 0); // 设置时间为当天的开始时间
//
//     // 计算前一天的日期
//     const previousDate = new Date(currentDate);
//     previousDate.setDate(currentDate.getDate() - 1);
//
//     try {
//         // 使用 Mongoose 聚合查询
//         const trends = await trendDB.aggregate([
//             {
//                 $match: {
//                     process: true,
//                     date: {
//                         $gte: previousDate.getTime(), // 大于或等于前一天的开始时间
//                         $lt: currentDate.getTime(), // 小于当前时间的开始时间
//                     },
//                 },
//             },
//             {
//                 $lookup: {
//                     from: 'users', // 用户模型的名称
//                     localField: 'publisherId',
//                     foreignField: '_id',
//                     as: 'user',
//                 },
//             },
//             {
//                 $unwind: '$user',
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     leaveType: 1,
//                     leaveContent: 1,
//                     images: 1,
//                     process: 1,
//                     date: 1,
//                     likes:1,
//                     'user.nickName': 1, // 查询用户的 name 字段
//                     'user.photo': 1, // 查询用户的 photo 字段
//                 },
//             },
//         ]);
//
//         res.json(trends);
//     } catch (err) {
//         res.status(500).json({error: '无法获取数据'});
//     }
// });

router.get('/getTrendsForPreviousDay', async (req, res) => {
    // 获取当前时间的日期部分
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // 设置时间为当天的开始时间

    // 计算前一天的日期
    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - 1);

    try {
        // 使用 Mongoose 聚合查询
        const trends = await trendDB.aggregate([
            {
                $match: {
                    process: true,
                    date: {
                        $gte: previousDate.getTime(), // 大于或等于前一天的开始时间
                        $lt: currentDate.getTime(), // 小于当前时间的开始时间
                    },
                },
            },
            {
                $lookup: {
                    from: 'users', // 用户模型的名称
                    localField: 'publisherId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $lookup: {
                    from: 'users', // 用户模型的名称
                    localField: 'likes',
                    foreignField: '_id',
                    as: 'nickNameLikes',
                },
            },
            {
                $project: {
                    _id: 1,
                    leaveType: 1,
                    leaveContent: 1,
                    images: 1,
                    process: 1,
                    date: 1,
                    likes: 1,
                    'user.nickName': 1, // 查询用户的 nickName 字段
                    'user.photo': 1, // 查询用户的 photo 字段
                    'nickNameLikes.nickName': 1, // 查询点赞用户的 nickName 字段
                },
            },
        ]);

        res.json(trends);
    } catch (err) {
        res.status(500).json({error: '无法获取数据'});
    }
});

router.post('/agree', async (req, res) => {

    const {id, process} = req.body
    try {
        // 使用 Mongoose 聚合查询
        await trendDB.findByIdAndUpdate(id, {process: process});

        res.json({msg: "审核完成"});
    } catch (err) {
        res.status(500).json({error: '无法获取数据'});
    }
});


// 定义一个路由，根据 userId 获取所有相关数据
router.get('/userTrends', async (req, res) => {
    try {
        const {publisherId} = req.query;

        // 查找符合指定 userId 的所有动态数据
        const trends = await trendDB.find({publisherId: publisherId});

        if (!trends || trends.length === 0) {
            return res.status(404).json({message: '未找到符合该 userId 的动态数据'});
        }

        // 将动态数据以 JSON 形式发送响应
        res.status(200).json(trends);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
});

// 定义一个路由，根据 trendId 删除动态数据
router.delete('/deleteTrends', async (req, res) => {
    try {
        const {trendId} = req.body;

        // 查找并删除指定动态数据
        const deletedTrend = await trendDB.findByIdAndDelete(trendId);

        if (!deletedTrend) {
            return res.status(404).json({message: '未找到指定的动态数据'});
        }

        // 发送成功的响应
        res.status(200).json({message: '动态删除成功'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '内部服务器错误'});
    }
});


//定义动态评论
// router.post('/comments', async (req, res) => {
//     try {
//         const {userId, text, dynamicId, parentCommentId} = req.body;
//         let comment;
//
//         if (parentCommentId) {
//             // 如果有 parentCommentId，则表示这是回复父评论的操作
//             const parentComment = await Comment.findById(parentCommentId);
//             if (!parentComment) {
//                 return res.status(404).json({message: '父评论不存在'});
//             }
//             // 创建新评论对象
//             comment = new Comment({
//                 userId,
//                 text,
//                 dynamicId,
//                 parentCommentId // 这里添加了父评论的 ID
//             });
//
//             // 将新评论添加到父评论的 replies 数组中
//             parentComment.replies.push(comment);
//             await parentComment.save(); // 保存父评论
//         } else {
//             // 否则，这是提交新评论的操作
//             comment = new Comment({
//                 userId,
//                 text,
//                 dynamicId
//             });
//             await comment.save(); // 保存新评论
//         }
//
//         res.status(201).json(comment); // 返回创建的评论对象
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({message: '服务器错误'});
//     }
// });
// 根据dynamicId获取所有评论


// 读取敏感词汇文件
function loadSensitiveWords(filename) {
    try {
        let url = path.resolve(__dirname, "../../public/file/word/" + filename)
        const data = fs.readFileSync(url, 'utf8');
        return data.split('，').map(word => word.trim()).filter(word => word !== '');
    } catch (error) {
        console.error('Failed to load sensitive words:', error);
        return [];
    }
}

// 检查文本内容中是否包含敏感词汇
function containsSensitiveWords(text, sensitiveWords) {
    for (const word of sensitiveWords) {
        const regex = new RegExp(word, 'gi');
        if (text.match(regex)) {
            return true;
        }
    }
    return false;
}

// 路由处理函数
router.post('/comments', async (req, res) => {
    try {
        const {userId, text, dynamicId, parentCommentId,replyUserId,replyCommentId} = req.body;
        // 从敏感词汇文件中加载敏感词汇列表
        const sensitiveWords = loadSensitiveWords("sensitive_words.txt");

        // 检查文本内容中是否包含敏感词汇
        if (containsSensitiveWords(text, sensitiveWords)) {
            return res.status(400).json({message: '评论包含敏感词汇，评论失败'});
        }

        let comment;

        if (parentCommentId) {
            // 如果有 parentCommentId，则表示这是回复父评论的操作
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                return res.status(404).json({message: '父评论不存在'});
            }
            // 创建新评论对象
            comment = new Comment({
                userId,
                text,
                dynamicId,
                parentCommentId, // 这里添加了父评论的 ID
                replyUserId,
                replyCommentId
            });

            // 将新评论添加到父评论的 replies 数组中
            parentComment.replies.push(comment);
            await parentComment.save(); // 保存父评论
            res.status(201).json({message: '回复成功'});
        } else {
            // 否则，这是提交新评论的操作
            comment = new Comment({
                userId,
                text,
                dynamicId

            });
            await comment.save(); // 保存新评论
            res.status(201).json({message: '评论成功'});
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({message: '服务器错误'});
    }
});

router.get('/commentsAll', async (req, res) => {
    try {
        const {dynamicId} = req.query;
        let query = {};
        if (dynamicId) {
            query.dynamicId = dynamicId;
        }

        const comments = await Comment.find(query)
            .populate({
                path: 'userId',
                select: 'nickName photo province'
            })
            .select('-__v') // 不包含版本号字段
            .lean(); // 将 Mongoose 文档转换为普通 JavaScript 对象

        // 获取所有评论中的所有userId
        let allUserIds = [];
        comments.forEach(comment => {
            allUserIds.push(comment.userId);
            comment.replies.forEach(reply => {
                allUserIds.push(reply.userId);
            });
        });

        // 去重
        allUserIds = Array.from(new Set(allUserIds));

        // 查询所有userId对应的用户信息
        const usersMap = {};
        await Promise.all(allUserIds.map(async userId => {
            const user = await userDB.findById(userId).select('nickName photo province');
            usersMap[userId] = user;
        }));

        // 格式化评论
        const formattedComments = comments.map(comment => {

            const formattedReplies = comment.replies.map(reply => {
                let userId = reply.userId
                const user = usersMap[reply.userId];
                const replyUser=usersMap[reply.replyUserId]

                return {
                    _id: reply._id, // 添加评论的 _id 字段
                    text: reply.text,
                    date: reply.date,
                    replyCommentId:reply.replyCommentId,
                    userId: userId,
                    user: {
                        nickname: user.nickName,
                        avatar: user.photo,
                        province:user.province||"未知"
                    },
                    replyUser:{
                        nickname: replyUser.nickName,
                        province:replyUser.province||"未知"
                    }
                };
            });

            return {
                _id: comment._id, // 添加评论的 _id 字段
                text: comment.text,
                userId:comment.userId._id,
                date: comment.date, // 添加评论的日期字段
                user: {
                    nickname: comment.userId.nickName,
                    avatar: comment.userId.photo,
                    province:comment.userId.province||"未知"
                },

                replies: formattedReplies
            };
        });

        res.json(formattedComments);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message});
    }
});


//点赞
router.post("/like", async (req, res) => {

    //获取评论的id
    let {id, userId} = req.body
    //判断id存不存在
    if (!id) {
        return res.send({
            code: 1,
            msg: "id格式不正确"
        })
    }

    //修改数据库
    let doc = await trendDB.findById(id)
    //检测doc是否存在
    if (!doc) {
        return res.send({
            code: 1,
            msg: "id格式不正确"
        })
    }

    //判断是否已经点过赞
    if (doc.likes.includes(userId)) {
        //点过赞 -- 删除likes字段里面的当前用户id
        await trendDB.findByIdAndUpdate(id, {$pull: {likes: userId}})
        res.send({
            code: 0,
            msg: "已取消"
        })
    } else {
        //没点过赞 -- likes字段添加当前用户id
        await trendDB.findByIdAndUpdate(id, {$push: {likes: userId}})
        res.send({
            code: 1,
            msg: "点赞成功"
        })
    }


})
// 添加 likes 字段的接口
router.get('/add-likes-field', async (req, res) => {
    try {
        // 查询所有未设置 likes 字段的记录
        const trendsWithoutLikes = await trendDB.find({likes: {$exists: false}});

        // 遍历记录并添加 likes 字段
        for (const trend of trendsWithoutLikes) {
            trend.likes = []; // 初始化 likes 字段为一个空数组
            await trend.save(); // 保存更新后的记录
        }

        res.status(200).json({message: 'Likes字段已成功添加到所有记录中。'});
    } catch (error) {
        console.error('添加Likes字段时出错：', error);
        res.status(500).json({error: '服务器内部错误。'});
    }
});
router.get('/latest', async (req, res) => {
    try {
        // 查询最新的15条数据
        const trends = await trendDB.find({})
            .sort({ date: -1 }) // 按日期降序排序
            .limit(15) // 限制为15条数据
            .exec();

        // 从查询结果中提取 leaveContent
        const messages = trends.map(trend => trend.leaveContent);

        // 返回结果
        res.json({ messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器错误' });
    }
});
module.exports = router;










