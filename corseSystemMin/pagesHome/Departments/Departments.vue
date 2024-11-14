<template>
	<view class="content" v-for="item in departmentsData" :key="item._id" @click="handInstitution(item._id)">


		<view class="left">
			<image class="img" :src="`${baseURL}${item.cover}`" alt=""></image>
		</view>
		<view class="right">

			<view class="text">{{item.name}}</view>

			<view>></view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				baseURL: "",
				departmentsData: [],
				institution: ''
			};
		},
		onLoad(options) {
			this.institution = options.institution
			this.baseURL = uni.baseURL
			uni.$http.get("/api/get/departments", {
				id: options.id
			}).then(res => {

				this.departmentsData = res.data.data
			})
		},
		methods: {
			handInstitution(id) {
				uni.navigateTo({
					url: "/pagesHome/institution/institution?id=" + id + '&institution=' + this.institution
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex: 1;
		align-items: center;
		height: 170rpx;
		width: 93%;
		background-color: white;
		margin: 10rpx auto;

		.left {
			width: 30%;
		}

		.right {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 60%;
		}

		.text {
			margin-right: 26%;
		}

		.img {
			margin-right: 60rpx;
			height: 120rpx;
			width: 120rpx;
			padding-left: 20rpx;

		}
	}
</style>