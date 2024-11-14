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
		<view v-for="item in activeData" :key="item._id" class="container" >
			<uni-swipe-action-item :right-options="options" :left-options="options"
				@click="onClick($event, item._id,item.title,item.cover)" @change="change">
				<view class="content">
					<image class="img" :src='`${baseURL}${item.cover}`' alt="" @click.stop="clickImg(item.cover)">
					</image>
					<view class="info">
						<text class="title">标题：{{item.title.substring(0,12)}}</text>
						<text class="title">{{item.title.length>15?'...':''}}</text>
						<br>
						<text class="title">时间：{{parseDateStringAndFormat(item.startTime)}}</text><br>
						<text class="title">地点：{{item.address}}</text><br>
						<text class="title">发布者：{{item.userId.position==='普通用户'?'':item.userId.position}}{{item.userId.name}}</text><br>
						<text class="title" v-if="item.quantization">活动类别：量化活动</text>
						<text class="title" v-else>活动类别：普通报名或签到</text><br>
						<text class="title"
							v-if="!item.isSign&&item.quantization||item.isSign&&item.isCheckOut&& item.checkOutTimes.length>0&&item.checkInTimes.length>0&&item.quantization||item.isSign&&item.isCheckOut===false&&item.checkInTimes.length>0&&item.quantization">量化状态：已录入</text>
						<text class="title" v-else>量化状态：未录入</text>
					</view>
				</view>
				<view class="option">
					<view class="option-count">
						<view class="count">
							<uni-icons type="person-filled"
								size="20"></uni-icons><text>&nbsp;{{item.volunteerCounts.totalVolunteers}}</text>
						</view>
					</view>
                     <view class="option-button" v-if="item.isSign && item.isCheckOut &&  item.checkOutTimes.length===0&& item.checkInTimes.length>0">
                     	未签退
                     </view>
					 <view class="option-button" v-else-if ="item.isSign && item.isCheckOut &&  item.checkOutTimes.length>0&& item.checkInTimes.length>0">
					 	已完成
					 </view>
					<view class="option-button" v-else-if ="item.isSign &&  item.isCheckOut===false && item.checkInTimes.length>0">
						已签到
					</view>
					
					<view class="option-button" v-else-if="item.isSign && item.checkInTimes.length===0">
						未签到
					</view>
				
					<view class="option-button" v-else>
						无需签到
					</view>


				</view>

			</uni-swipe-action-item>
		</view>
	</view>
</template>

<script>
	import loading from '../../components/loading/loading.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],

				semesters: [],
				activeData: [],
				baseURL: "",
				userId: "",
				selectedSemester: this.getCurrentSemester(),
				isloading: true
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		components: {
			loading
		},
		methods: {
			clickImg(photoImg) {
				let imgsArray = [];
				imgsArray[0] = this.baseURL + photoImg;
				uni.previewImage({
					current: 0,
					urls: imgsArray
				});


			},
			onSemesterChange(event) {
				const index = event.detail.value;
				this.selectedSemester = this.semesters[index];
				this.getActiveData(); // 调用重新获取数据的方法
			},
			getSemster() {
				uni.$http.get("/api/get/semesters").then((res) => {

					res.data.data.forEach(item => {
						this.semesters.push(item.name);
					});
				});
			},
			onClick(e, id, title, ) {
				let {
					content
				} = e;
				if (content.text === '删除') {
					console.log(e.index);
					this.deleteItem(id, title, e.index)
					//点击选项按钮时触发事件	
					//e = {content,index} ，content（点击内容）、index（下标）、position (位置信息)
				}
			},
			swipeChange(e) {
				//组件打开或关闭时触发	
				// left:左侧 ，right：右侧，none：关闭
			}

			,
			change() {

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
			deleteItem(id, title, index) {
				uni.showModal({
					content: '您确定要删除您报名的' + title + "信息?",
					success: (e) => {
						if (e.confirm) {
							uni.$http.post("/api/itVolunteer/delete", {
								activityId: id,
								ID: this.userInfo.num
							}).then((res) => {
								console.log();
								if (res.statusCode === 403 || res.statusCode === 404 || res
									.statusCode === 500) {
									return uni.showToast({
										icon: "none",
										title: res.data.msg
									})
								}
								uni.showToast({
									icon: "none",
									title: res.data.msg
								})
								this.activeData.splice(index, 1);

							});
						}
					}
				});
			},


			getActiveData() {
				uni.$http.get("/api/itVolunteer/userActivity", {
					userId: this.userInfo._id,
					currentSemester: this.selectedSemester,
					num: this.userInfo.num
				}).then((res) => {
					this.isloading = true
					if (res.errMsg == "request:ok") {
						this.activeData = res.data.data
						setTimeout(() => {
							this.isloading = false
						}, 500)
					}

				}).catch(error => {

					if (error) {
						this.isloading = true
					}
				});

			},


		},
		onShow() {
			this.getActiveData()
		},
		onLoad(options) {
			this.isSign = options.sign
			this.baseURL = uni.baseURL
			this.getSemster()
		},


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
	:deep(.uni-swipe_box){
		flex-direction: column;
	}
</style>