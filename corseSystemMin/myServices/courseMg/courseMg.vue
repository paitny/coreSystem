<template>

	<view class="courseMg">

		<view>
			<view class="semester">《 {{termName}} 》</view>
			<view class="noData" v-if="courseList.length===0">
				<image src="../../static/orderImgs/noData.png" mode="" @click="getcourseListData()"></image>
			</view>

		</view>
		<loading v-if="isloading"></loading>
		<view class="course" v-for="(item,index) in courseList" :key="index" @click="goUpdateCourse(item,index)" v-else>
			<view class="">
				<view class="course-week">周{{convertToChineseNumber(item.week)}}</view>
				<view class="">{{item.name}}</view>
				<view class="course-title">
					<view>{{item.rawSection}}</view>
					<view class="">{{item.rawWeeks}}</view>

				</view>
				<view class="">{{item.address}}</view>
			</view>

			<view class="course-delete" @click.stop>
				<image src="../../static/orderImgs/applicationDelete.png" mode="" @click="toDelete(index)"></image>
			</view>

		</view>

		<view class="bigDelete" @click="DeleteTerm" v-if="courseList.length>0">
			<image src="../../static/orderImgs/applicationDelete.png" mode=""></image>
		</view>
	</view>

</template>

<script>
	import loading from '../../components/loading/loading.vue'
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				termName: "",
				nowTermName: "",
				courseList: [],
				isloading: true
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			this.getCurrentSemester()
			this.getcourseListData()
		},
		components: {
			loading
		},
		methods: {
			//获取课程数据
			getcourseListData() {
				this.isloading = true
				uni.$http.get("/api/get/course", {
					userId: this.userInfo._id,
					termName: this.termName
				}).then((res) => {

					if (res.statusCode === 404) {
						setTimeout(() => {
							this.isloading = false
						}, 100)
						return uni.showModal({
							content: '暂无数据，是否需要去添加！',
							success: (e) => {
								if (e.confirm) {
									uni.navigateTo({
										url: "/myServices/courseImport/courseImport"
									})
								}
							}
						});


					} else {
						if (res.errMsg == "request:ok") {
							this.courseList = []
							this.courseList = res.data.data.result.coursesList
							this.nowTermName = res.data.data.result.termName
							setTimeout(() => {
								this.isloading = false
							}, 100)
						}

					}


				}).catch(error => {

					if (error) {
						this.isloading = true
					}
				});
			},
			deleteCourse(index) {
				uni.$http.post("/api/course/deleteCourse", {
					userId: this.userInfo._id,
					termName: this.nowTermName,
					index: index
				}).then((res) => {
					uni.showToast({
						title: res.data.message,
						icon: "none",
						duration: 1800
					});
				});
			},

			toDelete(index) {
				if (this.courseList.length === 1) {
					this.DeleteTerm()
				} else {
					uni.showModal({
						content: '确定要删除此课程嘛！',
						success: (e) => {
							if (e.confirm) {
								this.deleteCourse(index)
								this.courseList.splice(index, 1);
							}
						}
					});
				}

			},
			goUpdateCourse(item, index) {
				uni.navigateTo({
					url: `../../subpkg-common/updateCourse/updateCourse?nowTermName=${this.nowTermName}&index=${index}`
				})
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
					semester = '暑假/寒假';
					academicYear = `${currentYear - 1}-${currentYear}学年度`;
				}
			
				// 返回学年度和学期信息
				this.termName= `${academicYear}${semester}`;
			},
			convertToChineseNumber(num) {
				const chineseNumbers = ['一', '二', '三', '四', '五', '六', '日'];

				if (num >= 1 && num <= 7) {
					return chineseNumbers[num - 1];
				} else {
					return '未知';
				}
			},
			DeleteTerm() {
				uni.showModal({
					content: `您确定要删除${this.termName}的课程嘛！`,
					success: (e) => {
						if (e.confirm) {
							uni.$http.post("/api/course/termDelete", {
								userId: this.userInfo._id,
								termName: this.termName
							}).then((res) => {

								uni.showToast({
									icon: "none",
									title: res.data.message,
									duration: 1500
								})
							})
							this.courseList = []
						}
					}
				});

			}

		},
		onPullDownRefresh() {
			this.getcourseListData()
			uni.showToast({
				title: "刷新成功",
				icon: 'success',
				duration: 800
			})
			setTimeout(function() {

				uni.stopPullDownRefresh(); //停止页面加载动画
			}, 500);
		},
	}
</script>

<style lang="scss">
	.courseMg {
		background-color: #fff;
		height: 100vh;
		position: relative;
		margin-top: 130rpx;

		.semester {
			width: 100%;
			position: fixed;
			z-index: 999;
			top: 0;
			left: 0;
			height: 120rpx;
			line-height: 120rpx;
			text-align: center;
			background-color: #fff;
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

		.course {
			background-color: #fff;
			display: flex;
			align-items: center;
			justify-content: space-between;

			padding: 30rpx;

			.course-title {
				display: flex;


			}

			.course-week {
				font-size: 45rpx;
				font-weight: bold;
			}

			.course-delete {
				image {
					width: 45rpx;
					height: 48rpx;
				}

			}

		}

		.bigDelete {
			width: 100rpx;
			height: 100rpx;
			background-color: #AAAAAA;
			border-radius: 50%;
			display: flex;
			align-items: center;
			padding: 50rpx;
			margin: 0 auto;

			image {
				width: 55rpx;
				height: 60rpx;
				margin: 0 auto;
			}
		}
	}
</style>