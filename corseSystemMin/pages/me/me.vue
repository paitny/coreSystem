<template>
	<view class="wrapper" v-if="userInfo.user" >

		<view  >

			<view class="top">
				<view class="center">
					<view class="center_top">
						<view class="center_img" :style="{
            backgroundImage: `url(${baseURL}${userInfo.photo}${random})`
          }" @tap="btnPage('/subpkg-common/setting/setting')">

						</view>
						<view class="center_info" @tap="btnPage('/subpkg-common/setting/setting')">
							<view class="center_name">
								<!-- 这里可以放自己的名称图片 -->
								<text>{{userInfo.name}} · {{ userInfo.province ? userInfo.province : "未知"}}</text>

							</view>
							<view class="center_class">

								<text>{{userInfo.grade==="暂无"?'':userInfo.grade}} {{userInfo.class==="暂无"?'':userInfo.class}} {{userInfo.levels==="暂无"?'':userInfo.levels}}</text>
							</view>
							<view class="center_vip"
								v-if="userInfo.num==='213817310403'||userInfo.num==='211060150310'||userInfo.num==='221060860127'||userInfo.num==='213817311132'||userInfo.num==='211060450120'">
								<image class="rank_icon" src="../../static/orderImgs/svip.png" />
								<view class="vip_text">
									<view>{{userInfo.position}}</view>
								</view>
							</view>
							<view class="center_vip" v-else-if="userInfo.isCadre||userInfo.admin">
								<image class="rank_icon" src="../../static/orderImgs/VIP.png" />
								<view class="vip_text">
									<view>{{userInfo.position}}</view>
								</view>
							</view>


							<view class="center_vip" v-else>
								<image class="rank_icon" src="../../static/orderImgs/star.png" />
								<view class="vip_text">
									<view>{{userInfo.position}}</view>
								</view>
							</view>

						</view>
						<view style="margin-left: 80rpx;margin-top: 15rpx;"
							@tap="btnPage('/subpkg-common/setting/setting')">
							<image style="width: 30px;height: 30px;" src="../../static/set.png"></image>
						</view>
					</view>
				</view>
				<image src='https://wypty.cn/static/file/material/waterflow.gif' mode='scaleToFill' class='gif-wave'>
				</image>
			</view>
		</view>
		<!-- 统计 -->
		<view class="count"  >
			<view class="cell" @tap="btnPage('/subpkg-visualization/myActivity/myActivity')">
				{{volunteerCount||0}}<text style="color: #AAAAAA;">我的活动</text>
			</view>
			<view class="cell" @click="trendCountClick">{{trendCount||0}}<text style="color: #AAAAAA;">我的动态</text>
			</view>
			<view class="cell" @tap="btnPage('/subpkg-activity/myCollect/myCollect')">{{courseCount||0}}<text
					style="color: #AAAAAA;">我的收藏</text>
			</view>
			<view class="cell" @tap="btnPage('/subpkg-common/printFoot/printFoot')">{{userFoots|| 0}}<text
					style="color: #AAAAAA;">浏览记录</text> </view>


		</view>

		<ad-custom unit-id="adunit-0715124d37c6439b" bindload="adLoad" binderror="adError" bindclose="adClose"
			v-if="!(userInfo.adminPlus && userInfo.admin)"></ad-custom>


		<!-- 我的订单 -->
		<view class="orders" >
			<view class="title">我的服务</view>
			<view class="sorts" >
				<view class="process-icon" v-for="(item, index) in visibleServices" @tap="btnPage(item.page)"
					:key="item.id" v-show="item.shouldShow">
					<image :src="`${baseURL}${item.img}`" style="width: 80rpx; height: 80rpx"></image>
					<view>{{item.title}}</view>
					<!-- 只在第九个项目上显示计数标记 -->
					<view class="badge" v-if="item.id === 9 && countAudit>0">{{countAudit}}</view>
				</view>
				<!-- 显示第9个“更多”图标 -->
				<view class="process-icon" v-if="showMoreButton" @tap="showMoreServices">
					<image src="../../static/orderImgs/more.png" style="width: 80rpx; height: 80rpx"></image>
					<view>更多服务</view>
					<view class="badge" v-if="countAudit>0">{{countAudit}}</view>
				</view>

			</view>
		</view>
		<Pop :isPopupVisible="isPopupVisible" :contributor="contributor" @hidePopup="hidePopup" v-if="isPopupVisible">
		</Pop>
		<morePop ref="comment" :comments="MyServicesDataPop" :isVisible="isVisible" @btnPage="btnPage" @close.stop="closeCommentSection"
			@getComments="getComments" :countAudit="countAudit">
		</morePop>
		<!-- 其它 -->
		<view class="extra">

			<button open-type="feedback" class="item icon-arrow">意见反馈</button>
			<view @click="makePhone" class="item icon-arrow">联系客服</view>
			<view class="item icon-arrow">
				<view class="">贡献者:</view>

				<view class="contributor">
					<view class="contributorBox" v-for="item in getContributorData" :key="item._id"
						@click="showPopup({avatar:baseURL+item.photo,name:item.name,gender:item.sex,grade:item.grade,className:item.class,nickName:item.nickName,counsellor:item.counsellor,personality:item.personality,position:item.position})">
						<view class="contributorImg">
							<image :src='`${baseURL}${item.photo}`' mode=""></image>
						</view>
						<view class="nickname">
							{{item.nickName}}
						</view>
					</view>

				</view>

			</view>
		</view>

	</view>

	<goLogin v-else></goLogin>

