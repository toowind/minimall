<template>
	<view class="fx-idx-container">
		<view class="idx-bar-wrap" :style="{'height': customBar + 'px'}">
			<image class="t-bg" src="@/static/images/index/top_bg@2x.png"></image>
			<view class="navigation-bar-wrap" :style="{'margin-top': statusBar + 'px', 'height': customBar-statusBar + 'px'}">
				<image class="t-text" src="@/static/images/index/logo_icon@2x.png">
			</view>
		</view>
		<!-- <view class="idx-top-wrap">
			<input type="text" placeholder="复制京东商品标题" />
			<image src="@/static/images/index/top_bz_icon@2x.png"></image>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customBar: this.customBar,
				statusBar: this.statusBar,
				title: 'Hello'
			}
		},
		onLoad() {
			// this.$Qapi._getConvertUrls({test:1,b:2}).then(res => {
			// 	console.log(res);
			// }).catch(err => {
			// 	console.log(err);
			// })
		},
		mounted () {},
		methods: {}
	}
</script>

<style lang="scss">
.fx-idx-container {
	width: 100%;
	height: 100%;
	background: $fx-common-back;
	.idx-bar-wrap {
		width: 100%;
		position: absolute;
		display: flex;
		justify-content: center;
		.t-bg {
			width: 101%;
			height: 380rpx;
			position: absolute;
			left: -3px;
			top: -3px;
		}
		.navigation-bar-wrap {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			.t-text {
				width: 240rpx;
				height: 40rpx;
				position: absolute;
			}	
		}
		
	}
	.idx-top-wrap {
		padding: 0 25rpx;
	}
}
</style>
