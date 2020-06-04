<script>
	import Vue from 'vue';
	import {
		setToken,
		loginStatus
	} from '@/utils/auth.js'
	export default {
		globalData: {
			type: null,
			methodFnStr: null,
			applicationText: '朋友圈99%的人都在用的省钱神器，你不加入吗？'
		},
		onLaunch: function() {
			this.init();
		},
		onShow: function() {},
		onHide: function() {},
		methods: {
			init() {
				// 临时token
				let token =
					'MDAwMDAwMDAwMJrcepbDu7WatZ99sXzMq8rE0s6gw2JonsWIjJuCn3_FmbeJmLCrupTKiomvgqefyq6orJ7GnXlmvImAm4Kff9GZq4LcsdDbp755bZp_lXqTu720nsWca6-wdYCpgHqLyIKnlMuvqMiivrCKo4zNgsuvrKtor5p8a7CFgaiNoJnDmJaGp7O6qpLIipyuhd2b2bC61q2vYGNmxYRom5ekg8yXzGXWxavHmrJ5fqGUqnrWxNK4qauaorCvdIGplX17ko_Qad7Et61nr6Skr3zMq8rFrNqexneNrMaeaHyNeX6YgpZgog';
				setToken(token);
				let that = this;
				uni.checkSession({
					success: (res) => {
						//session_key 未过期，并且在本生命周期一直有效
					},
					fail: (e) => {
						// session_key 已经失效，需要重新执行登录流程
						that.login();
					}
				});
				that.getSystemInfo();
				// #ifdef MP-WEIXIN
				this.overShare()
				// #endif
			},
			login() {
				try {
					uni.login({
						provider: 'weixin',
						success: async (loginRes) => {
							let that = this,
								{
									status,
									data
								} = await that.$Kapi._wechatStart({
									code: loginRes.code
								});
							if (status === that.$resCode.successCode) {
								wx.aldstat.sendOpenid(data.openid)
								setToken(data.token);
								uni.setStorageSync('tempAuth', JSON.stringify(data));
							}
						}
					});
				} catch (e) {
					console.log(e, 'error -> uni.login || _wechatStart');
				}
			},
			// 获取系统信息
			getSystemInfo() {
				let that = this;
				uni.getSystemInfo({
					success: function(e) {
						Vue.prototype.statusBar = e.statusBarHeight;
						// #ifndef MP  
						if (e.platform == 'android') {
							Vue.prototype.customBar = e.statusBarHeight + 50;
						} else {
							Vue.prototype.customBar = e.statusBarHeight + 45;
						}
						// #endif  

						// #ifdef MP-WEIXIN  
						Vue.prototype.statusBar = e.statusBarHeight;
						let custom = wx.getMenuButtonBoundingClientRect();
						Vue.prototype.customBar = custom.bottom + custom.top - e.statusBarHeight;
						// #endif  

						// #ifdef MP-ALIPAY  
						Vue.prototype.statusBar = e.statusBarHeight;
						Vue.prototype.customBar = e.statusBarHeight + e.titleBarHeight;
						// #endif  
					}
				});
			},
			// 重写分享方法
			overShare() {
				/*
					* 全局分享配置，页面无需开启分享
					* 使用隐式页面函数进行页面分享配置
					* 使用隐式路由获取当前页面路由，并根据路由来进行全局分享、自定义分享
				*/
				let _this = this;
				//间接实现全局设置分享内容
				wx.onAppRoute(function(res) {
					//获取加载的页面
					let pages = getCurrentPages(),
						//获取当前页面的对象
						view = pages[pages.length - 1],
						{data, route: routerUrl} = view;
					if (view) {
						let noGlobalSharePages = ['pages/goodsDetails/goodsDetails', 'pages/activity/index/index', 'pages/spinChain/spinChain']; // 因为是indexOf, 不设置全局分享页面路径必须写全, 此处使用includes会出现问题.
						//全局分享配置，如部分页面需要页面默认分享或自定义分享可以单独判断处理
						if (noGlobalSharePages.indexOf(routerUrl) === -1) {
							// 判断如果当前页面已写入分享, 则不再重新写入
							if (!data.isOverShare) {
								data.isOverShare = true;
								view.onShareAppMessage = function() {
									// 重写分享配置
									return {
										title: "朋友圈99%的人都在用的省钱神器，你不加入吗？",
										imageUrl: "http://view.youth.cn/20200428butionMall/imgs/share_thumb.png",
										path: "/pages/index/index"
									};
								}
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import url("./assets/css/common.scss");
</style>
