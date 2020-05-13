<script>
	import Vue from 'vue';
	import {setToken} from '@/utils/auth.js'
	export default {
		globalData: {
			type: null,
			methodFnStr: null
		},
		onLaunch: function() {
			this.init();
		},
		onShow: function() {},
		onHide: function() {},
		methods: {
			init () {
				// 临时token
				let token = 'MDAwMDAwMDAwMJrcepbDu7WatZ99sXzMq8rE0s6gw2JonsWIjJuCn3_FmbeJmLCrupTKiomvgqefyq6orJ7GnXlmvImAm4Kff9GZq4LcsdDbp755bZp_lXqTu720nsWca6-wdYCpgHqLyIKnlMuvqMiivrCKo4zNgsuvrKtor5p8a7CFgaiNoJnDmJaGp7O6qpLIipyuhd2b2bC61q2vYGNmxYRom5ekg8yXzGXWxavHmrJ5fqGUqnrWxNK4qauaorCvdIGplX17ko_Qad7Et61nr6Skr3zMq8rFrNqexneNrMaeaHyNeX6YgpZgog';
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
			},
			login () {
				try {
					uni.login({
					  provider: 'weixin',
					  success: async (loginRes) => {
						  let that = this,
							  {status, data} = await that.$Kapi._wechatStart({code: loginRes.code});
							if (status === that.$resCode.successCode) {
								console.log('--------openid ---->>', data.openid)
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
			getSystemInfo () {
				let that = this;
				uni.getSystemInfo({
					success:function(e){
						Vue.prototype.statusBar = e.statusBarHeight;
						// #ifndef MP  
						if(e.platform == 'android') {  
							Vue.prototype.customBar = e.statusBarHeight + 50; 
						}else {  
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
