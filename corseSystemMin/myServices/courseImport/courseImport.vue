<template>
	<view class="uploadExcel">


		<view>
			<view class="semester">《 {{termName}} 》</view>
		</view>
		<view class="topDiv" v-if="courseList.length>0"></view>
		<view class="course" v-for="(item,index) in courseList" :key="index">
			<view class="">
				<view class="course-week">周{{convertToChineseNumber(item.week)}}</view>
				<view class="">{{item.name}}</view>
				<view class="course-title">
					<view>{{formatSection(item.section, item.sectionCount)}}</view>
					<view class="">{{formatArray(item.weeks)}}</view>

				</view>
				<view class="">{{item.address}}</view>
			</view>

			<view class="course-delete">
				<image src="../../static/orderImgs/applicationDelete.png" mode=""
					@click.stop="removeCourseByIndex(index)"></image>
			</view>

		</view>
		<view>
			<view class="chooseExcel" v-if="courseList.length===0">
				<image @click="chooseExcel" src="../../static/img/upload.png" mode=""></image>
				<view class="">请上传.xls,.xlsx文件</view>
			</view>
		</view>
		<view class=" seat" v-if="courseList.length>0"></view>
		<view class="fix-fun" v-if="courseList.length>0">
			<view class="operate">
				<view class="operate-updateImport">
					<image src="../../static/img/upload.png" mode="" @click="chooseExcel" v-if="courseList.length>0">
					</image>
				</view>
				<view class="operate-publish">
					<image src="../../static/orderImgs/publish.png" mode="" v-if="courseList.length>0" type="primary"
						@click="subCourse"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let videoAd = null
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				termName: "",
				nowTermName: "",
				courseList: [],
				firstEntry: true,
				baseURL: ""

			}
		},
		onLoad() {

			this.getCurrentSemester()
			this.baseURL = uni.baseURL
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			//id就是传入的广告位id
			load(id) {
				// 在页面onLoad回调事件中创建激励视频广告实例
				if (uni.createRewardedVideoAd) {
					if (this.userInfo.admin && this.userInfo.adminPlus) {
						// 如果当前用户是管理员，则直接执行请求
						this.postAddCourse();
						return;
					}
					videoAd = uni.createRewardedVideoAd({
						adUnitId: id
					})
					videoAd.onLoad(() => {})
					videoAd.onError((err) => {
						console.error('激励视频光告加载失败', err)
					})
					videoAd.onClose((status) => {
						if (status && status.isEnded || status === undefined) {

							this.postAddCourse()



						} else {
							uni.showToast({
								duration: 1500,
								title: "获取失败",
								icon: "none"
							})
						}
					})
				}
			},
			postAddCourse() {
				uni.$http.post("/api/course/updateAddCourse", {
					userId: this.userInfo._id,
					name: this.userInfo.name,
					due: this.userInfo.due,
					isCadre: this.userInfo.isCadre,
					institution: this.userInfo.institution,
					position: this.userInfo.position,
					termName: this.termName,
					coursesList: this.courseList
				}).then((res) => {
					if (res.statusCode === 200) {
						return uni.showToast({
							icon: "none",
							title: res.data.message,
							duration: 1500
						});
					}
					return uni.showToast({
						icon: "success",
						title: "添加成功",
						duration: 1500
					});
				});
			},
			show() {
				if (videoAd) {
					videoAd.show().catch(() => {
						// 失败重试
						videoAd.load()
							.then(() => videoAd.show())
							.catch(err => {
								console.error('激励视频 广告显示失败', err)
							})
					})
				}
			},
			chooseExcel() {
				uni.showModal({
					content: '是否在聊天中获取文件',
					success: (e) => {
						if (e.confirm) {
							//这里写广告播放完成后的事件
							uni.chooseMessageFile({
								count: 1,
								type: 'file',
								success: (res) => {
									const filePath = res.tempFiles[0].path;
									const fileType = res.tempFiles[0].name.toLowerCase();

									// 验证文件类型是否为.xlsx或.xls
									if (!fileType.endsWith('.xlsx') && !fileType.endsWith(
											'.xls')) {
										uni.showToast({
											title: '请选择.xlsx或.xls文件',
											icon: 'none',
											duration: 2000
										});
										return;
									}

									this.uploadExcel(filePath);
								},
								fail: (err) => {
									console.error('chooseExcel fail', err);
								}
							});




						}
					}
				});
			},
			uploadExcel(filePath) {
				uni.showLoading({
					title: '上传中'
				});
				uni.uploadFile({
					url: uni.uploadURL + '/api/Curriculum/upload', // 上传接口的URL
					filePath: filePath,
					name: 'file',
					formData: {
						'user': 'test'
					},
					success: (res) => {
						const data = JSON.parse(res.data)

						this.courseList = []
						this.courseList = data.data.filter(item => {
							if (
								item.name === null ||
								item.num === null ||
								item.section === null ||
								item.sectionCount === null
							) {
								return false; // 如果特定属性有任何一个为null，就排除该数据
							}
							return true; // 如果所有特定属性都不为null，保留该数据
						});
						uni.hideLoading();
						uni.showToast({
							title: data.msg,
							icon: 'success',
							duration: 1000
						});
					},
					fail: (err) => {
						console.error('uploadExcel fail', err);
						uni.hideLoading();
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
					}
				});
			},
			//获取课程数据
			getcourseListData(firstEntry = false) {
				uni.$http.get("/api/get/course", {
					userId: this.userInfo._id,
					termName: this.termName
				}).then((res) => {
					if (!this.firstEntry) {
						uni.showToast({
							icon: "success",
							title: "获取成功"
						})
					}
					this.courseList = res.data.data.coursesList
					this.nowTermName = res.data.data.termName
				})
			},
			deleteCourse(index) {
				uni.$http.delete("/api/course/deleteCourse", {
					userId: this.userInfo._id,
					termName: this.nowTermName,
					index: index
				}).then((res) => {
					uni.showToast({
						title: res.data.message,
						icon: "success",
						duration: 1800
					})
				})
			},
			removeCourseByIndex(indexToRemove) {
				// 检查索引是否有效
				if (indexToRemove >= 0 && indexToRemove < this.courseList.length) {
					// 使用 splice 方法删除指定索引位置的元素
					this.courseList.splice(indexToRemove, 1);
				}
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

			subCourse() {
				uni.showModal({
					content: '此功能需要观看激励广告',
					success: (e) => {
						if (e.confirm) {
							this.load('adunit-36f40df016ca3710')
							this.show()

						}
					}
				});

			},



		}
	};
</script>
<style lang="scss">
	.uploadExcel {
		background-color: #ffffff;
		height: 100vh;

	}

	.topDiv {
		height: 130rpx;
	}

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

	.chooseExcel {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		image {
			width: 250rpx;
			height: 220rpx;
		}
	}

	.course {

		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15rpx 40rpx 0 40rpx;

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

	.seat {
		height: 248rpx;
	}

	.fix-fun {
		width: 100%;
		position: fixed;
		bottom: 0;
		right: 0;

		.operate {
			width: 100%;
			padding: 50rpx 0 50rpx 0;
			display: flex;
			justify-content: space-around;
			align-items: center;
			background-color: #fff;

			.operate-updateImport {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;

				image {
					width: 150rpx;
					height: 150rpx;
					border-radius: 50%;
				}
			}

			.operate-publish {
				width: 130rpx;
				height: 130rpx;
				border-radius: 50%;

				image {
					width: 130rpx;
					height: 130rpx;
				}
			}
		}

	}
</style>