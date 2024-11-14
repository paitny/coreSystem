<template>
	<view class="skeleton-container">
		<view class="skeleton-search">
			<view class="skeleton-search-content">
				<!-- 骨架屏搜索框图标 -->
				<view class="skeleton-search-icon"></view>
				<!-- 骨架屏搜索框文本 -->
				<text class="skeleton-search-text"></text>
			</view>
		</view>
		<view class="skeleton-swiper">
		</view>
	</view>
	<view class="skeleton-nav">

		<view class="skeleton-navItem" v-for="(item,index) in 8" :key="index">
			<view class="skeleton-navItem-icon"></view>
			<view class="skeleton-navItem-text"></view>
		</view>
	</view>
	<view class="skeleton-bigNav">
		<view class="skeleton-bigNav-left">


		</view>
		<view class="skeleton-bigNav-right">
			<view class="skeleton-bigNav-right-top"></view>
			<view class="skeleton-bigNav-right-bottom"></view>
		</view>
	</view>

	<view class="skeleton-news">
		<view class="skeleton-news-text"></view>
		<view class=" skeleton-news-all"></view>

	</view>

	<view class="skeleton-news-list">
		<view class="skeleton-news-item" v-for="(item,index) in 3" :key="index">
			<!-- 封面图片 -->

			<view class="skeleton-news-details">
				<!-- 新闻标题 -->
				<view class="skeleton-title"></view>
				<!-- 新闻摘要 -->
				<view class="skeleton-description"></view>
				<!-- 浏览量、作者和发布时间 -->
				<view class="skeleton-meta">
					<view class="skeleton-views"></view>

					<view class="skeleton-publish-time"></view>
				</view>
			</view>
			<view class="skeleton-cover"></view>

		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			
		},
		onShareAppMessage() { // 分享到微信
			// 更多参数配置，参考文档
			return {
				title: '信工服务中心',
				path: '/pages/home/index'
			}
		},
		
		onShareTimeline() { // 分享到朋友圈
			return {
				title: '信工服务中心',
				path: '/pages/home/index'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.skeleton-container {
		background-color: #fff;
		height: 435rpx;
		position: relative;

		/* 搜索骨架屏 */
		.skeleton-search {
			position: fixed;
			top: 20rpx;
			left: 0;
			right: 0;
			bottom: -1rpx;
			z-index: 1;
			width: 100%;
			height: 100rpx;
		}

		.skeleton-search-content {
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
			animation: loading 1.5s infinite;
		}

		.skeleton-search-icon {
			width: 30rpx;
			/* 图标宽度 */
			height: 30rpx;
			/* 图标高度 */
			background-color: #ccc;
			/* 图标占位背景色 */
			border-radius: 50%;
			/* 图标圆角 */
			margin-right: 10rpx;
			/* 图标右侧间距 */
		}

		.skeleton-search-text {
			height: 26rpx;
			width: 270rpx;
			/* 文本占位高度 */
			background-color: #ccc;
			/* 文本占位背景色 */
		}

		.skeleton-news-list {
			padding: 10px;
			background-color: #fff;
		}

		.skeleton-swiper {
			width: 90%;
			height: 70%;
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			background-color: #ccc;
			border-radius: 18rpx;
			animation: loading 1.5s infinite;
		}
	}

	.skeleton-nav {
		width: 100%;
		height: 300rpx;
		background-color: #fff;
		margin-top: 20rpx;
		display: flex;
		flex-wrap: wrap;
		padding-top: 20rpx;

		.skeleton-navItem {
			height: 110rpx;
			width: 25%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.skeleton-navItem-icon {
				height: 80rpx;
				width: 80rpx;
				background-color: #ccc;
				margin: 0 auto;
				border-radius: 10rpx;
				animation: loading 1.5s infinite;
			}

			.skeleton-navItem-text {
				height: 20rpx;
				width: 80rpx;
				background-color: #ccc;
				margin: 0 auto;
				animation: loading 1.5s infinite;
			}
		}
	}

	.skeleton-bigNav {
		width: 100%;
		height: 350rpx;
		background-color: #fff;
		margin-top: 20rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;

		.skeleton-bigNav-left {
			width: 40%;
			height: 90%;
			border-radius: 20rpx;
			background-color: #ccc;
			animation: loading 1.5s infinite;

		}

		.skeleton-bigNav-right {
			width: 40%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-around;

			.skeleton-bigNav-right-top {
				width: 100%;
				height: 40%;
				background-color: #ccc;
				border-radius: 20rpx;
				animation: loading 1.5s infinite;
			}

			.skeleton-bigNav-right-bottom {
				width: 100%;
				height: 40%;
				background-color: #ccc;
				border-radius: 20rpx;
				animation: loading 1.5s infinite;
			}
		}
	}

	.skeleton-news {
		width: 100%;
		height: 70rpx;
		background-color: #fff;
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.skeleton-news-text {
			width: 100rpx;
			height: 40rpx;
			background-color: #ccc;
			margin-left: 10rpx;
			animation: loading 1.5s infinite;
		}

		.skeleton-news-all {
			width: 50rpx;
			height: 30rpx;
			background-color: #ccc;
			margin-right: 10rpx;
			animation: loading 1.5s infinite;
		}
	}

	// 新闻列表骨架屏
	.skeleton-news-list {
		padding: 10px;
		background-color: #fff;
	}

	.skeleton-news-item {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		position: relative;
		background-color: #f0f0f0;
		animation: loading 1.5s infinite;


	}

	.skeleton-cover {
		width: 100px;
		height: 70px;
		background-color: #ccc;
		margin-right: 10px;
		border-radius: 5rpx;
		animation: loading 1.5s infinite;
		margin-left: 20rpx;
	}

	.skeleton-news-details {
		flex: 1;
	}

	.skeleton-title {
		height: 40px;
		background-color: #ccc;
		margin-bottom: 20px;
		animation: loading 1.5s infinite;
	}

	.skeleton-description {
		height: 20px;
		background-color: #ccc;
		margin-bottom: 10px;
		animation: loading 1.5s infinite;
	}

	.skeleton-meta {
		display: flex;
		justify-content: space-between;
	}

	.skeleton-views,
	.skeleton-author,
	.skeleton-publish-time {
		width: 30%;
		height: 16px;
		background-color: #ccc;
		animation: loading 1.5s infinite;
	}

	/* 添加动画效果 */
	@keyframes loading {
		0% {
			opacity: 0.5;
		}

		50% {
			opacity: 0.9;
		}

		100% {
			opacity: 0.5;
		}
	}
</style>