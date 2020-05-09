<template>
	<view class="fx-sc-container">
		<view class="sc-tip-wrap">
			<view class="st-helpImg"></view>
			<view class="st-text">
				<text>通过转换后的链接, 所产生的订单才能计入您的佣金</text>
				<navigator hover-class="none" url="/pages/spinChain/spinChainManual/spinChainManual" open-type="navigate" class="czzn">操作指南</navigator>
			</view>
		</view>
		<view class="sc-cont-wrap">
			<view class="cont-textarea">
				<textarea
					class="cont-body"
					maxlength="-1"
					v-model="linkCont"
					placeholder="请将您要推广的京东链接粘贴到这里"/>
			</view>
			<view class="cont-textarea-tip">
				<text class="not-to">{{ linkType != 1 ? '* 当前链接不可直接推广, 请先完成转链' : '' }}</text>
				<text class="clear" @tap="clearLinkCont">清空</text>
			</view>
		</view>
		<view class="sc-footer-wrap">
			<button class="trans" @tap="changeConvertUrl(null)">转换为我的链接</button>
			<template v-if="Object.keys(transChainData).length">
				<button class="share" open-type="share">
					<image src="@/static/images/spinChain/tab_home_icon@2x.png"></image>
					<text>分享</text>
				</button>
			</template>
			<template v-else>
				<button class="share" @tap="noShare">
					<image src="@/static/images/spinChain/tab_home_icon@2x.png"></image>
					<text>分享</text>
				</button>
			</template>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="sc-firstTip-wrap">
				<text class="sc-first-content">当你看到其他京东客推广的商品比较好，想由自己来推广，复制对方的链接，在【中青看点】内使用链工具转换链接，即可将商品转换为您自己的商品，此时将商品推广给您的朋友，好友下单您即可获得返现</text>
				<view class="sc-first-footer" @tap="closePopup('popup')">我知道了</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="sheetPopup" type="bottom">
			<view class="sc-sheet-wrap">
				<view class="product-header">
					<text class="h-title">识别到1个商品</text>
					<image @tap="closePopup('sheetPopup')" src="@/static/images/goodsSearch/close_icon@2x.png" class="h-image"></image>
				</view>
				<view class="product-count">
					<view class="product-item" @tap="jumpGoodsDetail">
						<view class="p-c-left">
							<image :src="transChainData.img">
						</view>
						<view class="p-c-right">
							<text class="c-r-title css-hide-2">{{ transChainData.goods_name }}</text>
							<view class="c-r-volume">
								<view class="quan" v-if="transChainData.discount != 0">
									<image src="@/static/images/index/quan_icon@2x.png"></image>
									<text>{{ transChainData.discount }}元</text>
								</view>
							</view>
							<view class="c-r-info">
								<template v-if="transChainData.is_pg == 1 || transChainData.is_coupon == 1">
									<view class="l-text">
										<template v-if="transChainData.is_pg == 1 && transChainData.is_coupon == 0">拼购价</template>
										<template v-else-if="transChainData.is_pg == 0 && transChainData.is_coupon == 1">券后价</template>
										<template v-else-if="transChainData.is_pg == 1 && transChainData.is_coupon == 1">券后价</template>
										<template v-else>京东价</template>
										<text>¥</text>
										<text>
											<template v-if="transChainData.is_pg == 1 || transChainData.is_coupon == 1">{{ transChainData.discountPrice  }}</template>
											<template v-else>{{ transChainData.price }}</template>
										</text>
									</view>
								</template>
								<template v-else>
									<text class="l-text">京东价<text>¥</text><text>{{ transChainData.price }}</text></text>
								</template>
								<view class="r-text">分销赚¥<text>{{ transChainData.return_cash }}</text></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		data () {
			return {
				linkCont: '', // 转链板内容
				linkType: null, // 0为空数据 1为京东链接 2为有数据,但不是京东链接
				isKnow: false, // 用户是否点击第一次进入我知道了
				transChainData: {}, // 转链的数据
				userChainType: { // 映射转链类型
					0: '请复制京东商品链接。',
					1: '转链成功！\r\n已复制到剪切板, 快转发赚钱吧。',
					2: '未识别到商品链接，请确认内容。',
					3: '非京东商品链接，请重新选择商品后再来。'
				},
				params: {} // 页面参数
			}
		},
		watch: {
			sheetShow: {
				handler (newV) {
					newV && this.$refs.sheetPopup.open();
				}
			}
		},
		computed: {
			// 是否显示商品项
			sheetShow: {
				get () {
					return (Object.keys(this.transChainData).length && this.linkType == 1) ? true : false;
				},
				set () {}
			}
		},
		onShareAppMessage (res) {
			let that = this;
			if (res.from === 'button') {
				return {
				  title: `[京东]${that.transChainData.goods_name}`,
				  imageUrl: that.transChainData.img,
				  path: `/pages/goodsDetails/goodsDetails?goods_id=${that.transChainData.goods_id}`
				}
			}
		},
		onLoad(params) {
			let that = this;
			that.params = params;
			that.init();
		},
		methods: {
			// 初始化
			init () {
				this.callDialog();
			},
			// 用户第一次进入
			callDialog () {
				let that = this;
				// 判断用户是否第一次进入
				if (!uni.getStorageSync('isFirstTip')) {
					this.$refs.popup.open();
					uni.setStorageSync('isFirstTip', 'true');
				} else {
					that.isKnow = true;
					if (Object.keys(that.params).length && that.params.searchUrl) {
						let searchUrl = decodeURIComponent(decodeURIComponent(that.params.searchUrl));
						that.changeConvertUrl(searchUrl);
					}
				}
			},
			closePopup(refName) {
				let that = this;
				that.$refs[refName].close();
				if (refName === "popup") {
					if (Object.keys(that.params).length && that.params.searchUrl) {
						let searchUrl = decodeURIComponent(decodeURIComponent(that.params.searchUrl));
						that.changeConvertUrl(searchUrl);
					}
				}
			},
			// 点击商品项跳转至商品详情页
			jumpGoodsDetail () {
				let that = this,
					goods_id = that.transChainData.goods_id;
				uni.navigateTo({
					url: '/pages/goodsDetails/goodsDetails?&goods_id=' + goods_id
				});
			},
			noShare () {
				uni.hideToast();
				uni.showToast({
					title: '您还没有进行转链操作，无法分享!',
					duration: 2000,
					icon: 'none'
				});
			},
			// 获取用户剪切板的内容
			async changeConvertUrl (searchUrl=null) {
				let that = this;
				if (Object.keys(that.transChainData).length) {
					uni.hideToast();
					uni.showToast({
					    title: '已经转链完成，分享给朋友吧!',
					    duration: 2000,
						icon: 'none'
					});
					return;
				}
				if (searchUrl === null) {
					if (that.linkCont) {
						if (that.linkCont.includes('jd.com')) {
							that.linkType = 1;
						} else {
							that.linkType = 2;
						}
					} else {
						that.linkType = 0;
					}
					
					if (that.linkType == 0 || that.linkType == 2) {
						if (that.userChainType[that.linkType]) {
							uni.showToast({
								title: that.userChainType[that.linkType],
								duration: 2000,
								icon: 'none'
							});	
						}
						return;
					}
				}
				function httpString(s) {
					var reg= /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
					s = s.match(reg);
					return(s)
				}
				uni.hideLoading();
				uni.showLoading({
					title: '数据加载中...',
					mask: true // 是否显示透明蒙层，防止触摸穿透
				});
				let url = searchUrl === null ? httpString(that.linkCont)[0] : searchUrl,
					{status, data} = await that.$Kapi._getConvertUrls({ url: url });
				uni.hideLoading();
				if (status === that.$resCode.successCode) {
					that.linkType = 1;
					that.transChainData = data;
					that.linkCont = `[京东]${that.transChainData.goods_name}\n----------------------------------\n京东价:¥${that.transChainData.price}\n券后价: ¥${that.transChainData.discountPrice}\n抢购链接: ${that.transChainData.purchaseUrl}`;
					uni.setClipboardData({
						data: that.linkCont,
						success: () => {
							uni.showToast({
								title: that.userChainType[that.linkType],
								duration: 2000,
								icon: 'none',
								mask: true
							});	
						},
						fail: () => {
							uni.showToast({
								title: '转链成功！\r\n复制失败, 请重新复制。',
								duration: 2000,
								icon: 'none',
								mask: true
							});	
						}
					})
				}
			},
			// 清空推广链接文字
			clearLinkCont () {
				let that = this;
				that.linkType = null;
				that.transChainData = {};
				that.linkCont = '';
			}
		},
		components: {
			uniPopup
		}
	}
