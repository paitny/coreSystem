<template>
	<view class="container">
		活动标题：<input v-model="title" placeholder="请输入活动标题" @input="limitTitle" class="csize" />
		活动地点：<input v-model="address" placeholder="请输入活动地点" @input="limitTitle" class="csize" />
		人数限制：<input v-model="limitPerson" type="number" placeholder="请输入本场活动上限人数" @input="limitTitle" class="csize" />
		活动描述：<textarea v-model="description" @input="limitDescription" placeholder="请输入活动描述"
			class="description csize"></textarea>

		<view class="endTime csize">
			<text class="endText">报名截止时间：</text>
			<uni-datetime-picker type="datetime" v-model="deadline" @change="onDateTimeChange" />
		</view>
		<view class="endTime csize">
			<text class="endText">活动开始时间：</text>
			<uni-datetime-picker type="datetime" v-model="startTime" @change="checkTimeChange" />
		</view>
		<view class="uni-list-cell uni-list-cell-pd">
			活动是否签到：
			<switch color="#007aff" @change="onSwitchChange" :checked="switchValue" />
		</view>
		<view class="uni-list-cell uni-list-cell-pd" v-if="switchValue">
			活动是否签退：
			<switch color="#007aff" @change="onSwitchChange2" :checked="switchValue2" />
		</view>
		<view class="uni-list-cell uni-list-cell-pd">
			是否公开报名：
			<switch color="#007aff" @change="onSwitchChange3" :checked="switchValue3" />
		</view>
		<view class="uni-list-cell uni-list-cell-pd">
			学生活动群聊：
			<switch color="#007aff" @change="onGroupSwitchChange" :checked="ifShowGroup" />
		</view>
		<view class="" v-if="ifShowGroup">
			<view class="uni-list-cell uni-list-cell-pd">
				活动群聊号：
				<input v-model="groupNum" type="number" placeholder="请输入活动群号" class="csize" />
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				上传群聊二维码：

			</view>
			<view class="uploadImage csize">
				<button @tap="choosePhoto(1)" class="choosePhoto csize">添加图片</button>
				<view v-if="GroupCodeUrl.length > 0">
					<image :src="GroupCodeUrl[0]" class="image-preview"></image>
				</view>
			</view>
		</view>
		<view class="uni-list-cell uni-list-cell-pd">
			活动封面：
		</view>
		<view class="uploadImage csize">
			<button @tap="choosePhoto(2)" class="choosePhoto csize">添加图片</button>
			<view v-if="photoUrls.length > 0">
				<image :src="photoUrls[0]" class="image-preview"></image>
			</view>
		</view>
		<button @tap="submitInfo" class="csize btnSubmit">活动更新</button>
	</view>
</template>

