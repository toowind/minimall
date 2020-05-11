<template>
	<view class="fx-gs-container">
		<view class="gs-search-wrap">
			<view class="search-inp">
				<image class="search-img" 
					   src="@/static/images/goodsSearch/search_icon@2x.png"></image>
				<input type="text"
					   :focus="true"
					   placeholder="复制京东商品标题, 搜索隐藏大额券"
					   v-model="goodsCont"
					   @confirm="goodsSearch"/>
				<image @tap="goodsCont = ''"
					   v-show="goodsCont"
					   class="close-img" 
					   src="@/static/images/goodsSearch/close_icon@2x.png"></image>
				<button type="default"
						@tap="goodsSearch">搜索</button>	
			</view>
			<block v-if="isSearchProduct">
				<view :class="['search-criteria', {'criteria-fix-top': criteriaIsFixed}]" 
					  id="criteria">
					<view :class="['sort', {'active': TabCur === 0}]" @tap="searchCriteria(0)">
						<text>综合排序</text>
					</view>
					<view :class="['price', {'active': TabCur === 1}]" @tap="searchCriteria(1, 'price')">
						<text>价格</text>
						<image v-show="TabCur != 1" src="@/static/images/goodsSearch/d.png"></image>
						<image v-show="TabCur == 1 && isTop" src="@/static/images/goodsSearch/t.png"></image>
						<image v-show="TabCur == 1 && !isTop" src="@/static/images/goodsSearch/b.png"></image>
					</view>
					<view :class="['volume', {'active': TabCur === 2}]" @tap="searchCriteria(2, 'commission')">
						<text>销量</text>
						<image v-show="TabCur != 2" src="@/static/images/goodsSearch/d.png"></image>
						<image v-show="TabCur == 2 && isTop" src="@/static/images/goodsSearch/t.png"></image>
						<image v-show="TabCur == 2 && !isTop" src="@/static/images/goodsSearch/b.png"></image>
					</view>
				</view>
			</block>
		</view>
		<block v-if="!isSearchProduct">
			<view class="gs-history-wrap">
				<block v-if="!history_data.length">
					<text class="no-search-log">暂无搜索记录</text>
				</block>
				<block v-else>
					<view class="history-cont">
						<view class="operation">
							<text class="history-log">搜索历史</text>
							<text class="history-clear" 
								  @tap="clearHistoryLog">清空历史记录</text>
						</view>
						<view class="h-list">
							<view class="h-item" v-for="(item, key) in history_data" :key="key">
								<text @tap="goodsSearch(false, item)">{{ item }}</text>
							</view>
						</view>
					</view>
				</block> 
			</view>
		</block>
		<block v-else>
			<view 
				:style="{'margin-top': criteriaIsFixed ? '37px' : ''}"
				class="search-goods-list">
				<GoodsList 
				:goodsList="goodsList"
				:scrollTop="scrollTop"
				@tapGoodsItemHandler="tapGoodsItemHandler"/>	
			</view>
		</block>
	</view>
</template>

