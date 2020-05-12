/**
 * 配置编译环境和线上环境之间的切换
 *
 * getToken: 获取token
 * 
 * setToken: 设置token
 * 
 * removeToken: 删除token
 * 
 * getUserInfo: 获取用户信息
 *
 * setUserInfo: 设置用户信息
 * 
 * removeUserInfo 删除用户信息
 * 
 */
const TokenKey = 'token';
const tempAuth = 'tempAuth';
const userInfo = 'userInfo';

export function getToken() {
	return uni.getStorageSync(TokenKey);
}

export function setToken(token) {
	return uni.setStorageSync(TokenKey, token);
}

export function removeToken() {
	return uni.removeStorageSync(TokenKey);
}

export function loginStatus() {
	return uni.getStorageSync(userInfo) ? true: false;
}

export function setUserInfo(data) {
	return uni.setStorageSync(userInfo, data);
}

export function getUserinfo() {
	return uni.getStorageSync(userInfo);
}