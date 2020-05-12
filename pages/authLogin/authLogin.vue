<template>
	<view class="fx-auth-container">
		<image src="@/static/images/common/logo@2x.png" class="auth-logo"></image>
		<text class="text-1">该程序将获取以下授权</text>
		<text class="text-2">获取您的公开信息(昵称、头像等)</text>
		<button class="auth" open-type="getUserInfo" @getuserinfo="auth">授权</button>
		<button class="cancel" @tap="cancel">取消</button>
	</view>
</template>

<script>
	import { setToken, setUserInfo } from '@/utils/auth.js'
	export default {
		data () {
			return {
				paramsInfo: {}
			}
		},
		async onLoad(params) {
			let that = this;
			that.paramsInfo = params;
			try {
				let tempAuthData = uni.getStorageSync('tempAuth');
				if (!tempAuthData) {
					uni.login({
					  provider: 'weixin',
					  success: async (loginRes) => {
						uni.hideLoading();
						uni.showLoading({
							title: '获取登录信息...',
							mask: true // 是否显示透明蒙层，防止触摸穿透
						});
						let {status, data} = await that.$Kapi._wechatStart({code: loginRes.code});
						uni.hideLoading();	
						if (status === that.$resCode.successCode) {
							setToken(data.token);
							uni.setStorageSync('tempAuth', JSON.stringify(data));
						}
					  }
					});
				}
			} catch (e) {
				console.log(e, 'error -> uni.login || _wechatStart');
			}
		},
		methods: {
			async auth ({detail}) {
				let that = this;
				if(detail.errMsg === "getUserInfo:ok") {
					let params = {
						iv: detail.iv,
						encryptedData: detail.encryptedData,
						session_key: uni.getStorageSync('tempAuth') && JSON.parse(uni.getStorageSync('tempAuth'))['session_key'],
						parent_uid: uni.getStorageSync('parent_uid') ? uni.getStorageSync('parent_uid') : ''
					};
					let {status, data} = await that.$Kapi._wechatLogin(params);
					if (status === that.$resCode.successCode) {
						setToken(data.token);
						setUserInfo(data);
						uni.removeStorageSync('tempAuth'); // 删除临时用户信息
						uni.removeStorageSync('parent_uid'); // 删除父uid
						uni.removeStorageSync('isShare'); // 删除isShare
						uni.hideToast();
						uni.showToast({
							title: '授权成功',
							duration: 2000,
							icon: 'success'
						});
						setTimeout(_ => {
							// type->9为页面跳转 type->8为页面方法调用
							if (that.paramsInfo.type == 9) {
								that.$methods.jumpToPage({
									jumpUrl: that.paramsInfo.jumpUrl,
									reLaunch: that.paramsInfo.reLaunch
								});
							} else if (that.paramsInfo.type == 8){
								uni.navigateBack();
							} else {
								uni.navigateBack();
							}
						}, 2000);
					}
				} else if (detail.errMsg === "getUserInfo:fail auth deny") {
					uni.hideToast();
					uni.showToast({
						title: '为了更好的服务，请同意授权',
						duration: 2000,
						icon: 'none'
					});
				} else {
					uni.hideToast();
					uni.showToast({
						title: '授权失败',
						duration: 2000,
						icon: 'none'
					});
				}
			},
			cancel () {
				let pages = getCurrentPages();
				if (pages[0].route.indexOf('pages/profit/index') >= 0) {
					uni.switchTab({
						url: '/pages/index/index'
					});
					return;
				}
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	page, .fx-auth-container{
		background-color: #FFFFFF;
		height: 100%;
	}
	.fx-auth-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		padding: 85rpx;
		.auth-logo {
			width: 198rpx;
			height: 198rpx;
			margin-bottom: 85rpx;
		}
		.text-1 {
			font-size:36rpx;
			font-family:PingFangSC-Medium,PingFang SC;
			font-weight:500;
			color:#333333;
		}
		.text-2 {
			font-size:30rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:#999999;
			margin: 30rpx 0 115rpx 0;
		}
		.auth {
			width: 100%;
			height:90rpx;
			line-height: 90rpx;
			background:linear-gradient(230deg,rgba(250,58,63,1) 0%,rgba(255,118,66,1) 100%);
			border-radius:44px;
			font-size:34rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:#FFFFFF;
		}
		.cancel {
			width: 100%;
			height:90rpx;
			line-height: 90rpx;
			background:#FFFFFF;
			border-radius:44px;
			font-size:30rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:#999999;
		}
	}
</style>