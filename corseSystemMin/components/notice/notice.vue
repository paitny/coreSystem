<template>
	<view class='notice-wrap' v-if="hideNotice">
		<image src="../../static/orderImgs/notice.png" mode=""></image>


		<view class='tongzhitext'>
			<text class="tongzhi-text">{{notice}}</text>
		</view>
		<view @click="switchNotice" class="closeView">x</view>
	</view>
</template>

<script>
	export default {
		name: "notice",
		data() {
			return {
				notice: '',
				hideNotice: true
			}
		},
		methods: {
			switchNotice() {
				this.hideNotice = false;
			},
			async getNewsList() {
				const {
					data
				} = await uni.$http.get('/api/get/latestNotice')
				this.notice = data.noticeComment
			}
		},
		mounted() {
			this.getNewsList()

		}
	}
</script>

<style lang="scss">
	@keyframes remindMessage {
		from {
			transform: translateX(20%);
		}

		to {
			transform: translateX(-100%);
		}
	}


	.notice-wrap {
		display: flex;
		align-items: center;
		justify-content: space-around;
		background: #fff;
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		color: #4d6398;
		font-size: 28rpx;
		position: relative;

		image {
			width: 50rpx;
			height: 40rpx;
			padding-left: 15rpx;
		}


		.tongzhitext {
			margin-right: 80rpx;
			width: 100%;
			margin-left: 10rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;


			.tongzhi-text {
				font-size: 28rpx;
				animation: remindMessage 30s linear 1s infinite;
				color: #4d6398;
				display: inline-block;
			}
		}

		.closeView {
			width: 45rpx;
			height: 45rpx;
			line-height: 45rpx;
			position: absolute;
			right: 20rpx;
			top: 5rpx;
			text-align: center;
			font-size: 35rpx;
		}
	}
</style>