<template>

	<view>

		<view class="navBarBox">
			<!-- 状态栏占位 -->
			<view class="statusBar" :style="{ height: statusBarHeight + 'px' }"></view>
			<!-- 真正的导航栏内容 -->
			<view class="navBar" :style="{ top: statusBarHeight + 'px',height: statusBarHeight + 'px' }">
				<view @click="update">
					<image class="logo icon" src="../../static/orderImgs/Refresh.png" :class="{ 'rotate': isRotated }">
					</image>
				</view>

				<view class="nav-week" @click="showPopup">第{{nowWeek}}周 <image
						src="../../static/orderImgs/drop-down.png" mode=""></image>
				</view>
				<view class=""></view>
			</view>
		</view>
		<view class="container" :style="{ marginTop: statusBarHeight*2 + 'px' }">
			<view class="week-list">
				<view class="now-month">
					<text>{{nowMonth < 10 ? '0' + nowMonth : nowMonth}}</text>
					<text>月</text>
				</view>
				<view class="week-item" v-for="(item,index) in weekIndexText" :key="index"
					:class="{ 'active': (nowMonth&&todayMonth == todayMonth && todayDay == weekCalendar[index]) && item==todayWeek }">
					<text class="week-name">周{{item}}</text>
					<text class="week-date">{{ formatDate(weekCalendar[index], nowMonth,item) }}</text>
				</view>
			</view>



			<view class="course-content">
				<view class="course-nums">
					<view class="course-num" v-for="(item ,index) in 12" :key='index'>
						<view class="">{{index + 1 > 9 ? index + 1 : '0' + (index + 1)}}</view>

						<view class="time">{{time[index]}}</view>
					</view>

				</view>
				<view class="watermark">{{waterText}}</view>
				<swiper :current="nowWeek-1" class="course-swiper" :duration="300" @change="swiperChange"
					circular="true">

					<swiper-item v-for="(itemWeek,weekIndex) in totalWeek" :key="weekIndex">

						<view class="course-list" style="margin-top: 10rpx;">
							<view class="empty-data" v-if="courseList.length===0">
								<image src="../../static/orderImgs/empty.png" mode="aspectFit" class="empty-image"
									@click="checkLogin(1)" />
							</view>
							<courseSkeleton v-if="loading"></courseSkeleton>

							<view class="" v-for="(item,index) in courseList" :key="index" @click="navCourse(index)"
								v-else>


								<view class="course-item" :style="{
				    'background-color':courseColor[item.name],
				    'height':item.sectionCount>3? (item.sectionCount * 140+20) + 'rpx':(item.sectionCount * 140) + 'rpx',
				    'top': ((item.section - 1) * 150) + 'rpx',
				    'left': calculateLeft(item.week) + 'rpx'
				  }" v-if="indexOf(item.weeks,weekIndex+1)">
									<view class="course-item__content">
										{{item.name}}@{{item.address?item.address:"未知"}}
									</view>
								</view>

							</view>
						</view>


					</swiper-item>
				</swiper>

			</view>


		</view>


		<!-- 自定义底部弹窗 -->
		<view class="popup-mask" v-show="showSwitchWeek" @click="hidePopup">
			<view class="popup-container" @click.stop>
				<!-- 创建18个按钮 -->
				<view class="button-container">
					<view v-for="(num,index) in 20" :key="num" @click="handleButtonClick(num)" class="btn"
						:class="{'active': nowWeek === index+1}">
						{{ num }}
					</view>
				</view>

				<!-- 关闭按钮 -->
				<view class="close-button" @click="hidePopup">
					关闭
				</view>
			</view>
		</view>


		<!-- Picker 选择器 -->



		<view class="floating-button" @click="getcounsellorclass" v-if="userInfo.class==='辅导员'||userInfo.admin===true">
			班级
		</view>


		<classPop :show="showDialog" @close="closeDialog" :dataList="classList" @item-selected="handleItemSelected"></classPop>
	</view>

</template>

