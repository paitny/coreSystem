<template>
	<view class="semesters">
		<picker mode="selector" :range="semesters" @change="onSemesterChange">
			<text> {{"《"+ selectedSemester+"》" }}</text>
		</picker>
	</view>
	<view class="Data">


		<view class="noData" v-if="activeData.length===0">
			<image src="../../static/orderImgs/noData.png" mode=""></image>
		</view>
		<loading v-if="isloading"></loading>
		<view v-for="item in activeData" :key="item._id" class="container">
			<view class="content">
				<image class="img" :src='`${baseURL}${item.photo}`' alt="" @click.stop="clickImg(item.photo)">
				</image>
				<view class="info">
					<text class="title">周次：第 {{item.week}} 周</text><br>
					<text class="title">节次：{{item.rawSection}}</text><br>
					<text class="title">课程：{{item.courseName}}</text><br>
					<br>
					<text class="title">时间：{{parseDateStringAndFormat(item.date)}}</text><br>
					<text class="title">状态：{{item.status==="absent"?"缺席":"请假"}}</text><br>
				</view>
			</view>
		</view>
	</view>

	<coursepop :isPopupVisible="isPopupVisible" :missingHours="missingHours" @hidePopup="hidePopup" />
</template>

<script>
	import coursepop from '../../components/coursepop/coursepop.vue';
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			coursepop
		},
		data() {
			return {
				baseURL:'',
				isloading: true,
				semesters: [],
				selectedSemester: this.getCurrentSemester(),
				isPopupVisible: false, // 控制弹窗是否显示，初始为不显示
				missingHours: 0, // 缺课学时，您可以根据实际情况设置这个值
				activeData: []
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			this.baseURL=uni.baseURL
			this.getSemster()
			this.getStudent()
			
		},
		methods: {
			checkCourseTime(){
				if(this.missingHours>=11){
					this.hidePopup()
				}
			},
			getSemster() {
				uni.$http.get("/api/get/semesters").then((res) => {

					res.data.data.forEach(item => {
						this.semesters.push(item.name);
					});
				});
			},
			onSemesterChange(event) {
				const index = event.detail.value;
				this.selectedSemester = this.semesters[index];
				this.getStudent(); // 调用重新获取数据的方法
			},
			// 获取当前学期
			getCurrentSemester() {
				const currentDate = new Date();
				const currentYear = currentDate.getFullYear();
				const currentMonth = currentDate.getMonth() + 1; // 月份从0开始，所以要加1
			
				let semester;
				let academicYear;
			
				if (currentMonth >= 9 && currentMonth <= 12) {
					// 9月到12月属于第一学期，学年度为当年到下一年
					semester = '第一学期';
					academicYear = `${currentYear}-${currentYear + 1}学年度`;
				} else if (currentMonth >= 1 && currentMonth <= 2) {
					// 1月到2月属于第一学期，学年度为上一年到当年
					semester = '第一学期';
					academicYear = `${currentYear - 1}-${currentYear}学年度`;
				} else if (currentMonth >= 3 && currentMonth <= 6) {
					// 3月到6月属于第二学期，学年度为上一年到当年
					semester = '第二学期';
					academicYear = `${currentYear - 1}-${currentYear}学年度`;
				} else {
					// 7月和8月通常是暑假
					semester = '暑假';
					academicYear = `${currentYear - 1}-${currentYear}学年度`;
				}
			
				// 返回学年度和学期信息
				return `${academicYear}${semester}`;
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
			// 例如，在某个条件满足时显示弹窗并设置缺课学时
			showPopupWithHours(hours) {
				this.isPopupVisible = true;
				this.missingHours = hours;
			},
			getStudent() {
				uni.$http.get("/api/get/studentCourseAbsence", {
					userId: this.userInfo._id,
					grade: this.userInfo.grade,
					class: this.userInfo.class,
					level: this.userInfo.levels,
					termName: this.selectedSemester
				}).then((res) => {
					this.activeData = res.data.absences
					console.log(res.data);
					this.isloading = false
					this.missingHours = res.data.totalAbsentHours
					this.checkCourseTime()
				})
			},

			hidePopup() {

				this.isPopupVisible = !this.isPopupVisible
			},
		}
	}
</script>
<style lang="scss">
	.semesters {
		width: 100%;
		position: fixed;
		z-index: 999;
		top: 0;
		left: 0;
		margin: 0 auto;
		text-align: center;
		width: 95%;
		background-color: #fff;
		padding: 20rpx;


		text {
			font-size: 32rpx;
			color: #4d6398;
		}
	}

	.Data {
		margin-top: 90rpx;
	}

	.noData {
		image {
			position: absolute;
			width: 200rpx;
			height: 200rpx;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}

	}

	.container {

		display: flex;
		flex-direction: column;
		width: 95%;
		margin: 20rpx auto;
		background-color: white;
		border-radius: 20rpx;
		padding: 10rpx;


		.content {
			display: flex;
			align-items: center;


			.img {
				height: 180rpx;
				width: 180rpx;

				margin-left: 33rpx;
				border-radius: 5rpx;
			}

			.info {
				margin-left: 20rpx;

				.title {
					font-size: 25rpx;
				}
			}
		}

		.option {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.option-count {
				font-size: 24rpx;
				display: flex;
				align-items: center;
				width: 220rpx;
				margin-left: 33rpx;
				justify-content: space-between;

				.count {
					display: flex;
					align-items: center;
				}
			}

			.option-button {
				display: flex;
			}

			/* 垂直居中 */
			.del {
				background-color: red;
				color: aliceblue;
				font-size: 20rpx;
				margin: 10rpx;

			}

			.update {
				color: aliceblue;
				background-color: #4d6398;
				font-size: 20rpx;
				margin: 10rpx;
			}

			.download {
				color: aliceblue;
				background-color: #207144;
				font-size: 20rpx;
				margin: 10rpx;
			}
		}
	}

	:deep(.uni-swipe_box) {
		flex-direction: column;
	}
</style>