<template>
	<view class="fx-sc-container">
		<view class="sc-tip-wrap">
			<view class="st-helpImg"></view>
			<view class="st-text">
				<text>通过转换后的链接, 所产生的订单才能计入您的佣金</text>
				<navigator url="/pages/spinChain/spinChainManual/spinChainManual" open-type="navigate" class="czzn">操作指南</navigator>
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
				<text class="not-to">* 当前链接不可直接推广, 请先完成转链</text>
				<text class="clear" @tap="clearLinkCont">清空</text>
			</view>
		</view>
		<view class="sc-footer-wrap">
			<button class="trans">转换为我的链接</button>
			<view class="share">
				<image src="@/static/images/spinChain/tab_home_icon@2x.png"></image>
				<text>分享</text>
			</view>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="sc-firstTip-wrap">
				<text class="sc-first-content">当你看到其他京东客推广的商品比较好，想由自己来推广，复制对方的链接，在【中青看点】内使用链工具转换链接，即可将商品转换为您自己的商品，此时将商品推广给您的朋友，好友下单您即可获得返现</text>
				<view class="sc-first-footer" @tap="closePopup">我知道了</view>
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
					1: '转链成功！\n已复制到剪切板, 快转发赚钱吧。',
					2: '未识别到商品链接，请确认内容。',
					3: '非京东商品链接，请重新选择商品后再来。'
				},
				params: {} // 页面参数
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
		onLoad(params) {
			this.params = params;
			this.init();
		},
		methods: {
			// 初始化
			init () {
				this.callDialog();
				// this.getCacheLastTimeData();
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
				}
			},
			closePopup() {
				this.$refs.popup.close();
			},
			// 获取上一次数据
			// getCacheLastTimeData () {
			// 	let that = this,
			// 		transChainData = JSON.parse(window.localStorage.getItem('transChainData') || '{}');
			// 	if (that.$route.query.home && that.$route.query.home == 1) {
			// 		window.localStorage.removeItem('transChainData');
			// 		return false;
			// 	}
			// 	that.transChainData = transChainData;
			// 	that.linkType = 1;
			// 	that.linkCont = `[京东]${that.transChainData.goods_name}\n----------------------------------\n京东价:¥${that.transChainData.price}\n券后价: ¥${that.transChainData.discountPrice}\n抢购链接: ${that.transChainData.purchaseUrl}`;
			// },
			// 点击商品项跳转至商品详情页
			// jumpGoodsDetail () {
			// 	let that = this,
			// 		goods_id = that.transChainData.goods_id;
			// 	window.localStorage.setItem('transChainData', JSON.stringify(that.transChainData)); // 保存当前商品信息
			// 	history.replaceState(null, null, '/spinChain');
			// 	that.$router.push({
			// 		path: '/goodsDetails',
			// 		query: {
			// 			id:goods_id,
			// 			form: 'spinChain'
			// 		}
			// 	});
			// },
			// 获取用户剪切板的内容
			changeConvertUrl () {
				let that = this;
				if (Object.keys(that.transChainData).length) {
					uni.showToast({
					    title: '已经转链完成，分享给朋友吧!',
					    duration: 2000,
						icon: 'success'
					});
					return;
				}
				if (that.linkCont) {
					if (that.linkCont.includes('jd.com')) {
						that.linkType = 1;
					} else {
						that.linkType = 2;
					}
				} else {
					that.linkType = 0;
				}
				if (that.linkType == 0 || that.linkType == 2 || that.linkType == 3) {
					if (that.userChainType[that.linkType]) {
						uni.showToast({
							title: that.userChainType[that.linkType],
							duration: 2000,
							icon: 'none'
						});	
					}
					return;
				}

				function httpString(s) {
					var reg= /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
					s = s.match(reg);
					return(s)
				}
				let url = httpString(that.linkCont)[0];
				uni.hideLoading();
				uni.showLoading({
					title: '数据加载中...',
					mask: true // 是否显示透明蒙层，防止触摸穿透
				});
				// _getConvertUrls({url: url}).then(res => {
				// 	uni.hideLoading();
				// 	let { status, data } = res;
				// 	if (status === 0) {
				// 		that.linkType = 1;
				// 		that.transChainData = data;
				// 		that.linkCont = `[京东]${that.transChainData.goods_name}\n----------------------------------\n京东价:¥${that.transChainData.price}\n券后价: ¥${that.transChainData.discountPrice}\n抢购链接: ${that.transChainData.purchaseUrl}`;
				// 	}
				// })
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
				box-shadow:0px -1px 0px 0px rgba(229,229,229,1);
				position: relative;
				height: 100rpx;
				width: 180rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				> image {
					width: 44rpx;
					height: 44rpx;
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
	}
</style>