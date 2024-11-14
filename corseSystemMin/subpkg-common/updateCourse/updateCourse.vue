<template>
	<view class="container">
		<view class="info-box">
			<view class="course-title">{{termName}}</view>
			<view class="info-list">
				<view class="info-item">
					<view class="info-item__val">
						<span class="required">*</span>课程代码:
					</view><input type="text" v-model="info.num" placeholder="请输入课程代码">
				</view>
				<view class="info-item">
					<view class="info-item__val">
						<span class="required">*</span>课程名称:
					</view><input type="text" v-model="info.name" placeholder="请输入课程名称">
				</view>
	
	
				<view class="info-item" @click="showPopup1">
					<view class="info-item__val">
						<span class="required">*</span>课程星期:
					</view>
					<view class="">周{{convertToChineseNumber(info.week)}}</view>
				</view>
				<view class="info-item" @click="showPopup4">
					<view class="info-item__val">
						<span class="required">*</span>课程周期:
					</view>
					<input type="number" v-model="info.rawWeeks" placeholder="请输入周数" disabled>
				</view>
				<view class="info-item" @click="showPopup2">
					<view class="info-item__val">
						<span class="required">*</span>开始节次:
					</view><input type="number" v-model="info.section" placeholder="请输入开始节次" disabled>
				</view>
				<view class="info-item" @click="showPopup3">
					<view class="info-item__val">
						<span class="required">*</span>总节次:
					</view><input type="number" v-model="info.sectionCount" placeholder="请输入一共多少节" disabled>
				</view>
				<view class="info-item">
					<view class="info-item__val">
						<span class="required">*</span>课程节数:
					</view>
					<input type="number" v-model="info.rawSection" placeholder="输入开始节次和总节次自动获取" disabled>
				</view>
				<view class="info-item">
					<view class="info-item__val">
						任课教师:
					</view><input type="text" v-model="info.teacher" placeholder="请输入上课教师">
				</view>
				<view class="info-item">
					<view class="info-item__val">
						上课教室:
					</view><input type="text" v-model="info.address" placeholder="请输入上课教室">
				</view>
				<view class="info-item">
					<view class="info-item__val">
						课程类型:
					</view><input type="text" v-model="info.category" placeholder="必修/选修">
				</view>
				
				<view class="info-item">
					<view class="info-item__val">
						考察方式:
					</view><input type="text" v-model="info.method" placeholder="闭卷/开卷">
				</view>
	
			</view>
		</view>
	
		<!-- 自定义底部弹窗 -->
		<view class="popup-mask" v-show="showSwitchWeek" @click="hidePopup">
			<view class="popup-container" @click.stop v-if="type1">
				<!-- 创建18个按钮 -->
				<view class="button-container">
					<view v-for="(num,index) in 7" :key="num" @click="handleButtonClick1(num)" class="btn"
						:class="{'active': info.week == index + 1}">
						{{convertToChineseNumber(num)}}
					</view>
				</view>
	
				<!-- 关闭按钮 -->
				<view class="close-button" @click="hidePopup">
					关闭
				</view>
			</view>
	
			<view class="popup-container" @click.stop v-if="type2">
				<!-- 创建18个按钮 -->
				<view class="button-container">
					<view v-for="(num,index) in 12" :key="num" @click="handleButtonClick2(num)" class="btn"
						:class="{'active': info.section == index + 1}">
						{{ num }}
					</view>
				</view>
	
				<!-- 关闭按钮 -->
				<view class="close-button" @click="hidePopup">
					关闭
				</view>
			</view>
			<view class="popup-container" @click.stop v-if="type3">
				<!-- 创建18个按钮 -->
				<view class="button-container">
					<view v-for="(num,index) in 12" :key="num" @click="handleButtonClick3(num)" class="btn"
						:class="{'active': info.sectionCount == index + 1}">
						{{ num }}
					</view>
				</view>
	
				<!-- 关闭按钮 -->
				<view class="close-button" @click="hidePopup">
					关闭
				</view>
			</view>
	
	
			<view class="popup-container" @click.stop v-if="type4">
				<!-- 创建18个按钮 -->
				<view class="button-container">
					<view v-for="(num, index) in 20" :key="index" :class="{ 'active': isSelected(num) }"
						@click="toggleSelection(num)" class="btn">
	
						{{ num }}
	
					</view>
				</view>
	
				<!-- 关闭按钮 -->
				<view class="close-button" @click="hidePopup">
					关闭
				</view>
			</view>
		</view>
	
		<button class="add-btn" @click="subCourse">更新</button>
	
	</view>
	
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				
				showSwitchWeek: false,
				type1: false,
				type2: false,
				type3: false,
				type4: false,
				termName: "",
				info: {},
				index: "",
				firstEntry: true


			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad(options) {

			this.termName = options.nowTermName
			this.index = options.index
			this.getCourseIndex(true)
		},
		methods: {
			getCourseIndex(firstEntry = false) {
				uni.$http.get("/api/course/getCourseByIndex", {
					userId: this.userInfo._id,
					termName: this.termName,
					index: this.index
				}).then((res) => {
					if (!this.firstEntry) {
						uni.showToast({
							icon: "success",
							title: "获取成功"
						})
					}
					this.info = res.data.data

				})
			},
			formatSection(section, sectionCount) {
				if (sectionCount === 1) {
					return `[${section}节]`;
				} else {
					const endSection = section + sectionCount - 1;
					return `[${section}-${endSection}节]`;
				}
			},
			formatArray(inputArr) {
				if (!Array.isArray(inputArr) || inputArr.length === 0) {
					return '';
				}
				// 对输入数组进行排序
				inputArr.sort((a, b) => a - b);
				let result = [];
				let start = null;
				let end = null;

				for (let i = 0; i < inputArr.length; i++) {
					const num = inputArr[i];

					if (start === null) {
						// 初始化范围起始值
						start = num;
						end = num;
					} else if (num === end + 1) {
						// 连续的数字，更新结束值
						end = num;
					} else {
						// 不连续的数字，添加范围到结果
						if (start === end) {
							result.push(start.toString());
						} else {
							result.push(start + '-' + end);
						}
						// 重置起始和结束值
						start = num;
						end = num;
					}
				}

				// 处理最后一个范围
				if (start === end) {
					result.push(start.toString());
				} else {
					result.push(start + '-' + end);
				}

				// 在结果中添加 "周"
				const formattedStr = `[${result.join(', ')}周]`;

				return formattedStr;
			},
			isSelected(num) {
				return this.info.weeks.includes(num);
			},

			toggleSelection(num) {
				if (this.isSelected(num)) {
					// 如果已经选中，取消选中并从数组中移除
					const index = this.info.weeks.indexOf(num);

					if (index !== -1) {
						this.info.weeks.splice(index, 1);

					}
				} else {
					// 如果未选中，添加到数组中
					this.info.weeks.push(num);

				}
				this.info.rawWeeks = this.formatArray(this.info.weeks)

			},
			// 显示弹窗
			showPopup1() {
				this.type1 = true
				this.showSwitchWeek = true;

			},
			showPopup2() {
				this.type2 = true
				this.showSwitchWeek = true;

			},
			showPopup3() {
				this.type3 = true
				this.showSwitchWeek = true;

			},
			showPopup4() {
				this.type4 = true
				this.showSwitchWeek = true;

			},
			// 隐藏弹窗
			hidePopup() {
				this.showSwitchWeek = false;
				this.type1 = false
				this.type2 = false
				this.type3 = false
				this.type4 = false
			},

			// 处理按钮点击事件
			handleButtonClick1(num) {
				this.info.week = num
				this.showSwitchWeek = false
				this.type1 = false


			},
			handleButtonClick2(num) {
				this.info.section = num
				this.showSwitchWeek = false
				this.type2 = false
				this.info.rawSection = this.formatSection(this.info.section, this.info.sectionCount)
			},
			handleButtonClick3(num) {
				this.info.sectionCount = num
				this.showSwitchWeek = false
				this.type3 = false
				this.info.rawSection = this.formatSection(this.info.section, this.info.sectionCount)
			},

			subCourse() {
				if (this.info.name.trim() == '') {
					return uni.showToast({
						title: '无课程名',
						icon: 'error',
						duration: 1500 // 持续时间为1.5秒
					});
				} else if (this.info.rawWeeks.trim() == '') {
					return uni.showToast({
						title: '无周数',
						icon: 'error',
						duration: 1500 // 持续时间为1.5秒
					});
				} else if (this.info.rawSection.trim() == '') {
					return uni.showToast({
						title: '无节数',
						icon: 'error',
						duration: 1500 // 持续时间为1.5秒
					});
				}
				uni.$http.post("/api/course/updateCourse", {
					userId: this.userInfo._id,
					termName: this.termName,
					index: this.index,
					updatedCourse: this.info
				}).then((res) => {
					uni.showToast({
						icon: "success",
						title: res.data.message,
						duration: 1500
					})

				})

			},
			convertToChineseNumber(num) {
				const chineseNumbers = ['一', '二', '三', '四', '五', '六', '日'];

				if (num >= 1 && num <= 7) {
					return chineseNumbers[num - 1];
				} else {
					return '未知';
				}
			}


		}
	}
</script>

<style lang="scss">
	page {
		background: #fafafa;
	}

	.info-box {
		background-color: #fff;
		padding: 30rpx 30rpx 0;
	}

	.course-title {
		font-size: 32rpx;
		color: #333333;
		text-align: center;
	}

	.info-list {
		margin-top: 10rpx;
	}

	.info-item {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 24rpx 0;
	}

	.info-item:not(:last-child) {
		border-bottom: 1rpx solid rgba(243, 243, 243, 0.82);
	}



	.info-item__val {
		width: 30%;
		color: #5defe5;

	}

	input {
		width: 70%;
	}



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

	.active {
		background-color: aqua;
	}

	:deep(.required) {
		color: red;
		vertical-align: middle;
	}
	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		background-color: #4d6398;
		color: #fff;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(28, 42, 134, 0.4);
	}
</style>