<template>
	<view class="container">
		<view class="frame">
			<text style="color: #E6E6E6;">—&nbsp;&nbsp;</text>{{title}}<text
				style="color: #E6E6E6;">&nbsp;&nbsp;—</text>
		</view>

		<acGroup :isPopupVisible="isPopupVisible" :contributor="contributor" @hidePopup="hidePopup"
			v-if="isPopupVisible">
		</acGroup>
		<view class="function">
			<view class="">
				<view class="deadline">报名截止时间：{{countdown}}</view>
				<view class="deadline">活动开始时间：{{parseDateStringAndFormat(startTime)}}</view>
				<view class="deadline">活动地点：{{address}}</view>
				<view class="deadline">人数上限：{{limitPerson}}</view>
				<view class="deadline">活动简介：{{description}}</view>
			</view>


			<view class="delete" @click="deleteSelfInfo">
				<image src="../../static/orderImgs/applicationDelete.png" mode=""></image>
			</view>
		</view>

		<view class="content">
			<view class="cont">
				<text style=" color: red;margin-top: 25rpx;">&nbsp;*&nbsp;</text><text
					style="font-size: 30rpx; margin-top: 25rpx;">学院</text> <br />【大数据学院学生学号自动识别，无法更改】
				<picker @change="onPickerChangefaculty" mode="selector" :range="facultyarray">
					<view class="box"
						style="font-size: 30rpx;color: gray; line-height: 90rpx; padding-left: 15rpx;margin-top: 20rpx;">
						{{inputfaculty}}
					</view>
				</picker>
				<text style="float: left; color: red;margin-top: 25rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx; margin-top: 25rpx;margin-bottom: 25rpx;">姓名</text>
				<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
					placeholder="请输入姓名" v-model="inputname" />
				<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx; margin-top: 20rpx;">性别</text>
				<picker @change="onPickerChangeSex" mode="selector" :range="sexarray">
					<view class="box" style="font-size: 30rpx;color: gray; line-height: 90rpx; padding-left: 15rpx;">
						{{inputsex}}
					</view>
				</picker>

				<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx; margin-top: 20rpx;">学号 </text>
				<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
					placeholder="请输入学号" v-model="inputnum" :disabled="isdisabled" />
				<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx;margin-top: 20rpx; ">年级</text>
				<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
					placeholder="请输入年级 例如:2021级" v-model="gradevalue" />
				<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx; margin-top: 20rpx;">班级</text>
				<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
					placeholder="请输入班级 例如:物联网工程1班" v-model="inputclass" />
					<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
						style="float: left;font-size: 30rpx; margin-top: 20rpx;">层次</text>
					<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
						placeholder="请输入班级 例如:物联网工程1班" v-model="userInfo.levels" />
				<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx;margin-top: 20rpx; ">手机号码</text>
				<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
					placeholder="请输入手机号码" v-model="inputphone" />
				<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx;margin-top: 20rpx; ">辅导员</text>
				<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
					placeholder="请输入辅导员" v-model="inputteachar" />
				<button class="submit" @click="application">确认提交</button>
			</view>
		</view>
	</view>
	<QRCode 
	ref="childComponent"
	:userId="userInfo._id" 
	:activityId="activityId" 
	:activityTitle="title" 
	:showDialog="showDialog"
	:closeDialog="closeDialog"
	></QRCode>
	<!-- 悬浮窗 -->
	<view class="floating-button" @click="handlePreviewQRCode">
		<image src="../../static/orderImgs/QRCode.png" style="width: 50rpx; height: 50rpx;"></image>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import acGroup from '../../components/acGroup/acGroup.vue'
	import QRCode from '../../components/QRCode/QRCode.vue'

	export default {
		data() {
			return {
				showDialog: false,
				inputname: '',
				inputnum: '',
				inputsex: '请选择',
				gradevalue: '',
				inputclass: '',
				inputphone: '',
				inputteachar: '',
				activityId: '',
				title: '',
				deadline: '',
				countdown: "", // 添加倒计时数据
				countdownInterval: null,
				sexarray: ['男', '女'],
				startTime: "",
				address: "",
				description: "",
				limitPerson: "",
				isPopupVisible: false,
				contributor: {},
				facultyarray: ['人工智能与大数据学院', '文法学院', '外国语学院', '经济管理学院', '艺术学院', '传媒与演艺学院', '教育学院', '会计学院', '建筑学院',
					'马克思主义学院', '体育与大健康学院'
				],
				inputfaculty: '',
				isdisabled: true
			}
		},
		onShow() {
			this.checkLogin()
		},
		onLoad(option) {
			this.activityId = option.id
			this.startTime = option.startTime
			this.address = option.address
			this.description = option.description
			this.limitPerson = option.limitPerson === 'undefined' ? "暂无限制" : option.limitPerson + '人'
			this.title = option.title
			this.deadline = option.deadline
			// 将这两个值作为属性添加到contributor对象中
			this.contributor.groupNum = option.groupNum;
			this.contributor.groupCode = option.groupCode;
			this.contributor.baseURL = uni.baseURL
			this.getActiveInfo(option.id)
		},
		mounted() {

			this.updateCountdown();
			this.countdownInterval = setInterval(this.updateCountdown, 1000);
		},
		computed: {
			...mapState(['userInfo'])

		},
		components: {
			acGroup,
			QRCode
		},
		methods: {
			closeDialog(){
				this.showDialog=!this.showDialog
			},
			handlePreviewQRCode() {
				 this.$refs.childComponent.previewQRCode(); // 调用子组件的方法
				// 这里可以添加需要执行的逻辑
			},
			getActiveInfo(id) {
				uni.$http.get('/api/itVolunteer/activityId', {
					activityId: id
				}).then((res) => {
					this.activityId = res.data.data._id
					this.startTime = res.data.data.startTime
					this.address = res.data.data.address
					this.description = res.data.data.description
					this.limitPerson = res.data.data.limitPerson === 'undefined' ? "暂无限制" : res.data.data
						.limitPerson + '人'
					this.title = res.data.data.title
					this.deadline = res.data.data.deadline
					// 将这两个值作为属性添加到contributor对象中
					this.contributor.groupNum = res.data.data.groupNum;
					this.contributor.groupCode = res.data.data.groupCode;
					this.contributor.baseURL = uni.baseURL
				})
			},
			checkLogin() {
				uni.$http.post('/api/login/min/check', {
						id: uni.getStorageSync('userInfo')._id
					})
					.then((res) => {
						if (res.data.code === 0) {

							return uni.showModal({
								content: '登录注册才能报名噢！',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: "/pagesMe/login/login?type=2"
										})
									}
								}
							});


						} else if (res.data.code === 2) {
							return uni.showModal({
								content: '登录注册才能报名噢！',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: "/pagesMe/login/login?type=2"
										})
									}
								}
							});

						} else if (res.data.code === 1) {

							uni.getStorage({
								key: 'userInfo', // 你存储的数据的键名
								success: (res) => {
									this.$store.commit('loginSuccess', res.data);
									this.inputname = this.userInfo.name
									this.inputnum = this.userInfo.num
									this.inputsex = this.userInfo.sex
									this.gradevalue = this.userInfo.grade
									this.inputphone = this.userInfo.phone
									this.inputteachar = this.userInfo.counsellor
									this.inputclass = this.userInfo.class
									this.inputfaculty = this.userInfo.faculty === '暂无' ? this.facultyarray[
										0] : this.userInfo.faculty
								},
								fail: (err) => {
									console.log('获取本地存储失败', err);
								}
							});
							this.$forceUpdate();
						}

					})


			},

			hidePopup() {
				this.isPopupVisible = false
			},
			parseDateStringAndFormat(dateString) {
				const date = new Date(dateString);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，并保证两位数字
				const day = String(date.getDate()).padStart(2, '0'); // 保证两位数字
				const hours = String(date.getHours()).padStart(2, '0'); // 保证两位数字
				const minutes = String(date.getMinutes()).padStart(2, '0'); // 保证两位数字
				const seconds = String(date.getSeconds()).padStart(2, '0'); // 保证两位数字

				return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
			},
			updateActivity(id, title, deadline, description, isSign, mdUrl) {

				uni.navigateTo({
					url: "../../myServices/updateRelease/updateRelease?id=" + id + "&title=" + title +
						"&deadline=" +
						deadline + "&description=" + description + "&isSign=" + isSign + "&mdUrl=" + mdUrl
				});

			},
			deleteInfo() {
				uni.$http.post("/api/itVolunteer/delete", {
					activityId: this.activityId,
					ID: this.inputnum,
				}).then((res) => {
					uni.showToast({
						icon: "none",
						title: res.data.msg
					});

				});
			},
			deleteSelfInfo() {
				uni.showModal({
					content: '您确定要取消' + this.title + "活动报名",
					success: (e) => {
						if (e.confirm) {
							this.deleteInfo()
						}
					}
				});
			},
			validateField(value, fieldName) {
				if (value.trim() === '') {
					uni.showToast({
						title: fieldName + '不能为空',
						icon: 'none'
					});
					return false;
				}
				return true;
			},
			onPickerChangeSex(e) {
				this.inputsex = this.sexarray[e.detail.value];
			},
			onPickerChangefaculty(e) {

				this.inputfaculty = this.facultyarray[e.detail.value];
				if (this.inputfaculty === '人工智能与大数据学院') {
					this.isdisabled = true
					this.inputnum = this.userInfo.num
				} else {
					this.inputnum = ''
					this.isdisabled = false
				}
			},
			handsubmit() {
				if (!this.userInfo.user) {
					this.checkLogin()
				} else {
					if (
						!this.validateField(this.inputname, '姓名') ||

						!this.validateField(this.gradevalue, '年级') ||
						!this.validateField(this.inputclass, '班级') ||
						!this.validateField(this.inputteachar, '辅导员') ||
						!this.validateField(this.activityId, '必要参数')
					) {
						return;
					}

					// 验证手机号
					if (!/^1[3456789]\d{9}$/.test(this.inputphone)) {
						return uni.showToast({
							title: '请输入正确的手机号',
							icon: 'none'
						});

					}

					// 验证性别
					else if (this.inputsex !== '男' && this.inputsex !== '女') {
						return uni.showToast({
							title: '性别输入有误',
							icon: 'none'
						});

					} else if (!/^\d{8,15}$/.test(this.inputnum)) {
						return uni.showToast({
							title: '学号输入有误',
							icon: 'none'
						});

					}
					uni.$http.post("/api/itVolunteer/application", {
						activityId: this.activityId,
						name: this.inputname,
						sex: this.inputsex,
						ID: this.inputnum,
						grade: this.gradevalue,
						classes: this.inputclass,
						phoneNumber: this.inputphone,
						counsellor: this.inputteachar,
						levels: this.userInfo.levels,
						faculty: this.inputfaculty
					}).then((res) => {
						if (res.statusCode === 403) {
							return uni.showToast({
								duration: 3000,
								icon: "none",
								title: res.data.msg
							});
						} else if (res.statusCode === 500) {
							return uni.showToast({
								duration: 3000,
								icon: "none",
								title: res.data.msg
							});
						}
						uni.showToast({
							duration: 3000,
							icon: "none",
							title: res.data.msg
						});
						this.isPopupVisible = true
					});

				}


			},
			application() {
				uni.showModal({
					content: '您确定要参与' + this.title,
					success: (e) => {
						if (e.confirm) {
							this.handsubmit()
						}
					}
				});
			},
			updateCountdown() {
				const targetDate = new Date(this.deadline); // 使用活动截止时间
				const currentDate = new Date();
				const timeDifference = targetDate - currentDate;

				if (timeDifference <= 0) {
					clearInterval(this.countdownInterval);
					this.countdown = "该活动已到截止时间";
				} else {
					const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
					const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
					const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
					this.countdown = `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`;
				}
			}
		},
		onShareAppMessage() { // 分享到微信
			// 更多参数配置，参考文档
			return {
				title: this.title,
				path: '/pagesHome/application/active?id=' + this.activityId + "&title=" + this.title +
					"&deadline=" + this.deadline +
					"&startTime=" + this.startTime +
					"&address=" + this.address +
					"&description=" + this.description +
					"&limitPerson=" + this.limitPerson.substring(0, this.limitPerson.length - 1) +
					"&groupCode=" + this.contributor.groupCode +
					"&groupNum=" + this.contributor.groupNum
			}
		},

		onShareTimeline() { // 分享到朋友圈
			return {
				title: this.title,
				path: '/pagesHome/application/active?id=' + this.activityId + "&title=" + this.title +
					"&deadline=" + this.deadline +
					"&startTime=" + this.startTime +
					"&address=" + this.address +
					"&description=" + this.description +
					"&limitPerson=" + this.limitPerson +
					"&groupCode=" + this.contributor.groupCode +
					"&groupNum=" + this.contributor.groupNum
			}
		},
	}
</script>

<style lang="scss">
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

	.container {
		height: 1700rpx;
		width: 100%;

		.function {
			display: flex;
			padding: 0rpx 50rpx 15rpx 50rpx;
			justify-content: space-between;
			background-color: #fff;

			.deadline {

				background-color: #fff;
				font-size: 25rpx;
				margin-top: 10rpx;
			}

			.delete {
				image {
					width: 50rpx;
					height: 50rpx;
					background-color: #fff;
				}

			}
		}


		.frame {
			width: 100%;
			background-color: white;
			font-size: 33rpx;

			text-align: center;

			padding: 40rpx 0 40rpx 0;

		}

		.content {
			margin-top: 5rpx;
			width: 100%;
			background-color: white;
			padding-bottom: 50rpx;

			.cont {
				height: 100%;
				width: 90%;
				margin: 0 auto;

				.box {
					margin-top: 83rpx;
					height: 95rpx;
					width: 100%;
					background-color: #E6E6E6;
				}

				.submit {
					height: 80rpx;
					width: 100%;
					margin-top: 50rpx;
					background-color: #4d6398;
					line-height: 75rpx;
					color: white;
					font-size: 32rpx;
					border-radius: 50rpx;
				}
			}
		}
	}
</style>