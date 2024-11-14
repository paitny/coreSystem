<template>
	<view class="container">
		<view class="center-container">
			
			<view class="button-one" v-for="item in collegeNavData" :key="item.id" @click="gopage(item.page)">
				<view class="title">{{item.title}}</view>
				<img src="https://wypty.cn/static/file/material/button.jpg" alt="" />

			</view>
			
			
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				collegeNavData: [],
				baseURL: ''
			}
		},
		onLoad() {
			this.baseURL = uni.baseURL
			this.getcollegeNavData()
		},
		methods: {
			getcollegeNavData() {
				uni.$http.get("/api/route/collegeNav").then((res) => {

					this.collegeNavData = res.data
				})
			},
			gopage(url){
				uni.navigateTo({
					url:url
				})
			}

		}
	}
</script>

<style lang="scss">
	.container {
		width: 100vw;
		height: 100vh;
		display: flex;

		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */

		.button-one {
			
			height: 200rpx;
			margin-top: 25rpx;
			position: relative;

			.title {

				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				font-size: 45rpx;
				color: #fff;
				font-family: "Roboto", sans-serif;
			}

			image {
				width: 400rpx;
				height: 200rpx;
				border-radius: 30rpx;

			}
		}
	}



	page {
		background-image: url('https://wypty.cn/static/file/material/collegeBg.jpg');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		position: relative;
	}
</style>