<script>
	import GoodsList from '@/components/goodsList/goodsList.vue'
	export default {
		data () {
			return {
				history_data: [], // 历史搜索记录
				goodsCont: '', // 搜索框内容
				isSearchProduct: false, // 用户是否搜索了商品
				TabCur: 0, // 当前选择搜索条件索引
				isTop: true, // isTop -> true升序 false降序
				goodsNoMore: false, // 是否还有更多数据,若还有更多数据，则传入false, 否则传入true.
				goodsList: [], // 商品数据
				goodsParams: { // 商品参数
					page: 1,
					page_size: 10,
					keyword: '',
					sort_type: 0
				},
				criteriaScrollTop: null, // 搜索条件距顶部的距离.
				criteriaIsFixed: false, // 搜索条件是否固定在顶部.
				scrollTop: 0
			}
		},
		onLoad(params) {
			let that = this;
			if (Object.keys(params).length && params.searchCont) {
				let searchCont = decodeURIComponent(decodeURIComponent(params.searchCont));
				that.goodsCont = searchCont;
			}
			this.init();
		},
		onPageScroll (e) {
			let that = this;
			that.scrollTop = scrollTop;
			if (e.scrollTop > that.criteriaScrollTop) {
				that.criteriaIsFixed = true;
			} else {
				that.criteriaIsFixed = false;
			}
		},
		onReachBottom (e) {
			let that = this,
				goodsParams = that.goodsParams;
			if (that.goodsNoMore) {
				uni.showToast({
					title: '没有更多数据了',
					duration: 2000,
					icon: 'none'
				});
				return false;
			}
			goodsParams.page ++;
			that.getGoodsSearchData();
		},
		methods: {
			init() {
				let that = this;
				that.getLocalCacheData();
			},
			// 获取本地存储历史记录数据
			getLocalCacheData() {
				let res = uni.getStorageSync('history_data') ? JSON.parse(uni.getStorageSync('history_data')) : [];
				this.history_data = res.reverse();
			},
			// 清空历史记录
			clearHistoryLog () {
				uni.removeStorage({
					key: 'history_data',
					success: (res) => {
						this.history_data = [];
						uni.showToast({
							title: '历史记录已清空...',
							duration: 2000,
							icon: 'success'
						})
					}
				});
			},
			/*
			  点击搜索功能
				@params 
				  isSearchQuery: Boolean 是否根据输入框输入搜索查询，false不是, 否则传入true.
				  queryCont:     String  查询内容
			*/
			goodsSearch (isSearchQuery=true, queryCont) {
				let that = this,
					goodsCont = that.goodsCont,
					historyData = uni.getStorageSync('history_data') ? JSON.parse(uni.getStorageSync('history_data')) : [];
				if (!isSearchQuery) {
					that.goodsParams.keyword = queryCont;
					that.goodsCont = queryCont;
				} else {
					if(!goodsCont) {
						uni.hideToast();
						uni.showToast({
							title: '请输入商品名称...',
							duration: 2000,
							icon: 'none'
						})
						return false;
					}
					// 添加数据至本地store中
					let index = historyData.findIndex(item => item === goodsCont);
					if (index >= 0) {
						historyData.splice(index, 1);
					}
					that.goodsParams.keyword = goodsCont;
					historyData.push(goodsCont);
					uni.setStorageSync('history_data', JSON.stringify(historyData));
				}
				that.isSearchProduct = true;
				that.getGoodsSearchData();
				that.getCriteriaToTopDistance();
			},
			// 获取搜索条件 #criteria 距顶部的距离
			getCriteriaToTopDistance () {
				let that = this;
				that.$nextTick( _ =>{ // 下次DOM更新循环结束之后执行延迟回调, 必须加!
					let query = uni.createSelectorQuery().in(that);
					query.select('#criteria').boundingClientRect(data => {
						that.criteriaScrollTop = data.top;
					}).exec();
				});
			},
			// 搜索条件
			searchCriteria (tabCur, sortName='') {
				let that = this,
					goodsParams = that.goodsParams;
				if (tabCur != 0) { // 如果当前点击不为综合排序。
					if (that.TabCur === tabCur) { // 如果当前点击和当前选中一样则取反操作。
						that.isTop = !that.isTop;
					} else { // 如果点击点击搜索条件和当前选中不一致, 重置回升序状态。
						that.isTop = true;
					}
				}
				goodsParams.page = 1;
				uni.pageScrollTo({
					scrollTop: that.criteriaScrollTop,
					duration: 300
				});
				goodsParams.sortName = sortName;
				if (sortName === 'price') {
					if (that.isTop) {
						goodsParams.sort_type = 9;
						goodsParams.sort = 'asc';
					} else {
						goodsParams.sort_type = 10;
						goodsParams.sort = 'desc';
					}
				} else if (sortName === 'commission'){
					if (that.isTop) {
						goodsParams.sort_type = 5;
						goodsParams.sort = 'asc';
					} else {
						goodsParams.sort_type = 6;
						goodsParams.sort = 'desc';
					}
				} else {
					goodsParams.sort_type = 0;
					goodsParams.sort = 'desc';
				}
				that.TabCur = tabCur;
				that.getGoodsSearchData();
			},
			// 获取搜索的数据
			async getGoodsSearchData () {
				try {
					uni.hideLoading();
					uni.showLoading({
						title: '数据加载中...',
						mask: true // 是否显示透明蒙层，防止触摸穿透
					});
					let that = this,
						goodsParams = that.goodsParams,
						{status, data} = await that.$Kapi._getGoodsListByKeyword(goodsParams);	
						uni.hideLoading();
					if (status === that.$resCode.successCode) {
						if (!data.length) {
							that.goodsNoMore = true;
							uni.showToast({
								title: '没有更多数据了',
								duration: 2000,
								icon: 'none'
							});
							return false;
						}
						data.forEach(item => {
							item.fxz = (Number(item.return_cash) * Number(item.user_percent || 1)).toFixed(2);
							item.yx = item.orderCount30days >=10000 ? `${(item.orderCount30days/10000).toFixed(2)}万` : item.orderCount30days;
						})
						if (that.goodsParams.page == 1) {
							that.goodsList = data;	
						} else {
							that.goodsList = [...that.goodsList, ...data];	
						}
					}
				} catch (e) {
					console.log(e, 'error -> _getGoodsListByKeyword');
				}
			},
			// 点击商品项回调
			tapGoodsItemHandler (goods_id) {
				this.$methods.jumpToPage({jumpUrl: '/pages/goodsDetails/goodsDetails'}, {goods_id});
			},
		},
		components: {
			GoodsList
		}
 	}