</script>

<style lang="scss">
	page, .fx-sc-container {
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
	}
	.fx-sc-container {
		background: #fff;
		flex-direction: column;
		justify-content: space-between;
		display: flex;
		.sc-tip-wrap {
			height: 140rpx;
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			padding: 20rpx 40rpx 25rpx 40rpx;
			background-color: #fff9e9;
			.st-helpImg {
				background: url("@/static/images/spinChain/top_help_icon@2x.png") no-repeat;
				display: inline-block;
				width: 30rpx;
				height: 30rpx;
				background-size: 30rpx 30rpx;
				margin-top: 8rpx;
			}
			.st-text {
				margin-left: 12rpx;
				flex: 1;
				font-family: PingFangSC-Regular,PingFang SC;
				font-size: 30rpx;
				line-height: 48rpx;
				.czzn {
					display: inline-block;
					font-weight: 700;
					margin-left: 3px;
					border-bottom: 2px solid #eb5e4f;
					color: #eb5e4f;
				}
			}
		}
		.sc-cont-wrap {
			flex: 1;
			padding: 30rpx 30rpx 130rpx 30rpx;
			width: 100%;
			position: absolute;
			top: 140rpx;
			.cont-textarea {
				padding: 0;
				height: 682rpx;
				background: #f7f7f7;
				border-radius: 8px;
				.cont-body {
					width: 100%;
					padding: 35rpx;
					height: 682rpx !important;
					line-height: 50rpx;
					color: #999999;
					font-size: 30rpx;
					font-family: PingFangSC-Regular,PingFang SC;
					font-weight: 400;
				}
			}
			.cont-textarea-tip {
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.not-to {
					color: #eb5e4f;
					font-family: PingFangSC-Regular,PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
				}
				.clear {
					color: #666;
					font-size: 28rpx;
					font-family: PingFangSC-Medium,PingFang SC;
					font-weight: 500;
				}
			}
		}
		.sc-footer-wrap {
			position: fixed;
			width: 100%;
			left: 0;
			bottom: 0;
			display: flex;
			height: 100rpx;
			background: #ffffff;
			z-index: 9999!important;
			.trans {
				border-radius: 0;
				background-color: #ea4e3d;
				line-height: 100rpx;
				font-size: 32rpx;
				color: #ffffff;
				flex: 1;
			}
			.share {
				position: relative;
				height: 100rpx;
				width: 180rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				&:before {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					border-top: 1px solid #e5e5e5;
					transform: scaleY(0.5);
					transform-origin: left top;
				}
				> image {
					width: 40rpx;
					height: 40rpx;
					margin-bottom: 9rpx;
				}
				> text {
					color: #999;
					font-size: 24rpx;
				}
			}
		}
		.sc-firstTip-wrap {
			position: fixed;
			top: 45%;
			left: 50%;
			width: 320px;
			overflow: hidden;
			font-size: 16px;
			background-color: #fff;
			border-radius: 16px;
			transform: translate3d(-50%,-50%,0);
			backface-visibility: hidden;
			transition: .3s;
			transition-property: opacity,-webkit-transform;
			transition-property: transform,opacity;
			transition-property: transform,opacity,-webkit-transform;
			.sc-first-content {
				display: inline-block;
				text-align: center;
				color: #666666;
				font-size: 30rpx;
				font-weight: 400;
				max-height: 60vh;
				padding: 50rpx;
				overflow-y: auto;
				white-space: pre-wrap;
				text-align: center;
				word-wrap: break-word;
			}
			.sc-first-footer {
				text-align: center;
				height: 80rpx;
				line-height: 80rpx;
				margin: 0 auto;
				margin-bottom: 35rpx;
				width: 472rpx;
				border-radius: 40px;
				background-color: #ea4e3d;
				font-size: 36rpx;
				font-family: PingFangSC-Regular,PingFang SC;
				font-weight: 400;	
				color: #fff;
			}
		}
		.sc-sheet-wrap {
			position: relative;
			z-index: 9999 !important;
			width: 100%;
			bottom: 100rpx;
			left: 0;
			border-radius: 0;
			background-color: #ffffff;
			.product-header {
				background-color: #ffffff;
				height: 90rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-right: 30rpx;
				border-bottom: 1px solid #e5e5e5;
				.h-title {
					left: 50%;
					position: relative;
					transform: translateX(-50%);
					color: #333333;
					font-size: 34rpx;
					font-family: PingFangSC-Medium,PingFang SC;
					font-weight: 500;
				}
				.h-image {
					justify-self: flex-end;
					width: 34rpx;
					height: 34rpx;
				}
			}
			.product-count {
				background-color: #ffffff;
				.product-item {
					background-color: #fff;
					display: flex;
					flex-direction: row;
					padding: 30rpx;
					.p-c-left {
						width: 165rpx;
						height: 165rpx;
						image {
							width: 165rpx;
							height: 165rpx;
							border-radius: 10px;
						}
					}
					.p-c-right {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						margin-left: 25rpx;
						.c-r-title {
							height: 80rpx;
							font-family: PingFangSC-Regular,PingFang SC;
							font-weight: 400;
							font-size: 30rpx;
							color: #333333;
							line-height: 40rpx;
						}
						.c-r-volume {
							display: flex;
							align-items: center;
							align-self: flex-start;
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
						}
					    .c-r-info {
							height: 17px;
							display: flex;
							justify-content: space-between;
							.l-text {
								color: #999999;
								font-size: 24rpx;
								text:nth-child(1) {
									color: #333;
									font-size: 22rpx;
									margin-left: 5rpx;
								}
								text:nth-child(2) {
									color: #333333;
									font-size: 32rpx;
								}
							}
							.r-text {
								font-family: PingFangSC-Medium,PingFang SC;
								font-weight: 500;
								color: #ea4e3d;
								font-size: 24rpx;
								text:nth-child(1) {
									color: #ea4e3d;
									font-size: 34rpx;
								}
							}
						}
					}
				}
			}
		}
	}
</style>