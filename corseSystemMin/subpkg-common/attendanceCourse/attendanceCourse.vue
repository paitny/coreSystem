<template>
	<view class="container">
		<!-- 课程详情部分 -->
		<view class="course-detail">
			<text class="course-name">{{ course.name }}</text>
			<view class="course-info">当前查课周：第{{ feedback.week }}周 {{ forweek[feedback.weekday] }}</view>
			<view class="course-info">代码：{{ course.num }}</view>
			<view class="course-info">节次：{{ course.rawSection }}</view>
			<view class="course-info">地点：{{ course.address }}</view>
		</view>

		<!-- 考勤反馈表单 -->
		<view class="attendance-form">
			<view class="form-title">查课情况反馈</view>

			<view class="form-item">
				班级：{{ feedback.grade + feedback.class + feedback.level }}
			</view>
			<view class="form-item">
				应到人数：{{feedback.shouldAttend}}
			</view>
			<view class="form-item">
				实到人数：{{feedback.actualAttend}}
			</view>
			<view class="form-item">
				缺席人数：{{feedback.absent}}
			</view>
			<view class="form-item">
				请假人数：{{feedback.leave}}
			</view>
			<view class="form-item">
				当前查课人：{{feedback.checker}}
			</view>
			<view class="form-item">
				学委是否给名单：是
				<switch color="#007aff" @change="onSwitchChange" :checked="feedback.switchValue" /> 否
			</view>

			<!-- 上传照片部分 -->
			<view class="form-item">
				<view>
					查课照片：
				</view>
				<view class="uploadImage">
					<button @tap="chooseAndAddWatermark" class="choosePhoto">添加图片</button>

					<view @click="previewImageFunc" class="previewImageFunc">
						<view class="waterImage" v-for="(item,index) in watermarkedImageUrls" :key="index">
							<image :src=baseURL+item class="image-preview"
								@click.stop="clickImg(index,watermarkedImageUrls)"></image>
							<view class="remove-icon" @click.stop="removeImage(index)">
								x
							</view>
						</view>


						<canvas canvas-id="myCanvas" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px',}"
							style="position: absolute;left: -5000rpx;top: -5000rpx;"></canvas>

					</view>


				</view>


			</view>


			<view class="form-item">
				<text>备注：</text>
				<textarea v-model="feedback.remarks" placeholder="备注"></textarea>
			</view>
			<button @click="submitFeedback" type="primary">提交班级考勤数据</button>
		</view>




	</view>
	<view v-if="isPopupVisible" class="popup" @click="hidePopup()">
		<!-- 弹窗内容 -->
		<view class="popup-box" @click.stop>
			<view class="popup-content">
				<!-- 学生考勤列表及搜索功能 -->
				<view class="attendance-list">
					<view class="search-container">
						<uni-search-bar :radius="5" bgColor="#F7F7F7" cancelButton="none" v-model="searchKeyword"
							placeholder="输入学生姓名"></uni-search-bar>
					</view>
					<view class="filteredResults">
						<attendance-item style="padding-top: 100rpx;" v-for="user in filteredResults" :key="user._id"
							:user="user" :remarks="feedback.remarks" @update-status="updateCounts" />
					</view>
				</view>
				<!-- 右侧个人简介 -->
				<!-- 点击弹窗以外的区域关闭弹窗 -->
				<view class="mask" @click="hidePopup">×</view>
			</view>
		</view>
	</view>
	<view class="floating-window" @click="hidePopup()">
		<!-- 这里是悬浮窗的内容 -->
		<image src="../../static/orderImgs/student.png" mode=""></image>
	</view>

</template>

