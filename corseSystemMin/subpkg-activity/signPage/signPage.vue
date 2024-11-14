<template>
	<view class="search-container">
		<uni-search-bar :focus="false" :radius="20" bgColor="#F7F7F7" cancelButton="none" v-model="keyword"
			ref="searchBar" @input="userInput"></uni-search-bar>
	</view>
	<view class="msg" v-if="list.length === 0">
		<text>
			{{ message }}
		</text>
	</view>
	<loading v-if="isloading"></loading>
	<view class="" style="margin-top: 100rpx;" v-else>
		<view class="content" v-for="(item, index) in filteredList" :key="index">
			<uni-swipe-action-item :right-options="options" :left-options="options"
				@click="onClick($event, item._id, item.name)">
				<view class="uni-list-cell uni-list-cell-pd Typesetting">
					<view class="signContent">
						<view>姓名：{{ item.name }}</view>
						<view>学号：{{ item.ID }}</view>
						<view>班级：{{ item.grade }}{{ item.classes }}</view>
						<view>层次：{{ item.levels }}</view>
						<view>辅导员：{{ item.counsellor }}</view>
						<view>电话号码：<span
								@click="goMakePhone(item.phoneNumber, item.grade, item.classes, item.levels, item.name)">{{ item.phoneNumber }}</span>
						</view>
					</view>
					<view class="signContent" v-if="isShow">
						<button @click="handleSignToggle(item)" :disabled="item.disabled" class="btnSign"
							:style="{ backgroundColor: getButtonColor(item) }">
							{{ getButtonText(item) }}
						</button>
					</view>
					<view class="disSign" v-else>
						<image src="../../static/img/disSign.png" mode="" @click="showTost"></image>
					</view>
				</view>
			</uni-swipe-action-item>
		</view>
	</view>
	<activityData @upload-success="handleUploadSuccess" @upload-branchSuccess="handlebranchSuccess"
		:activityId="activityId" :isShow="showUpload" :currentName="activityName" :isaudit="audit"></activityData>
</template>

