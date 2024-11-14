<template>
	<view class="container">
		<view class="bg_top">
			<image src="https://wypty.cn/static/file/material/logo.png"></image>
			<view class="text">
				<view class="name">AI&BD服务中心<p class="p">Artificial Intelligence and Big Data College Service Center</p></view>
				<view class="intro">新用户点击用户注册进入<p class="p">New users click Register to enter</p></view>
			</view>
		</view>
		<view class="btn">
			<button class="login" @click="login">立即登录</button>
			<button class="register" @click="register">用户注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:1
			}
		},
		onShareAppMessage() { // 分享到微信
					// 更多参数配置，参考文档
					return {
						title: '首页',
						path: '/pages/me/me'
					}
				},
		
				onShareTimeline() { // 分享到朋友圈
					return {
						title: '首页',
						path: '/pages/me/me'
					}
				},
				onLoad(){
			
				},
		methods: {
			login() {
				this.type=2
				uni.navigateTo({
					url: "/pagesMe/login/login?type="+this.type
				})
			},
			register() {
				this.type=1
				uni.navigateTo({
					url:"/pagesMe/login/login?type="+this.type
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		margin: 0px;
		position: fixed;
		width: 100%;
		height: 100%;
		background: url(https://wypty.cn/static//file/material/bgImg.png) no-repeat;
		background-size: 100% 100%;
		// 上半部分
		.bg_top {
			height: 70%;
			width: 100%;
			
			// loge图片
			image {
				width: 320rpx;
				height: 320rpx;
				margin: 25px 29% 0px;
			}
			//loge下的文本信息
			.text {
				margin: 2% 17%;
				text-align: center;
				// 信工服务中心
				.name {
					font-family: '幼圆';
					font-size: 30px;
					font-weight: bold;
					.p {
						font-family: '幼圆';
						font-size: 9px;
						font-weight: 400;
					}
				}
				// 新用户点击用户注册进入
				.intro {
					margin: 10px;
					font-size: 12px;
					color: #a7a5aa;
					.p {
						font-family: '幼圆';
						font-size: 9px;
						font-weight: 100;
					}
				}
			}
		}
		// 下半部分
		.btn {
			button {
				width: 70%;
				height: 90rpx;
				color: #b8b2cc;
				font-size: 16px;
				border-radius: 80rpx;
				background-color: #5c55f7;
				border: 2px solid #b8b2cc;
			}
			.login{
				line-height: 90rpx;
			}
			.register {
				width: 70%;
				height: 90rpx;
				font-size: 16px;
				background-color: #fff;
				border: 2px solid #b8b2cc;
				margin-top: 40rpx;
				line-height: 90rpx;
			}
			// 协议
			.agreement{
				margin: 20px 20% 0px 20%;
				height: 30px;
				.agreement_text{
					float: right;
					width: 85%;
					font-family: "幼圆";
					font-size: 14px;
					.pp{
						display: inline;
					}
					.aa{
						color: #3580BB;
						display: inline;
					}
				}
			}
		}
	}
</style>