export default
{
    path: '/leaveMsg',
    component: () => import('../../layout/index.vue'),
    redirect: '/leaveMsg/process',
    name: 'news',
    meta: {
        title: '用户动态',
        icon: 'article'
    },
    children: [
        {
            path: 'process',
            component: () => import('../../views/leaveMsg/process.vue'),
            meta: {
                title: '动态审核',
                icon: 'article-ranking'
            },
        },
        {
            path: 'leaveMg',
            component: () => import('../../views/leaveMsg/leaveMg.vue'),
            meta: {
                title: '动态管理',
                icon: 'article-create'
            },
        }
    ]
}
