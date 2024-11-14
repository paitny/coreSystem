<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="navbar">
			<text class="title">{{getCurrentSemester()}}</text>
			<view class="navbar-logo-title">
				<image src="https://wypty.cn/static/file/material/logo.png" class="logo" />
				<view class="" style="display: flex;flex-direction: column;justify-content: space-around;">
					<text class="title">查课系统</text>
					<text class="title">人工智能与大数据学院</text>

					<view class="user-info">
						<image :src='`${baseURL}${userInfo.photo}`' class="avatar" />
						<text class="username">查课人: {{ userInfo.name }}</text>
					</view>
				</view>
			</view>


		</view>
		<view class="search-bar">
			<picker mode="selector" :range="weeks" :value="selectedWeek" @change="onWeekChange">
				<view class="picker">
					选择周次:<br><text> 第{{ weeks[selectedWeek] }}周</text>
				</view>
			</picker>
			<picker mode="selector" :range="weekdays" :value="selectedWeekday" @change="onWeekdayChange">
				<view class="picker">
					选择星期:<br> <text>{{ weekdays[selectedWeekday] }}</text>
				</view>
			</picker>
		</view>
		<!-- 搜索栏 -->
		<view class="search-bar">

			<picker mode="selector" :range="grades" :value="checkGrade" @change="onGradeChange">
				<view class="picker">
					选择年级:<br><text> {{ checkGrade }}</text>
				</view>
			</picker>
			<picker mode="selector" :range="classarray" :value="checkClass" @change="onClassChange">
				<view class="picker">
					选择班级:<br> <text>{{ checkClass }}</text>
				</view>
			</picker>
			<picker mode="selector" :range="levelsarray" :value="checkLevels" @change="onLevelChange">
				<view class="picker">
					选择层次:<br> <text> {{ checkLevels }}</text>
				</view>
			</picker>

			<button class="search-btn" type="primary" :disabled="searching" @click="searchCourse">
				<text v-if="!searching">查询</text>
				<text v-else>查询中...</text>
			</button>
		</view>

		<!-- 课程列表 -->
		<view class="course-list" v-if="courses.length > 0">
			<view v-for="course in courses" :key="course._id" class="course-item" @click="viewCourseDetail(course)">
				<text class="course-name">{{ course.name }}</text>
				<view class="course-info">代码：{{ course.num }}</view>
				<view class="course-info">节次：{{ course.rawSection }}</view>
				<view class="course-info">地点：{{ course.address }}</view>
				<view class="course-info">
					班级：{{ checkGrade }}{{ checkClass }}{{ checkLevels }}</view>
			</view>
		</view>
		<view v-else class="no-results">
			<text>没有找到符合条件的课程</text>
		</view>
		
		<!-- Picker 选择器 -->
		
		
		<view class="floating-button" @click="getClassList">
			班级
		</view>
		
		
		<classPop :show="showDialog" @close="closeDialog" :dataList="classList" @item-selected="handleItemSelected"></classPop>
		
	</view>
</template>

