<template>
	<view class="frame">
		<view class="">
			<view style="padding-top: 17rpx; padding-left: 30rpx; font-size: 30rpx;">活动报名</view>
			<view style="padding-top: 7rpx; padding-left: 33rpx; font-size: 25rpx;color: dimgrey;">欢迎报名</view>
		</view>
		<view class="">《{{termName}}》</view>
	</view>
	<loading v-if="isloading"></loading>
	<view class="activityData" v-else>
		<view class="noData" v-if="activeData.length===0">
			<image src="../../static/orderImgs/noData.png" mode=""></image>
		</view>
		<view class="content"
			@click="application(item._id,item.title,item.deadline, item.startTime ,item.address, item.description, item.limitPerson,item.groupCode,item.groupNum)"
			v-for="item in activeData" :key="item._id">
			<image class="img" :src='`${baseURL}${item.cover}`' alt=""></image>
			<view style="margin-top: -101rpx;margin-left: 200rpx;font-size: 30rpx;">{{item.title}}</view>
		</view>
		<view v-if="loading" class="loading-text">加载中...</view>
		<view v-if="activeData.length===total&& activeData.length>0" class="loading-text">本学期就这些活动咯，共{{total}}条数据</view>
	</view>
</template>

<script>
	import loading from '../../components/loading/loading.vue'
	import {
		getCurrentSemester
	} from '@/Utils/semesterUtils.js';
	export default {
		data() {
			return {
				activeData: [],
				baseURL: "",
				termName: getCurrentSemester(),
				isloading: true,
				loading: false,
				page: 1,
				total: 0
			};
		},
		components: {
			loading
		},
		methods: {

			getActiveData() {
				uni.$http.get("/api/get/newActive", {
						page: this.page,
						semester: this.termName
					})
					.then((res) => {
						if (res.errMsg == "request:ok") {
							this.total = res.data.data.total;
							// 先保存当前的活动数据
							const existingIds = new Set(this.activeData.map(item => item._id));
							const newItems = res.data.data.list.filter(item => !existingIds.has(item._id));
							// 合并去重后的新数据
							this.activeData = [...this.activeData, ...newItems];
							setTimeout(() => {
								this.loading = false;
								this.isloading = false;
							}, 1000);
						}
					})
					.catch(error => {
						if (error) {
							this.isloading = true;
						}
					});
			},


			//检测是否登录
			checkLogin(id, title, deadline, startTime, address, description, limitPerson, groupCode, groupNum) {
				uni.$http.post('/api/login/min/check', {
						id: uni.getStorageSync('userInfo')._id
					})
					.then((res) => {
						if (res.data.code === 0) {

							return uni.showModal({
								content: '登录注册才有权限噢！',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: "/pagesMe/login/login?type=2"
										})
									}
								}
							});


						} else if (res.data.code === 2) {
							return uni.showModal({
								content: '登录注册才有权限噢！',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: "/pagesMe/login/login?type=2"
										})
									}
								}
							});

						} else if (res.data.code === 1) {
							uni.navigateTo({
								url: "/pagesHome/application/active?id=" + id + "&title=" + title +
									"&deadline=" + deadline +
									"&startTime=" + startTime +
									"&address=" + address +
									"&description=" + description +
									"&limitPerson=" + limitPerson +
									"&groupCode=" + groupCode +
									"&groupNum=" + groupNum
							})

						}

					})


			},

			application(id, title, deadline, startTime, address, description, limitPerson, groupCode, groupNum) {
				this.checkLogin(id, title, deadline, startTime, address, description, limitPerson, groupCode, groupNum)
			},

			loadMore() {


			}
		},


		onLoad() {
			this.getActiveData()

			this.baseURL = uni.baseURL
		},

		onShareAppMessage() { // 分享到微信
			// 更多参数配置，参考文档
			return {
				title: '活动',
				path: '/pagesHome/activity/volunteer'
			}
		},

		onShareTimeline() { // 分享到朋友圈
			return {
				title: '活动',
				path: '/pagesHome/activity/volunteer'
			}
		},
		onReachBottom() {
			if (this.activeData.length < this.total) {
				this.loading = true
				this.page++
				this.getActiveData()
			} else {
				uni.showToast({
					title: "我是有底线的噢",
					icon: "none",
					duration: 1800
				})
			}
		},
	}
</script>

<style lang="scss">
	.noData {
		image {
			position: absolute;
			width: 200rpx;
			height: 200rpx;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.activityData {
		margin-top: 120rpx;
	}

	.frame {
		width: 100%;
		position: fixed;
		z-index: 999;
		top: 0;
		left: 0;
		height: 110rpx;
		width: 100%;
		background-color: white;
		display: flex;
		align-items: center;

		.all {
			height: 100%;
			margin-top: -100rpx;
			line-height: 115rpx;
			margin-left: 587rpx;
			font-size: 25rpx;
			color: dimgrey;
		}
	}

	.content {
		margin-top: 6rpx;
		height: 193rpx;
		width: 100%;
		background-color: white;

		.img {
			height: 130rpx;
			width: 130rpx;
			margin-top: 30rpx;
			margin-left: 33rpx;
			border-radius: 5rpx;
		}
	}

	.loading-text {
		text-align: center;
		padding: 20rpx 0;
	}
</style>