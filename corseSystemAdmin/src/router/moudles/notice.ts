export default
{
    path: '/notice',
    component: () => import('../../layout/index.vue'),
    redirect: '/notice/noticeMg',
    name: 'noticeMg',
    meta: {
        title: '通知',
        icon: 'notice'
    },
    children: [
        {
            path: 'noticeAdd',
            component: () => import('../../views/notice/noticeAdd.vue'),
            meta: {
                title: '通知添加',
                icon: 'noticeAdd'
            },
        },
        {
            path: 'noticeManage',
            component: () => import('../../views/notice/noticeManage.vue'),
            meta: {
                title: '通知管理',
                icon: 'noticeMg'
            },
        }
    ]
}
