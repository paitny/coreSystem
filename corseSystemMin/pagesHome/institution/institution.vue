<template>
	<view class="">
		<view class="img">
			<view class="frame">
				<view class="informate">
					<view style="padding-top: 40rpx;padding-left: 35rpx;font-size: 30rpx;color: dimgray;">人工智能与大数据学院</view>
					<view style="padding-top: 30rpx;padding-left: 30rpx;">{{departmentInfo.name}}</view>
					<view class="logo">
						<image :src="`${baseURL}${departmentInfo.cover}`" style="width: 120rpx;height: 120rpx;"></image>
					</view>
				</view>
				<view class="card">
					<view style="padding-top: 23rpx;padding-left: 35rpx;font-size: 27rpx;color: dimgray;">我的名片</view>
					<view class="cardimg" @click="clickImg(departmentInfo.poster)" :style="{
            backgroundImage: `url(${baseURL}${departmentInfo.poster})`
          }"></view>
				</view>
			</view>
		</view>
		<view class="contact">
			<text style="font-size: 32rpx;margin-left: 51rpx;color: dimgray;">联系我</text>
			<swiper class="manner">
				<swiper-item>
					<view class='scroll-item'>
						<view class="all-list">
							<view class="text">负责人：{{departmentInfo.leader}}</view>
							<view class="text">联系方式：{{departmentInfo.phone}}</view>
							<view class="text">邮箱：{{departmentInfo.email}}</view>
							<view class="text">QQ：{{departmentInfo.qq}}</view>
							<view class="text">微博：{{departmentInfo.weibo}}</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="about">
			<view style="padding:30rpx 51rpx;font-size: 32rpx;color: dimgray;">关于我们</view>
			<view class="content">
				{{departmentInfo.description}}
			</view>
		</view>
		<view class="bottom">


			<view class="bottom-button">
				<view class="left">
					<view class="share" @click="shareClick">

						<view class="shareimg"><button data-name="shareBtn" open-type="share"
								style="height: 60rpx;background-color: #fff;">
								<image src="../../static/orderImgs/share.png" mode=""></image>
							</button></view>

						分享
					</view>
					<view class="gohome" @click="MeClick">
						<view class="meimg">
							<image src="../../static/tab_icons/homeActive.png" mode=""></image>
						</view>
						主页
					</view>

				</view>

				<view class="right">
					<button class="like" @click="gopage">去报名</button>
				</view>

			</view>
		</view>

	</view>
</template>

<script>
	export default {

		data() {
			return {
				baseURL: "",
				pathID: "",
				departmentInfo: [],
				institution: ''
			};
		},

		onLoad(options) {
			this.baseURL = uni.baseURL
			this.institution = options.institution
			this.pathID = options.id
			this.getdepartmentInfo()

		},


		methods: {
			gopage() {
				uni.navigateTo({
					url: "/pagesHome/activity/institution?institution="+this.institution + '&department=' + this.departmentInfo.name
				})
			},
			getdepartmentInfo() {
				uni.$http.get("/api/get/departmentInfo", {
					id: this.pathID
				}).then(res => {

					this.departmentInfo = res.data.data

				})
			},
			clickImg(photoImg) {
				let imgsArray = [];
				imgsArray[0] = this.baseURL + photoImg;
				uni.previewImage({
					current: 0,
					urls: imgsArray
				});


			},
			MeClick() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
		},


		onShareAppMessage() { // 分享到微信
			// 更多参数配置，参考文档
			return {
				title: this.departmentInfo.name,
				path: '/pagesHome/institution/institution?id=' + this.pathID + '&institution=' + this.institution
			}
		},

		onShareTimeline() { // 分享到朋友圈
			return {
				title: this.departmentInfo.name,
				path: '/pagesHome/institution/institution?id=' + this.pathID + '&institution=' + this.institution
			}
		}

	}
</script>

<style lang="scss">
	.img {
		width: 100%;
		height: 390rpx;
		background-size: 100% 100%;
		position: absolute;

		.frame {
			height: 310rpx;
			width: 93%;
			background-color: white;
			border-radius: 10rpx;
			margin: auto;
			margin-top: 40rpx;
			box-shadow: 0px 3px 7px 0px #e5e5e5;

			.informate {
				height: 71%;
				width: 100%;
				border-bottom: 1rpx dashed darkgrey;

				.logo {
					height: 110rpx;
					width: 110rpx;

					background-size: 100% 100%;
					margin-top: -120rpx;
					margin-left: 530rpx;
					border-radius: 15rpx;
				}
			}

			.card {
				height: 29%;
				width: 100%;

				.cardimg {
					height: 50rpx;
					width: 50rpx;
					margin-left: 580rpx;
					margin-top: -39rpx;

					background-size: 100% 100%;
				}
			}
		}
	}

	.contact {
		height: 420rpx;
		width: 100%;
		background-color: white;
		padding-top: 390rpx;

		.manner {
			height: 350rpx;
			width: 87%;
			margin: 20rpx auto;

			.all-list {
				width: 100%;
				height: 115rpx;
				margin: 0 auto;


				.text {
					color: #000;
					font-size: 30rpx;
				}
			}
		}
	}

	.about {
		height: 500rpx;
		width: 100%;
		margin-top: 20rpx;
		background-color: white;

		.content {
			height: 395rpx;
			width: 87%;
			margin: 0 auto;
			font-size: 31rpx;
		}
	}

	.bottom-button {
		display: flex;
		justify-content: space-around;
		padding-top: 10rpx;
		position: fixed;
		width: 100%;
		bottom: 0;
		background-color: #fff;

		.left {
			display: flex;
			width: 40%;
			justify-content: center;

			.share {
				width: 120rpx;
				height: 100rpx;
				font-size: 20rpx;
				text-align: center;

				button::after {
					border: none;
					width: 57rpx;
					height: 57rpx;
				}

				image {
					width: 57rpx;
					height: 57rpx;
				}
			}

			.gohome {
				font-size: 20rpx;
				width: 120rpx;
				height: 100rpx;
				text-align: center;

				image {
					width: 57rpx;
					height: 57rpx;
				}
			}
		}

		.right {
			width: 60%;

			.like {
				background-color: #4d6398;
				border-radius: 45rpx;
			}

		}
	}
</style>