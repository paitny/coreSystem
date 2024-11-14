export default {
    userInfo: (state:any) => state.user.userInfo,
    menuRoute: (state:any) => {
        return state.route.menuRoute.length ? state.route.menuRoute : [
            {
                path: '/profile',
                title: '个人中心',
                icon: 'user',
                children: []
            }
        ]
    },
    sidebarOpened: (state:any) => state.app.sidebarOpened,
    tagsViewList: (state:any) => state.app.tagsViewList
}
