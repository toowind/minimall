<template>
	<view class="fx-gsDetails-container">
		<view class="gs-banner-wrap">
			<swiper class="swiper" 
					:indicator-dots="true" 
					:autoplay="true" >
				<swiper-item v-for="(banner, key) in productData.goods_gallery_urls.imageList" :key="banner.url">
					<view class="swiper-item">
						<image 
						:lazy-load="true"
						:src="banner.url"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="gs-base-wrap">
			<view class="base-title css-hide-2 vm">
				<image class="vm" src="@/static/images/index/home_jd_icon@2x.png"></image>
				<text class="vm">{{ productData.goods_name }}</text>
			</view> 	
			<view class="base-sub-data">
				<view class="sub-data-l">
					<text>原价</text>
					<text>{{ productData.min_group_price }}</text>
				</view>
				<view class="sub-data-r">
					<text class="praise">好评率{{ productData.goodCommentsShare }}</text>
					<text class="sales">月销量{{ productData.orderCount30days }}</text>
				</view>
			</view>
			<view class="base-discount">
				<view class="base-left">
					<view class="quan" v-if="productData.coupon_discount > 0 && productData.isCoupon == 1">
						<image src="@/static/images/index/quan_icon@2x.png"></image>
						<text>{{productData.coupon_discount}}元</text>
					</view>
					<view class="base-pc-price">
					  <text class="name">{{productData.priceName}}</text>
					  <text class="currency">¥</text>
					  <text class="price">{{productData.discountPrice}}</text>
					</view>
				</view>
				<view class="earn">
					<text>分享赚¥{{productData.return_cash}}</text>
				</view>
			</view>
			<view class="cupon_normal_wrap">
				<view class="cupon_wrap_left">
					<view class="cupon"  v-if="Number(productData.coupon_discount) != 0 && productData.isCoupon == 1">
						<text class="span_one">{{productData.coupon_discount}}</text>
						<text class="unit">元&nbsp;</text>
						<text class="desc">隐藏优惠券</text>
					</view>
				</view>
				<view class="cupon_wrap_right">
					<text class="participate_in">{{ Number(productData.coupon_discount) == 0 ? "立即抢购" : "立即领券" }}</text>
				</view>
			</view>
		</view>
		<view class="gs-copyOrder-wrap" @tap="copyOrderCont">
			<view class="title">推荐文案, 点击复制</view>
			<view class="name">[京东]{{ productData.goods_name }}</view>
			<view class="line">----------------------------------</view>
			<view class="context">
				<view>🔥爆款冲量🔥</view>
				<view style="margin: 10rpx 0px;">❗原价:¥{{ productData.min_group_price }}</view>
				<view style="margin: 10rpx 0px;">💰券后价: ¥{{ productData.discountPrice }}</view>
				<view>抢购链接: {{productShareUrl.purchaseUrl || ''}}</view>
			</view>
		</view>
		<view class="gs-goodsDetail-wrap" v-if="Object.keys(productData).length && productData.goods_gallery_urls.imageList.length">
			<view class="d-title">商品详情</view>
			<view class="d-cont">
				<view class="d-item" v-for="(image, key) in productData.goods_gallery_urls.imageList" :key="image.url">
					<easy-loadimage mode="widthFix"
									class="img"
									loading-mode="skeleton-1"
									:open-transition="false"
					                :scroll-top="scrollTop"
					                :image-src="image.url"></easy-loadimage>
				</view>
			</view>
		</view>
		<view class="gs-bottom-wrap">
			<view class="home-tag" @tap="jumpToPage('../index/index')">
				<image src="@/static/images/goodsDetails/tab_home_icon@2x.png" mode=""></image>
				<text>首页</text>
			</view>
			<view class="handler-btn">
				<navigator class="buy-self" @tap="jumpOtherApp()">
						<text>自己买</text>
						<text>省{{ allCash }}元</text>
				</navigator>
				<navigator class="buy-share" target="miniProgram" app-id="wx91d27dbf599dff74">
					<text>分享让好友购买</text>
					<text>赚{{ return_cash }}元</text>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue'
	export default {
		data () {
			return {
				queryParams: {}, // 页面参数
				productData: {}, // 商品详情数据
				productShareUrl: {}, // 商品分享url 
				scrollTop:0
			}
		},
		onPageScroll({scrollTop}) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			this.scrollTop = scrollTop;
		},
		onLoad(e) {
			let that = this;
			that.queryParams = e;
			that.init();
		},
		computed: {
			allCash() {
			  let that = this,
				  num = Object.keys(this.productData).length && (Number(that.productData.coupon_discount) + Number(that.productData.return_cash));
			  return num.toFixed(2);
			},
			return_cash () {
				let that = this;
				return Object.keys(that.productData).length && Number(that.productData.return_cash).toFixed(2);
			}
		},
		methods: {
			init () {
				let that = this;
				that.getProductInfo();
				that.getProductShareUrl();
			},
			// 导航跳转到指定页面
			jumpToPage (url, params) {
				let queryStr = '?';
				if (params && Object.keys(params).length > 0) {
					for (let key in params) {
						queryStr += key + '=' + params[key] + '&';
					}
					if (queryStr.endsWith('&')) {
						queryStr = queryStr.substring(0, queryStr.length-1);
					}
				}
				uni.switchTab({
					url: url + queryStr
				});
			},
			// 复制订单内容
			copyOrderCont () {
				let that = this,
				data = `[京东]${that.productData.goods_name}\n----------------------------------\n京东价:¥${that.productData.min_group_price}\n券后价: ¥${that.productData.discountPrice}\n抢购链接: ${that.productShareUrl.purchaseUrl}`;
				uni.setClipboardData({
					data,
					success: () => {
						console.log('setClipboardData->success');
					},
					fail: () => {
						console.log('setClipboardData->fail');
					}
				})
			},
			// 获取商品详情数据
			async getProductInfo () {
				try {
					let that = this,
						queryParams = that.queryParams,
						{status, data} = await that.$Kapi._getProductInfo(queryParams);
					if (status === that.$resCode.successCode) {
						that.productData = data;
						that.productData.return_cash = (Number(data.return_cash)*Number(data.user_percent || 0.5)).toFixed(2);
					}
				} catch (e) {
					console.log(e, 'error -> _getProductInfo');
				}
			},
			async getProductShareUrl () {
				try {
					let that = this,
						queryParams = that.queryParams,
						{status, data} = await that.$Kapi._getProductShareUrl(queryParams);
					if (status === that.$resCode.successCode) {
						that.productShareUrl = data;
						console.log(data);
					}
				} catch (e) {
					console.log(e, 'error -> _getProductShareUrl');
				}
			},
			// 跳转其他app
			jumpOtherApp () {
				wx.navigateToMiniProgram({
					appId: "wx91d27dbf599dff74",
					path: `pages/union/proxy/proxy?spreadUrl=${this.productShareUrl.purchaseUrl}&EA_PTAG=17078.27.118`,
					extraData: {
						open: "auth"
					},
					success(res) {
						console.log(res);
					},
					fail(e) {
						console.log(e)
					}
				});
			}
		},
		components: {
			easyLoadimage
		}
		
	}
