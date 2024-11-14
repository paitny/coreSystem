// socketLogic.js
const socketIO = require('socket.io');
const UserExam = require("../db/userExam");
const userDB = require("../db/user");
const Feedback = require("../db/feedback"); // 添加 Feedback 数据库模型

function initializeSocketLogic(server) {
    const io = socketIO(server, {
        cors: {
            origin: 'http://localhost:7900',
            methods: ["GET", "POST"]
        }
    });

    // 维护用户ID到Socket ID的映射关系
    const userSocketMap = new Map();

    io.on('connection', (socket) => {
        console.log('用户已连接');

        socket.on('disconnect', () => {
            console.log('用户断开连接');

            // 当Socket断开连接时，删除用户ID映射
            const userId = userSocketMap.get(socket.id);
            if (userId) {
                userSocketMap.delete(socket.id);
                console.log(`Socket ${socket.id} 断开连接，用户 ${userId}`);
            }
        });

        socket.on('fetchData', async ({ examineId, userId }) => {
            try {
                // 将用户ID与Socket ID关联
                userSocketMap.set(socket.id, userId);

                const userData = await fetchDataAndSendToClient(examineId);
                io.to(socket.id).emit('userExamsData', userData);
            } catch (error) {
                // 捕获异步操作中的错误，并传递到错误处理中间件
                console.error(error.message);
            }
        });

        // 新增事件处理程序以获取未读条数
        socket.on('getUnreadCount', async () => {
            try {
                // 查询未读反馈数量并发送给客户端
                const unreadCount = await Feedback.countDocuments({ isRead: false });
                io.to(socket.id).emit('unreadCount', unreadCount);
            } catch (error) {
                console.error(error.message);
            }
        });
    });

    // 每隔三秒钟发送一次未读数量
    setInterval(async () => {
        try {
            // 查询未读反馈数量
            const unreadCount = await Feedback.countDocuments({ isRead: false });
            // 发送给所有连接的客户端
            io.emit('unreadCount', unreadCount);
        } catch (error) {
            console.error(error.message);
        }
    }, 3000);

    async function fetchDataAndSendToClient(examineId) {
        try {
            // 根据考试ID和用户ID过滤数据
            const userExams = await UserExam.find({ examineId: examineId });
            let userData = [];

            for (const userExam of userExams) {
                const user = await userDB.findById(userExam.userId);
                userData.push({
                    date: userExam.date,
                    name: user.name,
                    sex: user.sex,
                    institution: user.institution,
                    position: user.position,
                    id: userExam._id,
                    reviewer: userExam.reviewer,
                    totalScore: userExam.totalScore,
                });
            }

            const customOrder = ['分团委', '学生分会', '校友分会', '分团委学生社团管理部', '学生公寓自我管理委员会分会'];
            userData.sort((a, b) => {
                const orderA = customOrder.indexOf(a.institution);
                const orderB = customOrder.indexOf(b.institution);
                return orderA - orderB;
            });

            return userData;
        } catch (error) {
            throw error;
        }
    }

    return io;
}

module.exports = initializeSocketLogic;
