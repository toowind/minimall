<template>
	<view class="fx-fsp-container">
		<view class="fsp-banner-wrap">
			<image :src="bannerImg" mode="scaleToFill"></image>
		</view>
		<GoodsList :goodsList="fspList"/>
	</view>
</template>

<script>
	import GoodsList from '@/components/goodsList/goodsList.vue'
	export default {
		data () {
			return {
				bannerImg: "https://view.youth.cn/20200409jdSell/fire_goods_bg.jpg", // banner图片
				fspList: [], // 9.9包邮数据
				goodsNoMore: false, // 是否还有更多数据,若还有更多数据，则传入false, 否则传入true.
				goodsListParams: { // 商品列表参数
					opt_id:"0_10",
					page: 1,
					page_size: 10,
					sort_type: 1,
					response_type: 1
				}
			}
		},
		onLoad() {
			this.init();
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
			init() {
				let that = this;
				that.getFspListData();
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
							console.log(that.fspList)
						}
				} catch (e) {
					console.log(e, 'error -> _getHomeList');
				}
			}
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