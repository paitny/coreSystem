<template>
	<view class="number-box">
		<block v-for="(myIndex, index) in indexArr" :key="index">
			<swiper class="swiper" vertical="true" :current="myIndex" circular="true" v-bind:style="{color:color,width:myIndex == 10 ? '7px' : width+'px',height:height+'px',lineHeight:fontSize+'px',fontSize:fontSize+'px'}">
				<swiper-item>
					<view class="swiper-item">0</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">1</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">2</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">3</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">4</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">5</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">6</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">7</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">8</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">9</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">.</view>
				</swiper-item>
			</swiper>
		</block>
	</view>
</template>

<script>
	export default {
		props: {
			num: [String, Number],
			color: {
				type: String,
				default: '#000000'
			},
			width: {
				type: String,
				default: '15'
			},
			height: {
				type: String,
				default: '15'
			},
			fontSize: {
				type: String,
				default: '15'
			}
		},
		data() {
			return {
				indexArr: []
			};
		},
		created() {
			let {
				num
			} = this;
			let arr = new Array(num.toString().length);
			arr.fill(0);
			this.indexArr = arr;
		},
		watch: {
			num: function(val, oldVal) {
				// 处理新老数据长度不一样的情况
				let arr = Array.prototype.slice.apply(this.indexArr);
				let newLen = val.toString().length;
				let oldLen = oldVal.toString().length;
				if (newLen > oldLen) {
					for (let i = 0; i < newLen - oldLen; i++) {
						arr.push(0);
					}
					this.indexArr = arr;
				}
				if (newLen < oldLen) {
					for (let i = 0; i < oldLen - newLen; i++) {
						arr.pop();
					}
					this.indexArr = arr;
				}
				this.numChange(val);
			}
		},
		mounted() {
			//定时器作用：app显示数字滚动
			this._time = setTimeout(() => {
				this.numChange(this.num);
				clearTimeout(this._time);
			}, 50);
		},
		methods: {
			/**
			 * 数字改变
			 * @value 数字
			 */
			numChange(num) {
				let {
					indexArr
				} = this;
				let copyIndexArr = Array.prototype.slice.apply(indexArr);
				let _num = num.toString();
				for (let i = 0; i < _num.length; i++) {
					if (_num[i] === '.') {
						copyIndexArr[i] = 10;
					} else {
						copyIndexArr[i] = Number(_num[i]);
					}
				}
				this.indexArr = copyIndexArr;
				// this.log(this.indexArr);
			}
		}
	};
</script>

<style lang="scss">
	.number-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.swiper {
		position: relative;
		// 	line-height: 30upx;
		// 	width: 30upx;
		// 	height: 30upx;
		// 	font-size: 30upx;
		// 	background: red;
	}

	.swiper:after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
</style>