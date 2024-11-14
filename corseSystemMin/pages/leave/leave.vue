<template>
	<view class="container" @click="toggleChildVisibility">
		<view class="notice_msg">

			<!-- <view class="notice">
				<view class="title">新生留言弹幕</view>
				<view class="barrage-box">
					<view v-for="(item, index) in currentBatch" :key="index" class="barrage-item"
						:style="{ top: `${index * 30}px`, color: messageColors[index], animationDuration: `${animationDuration}s`, animationDelay: `${index * 0.5}s`, animationPlayState: playStates[index] }"
						@touchstart="pauseAnimation(index)" @touchend="resumeAnimation(index)"
						@click="pauseForThreeSeconds(index)">
						{{ item }}
					</view>
				</view>
			</view> -->

			<view class="notice">
				<view class="title">公告栏</view>
				<br>
				<view class="notice-container">
					<view>{{notice}}</view>
				</view>


			</view>


		</view>
		<Notice ></Notice>
		<view class="leave_list">
			<view class="leave_tab" v-for="(item,index) in tabs" :key="index" @tap='switchTab(index)'>
				<text :class="currentNavtab===index?'f-active-color':'f-color'">{{item}}</text>
			</view>
			<text class="send_msg" @click="sendLeave">发布信息</text>

			<view class="leave" v-for="(item,index) in list" :key="item._id">
				<view class="leave_item">
					<view class="head_img">
						<image class="hImg" :src="getImageUrl(item.user.photo)"></image>
					</view>
					<view class="right">
						<view class="top">
							<view class="title">{{item.user.nickName}} <span
									style="font-size: 26rpx;">{{formatTimestamp(item.date)}}</span></view>

							<!-- 		<text class="leave_time">{{date(2020-06-22 09:57)}}</text> -->

							<view class="leave_type">#{{item.leaveType}}#</view>


							<view class="leave_content">{{item.leaveContent}}</view>
						</view>
						<view class="leave_img">

							<image class="img" v-for="(itemImage,index) in item.images"
								:src="`${baseURL}${itemImage.filename}`" mode="" :key="index"
								@click=" previewImage(index,item.images)"></image>

						</view>
					</view>
				</view>
				<view class="leaveFunction">
					<view class="reply" @click.stop="showComment(item._id)">
						<image src="../../static/orderImgs/comment.png" mode=""></image>
					</view>
					<view class="like" @click="handTrendLike(item._id)">
						<image src=" ../../static/orderImgs/dislike.png" mode=""
							v-if="userInfo._id && item.likes.includes(userInfo._id)"></image>
						<image src="../../static/orderImgs/like.png" mode="" v-else></image>
					</view>

				</view>
				<view v-if="item.nickNameLikes.length > 0&&item.nickNameLikes[0].nickName!=='暂无'" class="nickNameLikes">
					<span v-for="(likePerson, index) in item.nickNameLikes" :key="likePerson._id">
						{{ likePerson.nickName }}{{ index !== item.nickNameLikes.length - 1 ? '、' : (item.nickNameLikes.length > 1 ? '' : '') }}
						<!-- If it's the last nickname, add a period -->
						{{ index === item.nickNameLikes.length - 1 ? '.' : '' }}
					</span>
					等{{ item.nickNameLikes.length }}人觉得很赞
				</view>



			</view>
		</view>
		<view class="nodata" v-if='list.length===0'>暂无动态</view>
	</view>

	<Comment ref="comment" :isVisible="isVisible" :trendId="trendId" :comments="comments" @close="closeCommentSection"
		@getComments="getComments">
	</Comment>
</template>

