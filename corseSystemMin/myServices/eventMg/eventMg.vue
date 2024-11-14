<template>
	<view class="semesters">
		<picker mode="selector" :range="semesters" @change="onSemesterChange">
			<text> {{"《"+ selectedSemester+"》" }}</text>
		</picker>
	</view>

	<view class="search-box">
		<input type="text" v-model="searchKeyword" placeholder="搜索活动" @input="onSearch" />

	</view>

	<view class="noData" v-if="filteredActiveData.length===0">
		<image src="../../static/orderImgs/noData.png" mode=""></image>
	</view>

	<loading v-if="isloading"></loading>

	<view class="activeData" v-else>
		<view>
			<uni-swipe-action v-for="(item,index) in filteredActiveData" :key="item._id" class="container">


				<uni-swipe-action-item :right-options="optionsList[index]"
					@click="onClick($event, item._id, item.title, item.deadline, item.description, item.isSign, item.cover,item.address,item.limitPerson,item.startTime,item.groupNum,item.groupCode,index,item.isCheckOut,item.transpire)"
					@change="change($event,item._id,index)" :key="item._id">

					<view class="content"
						@click="application(item._id,item.isSign,item.title,item.audit,item.isCheckOut)">
						<image class="img" :src='`${baseURL}${item.cover}`' alt="" @click.stop="clickImg(item.cover)">
						</image>
						<view class="info">
							<text class="title">标题：{{item.title.substring(0,12)}}</text>
							<text class="title">{{item.title.length>15?'...':''}}</text>
							<br>
							<text class="title">时间：{{parseDateStringAndFormat(item.startTime)}}</text><br>
							<text class="title">地点：{{item.address}}</text><br>
							<text
								class="title">发布者：{{item.userId.position==='普通用户'?'':item.userId.position}}{{item.userId.name}}</text><br>
							<text class="title" v-if="item.audit">状态：已通过</text>
							<text class="title" v-else>状态：审核中...</text>
						</view>
					</view>
					<view class="option">
						<view class="option-count">
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
						<view class="option-button">
							<button @click="process(item._id,item.audit,item.title,index)" class="reject"
								v-if="userInfo.admin&&item.audit">驳回</button>
							<button @click="handlePreviewQRCode(item._id,item.title)" class="download">二维码</button>
							<button
								@click="toVisualizing(item._id,item.isSign,item.isCheckOut,item.volunteerCounts,item.title,item.audit)"
								class="Visualizing">可视化</button>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		<view v-if="loading" class="loading-text">加载中...</view>
		<view v-if="filteredActiveData.length===total&& activeData.length>0" class="loading-text">
			本学期就这些活动噢，共{{total}}条数据</view>
	</view>
	<QRCode ref="childComponent" :userId="userInfo._id" :activityId="sendActivityId" :activityTitle="title"
		:showDialog="showDialog" :closeDialog="closeDialog"></QRCode>
</template>

