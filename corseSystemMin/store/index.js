import {
	createStore
} from 'vuex';
export default createStore({
	state: {
		// 用户信息
		userInfo: {}
	},
	mutations: {
		// 更变用户信息
		loginSuccess(state, userInfo) {
			state.userInfo = uni.getStorageSync('userInfo') || userInfo;
		},
		// 退出登录清除用户信息
		loginOut(state) {
			state.userInfo = {};
		}
	},
	actions: {},
	modules: {},
});