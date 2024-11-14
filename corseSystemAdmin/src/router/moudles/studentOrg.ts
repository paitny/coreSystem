export default {
    path: '/studentOrg',
    component: () => import('../../layout/index.vue'),
    redirect: '/studentOrg/create/institution',
    name: 'studentOrg',
    meta: {
        title: '学生机构',
        icon: 'article'
    },
    children: [
        {
            path: 'create',
            meta: {
                title: '机构部门创建',
                icon: 'article-ranking'
            },
            redirect: '/studentOrg/create/institution',
            children: [
                {
                    path: 'institution',
                    component: () => import('../../views/studentOrg/studentCreate.vue'),
                    meta: {
                        title: '机构创建',
                        icon: 'article-add'
                    },
                },
                {
                    path: 'department',
                    component: () => import('../../views/studentOrg/departmentCreate.vue'),
                    meta: {
                        title: '部门创建',
                        icon: 'article-add'
                    },
                }

            ]
        },
        {
            path: 'studentOrgMg',
            component: () => import('../../views/studentOrg/studentOrgMg.vue'),
            meta: {
                title: '管理中心',
                icon: 'article-create'
            }
        }
    ]
}