<script>
	import loading from '../../components/loading/loading.vue'
	import {
		getCurrentSemester
	} from '@/Utils/semesterUtils.js';
	import {
		exportToExcel
	} from "../common/xlsx.js";
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				optionsList: [],
				sendActivityId: '',
				title: '',
				showDialog: false,
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
				topItems: [],
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		components: {
			loading
		},
		mounted() {
			// 页面加载时调用 loadTopItem 方法
			this.loadTopItems();


		},
		methods: {
			initializeOptionsList() {
				this.optionsList = this.filteredActiveData.map(item => {
					const isTop = this.topItems.some(topItem => topItem._id === item._id);
					return [{
							text: isTop ? '取消置顶' : '置顶',
							style: {
								backgroundColor: isTop ? '#ff7f50' : '#f5a623'
							}
						},
						{
							text: 'xlsx',
							style: {
								backgroundColor: '#217647'
							}
						},
						{
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
					];
				});
			},
			closeDialog() {
				this.showDialog = !this.showDialog
			},
			async handlePreviewQRCode(id, title) {


				this.sendActivityId = id
				this.title = title
				this.$refs.childComponent.previewQRCode(id); // 调用子组件的方法
				// 这里可以添加需要执行的逻辑
			},
			onSearch() {
				if (this.searchKeyword.trim() === '') {
					this.getActiveData()
					this.filteredActiveData = this.activeData;
					this.total = this.activeData.length;
					this.lazyLoading()
				} else {
					uni.$http.get("/api/get/searchActive", {
						query: this.searchKeyword,
						userId: this.userInfo._id,
						currentSemester: this.selectedSemester
					}).then((res) => {

						if (res.data.code === 202) {
							this.filteredActiveData = res.data.data.list;
							this.total = res.data.data.total;
						} else {
							uni.showToast({
								title: "搜索失败",
								icon: "none"
							});
						}
					}).catch((err) => {
						console.error(err);
						uni.showToast({
							title: "搜索出错",
							icon: "none"
						});
					});
				}
			},
			toVisualizing(id, isSign, isCheckOut, volunteerCounts, title, audit) {
				uni.navigateTo({
					url: "../../subpkg-visualization/Visualization/Visualization?isSign=" + isSign +
						"&volunteerCounts=" + JSON.stringify(volunteerCounts) + "&title=" + title + "&id=" + id +
						"&audit=" + audit + "&isCheckOut=" + isCheckOut
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
				this.page = 1
				this.activeData = []
				this.isloading = true
				this.getActiveData();
				this.loadTopItems();
			},
			getSemster() {
				uni.$http.get("/api/get/semesters").then((res) => {
					res.data.data.forEach(item => {
						this.semesters.push(item.name);
					});
				});
			},

			moveToTop(index, id) {
				const item = this.filteredActiveData.splice(index, 1)[0];
				this.filteredActiveData.unshift(item); // 置顶当前项

				// 获取已存储的置顶项
				let topItems = uni.getStorageSync('topItems') || [];

				// 检查是否已存在，不存在则添加
				if (!topItems.some(topItem => topItem._id === item._id)) {
					topItems.push(item);
					this.topItems.push(item)
					uni.setStorageSync('topItems', topItems); // 存储更新后的置顶项

				}
				uni.$http.post('/api/itVolunteer/top-items-save', {
					activityId: id,
					userId: this.userInfo._id,
					currentSemester: this.selectedSemester
				}).then(res => {
					uni.showToast({
						title: '已置顶',
						icon: 'success'
					});
				})
			},
			updateItems() {
				this.filteredActiveData = [...this.filteredActiveData]; // 复制原始数据到当前展示的 items
				this.topItems.forEach(topItem => {
					const index = this.filteredActiveData.findIndex(item => item._id === topItem._id);
					if (index !== -1) {
						// 移动置顶的项到数组前面
						const [movedItem] = this.filteredActiveData.splice(index, 1);
						this.filteredActiveData.unshift(movedItem);
					}
				});
			},
			removeTop(index) {
				const item = this.filteredActiveData[index];
				// 从 topItems 中移除该项
				this.topItems = this.topItems.filter(topItem => topItem._id !== item._id);
				uni.setStorageSync('topItems', this.topItems);

				// 将数据恢复到原来的位置
				this.updateItems();
				uni.$http.post('/api/itVolunteer/top-items-cancle', {
					activityId: item._id,
					userId: this.userInfo._id,
					currentSemester: this.selectedSemester
				}).then(res => {
					uni.showToast({
						title: '已取消置顶',
						icon: 'success'
					});
				})

			},
			loadTopItems() {
				uni.$http.get('/api/itVolunteer/top-items-user', {
					userId: this.userInfo._id,
					currentSemester: this.selectedSemester
				}).then(res => {
					this.topItems = [];
					this.topItems = res.data.data.list || [];
					uni.setStorageSync('topItems', this.topItems);
					const topItems = uni.getStorageSync('topItems') || [];

					topItems.forEach(topItem => {
						// 检查是否已存在于 activeData 中，且当前项的学期与所选学期相同
						const isItemExists = this.activeData.some(item => item._id === topItem._id);
						const isCurrentSemester = topItem.currentSemester === this.selectedSemester;

						// 确保不重复添加置顶项，且满足学期条件
						if (!isItemExists && isCurrentSemester) {
							this.activeData.unshift(topItem); // 添加置顶项
						}
					});
				})

			},

			// 处理点击事件，根据点击选项执行操作
			onClick(e, id, title, deadline, description, isSign, mdUrl, address, limitPerson, startTime, groupNum,
				groupCode, index, isCheckOut, transpire) {
				let {
					content
				} = e;

				switch (content.text) {
					case '删除':
						this.deleteItem(id, title, mdUrl, index);
						break;
					case '修改':
						this.updateActivity(id, title, deadline, description, isSign, mdUrl, address, limitPerson,
							startTime, groupNum, groupCode, isCheckOut, transpire);
						break;
					case 'xlsx':
						this.downloadAndWriteToFile(id, title, isSign, isCheckOut);
						break;
					case '置顶':
						this.moveToTop(index, id);
						break;
					case '取消置顶':
						this.removeTop(index);
						break;

					default:
						console.warn('未识别的操作');
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
			change(e, id, index) {
				const isTop = this.topItems.some(item => item._id === id);
				// 更新对应的 optionsList
				this.optionsList[index] = this.optionsList[index].map((option, idx) => {
					if (idx === 0) { // 更新第一个选项
						return {
							text: isTop ? '取消置顶' : '置顶',
							style: {
								backgroundColor: isTop ? '#ff7f50' : '#f5a623'
							}
						};
					}
					return option; // 保持其他项不变
				});
			},

			// getCurrentSemester() {
			// 	const currentDate = new Date();
			// 	const currentYear = currentDate.getFullYear();
			// 	const currentMonth = currentDate.getMonth() + 1;

			// 	let semester;
			// 	if ((currentMonth >= 9 && currentMonth <= 12) || (currentMonth >= 1 && currentMonth < 3)) {
			// 		semester = '第一学期';
			// 	} else if (currentMonth >= 3 && currentMonth <= 6) {
			// 		semester = '第二学期';
			// 	} else {
			// 		semester = '寒假/暑假';
			// 	}

			// 	const academicYear = `${currentYear-1}-${currentYear}学年度`;
			// 	return `${academicYear}${semester}`;
			// },
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
			updateActivity(id, title, deadline, description, isSign, mdUrl, address, limitPerson, startTime, groupNum,
				groupCode, isCheckOut, transpire) {
				uni.navigateTo({
					url: "../updateRelease/updateRelease?id=" + id + "&title=" + title +
						"&deadline=" + deadline + "&description=" + description + "&isSign=" + isSign + "&mdUrl=" +
						mdUrl + "&address=" + address + "&limitPerson=" + limitPerson + "&startTime=" + startTime +
						"&groupNum=" + groupNum + "&groupCode=" + groupCode + "&isCheckOut=" + isCheckOut +
						"&transpire=" + transpire
				});
			},
			deleteItem(id, title, cover, index) {
				uni.showModal({
					content: '您确定要删除活动' + title + "?",
					success: (e) => {
						if (e.confirm) {
							uni.$http.post("/api/itVolunteer/deleteActivity", {
								id: id,
								vtCover: cover,
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
			downloadAndWriteToFile(id, title, isSign, isCheckOut) {
				uni.$http.get('/api/itVolunteer/volunteers', {
					activityId: id
				}).then((res) => {
					if (res.data.message === "该活动暂无人参与") {
						this.message = res.data.message;
					} else {
						this.list = res.data;
						exportToExcel(res.data, title, isSign, isCheckOut)
					}
				});
			},
			getActiveData() {
				this.loading = true
				uni.$http.get("/api/itVolunteer/activeUserId", {
					userId: this.userInfo._id,
					currentSemester: this.selectedSemester,
					page: this.page
				}).then((res) => {
					if (res.errMsg == "request:ok") {
						this.total = res.data.data.total
						setTimeout(() => {
							this.loading = false
							this.isloading = false
							this.activeData = this.activeData.map(item => {
								const newItem = res.data.data.list.find(t => t._id === item._id);
								return newItem ? {
									...item,
									...newItem
								} : item;
							}).concat(
								res.data.data.list.filter(newItem => !this.activeData.some(item => item
									._id === newItem._id))
							);
							this.filteredActiveData = this.activeData;
							this.initializeOptionsList()
							this.loadTopItems();
						}, 1000)
					}
				}).catch(error => {
					if (error) {
						this.isloading = true
					}
				});
			},
			application(id, isSign, title, audit, isCheckOut) {
				uni.navigateTo({
					url: "../../subpkg-activity/signPage/signPage?id=" + id + "&isSign=" + isSign + "&title=" +
						title + "&audit=" + audit + "&isCheckOut=" + isCheckOut
				})
			},
			lazyLoading() {
				this.page = this.page
				this.getActiveData()
				this.loadTopItems();
			},
		},
		onShow() {
			this.lazyLoading()
		},
		onLoad(options) {
			this.isSign = options.sign
			this.baseURL = uni.baseURL
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

	.search-box {
		display: flex;
		padding: 10rpx;
		background-color: #fff;
		position: fixed;
		top: 80rpx;
		left: 0;
		right: 0;
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
		margin-top: 180rpx;
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
				background-color: #ff7f50;
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