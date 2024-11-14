<template>
	<view class="container">
		<view class="search-box">
			<input type="text" placeholder="搜索学生干部" v-model="searchQuery" @input="filterUserInfo" />
		</view>

		<view class="info-box">
			<view class="info-list">
				<view class="info-item">
					<view class="info-item__val" style="width: 100%; text-align: center;">
						第{{ info.weekNum }}周&nbsp;周{{ convertToChineseNumber(info.week) }}&nbsp;第{{ ChineseNumber(info.section) }}节
					</view>
				</view>
				<loading v-if="isShow"></loading>
				<view class="info-item" v-for="(item, index) in filteredUserInfo" :key="index" v-else>
					<view class="info-item__val">
						{{ index + 1 }}. {{ item.name }}
						[{{item.institution===item.position.includes(item.institution)?' ':item.institution}}]
						{{ item.position }}
					</view>
					<view class="call-button" @click="makeCall(item.phone, item.position, item.name)">
						<image src="../../static/orderImgs/phone.png"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
	<BackToTop ref="VT" :scrollTop="top"></BackToTop>
</template>

<script>
	import BackToTop from '../../components/backToTop/backToTop.vue'
	import loading from '../../components/loading/loading.vue'
	export default {
		data() {
			return {
				info: [], // 课程和用户信息
				isShow: true, // 是否显示信息
				searchQuery: '', // 搜索框输入值
				filteredUserInfo: [], // 存储经过搜索过滤后的用户信息
				freeUserInfo: []
			};
		},
		components: {
			BackToTop
		},
		onLoad(options) {
			let info = JSON.parse(options.info);
			this.info = info;
			this.getFreeUserInfo(); // 页面加载时获取用户信息
		},
		onPageScroll(e) {
			//调用子组件方法
			this.$refs.VT.topData(e.scrollTop);
		},
		methods: {
			// 获取空闲学生干部信息
			getFreeUserInfo() {
				uni.$http.get('/api/course/findUsersWithNoClassByWeekCadre', {
					targetWeekNum: this.info.weekNum,
					targetDay: this.info.day,
					targetSection: this.info.section,
					userId: uni.getStorageSync('userInfo')._id
				}).then((res) => {
					if (res.errMsg == "request:ok") {
						this.info.user_info = this.customSort(res.data.usersWithNoClassByWeek.user_info); // 排序用户信息
						this.filteredUserInfo = this.info.user_info; // 初始化为全部用户信息
						setTimeout(() => {
							this.isShow = false
						}, 1000)
					}
					
				}).catch(error => {
				console.error(error);
				if (error) {
					this.showload = true
				}
			});
			},

			customSort(data) {

				const roleOrder = {

					"分团委副书记": 1,

					"分团委学生办公室主任": 2,

					"学生分会主席": 3,

					"学生分会副主席": 4,

					"校友分会会长": 5,

					"对外联络部部长": 6,

					"对外联络部副部长": 7,

					"对外联络部干事": 8,

					"体育部部长": 9,

					"体育部副部长": 10,

					"体育部干事": 11,

					"秘书处部长": 12,

					"秘书处副部长": 13,

					"秘书处干事": 14,

					"文艺部部长": 15,

					"文艺部副部长": 16,

					"文艺部干事": 17,

					"生活权益部部长": 18,

					"生活权益部副部长": 19,

					"生活权益部干事": 20,

					"学习部部长": 21,

					"学习部副部长": 22,

					"学习部干事": 23,

					"辩论队队长": 24,

					"辩论队副队长": 25,

					"辩论队干事": 26,

					"青年志愿者服务中心部长": 27,

					"青年志愿者服务中心副部长": 28,

					"青年志愿者服务中心干事": 29,

					"记者团部长": 30,

					"记者团副部长": 31,

					"记者团干事": 32,

					"技术部部长": 33,

					"技术部副部长": 34,

					"技术部干事": 35,

					"组织部部长": 36,

					"组织部副部长": 37,

					"组织部干事": 38,

					"宣传部部长": 39,

					"宣传部副部长": 40,

					"宣传部干事": 41,

					"联络部部长": 42,

					"联络部副部长": 43,

					"联络部干事": 44

				};

				return data.sort((a, b) => {
					const orderA = roleOrder[a.position] || 999; // 如果职位不在规则中，放到后面
					const orderB = roleOrder[b.position] || 999;
					return orderA - orderB;
				});
			},

			// 将数字转换为中文
			convertToChineseNumber(num) {
				const chineseNumbers = ['一', '二', '三', '四', '五', '六', '日'];
				return (num >= 1 && num <= 7) ? chineseNumbers[num - 1] : '未知';
			},

			ChineseNumber(num) {
				const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
				return (num >= 1 && num <= 12) ? chineseNumbers[num - 1] : '未知';
			},

			// 过滤用户信息，搜索功能
			filterUserInfo() {
				const query = this.searchQuery.toLowerCase(); // 转为小写
				this.filteredUserInfo = this.info.user_info.filter(item => {
					const nameMatch = item.name.toLowerCase().includes(query);
					const institutionMatch = item.institution.toLowerCase().includes(query);
					const positionMatch = item.position.toLowerCase().includes(query);
					// 如果任意一个字段匹配查询字符串，就返回该项目
					return nameMatch || institutionMatch || positionMatch;
				});
			},

			// 拨打电话功能
			makePhone(phone) {
				const phoneRegex = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
				if (phoneRegex.test(phone)) {
					uni.makePhoneCall({
						phoneNumber: phone
					});
				} else {
					uni.showToast({
						icon: "none",
						title: "该手机号不正确，无法拨打",
						duration: 1500
					});
				}
			},

			// 点击拨打电话
			makeCall(phone, position, name) {
				if (phone) {
					uni.showModal({
						content: `您确定要给 ${position} ${name} 打电话嘛！`,
						success: (e) => {
							if (e.confirm) {
								this.makePhone(phone);
							}
						}
					});
				} else {
					uni.showToast({
						title: '未提供电话号码',
						icon: 'none'
					});
				}
			}
		}
	};
</script>
<style lang="scss">
	page {
		background: #fafafa;
	}

	.search-box {
		padding: 16rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #e0e0e0;
	}

	input {
		width: 100%;
		padding: 12rpx;
		border: 1rpx solid #ccc;
		border-radius: 4rpx;
	}

	.info-box {
		background-color: #fff;
		padding: 0rpx 30rpx 0;
	}

	.info-list {
		margin-top: 10rpx;
	}

	.info-item {
		display: flex;
		align-items: center;
		padding: 24rpx;
		background-color: #ffffff;
		border-radius: 12rpx;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1); // 添加阴影
		margin-bottom: 16rpx; // 卡片之间的间隔
		border: 1rpx solid rgba(243, 243, 243, 0.82); // 添加细边框
	}

	.info-item__val {
		color: #333; // 调整文字颜色为深色
		flex: 1; // 保持项目在行内均匀分布
		font-size: 32rpx; // 调整文字大小
	}

	.call-button {
		margin-left: 16rpx;
		width: 80rpx;
		height: 80rpx;
		background-color: #007AFF;
		color: white;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2); // 增加按钮的阴影
		display: flex;
		justify-content: center;
		align-items: center;
	}

	image {
		width: 40rpx;
		height: 40rpx;
	}
</style>