<script>
	import AttendanceItem from '../../components/AttendanceItem/AttendanceItem.vue';
	import {
		mapState
	} from 'vuex';

	export default {
		components: {
			AttendanceItem
		},
		data() {
			return {
				course: {},
				feedback: {
					grade: '',
					class: '',
					level: '',
					week: '',
					weekday: '',
					shouldAttend: 0,
					actualAttend: 0,
					absent: 0,
					leave: 0,
					checker: '',
					switchValue: '',
					remarks: '',

				},
				baseURL: '',
				photoUrl: '', // 存放选择照片后的预览 URL
				photoBase64: '', // 存放照片的 base64 数据（可选）
				isPopupVisible: false,
				results: [],
				leaveCount: 0,
				absentCount: 0,
				forweek: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
				searchKeyword: '', // 搜索关键词
				canvasWidth: 0,
				canvasHeight: 0,
				maxWidth: 0,
				maxHeight: 0,
				originalWidth: 0, // 原始图片的宽度
				originalHeight: 0, // 原始图片的高度
				watermarkImageUrl: 'https://wypty.cn/static/file/material/watermark.png',
				jsonData: {
					idCarImageFront: '',
					idCarImageOpposite: ''
				},
				previewImage: '', // 预览图片的路径
				watermarkedImageUrls: []
			};
		},
		computed: {
			...mapState(['userInfo']),
			// 根据搜索关键词过滤显示的学生数据
			filteredResults() {
				if (!this.searchKeyword.trim()) {
					return this.results;
				}
				const keyword = this.searchKeyword.trim().toLowerCase();
				return this.results.filter(user =>
					user.name.toLowerCase().includes(keyword)
				);
			}
		},
		onLoad(options) {
			// 获取屏幕尺寸
			uni.getSystemInfo({
				success: res => {
					this.maxWidth = res.windowWidth * 0.9; // 最大宽度为屏幕宽度的90%
					this.maxHeight = res.windowHeight * 0.9; // 最大高度为屏幕高度的90%
				}
			});
			this.baseURL = uni.baseURL;
			const results = JSON.parse(options.results);
			this.feedback.grade = options.grade;
			this.feedback.class = options.class;
			this.feedback.level = options.level;
			this.feedback.checker = this.userInfo.name;
			this.feedback.week = options.week;
			this.feedback.weekday = options.weekday;
			this.course = JSON.parse(decodeURIComponent(options.course));
			this.feedback.switchValue=JSON.parse( options.isProvide )
	
			// console.log(typeof( JSON.parse(decodeURIComponent(options.photo))) );
			this.watermarkedImageUrls =  JSON.parse(options.photo);
			// console.log(typeof(JSON.parse(options.photo)) );
			

			if (results.length > 0) {
				this.feedback.shouldAttend = results.length;
				this.results = results;

				// 计算请假和缺席人数
				this.leaveCount = results.filter(user => user.status === 'leave').length;
				this.absentCount = results.filter(user => user.status === 'absent').length;
				this.feedback.leave = this.leaveCount;
				this.feedback.absent = this.absentCount;

				// 计算实际出勤人数
				this.feedback.actualAttend = this.feedback.shouldAttend - this.leaveCount - this.absentCount;
			} else {
				this.photoUrl = ''
				this.getClassCount();
			}
		},

		methods: {
			onSwitchChange(e) {
				// 直接根据开关状态更新数据
				this.feedback.switchValue = e.detail.value;
				
			},
			clickImg(index, imageUrls) {
				const urls = []
				for (const name of imageUrls) {
				
					urls.push(this.baseURL + name);
				}

				uni.previewImage({
					urls: urls, // 图片的URL数组
					current: index // 当前显示图片的索引
				});
			},

			previewImageFunc() {
				uni.previewImage({
					urls: [this.previewImage] // 要预览的图片路径列表
				});
			},
			chooseAndAddWatermark() {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], // 保留 'original' 以保持最高质量
					sourceType: ['camera'],
					success: res => {
						const tempFilePath = res.tempFilePaths[0];
						uni.getImageInfo({
							src: tempFilePath,
							success: image => {
								// 保存原始图片尺寸
								this.originalWidth = image.width;
								this.originalHeight = image.height;

								// 直接使用原始图片尺寸
								this.canvasWidth = this.originalWidth;
								this.canvasHeight = this.originalHeight;

								// 开始加载水印处理，显示加载动画
								uni.showLoading({
									title: '图片处理中...',
								});

								setTimeout(() => {
									let ctx = uni.createCanvasContext('myCanvas', this);
									ctx.drawImage(tempFilePath, 0, 0, this.canvasWidth,
										this.canvasHeight);

									// 设置文字水印
									const timestamp = '北京时间' + this
										.getCurrentFormattedTime();
									ctx.setFillStyle('white');
									ctx.setFontSize(50); // 增大字体以提高可见度

									// 计算文字宽度，以便居中
									const textWidth = ctx.measureText(timestamp).width;
									const textX = (this.canvasWidth - textWidth) /
										2; // 水平居中
									const textY = this.canvasHeight - 30; // 垂直位置

									ctx.fillText(timestamp, textX, textY); // 时间戳在正下方居中

									// 添加图片水印
									uni.downloadFile({
										url: this.watermarkImageUrl,
										success: downloadRes => {
											if (downloadRes.statusCode ===
												200) {
												// 将水印图片绘制到左上角
												ctx.drawImage(downloadRes
													.tempFilePath, 20, 20,
													200, 200); // 调整水印尺寸

												// 添加右上角文字水印
												const userInfoText = this
													.userInfo.position + this
													.userInfo.name;
												const userInfoTextWidth = ctx
													.measureText(userInfoText)
													.width;
												const userInfoTextX = (this
													.canvasWidth -
													userInfoTextWidth) / 2;
												const userInfoTextY = textY -
													80; // 在时间水印上方

												ctx.setFontSize(
													50); // 增大字体以提高可见度
												ctx.setFillStyle('white');
												ctx.fillText(userInfoText,
													userInfoTextX,
													userInfoTextY); // 设置文字位置

												ctx.draw(false, () => {
													// 导出图片，使用原始图片的宽高，质量设置为最高
													uni.canvasToTempFilePath({
														canvasId: 'myCanvas',
														destWidth: this
															.originalWidth, // 使用原始图片的宽度
														destHeight: this
															.originalHeight, // 使用原始图片的高度
														fileType: 'png',
														quality: 1.0, // 设置图片质量为最高
														success: res => {
															that.previewImage =
																res
																.tempFilePath; // 设置预览图片路径
															that.uploadImage(
																res
																.tempFilePath
															);
														},
														fail: err => {
															console
																.error(
																	'Failed to save canvas image:',
																	err
																);
															uni
																.hideLoading(); // 隐藏加载动画
														}
													});
												});
											} else {
												console.error(
													'Failed to download watermark image:',
													downloadRes);
												uni.hideLoading(); // 隐藏加载动画
											}
										},
										fail: err => {
											console.error(
												'Failed to download image:',
												err);
											uni.hideLoading(); // 隐藏加载动画
										}
									});
								}, 500);
							},
							fail: err => {
								console.error('Failed to get image info:', err);
							}
						});
					},
					fail: err => {
						console.error('Failed to choose image:', err);
					}
				});
			},

			uploadImage(filePath) {
				uni.showLoading({
					title: '正在上传中...',
				});
				uni.uploadFile({
					url: uni.uploadURL + '/api/aiCourse/cover', // 替换为你的服务器上传地址
					filePath: filePath,
					name: 'file',
					formData: {
						user: 'test'
					},
					success: uploadRes => {
						if (uploadRes.statusCode === 200) {
							this.jsonData.idCarImageFront = JSON.parse(uploadRes.data).url; // 处理返回数据
							this.photoUrl = JSON.parse(uploadRes.data).url;
							if (this.watermarkedImageUrls.length >= 3) {
								return uni.showToast({
									title: '上传失败最多添加三张哟',
									icon: 'none'
								})
							} else {
								this.watermarkedImageUrls.push(JSON.parse(uploadRes.data).url)
								
								uni.showToast({
									title: '上传成功',
									icon: 'success'
								});
							}



						} else {
							uni.showToast({
								title: '上传失败',
								icon: 'none'
							});
						}
					},
					fail: err => {
						console.error('Upload failed:', err);
						uni.showToast({
							title: '上传失败',
							icon: 'none'
						});
					},
					complete: () => {
						uni.hideLoading(); // 无论成功与否都关闭加载动画
					}
				});
			},
			getCurrentFormattedTime() {
				const now = new Date();

				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要加1
				const day = String(now.getDate()).padStart(2, '0');

				const hours = String(now.getHours()).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				const seconds = String(now.getSeconds()).padStart(2, '0');

				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},
			hidePopup() {

				this.isPopupVisible = !this.isPopupVisible;
			},
			getClassCount() {
				uni.$http.get('/api/get/searchClassUser', {
						userId: this.userInfo._id,
						grade: this.feedback.grade,
						class: this.feedback.class,
						levels: this.feedback.level
					})
					.then((res) => {
						
						this.feedback.shouldAttend = res.data.data.total;
						this.feedback.actualAttend = res.data.data.total;
						this.results = res.data.data.list;
					})
					.catch((error) => {
						console.error(error);
					});
			},
			updateCounts(user, newStatus) {
				const currentStatus = user.status;

				switch (currentStatus) {
					case 'leave':
						this.leaveCount--;
						break;
					case 'absent':
						this.absentCount--;
						break;
					default:
						break;
				}

				user.status = newStatus;

				switch (newStatus) {
					case 'leave':
						this.leaveCount++;
						break;
					case 'absent':
						this.absentCount++;
						break;
					default:
						break;
				}

				this.feedback.leave = this.leaveCount;
				this.feedback.absent = this.absentCount;

				this.feedback.actualAttend = this.feedback.shouldAttend - this.leaveCount - this.absentCount;
			},
			removeImage(index) {
				// 从水印图片数组中删除指定的图片
				this.watermarkedImageUrls.splice(index, 1);
			},
			submitFeedback() {
				uni.showModal({
					title: '提示',
					content: `您确定要提交 ${this.feedback.grade}${this.feedback.class}${this.feedback.level} 的考勤数据嘛？`,
					success: (res) => {
						if (res.confirm) {
							if (this.watermarkedImageUrls.length === 0) {
								return uni.showToast({
									icon: 'error',
									title: '请上传查课照片'
								})
							} else {
								const feedbackData = {
									userId: this.userInfo._id,
									course: this.course,
									week: this.feedback.week,
									weekday: this.feedback.weekday,
									grade: this.feedback.grade,
									class: this.feedback.class,
									level: this.feedback.level,
									shouldAttend: this.feedback.shouldAttend,
									actualAttend: this.feedback.actualAttend,
									absent: this.feedback.absent,
									leave: this.feedback.leave,
									checker: this.feedback.checker,
									isProvide: this.feedback.switchValue,
									remarks: this.feedback.remarks,
									results: this.results,
									photo: this.watermarkedImageUrls // 添加图片URL
								};
								uni.$http.post("/api/aiCourse/courseFeedback", {
									feedbackData: feedbackData
								}).then((res) => {
									uni.showToast({
										title: res.data.message,
										icon: 'success'
									});
								}).catch((error) => {
									console.error(error);
								});
							}

						}
					}
				});
			},
			clearSearch() {
				this.searchKeyword = '';
			}
		}
	};