</script>

<style lang="scss">
	.fx-gsDetails-container {
		.gs-banner-wrap {
			width: 100%;
			height: 750rpx;
			.swiper {
				height: 100%;
				.swiper-item {
					height: 100%;
				}
			}
		}
		.gs-base-wrap {
			overflow: hidden;
			background-color: #FFFFFF;
			padding: 20rpx 30rpx 0 30rpx;
			.base-title {
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
			.base-sub-data {
				padding: 20rpx 0 30rpx 0;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				.sub-data-l {
					text {
						font-size:26rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color: #969696;
					}
					text:nth-child(2) {
						text-decoration: line-through;
					}
				}
				.sub-data-r {
					.praise {
						font-size:26rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color: #969696
					}
					.sales {
						margin-left: 20rpx;
						font-size:26rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color: #969696
					}
				}
			}
			.base-discount {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.base-left {
					display: flex;
					flex-direction: row;
					align-items: center;
					.quan {
						display: flex;
						align-items: center;
						justify-content: space-between;
						position: relative;
						height: 34rpx;
						border:1px solid #FB4144;
						border-radius:4px;
						min-width: 115rpx;
						margin-right: 20rpx;
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
					.base-pc-price {
						.name {
							text-align: left;
							width: 100%;
							font-size: 28rpx;
							font-family: PingFangSC-Regular,PingFang SC;
							font-weight: 400;
							color: #666;
						}
						.currency {
							font-size:22rpx;
							font-family:PingFangSC-Regular,PingFang SC;
							font-weight:400;
							color:#333333;
						}
						.price {
							font-size:34rpx;
							font-family:PingFangSC-Regular,PingFang SC;
							font-weight:400;
							color:#333333;
						}
						
					}
				}
				.earn {
					padding: 15rpx 23rpx;
					background: -webkit-gradient(linear,right top,left top,from(#ff4d52),to(#ff7749));
					background: linear-gradient(270deg,#ff4d52,#ff7749);
					border-radius: 32rpx 0 0 32rpx;
					display: -webkit-box;
					display: -ms-flexbox;
					display: flex;
					-webkit-box-align: baseline;
					-ms-flex-align: baseline;
					align-items: baseline;
					-webkit-box-pack: center;
					-ms-flex-pack: center;
					justify-content: center;
					font-size: 30rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight: 400;
					color: #fff;
					line-height: 26rpx;
				}
			}
			.cupon_normal_wrap {
				margin: 30rpx 0;
				background: url("../../static/images/goodsDetails/xq_quan_bg@2x.png") no-repeat;
				background-size: 100% 100%;
				width: 100%;
				height: 85rpx;
				display: flex;
				align-items: center;
				justify-content: baseline;
				color: #ff4e52;
				.cupon_wrap_left {
					height: 100%;
					display: flex;
					align-items: center;
					padding-left: 28rpx;
					flex: 1;
					.cupon {
						font-size: 22rpx;
						font-weight: 700;
						letter-spacing: 1rpx;
						.span_one {
							font-size: 44rpx;
							letter-spacing: 1rpx;
						}
						.unit {
							font-size: 28rpx;
							font-family: PingFangSC-Medium,PingFang SC;
							font-weight: 500;
							color: #ff4e52;
							letter-spacing: 1rpx;
							padding: 0 10rpx 0 5rpx;
						}
						.desc {
							font-size: 24rpx;
							font-family: PingFangSC-Regular,PingFang SC;
							font-weight: 400;
							color: #ff4e52;
						}
					}
				}
				.cupon_wrap_right {
					width: 200rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					.participate_in {
						text-align: center;
						width: 167rpx;
						font-size:32rpx;
						font-family:PingFangSC-Medium,PingFang SC;
						font-weight:500;
						color: #ff4e52;
					}
				}
			}
		}
		.gs-copyOrder-wrap {
			margin-top: 15rpx;
			padding: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			background: #ffffff;
			.title {
				font-size: 30rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: bold;
				color: rgba(102, 102, 102, 1);
				line-height: 42rpx;
			}
			.name {
				width: 690rpx;
				margin-top: 10rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666666;
				line-height: 48rpx;
			}
			.line {
				width: 100%;
				margin-top: 10rpx;
				margin-bottom: 23rpx;
				text-align: left;
				color: #979797;
			}
			.context {
				width: 100%;
				text-align: left;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(102, 102, 102, 1);
				line-height: 38rpx;
			}
		}
		.gs-goodsDetail-wrap {
			background-color: #ffffff;
			margin-top: 16rpx;
			padding: 15rpx 30rpx 100rpx;
			.d-title {
				padding-bottom: 16rpx;
				height: 88rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30rpx;
				font-family: PingFangSC-Medium,PingFang SC;
				font-weight: 500;
				color: #666;
				line-height: 42rpx;
			}
			.d-cont {
				padding-top: 24rpx; 
				.d-item {
					&:last-child {
						margin-bottom: 0;
					}
					margin-bottom: 10rpx;
					width: 100%;
					image {
						width: 100%;
					}
				}
			}
		}
		.gs-bottom-wrap {
			display: flex;
			align-items: center;
			width: 100%;
			height: 100rpx;
			background-color: #fff;
			position: fixed;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 1998;
			.home-tag {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-direction: column;
				width: 110rpx;
				height: 100%;
				padding: 10rpx 0 7rpx 0;
				image {
					width: 44rpx;
					height: 44rpx;
					margin-bottom: 12rpx;
				}
				text {
					height:24rpx;
					font-size:24rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color: #999999;
					line-height:24rpx;
				}
			}
			.handler-btn {
				flex: 1;
				height: 100%;
				display: flex;
				flex-direction: row;
				font-size: 32rpx;
				font-family: PingFangSC-Medium,PingFang SC;
				font-weight: 500;
				color: #ffffff;
				.buy-self {
					background: #f2b35f;
					width: 50%;
					height: 100%;
					text-align: center;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					text {
						font-size:32rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color:#FFFFFF;
						line-height:32rpx;
						&:last-child {
							font-weight:500;
							margin-top: 10rpx;
						}
					}
				}
				.buy-share {
					background: #ea4e3d;
					width: 50%;
					height: 100%;
					text-align: center;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					text {
						font-size:32rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color:#FFFFFF;
						line-height:32rpx;
						&:last-child {
							font-weight:500;
							margin-top: 10rpx;
						}
					}
				}
			}
		}
	}
</style>