<template>
	<view class="content" v-for="item in alumnusData" :key="item._id">
		<view class="p1">
			<view class="name">{{item.name}}</view>
			<view class="school">{{item.classes}}</view>
			<view class="class">{{item.position}}</view> 
			<view class="money">{{item.salary}}</view> 
		</view>
		<view class="p2">
			<image class="img" :src="`${baseURL}${item.photo}`"></image>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return{
				alumnusData:[],
				baseURL:[]
			} 
		},
		onLoad() {
			this.baseURL=uni.baseURL
			this.getAlumnusData()
		},
		methods: {
			getAlumnusData(){
				uni.$http.get("/api/get/alumnus").then(res=>{
					this.alumnusData=res.data.data
					
				})
			}
		}
	}
</script>

<style lang="scss">
	.content{
		height: 400rpx;
		width: 93%;
		margin: 27rpx auto;
		background-color:steelblue;
		border-radius: 33rpx;
		display: flex;
		box-shadow: 3px 1px 4px 2px rgba(0, 0, 0, 0.3);
		.p1{
			height:100%;
			width: 67%;
			.name{
				margin-top: 60rpx;
				text-align: center;
				font-size: 47rpx;
				}
			.school{
				text-align: center;
				font-size: 33rpx;
				margin-top: 10rpx;
					}
			.class{
				text-align: center;
				font-size: 33rpx;
				margin-top: 10rpx;
					}
			.money{
				text-align: center;
				margin-top: 30rpx;
				font-size: 53rpx;
			}
			}
		.p2{
			height:100%;
			width: 33%;
			.img{
				height: 73%;
				width: 200rpx;
				margin-top: 50rpx;
				}
			
		}
	}
</style>
