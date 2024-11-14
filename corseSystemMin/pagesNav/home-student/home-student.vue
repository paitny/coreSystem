<template>
		<view class="frame">
			<view style="padding-top: 17rpx; padding-left: 30rpx; font-size: 30rpx;">学生机构</view>
			<view style="padding-top: 7rpx; padding-left: 33rpx; font-size: 25rpx;color: dimgrey;">欢迎加入</view>
		</view>
		<view class="content" v-for="item in studentOrginData"  :key="item._id" @click="gothisDepartments(item._id,item.name)" >
			<image class="img" :src="`${baseURL}${item.cover}`" alt=""></image>
			<view style="margin-top: -101rpx;margin-left: 200rpx;font-size: 30rpx;">人工智能与大数据学院{{item.due}}{{item.name}}</view>
		</view>
		
</template>

<script>
	export default {
		data() {
			return {
				studentOrginData:[],
				baseURL:""
			};
		},
		onLoad() {
			this.baseURL=uni.baseURL
			this.getstudentOrginData()
		},
		methods: {
			
			getstudentOrginData(){
				uni.$http.get("/api/get/getAllStudentOrgs").then(res=>{
					
					this.studentOrginData=res.data
				})
			},
			gothisDepartments(id,name){
				uni.navigateTo({
					url:"/pagesHome/Departments/Departments?id="+id+'&institution='+name
				})
			}
		},
		onShareAppMessage() { // 分享到微信
			// 更多参数配置，参考文档
			return {
				title:"学生机构",
				path: '/pagesNav/home-student/home-student'
			}
		},
		
		onShareTimeline() { // 分享到朋友圈
			return {
				title: "学生机构",
				path: '/pagesNav/home-student/home-student'
			}
		}
	}
</script>

<style lang="scss">
	.frame{
		height: 110rpx;
		width: 100%;
		background-color: white;
		.all{
			height: 100%;;
			margin-top:-100rpx;
			line-height: 115rpx;
			margin-left: 587rpx;
			font-size: 25rpx;
			color: dimgrey;
		}
	}
	.content{
		margin-top: 6rpx;
		height: 193rpx;
		width: 100%;
		background-color: white;
		.img{
			height: 130rpx;
			width: 130rpx;
			margin-top: 30rpx;
			margin-left: 33rpx;
			border-radius: 5rpx;
		}
	}
</style>
