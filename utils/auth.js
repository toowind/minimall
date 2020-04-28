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

export function getToken() {
	return new Promise((resolve, reject) => {
		uni.getStorage({
			key: TokenKey,
			success: function (res) {
				resolve(res);
			},
			fail:function(err){
				reject(false)
			}
		});
	});
}

export function setToken(token) {
	return new Promise((resolve, reject) => {
		uni.setStorage({
			key: TokenKey,
			data: JSON.stringify(token),
			success: function (res) {
				resolve(res);
			},
			fail:function(err){
				reject(false)
			}
		});
	});
}

export function removeToken() {
    return new Promise((resolve, reject) => {
    	uni.getStorage({
    		key: TokenKey,
    		success: function (res) {
    			resolve(res);
    		},
    		fail:function(err){
    			reject(false);
    		}
    	});
    });
}

export function getUserInfo() {}

export function setUserInfo(userInfo) {}

export function removeUserInfo() {}