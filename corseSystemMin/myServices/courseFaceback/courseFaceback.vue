<template>
	<view class="semesters">
		<picker mode="selector" :range="semesters" @change="onSemesterChange">
			<text> {{"《"+ selectedSemester+"》" }}</text>

		</picker>
		<view>
			<picker mode="selector" :range="weeks" :value="selectedWeek" @change="onWeekChange">
				<view class="picker">
					<text> 第 {{weeks[selectedWeek]}} 周</text>
				</view>
			</picker>
		</view>
		
	</view>



	<view class="noData" v-if="activeData.length===0">
		<image src="../../static/orderImgs/noData.png" mode=""></image>
	</view>

	<loading v-if="isloading"></loading>

	<view class="activeData" v-else>
		<view v-for="(item,index) in activeData" :key="item._id" class="container"
			v-if="userInfo.admin||userInfo.position.includes('学习部')">
			<uni-swipe-action-item :right-options="options"
				@click="onClick($event, item._id, item.course,item.grade,item.class,item.level,item.photo,item.results,item.weekday,index,item.isProvide)"
				@change="change($event,item.audit)" :key="item._id">
				<view class="content" @click="application(item.results)">
					<image class="img"  :src='`${baseURL}${item.photo[0]}`' alt="" @click.stop="clickImg(0,item.photo)">
					</image>
					<view class="info">
						<text class="title">时间：第{{item.week}}周 {{weekMap[item.weekday]}}
							{{formatDateString(item.createdAt)}}</text><br>
						<text class="title">班级：{{item.grade+item.class+item.level}}</text>

						<br>

						<text class="title">课程：{{item.course.name}}</text><br>
						<text class="title">导员：{{item.counsellor}}</text><br>
						<text class="title">查课人：{{item.checker}}</text><br>
						<text class="title">应到：{{item.shouldAttend}}</text>&nbsp;&nbsp;&nbsp;&nbsp;
						<text class="title">实到：{{item.actualAttend}}</text><br>
						<text class="title">请假：{{item.leave}}</text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<text class="title">缺席：{{item.absent}}</text><br>

					</view>
				</view>
				<view class="option">
					<view class="option-count">
						<view class="count">
							<uni-icons type="person-filled"
								size="20"></uni-icons><text>&nbsp;{{item.shouldAttend}}</text>
						</view>
						<view class="count">
							<uni-icons type="flag-filled" size="20"></uni-icons><text>&nbsp;{{item.actualAttend}}</text>
						</view>
						<view class="count">
							<uni-icons type="flag" size="20"></uni-icons><text>&nbsp;{{item.leave+item.absent}}</text>
						</view>
					</view>
					<view class="option-button">

						<button
							@click="downloadAndWriteToFile(item.week,item.weekday,item.course.name,item.course.rawSection,item.results)"
							class="download">xlsx</button>
						<button
							@click="toVisualizing(item.shouldAttend,item.actualAttend,item.leave,item.absent,item.week,item.weekday,item.course.name,item.course.rawSection,item.results,item.grade,item.class,item.level)"
							class="Visualizing">可视化</button>
					</view>
				</view>
			</uni-swipe-action-item>
		</view>
		<view v-for="(item,index) in activeData" :key="item._id" class="container" v-else>

			<view class="content" @click="application(item.results)">
				<image class="img" :src='`${baseURL}${item.photo[0]}`' alt="" @click.stop="clickImg(0,item.photo)">
				</image>
				<view class="info">
					<text class="title">时间：第{{item.week}}周 {{weekMap[item.weekday]}}
						{{formatDateString(item.createdAt)}}</text><br>
					<text class="title">班级：{{item.grade+item.class+item.level}}</text>

					<br>

					<text class="title">课程：{{item.course.name}}</text><br>
					<text class="title">导员：{{item.counsellor}}</text><br>
					<text class="title">应到：{{item.shouldAttend}}</text>&nbsp;&nbsp;&nbsp;&nbsp;
					<text class="title">实到：{{item.actualAttend}}</text><br>
					<text class="title">请假：{{item.leave}}</text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<text class="title">缺席：{{item.absent}}</text><br>

				</view>
			</view>
			<view class="option">
				<view class="option-count">
					<view class="count">
						<uni-icons type="person-filled" size="20"></uni-icons><text>&nbsp;{{item.shouldAttend}}</text>
					</view>
					<view class="count">
						<uni-icons type="flag-filled" size="20"></uni-icons><text>&nbsp;{{item.actualAttend}}</text>
					</view>
					<view class="count">
						<uni-icons type="flag" size="20"></uni-icons><text>&nbsp;{{item.leave+item.absent}}</text>
					</view>
				</view>
				<view class="option-button">

					<button
						@click="downloadAndWriteToFile(item.week,item.weekday,item.course.name,item.course.rawSection,item.results)"
						class="download">xlsx</button>
					<button
						@click="toVisualizing(item.shouldAttend,item.actualAttend,item.leave,item.absent,item.week,item.weekday,item.course.name,item.course.rawSection,item.results,item.grade,item.class,item.level)"
						class="Visualizing">可视化</button>
				</view>
			</view>

		</view>

		<view v-if="loading" class="loading-text">加载中...</view>
		<view v-if="activeData.length>0&& activeData.length===total" class="loading-text">
			本周就这些查课反馈噢，共{{total}}条数据</view>
			
			<view class="floating-button" @click="toCheckCourseCount">
				统计
			</view>
	</view>
