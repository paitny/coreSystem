<template>
	<scroll-view scroll-y="true" class="scroll-content">
		<view class="all-list">
			<view class="all-list">
				<view class="all-list-content">
					<view class="all_title">
						<view style="min-height: 150rpx;padding: 10rpx;line-height: 150rpx;">

							<text class="title">{{list.title}}</text>
						</view>
						<view class="aritcle">
							<view>

								<text class="date">{{date(list.date)}}</text>
							</view>
							<view>

								<text class="read">阅读&nbsp;{{list.pv}}</text>
							</view>
							<uni-fav :checked="userInfo._id && list.collects.includes(userInfo._id)" class="favBtn"
								:circle="true" bg-color="#dd524d" bg-color-checked="#007aff" fg-color="#ffffff"
								fg-color-checked="#ffffff" @click="handTrendCollect(list._id)" />


						</view>

					</view>

					<view class="intro" v-html="list.des">

					</view>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import moment from 'moment'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				list: [],
				pathID: '',
				uid: "",

			}
		},
		onLoad(options) {

			// 假设 proxy 是你的 Proxy 对象
			this.pathID = options.id;

			this.recordText()
			this.getNew()

		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			getNew() {
				uni.$http.get('/api/get/newsId', {
					id: this.pathID
				}).then((res) => {
					this.list = res.data.data.doc
				})
			},
			inspectLogin(url, collectId) {

				uni.$http.post('/api/login/min/check', {
						id: this.userInfo._id
					})
					.then((res) => {
						if (res.data.code === 0) {
							uni.showToast({
								title: "未登录",
								icon: 'error',
								duration: 800
							})

						} else if (res.data.code === 2) {

							uni.showToast({
								title: "token已过期",
								icon: 'error',
								duration: 800
							})
						} else if (res.data.code === 1) {
							uni.$http.post(url, {
								id: collectId,
								userId: this.userInfo._id
							}).then((res) => {
								this.getNew()
								uni.showToast({
									title: res.data.msg,
									icon: 'none',
									duration: 1500
								});



							})
						}

					})

			},
			handTrendCollect(id) {
				this.inspectLogin("/api/news/collect", id)

			},

			recordText() {
				uni.$http.post('/api/get/foot', {
					newsId: this.pathID,
					userId: this.userInfo._id
				})
			},
			// 时间格式
			date(time) {
				return moment(time).format('YYYY-MM-DD')
			}
		},
		onShareAppMessage() { // 分享到微信
			// 更多参数配置，参考文档
			return {
				title: this.list.title,
				path: '/pagesHome/news/news?id=' + this.pathID
			}
		},

		onShareTimeline() { // 分享到朋友圈
			return {
				title: this.list.title,
				path: '/pagesHome/news/news?id=' + this.pathID
			}
		},
	}
</script>

<style lang="scss">
	.scroll-content {
		width: 100%;

		.all-list {
			.all-list-content {
				width: 80%;
				margin: 0 auto;
				font-family: '黑体';
				color: #8a8a8a;


				.all_title {
					width: 100%;
					min-height: 150rpx;


					.aritcle {
						display: flex;
						justify-content: flex-start;
						align-items: center;

						.collect {
							display: flex;
							align-items: center;

						}
					}
				}

				.title {
					color: #000;
					font-size: 50rpx;
					font-weight: bold;
				}

				.read,
				.date {
					font-size: 30rpx;
					margin-right: 20rpx;
					line-height: 60rpx;
				}

				.intro {
					color: #000;
					font-size: 30rpx;
					line-height: 60rpx;
				}
			}
		}
	}
</style>