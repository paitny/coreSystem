export default
{
    path: '/newsMg',
    component: () => import('../../layout/index.vue'),
    redirect: '/newsMg/newsMg',
    name: 'newsMg',
    meta: {
        title: '信工咨讯',
        icon: 'volunteer'
    },
    children: [
        {
            path: 'newsAdd',
            component: () => import('../../views/newsManage/newsAdd.vue'),
            meta: {
                title: '添加新闻',
                icon: 'volunteer-add'
            },
        },
        {
            path: 'newsManage',
            component: () => import('../../views/newsManage/newsManager.vue'),
            meta: {
                title: '咨讯管理',
                icon: 'volunteer-mg'
            },
        }
    ]
}
