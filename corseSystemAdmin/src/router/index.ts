import {createRouter, createWebHashHistory} from "vue-router";
import news from "./moudles/news";
import music from "./moudles/music";
import  volunteer from './moudles/volunteer'
import  trends from './moudles/trends'
import  studentOrg from './moudles/studentOrg'
import alumnus from './moudles/alumnus'
import  examine from './moudles/examine'
import notice from "./moudles/notice";
import checkCourse from "./moudles/checkCourse";
import softData from "./moudles/softData";
const routes = [

    {
        path: "/",
        component: () => import("../layout/index.vue"),
        redirect: '/profile',
        children: [
            {
                path: "/profile",
                component: () => import("../views/profile/index.vue"),

                meta: {
                    title: '个人中心',
                    icon: "user"
                }

            },

        ]
    },
    {
        path: "/login",
        component: () => import("../views/login/index.vue")
    },
    {
        path: '/401',
        component: () => import('../views/error-page/401.vue'),
    },
    {
        path: '/404',
        component: () => import('../views/error-page/404.vue'),
    },
    {
        path: "/",
        component: () => import("../layout/index.vue"),
        children: [
            {
                path: "/userSport",
                component: () => import("../views/User/UserManager.vue"),

                meta: {
                    title: '用户管理',
                    icon: "user"
                }
            }
        ]
    },
    {
        path: "/",
        component: () => import("../layout/index.vue"),
        children: [
            {
                path: "/feedback",
                component: () => import("../views/feedback/index.vue"),

                meta: {
                    title: '用户反馈',
                    icon: "feedback"
                }
            }
        ]
    },

    {
        path: "/",
        component: () => import("../layout/index.vue"),
        children: [
            {
                path: "/newsId",
                component: () => import("../views/newsManage/newsId.vue"),
                name: "newsId",
                meta: {
                    title: '文章修改',
                    icon: "user"
                },
                props: (route: any) => ({id: route.query.id})
            }
        ]
    },
    {
        path: "/",
        component: () => import("../layout/index.vue"),
        children: [
            {
                path: "/volunteerId",
                component: () => import("../views/volunteer/volunteerData.vue"),
                name: "volunteerID",
                meta: {
                    title: '文章修改',
                    icon: "volunteer-add"
                },
                props: (route: any) => ({id: route.query.id})
            }
        ]
    },
    {
        path: "/",
        component: () => import("../layout/index.vue"),
        children: [
            {
                path: "/checkCourse",
                component: () => import("../views/checkCourse/checkCourseInfo.vue"),
                name: "checkCourse",
                meta: {
                    title: '查课详情',
                    icon: "checkCourseInfo"
                },
                props: (route: any) => ({id: route.query.id})
            }
        ]
    },
    {
        path: "/",
        component: () => import("../layout/index.vue"),
        children: [
            {
                path: "/classCourse",
                component: () => import("../views/checkCourse/classCourse.vue"),
                name: "classCourse",
                meta: {
                    title: '班级课表',
                    icon: "checkCourseInfo"
                },
                props: (route: any) => ({id: route.query.id})
            }
        ]
    },
    {
        path: "/",
        component: () => import("../layout/index.vue"),
        children: [
            {
                path: "/examineData",
                component: () => import("../views/examine/examineData.vue"),
                name: "examineData",
                meta: {
                    title: '考生试卷',
                    icon: "examineMg"
                },
                props: (route: any) => ({id: route.query.id})
            }
        ]
    },
    {
        path: "/",
        component: () => import("../layout/index.vue"),
        children: [
            {
                path: "/examineData/examineUserData",
                component: () => import("../views/examine/examTemplate.vue"),
                name: "examineUserData",
                meta: {
                    title: '阅卷中',
                    icon: "examineMg"
                },
                props: (route: any) => ({id: route.query.id})
            }
        ]
    },
    {
        path: "/",
        component: () => import("../layout/index.vue"),
        children: [
            {
                path: "/departmentInfo",
                component: () => import("../views/studentOrg/departmentsInfo.vue"),
                name: "departmentsInfo",
                meta: {
                    title: '部门详情',
                    icon: "volunteer-add"
                },
                props: (route: any) => ({id: route.query.id})
            }
        ]
    },
    {
        path: "/",
        component: () => import("../layout/index.vue"),
        children: [
            {
                path: "/userRegister",
                component: () => import("../views/User/register.vue"),
                name: "userRegister",
                meta: {
                    title: '用户操作',
                    icon: "volunteer-add"
                }

            }
        ]
    },
    {
        path: "/",
        component: () => import("../layout/index.vue"),
        children: [
            {
                path: "/visitorSport",
                component: () => import("../views/User/LatelyVisitor.vue"),
                meta: {
                    title: '管理访客',
                    icon: "user"
                }
            }
        ]
    },
    {
        path: "/",
        component: () => import("../layout/index.vue"),
        children: [
            {
                path: "/Curriculum",
                component: () => import("../views/Curriculum/index.vue"),
                meta: {
                    title: '管理访客',
                    icon: "Curriculum"
                }
            }
        ]
    },
    {
        path: "/",
        component: () => import("../layout/index.vue"),
        children: [
            {
                path: "/analysis",
                component: () => import("../views/analysis/index.vue"),
                meta: {
                    title: '数据分析',
                    icon: "analysis"
                }
            }
        ]
    },
    volunteer,
    news,
    studentOrg,
    alumnus,
    examine,
    checkCourse,
    trends,
    softData,
    notice,
    music


]


const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,

})
export default router
