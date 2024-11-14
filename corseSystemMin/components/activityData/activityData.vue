<template>
	<view class="floating-window" @click="handleClick" v-if="isShowUpload">
		<!-- 这里是悬浮窗的内容 -->
		<image @click="chooseExcel" src="../../static/img/upload.png" mode=""></image>

	</view>
	<view class="floating-window" @click="branchActivity()" v-else>
		<!-- 这里是悬浮窗的内容 -->
		<image src="../../static/orderImgs/publish.png" mode=""></image>
	</view>

</template>

<script>
	export default {
		props: {
			activityId: {
				type: String,
				required: true
			},
			isShow: {
				type: Boolean,
				required: true
			},
			currentName: {
				type: String,
				required: true
			},
			isaudit: {
				type: Boolean,
				required: true
			}
		},
		data() {
			userData: []
		},
		computed: {
			// 根据 isShow 属性决定是否显示上传悬浮窗
			isShowUpload() {
				return this.isShow;
			}
		},
		methods: {
			chooseExcel() {
				uni.showModal({
					content: '是否在聊天中获取文件',
					success: (e) => {
						if (e.confirm) {
							if (this.isaudit === false) {
								return uni.showToast({
									title: "该活动未审核，无法导入",
									duration: 3000,
									icon: "none"
								})
							} else {
								uni.chooseMessageFile({
									count: 1,
									type: 'file',
									success: (res) => {
										const filePath = res.tempFiles[0].path;
										const fileType = res.tempFiles[0].name.toLowerCase();

										// 验证文件类型是否为.xlsx或.xls
										if (!fileType.endsWith('.xlsx') && !fileType.endsWith(
												'.xls')) {
											uni.showToast({
												title: '请选择.xlsx或.xls文件',
												icon: 'none',
												duration: 2000
											});
											return;
										}

										this.uploadExcel(filePath);
									},
									fail: (err) => {
										console.error('chooseExcel fail', err);
									}
								});


							}



						}
					}
				});
			},

			uploadExcel(filePath) {
				uni.showLoading({
					title: '上传中'
				});
				uni.uploadFile({
					url: uni.uploadURL + '/api/Curriculum/uploadActivity', // 上传接口的URL
					filePath: filePath,
					name: 'file',
					formData: {
						'user': 'test'
					},
					success: (res) => {
						const data = JSON.parse(res.data)
						uni.showToast({
							title: "该活动未审核，无法导入",
							duration: 3000,
							icon: "none"
						})
						uni.hideLoading();
						uni.showToast({
							title: data.msg + "，数据预览中，点击右下角按钮存储",
							icon: 'none',
							duration: 5000
						});

						// 触发自定义事件，并传递数据给父组件
						this.$emit('upload-success', data);
						this.userData = data.data
					},
					fail: (err) => {
						console.error('uploadExcel fail', err);
						uni.hideLoading();
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
					}
				});
			},
			branchActivity() {
				uni.showModal({
					content: '您确定要导入' + this.currentName + "活动的报名数据?",
					success: (e) => {
						if (e.confirm) {
							uni.$http.post("/api/itVolunteer/branchVolunteers", {
								activityId: this.activityId,
								volunteers: this.userData
							}).then((res) => {
								console.log(res);
								this.$emit('upload-branchSuccess', res.data);
								uni.showToast({
									icon: "none",
									title: res.data.message
								})


							});
						}
					}
				});
			},
		}
	};
</script>

<style scoped lang="scss">
	.floating-window {
		position: fixed;
		right: 30rpx;
		bottom: 150rpx;
		width: 100rpx;
		height: 100rpx;
		background-color: #ccc;
		border-radius: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}
	}
</style>