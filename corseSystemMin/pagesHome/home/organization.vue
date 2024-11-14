<template>
	<view class="container">
		<view class="title">
			<view class="orgImg">人工智能与大数据学院组织机构图</view>
			<view class="time">2022年07月21日</view>
		</view>
		<image @click="previewImage" src="https://wypty.cn/static/file/material/Organization.png"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			 previewImage() {
			      uni.previewImage({
			        urls: ["https://wypty.cn/static/file/material/Organization.png"], // 图片的URL数组
			        current: 0 // 当前显示图片的索引
			      });
			    }
		},
		onShareAppMessage() { // 分享到微信
			// 更多参数配置，参考文档
			return {
				title: '人工智能与大数据学院组织机构图',
				path: '/pagesHome/home/organization'
			}
		},

		onShareTimeline() { // 分享到朋友圈
			return {
				title: '人工智能与大数据学院组织机构图',
				path: '/pagesHome/home/organization'
			}
		},
	}
</script>

<style lang="scss">
	.container {
		padding: 10px;
		width: 100%;
		height: 100%;
		position: fixed;
		background-color: white;
		background-image: url("https://wypty.cn/static/file/material/specialityBg.jpg");
		background-repeat: no-repeat;
		background-size: 100% 100%;
		.title{
		
			
			flex-wrap: wrap;
			text-align: center;
			
			
			.orgImg{
				margin-top: 20rpx;
				text-align: center;
			}
			.time{
				margin-top: 20rpx;
				text-align: center;
			}
			text {
				width: 100%;
				line-height: 50px;
				font-size: 28px;
				font-weight: bold;
			}
			
		}
		
		image{
			width: 95%;
			height: 40%;
			margin: 20rpx auto;
			
			
		}
	}
</style>
