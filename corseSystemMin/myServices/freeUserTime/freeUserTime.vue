<template>
	<view>
		<view class="navBarBox">
			<!-- 状态栏占位 -->
			<view class="statusBar" :style="{ height: statusBarHeight + 'px' }"></view>
			<!-- 真正的导航栏内容 -->
			<view class="navBar" :style="{ top: statusBarHeight + 'px', height: statusBarHeight + 'px' }">
				<view @click="update">
					<image class="logo icon" src="/static/orderImgs/Refresh.png" :class="{ 'rotate': isRotated }">
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

				<swiper :current="nowWeek-1" class="course-swiper" :duration="firstEntry?0:300" @change="swiperChange"
					circular="true">
					<swiper-item v-for="(itemWeek,weekIndex) in totalWeek" :key="weekIndex">
						<view class="course-list" style="margin-top: 10rpx;">
							<courseSkeleton v-if="loading"></courseSkeleton>
							<view v-else v-for="(item,index) in courseList" :key="index" @click="navCourse(index)">
								<view class="course-item" :style="{
                  'background-color':courseColor[item.section],
                  'height': (item.sectionCount * 140) + 'rpx',
                  'top': ((item.section - 1) * 150) + 'rpx',
                  'left': (((item.week - 1) * ((windowWidth - 50) / 7))) + 'px'
                }" v-if="indexOf(item.weeks,weekIndex+1)">
									<view class="course-item__content">
										空闲时间学生干部
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
				<!-- 创建20个按钮 -->
				<view class="button-container">
					<view v-for="(num,index) in 20" :key="num" @click="handleButtonClick(num)" class="btn"
						:class="{'active': nowWeek == index + 1}">
						{{ num }}
					</view>
				</view>
				<!-- 关闭按钮 -->
				<view class="close-button" @click="hidePopup">
					关闭
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import courseSkeleton from '../../components/courseSkeleton/courseSkeleton.vue'
	export default {
		data() {
			return {
				termName: "", //当前学年
				isRotated: false,
				todayMonth: 0,
				todayDay: 0,
				todayWeek: 0,
				courseCachekey: "course",
				statusBarHeight: 0,
				navBarHeight: 82 + 11,
				nowWeek: 1,
				totalWeek: 20,
				showSwitchWeek: false,
				weekDayCount: 7,
				startDate: '2024/9/2',
				weekIndexText: ['一', '二', '三', '四', '五', '六', '日'],
				nowMonth: 1,
				colorList: [
					"#efdee8", "#eadde6", "#e2e1e6", "#dae3ea", "#edd2e5",
					"#e6d4e2", "#dbd9e7", "#c9d9e8", "#ecc6df", "#becfed",
					"#e0c9e5", "#cdcde5"
				],
				courseColor: {},
				courseColorCachekey: "courseColor",
				weekCalendar: [1, 2, 3, 4, 5, 6, 7],
				firstEntry: true,
				courseList: [],
				time: ["8:30~9:15", "9:20~10:05", "10:20~11:05", "11:10~11:55", "13:40~14:25", "14:30~15:15",
					"15:30~16:15", "16:20~17:05", "18:40~19:25", "19:30~20:15"
				],
				loading: true,
				windowWidth: 0
			};
		},
		components: {
			courseSkeleton
		},
		computed: {
			...mapState(['userInfo'])
		},
		created() {
			this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];
			const {
				windowWidth
			} = uni.getSystemInfoSync();
			this.windowWidth = windowWidth;
		},
		onLoad() {
			this.getTodayDate()
			this.getCurrentSemester()
			this.getWeekDates()
			this.getNowWeek();
		},
		methods: {
			buildCourseColor() {
				const courseColor = {}
				let colorIndex = 0
				this.courseList.map(item => {
					if (courseColor[item.section] === undefined) {
						courseColor[item.section] = this.colorList[colorIndex]
						colorIndex++
					}
				})
				this.courseColor = courseColor
				uni.setStorageSync(this.courseColorCachekey, courseColor)
			},
			checkLogin() {
				uni.$http.post('/api/login/min/check', {
						id: uni.getStorageSync('userInfo')._id
					})
					.then((res) => {
						if (res.data.code === 0 || res.data.code === 2) {
							return uni.showModal({
								content: '登录注册才有权限噢！',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: "../../pagesMe/login/index"
										})
									}
								}
							});
						} else if (res.data.code === 1) {
							this.updateFn(this.nowWeek)
						}
					})
			},
			formatDate(day, month, week) {
				const formattedDay = day < 10 ? '0' + day : String(day);
				if (week === '一' && day === 1) {
					return '01日';
				} else if (day === 1) {
					const nextMonth = month === 12 ? '01' : ('0' + (month + 1)).slice(-2);
					return nextMonth + '月';
				} else {
					return formattedDay + '日';
				}
			},
			navCourse(index) {
				uni.navigateTo({
					url: `../../subpkg-common/freeUser/freeUser?info=${JSON.stringify(this.courseList[index])}`
				})
			},
			swiperChange(e) {
				const index = e.detail.current
				this.updateFn(index + 1)
				this.switchWeekFn(index + 1)
			},
			indexOf(arr, value) {
				return arr.indexOf(value) > -1;
			},
			showPopup() {
				this.showSwitchWeek = true;
			},
			hidePopup() {
				this.showSwitchWeek = false;
			},
			handleButtonClick(num) {
				this.showSwitchWeek = false
				this.switchWeekFn(num)
				this.updateFn(num)
			},
			switchWeekFn(week) {
				this.nowWeek = week
				this.getWeekDates()
			},
			getNowWeek() {
				const nowDate = new Date().getTime()
				const startDate = new Date(this.startDate)
				const time = nowDate - startDate
				const nowWeek = Math.ceil(time / 1000 / 60 / 60 / 24 / 7)
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
				const daysOfWeek = ['一', '二', '三', '四', '五', '六', '日'];
				const dayOfWeekIndex = date.getDay();
				const dayOfWeek = daysOfWeek[(dayOfWeekIndex + 6) % 7];
				return {
					year,
					month,
					day,
					dayOfWeek
				};
			},
			update() {
				this.isRotated = !this.isRotated;
				this.updateFn(this.nowWeek)
				this.getTodayDate()
				this.checkLogin()
			},
			initializeWeekData(targetWeekNum) {
			    const totalDays = 7; // 一周7天
			    const totalSections = 10; // 每天10节课
			    const result = [];
			
			    for (let day = 1; day <= totalDays; day++) {
			        for (let section = 1; section <= totalSections; section++) {
			            result.push({
							weekNum:targetWeekNum,
			                week: day, // 星期几
			                day, // 天数（1到7对应周一到周日）
			                section, // 第几节课
			                sectionCount: 1 ,// 节次数量，默认为1
							weeks:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
			            });
			        }
			    }
			
			    return result; // 返回包含一周内所有天数和节次的数据
			},
			
			
			updateFn(weekNum) {
				this.loading = true
				this.courseList=this.initializeWeekData(weekNum)
				console.log(this.courseList);
				this.buildCourseColor()
				
				setTimeout(() => {
					this.loading = false
				}, 10)
			},
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
		},
		onPullDownRefresh() {
			this.update(this.nowWeek)
			this.getTodayDate()
			uni.showToast({
				title: "刷新成功",
				icon: 'success',
				duration: 800
			})
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		}
	};
</script>
<style>
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
		width: calc((100% - 50rpx) / 7);
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
		height: 100%;
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
		margin-top: 35rpx;
		font-size: 20rpx;
		color: black;
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
		width: calc(100% - 50rpx);
		height: 1800rpx;

	}
</style>