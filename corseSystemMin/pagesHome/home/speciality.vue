<template>
	<view class="container">
		<view class="title">
			人工智能与大数据学院专业

		</view>
		<view class="text1">左右滑动查看专业介绍</view>
		<view class="swiper">
			<swiper :indicator-dots="false" :autoplay="false" :interval="3000" :duration="1000" circular="true">
				<swiper-item v-for="item in specialitiesData" :key="item.id">
					<view class="swiper-item">
						<view class="title_1">
							<text>{{item.name}}</text><br />
							<text class="time">{{item.time}}</text><br />
						</view>
						<text>{{item.introduction}}</text>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				specialitiesData: []
			}
		},
		mounted() {
			this.getSpecialities()
		},
		methods: {

			getSpecialities() {
				uni.$http.get("/api/route/specialities").then((res) => {

					this.specialitiesData = res.data
				})
			}

		},
		onShareAppMessage() { // 分享到微信
			// 更多参数配置，参考文档
			return {
				title: '人工智能与大数据学院简介',
				path: '/pagesHome/home/speciality'
			}
		},

		onShareTimeline() { // 分享到朋友圈
			return {
				title: '人工智能与大数据专业简介',
				path: '/pagesHome/home/speciality'
			}
		},
	}
</script>

<style lang="scss">
	page {
		background-image: url("https://wypty.cn/static/file/material/specialityBg.jpg");
		background-repeat: no-repeat;
		background-size: 100% 100%;
		height: 100vh;
	}

	.container {
		.title {
			height: 50px;
			margin: 5px 10% 0 10%;
			text-align: center;
			font-size: 40rpx;
			font-family: '幼圆';
			font-weight: bold;
			line-height: 50px;
			

		}

		.text1 {
			text-align: center;
			font-size: 10px;
			font-family: '幼圆';
			font-weight: 400;
			color: #fff;
		}

		.swiper {
			width: 100%;
			height: 100%;

			swiper {
				width: 100%;
				height: 95vh;
				border-top: 1rpx solid grey;
                margin-top: 20rpx;
				.swiper-item {
					margin: 10px;
					padding: 10px;
					height: 90%;
					background-color: rgba(0, 202, 252, 0.5);
					border-radius: 30px;
					text-align: justify;
					font-family: '幼圆';
					font-size: 15px;
					line-height: 25px;
					color: #fff;

					.title_1 {
						padding: 15px;
						text-align: center;
						font-weight: bold;
						font-size: 18px;
						color: #fff;

						.time {
							color: #fff;
							font-weight: 400;
							font-size: 12px;
						}
					}
				}
			}
		}
	}
</style>