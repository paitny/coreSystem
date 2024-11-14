<template>
	<view v-if="show" class="dialog-overlay" @click="close">
		<view class="close-button" @click="closeDialog">×</view>
		<view class="dialog-content" @click.stop>
			<view class="search-box">
				<input type="text" v-model="searchQuery" placeholder="搜索" class="search-input" />
			</view>

			<view class="grade-class-level">
				<view v-for="(item, index) in filteredDataList" :key="index" class="card" @click="selectItem(item)">
					<text>{{ item }}</text>
				</view>
			</view>

			<button @click="close">关闭</button>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			dataList: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				searchQuery: ''
			};
		},
		computed: {
			filteredDataList() {
				if (!this.searchQuery) {
					return this.dataList;
				}
				return this.dataList.filter(item =>
					item.toLowerCase().includes(this.searchQuery.toLowerCase())
				);
			}
		},
		methods: {
			close() {
				this.$emit('close'); // Trigger the close event in parent component
			},
			selectItem(item) {
				this.$emit('item-selected', item); // Emit the clicked item to the parent component
			}
		}
	};
</script>

<style scoped>
	.dialog-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.dialog-content {

		background-color: white;
		padding: 20px;
		border-radius: 10px;
		max-height: 40%;
		/* Increase max height for better visibility */
		min-height: 40%;
		width: 70%;
		/* Adjust dialog width */
		overflow-y: auto;
		/* Enable vertical scrolling */
	}

	.search-box {
		margin-bottom: 15px;
		width: 90%;
	}

	.search-input {
		width: 100%;
		padding: 10px;
		font-size: 16px;
		border-radius: 5px;
		border: 1px solid #ccc;
	}

	.grade-class-level {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.card {
		background-color: #f9f9f9;
		padding: 15px;
		border-radius: 8px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	button {
		margin-top: 10px;
		background-color: #ff4081;
		color: white;
		border: none;
		padding: 10px;
		border-radius: 5px;
	}

	.close-button {
		width: 50rpx;
		height: 50rpx;
		background-color: #4d6398;
		position: absolute;
		font-size: 50rpx;
		right: 8%;
		top: 25%;
		border-radius: 50%;
		text-align: center;
		line-height: 50rpx;
		color: #fff;
	}
</style>