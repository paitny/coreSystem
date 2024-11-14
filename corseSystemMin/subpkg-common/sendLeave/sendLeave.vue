<template>
	<view class="container">
		<view class="leave_type">
			*<text>留言类型:</text>
			<input type="text" v-model="leaveType">
		</view>
		<view class="leave_content">
			*<text>留言内容:</text>
			<textarea v-model="leaveContent" cols="30" rows="10" maxlength="50"></textarea>

		</view>
		<view class="uploadImage">
			<button @tap="choosePhoto" class="choosePhoto">添加图片</button>
			<view v-if="photoUrls.length > 0" class="image-container">
				<view v-for="(url, index) in photoUrls" :key="index" class="image-preview">

					<image :src="url"></image>
					<view class="deleteImage" @click="removePhoto(index)">×</view>


				</view>
			</view>
		</view>

		<view class="">
			<button @tap="submitInfo" class="submit_leave">确认发布</button>
		</view>
	</view>


</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				leaveType: "", // 留言类型
				leaveContent: "", // 留言内容
				photoUrls: [], // 图片的URL
				uploadedImages: [],
				photoUploadSecond: [] //第二次上传
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			choosePhoto() {
				if (this.photoUrls.length >= 3) {
					// 如果已经上传了三张照片，不再允许上传更多
					return uni.showToast({
						icon: "none",
						title: "只能添加三张图片哦"
					})
				}

				uni.chooseImage({
					count: 3 - this.photoUrls.length, // 最多可选取的剩余照片数量
					sourceType: ["camera", "album"], // 同时支持相机和相册
					success: (res) => {
						if (this.uploadedImages.length > 0) {
							this.photoUrls.push(...res.tempFilePaths);
							this.photoUploadSecond.push(...res.tempFilePaths)

							this.upLoadImage()
						} else if (this.uploadedImages.length === 0) {
							this.photoUrls.push(...res.tempFilePaths); // 追加新选择的照片到现有数组
							this.upLoadImage()
						}

					},
				});
			},


			removePhoto(index) {
				// 当用户点击删除按钮时，从photoUrls数组中移除相应的图片路径
				uni.$http.delete("/api/trends/delete", {
					imageURL: this.uploadedImages[index].filename
				}).then(res => {
					this.uploadedImages.splice(index, 1);
					this.photoUrls.splice(index, 1);
					uni.showToast({
						icon: "none",
						title: res.data.data.msg,
						duration:1500
					})
				})
			},
			submitInfo(){
				uni.showModal({
					content: '您确定要发布此动态！',
					success: (e) => {
						if (e.confirm) {
							this.submitLeave()
						}
					}
				});
			},
			async submitLeave() {
				if (this.leaveType.trim() === "") {
					return uni.showToast({
						icon: "none",
						title: "请输入留言类型"
					})
				} else if (this.leaveContent.trim() === "") {
					return uni.showToast({
						icon: "none",
						title: "请输入留言内容"
					})
				} else if (this.photoUrls.length === 0) {
					return uni.showToast({
						icon: "none",
						title: "请上传照片"
					})
				}
				this.leaveSubmit()
			},
			async upLoadImage() {
				if (this.uploadedImages.length === 0) {
					await this.photoUrls.forEach(item => {
						uni.uploadFile({
							url: uni.uploadURL + "/api/trends/uploadImages",
							filePath: item,
							name: 'file',
							formData: {},
							header: {
								'content-type': 'multipart/form-data'
							},
							success: (uploadFileRes) => {
								const images = JSON.parse(uploadFileRes.data)
								this.uploadedImages.push(images.data[0])
								uni.showToast({
									title: '图片上传成功',
									icon: "none"
								})
							}
						})
					})
				} else if (this.uploadedImages.length > 0) {
					await this.photoUploadSecond.forEach(item => {
						uni.uploadFile({
							url: uni.uploadURL + "/api/trends/uploadImages",
							filePath: item,
							name: 'file',
							formData: {},
							header: {
								'content-type': 'multipart/form-data'
							},
							success: (uploadFileRes) => {
								const images = JSON.parse(uploadFileRes.data)
								this.uploadedImages.push(images.data[0])
								this.photoUploadSecond = []
								uni.showToast({
									title: '图片上传成功',
									icon: "none"
								})
							}
						})

					})
				}
			},
			leaveSubmit() {
				uni.$http.post('/api/trends/submitLeave', {
					publisherId: this.userInfo._id,
					leaveType: this.leaveType,
					leaveContent: this.leaveContent,
					imgArr: this.uploadedImages
				}).then(() => {
					this.leaveType = "",
						this.leaveContent = ""
					this.photoUrls = []
					this.uploadedImages = []

					uni.switchTab({

						url: "/pages/leave/leave"
					})
					uni.showToast({
						icon: "none",
						title: "发表成功，等待管理员审核"
					})
				})
			}
		},
	}
</script>




<style lang="scss">
	.container {
		height: 1226rpx;
		display: flex;
		flex-direction: column;
	}

	text {
		color: #000;
		font-size: 30rpx;
		line-height: 60rpx;
	}

	input,
	textarea,
	button {
		margin: 30rpx;
		color: #000;
	}

	.uploadImage {
		display: flex;
		align-items: center;
	}

	.choosePhoto {
		background-image: url("../../static/orderImgs/camera.png");
		background-size: 100% 100%;
		width: 180rpx;
		height: 180rpx;
		background-repeat: no-repeat;
		font-size: 30rpx;
		color: #cdcdcd;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.image-container {
		display: flex;
		height: 150rpx;
		width: 150rpx;


	}

	.image-preview {
		position: relative;
		margin-left: 20rpx;

		.deleteImage {
			width: 25rpx;
			height: 25rpx;
			border-radius: 50%;
			background: #ec5a33;
			color: #fff;
			font-size: 20rpx;
			text-align: center;
			line-height: 25rpx;
			position: absolute;
			right: -10rpx;
			top: -10rpx;
		}
	}

	.image-container image {
		width: 140rpx;
		height: 140rpx;

	}


	.leave_type,
	.contact {
		border-bottom: 1rpx solid #cdcdcd;
		padding: 20rpx;
	}

	.leave_content {
		width: 100%;
		padding: 20rpx;
		border-bottom: 1rpx solid #cdcdcd;
	}

	.contact {
		padding: 20rpx;
		clear: both;
		border-top: 1rpx solid #cdcdcd;
	}

	.submit_leave {
		width: 65%;
		background-color: #4d6398;
		color: #fff;
		border-radius: 50rpx;
		margin: 200rpx auto;

	}
</style>