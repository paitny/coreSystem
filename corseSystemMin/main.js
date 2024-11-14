
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import moment from 'moment';



Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import store from './store/index.js'
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  return {
    app
  }
}
// #endif


// #ifdef VUE3
import {
	$http
} from '@escook/request-miniprogram'
uni.$http = $http
$http.beforeRequest = function(options) {
	options.header = {
		authorization: "Bearer " + uni.getStorageSync('token'),
		id: uni.getStorageSync('userInfo')._id
	}
	


}
$http.afterRequest = function() {
	setTimeout(function() {
		uni.hideLoading();
	}, 800);
}
uni.$showMsg = function(title='数据加载失败',duration=1500){
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}
//上线环境
const staticURL = process.env.NODE_ENV === "development" ? '/static' : '/static'
const up=process.env.NODE_ENV === "development" ? '' : ''
uni.baseURL = 'https://wypty.cn' + staticURL
uni.uploadURL='https://wypty.cn'+ up
$http.baseUrl = 'https://wypty.cn'
//本地测试
// const staticURL = process.env.NODE_ENV === "development" ?  '' : '/static'
// const otherURL = process.env.NODE_ENV === "development" ?  '' : '/static'
// const up=process.env.NODE_ENV === "development" ? '' : ''
// uni.uploadURL='http://localhost:5200'+ up
// uni.baseURL='http://localhost:5200'+staticURL
// uni.otherURL= otherURL
// $http.baseUrl = 'http://localhost:5200'
// #endif