</template>

<script>
	import loading from '../../components/loading/loading.vue'
	import {
		getCurrentSemester
	} from '@/Utils/semesterUtils.js';
	import {
		exportCheckCourseToExcel
	} from "../common/xlsx.js";
	import {
		mapState
	} from 'vuex'
	import {
		getNowWeek
	} from '../../Utils/getNowWeek.js'
	export default {
		data() {

			return {
				weekMap: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
				options: [{
						text: '修改',
						style: {
							backgroundColor: '#4d6398'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				semesters: [],
				activeData: [],
				filteredActiveData: [],
				baseURL: "",
				userId: "",
				selectedSemester: getCurrentSemester(),
				isloading: true,
				loading: false,
				page: 1,
				total: 0,
				searchKeyword: '',
				weeks: Array.from({
					length: 20
				}, (v, k) => k + 1),
				selectedWeek: 0,
				startDate: '2024/9/2', // 开学日期
				totalWeek: 25, // 周总数
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		components: {
			loading
		},
		methods: {

			getNowWeek() {
				const nowWeek = getNowWeek(this.startDate, this.totalWeek)
				this.selectedWeek = nowWeek - 1


			},

			onWeekChange(event) {
				this.selectedWeek = event.detail.value;
				this.page=1
				this.activeData=[]
				this.getActiveData()
			},
			formatDateString(dateString) {
				const date = new Date(dateString);

				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1
				const day = String(date.getDate()).padStart(2, '0'); // 确保日是两位数
				const hours = String(date.getHours()).padStart(2, '0'); // 确保小时是两位数
				const minutes = String(date.getMinutes()).padStart(2, '0'); // 确保分钟是两位数

				return `${year}-${month}-${day} ${hours}:${minutes}`;
			},
			toVisualizing(shouldAttend, actualAttend, leave, absent, week, weekday, name, rawSection, results, geade,
				className, level) {
				uni.navigateTo({
					url: "../../subpkg-visualization/ClassVisualization/ClassVisualization?shouldAttend=" +
						shouldAttend +
						"&actualAttend=" + actualAttend + "&leave=" + leave + "&absent=" + absent +
						"&title=" + name + "&time=" + "第" + week + "周" + ' ' + this.weekMap[weekday] + ' ' +
						rawSection +
						"&results=" + JSON.stringify(results) + "&className=" + geade + className + level
				})
			},
			clickImg(index, imageUrls) {
				const urls = []
				for (const name of imageUrls) {
					console.log(name);
					urls.push(this.baseURL + name);
				}
			
				uni.previewImage({
					urls: urls, // 图片的URL数组
					current: index // 当前显示图片的索引
				});
			},
			onSemesterChange(event) {
				const index = event.detail.value;
				this.selectedSemester = this.semesters[index];
				this.page = 1
				this.activeData = []
				this.isloading = true
				this.getActiveData();
			},
			getSemster() {
				uni.$http.get("/api/get/semesters").then((res) => {
					res.data.data.forEach(item => {
						this.semesters.push(item.name);
					});
				});
			},
			onClick(e, id, course, grade, className, level, cover, results, weekday, index,isProvide) {
				let {
					content
				} = e;
				if (content.text === '删除') {
					this.deleteItem(id, course, grade, className, level, cover, index)
				} else if (content.text === '修改') {
					this.updateActivity(course, grade, className, level, results, cover, weekday,isProvide)
				}
			},
			swipeChange(e) {
				// 组件打开或关闭时触发
			},
			process(id, audit, title, index) {
				uni.showModal({
					content: '您确定要驳回' + title + "活动?",
					success: (e) => {
						if (e.confirm) {
							uni.$http.post("/api/itVolunteer/update-audit", {
								id: id,
								audit: !audit
							}).then((res) => {
								uni.showToast({
									icon: "none",
									title: res.data.message
								})
								this.activeData.splice(index, 1)
								this.lazyLoading()
							});
						}
					}
				});
			},
			change(e, audit) {
				// 处理变更
			},
			parseDateStringAndFormat(dateString) {
				const date = new Date(dateString);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				const seconds = String(date.getSeconds()).padStart(2, '0');

				return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
			},
			updateActivity(course, grade, className, level, results, photo, weekday,isProvide) {
				const serializedCourse = JSON.stringify(course);
				const result = JSON.stringify(results);
				uni.navigateTo({
					url: `/subpkg-common/attendanceCourse/attendanceCourse?grade=${grade}&class=${className}&level=${level}&course=${encodeURIComponent(serializedCourse)}&week=${this.weeks[this.selectedWeek]}&weekday=${weekday}&results=${result}&photo=${JSON.stringify(photo)}&isProvide=${JSON.stringify(isProvide)}`
				});
			},
			deleteItem(id, course, grade, className, level, cover, index) {
				uni.showModal({
					content: '您确定要删除' + grade + className + level + '的' + course.name + '查课数据' + "?",
					success: (e) => {
						if (e.confirm) {
							uni.$http.post("/api/aiCourse/deleteCourseFeedback", {
								id: id,
								photo: cover,
							}).then((res) => {
								this.activeData.splice(index, 1);
								this.lazyLoading()
								uni.showToast({
									icon: "none",
									title: res.data.msg
								})
							});
						}
					}
				});
			},
			downloadAndWriteToFile(week, weekday, name, rawSection, results) {
				const coursetitle = name + "第" + week + "周" + this.weekMap[weekday] + rawSection
				exportCheckCourseToExcel(results, coursetitle)
			},
			getActiveData() {
				this.loading = true
				uni.$http.get("/api/get/getClassInfo", {
					termName: this.selectedSemester,
					page: this.page,
					userId: this.userInfo._id,
					week: parseInt(this.selectedWeek) + 1
				}).then((res) => {
					if (res.statusCode === 404) {
						this.activeData = []
						this.loading = false
						this.isloading = false
					} else if (res.errMsg == "request:ok") {
						this.total = res.data.total
						setTimeout(() => {
							this.loading = false
							this.isloading = false
							
							this.activeData = this.activeData.map(item => {
								const newItem = res.data.data.find(t => t._id === item._id);
								return newItem ? {
									...item,
									...newItem
								} : item;
							}).concat(
								res.data.data.filter(newItem => !this.activeData.some(item => item
									._id === newItem._id))
							);
							
						}, 1000)
					}
				}).catch(error => {
					if (error) {
						this.isloading = true
					}
				});
			},
			application(userData) {
				uni.navigateTo({
					url: `../../subpkg-visualization/checkCourseData/checkCourseData?results=${JSON.stringify(userData)}`
				})
			},
			toCheckCourseCount(){
				uni.navigateTo({
					url: `../../subpkg-visualization/checkCourseCount/checkCourseCount?week=${this.weeks[this.selectedWeek]}`
				})
			},
			lazyLoading() {
				this.page = this.page
				this.getActiveData()
			},
		},

		onLoad(options) {
			this.isSign = options.sign
			this.baseURL = uni.baseURL
			this.getNowWeek()
			this.getSemster()
			this.lazyLoading()
		},
		onReachBottom() {
			if (this.activeData.length < this.total) {
				this.page++
				this.loading = true
				this.getActiveData()
			} else {
				uni.showToast({
					title: "我是有底线的噢",
					icon: "none",
					duration: 1800
				})
			}
		},
		onPullDownRefresh() {
			this.lazyLoading()
			uni.showToast({
				title: "刷新成功",
				icon: 'success',
				duration: 800
			})
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		}
	}
</script>

<style lang="scss">
	/* 浮窗样式 */
	.floating-button {
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: 60px;
		height: 60px;
		background-color: #42b983;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		z-index: 1000;
	}
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
		display: flex;
		justify-content: space-around;
		align-items: center;

		text {
			font-size: 32rpx;
			color: #4d6398;
		}
	}

	.search-box {
		display: flex;
		padding: 10rpx;
		background-color: #fff;


		z-index: 999;

		input {
			flex: 1;
			height: 60rpx;
			border: 1px solid #ccc;
			border-radius: 30rpx;
			padding: 0 20rpx;
			margin-right: 10rpx;
		}

		button {
			width: 120rpx;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 28rpx;
			color: #fff;
			background-color: #4d6398;
			border-radius: 30rpx;
		}
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

	.activeData {
		margin-top: 100rpx;
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
				height: 150rpx;
				width: 150rpx;
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

			.reject {
				color: aliceblue;
				background-color: #fcc62a;
				font-size: 20rpx;
				margin: 10rpx;
			}

			.download {
				color: aliceblue;
				background-color: #207144;
				font-size: 20rpx;
				margin: 10rpx;
			}

			.Visualizing {
				color: aliceblue;
				background-color: #7b83eb;
				font-size: 20rpx;
				margin: 10rpx;
			}
		}
	}

	//qq小程序兼容
	:deep(.uni-swipe_box) {
		flex-direction: column;
	}

	.loading-text {
		text-align: center;
		padding: 20rpx 0;
	}
</style>