</template>

<script>
	import goLogin from '../../components/goLogin/goLogin.vue'
	import Pop from '../../components/pop/pop.vue'
	import morePop from '../../components/morePop/morePop.vue'
	let videoAd = null
	import {
		mapState,
		mapMutations
	} from "vuex"
	export default {
		data() {
			return {
				copiedText: "https://sit.cdcas.edu.cn",
				baseURL: "",
				userType: [],
				volunteerCount: "",
				trendCount: "",
				courseCount: "",
				userExamCount: "",
				userFoots: "",
				MyServicesData: [],
				random: '',
				getContributorData: [],
				isPopupVisible: false,
				contributor: {},
				countAudit: 0,
				visibleServices: [],
				showMoreButton: false,
				isVisible: false,
				MyServicesDataPop: []

			}
		},
		components: {
			goLogin,
			Pop,
			morePop
		},
		watch: {
			userInfo() {
				this.random = `?_=${Date.now()}`
			}
		},
		// 得到属性userInfo
		computed: {
			...mapState(['userInfo'])
		},
		onShow() {
			this.getCount()
			this.getMyServices()
			this.getAuditCount()
			
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo', // 你存储的数据的键名
				success: (res) => {

					this.$store.commit('loginSuccess', res.data);

					this.getCount()
				},
				fail: (err) => {
					console.log('获取本地存储失败', err);
				}
			});


			this.baseURL = uni.baseURL
			this.getMyServices()
			this.getContributor()
			
		},

		methods: {
			closeCommentSection() {
				this.isVisible = false
			},
			showMoreServices() {
				this.isVisible = true
			},
			getProvince(location) {

				uni.$http.get("/api/get/province", {
					ip: location
				}).then(res => {

					this.checkLogin(res.data.data)
				})
			},

			getUserLocation() {
				uni.request({
					url: 'https://ipapi.co/json/', // IP API 的 URL
					method: 'GET',
					success: (res) => {
						if (res.statusCode === 200) {
							const data = res.data;
							const location = data.region || data.city; // 例如四川、重庆
							// this.userLocation = location;

							this.getProvince(location)

						} else {
							console.log('获取位置失败:', res);
						}
					},
					fail: (error) => {
						console.log('请求失败:', error);
					}
				});
			},
			getAuditCount() {
				uni.$http.get("/api/itVolunteer/auditCount", {
					userId: this.userInfo._id
				}).then(res => {
					this.countAudit = res.data.data
				})
			},
			getImageUrl(imgurl) {
				// 使用当前时间戳来确保每次都是不同的URL
				return this.baseURL + imgurl + '?timestamp=' + '709920';
			},
			//id就是传入的广告位id
			load(id) {
				console.log(id);
				// 在页面onLoad回调事件中创建激励视频广告实例
				if (uni.createRewardedVideoAd) {

					videoAd = uni.createRewardedVideoAd({
						adUnitId: id
					})
					videoAd.onLoad(() => {})
					videoAd.onError((err) => {
						console.error('激励视频光告加载失败', err)
					})
					videoAd.onClose((status) => {
						if (status && status.isEnded || status === undefined) {

							this.isPopupVisible = true;

						} else {
							uni.showToast({
								duration: 1500,
								title: "获取失败",
								icon: "none"
							})
						}
					})
				}
			},
			show() {
				if (videoAd) {
					videoAd.show().catch(() => {
						// 失败重试
						videoAd.load()
							.then(() => videoAd.show())
							.catch(err => {
								console.error('激励视频 广告显示失败', err)
							})
					})
				}
			},

			showPopup(contributor) {
				uni.showModal({
					content: '贡献者详情需观看激励广告后可查看',
					success: (e) => {
						if (e.confirm) {
							if (this.userInfo.admin && this.userInfo.adminPlus) {
								this.contributor = contributor
								this.isPopupVisible = true
								return;
							}
							this.load('adunit-a96ef049dea42dda')
							this.show()
							this.contributor = contributor

						}
					}
				});

			},
			hidePopup() {
				this.isPopupVisible = false;
			},
			// async getMyServices() {
			// 	await uni.$http.get('/api/route/myServices').then((res) => {

			// 		this.MyServicesData = res.data
			// 		if (this.userInfo.admin === true) {
			// 			this.MyServicesData[2].shouldShow = !this.MyServicesData[2].shouldShow;
			// 			this.MyServicesData[0].shouldShow = !this.MyServicesData[0].shouldShow;
			// 		}
			// 		if (this.userInfo.isCadre === true || this.userInfo.admin === true) {
			// 			this.MyServicesData[1].shouldShow = !this.MyServicesData[1].shouldShow;
			// 		}
			// 		if (this.userInfo.isCadre === true || this.userInfo.admin === true) {
			// 			this.MyServicesData[3].shouldShow = !this.MyServicesData[3].shouldShow;
			// 		}
			// 		if (this.userInfo.admin === true || this.userInfo.position.includes("部长") || this.userInfo
			// 			.position.includes("负责人")) {
			// 			this.MyServicesData[7].shouldShow = !this.MyServicesData[7].shouldShow;
			// 		}
			// 		if (this.userInfo.admin === true || this.userInfo.position.includes("部长") || this.userInfo
			// 			.position.includes("负责人")) {
			// 			this.MyServicesData[8].shouldShow = !this.MyServicesData[8].shouldShow;
			// 		}
			// 		if (this.userInfo.admin === true || this.userInfo.position.includes("部长") || this.userInfo
			// 			.position.includes("负责人")) {
			// 			this.MyServicesData[9].shouldShow = !this.MyServicesData[9].shouldShow;
			// 		}
			// 		if (this.userInfo.admin === true || this.userInfo.position.includes("学习部")) {
			// 			this.MyServicesData[10].shouldShow = !this.MyServicesData[10].shouldShow;
			// 		}
			// 		if (this.userInfo.admin === true || this.userInfo.position.includes("学习部") || this.userInfo
			// 			.class.includes("辅导员")) {
			// 			this.MyServicesData[11].shouldShow = !this.MyServicesData[11].shouldShow;
			// 		}
			// 	})
			// },
			// async getMyServices() {
			//   const userInfo = {
			//     admin: this.userInfo.admin,
			//     isCadre: this.userInfo.isCadre,
			//     position: this.userInfo.position,
			//     class: this.userInfo.class
			//   };

			//   // 使用 POST 请求将用户信息发送到后端
			//   const res = await uni.$http.post('/api/route/myServices', userInfo);
			//   this.MyServicesData = res.data;
			// },

			async getMyServices() {
				try {
					// 收集用户信息
					const userInfo = {
						admin: uni.getStorageSync('userInfo').admin,
						isCadre: uni.getStorageSync('userInfo').isCadre,
						position: uni.getStorageSync('userInfo').position,
						class: uni.getStorageSync('userInfo').class
					};

					// 使用 POST 请求将用户信息发送到后端
					const res = await uni.$http.post('/api/route/myServicesLimit', userInfo);
					const allServices = res.data;
					this.MyServicesDataPop = res.data
					// 过滤出 shouldShow 为 true 的服务
					const visibleServices = allServices.filter(service => service.shouldShow);

					// 控制显示的图标数量
					if (visibleServices.length > 8) {
						this.visibleServices = visibleServices.slice(0, 8);
						this.showMoreButton = true;
					} else {
						this.visibleServices = visibleServices;
						this.showMoreButton = false;
					}
				} catch (error) {
					console.error('Error fetching services:', error);
					// 在实际应用中，你可能会想显示用户友好的错误提示
					uni.showToast({
						title: '请登录',
						icon: 'none'
					});
				}
			},

			openExternalLink() {
				// 使用uni.navigateTo跳转到外部链接
				uni.navigateTo({
					url: '/subpkg-common/webview/webview?url=' + this.copiedText, // 将URL替换为你想要跳转的外部链接
				});
			},
			//联系客服
			makePhone() {
				uni.makePhoneCall({
					phoneNumber: '17366904803'
				});



			},
			trendCountClick() {
				uni.showToast({
					duration: 1500,
					title: "此功能正在开发中...",
					icon: "none"
				})
			},
			getCount() {
				uni.$http.get('/api/get/getStatistics', {
					num: this.userInfo.num,
					userId: this.userInfo._id
				}).then((res) => {
					this.volunteerCount = ""
					this.volunteerCount = res.data.data.volunteerCount
					this.trendCount = ""
					this.trendCount = res.data.data.trendCount
					this.courseCount = ""
					this.courseCount = res.data.data.courseCount
					this.userFoots = ""
					this.userFoots = res.data.data.userFoots
				})
			},
			//退出登录
			...mapMutations(['loginOut']),
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
			gotoFeeds(url) {
				// 可以跳多级目录
				uni.switchTab({
					url
				})
				//跳转同级路由目录
				// uni.switchTab({
				// 	url
				// })
			},
			getContributor() {
				uni.$http.get("/api/get/getUserByFixedNum").then((res) => {

					this.getContributorData = res.data
				})
			},
			btnPage(url) {
				uni.navigateTo({
					url
				})
			},
			copyUrl() {
				uni.setClipboardData({
					data: this.copiedText,
					success() {
						uni.showToast({
							title: '链接已复制',
							icon: 'success'
						});
					},
					fail() {
						uni.showToast({
							title: '复制失败',
							icon: 'none'
						});
					}
				});
			},
			checkLogin(province) {
				console.log(province);
				uni.$http.post('/api/login/min/check', {
						id: this.userInfo._id,
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

									this.$store.commit('loginSuccess', res.data);
								},
								fail: (err) => {
									console.log('获取本地存储失败', err);
								}
							});
							this.$forceUpdate();
						}

					})


			}
		},
		mounted() {


		},
		async onPullDownRefresh() {
			await this.getCount()
			await this.getUserLocation()
			uni.showToast({
				title: "刷新成功",
				icon: 'success',
				duration: 800
			})
			setTimeout(function() {
				uni.stopPullDownRefresh(); //停止页面加载动画
			}, 1000);
		}
	};
