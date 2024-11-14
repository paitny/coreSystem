<!-- ChildPopup.vue -->
<template>
	<view v-show="isPopupVisible" class="popup" @click="hidePopup">
		<!-- 弹窗内容 -->
		<view class="popup-box" @click.stop>
			<view class="popup-content">
				<!-- 左侧个人信息 -->
				<view class=" " style="text-align: center; font-size: 35rpx;">亲爱的同学，您已提交成功!</view> <br>
				<view class="" style="text-align: center;">提交反馈后，管理员将在24小时之内，对您反馈的问题处理完毕！请耐心等候噢！</view>
				<view class="left-info">
					感谢您对芯系小助手的信任！
				</view>

				<!-- 右侧个人简介 -->
			
				<!-- 点击弹窗以外的区域关闭弹窗 -->
				<view class="mask" @click="hidePopup">×</view>
			</view>

		</view>


	</view>
</template>

<script>
	export default {
		props: {
			 contributor: {
			      type: Object,
			      required: true,
			    },
			isPopupVisible: Boolean,
			
		},
		
		data() {
			return {
				baseURL:''
			};
		},
		 mounted() {
		 	console.log(uni.baseURL);
			this.baseURL=uni.baseURL
		 },
		methods: {
			copyText(text) {
			      uni.setClipboardData({
			        data: text,
			        success() {
			          uni.showToast({
			            title: '群号已复制',
			            icon: 'success'
			          });
			        }
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
			hidePopup() {
				this.$emit('hidePopup');
				
			}
		},
		
	};
</script>

<style lang="scss" scoped>
	.popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.popup-box {
		width: 100%;
		min-height: 600rpx;

	}

	.popup-content {
		position: relative;
		
		justify-content: space-between;
		align-items: center;
		padding: 40rpx;
		background: #fff;
		border-radius: 20rpx;
		width: 70%;
		margin: 0 auto;

		.mask {
			width: 50rpx;
			height: 50rpx;
			background-color: #4d6398;
			position: absolute;
			font-size: 50rpx;
			right: -15rpx;
			top: -15rpx;
			border-radius: 50%;
			text-align: center;
			line-height: 50rpx;
			color: #fff;

		}
	}

	.left-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		height: 100%;
		flex: 1;
	}

	.info {
		padding-top: 30rpx;
	}

	.right-intro {
		flex: 1;
		margin-left: 40rpx;
		height: 100%;
	}
	image{
		width: 250rpx;
		margin-top: 15rpx;
	}
</style>