<script>
	import moment from 'moment';
	export default {
		data() {
			return {
				title: '',
				address: '',
				description: '',
				deadline: '', // 结束时间
				startTime: '',
				limitPerson: Number,
				showTimePicker: false, // 控制是否显示时间选择器
				showDatePicker: true, // 控制日期选择器显示与隐藏
				id: "",
				tu: '',
				baseURL: "",
				photoUrls: [], // 图片的URL
				uploadedImages: [],
				photoUploadSecond: [], //第二次上传
				switchValue: false, // 开关的初始状态
				isSign: false, // 默认状态下为false
				ifShowGroup: true,
				GroupCodeUrl: [],
				GroupCode: '', //群码上传
				uploadedGroupCodeImages: [],
				photoUploadGroupCodeSecond: [],
				groupNum:'',
				deleteUpurl:'',
				deleteUrl:'',
				switchValue3:true,
				switchValue2:false
				
			};
		},
		onLoad(options) {
			this.baseURL = uni.baseURL
			this.aid = options.id
			this.title = options.title
			this.description = options.description
			this.deadline = options.deadline
			this.deleteUrl = options.mdUrl
			this.photoUrls[0] = this.baseURL + options.mdUrl
			this.GroupCodeUrl[0]=this.baseURL+options.groupCode
			this.GroupCode=options.groupCode
			this.groupNum=options.groupNum
			if(this.groupNum==='暂无'){
				this.ifShowGroup=false
			}
			this.tu = options.mdUrl
			this.switchValue = JSON.parse(options.isSign) // 更新签到状态
			this.limitPerson = options.limitPerson
			this.startTime = options.startTime
			this.address = options.address,
			this.switchValue2=JSON.parse(options.isCheckOut)
            this.switchValue3=JSON.parse(options.transpire)
		},
		methods: {
			toggleSwitch() {
				// 处理点击事件，根据需求编写业务逻辑
			},
			onSwitchChange(e) {
				// 直接根据开关状态更新数据
				this.switchValue = e.detail.value;
				this.isSign = this.switchValue; // 更新isSign状态


			},
			onSwitchChange2(e) {
				// 直接根据开关状态更新数据
				this.switchValue2 = e.detail.value;
				this.isCheckOut = this.switchValue2; // 更新isSign状态
			
			
			},
			onSwitchChange3(e){
				// 直接根据开关状态更新数据
				this.switchValue3 = e.detail.value;
				
			},
			onGroupSwitchChange(e) {
				// 直接根据开关状态更新数据
				this.ifShowGroup = e.detail.value
				this.GroupCode = ""
				this.GroupCodeUrl = []

			},

			limitTitle() {
				if (this.title.length > 40) {
					this.title = this.title.substring(0, 40); // 截取前400个字符
					uni.showToast({
						title: '最多只能输入40个字符',
						icon: 'none'
					});
				}
			},
			limitDescription() {
				if (this.description.length > 400) {
					this.description = this.description.substring(0, 400); // 截取前400个字符
					uni.showToast({
						title: '最多只能输入400个字符',
						icon: 'none'
					});
				}

			},
			choosePhoto(type) {
				if (type === 1) {
					if (this.GroupCodeUrl.length >= 1) {
						// 如果已经上传了一张照片，允许替换现有图片
						uni.chooseImage({
							count: 1,
							sourceType: ["camera", "album"],
							success: (res) => {
								this.GroupCodeUrl.splice(0, 1, ...res.tempFilePaths); // 替换第一张照片
								this.upLoadImage(type);
							}
						});
					} else {
						uni.chooseImage({
							count: 1,
							sourceType: ["camera", "album"],
							success: (res) => {
								this.GroupCodeUrl.push(...res.tempFilePaths);
								this.upLoadImage(type);
							}
						});
					}
			
			
			
				} else if (type === 2) {
					if (this.photoUrls.length >= 1) {
						// 如果已经上传了一张照片，允许替换现有图片
						uni.chooseImage({
							count: 1,
							sourceType: ["camera", "album"],
							success: (res) => {
								this.photoUrls.splice(0, 1, ...res.tempFilePaths); // 替换第一张照片
								this.upLoadImage(type);
							}
						});
					} else {
						uni.chooseImage({
							count: 1,
							sourceType: ["camera", "album"],
							success: (res) => {
								this.photoUrls.push(...res.tempFilePaths);
								this.upLoadImage(type);
							}
						});
					}
				}
			},


			onDateTimeChange(e) {
				this.deadline = e; // 格式化日期和时间


			},
			checkTimeChange(e) {
				this.startTime = e; // 格式化日期和时间


			},
			submitInfo() {

				uni.showModal({
					content: '您确定要修改此活动！',
					success: (e) => {
						if (e.confirm) {
							this.submitLeave()
						}
					}
				});
			},
		async submitLeave() {
			if (this.title.trim() === "") {
				return uni.showToast({
					icon: "none",
					title: "请输入活动题目"
				})
			} else if (isNaN(this.limitPerson)) {
				return uni.showToast({
					icon: "none",
					title: "请输入数字"
				})
			} else if (this.description.trim() === "") {
				return uni.showToast({
					icon: "none",
					title: "请输入活动描述"
				})
			} else if (this.deadline.trim() === "") {
				return uni.showToast({
					icon: "none",
					title: "请选择活动结束时间"
				})
		
			}else if (this.startTime.trim() === "") {
					return uni.showToast({
						icon: "none",
						title: "请选择活动开始时间"
					})

				} else if (this.ifShowGroup === true) {
				if (this.groupNum === '') {
					return uni.showToast({
						icon: "none",
						title: "请输入活动群号码"
					})
				} else if (this.GroupCode === '') {
					return uni.showToast({
						icon: "none",
						title: "请上传群二维码"
					})
		
				}
		
			} else if (this.tu=== '') {
				return uni.showToast({
					icon: "none",
					title: "请上传活动照片"
				})
			}
			this.leaveSubmit()
		},
			async upLoadImage(type) {
				this.uploadedGroupCodeImages.length
				if (type === 1) {
			
					if (this.uploadedGroupCodeImages.length === 0) {
						await this.GroupCodeUrl.forEach(item => {
							uni.uploadFile({
								url: uni.uploadURL + "/api/itVolunteer/cover",
								filePath: item,
								name: 'file',
								formData: {},
								header: {
									'content-type': 'multipart/form-data'
								},
								success: (uploadFileRes) => {
									const images = JSON.parse(uploadFileRes.data)
									console.log(uploadFileRes);
									this.uploadedGroupCodeImages.push(images.data)
									const filePath = images.url;
									this.GroupCode = filePath;
									console.log(this.GroupCode);
									uni.showToast({
										title: '图片上传成功',
										icon: "none"
									})
								}
							})
						})
					} else if (this.uploadedGroupCodeImages.length > 0) {
						await this.photoUploadGroupCodeSecond.forEach(item => {
							uni.uploadFile({
								url: uni.uploadURL + "/api/itVolunteer/cover",
								filePath: item,
								name: 'file',
								formData: {},
								header: {
									'content-type': 'multipart/form-data'
								},
								success: (uploadFileRes) => {
									const images = JSON.parse(uploadFileRes.data)
									this.uploadedGroupCodeImages.push(images.data)
									const filePath = images.url;
									this.groupCode = filePath;
									console.log(this.groupCode);
									this.photoUploadGroupCodeSecond = []
									uni.showToast({
										title: '图片上传成功',
										icon: "none"
									})
								}
							})
			
						})
					}
				} else if (type === 2) {
					if (this.uploadedImages.length === 0) {
							await this.photoUrls.forEach(item => {
								uni.uploadFile({
									url: uni.uploadURL + "/api/itVolunteer/cover",
									filePath: item,
									name: 'file',
									formData: {},
									header: {
										'content-type': 'multipart/form-data'
									},
									success: (uploadFileRes) => {
					
										const images = JSON.parse(uploadFileRes.data)
					
										this.uploadedImages.push(images.data)
										const filePath = images.url;
										this.deleteUpurl = this.deleteUrl
										this.tu = filePath;
										this.deleteUrl = this.tu
					
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
									url: uni.uploadURL + "/api/itVolunteer/cover",
									filePath: item,
									name: 'file',
									formData: {},
									header: {
										'content-type': 'multipart/form-data'
									},
									success: (uploadFileRes) => {
										const images = JSON.parse(uploadFileRes.data)
										this.uploadedImages.push(images.data)
										this.deleteUpurl = this.deleteUrl
										this.tu = filePath;
										this.deleteUrl = this.tu
										this.photoUploadSecond = []
										uni.showToast({
											title: '图片上传成功',
											icon: "none"
										})
									}
								})
					
							})
						}
					
				}
			
			},
			
			leaveSubmit() {


				let doc = {
					title: this.title,
					deadline: this.deadline,
					description: this.description,
					isSign: this.switchValue,
					isCheckOut:this.switchValue2,
					address: this.address,
					startTime: this.startTime,
					limitPerson: this.limitPerson,
					cover: this.tu,
					groupNum:this.groupNum,
					groupCode:this.GroupCode,
					transpire:this.switchValue3
				};

				uni.$http.post("/api/itVolunteer/update", {
					id: this.aid,
					doc: doc,
					mdUrl: this.deleteUpurl,
				}).then((res) => {
					uni.showToast({
						duration: 1500,
						icon: "none",
						title: res.data.msg
					});
					uni.navigateBack()
				}).catch((error) => {
					console.error('活动修改失败', error);
					uni.showToast({
						icon: "none",
						title: "活动修改失败"
					});
				}).finally(() => {
					uni.hideLoading();
				});
			},
		}
	};
</script>
<style lang="scss">
	.container {
		background-color: #fff;
		padding: 20rpx;


		.csize {
			margin: 20rpx auto;
		}

		input {
			background-color: #E6E6E6;
			padding-left: 15rpx;
			height: 95rpx;
			width: 100%;
		}

		textarea {
			background-color: #E6E6E6;
			padding-left: 15rpx;
			padding-top: 15rpx;
			width: 100%;
		}

		.uni-list-cell {
			margin-top: 20rpx;
		}

		.description {
			width: 100%;
		}

		.endTime {
			

			.endText {
				margin: auto;
			}

			.uni-date-x--border {
				border: 1px solid #fff;
			}
		}

		.uploadImage {
			display: flex;


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

			.image-preview {
				margin-left: 48rpx;
				width: 180rpx;
				height: 180rpx;
				border-radius: 20rpx;
			}

		}

		.btnSubmit {
			margin-top: 30rpx;
			background-color: #007aff;
			color: #fff;
		}
	}
</style>