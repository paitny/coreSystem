export default
{
    path: '/trends',
    component: () => import('@/layout/index.vue'),
    redirect: '/trends/process',
    name: 'trends',
    meta: {
        title: '用户动态',
        icon: 'trends'
    },
    children: [
        {
            path: 'process',
            component: () => import('../../views/leaveMsg/process.vue'),
            meta: {
                title: '动态审核',
                icon: 'bgsan'
            },
        },
        {
            path: 'leaveMg',
            component: () => import('../../views/leaveMsg/leaveMg.vue'),
            meta: {
                title: '动态管理',
                icon: 'trendsMg'
            },
        }
    ]
}
