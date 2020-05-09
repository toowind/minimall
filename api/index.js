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
		  title: (response.data && response.data.info) || '信息加载失败，请稍后重试！',
		  duration: 3000,
		  icon: 'none'
	  })
  }
  return response.data
})

// 设置默认配置
minRequest.setConfig(async (config) => {
	let token = getToken();		
	config.baseURL = BASE_API;
	config.data.token = token;
	return config;
})

export default {
  // 这里统一管理api请求
  Qapis: {
    _getUserData: params => minRequest.post("/?s=Jd/User/getUserData",params),
    _getOrderData: params => minRequest.post("/?s=Jd/Order/getOrderData",params),
    _getOrderList: params => minRequest.post("/?s=Jd/Order/getOrderList",params),
    _withdraw: params=> minRequest.post("/?s=Jd/User/withdraw",params)
  },
  Kapis: {
	_wechatStart: (data) => minRequest.get('/?s=Jd/User/wechatStart', {data: JSON.stringify({...data})}), // 静默登录
	_wechatLogin: (data) => minRequest.get('/?s=Jd/User/wechatLogin', {data: JSON.stringify({...data})}), // 授权登录 - 正式登录
  	_getHomeList: (data) => minRequest.get('/?s=Jd/Product/getHomeList', {data: JSON.stringify({...data})}), // 首页导航数据
	_getGoodsList: (data) => minRequest.post('?s=Jd/Product/getGoodsList', {data: JSON.stringify({...data})}), // 首页商品列表数据
	_getActivityList: (data) => minRequest.get('?s=Jd/Product/getActivityList', {data: JSON.stringify({...data})}), // 首页活动列表数据
	_getGoodsListByKeyword: (data) => minRequest.post('?s=Jd/Product/getGoodsListByKeyword', {data: JSON.stringify({...data})}), // 搜索接口
	_getProductInfo: (data) => minRequest.post('?s=Jd/Product/getProductInfo', {data: JSON.stringify({...data})}), // 商品详情
	_getProductShareUrl: (data) => minRequest.post('?s=Jd/Product/getProductShareUrl', {data: JSON.stringify({...data})}), // 商品详情分享Url
	_getConvertUrls: (data) => minRequest.post('/?s=Jd/Product/getConvertUrls', {data: JSON.stringify({...data})}), // 转链
  }
}