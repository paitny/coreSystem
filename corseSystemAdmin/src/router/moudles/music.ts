export default
{
    path: '/music',
    component: () => import('@/layout/index.vue'),
    redirect: '/music/micMg',
    name: 'music',
    meta: {
        title: '音乐',
        icon: 'musiclist'
    },
    children: [
        {
            path: 'micAdd',
            component: () => import('../../views/Music/MusicAdd.vue'),
            meta: {
                title: '添加音乐',
                icon: 'music-add'
            },
        },
        {
            path: 'micMg',
            component: () => import('../../views/Music/MusicManager.vue'),
            meta: {
                title: '管理音乐',
                icon: 'music-manage'
            },
        }
    ]
}
