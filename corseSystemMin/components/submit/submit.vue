<template>
	<view>
		<view class="submit">
			<view class="submit-chat">
				<view class="bt-img" @click="records">
					<image :src="toc"></image>
				</view>
				<textarea auto-height="true" class="chat-send btn" :class="{displaynone:isrecord}" v-model="chatText"
					@input="change" @focus="handleFocus" @blur="handleBlur"></textarea>
				<view class="record btn" :class="{displaynone:!isrecord}">按住说话</view>
				<view class="bt-img" @click="clickemoj">
					<image src="../../static/img/bq.png"></image>
				</view>
				<view class="bt-img" v-if=isShow>
					<image src="../../static/img/tj.png"></image>

				</view>
				<view class="bt-submit" v-else @click="submitChat">发送</view>
			</view>
			<view class="emoji" :class="{displaynone:isemoj}">
				<emoji @emoji="emoji"></emoji>
			</view>

		</view>

	</view>

</template>

<script>
	import emoji from '../emjo/emjo.vue'
	export default {
		name: "submit",
		data() {
			return {
				chatText: "",
				isrecord: false,
				toc: '../../static/img/yy.png',
				isemoj: true,
				isShow: true
			};
		},
		components: {
			emoji
		},
		methods: {
			getElementStyIe: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.submit').boundingClientRect(data => {
					this.$emit("hight", data.height)

				}).exec()
			},
			emoji(e) {
				console.log(e);

				this.chatText = this.chatText + e
				this.handleFocus()
				this.change()
			},
			//点击切换音频
			records() {
				if (this.isrecord) {
					this.isrecord = false;
					this.toc = "../../static/img/yy.png";
				} else {
					this.isrecord = true;
					this.toc = "../../static/img/jp.png";
				}
			},
			clickemoj() {
				this.isemoj = !this.isemoj

				setTimeout(() => {
					this.getElementStyIe()

				}, 10)

			},
			submitChat() {
				this.$emit('submit', this.chatText)
				setTimeout(() => {
					this.chatText = ''
					this.isShow = true
				}, 0)
			},
			handleFocus(event) {
				console.log('聚焦事件');
			},
			handleBlur(event) {
				console.log('失焦事件');
			},
			change() {

				if (this.chatText.length > 0) {
					this.isShow = false

				} else {
					this.isShow = true
				}



			}

		}
	}
</script>

<style lang="scss">
	.submit {
		background: rgba(244, 244, 244, 0.96);
		border-top: 1px solid $uni-border-color;
		width: 100%;

		position: fixed;
		bottom: 0;
		z-index: 100;
		padding-bottom: var(--status-bar-height);

		.submit-chat {
			width: 100%;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			padding: 14rpx 14rpx;


			image {
				width: 56rpx;
				height: 56rpx;
				margin: 0 10rpx;
				flex: auto;
			}

			.bt-submit {
				width: 100rpx;
				height: 50rpx;
				border-radius: 10rpx;
				text-align: center;
				line-height: 50rpx;
				background-color: #4d6398;
				font-size: $uni-font-size-sm;
			}


			.btn {
				flex: auto;
				background-color: #fff;
				border-radius: 10rpx;
				padding: 20rpx;
				max-height: 160rpx;
				margin: 0 10rpx;


			}

			.record {
				text-align: center;
				font-size: $uni-font-size-lg;
				color: $uni-text-color-grey;
			}





		}
	}

	.displaynone {
		display: none;
	}

	.emoji {
		width: 100%;
		height: 460rpx;
		background: rgba(236, 237, 238, 1);
		box-shadow: 0px -1rpx 0px 0px rgba(0, 0, 0, 0.1);
	}
</style>