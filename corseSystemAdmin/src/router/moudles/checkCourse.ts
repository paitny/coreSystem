export default
{
    path: '/checkCourse',
    component: () => import('../../layout/index.vue'),
    redirect: '/checkCourse/create',
    name: 'news',
    meta: {
        title: '智数查课',
        icon: 'checkCourse'
    },
    children: [
        {
            path: 'uploadClassCourse',
            component: () => import('../../views/checkCourse/uploadClassCourse.vue'),
            meta: {
                title: '班级课表批量导入',
                icon: 'uploadClassCourse'
            },
        },
        {
            path: 'create',
            component: () => import('../../views/checkCourse/create.vue'),
            meta: {
                title: '班级课表',
                icon: 'checkCourseCreate'
            },
        },
        {
            path: 'checkCourseMg',
            component: () => import('../../views/checkCourse/checkCourseMg.vue'),
            meta: {
                title: '查课情况',
                icon: 'checkCourseMg'
            },
        }
    ]
}
