<template>
	<view class="container">
		<view class="list-cell b-b m-t" @click="navTo('../modify/modify')" hover-class="cell-hover"
			:hover-stay-time="50">
			<text class="cell-tit">个人资料</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b m-t" @click="navTo('../change-password/change-password')" hover-class="cell-hover"
			:hover-stay-time="50">
			<text class="cell-tit">密码修改</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b m-t" @click="navTo('../feedback/feedback')" hover-class="cell-hover"
			:hover-stay-time="50">
			<text class="cell-tit">账号问题反馈</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b m-t" @click="navTo('../../subpkg-common/grades/grades')" hover-class="cell-hover"
			:hover-stay-time="50">
			<text class="cell-tit">换届竞选</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell m-t">
			<text class="cell-tit">消息推送</text>
			<switch checked color="#fa436a" @change="switchChange" />
		</view>
		<view class="list-cell m-t b-b" hover-class="cell-hover" :hover-stay-time="50" @click="clearStorage">
			<text class="cell-tit">清除缓存</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('关于Dcloud')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">关于我们</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell">
			<text class="cell-tit">检查更新</text>
			<text class="cell-tip">当前版本 {{version}}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell log-out-btn" @click="toLogout">
			<text class="cell-tit">退出登录</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				version: ""
			};
		},
		onLoad() {
			const accountInfo = uni.getAccountInfoSync();
			this.version = accountInfo.miniProgram.version; // 小程序 版本号
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			...mapMutations(['loginOut']),

			navTo(url) {

				uni.navigateTo({
					url
				})
			},
			//退出登录
			removeStore() {
				uni.removeStorage({
					key: 'userInfo', // 要清除的数据的键名
					success: () => {
						console.log('数据清除成功');

					},
					fail: (err) => {
						console.log('数据清除失败', err);
					}
				});
				uni.removeStorage({
					key: 'token', // 要清除的数据的键名
					success: () => {
						console.log('数据清除成功');
					},
					fail: (err) => {
						console.log('数据清除失败', err);
					}
				});
			},
			clearStorage() {
			uni.showModal({
			    title: '提示',
			    content: '确定要清除所有本地存储吗？',
			    success:  (res)=> {
			        if (res.confirm) {
			            try {
			                // 清除本地存储
			                uni.clearStorageSync();
			
			                // 清除 Vuex 状态
			                this.loginOut()
							uni.switchTab({
								url:'/pages/me/me'
							})
			                uni.showToast({
			                    title: '存储和状态已清除',
			                    icon: 'success',
			                    duration: 2000
			                });
			            } catch (e) {
			                uni.showToast({
			                    title: '清除失败',
			                    icon: 'none',
			                    duration: 2000
			                });
			                console.error('清除存储时出错:', e);
			            }
			        } else if (res.cancel) {
			            console.log('用户取消清除操作');
			        }
			    }
			});

			},
			toLogout() {
				uni.showModal({
					content: '确定要退出登录么',
					success: (e) => {
						if (e.confirm) {
							this.loginOut();
							this.removeStore()
							setTimeout(() => {
								uni.navigateBack();
							}, 200)
						}
					}
				});
			},
			//switch
			switchChange(e) {
				let statusTip = e.detail.value ? '打开' : '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},

		}
	}
</script>

<style lang='scss'>
	page {
		background: #fafafa;
	}

	.list-cell {
		display: flex;
		align-items: baseline;
		padding: 20upx;
		line-height: 60upx;
		position: relative;
		background: #fff;
		justify-content: center;

		&.log-out-btn {
			margin-top: 40upx;

			.cell-tit {
				color: red;
				text-align: center;
				margin-right: 0;
			}
		}

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		&.m-t {
			margin-top: 16upx;
		}

		.cell-more {
			align-self: baseline;
			font-size: 35rpx;
			color: black;
			margin-left: 10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 30rpx;
			color: black;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 20rpx;
			color: black;
		}

		switch {
			transform: translateX(16upx) scale(.84);
		}
	}
</style>