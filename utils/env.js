/**
 * 配置编译环境和线上环境之间的切换
 *
 * BASE_API: 域名地址
 *
 */

let BASE_API = '';

if (process.env.NODE_ENV == 'development') {
    // 编译环境
    BASE_API = 'http://kd-api-shop.baertt.com';
}else if(process.env.NODE_ENV == 'production'){
    // 线上环境
    BASE_API = '/production';
}

export {
    BASE_API
}
