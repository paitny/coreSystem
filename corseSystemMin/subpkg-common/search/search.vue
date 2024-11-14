<template>
	<view class="search">
		<view class="search-container">
			<uni-search-bar @input="input" :focus="true"  :radius="20" bgColor="#F7F7F7" cancelButton="none" v-model="keyword" ref="searchBar"></uni-search-bar>
		</view>
		<!-- 搜索列表 -->
		<view class="" v-if="searchList.length!=0 ">
			<view v-if="searchList.length!=0">
				<view class="container">
				<view class="data-area">
						<view class="index">
							<view class="new_box" style="margin-top: 20upx;">
								<view class="bbox">
									<view class="list-box" v-for="(searchItem,searchIndex) in searchList" :key="searchIndex"
										@click="handleView(searchItem._id)">
										<view class="list-ed">
											<image class="list-img" :src="baseURL+searchItem.cover" ></image>
											<view class="list-right">
												<view class="list-name">{{searchItem.title}}</view>
												<view class="list-da">
													<p>{{delHtmlTag(searchItem.des).substring(0,14)}}</p>
				
												</view>
											</view>
										</view>
									</view>
				
								</view>
							</view>
						</view>
				</view>
				</view>
			</view>
		</view>
		
		<view v-else>
			<!-- 搜索历史 -->
			<view class="history">
				<view class="history-title">
					<text>历史搜索</text>
					<uni-icons type="trash" size="20" color="#C0C0C0" @click="clearHistory"></uni-icons>
				</view>
				<view class="history-content" v-if="historyList.length!=0">
					<view class="history-item" v-for="(historyItem,historyIndex) in historyList" :key="historyIndex"  @click="handhistoryItem(historyItem)">
						{{historyItem}}
					</view>
				</view>
				<view class="history-none" v-else>
					<text>无搜索历史</text>
				</view>
			</view>
			<!-- 搜索发现 -->
			<view class="found">
				<view class="found-title">
					<text>搜索发现</text>
					<uni-icons type="" size="20" color="#C0C0C0"></uni-icons>
				</view>
				<view class="found-content">
					<view class="found-item" v-for="(foundItem,foundIndex) in foundList" :key="foundIndex" @click="handFound(foundItem)">
						{{foundItem}}
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseURL: "",
				// 初始化定时器为空
				timer: null,
				// 用户输入的关键词
				keyword: '',
				//搜索数据的数组初始化
				searchList: [],
				//搜索历史初始化
				historyList: [],
				// 初始化搜索发现列表
				foundList: []
			};
		},
		methods: {
			handhistoryItem(historyItem){
				
				this.keyword=historyItem
			},
			handFound(handItem){
				this.keyword=handItem
			},
			handleView(id) {
				uni.navigateTo({
					url: '../../pagesHome/news/news?id=' + id
				});
			},
			delHtmlTag(str) {
				return str.replace(/[^\u4e00-\u9fa5]/g, '')
			
			},
			//用户输入时可以获取用户输入的内容
			input(e) {
				//每次使用先清空定时器，优化
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.keyword = e
					//获取搜索数据
					this.getSearchContent()
				}, 500)
			},
			//获取搜索列表的方法
			async getSearchContent() {
				if (this.keyword.length == 0) {
					this.searchList = [];
					
					return
				} else {
					await uni.$http.get('/api/get/search',{query:this.keyword}).then((res)=>{
						
						this.searchList = res.data.data.results
						//把搜索的关键字保存到historyList中
						this.saveHistory()
					})
					
					
				}
			},
			// 保存历史记录
			saveHistory() {
				if (this.historyList.indexOf(this.keyword) == -1) {
					this.historyList.unshift(this.keyword)
					// 把用户输入的内容保存到历史记录当中
					uni.setStorage({
						key:'kw',
						data:JSON.stringify(this.historyList || '[]')
					} )
				}
			},
			// 清空历史记录
			clearHistory() {
				this.historyList = []
				uni.removeStorage({
					key:'kw'
				})
				if (his.length == 0) {
					this.his = !this.his
				}
			},
			async getFoundList(){
				await uni.$http.get('/api/route/foundList').then((res)=>{
					this.foundList = res.data.foundList
					
				})
			}
		},
		onLoad() {
			this.getFoundList()
			// 从缓存中读取历史记录
			this.historyList = JSON.parse(uni.getStorageSync('kw'))
			
			this.baseURL = uni.baseURL
			
		}
		
	}
