<template>
	<transition name="slide">
		<view :class="{ 'comment--visible': isVisible }" class="comment" @touchmove.stop.prevent="handleTouchmove"
			@touchstart="handleTouchstart" @touchend="handleTouchend">
			<!-- 关闭按钮 -->
			<view class="function">
				<!-- 显示评论数量 -->
				<view class="">{{ totalComments > 0 ? totalComments + "条评论" : "暂无评论" }}</view>
				<view class="close-button" @click="closeCommentSection">x</view>
			</view>
			<!-- 评论内容区域 -->
			<view class="comment-content" @touchmove.stop.prevent @touchend.stop.prevent>
				<!-- 显示评论列表 -->
				<scroll-view class="comment-list" scroll-y="true" style="height: 300px;">
					<view v-for="(comment, commentIndex) in comments" :key="commentIndex" class="comment-item">
						<view class="user-info">
							<image :src="getImageUrl(comment.user.avatar)" mode=""
								:key="getImageKey(comment.user.avatar)" style="width:  40px ;height: 40px;"></image>
							<br />
							<view class="" style="display: flex;flex-direction: column;">
								<text class="nickname">{{ comment.user.nickname }}</text>
								<text class="text">{{ comment.text }}</text>
							</view>
						</view>
						<view class="" style="margin-left: 50px;color: #afaeb3;font-size:28rpx;"><text>
								{{ formatTimestamp(comment.date) }} ·
								{{comment.user.province}}</text> &nbsp; <text
								@click="startReply(commentIndex, comment.user.nickname, comment._id, comment.userId)"
								style="color: #4d6398;">回复</text></view>

						<view class="" style="margin-left: 48px;">
						</view>
						<!-- 显示回复列表 -->
						<view v-if="comment.replies.length > 0" class="reply-list">
							<view v-for="(reply, replyIndex) in comment.replies" :key="replyIndex" class="reply-item">
								<view class="user-info-child">
									<image :src="getImageUrl(reply.user.avatar)" :key="getImageKey(reply.user.avatar)"
										mode=""></image>
									<view class="">
										<view class=""
											style="display: flex; align-items: center;">
											<text class="nickname">{{ reply.user.nickname }} </text>
											<view class="triangle"
												v-if="comment._id!==reply.replyCommentId && reply._id!==reply.replyCommentId">
											</view>

											<text class="comment-child"
												v-if="comment._id!==reply.replyCommentId&&reply._id!==reply.replyCommentId">
												{{ reply.replyUser.nickname }}
											</text>
										</view>
										<text class="comment-children">{{ reply.text }}</text>&nbsp;

									</view>






								</view>


								<view class="" style="margin-left: 45px;color: #afaeb3;font-size: 25rpx;"><text
										class="date">&nbsp;{{ formatTimestamp(reply.date) }} ·
										{{reply.user.province}}</text>&nbsp; <text class="reply-child"
										@click="startReply(commentIndex, reply.user.nickname, comment._id, reply.userId,reply._id)"
										style="color: #4d6398;">回复</text></view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="userComment">
				<!-- 统一输入框 -->
				<textarea v-model="commentText" :placeholder="placeholderText" @input="handleInputChange"></textarea>
				<button @click="submitComment">{{ replying ? '提交回复' : '提交评论' }}</button>
			</view>
		</view>
	</transition>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		props: {
			isVisible: Boolean,
			trendId: String,
			comments: Array,
		},
		data() {
			return {
				commentText: '',
				startY: 0, // 触摸开始的Y坐标
				lastY: 0, // 上一次触摸的Y坐标
				replying: false,
				replyTarget: null, // 目标回复的索引
				replyUser: null, // 追加回复的用户信息
				baseURL: '',
				parentCommentId: '',
				replyUserId: '',
				placeholderText: '',
				replyCommentId: ''
			};
		},
		computed: {



			...mapState(['userInfo']),
			totalComments() {
				let count = this.comments.length;
				this.comments.forEach((comment) => {
					count += comment.replies.length;
				});
				return count;
			},
		},
		mounted() {
			this.baseURL = uni.baseURL;
			this.placeholderText = '请输入评论内容，系统自动识别敏感词汇';
			console.log(this.comments);
		},
		methods: {
			getImageKey(imageUrl) {
				return imageUrl;
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
					return '刚刚';
				} else if (minutesDiff < 60) {
					return minutesDiff + '分钟前';
				} else if (hoursDiff < 24) {
					return hoursDiff + '小时前';
				} else if (daysDiff === 1) {
					return (
						'昨天 ' +
						timestampDate.getHours() +
						':' +
						(timestampDate.getMinutes() < 10 ? '0' : '') +
						timestampDate.getMinutes()
					);
				} else if (daysDiff < 3) {
					return daysDiff + '天前';
				} else {
					return (
						timestampDate.getFullYear() +
						'-' +
						(timestampDate.getMonth() + 1) +
						'-' +
						timestampDate.getDate()
					);
				}
			},
			handleInputChange() {
				// 监听 textarea 值的变化，当为空时，将 replying 设为 false，parentCommentId 清空
				if (!this.commentText.trim()) {
					this.replying = false;
					this.parentCommentId = '';
					this.replyUserId = '';
					this.replyCommentId = ''
					this.placeholderText = '请输入评论内容，系统自动识别敏感词汇';
				}
			},
			//检测是否登录
			checkLogin() {
				uni
					.$http.post('/api/login/min/check', {
						id: uni.getStorageSync('userInfo')._id,
					})
					.then((res) => {
						if (res.data.code === 0) {
							return uni.showModal({
								content: '登录注册才有权限噢！',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: '/pagesMe/login/login?type=2',
										});
									}
								},
							});
						} else if (res.data.code === 2) {
							return uni.showModal({
								content: '登录注册才有权限噢！',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: '/pagesMe/login/login?type=2',
										});
									}
								},
							});
						} else if (res.data.code === 1) {
							if (this.commentText.trim() !== '') {
								if (this.replying) {
									this.submitReply();
									this.$emit('getComments');
									this.placeholderText = '请输入评论内容，系统自动识别敏感词汇';
								} else {
									this.submitNewComment();
									this.$emit('getComments');

									this.placeholderText = '请输入评论内容，系统自动识别敏感词汇';
								}
							}
						}
					});
			},
			closeCommentSection() {
				// Emit an event to close the comment section
				this.$emit('close');
			},
			submitComment() {
				if (this.commentText.trim() === '') {
					return uni.showToast({
						duration: 1800,
						title: '内容不能为空',
						icon: 'none',
					});
				}
				this.checkLogin();
			},
			submitNewComment() {
				// 发送 POST 请求
				uni
					.$http.post('/api/trends/comments', {
						dynamicId: this.trendId,
						userId: this.userInfo._id,
						text: this.commentText,
					})
					.then((res) => {
						// 处理响应
						uni.showToast({
							duration: 2500,
							title: res.data.message,
							icon: 'none',
						});
						// 更新评论列表或其他操作
					})
					.catch((error) => {
						console.error('评论提交失败', error);
						// 处理错误
					});
				this.comments.push({
					text: this.commentText,
					user: {
						nickname: this.userInfo.nickName,
						avatar: this.userInfo.photo,
						date: new Date(),
					},
					replies: [],
				});
				this.commentText = '';
			},
			startReply(commentIndex, replyUserName = null, id, userId, replyCommentId) {

				this.replyUserId = userId;
				this.replying = true;
				this.replyTarget = commentIndex;
				this.parentCommentId = id;
				this.replyCommentId = replyCommentId || id
				
				if (replyUserName) {
					this.replyUser = replyUserName;
					this.placeholderText = `@${replyUserName} `;
				} else {
					this.replyUser = null;
				}
			},
			submitReply() {
				uni
					.$http.post('/api/trends/comments', {
						dynamicId: this.trendId,
						userId: this.userInfo._id,
						text: this.commentText,
						parentCommentId: this.parentCommentId,
						replyUserId: this.replyUserId,
						replyCommentId: this.replyCommentId
					})
					.then((res) => {
						// 处理响应
						uni.showToast({
							duration: 2500,
							title: res.data.message,
							icon: 'none',
						});
						// 更新评论列表或其他操作
					})
					.catch((error) => {
						console.error('回复提交失败', error);
						// 处理错误
					});
				if (this.commentText.trim() !== '') {
					const comment = this.comments[this.replyTarget];
					comment.replies.push({
						text: this.commentText,
						user: {
							nickname: this.userInfo.nickName,
							avatar: this.userInfo.photo,
							date: new Date(),
						},
					});
					this.commentText = '';
					this.replying = false;
					this.replyUser = null;
					this.replyTarget = null;
				}
			},
			handleTouchstart(event) {
				this.startY = event.touches[0].clientY;
			},
			handleTouchend(event) {
				const deltaY = event.changedTouches[0].clientY - this.startY;
				if (deltaY < 0) {
					// 向上滑动，不做任何操作
					return;
				}
				const threshold = 50; // 定义阈值，大于该值才关闭评论区
				if (deltaY >= threshold) {
					// 往下滑动超过阈值，关闭评论区
					this.closeCommentSection();
				}
			},
			handleTouchmove(event) {
				event.stopPropagation();
			},
		},
	};
