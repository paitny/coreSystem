<template>
	<view class="semesters">
		<picker mode="selector" :range="semesters" @change="onSemesterChange">
			<text> {{"《"+ selectedSemester+"》" }}</text>
		</picker>
	</view>
	<view class="noData" v-if="activeData.length===0">
		<image src="../../static/orderImgs/noData.png" mode=""></image>
	</view>
	<loading v-if="isloading"></loading>
	<view class="activeData" v-else>
		<view v-for="item in activeData" :key="item._id" class="container">
			<uni-swipe-action-item :right-options="options"
				@click="onClick($event, item._id, item.title, item.deadline, item.description, item.isSign, item.cover,item.address,item.limitPerson,item.startTime,item.groupNum,item.groupCode)"
				@change="change($event,item.audit)" :key="item._id">
				<view class="content" @click="application(item._id,item.isSign,item.title,item.audit)">
					<image class="img" :src='`${baseURL}${item.cover}`' alt="" @click.stop="clickImg(item.cover)">
					</image>
					<view class="info">
						<text class="title">标题：{{item.title.substring(0,12)}}</text>
						<text class="title">{{item.title.length>15?'...':''}}</text>
						<br>
						<text class="title">时间：{{parseDateStringAndFormat(item.startTime)}}</text><br>
						<text class="title">地点：{{item.address}}</text><br>
						<text class="title">发布者：{{item.userId.position}}{{item.userId.name}}</text><br>
						<text class="title" v-if="item.audit">状态：已通过</text>
						<text class="title" v-else>状态：审核中...</text>

					</view>
				</view>
				<view class="option">
					<view class="option-count" v-if="userInfo.admin">
						<view class="count">
							<uni-icons type="person-filled"
								size="20"></uni-icons><text>&nbsp;{{item.volunteerCounts.totalVolunteers}}</text>
						</view>

						<view class="count" v-if="item.isSign">
							<uni-icons type="flag-filled"
								size="20"></uni-icons><text>&nbsp;{{item.volunteerCounts.signedVolunteers}}</text>
						</view>
						<view class="count" v-if="item.isSign">
							<uni-icons type="flag"
								size="20"></uni-icons><text>&nbsp;{{item.volunteerCounts.unsignedVolunteers}}</text>
						</view>


					</view>

					<view class="option-button" v-if="userInfo.admin">
						<button @click="process(item._id,item.audit,item.title)" class="update"
							v-if="userInfo.admin&&item.audit===false">通过</button>
						<!-- <button @click="process(item._id,item.audit,item.title)" class="reject"
							v-if="userInfo.admin&&item.audit">驳回</button> -->
						<button @click="downloadAndWriteToFile(item._id,item.title,item.isSign)"
							class="download">xlsx</button>
						<button @click="toVisualizing(item._id,item.isSign,item.volunteerCounts,item.title,item.audit)"
							class="Visualizing">可视化</button>
						<!-- 修改按钮 -->

					</view>


				</view>

			</uni-swipe-action-item>
		</view>

	</view>
</template>

<script>
	import loading from '../../components/loading/loading.vue'
	import {getCurrentSemester} from '@/Utils/semesterUtils.js';
	import {
		exportToExcel
	} from "../common/xlsx.js";
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
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
				baseURL: "",
				userId: "",
				selectedSemester: getCurrentSemester(),
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
			toVisualizing(id, isSign, volunteerCounts, title, audit) {
				uni.navigateTo({
					url: "../../subpkg-visualization/Visualization/Visualization?isSign=" + isSign +
						"&volunteerCounts=" + JSON.stringify(volunteerCounts) + "&title=" + title + "&id=" + id +
						"&audit=" + audit
				})


			},
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
				this.isloading = true
				this.getActiveData(); // 调用重新获取数据的方法
			},
			getSemster() {
				uni.$http.get("/api/get/semesters").then((res) => {

					res.data.data.forEach(item => {
						this.semesters.push(item.name);


					});
				});
			},
			onClick(e, id, title, deadline, description, isSign, mdUrl, address, limitPerson, startTime, groupNum,
				groupCode) {
				let {
					content
				} = e;
				if (content.text === '删除') {
					this.deleteItem(id, title, mdUrl)
					//点击选项按钮时触发事件	
					//e = {content,index} ，content（点击内容）、index（下标）、position (位置信息)
				} else if (content.text === '修改') {
					this.updateActivity(id, title, deadline, description, isSign, mdUrl, address, limitPerson, startTime,
						groupNum, groupCode)
				}
			},
			swipeChange(e) {
				//组件打开或关闭时触发	
				// left:左侧 ，right：右侧，none：关闭
			},
			process(id, audit, title) {
				uni.showModal({
					content: '您确定要通过' + title + "活动的审核?",
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
								this.getActiveData()

							});
						}
					}
				});
			},
			change(e, audit) {

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
			updateActivity(id, title, deadline, description, isSign, mdUrl, address, limitPerson, startTime, groupNum,
				groupCode) {

				uni.navigateTo({
					url: "../updateRelease/updateRelease?id=" + id + "&title=" + title +
						"&deadline=" +
						deadline + "&description=" + description + "&isSign=" + isSign + "&mdUrl=" +
						mdUrl +
						"&address=" + address + "&limitPerson=" + limitPerson + "&startTime=" + startTime +
						"&groupNum=" + groupNum + "&groupCode=" + groupCode
				});

			},
			deleteItem(id, title, cover) {
				uni.showModal({
					content: '您确定要删除活动' + title + "?",
					success: (e) => {
						if (e.confirm) {
							uni.$http.post("/api/itVolunteer/deleteActivity", {
								id: id,
								vtCover: cover,
							}).then((res) => {
								uni.showToast({
									icon: "none",
									title: res.data.msg
								})
								this.getActiveData()

							});
						}
					}
				});
			},
			downloadAndWriteToFile(id, title, isSign) {
				uni.$http.get('/api/itVolunteer/volunteers', {
					activityId: id
				}).then((res) => {

					if (res.data.message === "该活动暂无人参与") {
						this.message = res.data.message;
					} else {
						this.list = res.data;
						exportToExcel(res.data, title, isSign)



					}

				});
			},

			getActiveData() {
				uni.$http.get("/api/itVolunteer/myPublishActivity", {
					userId: this.userInfo._id,
					currentSemester: this.selectedSemester,
					
				}).then((res) => {

					if (res.errMsg == "request:ok") {
						this.activeData = res.data.data
						console.log(this.userInfo._id,this.selectedSemester);
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

			application(id, isSign, title, audit) {
				if (this.userInfo.admin === false) {
					return uni.showToast({
						duration: 3000,
						title: `${title}活动正在审核中无法查看报名详情!`,
						icon:"none"
					})
				} else {
					uni.navigateTo({
						url: "../../subpkg-activity/signPage/signPage?id=" + id + "&isSign=" + isSign + "&title=" +
							title +
							"&audit=" + audit
					})
				}


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
	:deep(.uni-swipe_box){
		flex-direction: column;
	}
</style>