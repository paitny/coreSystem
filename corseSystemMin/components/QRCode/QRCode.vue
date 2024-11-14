<template>
	<view>

		<view v-if="showDialog" class="dialog" @click.stop="closeDialog">

			<view class="dialog-content" @click.stop>
				<view class="close-button" @click="closeDialog">×</view>
				<view class="loadingMac" v-if="isLoading">

					<view class="loader"></view>
				</view>
				<view class="" v-if="bufferImg && !isLoading" style="width: 300px;margin: 0 auto;">
					{{activityTitle}}活动报名专用二维码
				</view>
				<image v-if="bufferImg && !isLoading" :src="bufferImg" style="width: 300px; height: 300px"
					@click="previewQ"></image>
				<view v-if="errorMessage" class="error-message">
					<view class="errorMsg">{{ errorMessage }}</view>
					<button @click="generateQRCode">重新生成二维码</button>
				</view>

				<view class="dialog-footer">
					<button @click.stop="generateQRCode" >刷新二维码</button>
					<button @click.stop="previewQ" v-if="!isLoading">保存二维码</button>
				</view>
			</view>
		</view>

		<!-- 悬浮窗 -->

	</view>
</template>

<script>
	export default {
		props: {
			activityId: {
				type: String,
				required: true,
			},
			activityTitle: {
				type: String,
				required: true,
			},
			userId: {
				type: String,
				required: true,
			},
			showDialog: {
				type: Boolean,
				required: true,
			},
			closeDialog: {
				type: Function,
				required: true,
			},
		},
		data() {
			return {
				bufferImg: '',
				errorMessage: '',
				loading: false,
				isLoading: false,
			};
		},
		mounted() {

		},
		methods: {
			async generateQRCode(id) {
				this.isLoading = true; // 开始加载
				this.loading = true;
				this.errorMessage = '';

				try {
					const response = await uni.$http.post('/api/itVolunteer/generateQRCode', {
						activityId: this.activityId||id,
						userId: this.userId
					});

					if (response.data.code === 0) {
						this.bufferImg = response.data.data; // 获取二维码图片
					} else {
						this.errorMessage = response.data.msg;
					}
				} catch (error) {
					this.errorMessage = '生成二维码失败';
				} finally {
					this.loading = false;
					this.isLoading = false; // 结束加载
				}
			},

			previewQRCode(id) {
				this.bufferImg = ''; // 清空二维码
				this.generateQRCode(id);
				this.closeDialog()
			},

			previewQ() {
				uni.previewImage({
					urls: [this.bufferImg],
					current: this.bufferImg
				});
			},

			

			downloadQRCode() {
				uni.saveImageToPhotosAlbum({
					filePath: this.bufferImg, // 图片路径
					success: () => {
						uni.showToast({
							title: '下载成功',
							icon: 'success',
						});
					},
					fail: () => {
						uni.showToast({
							title: '下载失败',
							icon: 'none',
						});
					}
				});
			},

			shareQRCode() {
				uni.share({
					title: '分享二维码',
					imageUrl: this.bufferImg,
					success: () => {
						uni.showToast({
							title: '分享成功',
							icon: 'success',
						});
					},
					fail: () => {
						uni.showToast({
							title: '分享失败',
							icon: 'none',
						});
					}
				});
			},
		}
	};
</script>

<style scoped>
	/* 样式保持不变 */
	.dialog {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.dialog-content {
		position: relative;
		background: white;
		padding: 20px;
		border-radius: 8px;
		text-align: center;
		z-index: 999999;
		min-width: 600rpx;
		min-height: 680rpx;
	}

	.dialog-footer button {
		background-color: #007AFF;
		/* 按钮背景颜色 */
		color: white;
		/* 按钮文本颜色 */
		border: none;
		/* 去掉边框 */
		border-radius: 25px;
		/* 圆角 */
		padding: 10px 20px;
		/* 内边距 */
		margin: 5px;
		/* 外边距 */
		cursor: pointer;
		/* 鼠标指针样式 */
		transition: background-color 0.3s, transform 0.2s;
		/* 动画效果 */
	}

	.dialog-footer button:hover {
		background-color: #0056b3;
		/* 鼠标悬停时的背景颜色 */
		transform: scale(1.05);
		/* 鼠标悬停时放大效果 */
	}

	.dialog-footer button:active {
		transform: scale(0.95);
		/* 点击时缩小效果 */
	}

	.loadingMac {
		width: 300px;
		height: 300px;
		margin: 0 auto;
	}

	.loader {
		border: 8px solid #f3f3f3;
		border-top: 8px solid #3498db;
		border-radius: 50%;
		width: 250px;
		height: 250px;
		animation: spin 1s linear infinite;
		margin: 0 auto;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.dialog-footer {
		display: flex;
		justify-content: space-around;
		margin-top: 10px;
	}

	.close-button {
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

	.close-button:hover {
		color: #ff0000;
		/* 悬停时的颜色 */
	}

	.floating-button {
		position: fixed;
		bottom: 20px;
		right: 20px;
		background: #007AFF;
		color: white;
		padding: 15px 15px;
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		text-align: center;
		z-index: 999999;
	}

	.error-message {
		color: red;
		margin-top: 10px;
	}

	.errorMsg {
		height: 250px;
		margin: 0 auto;
		text-align: center;
		line-height: 250px;
	}
</style>