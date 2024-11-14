<template>
	<view class="index">
		<scroll-view scroll-x="true" class="scroll-content">
			<view class='scroll-item' v-for="(itemName,index) in navTab" :key="index" @tap='switchTab(itemName,index)'>
				<text :class="{'f-active-color':currentNavtab===index}">{{itemName}}</text>
			</view>
		</scroll-view>
	</view>
	<swiper @change="onChangeTab" :current="currentNavtab"  class="scroll-all" :style="{height:heightEle+'rpx'}" circular="true">
		<swiper-item v-for="(itemNav,index) in navTab" :key="index">
			<view class='scroll-item' v-for="(item,idx) in list" :key="idx">
				<view class="all-list" @click="news(item._id)">
					<view class="all-list-content">
						<!-- 字符截取substring -->
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
								{{item.pv}}人阅读
							</text>
							<text class="date">{{date(item.date)}}</text>
						</view>

					</view>
					<image class="all-list-img" :src='`${baseURL}${item.cover}`' alt=""></image>
				</view>
			</view>
		</swiper-item>

	</swiper>
</template>
<script>
	import moment from 'moment'
	export default {
		data() {
			return {
				swierIndex: 0,
				currentNavtab: 0,
				navTab: ["校园动态", "最新活动", "校园活动"],
				list: [],
				img: 'https://www.pp3.cn/uploads/allimg/200820/14-200R0092153.jpg',
				heightEle: 0,
				baseURL: ""
			}
		},
		onLoad(options) {
			this.baseURL = uni.baseURL
			this.switchTab(this.navTab[options.index],parseInt( options.index) )
		},
		methods: {

			switchTab(itemName, index) {
				this.currentNavtab = index
				uni.$http.get("/api/get/itNews/class", {
					newClass: itemName
				}).then((res) => {
					
					this.list = []
					this.list = res.data.data
					this.heightEle = res.data.data.length * 204
				})
                
			},
			onChangeTab(e) {
				
				this.switchTab(this.navTab[e.detail.current], e.detail.current)


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
			date(time) {
				return moment(time).format('YYYY-MM-DD')
			}
		},
	}
</script>

<style lang="scss">
	.scroll-content {
		width: 100%;
		height: 75rpx;
		white-space: nowrap;
		margin-bottom: 30rpx;

		.scroll-item {
			display: inline-block;
			padding: 10rpx 30rpx;
			font-size: 33rpx;

			.f-color {
				color: #878b99;
				font-size: 30rpx;
			}

			.f-active-color {
				color: #000;
				padding: 10rpx 0;
				font-size: 40rpx;
				font-weight: bold;
				border-bottom: 3rpx solid #4d6398;
			}
		}
	}

	.scroll-content2 {
		width: 100%;
	}

	.scroll-all {
		width: 90%;
		min-height: 1226rpx;
		margin: 0 auto;
		white-space: nowrap;

		.all-list {
			width: 100%;
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
				line-height: 60rpx;

				view {
					width: 100%;
				}

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
			// border: 1rpx solid red;
		}

	}
</style>