<script>
	import loading from '../../components/loading/loading.vue';
	import activityData from '../../components/activityData/activityData.vue';
	export default {
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				showUpload: true,
				list: [],
				baseURL: "",
				aid: "",
				switchValue: false,
				buttonDisabled: false,
				isDisabled: false,
				message: "",
				isShow: false,
				activityId: "",
				keyword: "",
				isloading: true,
				activityName: '',
				audit: Boolean,
				isCheckOut: Boolean,
				checkInTime: {}, // 用于存储每个用户的签到时间
			};
		},
		components: {
			loading,
			activityData
		},
		onLoad(options) {
			this.baseURL = uni.baseURL;
			this.activityId = options.id;
			this.activityName = options.title;
			this.isShow = JSON.parse(options.isSign);
			this.audit = JSON.parse(options.audit);
			this.isCheckOut = JSON.parse(options.isCheckOut);

			this.getuserInfo();


		},
		computed: {

			filteredList() {
				return this.list.filter(item =>
					item.name.toLowerCase().includes(this.keyword.toLowerCase()) ||
					item.ID.toLowerCase().includes(this.keyword.toLowerCase()) ||
					item.grade.toLowerCase().includes(this.keyword.toLowerCase()) ||
					item.classes.toLowerCase().includes(this.keyword.toLowerCase()) ||
					item.levels.toLowerCase().includes(this.keyword.toLowerCase()) ||
					item.counsellor.toLowerCase().includes(this.keyword.toLowerCase()) ||
					item.phoneNumber.toLowerCase().includes(this.keyword.toLowerCase())
				);
			}


		},

		methods: {
			handleUploadSuccess(data) {
				this.list = data.data;
				this.showUpload = false;
			},
			handlebranchSuccess(data) {
				this.getuserInfo();
				this.showUpload = true;
			},
			userInput() {

				this.sortByCheckInTime()
			},
			getuserInfo() {
				uni.$http.get('/api/itVolunteer/volunteers', {
					activityId: this.activityId
				}).then((res) => {
					this.isloading = true;
					if (res.errMsg === "request:ok") {
						if (res.data.message === "该活动暂无人参与") {
							this.message = res.data.message;
							this.isloading = false;
						} else {


							this.list = res.data.map(item => ({
								...item,
								disabled: item.checkInTime !== null && item.checkOutTime !==
									null // 禁用逻辑
							}));
							this.sortByCheckInTime()
							this.isloading = false;
						}
					}
				}).catch(error => {
					if (error) {
						this.isloading = true;
					}
				});
			},
			onClick(e, id, name) {
			
				let {
					content
				} = e;
				if (content.text === '删除') {
					this.deleteUserInfo(id, name)
				}
			},
			// 添加一个新的方法,实现按照签到状态进行排序
			sortByCheckInTime() {
				return this.list.sort((a, b) => {
					if (a.checkInTime === null && b.checkInTime !== null) {
						return -1; // a 在 b 前面
					} else if (a.checkInTime !== null && b.checkInTime === null) {
						return 1; // b 在 a 前面
					} else if (a.checkOutTime === null && b.checkOutTime !== null) {
						return -1; // a 在 b 前面
					} else if (a.checkOutTime !== null && b.checkOutTime === null) {
						return 1; // b 在 a 前面
					} else {
						return 0; // 相等，不改变顺序
					}
				});
			},
			handleSignToggle(item) {
				const now = new Date(); // 获取当前时间

				// 判断是否尚未签到
				if (item.checkInTime === null) {
					this.handleCheckIn(item._id, item);
				} else if (this.isCheckOut && item.checkOutTime === null) {
					const checkInTime = new Date(item.checkInTime); // 获取签到时间
					const timeDiff = (now - checkInTime) / 1000 / 60; // 计算签到时间与当前时间的差，单位为分钟

					// 判断是否已超过5分钟
					if (timeDiff >= 5) {
						this.handleCheckOut(item._id, item); // 超过5分钟允许签退
					} else {
						uni.showToast({
							title: "签到5分钟后才能签退",
							icon: "none",
							duration: 2000
						});
					}
				}
			},

			handleCheckIn(id, item) {
				uni.$http.post('/api/itVolunteer/check-in', {
					volunteerId: id
				}).then((res) => {
					const updatedItemIndex = this.list.findIndex(i => i._id === id);
					if (updatedItemIndex !== -1) {
						const currentTime = new Date(); // 获取当前时间
						this.$set(this.list[updatedItemIndex], 'checkInTime', currentTime);
						this.$set(this.checkInTime, id, currentTime); // 存储签到时间
						this.$set(this.list[updatedItemIndex], 'checkOutTime', null); // 确保签退时间为null
						this.$set(this.list[updatedItemIndex], 'disabled', false);
					}
					uni.showToast({
						duration: 1500,
						title: res.data.message,
						icon: "none"
					});
				});
			},

			handleCheckOut(id, item) {
				uni.$http.post('/api/itVolunteer/check-out', {
					volunteerId: id
				}).then((res) => {
					const updatedItemIndex = this.list.findIndex(i => i._id === id);
					if (updatedItemIndex !== -1) {
						this.$set(this.list[updatedItemIndex], 'checkOutTime', res.data.checkOutTime);
						this.$set(this.list[updatedItemIndex], 'disabled', true);
					}
					uni.showToast({
						duration: 1500,
						title: res.data.message,
						icon: "none"
					});
				});
			},
			goMakePhone(phone, grade, classes, levels, name) {
				uni.showModal({
					content: '您确定要给' + grade + classes + levels + name + '打电话嘛！',
					success: (e) => {
						if (e.confirm) {
							this.makePhone(phone);
						}
					}
				});
			},
			makePhone(phone) {
				const phoneRegex = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
				const phoneNumber = String(phone);
				if (phoneRegex.test(phoneNumber)) {
					uni.makePhoneCall({
						phoneNumber: phoneNumber
					});
				} else {
					return uni.showToast({
						icon: "none",
						title: "该手机号不正确,无法拨打",
						duration: 1500
					});
				}
			},
			deleteUserInfo(id, name) {
				uni.showModal({
					content: '您确定要删除' + name + "的报名信息?",
					success: (e) => {
						if (e.confirm) {
							uni.$http.post("/api/itVolunteer/deleteVtInfo", {
								id: id
							}).then((res) => {
								uni.showToast({
									icon: "none",
									title: res.data.msg
								});
								this.getuserInfo();
							});
						}
					}
				});
			},
			getButtonColor(item) {
				if (this.isCheckOut) {
					if (item.checkInTime === null) {
						return '#007aff'; // 签到按钮颜色
					} else if (item.checkOutTime !== null) {
						return 'gray'; // 已签退按钮颜色
					} else if (this.canSignOut(item)) {
						return '#FFA500'; // 签退按钮颜色
					} else {
						return 'red'; // 不能签退
					}
				} else {
					if (item.checkInTime === null) {
						return '#007aff'; // 签到按钮颜色
					} else {
						return 'gray'; // 已签到按钮颜色
					}
				}
			},

			getButtonText(item) {
				if (this.isCheckOut) {
					if (item.checkInTime === null) {
						return '签到';
					} else if (item.checkOutTime !== null) {
						return '已签退';
					} else if (this.canSignOut(item)) {
						return '签退';
					} else {
						return '未签退'; // 如果不能签退
					}
				} else {
					if (item.checkInTime === null) {
						return '签到';
					} else {
						return '已签到';
					}
				}
			},

			canSignOut(item) {
				if (!item.checkInTime) return false; // 如果没有签到时间
				const now = new Date();
				const checkInTime = new Date(item.checkInTime);
				const timeDiff = (now - checkInTime) / 1000 / 60; // 计算时间差，单位为分钟
				return timeDiff >= 5; // 检查是否超过5分钟
			},

			// getButtonColor(item) {
			// 	if (this.isCheckOut) {
			// 		if (item.checkInTime === null) {
			// 			return '#007aff'; // 签到按钮颜色
			// 		} else if (item.checkOutTime !== null) {
			// 			return 'gray'; // 已签退按钮颜色
			// 		} else {
			// 			return '#FFA500'; // 签退按钮颜色
			// 		}
			// 	} else {
			// 		if (item.checkInTime === null) {
			// 			return '#007aff'; // 签到按钮颜色
			// 		} else {
			// 			return 'gray'; // 签退按钮颜色
			// 		}
			// 	}

			// },
			// getButtonText(item) {
			// 	if (this.isCheckOut) {
			// 		if (item.checkInTime === null) {
			// 			return '签到';
			// 		} else if (item.checkOutTime !== null) {
			// 			return '已签退';
			// 		} else {
			// 			return '签退';
			// 		}
			// 	} else {
			// 		if (item.checkInTime === null) {
			// 			return '签到';
			// 		} else {
			// 			return '已签到';
			// 		}
			// 	}

			// },


			showTost() {
				uni.showToast({
					duration: 1500,
					title: "该活动无需签到",
					icon: "none"
				});
			}
		},
	};
</script>

<style lang="scss" scoped>
	.search-container {
		width: 100%;
		background-color: #fff;
		position: fixed;
		z-index: 999;
		top: 0;
		left: 0;
	}

	.msg {
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 100vh;
	}

	.content {
		width: 95%;
		background-color: white;
		font-size: 28rpx;
		border-radius: 20rpx;
		margin: 20rpx auto;

		.Typesetting {
			display: flex;
			justify-content: space-between;
			padding: 20rpx;
			align-items: center;
			width: 95%;
			;

			.signContent {

				display: flex;
				flex-direction: column;
				justify-content: space-around;

				.btnSign {
					color: #fff;
				}
			}

			.disSign {
				image {
					width: 100rpx;
					height: 100rpx;
				}
			}
		}
	}
</style>