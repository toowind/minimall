<template>
	<view class="content">
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			this.$Qapi._getConvertUrls({test:1,b:2}).then(res => {
				console.log(res);
			}).catch(err => {
				console.log(err);
			})
		},
		mounted () {
			console.log(this);
		},
		methods: {}
	}
</script>

<style></style>
