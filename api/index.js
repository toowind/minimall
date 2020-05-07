import MinRequest from '../utils/request.js'
import {BASE_API} from '../utils/env.js'
import {getToken} from '../utils/auth.js'
const minRequest = new MinRequest();

// 请求拦截器
minRequest.interceptors.request((request) => {
  return request
})

// 响应拦截器
minRequest.interceptors.response((response) => {
  if (response.data.status != '0') {
	  uni.showToast({
		  title: (response.data && response.data.info) || '服务器开小差了...',
		  duration: 2000,
		  icon: 'none'
	  })
  }
  return response.data
})

// 设置默认配置
minRequest.setConfig(async (config) => {
	let token = getToken();		
	config.baseURL = BASE_API;
	config.data.token = token || 'MDAwMDAwMDAwMJrcepbDu7WatZ9kr3-mftjErKhmvJ1sr8WGo518oKTWgranzsWr3JnKfY6tltBkyrHOkq7IgXBz';
	return config;
})

export default {
  // 这里统一管理api请求
  Qapis: {},
  Kapis: {
	_wechatStart: (data) => minRequest.get('/?s=Jd/User/wechatStart', {data: JSON.stringify({...data})}), // 静默登录
	_wechatLogin: (data) => minRequest.get('/?s=Jd/User/wechatLogin', {data: JSON.stringify({...data})}), // 授权登录 - 正式登录
  	_getHomeList: (data) => minRequest.get('/?s=Jd/Product/getHomeList', {data: JSON.stringify({...data})}), // 首页导航数据
	_getGoodsList: (data) => minRequest.post('?s=Jd/Product/getGoodsList', {data: JSON.stringify({...data})}), // 首页商品列表数据
	_getGoodsListByKeyword: (data) => minRequest.post('?s=Jd/Product/getGoodsListByKeyword', {data: JSON.stringify({...data})}), // 搜索接口
	_getProductInfo: (data) => minRequest.post('?s=Jd/Product/getProductInfo', {data: JSON.stringify({...data})}), // 商品详情
	_getProductShareUrl: (data) => minRequest.post('?s=Jd/Product/getProductShareUrl', {data: JSON.stringify({...data})}), // 商品详情分享Url
  }
}