</script>
<style scoped lang="scss">
	Page {
		font-size: 14px;
	}

	.top {
		width: 100%;
		height: 130px;
		background: #60a4ef;
		padding-top: 15px;
		position: relative;
	}

	.center {
		width: 95%;
		height: 200rpx;
		background: white;
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		border-radius: 10rpx;
		z-index: 999;
	}

	.center_top {
		display: flex;
		flex-direction: row;
		height: 160rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		border-bottom: 2rpx solid #EEEEEE;
	}

	.center_img {
		width: 132rpx;
		height: 132rpx;
		border-radius: 50%;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}



	.center_img .user_head {
		width: 100%;
		height: 100%;
	}

	.center_info {
		display: flex;
		flex-direction: column;
		margin-top: 20rpx;
		margin-left: 60rpx;


	}

	.center_name {
		font-size: 25rpx;

	}

	.center_class {
		font-size: 20rpx;
	}

	.center_phone {
		color: #BEBEBE;
	}

	// .center_down {
	// 	display: flex;
	// 	flex-direction: row;
	// 	width: 80%;
	// 	height: 35px;
	// 	margin: 0 auto;
	// 	margin-top: 20rpx;
	// }

	.center_rank {
		width: 50%;
		height: 70rpx;
		display: flex;
		flex-direction: row;
	}

	.rank_text {
		height: 70rpx;
		line-height: 70rpx;
		margin-left: 10rpx;
		color: #AAAAAA;
	}

	.center_vip {
		display: flex;
		align-items: center;
	}

	.center_vip image {
		width: 50rpx;
		height: 50rpx;

	}

	.vip_icon {
		width: 50rpx;
		height: 50rpx;

	}

	.vip_text {
		white-space: nowrap;
		margin-left: 10rpx;
		font-size: 25rpx;
		color: #AAAAAA;
	}

	.center_rank image {
		width: 70rpx;
		height: 70rpx;
	}

	.center_score {
		width: 50%;
		height: 70rpx;
		display: flex;
		flex-direction: row;
	}

	.center_score image {
		width: 70rpx;
		height: 70rpx;
	}

	.gif-wave {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	.wrapper {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;

	}

	.profile {
		height: 375rpx;
		background-color: #ea4451;
		display: flex;
		justify-content: center;
		align-items: center;

		.meta {
			.avatar {
				display: block;
				width: 140rpx;
				height: 140rpx;
				border-radius: 50%;
				border: 2rpx solid #fff;
				overflow: hidden;
			}

			.nickname {
				display: block;
				text-align: center;
				margin-top: 20rpx;
				font-size: 30rpx;
				color: #fff;
			}
		}
	}

	.count {
		display: flex;
		margin: 0 20rpx;
		height: 120rpx;
		text-align: center;
		border-radius: 4rpx;
		background-color: #fff;

		position: relative;
		top: 10rpx;

		.cell {
			margin-top: 10rpx;
			flex: 1;
			padding-top: 20rpx;
			font-size: 27rpx;
			color: #333;
		}

		text {
			display: block;
			font-size: 24rpx;
		}
	}

	.orders {
		margin: 20rpx 20rpx 0 20rpx;
		padding: 40rpx 0;
		background-color: #fff;
		border-radius: 4rpx;

		.title {
			padding-left: 20rpx;
			font-size: 30rpx;
			color: #333;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #eee;
			margin-top: -30rpx;
		}

		.sorts {
			font-size: 27rpx;
			color: dimgrey;
			display: flex;
			flex-wrap: wrap;

			.process-icon {
				--container-width: 94vw;
				/* 视口宽度的 95% 作为容器宽度 */
				--element-margin: 20rpx;
				/* 间距为 10px，根据需要调整 */
				--element-width: calc((var(--container-width) / 3) - (2 * var(--element-margin)));
				/* 每个元素的宽度计算 */

				width: var(--element-width);
				margin: var(--element-margin);
				box-sizing: border-box;
				text-align: center;
				position: relative;

				.badge {
					position: absolute;
					top: 0;
					right: 55rpx;
					background-color: red;
					color: white;
					border-radius: 50%;
					width: 35rpx;
					height: 35rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 22rpx;
					line-height: 35rpx;
				}

			}
		}





		[class*="icon-"] {
			flex: 1;
			font-size: 24rpx;

			&::before {
				display: block;
				font-size: 48rpx;
				margin-bottom: 8rpx;
				color: #ea4451;
			}
		}
	}

	.address {
		line-height: 1;
		background-color: #fff;
		font-size: 30rpx;
		padding: 25rpx 0 25rpx 20rpx;
		margin: 10rpx 20rpx;
		color: #333;
		border-radius: 4rpx;
	}

	.extra {
		margin: 0 20rpx;
		background-color: #fff;
		border-radius: 4rpx;

		.item {
			line-height: 1;
			padding: 25rpx 0 25rpx 20rpx;
			border-bottom: 1rpx solid #eee;
			font-size: 30rpx;
			color: #333;
		}

		button {
			text-align: left;
			background-color: #fff;

			&::after {
				border: none;
				border-radius: 0;
			}
		}
	}

	.icon-arrow {
		position: relative;

		&::before {
			position: absolute;
			top: 50%;
			right: 20rpx;
			transform: translateY(-50%);
		}
	}

	.contributor {
	    display: flex;
	    flex-wrap: wrap; /* 允许换行 */
	    align-items: center;
	    justify-content: flex-start; /* 可以改为 flex-start 或 space-between */
	    padding: 15rpx;
	}
	
	.contributorBox {
	    display: flex;
	    flex-direction: column;
	    width: 120rpx; /* 调整宽度 */
	    height: 90rpx;
	    align-items: center;
	    justify-content: space-between;
	    margin: 5rpx; /* 添加间距 */
	}
	
	.contributorImg {
	    image {
	        width: 50rpx;
	        height: 50rpx;
	        border-radius: 50%;
	    }
	}
	
	.nickname {
		text-align: center;
	     display: block; /* 确保是块级元素 */
	        width: 100rpx; /* 设置宽度，与 .contributorBox 宽度一致 */
	        white-space: nowrap; /* 不换行 */
	        overflow: hidden; /* 隐藏超出部分 */
	        text-overflow: ellipsis; /* 超出部分用 ... 替代 */
	        font-size: 25rpx; /* 字体大小 */
	}

</style>