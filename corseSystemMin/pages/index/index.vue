<template>

	<load selector="load" v-if="showload"></load>
	<view class="container" v-else>
		<navigator url="../../subpkg-common/search/search">
			<view class="home-search">
				<!-- 搜索框 -->
				<view class="search">
					<view class="search-content">
						<!-- 在uni-app官网找的图标 -->
						<uni-icons type="search" size="26" color="#9F9F9F"></uni-icons>
						<text>请输入关键字搜索</text>
					</view>
				</view>
			</view>
		</navigator>
		<view class="swiper">
			<swiper :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000" circular="true">
			<!-- 	<swiper-item v-for="(item,index) in indexList" :key="index" @click="news(item._id)">
					<image :src='`${baseURL}${item.cover}`'></image>
				</swiper-item> -->
				<swiper-item @click="chatAI()">
					<image src="https://wypty.cn/static/file/material/rabbit.png"></image>
				</swiper-item>
			</swiper>
		</view>




		<minNav></minNav>







		<view class="activity">
			<view class="activity1">
				<image class="active1" @click="goTopage('/pagesHome/activity/volunteer')"
					src="https://wypty.cn/static/file/material/activity.png" alt="">
					<view class="p1-1">活动报名中</view>
					<view class="p1-2">人工智能与大数据学院</view>
				</image>
			</view>
			<view class="activity2">
				<view class="ac2">
					<image class="active2" @click="skip" src="https://wypty.cn/static/file/material/institutions.png"
						alt="">
						<view class="p2-1">AI体育部</view>
						<view class="p2-2">运动会火热报名中，快来看看吧</view>
					</image>
				</view>
				<view class="ac2">
					<image class="active2" @click="goTopage('/pagesHome/activity/latest?index=1')"
						src="https://wypty.cn/static/file/material/newActive.png" alt="">
						<view class="p3-1">最新活动</view>
						<view class="p3-2">快来查看吧</view>
					</image>
				</view>
			</view>
		</view>
		<ad unit-id="adunit-a09f4a84ad49603e"  binderror="adError" bindclose="adClose"
			v-if="!userInfo.adminPlus && !userInfo.admin"></ad>

		<view class="information-frame">
			<view class="p1">活动资讯</view>
			<view class="p2" @click="goTopage('/pagesHome/activity/latest?index=0')">查看全部></view>
		</view>
		<view class="information">
			<scroll-view class="scroll-content">
				<view class='scroll-item' v-for="(item,idx) in indexList" :key="idx">
					<view class="all-list" @click="news(item._id)">
						<view class="all-list-content">
							<text class="title">{{item.title.substring(0,10)}}</text>
							<text class="title">{{item.title.length>10?'...':''}}</text>
							<br>
							<text class="des">{{delHtmlTag(item.des).substring(0,14)}}</text>
							<text class="des">{{item.des.length>10?'...':''}}</text>
							<br>
							<view>
								<image src="../../static/orderImgs/people.png" alt=""
									style="height: 30rpx ;width: 30rpx;margin-right: 10rpx;">
								</image>
								<text class="read">
									{{simplifyNumber(item.pv)}}人阅读
								</text>
								<text class="date">{{date(item.date)}}</text>
							</view>

						</view>
						<image class="all-list-img" :src="`${baseURL}${item.cover}`" alt=""></image>
					</view>

				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	import minNav from '../../components/minNav/minNav.vue'
	import load from '../../components/load/load.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				showload: true,
				// heightEle:listNum*204,
				indexList: [],
				baseURL: ""
			}
		},
		components: {
			minNav,
			load
		},
		computed: {
			...mapState(['userInfo'])
		},

		onShow() {
		},
		onLoad() {

			this.baseURL = uni.baseURL
			this.getNewList()
			

		},
		onShareAppMessage() { // 分享到微信
			// 更多参数配置，参考文档
			return {
				title: '首页',
				path: '/pages/index/index'
			}
		},

		onShareTimeline() { // 分享到朋友圈
			return {
				title: '首页',
				path: '/pages/index/index'
			}
		},
		methods: {
			getNewList(){
				uni.$http.get('/api/get/newsLimit').then((res) => {
					if (res.errMsg == "request:ok") {
						this.indexList = res.data.data
						setTimeout(() => {
							this.showload = false
						}, 1000)
					}
				
				}).catch(error => {
					console.error(error);
					if (error) {
						this.showload = true
					}
				});
			},
			
			chatAI(){
				uni.navigateTo({
					url:"/pagesNav/societies/societies"
				})
			},
			skip() {
				uni.navigateToMiniProgram({
					// appid  写你要跳转的小程序的 appid
					appId: 'wxef891dcddac6ee45',
					// 路径写  src下的路径,假如你跳转的是pages下的页面,就可以写pages/index
					path: 'pages/index/index',
					extraData: {
						// 'type': 'out'
					},
					// 这个不写的话会显示开发环境,不能正常跳转,写上就能正常跳转了
					envVersion: 'develop',
					success(res) {
						// 打开成功
						uni.showToast({
							title: '跳转成功'
						})
					},
					fail(err) {
						// 打开失败/取消
						uni.showToast({
							title: '跳转失败',
							icon: 'error'
						})
					}
				})
			},

			simplifyNumber(num) {
				if (num >= 100000000) {
					return (num / 100000000).toFixed(1) + 'm';
				} else if (num >= 10000000) {
					return (num / 10000).toFixed(1) + 'w';
				} else if (num >= 10000) {
					return (num / 10000).toFixed(1) + 'w';
				} else if (num >= 1000) {
					return (num / 1000).toFixed(1) + 'K';
				} else {
					return num.toString();
				}
			},
			goTopage(url) {
				uni.navigateTo({
					url
				})
			},
			news(id) {
				uni.navigateTo({
					url: '/pagesHome/news/news?id=' + id
				})
			},
			// 去掉中文字符以外的字符
			delHtmlTag(str) {
				return str.replace(/[^\u4e00-\u9fa5]/g, '')

			},
			// 时间格式
			date(time) {
				return moment(time).format('YYYY-MM-DD')
			},
		},
		onPullDownRefresh() {

			uni.showToast({
				title: "刷新成功",
				icon: 'success',
				duration: 800
			})
			setTimeout(function() {

				uni.stopPullDownRefresh(); //停止页面加载动画
			}, 1000);
		},
	}
