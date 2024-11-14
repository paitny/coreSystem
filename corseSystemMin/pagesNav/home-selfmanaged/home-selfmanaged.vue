<template>
	<view class="frame"><view style="color: white;font-size: 35rpx;padding:20rpx 40%;">竞赛信息</view></view>
	<view class="main">
		
	
	<view class="choose-tab">
		<view class="contest-item" v-for="(item,index) in list" :class="chooseTab == index ? 'active' : ''" :data-choose="index" @click="clickTab" :key="item.id">
			{{item.title}}
		</view>
	</view>
	
	<view class="content">
		
		<view v-for="(item,index) in list" :style="chooseTab != index ? 'display:none' : ''">
			<view class="title">{{item.title}}</view>
			{{item.content}}
		</view>
	</view>
	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chooseTab: 0, //当前选中的选项卡：默认选中第一个~
				list: [
					
				],
			}
		},
		
		onLoad() {
			// 页面初始化 options为页面跳转所带来的参数
			this.getlistData()
		},
		methods: {
			clickTab: function (e) { //点击切换
				this.chooseTab = e.target.dataset.choose;
			},
			getlistData(){
			uni.$http.get("/api/route/competitionData").then(res=>{
				this.list=res.data
				
			})	
			}
		}
	}
</script>

<style lang="scss">
	.frame{
		background-color:#0E6EB8;
		height: 90rpx;
		width: 100%;
	}
	.choose-tab {
		margin-top: 1rpx;
		line-height: 117rpx;
		text-align: center;	
		height: 100vh;
		background-color: #fff;
			
	}
	.contest-list{
		border-bottom: 1rpx solid gainsboro;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		
	}
	.active {
		background-color: #0E6EB8;
		width: 210rpx;
	}
	.main{
		display: flex;
	}
	.content {
		
		padding: 30rpx;
		.title{
			text-align: center;
			font-size: 45rpx;
		}
	}
</style>
