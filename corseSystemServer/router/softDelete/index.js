const express = require('express');
const { MongoClient,ObjectId } = require('mongodb');
const router = express.Router();

const url = 'mongodb://localhost:27017';
const dbName = 'itstudent';
let db;

// 连接数据库
async function connectDB() {
    const client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
}

connectDB().catch(console.error);

// 获取所有被删除的数据
// router.get('/deleted-data', async (req, res) => {
//     try {
//         const collections = await db.listCollections().toArray();
//         const collectionNames = collections.map(collection => collection.name);
//
//         const results = await Promise.all(collectionNames.map(async (collection) => {
//             const deletedItems = await db.collection(collection).find({ isDeleted: true }).toArray();
//             // 在每个数据项中添加 tableName 字段
//             return deletedItems.map(item => ({ ...item, tableName: collection }));
//         }));
//
//         // 合并所有结果并过滤掉空数组
//         const combinedDeleted = results.flat().filter(item => item);
//         res.json(combinedDeleted);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });
// 获取所有被删除的数据（分页）
// 获取所有被删除的数据（分页）
router.get('/deleted-data', async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // 获取页码和每页数量，默认值为 1 和 10

    try {
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(collection => collection.name);

        const results = await Promise.all(collectionNames.map(async (collection) => {
            const deletedItems = await db.collection(collection)
                .find({ isDeleted: true })
                .toArray(); // 获取所有被删除的数据
            
            // 在每个数据项中添加 tableName 字段
            return deletedItems.map(item => ({ ...item, tableName: collection }));
        }));

        // 合并所有结果并过滤掉空数组
        const combinedDeleted = results.flat().filter(item => item);

        // 对合并后的结果进行排序，按 deletedAt 字段
        combinedDeleted.sort((a, b) => {
            // 使用 deletedAt 字段进行排序，假设该字段存在
            return new Date(b.deletedAt) - new Date(a.deletedAt); // 降序排序
        });

        // 获取总的被删除数据数量
        const totalCount = combinedDeleted.length; // 计算总数量

        // 分页处理
        const paginatedData = combinedDeleted.slice((page - 1) * limit, page * limit);

        res.json({
            totalCount, // 返回总数
            data: paginatedData // 返回当前页的数据
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// router.post('/recover', async (req, res) => {
//     const { tableName, id } = req.body;
//     console.log(tableName, id )
//     try {
//         const result = await db.collection(tableName).updateOne(
//             { _id: ObjectId(id), isDeleted: false }, // 只恢复已删除的数据
//             { $set: { isDeleted: false, deletedAt: null } } // 恢复状态
//         );
//         console.log(result)
//
//         if (result.matchedCount === 0) {
//             return res.status(404).json({ message: '数据未找到或未被删除' });
//         }
//
//         res.json({ message: '数据恢复成功' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });
// 软删除数据的接口
// router.post('/recover', async (req, res) => {
//     const { tableName, id } = req.body;
//
//     try {
//         // 假设所有表都有一个名为 isDeleted 的字段用于标记删除状态
//         const result = await mongoose.connection.db.collection(tableName).findOneAndUpdate(
//             { _id: mongoose.Types.ObjectId(id) },
//             { $set: { isDeleted: false } },
//             { returnOriginal: false }
//         );
//
//         if (!result.value) {
//             return res.status(404).json({ message: '数据未找到' });
//         }
//
//         res.status(200).json({ message: '数据已恢复', data: result.value });
//     } catch (error) {
//         console.log(1)
//         res.status(500).json({ message: '服务器错误', error });
//     }
// });
// router.post('/recover', async (req, res) => {
//     const { tableName, id } = req.body;
//
//     // 动态定义模型
//     let Model;
//     if (mongoose.models[tableName]) {
//         Model = mongoose.models[tableName];
//     } else {
//         const schema = new mongoose.Schema({}, { collection: tableName });
//         Model = mongoose.model(tableName, schema);
//     }
//
//     try {
//         // 更新操作，将 isDeleted 字段设置为 false
//         const result = await Model.updateOne(
//             { _id: id },
//             { $set: { isDeleted: false } }
//         );
//
//         if (result.nModified > 0) {
//             res.status(200).send('数据恢复成功');
//         } else {
//             res.status(404).send('未找到数据或数据已恢复');
//         }
//     } catch (error) {
//         console.error('恢复数据时发生错误:', error);
//         res.status(500).send('恢复过程中发生错误');
//     }
// });
// 数据恢复接口
router.post('/recover', async (req, res) => {
    const { tableName, id } = req.body;
    console.log(`请求恢复数据: 表名=${tableName}, ID=${id}`);

    try {
        // 更新操作，将 isDeleted 字段设置为 false
        const result = await db.collection(tableName).updateOne(
            { _id: new ObjectId(id) }, // 使用 new ObjectId
            { $set: { isDeleted: false } }
        );

        if (result.modifiedCount > 0) {
            res.status(200).send('数据恢复成功');
        } else {
            res.status(404).send('未找到数据或数据已恢复');
        }
    } catch (error) {
        console.error('恢复数据时发生错误:', error);
        res.status(500).send('恢复过程中发生错误');
    }
});
module.exports = router;
