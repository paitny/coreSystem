<template>



	<view class="search-container">
		<uni-search-bar :focus="false" :radius="20" bgColor="#F7F7F7" cancelButton="none" v-model="keyword"
			ref="searchBar"></uni-search-bar>
	</view>
	<loading v-if="isloading"></loading>
	<view class="" v-else>

		<view class="msg" v-if="list.length===0">
			<text>
				暂无人参与

			</text>

		</view>
		<view class="" style="margin-top: 100rpx;">


			<view class="content" v-for="item in list" :key="item._id">
				<image :src="`${baseURL}${item.photo}`" mode=""></image>
				<view class="uni-list-cell uni-list-cell-pd Typesetting">
					<view class="signContent">
						<view>姓名：{{item.name}}</view>
						<view>学号：{{item.num}}</view>
						<view>机构：{{item.institution}}</view>
						<view>职位：{{item.position}}</view>
						<view>辅导员：{{item.counsellor}}</view>
						<view>电话号码：<span
								@click="goMakePhone(item.phone,item.institution,item.position,item.name)">{{item.phone}}</span>
						</view>
					</view>
				</view>

			</view>
		</view>

	</view>
</template>

<script>
	import loading from '../../components/loading/loading.vue'
	export default {

		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				list: [],
				baseURL: "",
				aid: "",
				switchValue: false,
				buttonDisabled: false,
				isDisabled: false,
				buttonText: "签到",
				buttonColor: '#007aff',
				checkInTime: null,
				message: "",
				isShow: false,
				activityId: "",
				keyword: "",
				lable: "",
				isloading: true
			};
		},
		onLoad(options) {
			
			this.lable = options.label
			this.baseURL = uni.baseURL;
			this.activityId = options.id
			this.isShow = JSON.parse(options.isSign)
			this.getuserInfo()
		},

		computed: {
			// 根据搜索关键词过滤数据列表
			list() {
				return this.list.filter(item =>
					item.institution.toLowerCase().includes(this.keyword.toLowerCase())
				);
			}
		},
		methods: {
			getuserInfo() {
				
				uni.$http.get('/api/itVolunteer/volunteersID', {
					activityId: this.activityId,
					lable: this.lable
				}).then((res) => {
					

					if (res.errMsg == "request:ok") {
						this.list = res.data
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

			onClick(e, id, name) {
				
				let {
					content
				} = e;
				if (content.text === '删除') {
					this.deleteUserInfo(id, name)
					//点击选项按钮时触发事件	
					//e = {content,index} ，content（点击内容）、index（下标）、position (位置信息)
				}
			},
			goMakePhone(phone, grade, classes, name) {
				uni.showModal({
					content: '您确定要给' + grade + classes + name + '打电话嘛！',
					success: (e) => {
						if (e.confirm) {
							this.makePhone(phone)
						}
					}
				});
			},
			makePhone(phone) {
				// 验证手机号的正则表达式
				const phoneRegex = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;

				// 将传入的phone参数转换为字符串
				const phoneNumber = String(phone);

				// 使用正则表达式进行验证
				if (phoneRegex.test(phoneNumber)) {
					// 如果手机号合法，调用uni.makePhoneCall
					uni.makePhoneCall({
						phoneNumber: phoneNumber
					});
				} else {
					// 如果手机号不合法，可以进行相应的处理，例如打印错误信息
					return uni.showToast({
						icon: "none",
						title: "该手机号不正确，无法拨打",
						duration: 1500
					})
				}



			},
			handleCheckIn(id, item) {
				uni.$http.post('/api/itVolunteer/check-in', {
					volunteerId: id
				}).then((res) => {
					// 更新相应item的checkInTime
					const updatedItemIndex = this.list.findIndex(i => i._id === id);
					if (updatedItemIndex !== -1) {
						this.$set(this.list[updatedItemIndex], 'checkInTime', res.data.checkInTime);
						// 更新按钮状态和文本
						this.$set(this.list[updatedItemIndex], 'buttonText', '已签到');
						this.$set(this.list[updatedItemIndex], 'disabled', true);
					}
					uni.showToast({
						duration: 1500,
						title: res.data.message,
						icon: "none"
					})
				})
			},

			deleteUserInfo(id, name) {
				uni.showModal({
					content: '您确定要删除' + name + "的报名信息?",
					success: (e) => {
						if (e.confirm) {
							uni.$http.delete("/api/itVolunteer/deleteVtInfo", {
								id: id
							}).then((res) => {
								uni.showToast({
									icon: "none",
									title: res.data.msg
								})
								this.getuserInfo()


							});
						}
					}
				});
			},
			getButtonColor(checkInTime) {
				if (checkInTime === null && this.isDisabled === false) {
					return '#007aff';
				} else {
					return 'gray';
				}
			},
			getButtonText(checkInTime) {
				if (checkInTime === null && this.isDisabled === false) {
					return '签到';
				} else {
					return '已签到';
				}
			},
			showTost() {
				uni.showToast({
					duration: 1500,
					title: "该活动无需签到",
					icon: "none"
				})
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
		/* 垂直方向居中 */
		height: 100vh;
		/* 设置容器高度占满视口高度 */
	}

	.content {
		display: flex;
		width: 95%;
		background-color: white;
		font-size: 28rpx;
		border-radius: 20rpx;
		margin: 20rpx auto 0 20rpx;
		align-items: center;

		image {
			width: 160rpx;
			height: 160rpx;
			border-radius: 10rpx;
			margin-left: 30rpx;
		}

		.Typesetting {
			display: flex;
			justify-content: space-between;
			padding: 20rpx;
			align-items: center;

			.signContent {
				height: 200rpx;
				display: flex;
				flex-direction: column;
				/* 设置为垂直方向排列 */
				justify-content: space-around;

				/* 在交叉轴上平均分布 */
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