<script>
	import {
		mapState,
		mapMutations
	} from "vuex"

	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		computed: {
			...mapState(['userInfo'])
		},

		onShow: function() {
			console.log(1);
			const updateManager = uni.getUpdateManager(); //本API返回全局唯一的版本更新管理器对象： updateManager，用于管理小程序更新。
			updateManager.onCheckForUpdate((res) => { //当向小程序后台请求完新版本信息，进行回调方法
				if (res.hasUpdate) {
					updateManager.onUpdateReady((res) => { //当新版本下载完成，会进行回调
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							success(res) {
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						});

					});
					updateManager.onUpdateFailed((res) => {
						// 新的版本下载失败
						uni.showModal({
							title: '更新提示',
							content: '检查到有新版本，但下载失败，请检查网络设置',
							success(res) {
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						});
					});
				}
			})


			this.getUserLocation()

			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		comments: {

		},
		methods: {
			getUserLocation() {
				uni.request({
					url: 'https://2024.ipchaxun.com/', // IP API 的 URL
					method: 'GET',
					success: (res) => {
						
						if (res.statusCode === 200) {
							const data = res.data.data[1];
							console.log(res.data.data[1]);
							// const location = data.region || data.city; // 例如四川、重庆
							// this.userLocation = location;
							this.getProvince(data)
						} else {
							this.getProvince("未知")
							console.log('获取位置失败:', res);
						}
					},
					fail: (error) => {
						console.log('请求失败:', error);
					}
				});
			},
			...mapMutations(['loginOut', 'loginSuccess']),
			getProvince(location) {
				uni.$http.get("/api/get/province", {
					ip: location
				}).then(res => {
					this.checkLogin(res.data.data)
				})
			},
			removeStore() {
				uni.removeStorage({
					key: 'userInfo', // 要清除的数据的键名
					success: () => {
						console.log('数据清除成功');
					},
					fail: (err) => {
						console.log('数据清除失败', err);
					}
				});
				uni.removeStorage({
					key: 'token', // 要清除的数据的键名
					success: () => {
						console.log('数据清除成功');
					},
					fail: (err) => {
						console.log('数据清除失败', err);
					}
				});

			},
			checkLogin(province) {
				uni.$http.post('/api/login/min/check', {
						id: uni.getStorageSync('userInfo')._id,
						province: province
					})
					.then((res) => {
						if (res.data.code === 0) {
							this.loginOut()
							this.removeStore()
							setTimeout(() => {
								this.$forceUpdate();
							}, 200)

						} else if (res.data.code === 2) {
							this.loginOut()
							this.removeStore()
							setTimeout(() => {
								this.$forceUpdate();
							}, 200)

						} else if (res.data.code === 1) {
					
							uni.setStorageSync('userInfo', res.data.data);
						
							uni.getStorage({
								key: 'userInfo', // 你存储的数据的键名
								success: (res) => {
									console.log(res);
									this.$store.commit('loginSuccess', res.data.data);
								},
								fail: (err) => {
									console.log('获取本地存储失败', err);
								}
							});
							this.$forceUpdate();
						}

					})


			}
		}

	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';

	// 设置整个项目的背景色
	page {

		background-color: #f5f5f5;

	}

	/* #endif */
	.example-info {
		font-size: 28rpx;
		color: #333;
		padding: 20rpx;
	}
</style>