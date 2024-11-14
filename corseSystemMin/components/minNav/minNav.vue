<template>
	<view class="Options">
		<view class="Option" v-for="(item,index) in navList" :key="index">
			<image class="option" :src='`${baseURL}${item.img}`' @tap="option(item.page)"></image>
			<view class="p" @tap="option(item.page)">{{item.title}}</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: "minNav",
		data() {
			return {
				navList: [],
				baseURL: ""
			};
		},
		mounted() {
			this.baseURL = uni.baseURL
			this.getNavData()
		},
		methods: {
			getNavData() {
				uni.$http.get("/api/route/minNav").then((res) => {

					this.navList = res.data


				})
			},

			option(url) {

				uni.navigateTo({
					url: url
				})
			},
		}
	}
</script>

<style lang="scss">
	.Options {
		margin-top: 30rpx;
		border-top-left-radius: 24rpx; 
		  border-top-right-radius: 24rpx; 
		 box-shadow: 0px 0px 24rpx -4rpx rgba(0, 0, 0, 0.1);
		height: 400rpx;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #fff;

		.Option {
			height: 200rpx;
			width: 25%;
			text-align: center;

			.p {
				margin-top: 8rpx;
				font-size: 27rpx;
				color: dimgrey;
			}

			.option {
				margin-top: 37rpx;
				height: 85rpx;
				width: 85rpx;
			}
		}
	}
</style>