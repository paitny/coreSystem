export default
{
    path: '/alumnus',
    component: () => import('../../layout/index.vue'),
    redirect: '/alumnus/alumnusMg',
    name: 'alumnus',
    meta: {
        title: '志愿者',
        icon: 'volunteer'
    },
    children: [
        {
            path: 'alumnusAdd',
            component: () => import('../../views/alumnus/alumnusAdd.vue'),
            meta: {
                title: '榜样添加',
                icon: 'volunteer-add'
            },
        },
        {
            path: 'alumnusMg',
            component: () => import('../../views/alumnus/alumnusMg.vue'),
            meta: {
                title: '榜样管理',
                icon: 'volunteer-mg'
            },
        }
    ]
}