<script>
	import classPop from '../../components/classPop/classPop.vue'; // 引入自定义的弹窗组件
	import {
		Utils
	} from '../../Utils/Utils.js'
	import {
		getNowWeek
	} from '../../Utils/getNowWeek.js'
	import {
		mapState
	} from 'vuex';
	import {
		getCurrentSemester
	} from '../../Utils/semesterUtils.js'
	import courseSkeleton from '../../components/courseSkeleton/courseSkeleton.vue'
	export default {
		data() {
			return {
				showDialog: false,
				classList: [], // 班级信息数组
				selectedClass: '', // 记录用户选择的班级
				classPopShow: false,
				termName: "", //当前学年
				isRotated: false,
				todayMonth: 0,
				todayDay: 0,
				todayWeek: 0,
				courseCachekey: "course",
				courseColorCachekey: "courseColor",
				// 状态栏高度
				statusBarHeight: 0,
				// 导航栏高度
				navBarHeight: 82 + 11,
				nowWeek: 1, // 当前周
				totalWeek: 25, // 周总数
				showSwitchWeek: false, // 显示选择周数弹窗
				weekDayCount: 7,
				startDate: '2024/9/2', // 开学日期
				weekIndexText: ['一', '二', '三', '四', '五', '六', '日'],
				nowMonth: 1, // 当前周的月份
				colorList: [
					"#BEADFA",
					"#D0BFFF",
					"#DFCCFB",
					"#8E8FFA",
					"#FFCB42",
					"#F875AA",
					"#D8B4F8",
					"#7743DB",
					"#D0A2F7",
					"#64CCC5",
					"#39A7FF",
					"#39A7FF",
					"#86469C",
					"#BC7FCD",
					"#FB9AD1",
					"#FFCDEA",
					"#8B93FF",
					"#5755FE",
					"#FF71CD",
					"#41C9E2"
				],
				courseColor: {},
				weekCalendar: [1, 2, 3, 4, 5, 6, 7],
				firstEntry: true,
				courseList: [], // Initialize with your data
				time: ["8:30~9:15", "9:20~10:05", "10:20~11:05", "11:10~11:55", "13:40~14:25", "14:30~15:15",
					"15:30~16:15", "16:20~17:05", "18:40~19:25", "19:30~20:15"
				],
				loading: true,
				shareUserId: '',
				windowWidth: 0,
				userId: '',
				platform: '',
				waterText: ''
			};
		},
		
		components: {
			courseSkeleton,classPop
		},
		created() {
			this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];
			// 获取系统信息
			uni.getSystemInfo({
				success: (res) => {
					this.windowWidth = res.windowWidth;
					this.platform = res.platform; // 获取平台信息

				}
			});
			

		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad(options) {
			this.termName = getCurrentSemester()
			this.shareUserId = options.id
			this.userId = this.shareUserId || uni.getStorageSync('userInfo')._id
			this.getTodayDate()
			this.getWeekDates()
			this.getNowWeek();
			this.update()
			this.getCourse()
			this.waterText = '芯系小助手'
			// this.goOthterProgram()

		},

		methods: {
			handleItemSelected(item) {
			      console.log('Selected item:', item);
				  this.onClassSelect(item)
				  this.closeDialog()
			      // Handle the selected item (e.g., update some state)
			    },
			// 关闭弹窗的方法
			closeDialog() {
				this.showDialog = false; // 设置 showDialog 为 false 关闭弹窗
			},
			onClassSelect(gradeClassName) {

				
				const gradeMatch = gradeClassName.match(/^(\d+级)/);
				const classMatch = gradeClassName.match(/(\D+?\d+班)/);
				const levelMatch = gradeClassName.match(/\(([^)]+)\)/);

				// 分别赋值给变量
				const grade = gradeMatch ? gradeMatch[0] : '';
				const className = classMatch ? gradeClassName.split(grade)[1].split('(')[0] : '';
				const level = levelMatch ? levelMatch[1] : '';
				this.waterText = grade + className + level
				this.getCourseClass(grade, className, level)
				
			},
			getCourseClass(grade, className, level) {
				uni.$http.get("/api/get/alternative", {
					grade: grade,
					className: className,
					level: level,
					termName: this.termName
				}).then((res) => {

					if (res.errMsg == "request:ok") {
						this.courseList = res.data.data.result.coursesList
						this.startDate = ''
						this.startDate = res.data.data.startTime
						this.buildCourseColor()
						if (!this.firstEntry) {
							uni.showToast({
								icon: "success",
								title: "更新成功"
							})
						}
						setTimeout(() => {
							this.loading = false
						}, 1000)

						this.getTodayDate()
						uni.setStorageSync(this.courseCachekey, res.data.data)
						
					}



				})

			},
			getcounsellorclass() {
				if (this.userInfo.class === "辅导员") {
					uni.$http.get("/api/aiCourse/search-by-counsellor", {
						counsellor: this.userInfo.name
					}).then((res) => {
						this.classList = res.data.classList
						this.showDialog=true
						

					})
				} else {
					uni.$http.get("/api/aiCourse/search-by-class", {
						counsellor: this.userInfo.name
					}).then((res) => {
						this.classList = res.data.classList
						this.showDialog=true
						
					})
				}

			},



			goOthterProgram() {
				uni.showModal({
					content: '数智课程表小程序正式上线啦，你是否要去体验呢！',
					success: (e) => {
						if (e.confirm) {
							this.skip()
						}
					}
				});
			},
			skip() {
				uni.navigateToMiniProgram({
					// appid  写你要跳转的小程序的 appid
					appId: 'wxef891dcddac6ee45',
					// 路径写  src下的路径,假如你跳转的是pages下的页面,就可以写pages/index
					path: 'pages/index/index',
					extraData: {
						// 'type': 'out'
					},
					// 这个不写的话会显示开发环境,不能正常跳转,写上就能正常跳转了
					envVersion: 'develop',
					success(res) {
						// 打开成功
						uni.showToast({
							title: '跳转成功'
						})
					},
					fail(err) {
						// 打开失败/取消
						uni.showToast({
							title: '跳转失败',
							icon: 'error'
						})
					}
				})
			},
			calculateLeft(week) {
				let leftpx;

				if ((this.platform === 'iPad' || this.platform === 'devtools') && this.windowWidth >= 1024) {
					leftpx = (week - 1) * ((this.windowWidth - 130) / 7);
				} else if ((this.platform === 'iPad' || this.platform === 'devtools') && this.windowWidth >= 768) {
					leftpx = (week - 1) * ((this.windowWidth - 100) / 7);
				} else if ((this.platform === 'ios' || this.platform === 'devtools') && this.windowWidth >= 393 && this
					.windowWidth < 430) {
					leftpx = (week - 1) * ((this.windowWidth - 50) / 7);
				} else if ((this.platform === 'ios' || this.platform === 'devtools') && this.windowWidth <= 320) {
					leftpx = (week - 1) * ((this.windowWidth - 40) / 7);
				} else if (this.platform === 'ios' || this.platform === 'devtools') {
					leftpx = (week - 1) * ((this.windowWidth - 57) / 7);
				} else if (this.windowWidth >= 540 || (this.platform === 'devtools' && this.windowWidth >= 540)) {
					leftpx = (week - 1) * ((this.windowWidth - 67) / 7);
				} else {
					leftpx = (week - 1) * ((this.windowWidth - 45) / 7);
				}
				const leftRPx = leftpx * (750 / this.windowWidth);
				return leftRPx;
			},




			isAdd() {
				//加载插屏广告
				if (this.userInfo.adminPlus && this.userInfo.admin) {

					return;
				} else {
					Utils.interstitial.load('adunit-2790969bd4775c12')
					Utils.interstitial.show()
				}
			},
			//检测是否登录
			checkLogin(type) {
				uni.$http.post('/api/login/min/check', {
						id: uni.getStorageSync('userInfo')._id
					})
					.then((res) => {

						if (res.data.code === 0) {
							this.loading = false
							this.waterText = "芯系小助手"
							return uni.showModal({
								content: '登录注册可享一键导课表！',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: "/pagesMe/login/login?type=2"
										})
									}
								}
							});
						} else if (res.data.code === 2) {
							this.loading = false
							this.waterText = "芯系小助手"
							return uni.showModal({
								content: '登录注册可享一键导课表！',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: "/pagesMe/login/login?type=2"
										})
									}
								}
							});

						} else if (res.data.code === 1) {
							if (type === 1) {
								return uni.showModal({
									content: '你是否要去添加课表！',
									success: (e) => {
										if (e.confirm) {
											uni.navigateTo({
												url: "/myServices/courseImport/courseImport"
											})
										}
									}
								});
							} else {
								uni.setStorageSync('userInfo', res.data.data);
								uni.getStorage({
									key: 'userInfo', // 你存储的数据的键名
									success: (res) => {
										this.$store.commit('loginSuccess', res.data);
									},
									fail: (err) => {
										console.log('获取本地存储失败', err);
									}
								});
								this.$forceUpdate();
								this.loading = false
								this.waterText = this.userInfo.grade === '暂无' ? '' : this.userInfo.grade + this
									.userInfo.class === '暂无' ? '' : this.userInfo.class + this.userInfo.levels ===
									'暂无' ? '' : this.userInfo.levels +
									this.userInfo.name === '暂无' ? '' : this.userInfo.name
							}


						}

					})




			},
			formatDate(day, month, week) {
				const formattedDay = day < 10 ? '0' + day : String(day);

				if (week === '一' && day === 1) {
					// 如果week为一且day为1，则显示1日
					return '01日';
				} else if (day === 1) {
					// 如果day为1，则显示下个月的月份
					const nextMonth = month === 12 ? '01' : ('0' + (month + 1)).slice(-2);
					return nextMonth + '月';
				} else {
					// 否则显示日期
					return formattedDay + '日';
				}
			},





			navCourse(index) {
				uni.navigateTo({
					url: `../../subpkg-common/courseInfo/courseInfo?info=${JSON.stringify(this.courseList[index])}`
				})
			},
			swiperChange(e) {

				if (e.detail.source == '') {

					this.firstEntry = false
					return
				}
				const index = e.detail.current

				this.switchWeekFn(index + 1)

			},
			indexOf(arr, value) {
				if (arr.indexOf(value) > -1) {
					return true
				}
				return false
			},
			// 显示弹窗
			showPopup() {
				this.showSwitchWeek = true;
			},

			// 隐藏弹窗
			hidePopup() {
				this.showSwitchWeek = false;
			},

			// 处理按钮点击事件
			handleButtonClick(num) {
				this.showSwitchWeek = false
				this.switchWeekFn(num)


			},
			switchWeekFn(week) {
				this.nowWeek = week
				this.getWeekDates()

			},

			getNowWeek() {
				const nowWeek = getNowWeek(this.startDate, this.totalWeek)
				this.nowWeek = nowWeek
				this.getWeekDates()
			},
			getWeekDates() {
				const startDate = new Date(this.startDate);
				const addTime = (this.nowWeek - 1) * 7 * 24 * 60 * 60 * 1000;
				const firstDate = startDate.getTime() + addTime;
				const {
					month: nowMonth
				} = this.getDateObject(new Date(firstDate));
				const weekCalendar = [];
				for (let i = 0; i < this.weekDayCount; i++) {
					const date = new Date(firstDate + i * 24 * 60 * 60 * 1000);
					const {
						day
					} = this.getDateObject(date);
					weekCalendar.push(day);
				}
				this.nowMonth = nowMonth;
				this.weekCalendar = weekCalendar;
			},
			getDateObject(date = new Date()) {
				const year = date.getFullYear();
				const month = date.getMonth() + 1;
				const day = date.getDate();
				const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六']; // 调整数组顺序，使星期日在首位
				const dayOfWeekIndex = date.getDay(); // 获取数字形式的星期几的索引 (0 表示星期日, 1 表示星期一, 以此类推)
				const dayOfWeek = daysOfWeek[dayOfWeekIndex]; // 获取对应的星期名称
				return {
					year,
					month,
					day,
					dayOfWeek // 返回星期名称
				};
			},




			getCourse() {
				const cache = uni.getStorageSync(this.courseCachekey).result.coursesList
				const courseColorCachekey = uni.getStorageSync(this.courseColorCachekey)
				if (cache) {
					this.courseList = cache
					if (!courseColorCachekey) {
						this.buildCourseColor()
					} else {
						this.courseColor = courseColorCachekey
					}
					return
				}

				this.updateFn(true)
			},
			update() {

				this.isRotated = !this.isRotated; // 切换 isRotated 状态
				this.updateFn()
				this.checkLogin()
			},
			//公共的更新方法
			updateFn(firstEntry = false) {
				this.loading = true

				uni.$http.get("/api/get/course", {
					userId: this.userId,
					termName: this.termName
				}).then((res) => {
					if (res.statusCode === 404) {
						this.getClassCourse()
					} else if (res.errMsg == "request:ok") {

						this.courseList = res.data.data.result.coursesList
						this.startDate = ''
						this.startDate = res.data.data.startTime
						this.waterText = this.userInfo.grade + this.userInfo.class + this.userInfo.levels + this
							.userInfo
							.name
						this.buildCourseColor()
						if (!this.firstEntry) {
							uni.showToast({
								icon: "success",
								title: "更新成功"
							})
						}
						setTimeout(() => {
							this.loading = false
						}, 1000)

						this.getTodayDate()
						uni.setStorageSync(this.courseCachekey, res.data.data)
					}


				})
			},

			getClassCourse() {
				uni.$http.get("/api/get/alternative", {
					grade: this.userInfo.grade,
					className: this.userInfo.class,
					level: this.userInfo.levels,
					termName: this.termName
				}).then((res) => {

					if (res.errMsg == "request:ok") {
						this.courseList = res.data.data.result.coursesList
						this.startDate = ''
						this.startDate = res.data.data.startTime
						this.waterText = this.userInfo.grade + this.userInfo.class + this.userInfo.levels
						this.buildCourseColor()
						if (!this.firstEntry) {
							uni.showToast({
								icon: "success",
								title: "更新成功"
							})
						}
						setTimeout(() => {
							this.loading = false
						}, 1000)

						this.getTodayDate()
						uni.setStorageSync(this.courseCachekey, res.data.data)
					}



				})

			},
			// 公共方法获取课表颜色
			buildCourseColor() {
				const courseColor = {}
				let colorIndex = 0
				this.courseList.map(item => {
					if (courseColor[item.name] === undefined) {
						courseColor[item.name] = this.colorList[colorIndex]
						colorIndex++
					}
				})
				this.courseColor = courseColor
				uni.setStorageSync(this.courseColorCachekey, courseColor)

			},
			// 获取今天日期
			getTodayDate() {
				const {
					month,
					day,
					dayOfWeek
				} = this.getDateObject()
				this.todayMonth = month
				this.todayDay = day
				this.todayWeek = dayOfWeek
				this.getNowWeek()

			},


		},

		onPullDownRefresh() {

			this.userId = uni.getStorageSync('userInfo')._id
			this.update()
			this.getTodayDate()
			uni.showToast({
				title: "刷新成功",
				icon: 'success',
				duration: 800
			})
			setTimeout(function() {


				uni.stopPullDownRefresh(); //停止页面加载动画

			}, 1000);
		},
		onShareAppMessage() { // 分享到微信
			// 更多参数配置，参考文档
			return {
				title: this.userInfo.name + '的课表',
				path: 'pages/Schedule/Schedule?id=' + this.userInfo._id
			}
		},

		onShareTimeline() { // 分享到朋友圈
			return {
				title: this.userInfo.name + '的课表',
				path: 'pages/Schedule/Schedule?id=' + this.userInfo._id
			}
		}
	};
