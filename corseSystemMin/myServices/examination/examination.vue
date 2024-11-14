<template>
	<view class="testBox" v-for="item in testData" :key="item._id">
		<view class="testbox-top">
			<view class="title">{{item.title}}</view>
			<view class="time">开始时间：{{parseDateStringAndFormat(item.startTime)}}</view>
			<view class="time">截止时间：{{parseDateStringAndFormat(item.endTime)}}</view>
		</view>
		<view class="startButton" @click="goTestPage(item._id,item.termTopic)">开始答题</view>
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				testData: []
			};
		},
		mounted() {
			this.getTest()
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			parseDateStringAndFormat(dateString) {
				const date = new Date(dateString);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，并保证两位数字
				const day = String(date.getDate()).padStart(2, '0'); // 保证两位数字
				const hours = String(date.getHours()).padStart(2, '0'); // 保证两位数字
				const minutes = String(date.getMinutes()).padStart(2, '0'); // 保证两位数字
				const seconds = String(date.getSeconds()).padStart(2, '0'); // 保证两位数字

				return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
			},
			getTest() {
				uni.$http.get('/api/examinationOrg/exams').then(res => {
					this.testData = res.data
				})
			},
			goTestPage(id, termTopic) {
				uni.$http.post("/api/examinationOrg/checkSaveUserExam", {
					examId: id,
					userId: this.userInfo._id
				}).then((res) => {
					if (res.statusCode === 403) {
						return uni.showToast({
							icon: "none",
							title: res.data.msg
						})
					} else if (res.statusCode === 400) {
						return uni.showToast({
							icon: "none",
							title: res.data.msg
						})
					} else if (res.statusCode === 200) {
						uni.navigateTo({
							url: "../../subpkg-common/testPaper/testPaper?id=" + id + "&termTopic=" + termTopic
						})
						uni.showToast({
							icon: "none",
							title: res.data.msg
						})
					}

				})
			}
		}
	};
</script>

<style scoped lang="scss">
	page {
		height: 100vh;
		background-color: #ffffff;
		width: 100%;

		.testBox {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			width: 90%;
			height: 300rpx;
			margin: 20rpx auto;
			padding: 40rpx;
			background-color: #f8f8f8;
			border-radius: 15rpx;
			box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, 0.1);

			.testbox-top {
				.title {
					color: #939393;
					font-size: 50rpx;
				}

				.time {
					color: #2f2f2f;
					font-size: 25rpx;
					margin-top: 20rpx;
				}

			}

			.startButton {
				width: 190rpx;
				height: 90rpx;
				background-color: #2877fa;
				border-radius: 20rpx;
				color: #fff;
				font-size: 30rpx;
				text-align: center;
				line-height: 90rpx;
				margin-left: 70%;

			}
		}

	}
</style>