export default {
    path: '/examine',
    component: () => import('../../layout/index.vue'),
    redirect: '/examine/create/examinePublish',
    name: 'examine',
    meta: {
        title: '学干考核',
        icon: 'examine'
    },
    children: [
        {
            path: 'create',
            meta: {
                title: '考核详情',
                icon: 'examineDetails'
            },
            redirect: '/examine/create/examinePublish',
            children: [
                {
                    path: 'examinePublish',
                    component: () => import('../../views/examine/examineCreate.vue'),
                    meta: {
                        title: '考核发布',
                        icon: 'examinePublish'
                    },
                },
                {
                    path: 'examineQuestion',
                    component: () => import('../../views/examine/examineQuestion.vue'),
                    meta: {
                        title: '学干考核',
                        icon: 'examineQuestion'
                    },
                }

            ]
        },
        {
            path: 'examineMg',
            component: () => import('../../views/examine/examineMg.vue'),
            meta: {
                title: '阅卷中心',
                icon: 'examineMg'
            }
        },
        {
            path: 'freeStudentCadres',
            component: () => import('../../views/examine/freeStudentCadres.vue'),
            meta: {
                title: '空闲学干',
                icon: 'freeTime'
            }
        }
    ]
}
