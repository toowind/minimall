<template>
	<view class="fx-idx-container">
		<view class="idx-fixed-wrap" id="idxFixed">
			<view class="idx-bar-wrap">
				<view class="navigation-bar-wrap" :style="{'margin-top': statusBar + 'px', 'height': (customBar-statusBar) + 'px'}">
					<image class="t-text" src="@/static/images/index/logo_icon@2x.png">
				</view>
			</view>
			<view class="idx-top-wrap" :style="{'padding-top': customBar + 'px'}">
				<view class="t-search-wrap">
					<image src="@/static/images/index/search_icon@2x.png" class="t-search-img"></image>
					<input 
						@tap="tapSearchHandler"
						type="text" 
						:disabled="true" 
						placeholder="复制京东商品标题" 
						class="t-search"/>
				</view>
				<image src="@/static/images/index/top_bz_icon@2x.png" class="t-tip"></image>
			</view>
		</view>
		<view class="idx-nav-wrap" :style="{'margin-top': idxNavPt + 'px'}">
			<view class="nav-banner-wrap">
				<view class="nav-bg"></view>
				<swiper 
					class="swiper" 
					:indicator-dots="true" 
					:autoplay="true" 
					:duration="500">
					<swiper-item v-for="(item, key) in activityList" :key="key">
						<navigator class="swiper-nav" hover-class="none" :url="`/pages/activity/index/index?data=${JSON.stringify(item)}`">
							<view class="swiper-item">
								<image :src="item.imgUrl"></image>
							</view>
						</navigator>
					</swiper-item>
				</swiper>
			</view>
			<view class="nav-list">
				<view class="nav-item"
					  @tap="onNavTapHandler(nav)"
					  v-for="(nav, index) in navListArr" 
					  :key="nav.imgUrl">
					<!-- #ifdef MP -->
					<image :src="nav.imgUrl" mode=""></image>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS -->
					<image :src="'../../' + nav.imgUrl" mode=""></image>
					<!-- #endif -->
					<text>{{nav.text }}</text>
				</view>
			</view>
		</view>
		<view class="idx-context-wrap"
			  :style="{'margin-top': menuIsFixed ? 100 + 'rpx' : ''}">
			<scroll-view 
			id="menu_wrap"
			:style="{'padding-top': menuIsFixed ? idxNavPt + 'px' : ''}"
			scroll-x 
			:class="[{'menu-fix-top': menuIsFixed}]"
			scroll-with-animation 
			:scroll-left="scrollLeft">
				<view class="idx-menu-wrap">
					<view
					:class="{'active': TabCur === key}"
					v-for="(item,key) in menuList"
					:key="item.opt_id"
					@tap="tabSelect"
					:data-opt_id="item.opt_id"
					:data-id="key">
						{{item.opt_name}}
					</view>
				</view>
			</scroll-view>
			<image class="idx-home-title" src="@/static/images/index/home_title_icon@2x.png"></image>
			<GoodsList
				:isShare="isShare"
				:loginStatus="loginStatus"
				:goodsList="allGoodsList[TabCur]"
				:scrollTop="scrollTop"
				@tapGoodsItemHandler="tapGoodsItemHandler"/>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="idx-lipboard-wrap">
				<view class="l-title">{{ linkType === 1 ? '识别到以下链接': '是否搜索商品' }}</view>
				<view class="l-cont" v-html="clipboardData"></view>
				<view class="l-handler">
					<view class="ignore" @tap="lipboardHandler(1)">忽略</view>
					<view v-if="linkType === 1" class="spin-chain" @tap.stop="lipboardHandler(2)">立即转链</view>
					<view v-if="linkType === 2" class="spin-chain" @tap.stop="lipboardHandler(3)">立即搜索</view>
				</view>
			</view>
		</uni-popup>
		<backToTop :scrollTop="scrollTop"/>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import GoodsList from '@/components/goodsList/goodsList.vue'
	import {loginStatus} from '@/utils/auth.js'
	export default {
		data() {
			let that = this;
			return {
				customBar: that.customBar,
				statusBar: that.statusBar,
				TabCur: 0,
				scrollLeft: 0,
				menuIsFixed: false, // 菜单是否固定
				menuList: [], // 菜单列表数据
				goodsList: [], // 商品列表数据
				allGoodsList: {},
				listScrollTop:{},
				activityList: [], // 活动列表数据
				goodsNoMore: false, // 是否还有更多数据,若还有更多数据，则传入false, 否则传入true.
				goodsListParams: { // 商品列表参数
					opt_id:"0_22",
					page: 1,
					page_size:10
				},
				navListArr: [
					{
						text: '转换链接', 
						imgUrl: require('@/static/images/index/home_one_icon@2x.png'), 
						jumpUrl: '/pages/spinChain/spinChain' ,
						id: 1,
						isLogin: true
					},
					{ 
						text: '9.9包邮', 
						imgUrl: require('@/static/images/index/home_two_icon@2x.png'), 
						jumpUrl: '/pages/activity/freeShippingProd/freeShippingProd',
						id: 2,
						isLogin: false
					},
					{ 
						text: '每日优选', 
						imgUrl: require('@/static/images/index/home_three_icon@2x.png'), 
						jumpUrl: '/pages/activity/optimizationProd/optimizationProd' ,
						id: 3,
						isLogin: false
					},
					{
						text: '优惠券', 
						imgUrl: require('@/static/images/index/home_four_icon@2x.png'), 
						jumpUrl: '/pages/activity/coupon/coupon',
						id: 4,
						isLogin: false
					}
				],
				clipboardData: null, // 剪切板数据
				linkType: null, // 1. 京东商品 2.其他商品
				scrollTop: 0,
				idxNavPt: 0,
				isShare: 0, // 是否分享
				loginStatus: null, // 登录状态
				isFristScroll: true, // 是否第一次滚动
				isPageScroll: true // 在回滚之前列表的时候，防止最新的值赋值导致回滚定位错误的问题
			}
		},
		onLoad() {
			this.init();
		},
		onReady() {
			this.readyInit();
		},
		async onShow() {
			let that = this;
			await that.$methods.checkIsNetwork();
			that.loginStatus = loginStatus();
			that.isShare = uni.getStorageSync('isShare') ? 1 : 0;
		},
		onPageScroll ({scrollTop}) {
			let that = this;
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
            that.scrollTop = scrollTop;
			if (scrollTop > that.menuScrollTop) {
				that.menuIsFixed = true;
			} else {
				that.menuIsFixed = false;
			}
			if (that.isPageScroll === true) {
				this.listScrollTop[this.TabCur] = scrollTop;
			}
			
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
			that.getGoodsList();
		},
		onShareAppMessage () {}, // 不要删除,详见app.vue的overShare方法.
		methods: {
			async init () {
				let that = this,
					netWorkStatus = await that.$methods.checkIsNetwork();
				if (netWorkStatus) {
					that.getClipboardData();
					that.getHomeList();
					that.getGoodsList();
					that.getActivityList();
				}
			},
			readyInit () {
				let that = this;
				that.$nextTick(() => {
					that.getMenuWrapToTopHeight();	
				})
			},
			// 切换tab
			tabSelect(e) {
				let that = this,
					{id, opt_id} = e.currentTarget.dataset;
				that.goodsNoMore = false;
				that.TabCur = id;
				that.scrollLeft = (id - 1) * 60;
				that.goodsListParams = Object.assign(that.goodsListParams, {
					page: 1,
					opt_id
				});
				if (this.allGoodsList[that.TabCur]) {
					that.isPageScroll = false;
					that.$nextTick(() => {
						uni.pageScrollTo({
							scrollTop: this.listScrollTop[that.TabCur],
							duration: 200,
							success: (e) => {
								that.isPageScroll = true;
							}
						})
					});
				} else {
				  this.getGoodsList();
				}
			},
			// 触碰搜索输入框
			tapSearchHandler () {
				this.$methods.jumpToPage({jumpUrl: '/pages/goodsSearch/goodsSearch'});
			},
			// 点击商品项回调
			tapGoodsItemHandler (goods_id) {
				this.$methods.jumpToPage({jumpUrl: '/pages/goodsDetails/goodsDetails'}, {goods_id});
			},
			// 获取首页菜单列表
			async getHomeList () {
				try {
					let that = this,
						{status, data} = await that.$Kapi._getHomeList();
					if (status === that.$resCode.successCode) {
						that.menuList = data.label;
					}
				} catch (e) {
					console.log(e, 'error -> _getHomeList');
				}
			},
			// 获取首页商品列表
			async getGoodsList () {
				try {
					uni.hideLoading();
					uni.showLoading({
						title: '数据加载中...',
						mask: true // 是否显示透明蒙层，防止触摸穿透
					});
					let that = this;
					let {status, data} = await that.$Kapi._getGoodsList(that.goodsListParams);
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
							item.fxz = (Number(item.return_cash || item.return_cash_total) * Number(item.user_percent || 1)).toFixed(2);
							item.yx = item.orderCount30days >=10000 ? `${(item.orderCount30days/10000).toFixed(2)}万` : item.orderCount30days;
						})
						if (that.goodsListParams.page == 1) {
							that.goodsList = data;
							that.allGoodsList[that.TabCur] = data
							// 第一次进入页面不滚动
							if (that.isFristScroll) {
								that.isFristScroll = false;
							} else {
								that.$nextTick(() => {
									uni.pageScrollTo({
										scrollTop: that.menuScrollTop,
										duration: 500
									});
								});
							}
						} else {
							that.goodsList = [...that.goodsList, ...data];
							that.allGoodsList[that.TabCur].push(...data)
						}
					}
				} catch (e) {
					console.log(e, 'error -> _getGoodsList');
				}
			},
			// 获取首页活动列表
			async getActivityList () {
				try {
					let that = this,
						{status, data} = await that.$Kapi._getActivityList({});
					if (status === that.$resCode.successCode) {
						data.splice(data.findIndex(item => item.title.endsWith("首次购买奖励10元现金")), 1);
						that.activityList = data;
					}
				} catch (e) {
					console.log(e, 'error -> _getActivityList');
				}
			},
			// 获取菜单具体顶部的高度
			getMenuWrapToTopHeight () {
				let that = this,
					query = uni.createSelectorQuery().in(that),
				 	idxFixedWrapHeight = 150; // 顶部固定元素的高度
				query.select('#menu_wrap').boundingClientRect();
				query.select('#idxFixed').boundingClientRect();
				query.exec(res => {
					that.idxNavPt = res[1].height;
					that.menuScrollTop = res[0].top;
				})
			},
			// 获取剪切板数据
			getClipboardData () {
				let that = this;
				uni.getClipboardData({
				    success: function (res) {
						let data = String(res.data).trim(),
							prevClipboardData = null;
						prevClipboardData = uni.getStorageSync('clipboardData') ? uni.getStorageSync('clipboardData') : null;
						if (!prevClipboardData || prevClipboardData != data) {
							if (data) {
								if (data.includes('jd.com')) {
									that.linkType = 1;
								} else {
									that.linkType = 2;
								}
								that.clipboardData = data;
								that.$refs.popup.open();
								uni.setStorageSync('clipboardData', data);
							}
						}
				    }
				});
			},
			// 剪切板内容
			lipboardHandler (status) {
				let that = this;
				function httpString(s) {
					var reg= /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
					s = s.match(reg);
					return(s)
				}
				switch (status) {
					case 2:
						let url = httpString(that.clipboardData)[0];
						this.$methods.jumpToPage({jumpUrl: '/pages/spinChain/spinChain', isLogin: true}, {searchUrl: url});
						break;
					case 3:
						this.$methods.jumpToPage({jumpUrl: '/pages/goodsSearch/goodsSearch'}, {searchCont: encodeURIComponent(that.clipboardData)});
						break;
				}
				that.$refs.popup.close();
			},
			// 导航栏点击跳转页面
			onNavTapHandler (nav) {
				this.$methods.jumpToPage(nav, {
					type: 9, 
					jumpUrl: '/pages/spinChain/spinChain',
					reLaunch: true
				});
			},
		},
		components: {
			GoodsList,
			uniPopup
		}
	}
