export default
{
    path: '/softData',
    component: () => import('@/layout/index.vue'),
    redirect: '/softData/softDelete',
    name: 'softData',
    meta: {
        title: '数据安全',
        icon: 'softData'
    },
    children: [
        {
            path: 'softDelete',
            component: () => import('../../views/softData/softDelete.vue'),
            meta: {
                title: '回收站',
                icon: 'softDelete'
            },
        },

    ]
}
