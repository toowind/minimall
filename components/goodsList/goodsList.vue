<template>
	<view class="idx-cont-list">
		<view class="cont-item" 
			  v-for="(item, key) in goodsList" 
			  :key="key"
			  @tap="goodsItemHandler(item.goods_id)">
			<view class="c-item-left">
				<easyLoadimage 
					class="img"
					loading-mode="skeleton-1"
					mode="widthFix"
					:open-transition="false"
					:scroll-top="scrollTop"
					:image-src="item.goods_thumbnail_url"></easyLoadimage>
			</view>
			<view class="c-item-right">
				<view class="r-title css-hide-2 vm">
					<image class="vm" src="@/static/images/index/home_jd_icon@2x.png"></image>
					<text class="vm">{{ item.goods_name }}</text>
				</view>
				<view class="r-info">
					<view class="quan"  v-if="item.isCoupon == 1 && item.coupon_discount > 0">
						<image src="@/static/images/index/quan_icon@2x.png" mode=""></image>
						<text>{{item.coupon_discount}}元</text>
					</view>
					<text class="volume">月销{{ item.yx }}</text>
				</view>
				<view class="r-price">
					<view class="post-coupon">
						<text>{{item.priceName}}</text>
						<text>¥</text>
						<text>{{item.present_price}}</text>
					</view>
					<view class="original-price">
						<text>原价¥{{item.min_group_price}}</text>
					</view>
				</view>
				<template v-if="isShare == 1">
					<view class="r-btn">
						<text class="vm">立即购买</text>
					</view>
				</template>
				<template v-else>
					<view class="r-btn">
						<image class="vm" src="@/static/images/index/btn_share_icon@2x.png" mode=""></image>
						<text class="vm">分享赚¥{{ item.fxz }}</text>
					</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue'
export default {
	props:{
		// 商品数据
		goodsList: {
			type: Array,
			required: true,
			default: () => []
		},
		// 滚动距离
		scrollTop: {
			type: Number,
			required: true,
			default: 0
		},
		// 登录状态
		loginStatus: {
			type: Boolean,
			required: true,
			default: false
		},
		// 是否分享 0为A 1为A分享给B
		isShare: {
			type: Number,
			required: true,
			default: 0
		}
	},
	methods: {
		// 商品列表项回调
		goodsItemHandler (goods_id) {
			this.$emit('tapGoodsItemHandler', goods_id);
		}
	},
	components: {
		easyLoadimage
	}
}
</script>

<style lang="scss">
.idx-cont-list {
	background-color: #FFFFFF;
	.cont-item {
		padding: 25rpx;
		display: flex;
		flex-direction: row;
		&:last-child {
			padding-bottom: 30rpx;
			margin-bottom: 0;
		}
		.c-item-left {
			display: flex;
			align-items: center;
			.img,
			.easy-loadimage,
			.origin-img,
			.loading-img,
			.loadfail-img {
				border-radius:10px;
				width: 270rpx;
				height: 270rpx;
			}
		}
		.c-item-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 20rpx;
			flex: 1;
			.r-title {
				text-align: left;
				line-height: 44rpx;
				image {
					width: 58rpx;
					height: 28rpx;
					margin-right: 10rpx;
				}
				text {
					color: #333333;
					font-size:32rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
				}
			}
			.r-info {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				.quan {
					display: flex;
					align-items: center;
					justify-content: space-between;
					position: relative;
					height: 34rpx;
					border:1px solid #FB4144;
					border-radius:4px;
					min-width: 115rpx;
					image {
						width: 40rpx;
						height: 34rpx;
					}
					text {
						padding: 0 10rpx;
						text-align: center;
						flex: 1;
						font-size:24rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color: #FF4D52;
					}
				}
				.volume {
					// flex: 1;
					// text-align: right;
					font-size:24rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color: #999999;
				}
			}
			.r-price {
				display: flex;
				justify-content: space-between;
				.post-coupon {
					color: #999999;
					font-family:PingFangSC-Regular,PingFang SC;
					text {
					  font-size:24rpx;
					  font-family:PingFangSC-Regular,PingFang SC;
					  font-weight:400;
					  color:rgba(153,153,153,1);
					  &:nth-of-type(2) {
						font-size:22rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						color:rgba(51,51,51,1);
					  }
					  &:nth-of-type(3) {
						font-size:32rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						color:rgba(51,51,51,1);
					  }
					}
				}
				.original-price {
					text {
						color: #999999;
						font-size:24rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						text-decoration: line-through;
					}
				}
			}
			.r-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				height:56rpx;
				background:linear-gradient(270deg,rgba(255,77,82,1) 0%,rgba(255,119,73,1) 100%);
				border-radius:8px;
				image {
					width: 30rpx;
					height: 30rpx;
				}
				text {
					color: #ffffff;
					margin-left: 15rpx;
					font-size:30rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
				}
			}
		}	
	}
}
</style>