</script>

<style lang="scss">
.fx-idx-container {
	width: 100%;
	background: $fx-common-back;
	.idx-fixed-wrap {
		background: url('http://view.youth.cn/20200428butionMall/imgs/top_bg.png') no-repeat center;
		background-size: cover;
		z-index: 999;
		width: 100%;
		position: fixed;
		/*--这里没什么好奇的，兼容。 删掉有问题--*/
		top: 0;
		left: 0;
		/*--这里没什么好奇的，兼容。 删掉有问题--*/
		.idx-bar-wrap {
			width: 100%;
			position: absolute;
			display: flex;
			justify-content: center;
			.navigation-bar-wrap {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				z-index: 10;
				.t-text {
					width: 240rpx;
					height: 40rpx;
					position: absolute;
				}	
			}
			
		}
		.idx-top-wrap {
			display: flex;
			flex-direction: column;
			z-index: 1;
			// margin-top: 15rpx;
			.t-bg {
				z-index: -1;
				width: 101%;
				height: 100%;
				position: absolute;
				left: 0px;
				top: 0;
			}
			.t-search-wrap {
				margin-top: 17rpx;
				flex: 1;
				padding: 0 25rpx;
				position: relative;
				width: 100%;
				display: flex;
				align-items: center;
				.t-search-img {
					width: 32rpx;
					height: 32rpx;
					position: absolute;
					left: 50rpx;
					top: 50%;
					margin-top: -18rpx;
				}
				.t-search {
					font-size:28rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color: #666666;
					width: 100%;
					height: 72rpx;
					box-shadow:0px 5px 8px 0px rgba(151,3,3,0.12);
					border-radius:10px;
					background-color: #ffffff;
					padding-left: 70rpx;
				}
			}
			.t-tip {
				padding: 0 25rpx;
				width: 100%;
				margin: 35rpx 0 30rpx 0;
				height: 34rpx;
			}
		}
	}
	.idx-nav-wrap {
		position: relative;
		background-color: #ffffff;
		.nav-banner-wrap {
			border-radius:20px;
			padding: 0 25rpx;
			width: 100%;
			z-index: 9;
			.nav-bg {
				position: absolute;
				width: 100%;
				height: 510rpx;
				left: 0;
				top: -435rpx;
				background: url('http://view.youth.cn/20200428butionMall/imgs/top_bg.png') no-repeat bottom center;
				background-size: contain;
			}
			.swiper {
				height:290rpx;
				border-radius:20px;
				swiper {
					border-radius:20px;
				}
				.swiper-nav {
					height: 100%;	
				}
				.swiper-item {
					height: 100%;
					border-radius:20px;
					swiper-item {
						border-radius:20px;	
					}
					image {
						height: 290rpx;
						max-width: 100%;
						background:#D8D8D8;
						border-radius:20px;
					}
				}
			}
		}
		.nav-list {
			display: flex;
			flex-direction: row;
			padding: 30rpx 0;
		}
		.nav-item {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			flex: 1;
			image {
				display: block;
				width: 88rpx;
				height: 88rpx;
			}
			text {
				margin-top: 13rpx;
				color: #626367;
			}
		}
	}
	.idx-context-wrap {
		margin-top: 20rpx;
		background-color: #ffffff;
		text-align: center;
		.menu-fix-top {
			background-color: #ffffff;
			position: fixed;
			z-index: 99;
			top: 0;
		}
		#menu_wrap {
			border-bottom: 1px solid #E5E5E5;
		}
		.idx-menu-wrap {
			border-radius:20px 20px 0px 0px;
			height: 80rpx;
			padding: 0 17rpx;
			white-space: nowrap;
			background-color: #FFFFFF;
			view {
				line-height: 80rpx;
				height: 80rpx;
				font-size: 30rpx;
				display: inline-block;
				margin-right: 32rpx;
				&.active {
					border-bottom:2px solid #FB4144;
					border-radius: 1px;
					color: #FB4144;
					font-size: 32rpx;
				}
			}
		}
		.idx-home-title {
			margin: 30rpx 0 5rpx 0;
			width: 410rpx;
			height: 40rpx;
		}
	}
	.idx-lipboard-wrap {
		position: relative;
		width: 600rpx;
		background:#FFFFFF;
		border-radius:22rpx;
		padding: 45rpx 60rpx 0;
		.l-title {
			height:46rpx;
			line-height: 46rpx;
			font-size:36rpx;
			font-family:PingFangSC-Medium,PingFang SC;
			font-weight:500;
			color:#333333;
			margin-bottom: 30rpx;
			text-align: center;
		}
		.l-cont {
			word-break: break-word;
			white-space: pre-line;
			padding-bottom: 165rpx;
			font-size:30rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:#666666;
			line-height:48rpx;
		}
		.l-handler {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 105rpx;
			display: flex;
			&:before {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				border-top: 1px solid #CCCCCC;
				transform: scaleY(0.5);
				transform-origin: left top;
			}
			.ignore {
				flex: 1;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size:36rpx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:#666666;
				position: relative;
				&:before {
					content: "";
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					border-right: 1px solid #CCCCCC;
					transform: scaleX(0.5);
					transform-origin: left bottom;

				}
			}
			.spin-chain {
				flex: 1;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size:36rpx;
				font-family:PingFangSC-Medium,PingFang SC;
				font-weight:500;
				color:#FB4144;
			}
		}
	}
	.uni-popup {
		z-index: 1000 !important;
	}
}
</style>