</script>

<style lang="scss">
	.Options {
		margin-top: 20rpx;
		height: 400rpx;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		background-color: aquamarine;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #fff;

		.Option {
			height: 200rpx;
			width: 25%;
			text-align: center;

			.p {
				margin-top: 8rpx;
				font-size: 27rpx;
				color: dimgrey;
			}

			.option {
				margin-top: 37rpx;
				height: 85rpx;
				width: 85rpx;
			}
		}
	}

	.container {
		height: 2800rpx;
		width: 100%;

		.home-search {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: -1rpx;
			z-index: 1;
			width: 100%;
			height: 100rpx;

			.search {
				width: 100%;
				height: 100rpx;
				display: flex;
				align-items: center;

				.search-content {
					width: 90%;
					height: 70rpx;
					margin: auto;
					border: 1rpx solid #E6E6E6;
					border-radius: 100rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #9F9F9F;
					background-color: #fff;

					text {
						margin-left: 10rpx;
					}
				}
			}
		}

		.swiper {
			height: 430rpx;
			background-size: 100% 100%;
			text-align: center;
			background-repeat: no-repeat;
			background-image: url("https://wypty.cn/static/file/material/bgswiper.jpg");

			swiper {
				width: 100%;
				height: 330rpx;
				padding-top: 100rpx;
			}

			swiper-item {
				width: 100%;
				height: 100%;
			}

			image {
				width: 91%;
				height: 100%;
				border-radius: 15rpx;
			}
		}

		.swiperFuntion {
			height: 430rpx;

			swiper {
				height: 430rpx;

			}
		}


		.activity {
			margin-top: 20rpx;
			height: 450rpx;
			width: 100%;
			display: flex;

			.activity1 {
				height: 450rpx;
				width: 50%;
				background-color: #fff;
				text-align: center;

				.active1 {
					margin-top: 5rpx;
					height: 93%;
					width: 90%;
					border-radius: 15rpx;
				}

				.p1-1 {
					font-size: 35rpx;
					color: #fff;
					margin-top: -395rpx;
					margin-left: -110rpx;
				}

				.p1-2 {
					font-size: 27rpx;
					color: #fff;
					margin-top: 10rpx;
					margin-left: -30rpx;
				}
			}

			.activity2 {
				height: 450rpx;
				width: 50%;
				display: flex;
				flex-wrap: wrap;

				.ac2 {
					height: 225rpx;
					width: 100%;
					background-color: #fff;
					text-align: center;

					.active2 {
						margin-top: 5rpx;
						height: 85%;
						width: 90%;
						border-radius: 15rpx;
					}

					.p2-1 {
						font-size: 33rpx;
						color: #fff;
						margin-top: -140rpx;
						margin-left: 125rpx;

					}

					.p2-2 {
						font-size: 27rpx;
						color: #fff;
						margin-top: 10rpx;
						margin-left: 125rpx;
					}

					.p3-1 {
						font-size: 33rpx;
						color: #fff;
						margin-top: -170rpx;
						margin-left: -160rpx;
					}

					.p3-2 {
						font-size: 27rpx;
						color: #fff;
						margin-top: 10rpx;
						margin-left: -150rpx;
					}
				}
			}
		}

		.information-frame {
			height: 110rpx;
			width: 100%;
			background-color: #fff;
			margin-top: 20rpx;
			margin-bottom: 1rpx;
			display: flex;

			.p1 {
				padding-top: 31rpx;
				margin-left: 37rpx;
				font-size: 35rpx;
			}

			.p2 {
				margin-left: 400rpx;
				padding-top: 33rpx;
				font-size: 30rpx;
				color: dimgrey;
			}
		}

		.information {
			width: 100%;
			height: 1213rpx;
			background-color: #fff;

			.scroll-content {
				width: 100%;
				height: 1207rpx;

				.scroll-item {
					width: 100%;

					.all-list {
						height: 100%;
						width: 90%;
						height: 200rpx;
						margin: 0 auto;
						border-bottom: 1rpx solid #E6E6E6;

						.all-list-content {
							float: left;
							width: 66%;
							overflow: hidden;
							height: 100%;
							color: #8a8a8a;
							font-size: 30rpx;
							line-height: 63rpx;

							.des {
								height: 48rpx;
								width: 100%;
								font-size: 27rpx;
								overflow: hidden;
							}

							.title {
								color: #000;
								font-size: 37rpx;
								line-height: 67rpx;
								line-height: 79rpx;
							}

							.read {
								font-size: 24rpx;
							}

							.date {
								float: right;
								margin: 6rpx;
								font-size: 24rpx;
							}
						}
					}

					.all-list-img {
						float: right;
						width: 28%;
						height: 140rpx;
						margin: 30rpx 4rpx;
					}
				}
			}
		}
	}
</style>