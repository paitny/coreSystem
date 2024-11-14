const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require("fs");

// 返回小程序首页导航栏
router.get('/minNav', async(req, res) => {
    try {
        await res.sendFile(path.join(__dirname, '../../dataJson/minNav.json'))
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
 })
router.post('/myServicesLimit', (req, res) => {
    const userInfo = req.body; // 从请求体中获取用户信息

    // 使用 readFileSync 同步读取 JSON 文件
    let data;
    try {
        data = fs.readFileSync(path.join(__dirname, '../../dataJson/myServices.json'));
    } catch (err) {
        return res.status(500).json({ message: '读取服务数据失败' });
    }

    // 将 JSON 文件解析为对象
    let services = JSON.parse(data);

    // 遍历每个服务项并使用 switch 处理不同的服务显示逻辑
    services.forEach((service, index) => {
        switch (index) {
            case 0:
            case 2:
                // 只有 admin 用户可以看到 index 0 和 2 的服务
                if (userInfo.admin||userInfo.position.includes("部长")) {
                    service.shouldShow = true;
                }
                break;
            case 1:
            case 3:
                // admin 或者 isCadre 用户可以看到 index 1 和 3 的服务
                if (userInfo.admin || userInfo.isCadre) {
                    service.shouldShow = true;
                }
                break;
            case 7:
            case 8:
            case 9:
                // admin 或者 position 中包含 “部长” 或 “负责人”的用户可以看到 index 7, 8 和 9 的服务
                if (userInfo.admin || userInfo.position.includes("部长") || userInfo.position.includes("负责人")) {
                    service.shouldShow = true;
                }
                break;
            case 10:
                // admin 或者 position 中包含 “学习部”的用户可以看到 index 10 的服务
                if (userInfo.admin || userInfo.position.includes("学习部")) {
                    service.shouldShow = true;
                }
                break;
            case 11:
                // admin、position 中包含 “学习部” 或者 class 中包含 “辅导员”的用户可以看到 index 11 的服务
                if (userInfo.admin || userInfo.position.includes("学习部") || userInfo.class.includes("辅导员")) {
                    service.shouldShow = true;
                }
                break;
            default:
                // 对于不需要特殊处理的服务项，可以保留默认逻辑
                service.shouldShow = service.shouldShow || false;
                break;
        }
    });

    // 返回修改后的服务数据
    res.json(services);
});

// router.post('/myServicesLimit', (req, res) => {
//     const userInfo = req.body; // 从请求体中获取用户信息
//
//     // 使用 readFileSync 同步读取 JSON 文件
//     let data;
//     try {
//         data = fs.readFileSync(path.join(__dirname, '../../dataJson/myServices.json'));
//     } catch (err) {
//         return res.status(500).json({ message: '读取服务数据失败' });
//     }
//
//     // 将 JSON 文件解析为对象
//     let services = JSON.parse(data);
//
//     // 根据用户身份动态修改 shouldShow 属性
//     if (userInfo.admin === true) {
//         services[2].shouldShow = !services[2].shouldShow;
//         services[0].shouldShow = !services[0].shouldShow;
//     }
//     if (userInfo.isCadre === true || userInfo.admin === true) {
//         services[1].shouldShow = !services[1].shouldShow;
//         services[3].shouldShow = !services[3].shouldShow;
//     }
//     if (userInfo.admin === true || userInfo.position.includes("部长") || userInfo.position.includes("负责人")) {
//         services[7].shouldShow = !services[7].shouldShow;
//         services[8].shouldShow = !services[8].shouldShow;
//         services[9].shouldShow = !services[9].shouldShow;
//     }
//     if (userInfo.admin === true || userInfo.position.includes("学习部")) {
//         services[10].shouldShow = !services[10].shouldShow;
//     }
//     if (userInfo.admin === true || userInfo.position.includes("学习部") || userInfo.class.includes("辅导员")) {
//         services[11].shouldShow = !services[11].shouldShow;
//     }
//     console.log(services)
//     // 返回修改后的服务数据
//     res.json(services);
// });
//用户服务
router.get('/myServices', async(req, res) => {
    try {


    await res.sendFile(path.join(__dirname, '../../dataJson/myServices.json'))
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

router.get('/foundList', async(req, res) => {
    try {
        await res.sendFile(path.join(__dirname, '../../dataJson/foundList.json'))
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
router.get('/searchUserList', async(req, res) => {
    try {
        await res.sendFile(path.join(__dirname, '../../dataJson/searchUser.json'))
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
router.get('/collegeNav', async(req, res) => {
    try {
        await res.sendFile(path.join(__dirname, '../../dataJson/college.json'))
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
router.get('/competitionData', async(req, res) => {
    try {
        await res.sendFile(path.join(__dirname, '../../dataJson/competition.json'))
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})

router.get('/teacher', async(req, res) => {
    try {
        await res.sendFile(path.join(__dirname, '../../dataJson/teacher.json'))
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
router.get('/specialities', async(req, res) => {
    try {
        await res.sendFile(path.join(__dirname, '../../dataJson/speciality.json'))
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '内部服务器错误' });
    }
})
module.exports = router
