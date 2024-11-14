<template>
	<view class="course-list">


		<view class="course-item__content" v-for="(item,index) in 70" :key="index">


		</view>



	</view>
</template>

<style lang="scss" scoped>
	.course-list {
		width: 100%;
		height: 100%;
		display: flex;
		height: 100vh;
		flex-wrap: wrap;

	}

	.course-item__content {
		width: calc((100% - 150rpx) / 7);
		height: 150rpx;
		margin-top: 35rpx;
		font-size: 20rpx;
		border-radius: 10rpx;
		color: black;
		text-align: center;
		margin-left: 20rpx;
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