</script>

<style lang="scss">
	.container{
		width: 100%;
		display: flex;
		background-color: aliceblue;

	.data-area {
		flex: 1;
		width: 100%;
		
	
		.page {
			background-color: #eee;
		}
	
		/* 已选择 */
		.selde {
			border: 1px solid red;
			background: red;
			color: #FFFFFF;
			border-radius: 20upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			font-size: 20upx;
			padding: 0 10upx;
		}
	
		.selde-q {
			width: 18upx;
			height: 18upx;
			border-radius: 50%;
			background: #FFFFFF;
			margin-left: 6upx;
		}
	
		/* 未选择 */
		.noselde {
			border: 1px solid #959595;
			background: #FFFFFF;
			color: #959595;
			border-radius: 20upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			font-size: 20upx;
			padding: 0 10upx;
		}
	
		.noselde-q {
			border: 1px solid #959595;
			width: 16upx;
			height: 16upx;
			border-radius: 50%;
			background: #FFFFFF;
			margin-left: 6upx;
		}
	
		.list-box {
			display: flex;
			flex-direction: column;
			background-color: #fff;
			margin: 0upx 16upx 16upx 16upx;
			padding: 16upx;
			border-radius: 10upx;
		}
	
		.list-ed {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
		}
	
		.list-left {
			margin-right: 16upx;
		}
	
		.list-img {
			width: 160upx;
			height: 160upx;
			margin: 0upx 16upx 0upx 0upx;
		}
	
		.list-right {
			display: flex;
			flex-direction: column;
			width: 510upx;
			height: 180upx;
			justify-content: center;
		}
	
		.list-right-img {
			width: 140upx;
			height: 38upx;
		}
	
		.noadsop {
			width: 120upx;
			height: 32upx;
		}
	
		.list-head {
			display: flex;
			justify-content: flex-end;
			margin-bottom: 10upx;
		}
	
		.list-name {
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			margin-bottom: 10upx;
			font-size: 37rpx;
		}
	
		.list-da {
			font-size: 23rpx;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			/* 控制显示的行数 */
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-overflow: ellipsis;
			/* 添加省略号 */
			white-space: normal;
			/* 设置为 normal，确保在多行文字时生效 */
		}
	
	
	
	
	
	}
		}
	.search {
		width: 100%;
		height: 100vh;
		background-color: #FFF;

		.search-container {
			width: 100%;
		}

		.search-list {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			display: flex;
			border-bottom: 1px solid #eee;

			uni-icons {
				margin: 0 20rpx;
			}
		}

		.history {
			.history-title {
				width: 90%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 0 auto;

				text {
					font-weight: bold;
					font-size: 34rpx;
				}
			}

			.history-content {
				width: 90%;
				margin: 10rpx auto;
				display: flex;
				flex-wrap: wrap;

				.history-item {
					height: 50rpx;
					line-height: 50rpx;
					background-color: #F8F8F8;
					margin-top: 10rpx;
					margin-right: 20rpx;
					padding: 0 20rpx;
					border-radius: 20rpx;
				}
			}

			.history-none {
				width: 100%;
				height: 100rpx;
				text-align: center;
				line-height: 100rpx;
			}
		}

		.found {
			margin-top: 50rpx;

			.found-title {
				width: 90%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 0 auto;

				text {
					font-weight: bold;
					font-size: 34rpx;
				}
			}

			.found-content {
				width: 90%;
				margin: 10rpx auto;
				display: flex;
				flex-wrap: wrap;

				.found-item {
					height: 50rpx;
					line-height: 50rpx;
					background-color: #F8F8F8;
					margin-top: 10rpx;
					margin-right: 20rpx;
					padding: 0 20rpx;
					border-radius: 20rpx;
				}
			}
		}
	}
</style>