/**
 * 配置编译环境和线上环境之间的切换
 *
 * BASE_API: 域名地址
 *
 */

let BASE_API = '';

if (process.env.NODE_ENV == 'development') {
    // 编译环境
    BASE_API = 'https://shop-t.baertt.com'; // 测试
  }else if(process.env.NODE_ENV == 'production'){
	// 线上环境
	// BASE_API = 'https://kd-api-shop.baertt.com'; // 线上
    BASE_API = 'https://shop-t.baertt.com/'; // 测试 体验版使用
}

export {
    BASE_API
}
