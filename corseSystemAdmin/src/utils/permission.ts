import router from "../router/index";
import store from "../store/index";
import {ElMessage} from "element-plus";


//白名单
const whiteList = ["/login", "/404", "/401", '/']
router.beforeEach(async (to, from, next) => {
    const isLoginCode =await store.dispatch("user/checkLoginFn")
    if (whiteList.includes(to.path)) {
        //在白名单中
        if (!isLoginCode && to.path === '/login') {
            //已登录
            ElMessage({
                showClose: true,
                message: "小芯提示:登录之后无法再次打开启动页面!",
                type: 'warning',
                grouping: true,
                duration:5000
            })
            return next('/')
        }
        next()//其他情况白名随便访问
    } else {
        //不在白名单里
        const allRoute = router.getRoutes()
        const routeIndex = allRoute.findIndex(item => item.path === to.path)
        // 在路由表中 且登录
        if (routeIndex >= 0 && !isLoginCode) {
            // 通行
            next()
        }
        if (routeIndex >= 0 && isLoginCode) {
            //未登录在路由表中get401
            next('/401')
        }
        if (routeIndex < 0) {
            next('/404')
        }
    }
})
