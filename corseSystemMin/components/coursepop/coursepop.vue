<!-- ChildPopup.vue -->
<template>
	<view v-if="isPopupVisible" class="popup" @click="hidePopup">
		<!-- 弹窗内容 -->
		<view class="popup-box" @click.stop>
			<view class="popup-content">
				<view class="" style="text-align: center; font-size: 40rpx;">
					芯系小助手温馨提示
				</view> <br>
				<!-- 左侧个人信息 -->
				<view class="" style="text-align: left; font-size: 32rpx;margin-top: 20rpx;">
					亲爱的{{userInfo.name}}同学：
				</view> <br>
				<view v-if="missingHours >= 11 && missingHours <= 20" class=""
					style="text-align: left;margin-top: 20rpx;">
					本学期您已缺课累计达 {{missingHours}} 学时，根据《成都文理学院学生手册》中的学生纪律处理办法规定，即将给予警告处分！
				</view>
				<view v-if="missingHours >= 21 && missingHours <= 30" class=""
					style="text-align: left;margin-top: 20rpx;">
					本学期您已缺课累计达 {{missingHours}} 学时，根据《成都文理学院学生手册》中的学生纪律处理办法规定，即将给予严重警告处分！
				</view>
				<view v-if="missingHours >= 31 && missingHours <= 40" class=""
					style="text-align: left;margin-top: 20rpx;">
					本学期您已缺课累计达 {{missingHours}} 学时，根据《成都文理学院学生手册》中的学生纪律处理办法规定，即将给予记过处分！
				</view>
				<view v-if="missingHours >= 41 && missingHours <= 50" class=""
					style="text-align: left;margin-top: 20rpx;">
					本学期您已缺课累计达 {{missingHours}} 学时，根据《成都文理学院学生手册》中的学生纪律处理办法规定，即将给予留校察看处分！
				</view>
				<view v-if="missingHours > 51" class="" style="text-align: left;margin-top: 20rpx;">
					本学期您已缺课累计达 {{missingHours}} 学时以上，根据《成都文理学院学生手册》中的学生纪律处理办法规定，即将给予开除学籍处分！
				</view>
				<view class="left-info">
					请您重视此问题，及时改正！
				</view>

				<!-- 右侧个人简介 -->

				<!-- 点击弹窗以外的区域关闭弹窗 -->
				<view class="mask" @click="hidePopup">×</view>
			</view>

		</view>


	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		props: {
			isPopupVisible: Boolean,
			missingHours: Number // 新增的属性，表示缺课学时
		},
		computed: {
			...mapState(['userInfo'])
		},
		data() {
			return {
				baseURL: ''
			};
		},
		mounted() {
			console.log(uni.baseURL);
			this.baseURL = uni.baseURL
		},

		methods: {
			hidePopup() {

				this.$emit('hidePopup')

			}
		},

	};
</script>

<style lang="scss" scoped>
	.popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.popup-box {
		width: 100%;
		min-height: 600rpx;

	}

	.popup-content {
		position: relative;

		justify-content: space-between;
		align-items: center;
		padding: 40rpx;
		background: #fff;
		border-radius: 20rpx;
		width: 70%;
		margin: 0 auto;
		min-height: 400rpx;

		.mask {
			width: 50rpx;
			height: 50rpx;
			background-color: #4d6398;
			position: absolute;
			font-size: 50rpx;
			right: -15rpx;
			top: -15rpx;
			border-radius: 50%;
			text-align: center;
			line-height: 50rpx;
			color: #fff;

		}
	}

	.left-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		height: 100%;
		flex: 1;
		margin-top: 50rpx;
	}

	.info {
		padding-top: 30rpx;
	}

	.right-intro {
		flex: 1;
		margin-left: 40rpx;
		height: 100%;
	}

	image {
		width: 250rpx;
		margin-top: 15rpx;
	}
</style>