<template>
	<view class="container">
		<view class="frame">
			<text style="color: #E6E6E6;">—&nbsp;&nbsp;</text>芯系小助手账号反馈机制<text
				style="color: #E6E6E6;">&nbsp;&nbsp;—</text>
		</view>

		<FeedbackPop :isPopupVisible="isPopupVisible" :contributor="contributor" @hidePopup="hidePopup"
			v-if="isPopupVisible">
		</FeedbackPop>
		<view class="function">
			<view class="">
				<view class="deadline">请在下方输入完整账号问题反馈信息：</view>
			</view>
			<view class="">
				<view class="deadline">1、人工智能与大数据学院学生账号需要在此页面提交信息后管理员统一注册、才可进行活动的报名! </view>
			</view>
			<view class="">
				<view class="deadline">2、自主注册不包含学号、班级等信息需要提交基本信息，由管理员统一更新账号基本信息，才可进行活动报名! </view>
			</view>
			<view class="">
				<view class="deadline">3、问题可包含重置密码、账号注册或其他类型问题! </view>
			</view>
		</view>

		<view class="content">
			<view class="cont">
				<text style=" color: red;margin-top: 25rpx;">&nbsp;*&nbsp;</text><text
					style="font-size: 30rpx; margin-top: 25rpx;">学院【大数据学院账号和学号请保持一致】</text> <br />
				<picker @change="onPickerChangefaculty" mode="selector" :range="facultyarray">
					<view class="box"
						style="font-size: 30rpx;color: gray; line-height: 90rpx; padding-left: 15rpx;margin-top: 20rpx;">
						{{inputfaculty}}
					</view>
				</picker>
				<text style="float: left; color: red;margin-top: 25rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx; margin-top: 25rpx;margin-bottom: 25rpx;">当前账号【未注册请填写学号】</text>
				<br />
				<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
					placeholder="请输入账号" v-model="inputUser" />
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
					placeholder="请输入学号" v-model="inputUser" :disabled="isdisabled" />


				<view class="" v-if="isdisabled" style="overflow: hidden;">
						<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
							style="float: left;font-size: 30rpx;margin-top: 20rpx; ">年级</text>
					
					<picker @change="ongradeChange" mode="selector" :range="gradearray">
						<view class="box"
							style="font-size: 30rpx;color: gray; line-height: 90rpx; padding-left: 15rpx">
							{{gradevalue}}
						</view>
					</picker>
					<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
						style="float: left;font-size: 30rpx; margin-top: 20rpx;">班级</text>
					<picker mode="selector" @change="onClassChange" :range="classarray">
						<view class="box"
							style="font-size: 30rpx;color: gray; line-height: 90rpx; padding-left: 15rpx;">
							{{inputclass}}
						</view>
					</picker>
					<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
						style="float: left;font-size: 30rpx; margin-top: 20rpx;">层次</text>

					<picker @change="onLevelChange" mode="selector" :range="levelsarray">
						<view class="box"
							style="font-size: 30rpx;color: gray; line-height: 90rpx; padding-left: 15rpx;">
							{{inputlevels}}
						</view>
					</picker>

				</view>
				<view class="" v-else>


					<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
						style="float: left;font-size: 30rpx;margin-top: 20rpx; ">年级</text>
					<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
						placeholder="请输入年级" v-model="gradevalue" />
					<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
						style="float: left;font-size: 30rpx;margin-top: 20rpx; ">班级</text>
					<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
						placeholder="请输入手机号码" v-model="inputclass" />
					<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
						style="float: left;font-size: 30rpx;margin-top: 20rpx; ">层次</text>
					<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
						placeholder="请输入手机号码" v-model="inputlevels" />
				</view>
				<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx;margin-top: 20rpx; ">手机号码</text>
				<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
					placeholder="请输入手机号码" v-model="inputphone" />
				<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx;margin-top: 20rpx; ">辅导员</text>
				<input class="box" type="text" style="font-size: 30rpx;padding-left: 15rpx; color: gray;"
					placeholder="请输入辅导员" v-model="inputteachar" />
				<text style="float: left; color: red;margin-top: 20rpx;">&nbsp;*&nbsp;</text><text
					style="float: left;font-size: 30rpx;margin-top: 20rpx; ">机构建设反馈</text>
				<textarea class="box2" type="text"
					style="font-size: 30rpx;padding-left: 15rpx; color: gray;padding-top:15rpx ;"
					placeholder="请输入对学生机构的内部建设有什么想法" v-model="inputquestion" />
				<button class="submit" @click="application">反馈提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import FeedbackPop from '../../components/FeedbackPop/FeedbackPop.vue'
	export default {
		data() {
			return {
				inputUser: '',
				inputname: '',
				inputnum: '',
				inputsex: '请选择',
				gradevalue: '',
				inputclass: '',
				inputlevels: '',
				inputphone: '',
				inputteachar: '',
				activityId: '',
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
				gradeClassArr: [],
				classarray: [],
				levelsarray: [],
				gradearray: [],
				inputfaculty: '',
				isdisabled: true,
				inputquestion: ''
			}
		},
		onLoad(option) {
			this.activityId = option.id
			this.startTime = option.startTime
			this.address = option.address
			this.description = option.description
			this.limitPerson = option.limitPerson === 'undefined' ? "暂无限制" : option.limitPerson + '人'
			this.title = option.title
			this.deadline = option.deadline
			this.inputUser = this.userInfo.user
			this.inputname = this.userInfo.name
			this.inputnum = this.userInfo.num
			this.inputsex = this.userInfo.sex || this.sexarray[0]
			this.gradevalue = this.userInfo.grade
			this.inputphone = this.userInfo.phone
			this.inputteachar = this.userInfo.counsellor
			this.inputclass = this.userInfo.class
			this.inputlevels = this.userInfo.levels
			this.inputfaculty = this.userInfo.faculty === '暂无' ? this.facultyarray[0] : this.userInfo.faculty || this
				.facultyarray[0]
			// 将这两个值作为属性添加到contributor对象中
			this.contributor.groupNum = option.groupNum;
			this.contributor.groupCode = option.groupCode;
			this.contributor.baseURL = uni.baseURL
		},
		mounted() {
			this.loadData()
			this.updateCountdown();
			this.countdownInterval = setInterval(this.updateCountdown, 1000);
		},
		computed: {
			...mapState(['userInfo'])

		},
		components: {
			FeedbackPop
		},
		watch: {
			gradevalue(newGrade) {
				this.loadClasses();
			}
		},
		methods: {
			async loadData() {
				uni.$http.get("/api/get/gradeClass").then((res) => {
					this.gradeClassArr = res.data;
					this.gradearray = res.data.map(item => item.grade);

					// 根据userInfo中的年级值找到对应数据对象
					const gradeData = res.data.find(item => item.grade === this.userInfo.grade);
					if (gradeData) {
						this.gradevalue = gradeData.grade;
						this.classarray = gradeData.classNames;
						this.levelsarray = gradeData.levels;

						// 初始化班级和层次选项
						this.inputclass = this.userInfo.class || gradeData.classNames[0];
						this.inputlevels = this.userInfo.levels || gradeData.levels[0];
					} else {
						// 如果未找到对应年级数据,使用默认值
						this.gradevalue = this.gradearray[0];
						this.loadClasses();
					}
				});
			},
			loadClasses() {
				const {
					classNames,
					levels
				} = this.getClassesAndLevelsByGrade(this.gradevalue);
				this.classarray = classNames;
				this.levelsarray = levels;
				this.inputclass = classNames[0] || '';
				this.inputlevels = levels[0] || '';
			},

			// 根据年级获取对应的班级和层次
			getClassesAndLevelsByGrade(grade) {
				const filteredData = this.gradeClassArr.find(item => item.grade === grade);
				return filteredData ? {
					classNames: filteredData.classNames,
					levels: filteredData.levels
				} : {
					classNames: [],
					levels: []
				};
			},
			ongradeChange(e) {
				this.gradevalue = this.gradearray[e.detail.value];
			},
			onClassChange(e) {

				this.inputclass = this.classarray[e.detail.value];
			},
			onLevelChange(e) {
				this.inputlevels = this.levelsarray[e.detail.value];
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
				if (
					!this.validateField(this.inputname, '姓名') ||
					!this.validateField(this.gradevalue, '年级') ||
					!this.validateField(this.inputclass, '班级') ||
					!this.validateField(this.inputteachar, '辅导员') ||
					!this.validateField(this.inputquestion, '反馈问题') ||
					!this.validateField(this.inputUser, '账号和学号') ||
					!this.validateField(this.inputphone, '手机号')
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

				} else if (!/^\d{8,15}$/.test(this.inputUser)) {
					return uni.showToast({
						title: '账号和学号输入有误',
						icon: 'none'
					});

				}

				uni.$http.post("/api/feedback/create", {
					account: this.inputUser,
					name: this.inputname,
					sex: this.inputsex,
					studentId: this.inputUser,
					grade: this.gradevalue,
					classes: this.inputclass,
					phoneNumber: this.inputphone,
					counsellor: this.inputteachar,
					level: this.inputlevels,
					faculty: this.inputfaculty,
					phone: this.inputphone,
					description: this.inputquestion

				}).then((res) => {
					console.log(res);
					if (res.statusCode === 201) {
						uni.showToast({
							duration: 3000,
							icon: "none",
							title: res.data.msg
						});
						this.isPopupVisible = true
					} else {
						return uni.showToast({
							duration: 3000,
							icon: "none",
							title: res.data.msg
						});
					}

				});

			},
			application() {
				uni.showModal({
					content: '您确定要提交当前反馈信息',
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
				title: '芯系小助手账号问题反馈',
				path: '/subpkg-common/feedback/feedback'
			}
		},

		onShareTimeline() { // 分享到朋友圈
			return {
				title: '芯系小助手账号问题反馈',
				path: 'subpkg-common/feedback/feedback'
			}
		},
	}
</script>

<style lang="scss">
	.container {
		height: 1700rpx;
		width: 100%;

		.function {

			padding: 0 50rpx 50rpx 50rpx;
			background-color: #fff;

			.deadline {

				background-color: #fff;
				font-size: 30rpx;
				margin-top: 10rpx;
				padding-top: 20rpx;
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

				.box2 {
					margin-top: 83rpx;
					height: 150rpx;
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
					border-radius: 10rpx;
				}
			}
		}
	}
</style>