export default {
    path: '/volunteer',
    component: () => import('../../layout/index.vue'),
    redirect: '/volunteer/volunteerMg',
    name: 'volunteer',
    meta: {
        title: '志愿者',
        icon: 'volunteer'
    },
    children: [
        {
            path: 'volunteerAdd',
            component: () => import('../../views/volunteer/volunteerAdd.vue'),
            meta: {
                title: '报名',
                icon: 'volunteer-add'
            },
        },
        {
            path: 'volunteerMg',
            component: () => import('../../views/volunteer/volunteerMg.vue'),
            meta: {
                title: '志愿者管理',
                icon: 'volunteer-mg'
            },
        },
        {
            path: 'quantization',
            component: () => import('../../views/volunteer/quantization.vue'),
            meta: {
                title: '学生量化',
                icon: 'quantization'
            },
        }
    ]
}