</script>

<style lang="scss">
	.comment {
		position: fixed;
		bottom: -100%;
		left: 0;
		width: 100%;
		background-color: #ffffff;
		transition: bottom 0.3s ease;
		z-index: 9999;
	}

	.comment--visible {
		bottom: 0;
	}

	.comment-content {
		padding: 0 40rpx 40rpx 40rpx;
	}

	.comment-list {
		margin-top: 20px;
	}

	.comment-item {
		margin-bottom: 10px;
	}

	.comment-item text {

		cursor: pointer;
	}

	.reply-list {
		margin-top: 10px;
	}

	.reply-item {
		margin-bottom: 20rpx;
		padding-left: 48px;
		border-left: 2px solid #ccc;

	}

	.reply-item .reply-child {
		font-size: 30rpx;
	}



	.user-info {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.user-info image {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-right: 10px;
	}

	.user-info .nickname {
		font-size: 28rpx;
		color: #afaeb3;
	}

	.user-info .text {
		font-size: 32rpx;
	}

	.user-info-child {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.user-info-child image {
		width: 35px;
		height: 35px;
		border-radius: 50%;
		margin-right: 10px;
	}

	.user-info-child .nickname {
		font-size: 25rpx;
		color: #afaeb3;
	}

	.user-info-child .date {
		font-size: 25rpx;
		color: #afaeb3;
	}

	.user-info-child .comment-child {
		font-size: 25rpx;
		color: #afaeb3;
	}

	.comment-children {
		font-size: 30rpx;

	}

	.function {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-right: 60rpx;
		padding: 40rpx 40rpx 0 40rpx;

	}

	.close-button {
		width: 45rpx;
		height: 45rpx;
		border-radius: 50%;
		background-color: #ccc;
		color: #ffffff;
		text-align: center;
	}

	.userComment {
        box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, 0.1);
		padding: 0 40rpx 40rpx 40rpx;
	}

	.slide-enter-active,
	.slide-leave-active {
		transition: transform 0.3s;
	}

	.slide-enter,
	.slide-leave-to {
		transform: translateY(0);
	}

	.slide-enter-to,
	.slide-leave {
		transform: translateY(100%);
	}

	.triangle {
		width: 0;
		height: 0;
		border-top: 10rpx solid transparent;
		border-bottom: 10rpx solid transparent;
		border-left: 10rpx solid #afaeb3;
		border-top-right-radius: 5rpx;
		border-bottom-right-radius: 5rpx;
		margin: auto 10rpx auto 10rpx;


	}
</style>