<script>
	import classPop from '../../components/classPop/classPop.vue'; // 引入自定义的弹窗组件
	import {
		mapState
	} from 'vuex';
	import {
		getNowWeek
	} from '../../Utils/getNowWeek.js'
	export default {
		data() {
			return {
				grades: [],
				classList: [], // 班级信息数组
				classarray: [],
				levelsarray: [],
				weeks: Array.from({
					length: 20
				}, (v, k) => k + 1),
				weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
				selectedGrade: 0,
				selectedClass: 0,
				selectedLevel: 0,
				selectedWeek: 0,
				selectedWeekday: 0,
				checkGrade:'',
				checkClass:'',
				checkLevels:'',
				courses: [],
				searching: false,
				gradeClassArr: [],
				totalWeek: 25, // 周总数
				startDate: '2024/9/2', // 开学日期
				nowMonth: 0,
				nowWeek: 0,
				baseURL: '',
				showDialog:false,
				optionsArr:{}
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		watch: {
			selectedGrade(newGrade) {
				this.loadClasses(this.optionsArr);
			}
		},
		created() {
			
			

		},
		components:{
			classPop
		},
		onLoad(options) {
			
			console.log(options.grade,options.className,options.level);
			this.baseURL = uni.baseURL
			this.optionsArr=options
			this.loadData(options);
			this.getNowWeek()
			this.getCurrentWeekday()
			
		    
		},

		methods: {
			handleItemSelected(item) {
			      console.log('Selected item:', item);
				  this.onClassSelect(item)
				  this.showDialog=false
			      // Handle the selected item (e.g., update some state)
			    },
			// 关闭弹窗的方法
			closeDialog() {
				this.showDialog = false; // 设置 showDialog 为 false 关闭弹窗
			},
			getClassList(){
				uni.$http.get("/api/aiCourse/search-by-class", {
					counsellor: this.userInfo.name
				}).then((res) => {
					this.classList = res.data.classList
					this.showDialog = true;
	
				})
			},
			onClassSelect(gradeClassName) {
			
				// const selectedIndex = event.detail.value;
				// this.selectedClass = this.classList[selectedIndex];
				const gradeMatch = gradeClassName.match(/^(\d+级)/);
				const classMatch = gradeClassName.match(/(\D+?\d+班)/);
				const levelMatch = gradeClassName.match(/\(([^)]+)\)/);
			
				// 分别赋值给变量
				const grade = gradeMatch ? gradeMatch[0] : '';
				const className = classMatch ? gradeClassName.split(grade)[1].split('(')[0] : '';
				const level = levelMatch ? levelMatch[1] : '';
				this.checkGrade=grade
				this.checkClass=className
				this.checkLevels=level
			    this.searchCourse()
				
			},
			
			getNowWeek() {
				const nowWeek = getNowWeek(this.startDate, this.totalWeek)
				this.selectedWeek = nowWeek - 1

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
				console.log(weekCalendar);
				this.weekCalendar = weekCalendar;
			},
			getCurrentWeekday() {

				const today = new Date();
				const dayIndex = today.getDay();
				this.selectedWeekday = dayIndex
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
			}

			,
			async loadData(options) {
				try {
					const res = await uni.$http.get("/api/get/gradeClass");
					this.gradeClassArr = res.data;
					this.grades = res.data.map(item => item.grade);

					const userGradeData = res.data.find(item => item.grade === this.userInfo.grade);
					if (userGradeData) {
						this.selectedGrade = this.grades.indexOf(userGradeData.grade);
						this.classarray = userGradeData.classNames;
						this.levelsarray = userGradeData.levels;
						
					} else {
						
						this.loadClasses(options);
						
					}
				} catch (error) {
					console.error('Error loading data:', error);
				}
			},
			loadClasses(options) {
				const {
					classNames,
					levels
				} = this.getClassesAndLevelsByGrade(this.grades[this.selectedGrade]);
				this.classarray = classNames;
				this.levelsarray = levels;
				this.selectedClass = 0;
				this.selectedLevel = 0;
				// this.checkGrade=this.grades[this.selectedGrade]
				// this.checkClass=this.classarray[this.selectedClass]
				// this.checkLevels=this.levelsarray[this.selectedLevel]
				this.checkGrade=options.grade||this.grades[this.selectedGrade]
				this.checkClass=options.className||this.classarray[this.selectedClass]
				this.checkLevels=options.level||this.levelsarray[this.selectedLevel]
				this.searchCourse()
				
				
			},
			getClassesAndLevelsByGrade(grade) {
				const gradeData = this.gradeClassArr.find(item => item.grade === grade);
				return gradeData ? {
					classNames: gradeData.classNames,
					levels: gradeData.levels
				} : {
					classNames: [],
					levels: []
				};
			},
			onGradeChange(event) {
				this.selectedGrade = event.detail.value;
				this.checkGrade=this.grades[event.detail.value]
			},
			onClassChange(event) {
				this.selectedClass = event.detail.value;
				this.checkClass=this.classarray[event.detail.value]
			},
			onLevelChange(event) {
				this.selectedLevel = event.detail.value;
				this.checkLevels=this.levelsarray[event.detail.value]
			},
			onWeekChange(event) {
				this.selectedWeek = event.detail.value;
			},
			onWeekdayChange(event) {
				this.selectedWeekday = event.detail.value;
			},
			async searchCourse() {
				try {
					this.searching = true;
					const response = await uni.$http.get("/api/aicourse/checkCourses", {
						termName: this.getCurrentSemester(),
						grade: this.checkGrade,
						className: this.checkClass,
						level: this.checkLevels,
						week: this.weeks[this.selectedWeek],
						weekday: this.selectedWeekday===0?7:this.selectedWeekday

					});
					

					if (response.statusCode === 200) {
						this.courses = response.data.matchedCourses;
					} else {
						uni.showToast({
							icon: "error",
							title: response.data.message || "查询失败",
							duration: 1500,
						});
					}
				} catch (error) {
					console.error('Error fetching courses:', error);
					uni.showToast({
						icon: "error",
						title: "查询失败，请稍后重试",
						duration: 1500,
					});
				} finally {
					this.searching = false;
				}
			},
			viewCourseDetail(course) {
				const serializedCourse = JSON.stringify(course);
				const result = JSON.stringify([])
				const photo = JSON.stringify([])
				const isProvide=JSON.stringify(false) 
				uni.navigateTo({
					url: `/subpkg-common/attendanceCourse/attendanceCourse?grade=${this.checkGrade}&class=${this.checkClass}&level=${this.checkLevels}&course=${encodeURIComponent(serializedCourse)}&week=${this.weeks[this.selectedWeek]}&weekday=${this.selectedWeekday}&results=${result}&photo=${photo}&isProvide=${isProvide}`
				});
			},
		}
	};
</script>

<style scoped lang="scss">
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
	.container {
		padding: 20px;
	}

	.navbar {
		display: flex;
		align-items: center;
		flex-direction: column;
		background-color: #007bff;
		padding: 10px;
		color: white;
		border-radius: 8px;
		height: 260rpx;

		.navbar-logo-title {
			width: 100%;
			display: flex;
			justify-content: space-around;
			padding-top: 20rpx;
		}
	}

	.logo {
		width: 180rpx;
		height: 180rpx;
		background: #fff;
		border-radius: 50%;
	}

	.title {
		font-size: 20px;
		font-weight: bold;
	}

	.user-info {
		display: flex;
		align-items: center;
	}

	.avatar {
		width: 30px;
		height: 30px;
		border-radius: 50%;
	}

	.username {
		margin-left: 10px;
	}

	.search-bar {
		margin: 20px 0;
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}

	.picker {
		margin-bottom: 10px;
		padding: 10px;
		background-color: #f8f9fa;
		border: 1px solid #ced4da;
		border-radius: 4px;
		width: 179rpx;
		height: 100rpx;
		text-align: center;
		background: #007bff;
		color: #ffff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;

		text {
			color: pink;
		}
	}

	.picker text {
		font-size: 16px;
	}

	.search-btn {
		margin-top: 10px;
		padding: 30rpx 200rpx 30rpx 200rpx;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
	}

	.search-btn[disabled] {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.course-list {
		margin-top: 20px;
	}

	.course-item {
		padding: 10px;
		border-bottom: 1px solid #eee;
		cursor: pointer;
	}

	.course-item:hover {
		background-color: #f8f9fa;
	}

	.course-name {
		font-weight: bold;
	}

	.course-info {
		margin-top: 5px;
		color: #666;
	}

	.no-results {
		padding: 10px;
		text-align: center;
		color: #666;
		font-size: 16px;
	}
</style>