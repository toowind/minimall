<template>
	<view :class="['fx-backToTop-container', {'fadeIn': isShow}, {'fadeOut': !isShow && !isFristEntry}]">
		<image @tap="backTop" src="../../../static/images/common/top_icon@2x.png"></image>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				clientHeight: 0,
				isShow: false,
				isFristEntry: true
			}
		},
		props: {
			scrollTop: {
				type: Number,
				required: true,
				default: 0
			}
		},
		created() {
			let that = this;
			uni.getSystemInfo({
				success:function({ windowHeight }){
					that.clientHeight = windowHeight;
				}  
			});	
		},
		methods: {
			backTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 500
				})
			}
		},
		watch: {
			scrollTop (newV) {
				let that =  this;
				if (newV >= that.clientHeight) {
					that.isShow = true;
					that.isFristEntry = false;
				} else {
					that.isShow = false;
				}
			}
		}
	}
</script>

<style>
	@keyframes fadeIn{
	    0%{
			opacity: 0;
			z-index: 1;
		}
	    100%{
			opacity: 1;
			z-index: 1;
		}
	}
	@keyframes fadeOut{
	    0%{
			opacity: 1;
			z-index: 1;
		}
	    100%{
			opacity: 0;
			z-index: -1;
		}
	}
	.fx-backToTop-container {
		position: fixed;
		right: 22rpx;
		bottom: 100rpx;
		opacity: 0;
	}
	.fx-backToTop-container.fadeIn {
		animation: fadeIn 1s ease;
		animation-fill-mode: forwards;
	}
	.fx-backToTop-container.fadeOut {
		animation: fadeOut 1s ease;
		animation-fill-mode: forwards;
	}
	image {
		width: 122rpx;
		height: 122rpx;
	}
	
	
</style>