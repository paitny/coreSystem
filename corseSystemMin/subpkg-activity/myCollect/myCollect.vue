<template>
	
	<loading v-if="isloading"></loading>
	<view class="information" v-else>
		<view class="noData" v-if="indexList.length===0">
			<image src="../../static/orderImgs/noData.png" mode=""></image>
		</view>
		<scroll-view class="scroll-content">
			<view class='scroll-item' v-for="(item,idx) in indexList" :key="idx">
				<view class="all-list" @click="news(item._id)">
					<view class="all-list-content">
						<text class="title">{{item.title.substring(0,10)}}</text>
						<text class="title">{{item.title.length>10?'...':''}}</text>
						<br>
						<text class="des">{{delHtmlTag(item.des).substring(0,14)}}</text>
						<text class="des">{{item.des.length>10?'...':''}}</text>
						<br>
						<view>
							<image src="../../static/orderImgs/people.png" alt=""
								style="height: 30rpx ;width: 30rpx;margin-right: 10rpx;">
							</image>
							<text class="read">
								{{simplifyNumber(item.pv)}}人阅读
							</text>
							<text class="date">{{timestampToDatetime(item.date)}}</text>
						</view>

					</view>
					<image class="all-list-img" :src="`${baseURL}${item.cover}`" alt=""></image>
				</view>
			</view>
		</scroll-view>
	</view>

</template>

<script>
	import loading from '../../components/loading/loading.vue'
	import moment from 'moment';
	import {
		mapState,
		mapMutations
	} from "vuex"
	export default {
		data() {
			return {
				indexList: [],
				baseURL: '',
				isloading:true
			};
		},
		onLoad() {

			this.baseURL = uni.baseURL

		},
		components:{
			loading
		},
		onShow() {
			this.getNewsList()
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			async getNewsList() {
				 await uni.$http.get('/api/news/Collect', {
					userId: this.userInfo._id
				}).then((res)=>{
					
				if (res.errMsg == "request:ok") {
							this.indexList =res.data.data
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
			simplifyNumber(num) {
				if (num >= 100000000) {
					return (num / 100000000).toFixed(1) + 'm';
				} else if (num >= 10000000) {
					return (num / 10000).toFixed(1) + 'w';
				} else if (num >= 10000) {
					return (num / 10000).toFixed(1) + 'w';
				} else if (num >= 1000) {
					return (num / 1000).toFixed(1) + 'K';
				} else {
					return num.toString();
				}
			},
			goTopage(url) {
				uni.navigateTo({
					url
				})
			},
			news(id) {
				uni.navigateTo({
					url: '/pagesHome/news/news?id=' + id
				})
			},
			// 去掉中文字符以外的字符
			delHtmlTag(str) {
				return str.replace(/[^\u4e00-\u9fa5]/g, '')

			},
			// 时间格式
			timestampToDatetime(timestamp) {
				// 创建一个新的 Date 对象，将时间戳作为参数传递
				const date = new Date(timestamp);

				// 使用 Date 对象的方法获取年、月、日、小时、分钟和秒
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				const seconds = String(date.getSeconds()).padStart(2, '0');

				// 构建日期时间字符串
				const datetimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

				return datetimeString;
			}
		}
	}
</script>

<style lang="scss">
	.information {
		width: 100%;
		height: 1213rpx;
		background-color: #fff;

		.noData {
			image {
				position: absolute;
				width: 200rpx;
				height: 200rpx;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}

		}

		.scroll-content {
			width: 100%;
			height: 1207rpx;

			.scroll-item {
				width: 100%;

				.all-list {
					height: 100%;
					width: 90%;
					height: 200rpx;
					margin: 0 auto;
					border-bottom: 1rpx solid #E6E6E6;

					.all-list-content {
						float: left;
						width: 66%;
						overflow: hidden;
						height: 100%;
						color: #8a8a8a;
						font-size: 30rpx;
						line-height: 63rpx;

						.des {
							height: 48rpx;
							width: 100%;
							font-size: 27rpx;
							overflow: hidden;
						}

						.title {
							color: #000;
							font-size: 37rpx;
							line-height: 67rpx;
							line-height: 79rpx;
						}

						.read {
							font-size: 24rpx;
						}

						.date {
							float: right;
							margin: 6rpx;
							font-size: 24rpx;
						}
					}
				}

				.all-list-img {
					float: right;
					width: 28%;
					height: 140rpx;
					margin: 30rpx 4rpx;
				}
			}
		}
	}
</style>