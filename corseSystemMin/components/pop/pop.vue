<!-- ChildPopup.vue -->
<template>
	<view v-show="isPopupVisible" class="popup" @click="hidePopup">
		<!-- 弹窗内容 -->
		<view class="popup-box" @click.stop>
			<view class="popup-content">
				<!-- 左侧个人信息 -->
				<view class="left-info">
					<image :src="contributor.avatar" class="avatar" />
					<view class="info">
						<text style="white-space: normal;">姓名：{{ contributor.name }}</text> <br>
						<text style="white-space: normal;">性别：{{ contributor.gender }}</text> <br>
						<text style="white-space: normal;">昵称：{{ contributor.nickName }}</text> <br>
						<text style="white-space: normal;">年级：{{ contributor.grade }}</text><br>
						<text style="white-space: normal;">专业：{{ contributor.className }}</text><br>
						<text style="white-space: normal;">辅导员：{{ contributor.counsellor }}</text><br>
						<text style="white-space: normal;">职位：{{ contributor.position}}</text><br>
						
					</view>
				</view>

				<!-- 右侧个人简介 -->
				<view class="right-intro">
					<text> {{contributor.personality||暂无}}</text>
				</view>
				<!-- 点击弹窗以外的区域关闭弹窗 -->
				<view class="mask" @tap="hidePopup">×</view>
			</view>

		</view>


	</view>
</template>

<script>
	export default {
		props: {
			 contributor: {
			      type: Object,
			      required: true,
			    },
			isPopupVisible: Boolean,
		},
		methods: {
			hidePopup() {
				this.$emit('hidePopup');
			}
		},
		data() {
			return {
				
			};
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
		background: #fff;
		border-radius: 10px;
		width: 70%;
		margin: 0 auto;

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
		height: 100%;
		flex: 1;
	}

	.info {
		padding-top: 30rpx;
	}

	.avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		margin-right: 10px;
	}

	.right-intro {
		flex: 1;
		margin-left: 20px;
		height: 100%;
	}
</style>