</script>
<style scoped lang="scss">
	canvas {
		margin-top: 20rpx;

	}

	.container {
		height: 100%;
		padding: 20px;
	}

	.course-detail {
		padding: 30rpx;
		margin-bottom: 20px;
		background-color: #f8f8f8;
		border-radius: 15rpx;
		box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.course-name {
		font-size: 24px;
		font-weight: bold;
	}

	.course-info {
		margin-top: 10px;
		color: #666;
	}

	.attendance-form {
		padding: 30rpx;
		margin-bottom: 20px;
		background-color: #f8f8f8;
		border-radius: 15rpx;
		box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, 0.1);


	}

	.form-title {
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.form-item {
		margin-bottom: 10px;
		z-index: 1;

		.uploadImage {
			display: flex;

			flex-direction: column;

			.choosePhoto {
				background-image: url("../../static/orderImgs/camera.png");
				background-size: 100% 100%;
				width: 180rpx;
				height: 180rpx;
				background-repeat: no-repeat;
				font-size: 30rpx;
				color: #cdcdcd;
				margin: 0;
			}

			.previewImageFunc {
				margin-top: 20rpx;
				display: flex;

				.waterImage {
					position: relative;
				}

				.remove-icon {
					position: absolute;
					top: 0rpx;
					right: -10rpx;
					background-color: red;
					/* 半透明背景 */
					border-radius: 50%;
					/* 圆形背景 */
					width: 30rpx;
					/* 根据需要调整大小 */
					height: 30rpx;
					/* 根据需要调整大小 */
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					/* 鼠标指针样式 */
					font-size: 24rpx;
					/* 字体大小 */
					color: #f8f8f8;
					/* 图标颜色 */
				}

				.image-preview {
					position: relative;
					width: 180rpx;
					height: 180rpx;
					border-radius: 20rpx;

				}

				.waterImage:nth-child(2) {
					margin-left: 30rpx;
				}

				.waterImage:nth-child(3) {
					margin-left: 30rpx;
				}
			}


		}

	}

	.form-item text {
		display: inline-block;
		width: 80px;
		padding-top: 10px;
	}

	.form-item input {
		flex: 1;
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
		margin-top: 10px;
	}

	.form-item textarea {
		flex: 1;
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
		width: 95%;
	}

	.attendance-list {
		margin-bottom: 20px;
		max-height: 600rpx;
		overflow: hidden;
		overflow-y: auto;


		.filteredResults {
			margin-top: 50rpx;
		}

		.search-container {
			margin-bottom: 10px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			top: 0;

		}
	}



	uni-search-bar {
		flex: 1;
		border-radius: 20px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	.search-container button {
		padding: 10px 15px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		/* 按钮动画效果 */
		margin-left: 10px;
	}

	.search-container button:hover {
		background-color: #0056b3;
	}

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
		z-index: 99999;

		.popup-box {
			width: 100%;
			min-height: 600rpx;
			z-index: 99999;

			.popup-content {
				position: relative;
				justify-content: space-between;
				align-items: center;
				padding: 40rpx;
				background: #fff;
				border-radius: 20rpx;
				width: 80%;
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

	image {
		width: 250rpx;
		margin-top: 15rpx;
	}

	.floating-window {
		position: fixed;
		right: 30rpx;
		bottom: 150rpx;
		width: 100rpx;
		height: 100rpx;

		z-index: 999;

		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}
	}


	uni-search-bar {
		border-radius: 10rpx;


	}
</style>