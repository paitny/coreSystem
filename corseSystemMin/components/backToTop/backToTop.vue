<template>
	<view>
		<view class="top" v-if="topShow" @click="goTop()">
			
			<image src="../../static/orderImgs/backtotop.png" mode=""></image>
		</view>
	</view>
</template>
 
<script>
	export default {
		name:"viewTop",
		data() {
			return {
				topShow: false,
			};
		},
		props: {
			scrollTop: {
				type: Number,
				default: 0
			},
		},
		
		methods:{
			topData(e){
                 //这个e直接是滚动时候的高度
				this.topShow = e>600
			},
			goTop(){
				uni.pageScrollTo({
					scrollTop: this.scrollTop,
					duration: 300
				});
			},
		}
	}
</script>
 
<style lang="scss">
	.top {
		height: 80rpx;
		width: 80rpx;
		text-align: center;
		line-height: 80rpx;
		position: fixed;
		z-index: 999;
		right: 30rpx;
		bottom: 100rpx;
		animation: heart 0.3s;
		image{
			height: 80rpx;
			width: 80rpx;
		}
		@keyframes heart {
			0% {
				right: -30rpx;
			}
			100% {
				right: 30rpx;
			}
		}
	}
</style>