<template>
	<view class="fx-fsp-container">
		<view class="fsp-banner-wrap">
			<image :src="bannerImg" mode="scaleToFill"></image>
		</view>
		<GoodsList 
			:goodsList="fspList"
			:scrollTop="scrollTop"
			@tapGoodsItemHandler="tapGoodsItemHandler"/>
	</view>
</template>

<script>
	import GoodsList from '@/components/goodsList/goodsList.vue'
	export default {
		data () {
			return {
				bannerImg: "https://view.youth.cn/20200409jdSell/youhui_bg.jpg", // banner图片
				fspList: [], // 优惠券数据
				scrollTop: 0,
				goodsNoMore: false, // 是否还有更多数据,若还有更多数据，则传入false, 否则传入true.
				goodsListParams: { // 商品列表参数
					page: 1,
					page_size: 10,
					sort_type: 1,
					response_type: 1,
					opt_id:"0_1",
				}
			}
		},
		onShow() {
			this.init();
		},
		onPageScroll ({scrollTop}) {
			let that = this;
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
		    that.scrollTop = scrollTop;
		},
		onReachBottom (e) {
			let that = this,
				goodsListParams = that.goodsListParams;
			if (that.goodsNoMore) {
				uni.showToast({
					title: '没有更多数据了',
					duration: 2000,
					icon: 'none'
				});
				return false;
			}
			goodsListParams.page ++;
			that.getFspListData();
		},
		methods: {
			async init() {
				let that = this,
					netWorkStatus = await that.$methods.checkIsNetwork();
				if (netWorkStatus) {
					if (that.goodsListParams.page === 1) {
						that.getFspListData();
					}
				}
			},
			async getFspListData () {
				try {
					uni.hideLoading();
					uni.showLoading({
						title: '数据加载中...',
						mask: true // 是否显示透明蒙层，防止触摸穿透
					});
					let that = this,
						goodsListParams = that.goodsListParams,
						{status, data} = await that.$Kapi._getGoodsList(goodsListParams);
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
							if (that.goodsListParams.page == 1) {
								that.fspList = data;	
							} else {
								that.fspList = [...that.fspList, ...data];	
							}
						}
				} catch (e) {
					console.log(e, 'error -> _getHomeList');
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

<style lang="scss" scoped>
	.fx-fsp-container {
		padding: 17rpx;
		.fsp-banner-wrap {
			width: 100%;
			background-color: #FFFFFF;
			margin-bottom: 15rpx;
			padding: 10rpx;
			height: 260rpx;
			> image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>