</script>
<style>
	.watermark {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(-30deg);
		/* 旋转水印 */
		color: rgba(0, 0, 0, 0.1);
		/* 水印颜色及透明度 */
		font-size: 12px;
		/* 水印字体大小 */
		pointer-events: none;
		/* 使水印不影响其他元素的点击 */
		white-space: nowrap;
		/* 防止换行 */
		z-index: 999;
		/* 确保水印在上层 */
		user-select: none;
		/* 防止文本选中 */
	}


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

	.navBarBox {
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 1;
	}

	.navBarBox .statusBar {
		background-color: #fff;
	}

	.navBarBox .navBar {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		z-index: 1;
		background-color: #fff;
		flex: 1;


	}

	.icon {
		cursor: pointer;
		transition: transform 1.5s ease;
		/* 添加过渡效果 */
	}

	.rotate {
		transform: rotate(360deg);
		/* 旋转360度 */
	}

	.logo {
		width: 52rpx;
		height: 52rpx;
		margin-left: 40rpx;

	}

	.nav-week {
		display: flex;
		margin-right: 80rpx;
		align-items: center;

	}

	.nav-week image {
		width: 60rpx;
		height: 60rpx;

	}

	.week-list {
		position: fixed;
		left: 0;
		width: 100%;
		height: 92rpx;
		display: flex;
		align-items: center;
		background: #f5f7f8;
		z-index: 1;

	}

	.now-month {
		width: 100rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #666666;
	}

	.week-item {
		width: calc((100% - 100rpx) / 7);
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.week-item.active {
		background-color: #40d6b0;

		border-radius: 20rpx;
	}

	.week-name {
		font-size: 24rpx;
		color: #444444;
	}

	.week-date {
		font-size: 20rpx;
		color: #a1a1a1;
	}

	.active .week-name,
	.active .week-date {
		color: #fff;
	}

	.course-content {
		width: 100%;
		padding-top: 92rpx;
		display: flex;
	}

	.course-nums {
		width: 100rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #f5f6f7;
	}

	.time {
		font-size: 14rpx;
		text-align: center;
	}

	.course-num {
		text-align: center;
		width: 100rpx;
		height: 150rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #999999;
		flex-direction: column;
	}

	.course-list {
		width: 100%;
		position: relative;
		background-color: #f5f6f7;
	}

	.course-item {
		position: absolute;
		width: calc((100% - 50rpx) / 7);
		padding: 2rpx;
		border-radius: 8rpx;
		text-overflow: ellipsis;
		overflow: hidden;
	}



	.course-item__content {
		width: 100%;
		height: 100%;

		font-size: 24rpx;
		color: #ffffff;
		text-align: center;
	}

	.switch-week__popup {
		padding: 30rpx;
	}

	.switch-week__title {
		text-align: center;
		font-size: 34rpx;
		font-weight: 500;
	}

	.switch-week__list {
		display: flex;
		flex-wrap: wrap;
		margin-top: 30rpx;
	}

	.switch-week__item {
		width: 20%;
		padding: 10rpx;
	}

	.switch-week__item-box {
		width: 100%;
		height: 100rpx;
		background-color: #eee;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 12rpx;
	}

	.switch-week__item-box.active {
		background-color: var(--theme);
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
	}




	/* 样式可以根据需求进行调整 */
	.popup-content {
		padding: 20px;
		display: flex;
		flex-wrap: wrap;
	}

	button {
		width: 30%;
		/* 设置按钮宽度 */
		margin: 5px;
		/* 设置按钮间距 */
		padding: 10px;
		text-align: center;
	}

	/* 底部弹窗样式 */

	/* 样式可以根据需求进行调整 */
	.popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: flex-end;
		transition: opacity 0.3s;
		z-index: 999;
	}

	.popup-container {
		width: 100%;
		background-color: #fff;
		padding: 20px;
		box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.2);
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		display: flex;
		flex-direction: column;
	}

	.button-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.btn.active {
		background-color: #40d6b0;
		border: 1px solid #ddd;
		border-radius: 5px;
	}

	.btn {
		width: 10%;
		margin: 5px;
		padding: 10px;
		text-align: center;
		background-color: #f0f0f0;
		border: 1px solid #ddd;
		border-radius: 5px;
	}

	.close-button {
		align-self: flex-end;
		margin-top: 10px;
		cursor: pointer;
	}

	.week-item .active {
		background-color: aqua;
	}

	.course-swiper {
		width: calc(100% - 100rpx);
		height: 1800rpx;

	}

	.empty-data {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		/* 设置为视口高度 */
		position: absolute;
		top: -200rpx;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.empty-image {
		max-width: 60%;
		/* 设置最大宽度 */
		max-height: 60%;
		/* 设置最大高度 */
	}
</style>