<script>
	import moment from 'moment'
	import Notice from '../../components/notice/notice.vue'
	import Comment from '../../components/comment/comment.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				messages: [], // 从后端获取的弹幕数据
				currentBatch: [], // 当前显示的消息批次
				messageColors: [], // 每条消息的随机颜色
				playStates: [], // 控制每条消息的动画状态
				animationDuration: 10, // 动画持续时间
				batchSize: 5, // 每批显示的消息数量
				batchIndex: 0, // 当前批次的索引
				isTransitioning: false, // 是否在批次切换中
				currentNavtab: 0,
				tabs: ["最新发布", "前一天发布"],
				list: [],
				heightEle: 0,
				baseURL: "",
				isVisible: false,
				scrollTop: 0,
				trendId: "",
				comments: [],
				notice: '',
			}
		},
		created() {
			this.checkLoginPage()
			this.getMessages()

		},
		onLoad() {

			this.baseURL = uni.baseURL
			this.switchTab(0)
			this.getNewsListNotice()


		},
		components: {
			Notice,
			Comment
		},
		computed: {

			...mapState(['userInfo']),

		},

		methods: {

			async getNewsListNotice() {
				const {
					data
				} = await uni.$http.get('/api/get/latestNotice')
				this.notice = data.noticeComment
			},
			getMessages() {
				uni.$http.get("/api/trends/latest").then((res) => {
					this.messages = res.data.messages
					this.generateMessageColors(); // 生成每条消息的随机颜色
					this.initializePlayStates(); // 初始化动画状态
					this.setBatchMessages(); // 设置第一批消息
					this.startBatchTimer(); // 开始批次滚动定时器
					console.log(res.data.messages);
				})
			},
			// 生成随机颜色
			generateMessageColors() {
				this.messageColors = this.messages.map(() => this.getRandomColor());
			},
			// 初始化播放状态
			initializePlayStates() {
				this.playStates = this.messages.map(() => 'running');
			},
			// 生成随机颜色
			getRandomColor() {
				const letters = '0123456789ABCDEF';
				let color = '#';
				for (let i = 0; i < 6; i++) {
					color += letters[Math.floor(Math.random() * 16)];
				}
				return color;
			},
			// 设置当前批次的消息
			setBatchMessages() {
				const startIndex = this.batchIndex * this.batchSize;
				this.currentBatch = this.messages.slice(startIndex, startIndex + this.batchSize);
			},
			// 开始批次滚动的定时器
			startBatchTimer() {
				setInterval(() => {
					if (!this.isTransitioning) {
						this.batchIndex++;
						if (this.batchIndex * this.batchSize >= this.messages.length) {
							// 如果到最后一批，从头开始
							this.batchIndex = 0;
						}
						this.isTransitioning = true;
						this.setBatchMessages();
						setTimeout(() => {
							this.isTransitioning = false;
						}, this.animationDuration * 1000);
					}
				}, this.animationDuration * 1000); // 批次滚动时间间隔
			},
			// 暂停某条消息
			pauseAnimation(index) {
				this.$set(this.playStates, index, 'paused');
			},
			// 恢复某条消息
			resumeAnimation(index) {
				this.$set(this.playStates, index, 'running');
			},
			// 点击消息暂停三秒
			pauseForThreeSeconds(index) {
				this.pauseAnimation(index); // 暂停动画
				setTimeout(() => {
					this.resumeAnimation(index); // 三秒后恢复
				}, 3000);
			},
			toggleChildVisibility() {
				this.isVisible = false
			},
			getImageUrl(imgurl) {
				// 使用当前时间戳来确保每次都是不同的URL
				return this.baseURL + imgurl + '?timestamp=' + 111;
			},
			formatTimestamp(timestamp) {
				var now = new Date();
				var timestampDate = new Date(timestamp);

				var diff = now - timestampDate;
				var minutesDiff = Math.floor(diff / (1000 * 60));
				var hoursDiff = Math.floor(diff / (1000 * 60 * 60));
				var daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

				if (minutesDiff < 1) {
					return "刚刚";
				} else if (minutesDiff < 60) {
					return minutesDiff + "分钟前";
				} else if (hoursDiff < 24) {
					return hoursDiff + "小时前";
				} else if (daysDiff === 1) {
					return "昨天 " + timestampDate.getHours() + ":" + (timestampDate.getMinutes() < 10 ? '0' : '') +
						timestampDate.getMinutes();
				} else if (daysDiff < 3) {
					return daysDiff + "天前";
				} else {
					return timestampDate.getFullYear() + "-" + (timestampDate.getMonth() + 1) + "-" + timestampDate
						.getDate();
				}
			},
			inspectLogin(url, trendId) {

				uni.$http.post('/api/login/min/check', {
						id: this.userInfo._id
					})
					.then((res) => {
						if (res.data.code === 0) {
							uni.showToast({
								title: "未登录",
								icon: 'error',
								duration: 800
							})

						} else if (res.data.code === 2) {

							uni.showToast({
								title: "token已过期",
								icon: 'error',
								duration: 800
							})
						} else if (res.data.code === 1) {
							uni.$http.post(url, {
								id: trendId,
								userId: this.userInfo._id
							}).then((res) => {
								uni.showToast({
									title: res.data.msg,
									icon: 'none',
									duration: 1500
								})
								this.switchTab(this.currentNavtab)

							})
						}

					})

			},
			handTrendLike(id) {
				this.inspectLogin("/api/trends/like", id)
			},
			closeCommentSection() {
				this.isVisible = false
			},
			showComment(id) {
				this.trendId = id
				this.isVisible = true; // 设置 isVisible 为 true，显示评论区
				this.getComments()
			},
			getComments() {
				uni.$http.get("/api/trends/commentsAll", {
					dynamicId: this.trendId
				}).then((res) => {
					console.log(res);
					this.comments = res.data
				})
			},

			release() {
				wx.downloadFile({
					url: 'https://wypty.cn/static/file/userAgreement/ReleaseAgreement.pdf', // 自己换个其他的地址（"https://www.xxxxx.com/file/用户协议.pdf"）
					success: function(res) {

						if (res.statusCode != 200) {
							return false
						}
						var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
						wx.openDocument({
							filePath: Path,
							fileType: 'pdf',
							showMenu: true,
							success: function(res) {
								console.log('打开成功');
								// util.hideLoading()
							}
						})
					},
					fail: function(err) {
						console.log(err, "wx.downloadFile fail err");
						// util.hideLoadingWithErrorTips()
					}
				})
			},
			regicNet() {
				wx.downloadFile({
					url: 'https://wypty.cn/static/file/userAgreement/REGNIC.pdf', // 自己换个其他的地址（"https://www.xxxxx.com/file/用户协议.pdf"）
					success: function(res) {

						if (res.statusCode != 200) {
							return false
						}
						var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
						wx.openDocument({
							filePath: Path,
							fileType: 'pdf',
							showMenu: true,
							success: function(res) {
								console.log('打开成功');
								// util.hideLoading()
							}
						})
					},
					fail: function(err) {
						console.log(err, "wx.downloadFile fail err");
						// util.hideLoadingWithErrorTips()
					}
				})
			},
			switchTab(index) {

				this.currentNavtab = index
				if (index === 0) {

					uni.$http.get("/api/trends/getTrendsForToday").then((res) => {
						this.list = []
						this.list = res.data
						this.heightEle = res.data.length * 100
					})
				} else if (index === 1) {
					uni.$http.get("/api/trends/getTrendsForPreviousDay").then((res) => {
						this.list = []
						this.list = res.data
						this.heightEle = res.data.length * 100
					})
				}

			},
			//检测是否登录
			checkLoginPage() {
				uni.$http.post('/api/login/min/check', {
						id: uni.getStorageSync('userInfo')._id
					})
					.then((res) => {
						if (res.data.code === 0) {

							return uni.showModal({
								content: '登录注册才有权限噢！',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: "/pagesMe/login/login?type=2"
										})
									}
								}
							});


						} else if (res.data.code === 2) {
							return uni.showModal({
								content: '登录注册才有权限噢！',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: "/pagesMe/login/login?type=2"
										})
									}
								}
							});

						} else if (res.data.code === 1) {

							uni.setStorageSync('userInfo', res.data.data);
							uni.getStorage({
								key: 'userInfo', // 你存储的数据的键名
								success: (res) => {
									console.log(res);
									this.$store.commit('loginSuccess', res.data);
								},
								fail: (err) => {
									console.log('获取本地存储失败', err);
								}
							});
							this.$forceUpdate();
						}

					})


			},

			//检测是否登录
			checkLogin() {
				uni.$http.post('/api/login/min/check', {
						id: uni.getStorageSync('userInfo')._id
					})
					.then((res) => {
						if (res.data.code === 0) {

							return uni.showModal({
								content: '登录注册才有权限噢！',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: "/pagesMe/login/login?type=2"
										})
									}
								}
							});


						} else if (res.data.code === 2) {
							return uni.showModal({
								content: '登录注册才有权限噢！',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: "/pagesMe/login/login?type=2"
										})
									}
								}
							});

						} else if (res.data.code === 1) {
							uni.navigateTo({
								url: '../../subpkg-common/sendLeave/sendLeave'
							})
							this.$updateFn()
						}

					})


			},

			sendLeave() {
				this.checkLogin()

			},
			date(time) {
				return moment(time).format('YYYY-MM-DD')
			},
			previewImage(index, imageUrls) {
				const urls = []
				for (const name of imageUrls) {
					urls.push(this.baseURL + name.filename);
				}
				uni.previewImage({
					urls: urls, // 图片的URL数组
					current: index // 当前显示图片的索引
				});
			}

		},
		onShareAppMessage() { // 分享到微信
			// 更多参数配置，参考文档
			return {
				title: '学生动态',
				path: '/pages/leave/leave'
			}
		},

		onShareTimeline() { // 分享到朋友圈
			return {
				title: '学生动态',
				path: '/pages/leave/leave'
			}
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;

		.nodata {
			height: 500rpx;
			text-align: center;
			line-height: 500rpx;
		}

		.notice_msg {
			width: 100%;
			height: 500rpx;
			background-image: url("https://wypty.cn/static/file/material/trends.png");
			padding-top: 30rpx;
			background-size: 100% 100%;

			.search {
				height: 80rpx;
				width: 79%;
				border-radius: 50rpx;
				margin: 0 auto;
				background-color: white;
				background-repeat: no-repeat;
				padding-left: 3em;
				background-size: 8% 60%;
				background-position: 20rpx;
			}


			.notice-container {
				height: 250rpx;
				/* 设置一个固定高度 */
				overflow-y: auto;
				/* 添加垂直滚动条 */
				border: 1px solid #5bbfcb;
				/* 可选，添加边框以便于查看 */
				padding: 10px;
				/* 可选，内边距 */
				border-radius: 10rpx;
			}



			.notice {
				background-image: url("https://wypty.cn/static/file/material/leavebg.png");
				background-size: 100% 100%;
				background-repeat: no-repeat;
				width: 86%;
				margin: 20rpx auto;
				border-radius: 25rpx;
				height: 400rpx;
				padding: 20rpx;

				.title {
					text-align: center;
				}

				text {
					margin: 0 auto;
					padding-left: 2em;
				}

				.title {
					padding-left: 0em;
					margin: 0 auto;
					font-size: 40rpx;
					font-weight: bold;
					font-style: italic;
					line-height: 100rpx;

				}
			}

			.img {
				width: 20rpx;
				height: 20rpx;

			}
		}

		.leave_list {
			height: 80rpx;

			margin-bottom: 50rpx;

			.leave_tab {
				display: flex;
				margin: 10rpx;
				display: inline-block;
				padding: 10rpx 30rpx;
				font-size: 36rpx;

				.f-color {
					color: #878b99;
					font-size: 30rpx;
				}

				.f-active-color {
					color: #4d6398;
					padding: 10rpx 0;
					font-size: 40rpx;
					font-weight: bold;
					border-bottom: 6rpx solid #4d6398;
				}
			}

			.send_msg {
				float: right;
				margin-right: 30rpx;
				padding: 0;
				margin-top: 22rpx;
				color: #fff;
				padding: 14rpx 20rpx;
				background-color: #4d6398;
				border-radius: 10rpx;
			}
		}

		.leave {
			clear: both;
			width: 100%;

			background-color: #fff;
			border-bottom: 2rpx dashed gray;

			.leave_item {
				display: flex;
				justify-content: space-between;
				padding: 20rpx;



				.head_img {
					background-color: #878b99;
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-left: 20rpx;
					display: flex;

					.hImg {
						width: 80rpx;
						height: 80rpx;
					}
				}

				.right {
					width: 100%;
					margin-left: 20rpx;

					.top {
						width: 100%;

						text {
							line-height: 60rpx;
						}

						.leave_user,
						.leave_content {
							font-size: 30rpx;
							width: 84%;
							padding-top: 15rpx;


						}

						.leave_type {
							color: #ec5a33;
							padding-top: 10rpx;
						}

						.leave_time {
							font-size: 24rpx;
							color: #878b99;
							line-height: 30rpx;
						}
					}

					.leave_img {
						width: 84%;
						height: 130rpx;
						display: flex;
						margin-top: 20rpx;
						justify-content: space-between;

						.img {
							width: 160rpx;
							height: 160rpx;

						}
					}
				}
			}

			.leaveFunction {
				display: flex;
				justify-content: flex-end;
				padding: 10rpx;
				align-items: center;
				margin-top: 40rpx;

				.reply {
					margin-right: 70rpx;

					image {
						width: 50rpx;
						height: 50rpx;
					}

				}

				.like {
					margin-right: 40rpx;

					image {
						width: 55rpx;
						height: 55rpx;
					}
				}
			}

			.nickNameLikes {
				font-size: 22rpx;

				padding: 20rpx 20rpx 20rpx 45rpx;
			}
		}
	}


	.barrage-box {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.barrage-item {
		position: absolute;
		white-space: nowrap;
		font-size: 16px;
		font-weight: bold;
		animation: barrage-animation linear infinite;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	@keyframes barrage-animation {
		0% {
			transform: translateX(100%);
			/* 从右侧开始 */
		}

		100% {
			transform: translateX(-100%);
			/* 到达左侧 */
		}
	}
</style>