</script>

<style lang="scss">
	page, .fx-gs-container{
		height: 100%;
	}
	.fx-gs-container {
		display: flex;
		flex-direction: column;
		.gs-search-wrap {
			position: relative;
			box-shadow:0px 1px 0px 0px rgba(229,229,229,1);
			padding: 20rpx 30rpx 22rpx 30rpx;
			background: #FFFFFF;
			.search-inp {
				display: flex;
				align-items: center;
				image.search-img {
					position: absolute;
					left: 50rpx;
					width: 32rpx;
					height: 32rpx;
				}
				image.close-img {
					width: 30rpx;
					height: 30rpx;
					right: 155rpx;
				}
				input {
					width: 100%;
					padding-left: 70rpx;
					height:65rpx;
					border-radius: 10rpx;
					background-color: #F7F7F7;
					padding-right: 160rpx;
				}
				button {
					font-size:36rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color: #FFFFFF;
					position: absolute;
					right: 30rpx;
					width:135rpx;
					height: 65rpx;
					line-height: 65rpx;
					background:linear-gradient(270deg,rgba(234,89,69,1) 0%,rgba(255,144,101,1) 100%);
					border-radius:10rpx;
				}
			}
			.search-criteria {
				// height: 65rpx;
				padding-top: 38rpx;
				display: flex;
				align-items: flex-end;
				&.criteria-fix-top {
					padding: 38rpx 30rpx 22rpx 30rpx;
					width: 100%;
					left: 0;
					background-color: #ffffff;
					position: fixed;
					z-index: 99;
					top: 0;
					box-shadow: 0px 1px 0px 0px #e5e5e5;
				}
				.sort,
				.price,
				.volume{
					&.active {
						> text {
							color: #EA4E3D;
						}
					}
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					> text {
						font-size:26rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color: #666666;
						margin-right: 40rpx;
					}
					> image {
						width: 20rpx;
						height: 24rpx;
					}
				}
			}
		}
		.gs-history-wrap {
			flex: 1;
			background: #FFFFFF;
			.no-search-log {
				padding-top: 65rpx;
				width: 100%;
				display: inline-block;
				font-size:30rpx;
				font-family:PingFangSC-Regular,
				PingFang SC;
				font-weight:400;
				color: #999999;
				text-align: center;
			}
			.history-cont {
				padding: 30rpx;
				.operation {
					display: flex;
					justify-content: space-between;
					margin-bottom: 30rpx;
					.history-log {
						font-size:32rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color:#333333;
					}
					.history-clear {
						font-size:24rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color:#999999;
					}
				}	
				.h-list {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					.h-item {
						background-color: #F7F7F7;
						height:60rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius:10rpx;
						margin-right: 20rpx;
						margin-bottom: 20rpx;
						text {
							display: inline-block;
							color:#666666;
							font-size: 28rpx;	
							padding: 15rpx 25rpx;	
						}
					}
				}
			}
		}
		.search-goods-list {
			background: #FFFFFF;
		}
	}
</style>