<template>
	<view>
		<swiper circular="false" autoplay="true" interval="3000" :style="{height:screenHeight+'px'}">
			<swiper-item v-for="(item,index) in list" :key="index">
				<view class="intro">
					<view class="img">
						<view class="sign">

							<text class="position">{{item.position}}</text>
						</view>

						<image :src="`${baseURL}${item.img}`" class="head_img"></image>
					</view>
					<view class="basic">
						<text class="name">{{item.name}}</text>
						<br>
						<text class="ename">{{item.office}}</text>
						<br>
						<!-- <text class="position">辅导员</text> -->
					</view>
					<view class="bottom">
						<text class="personal_intro">{{item.introduction}}</text>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>
<script>
	export default {

		data() {
			return {
				baseURL: '',
				// list:[],
				list: ["aa", "bb", "cc", "dd"],
				screenHeight: 0,
			}
		},
		onLoad() {

			this.baseURL = uni.baseURL
			uni.$http.get('/api/route/teacher').then((res) => {
			
					this.list = res.data
				}),
				// 系统信息的概念
				uni.getSystemInfo({
					success: res => {
						this.screenHeight = res.windowHeight;
					}
				}),
				uni.getSystemInfo({
					success: function(res) {
						var windowHeight = res.windowHeight;
					}
				});

			setTimeout(() => {
				this.loading = false
			}, 1000)


		},
		methods: {}
	}
</script>
<style lang="scss">
	swiper {
		width: 100%;
	}

	swiper-item {

		// width: 92%;
		// height: 90%;
		// text-align: center;
		.intro {
			width: 90%;
			height: 90%;
			margin: 0 auto;
			background-color: #fff;
			border-radius: 25rpx;
			text-align: center;

			.img {
				width: 100%;
				height: 40%;
				// margin: 0 auto;

				.sign {
					position: relative;
					top: 80rpx;
					left: -10rpx;
					width: 260rpx;
					height: 0;
					background-color: #39b5fd;
					border: 40rpx solid #39b5fd;
					border-right-color: #fff;

					// transform: rotate(90deg);
					.position {
						position: relative;
						left: -50rpx;
						top: -26rpx;
						font-size: 40rpx;
						color: #fff;
					}
				}

				.head_img {
					width: 300rpx;
					height: 300rpx;
					margin: 150rpx 0 30rpx 0;
					box-shadow: 0 0 10px 5px #40aff7;
					border-radius: 50%;
				}
			}

			.basic {
				margin-top: 50rpx;
				height: 24%;

				.name,
				.ename {
					line-height: 100rpx;
					font-size: 80rpx;
					font-weight: bold;
					color: #39b5fd;
				}

				.ename {
					font-size: 40rpx;
					margin: 150rpx 0;
				}

			}

			.bottom {
				padding-top: 50rpx;
				height: 36%;
				background-color: #39b5fd;
				color: #fff;
				font-size: 40rpx;
				border-radius: 0 0 25rpx 25rpx;
			}
		}
	}
</style>