<template>
	<view class="fx-activity-container">
		<view class="base-banner-wrap">
			<image :src="data.imgUrl" mode="widthFix"></image>
		</view>
		<view class="base-title-wrap">
			<view class="css-hide-2 vm">
				<image class="vm" src="@/static/images/index/home_jd_icon@2x.png"></image>
				<text class="vm">{{ data.title }}</text>
			</view>
		</view>
		<uni-collapse class="base-category-wrap" accordion="true">
			<uni-collapse-item :showAnimation="true">
				<view class="cg-left" slot="cg-left">
					<text class="c-title">活动日期</text>
					<text>{{ data.type }}&nbsp;|&nbsp;{{ data.brand }}</text>
				</view>
				<view class="category-item">
					<view class="cg-left">
						<text class="c-title">活动分类</text>
						<text>{{ data.startTime }} ~ {{ data.endTime }}</text>
					</view>
				</view>
				<view class="category-item">
					<view class="cg-left">
						<text class="c-title">活动介绍</text>
						<text></text>
					</view>
				</view>
				<view class="category-item">
					<view class="cg-left">
						<text class="c-title">活动规则</text>
						<text></text>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>	
		<view class="base-context-wrap" @tap="copyCont">
			<text class="c-title">活动文案</text>
			<view class="c-cont">
				<view class="title">{{ data.description }}</view>
			</view>
		</view>
		<view class="base-footer-wrap">
			<view class="footer-item" @tap="joinNow">
				<image src="@/static/images/activity/share_wx_icon@2x.png"></image>
				<text>立即参加</text>
			</view>
			<template v-if="loginStatus">
				<button class="footer-item" open-type="share">
					<image src="@/static/images/activity/share_zj_icon@2x.png"></image>
					<text>转发朋友</text>
				</button>
			</template>
			<template v-else>
				<button class="footer-item" @tap="shareFriend">
					<image src="@/static/images/activity/share_zj_icon@2x.png"></image>
					<text>转发朋友</text>
				</button>
			</template>
		</view>
	</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	import {loginStatus} from '@/utils/auth.js'
	export default {
		data() {
			return {
				data: {},
				loginStatus: null
			}
		},
		onLoad({data}) {
			let res = JSON.parse(data);
			this.data = res;
		},
		onShareAppMessage(res) {
			let that = this;
			if (res.from === "button") {
				return {
					title: that.data.title,
					imageUrl: that.data.imgUrl  
				}
			}
		},
		onShow() {
			this.loginStatus = loginStatus();
		},
		methods: {
			// 复制活动文案
			copyCont () {
				uni.setClipboardData({
					data: this.data.description,
					success: () => {
						console.log('setClipboardData->success');
					},
					fail: () => {
						console.log('setClipboardData->fail');
					}
				})
			},
			// 立即参加
			joinNow () {
				let ls = loginStatus();
				if (!ls) {
					uni.navigateTo({
						url: '/pages/authLogin/authLogin'
					});
					return false
				};
				wx.navigateToMiniProgram({
					appId: "wx91d27dbf599dff74",
					path: `pages/union/proxy/proxy?spreadUrl=${this.data.activityUrl}&EA_PTAG=17078.27.118`,
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
			},
			// 转发朋友
			shareFriend () {
				let ls = loginStatus();
				if (!ls) {
					uni.navigateTo({
						url: '/pages/authLogin/authLogin'
					});
					return false
				};
			}
			
		},
	    components: {
			uniCollapse,
			uniCollapseItem
		}
	}
</script>

<style lang="scss" scoped>
	.fx-activity-container {
		.base-banner-wrap {
			width: 100%;
			height: auto;
			image {
				width: 100%;
				height: auto;
			}
		}
		.base-title-wrap {
			padding: 15rpx 30rpx;
			background: #FFFFFF;
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
		.base-category-wrap {
			.category-item {
				width: 100%;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				background: #FFFFFF;
				padding:  0 30rpx 15rpx 30rpx;
			}
			.cg-left {
				.c-title {
					height:26rpx;
					font-size:26rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:#999999;
					line-height:26rpx;
					margin-right: 22rpx;
				}
			}
		}
		.base-context-wrap {
			padding: 25rpx 30rpx;
			background: #FFFFFF;
			.c-title {
				height:26rpx;
				font-size:26rpx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:#999999;
				line-height:26rpx;
				
			}
			.c-cont {
				margin-top: 18rpx;
				.title {
					word-wrap: break-word;
					font-size:28rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(51,51,51,1);
					line-height:43rpx;
				}
			}
		}
		.base-footer-wrap {
			width: 100%;
			height:188rpx;
			background:rgba(255,255,255,1);
			box-shadow:0px -1px 0px 0px rgba(229,229,229,1);
			padding: 30rpx 0 25rpx 0;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			position: fixed;
			left: 0;
			bottom: 0;
			.footer-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				&:first-child {
					margin-right: 234rpx;
				}
				image {
					width: 88rpx;
					height: 88rpx;
				}
				text {
					margin-top: 20rpx;
					height:24rpx;
					font-size:24rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(102,102,102,1);
					line-height:24rpx;
				}
			}
		}
	}
</style>