<template>
  <view>
    <web-view :src="`${getHost}/h5/20200409jdSell/certifyUser.html?token=${token}`"></web-view>
  </view>
</template>
<script>
  import { getToken } from '../../utils/auth.js';
  export default {
    data(){
      return {
        getHost:'',
        token: ''
      }
    },
	onShareAppMessage () {}, // 不要删除,详见app.vue的overShare方法.
    onLoad() {
    	this.getHost = 'http://shop.tgfwe.com';
		this.token = getToken()
    }
  }
</script>
<style></style>
