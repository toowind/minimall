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
  if (response.errMsg || response.data.status != '0') {
	  uni.showToast({
		  title: (response.data && response.data.info) || '服务器开小差了..',
		  duration: 2000,
		  icon: 'none'
	  })
  }
  return response.data
})

// 设置默认配置
minRequest.setConfig(async (config) => {
  let token = await getToken();
  config.baseURL = BASE_API;
  token && token.data ? config.data.token = token.data : '';
  return config
})

export default {
  // 这里统一管理api请求
  Qapis: {
	_getConvertUrls: (data) => minRequest.get('/?s=Jd/Product/getConvertUrls', data)
  },
  Kapis: {
  	_getConvertUrls: (data) => minRequest.get('/?s=Jd/Product/getConvertUrls', data)
  }
}