<template>
	<view class="fx-noNetWork-container">
		<image src="@/static/images/common/noNetWork@2x.png"></image>
		<text class="noNetWork-text">网络连接失败, 请稍后重试!</text>
		<button type="default" class="refresh" @click="refresh">点击刷新</button>
	</view>
</template>

<script>
	export default {
		methods: {
			refresh () {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fx-noNetWork-container {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background: #FFFFFF;
		border-radius:20px 20px 0px 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 365rpx;
		image {
			width: 336rpx;
			height: 270rpx;
		}
		.noNetWork-text {
			height:32rpx;
			font-size:34rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:#666666;
			line-height:32rpx;
			margin-top: 66rpx;
			margin-bottom: 44rpx;
		}
		.refresh {
			width:226rpx;
			height:80rpx;
			line-height: 80rpx;
			background:linear-gradient(270deg,rgba(234,89,69,1) 0%,rgba(255,144,101,1) 100%);
			border-radius:40px;
			font-size:32rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(255,255,255,1);
		}
	}
</style>