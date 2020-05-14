<template>
	<view class="idx-cont-list">
			<view class="cont-item" 
				  v-for="(item, key) in goodsList" 
				  :key="key"
				  @tap="goodsItemHandler(item.goods_id)">
				<view class="c-item-left">
					<template v-if="isRanking">
						<view class="hot one" v-show="key === 0"></view>
						<view class="hot two" v-show="key === 1"></view>
						<view class="hot three" v-show="key === 2"></view>
					</template>
					<easyLoadimage 
						class="img"
						loading-mode="skeleton-1"
						mode="widthFix"
						:open-transition="false"
						:scroll-top="scrollTop"
						:image-src="item.goods_thumbnail_url"></easyLoadimage>
				</view>
				<view class="c-item-right">
					<view class="r-title css-hide-2 vm">
						<image class="vm" src="@/static/images/index/home_jd_icon@2x.png"></image>
						<text class="vm">{{ item.goods_name }}</text>
					</view>
					<view class="r-info">
						<view class="quan"  v-if="item.isCoupon == 1 && item.coupon_discount > 0">
							<image src="@/static/images/index/quan_icon@2x.png" mode=""></image>
							<text>{{item.coupon_discount}}元</text>
						</view>
						<text class="volume">月销{{ item.yx }}</text>
					</view>
					<view class="r-price">
						<view class="post-coupon">
							<text>{{item.priceName}}</text>
							<text>¥</text>
							<text>{{item.present_price}}</text>
						</view>
						<view class="original-price">
							<text>原价¥{{item.min_group_price}}</text>
						</view>
					</view>
					<template v-if="isShare">
						<view class="r-btn">
							<text class="vm">立即购买</text>
						</view>
					</template>
					<template v-else>
						<view class="r-btn">
							<image class="vm" src="@/static/images/index/btn_share_icon@2x.png" mode=""></image>
							<text class="vm">分享赚¥{{ item.fxz }}</text>
						</view>
					</template>
				</view>
			</view>
		</view>
</template>

<script>
import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue'
export default {
	props:{
		// 商品数据
		goodsList: {
			type: Array,
			required: true,
			default: () => []
		},
		// 滚动距离
		scrollTop: {
			type: Number,
			required: true,
			default: 0
		},
		// 登录状态
		loginStatus: {
			type: Boolean,
			required: true,
			default: false
		},
		// 是否分享 0为A 1为A分享给B
		isShare: {
			type: Number,
			required: true,
			default: 0
		},
		// 是否显示排行
		isRanking: {
			type: Boolean,
			required: false,
			default: false
		}
		
	},
	methods: {
		// 商品列表项回调
		goodsItemHandler (goods_id) {
			this.$emit('tapGoodsItemHandler', goods_id);
		}
	},
	components: {
		easyLoadimage
	}
}
</script>

<style lang="scss">
.idx-cont-list {
	min-height: 100px;
	background-color: #FFFFFF;
	.cont-item {
		padding: 25rpx;
		display: flex;
		flex-direction: row;
		&:last-child {
			padding-bottom: 30rpx;
			margin-bottom: 0;
		}
		.c-item-left {
			position: relative;
			display: flex;
			align-items: center;
			.hot {
				&.one {
					background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAABGCAMAAACucKedAAAAaVBMVEVHcEz/0GD/xGb/zl/+nJX//f3/xmX/rnT9jIX/z1//zl//z1//z1//z17/z1//z1//zl/+jYX/zl/5tk39jYX////+79n+ylz9w1f7vFL+uLP9wWj+1NH9nJX/+e/9zXX+p3X/5a39yZSQfX4jAAAAEnRSTlMABSTxfHI2Dktw0LaITGHfn9LHSZNMAAACMElEQVRIx+2X2ZKrIBCGQRyNu1EjMsy45P0f8iRORhpslsrdqZr/zpKvegG6G0KU6CWO44+X4pfU5yUiuJLr8NDX7Uffw67P1+fn8+OaotzPSheIk9cAcIjPXDSEgNczeAkCB/oumP6B/xE4j5uUknMpl22bQ8F5Wzpd2xgA3k1q13L3gKvscHG+ukAbtkuuNnDlnVsrDq6dVxIDZRcgeSpYtOiC1Jhka66YJvHQNJlx57qzmZ77SfRKBluA6kET3VhvSGhoqcC0cWG7VUgmB1j6ON1o/utsBDjR2wQWZeeMQk4ui1wkZrOhpkHo57Zf4BF4a5pUEXLAjTcTBBnK971oEEfFi9PAnmuJrRBH5XzDQKHtZYkYPDgdVCafvuZIhDZQRZkSiqX0Cd7HM6h8rUiC7eF8m5ceAZWvGcgN+D/PskfBw9dWXShtE6feAxY4qI6AHSyt1wIDhdqP8j2L+fuu1u+C6HZYQa4Oa2S9/Bh4LK4JYba0Oo/c414VtiBHxyFnFNZi4QVVVdZKDveBEwwR+GpEeQJVhGxvILWlqp5AVXJaYlQr7gKnUxMArYpbCznkit9m1QSQsO0czbWCvVF4uRLvx3xy96quAT05zTuHUb2vskR7PDBjAjhYYU4BtfHOYcgUxpGJKTPnlYoFjSsl8rYKITPsVRblPoxV+DuQtm4utz0gH+46jLKaOETrxoKVKfGoQsbBPPNi+zmqW2CXFVlEwkWTqs6yukpspv4BPMLkmi8ELNwAAAAASUVORK5CYII=");
				}
				&.two {
					background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAABGCAMAAACucKedAAAAaVBMVEVHcEzZ2dn////Z2dnf0dDZ2dnZ2dnvtqz9jIXZ2dnZ2dn9mI/Z2dn+jYX/xsH9job9jYb/pZ7Y2Ni7u7v////9jYXJycnV1dXCwsLQ0ND+uLPt7e34+Pj+1NH7nZfezMvi4uLou7j5lI30rfN5AAAAEnRSTlMAtXLqJ0XTDUhnkn180nhoiXy4c/FwAAACXElEQVRIx+2X25KbMAyGocawBrK7NeDDQgPs+z9kCSfLtgxu7zrTfyYzIeFDsmRLIkmA3j6q6v3Hpp/VquPyvao+sgTX26Nb9Kvd9OxWfe2XX6+LR4Fy251XIE4+IsDu0+eyLgZ8BD29Abu/Bov/4D8EDn0/j+Mol0/fD7Hg0E/c0jQNMeBCSe5pvgGfIw9onC/A75lfaHyGwKfkl5IzDs78VuM3AkZwXI5+wUp5lIhLlu6ztRBKKaGddcvcdra2/xWqMRLa+jOFHLWxxpGyzNaGKwj4XTeIBCQpukDRoIJG87OkAk41zT3J/EwATuklsjhJCteguVGup7AdJvMo5Zos/biovj00CCRC2yqJ76jhFtLYNM5mVg5Pg7KFmhBnS8vTxjY4TLvhxjf58jX3M7/e3i9fpvUbtsoiKfyQqvYV0pcDegU14isFyUBy74LG1xrEBtkuveNqo0102HkofI5vQcI2e2pOon8q9qxoHCyDoHbTCME8bFG0Z1b+CBQDwkFXA8FRKGeimgbScXAqBJb4Bti5wdsT8EQSpNr0AQ5uOVA4XM6vW6enZDkdzNvlorUlfU9Tq+TIO1DbRSd1TYZAUK3WMsfc6hgCtVU5YLWS8goEbWDvdeymcXjc0bCKPIKEbSfDupzEuwfskWWgH4vrjsNhT4bO+p1V2S3ZmgIy4k4Ah8dKOFMAs4cH6g5HcqG19Eem2h1XqIwaV2r/xYOSCI5hb2VZfjsdUfw9sCivuTT0Arm4e2GUsORKLICSukhuRFM/vjm7xda1shLYJSnLkngVGWWLKA2Z+g24ouS3XorhHQAAAABJRU5ErkJggg==");
				}
				&.three {
					background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAABGCAMAAACucKedAAAAYFBMVEVHcEz9mpD4qY32spT4ro31sI7//f38ooj8j4b2rY71sI71sI71sY/2rY31sI7+joX0sI7fhW3////9jYXyqYnmlXr+ubP61c7rnoHijXT88u/55uHpq5rwxbn9nJX5nIl2OmJAAAAAEHRSTlMAfjuGJtNyDUps6Vilu/jYWZXFoAAAAmhJREFUSMftl9l2pCAQhl3HIGrbLi2gju//lhE1bFUoJ3dzzvxXseNnbRQFUWQoIXH851J8Kr0e0zgmWYQrefW7pu7U3/7Q53r8yIe6QLnzzTuwf2HkKwDsY8hlfQj4guBXENj/Giz+g/8QKOapHYa2bYd2mkQoKKZPa2udA8CPS116ALeh9Wm7A/2YjHfzgVv7oA0HH7ndKAYGcDsJN6y6DVLpkpX7acZGKebkq8ltZ4lD8bfWaLO1tTU25r/GtyMbTTVXlMbv7I2ImWSiwPTO3CluGM3Vlto8cjZJYEY1t8h2EtOCkeWZ2QyJb5yvBu5m9S3umtQRDuod0SmJEWbojFKnVFVv6gzNytvBSuwXdJR1llSco1XLFBpcj/encTwtT9Ck9DUHEV6eyu8I21cdZREVSCnYIiX/mm1QJ5YaxeBI1R1Xta8kogoE2LIKOzmGr5VuqAGAs1sOA6yj+Amcrd7UYOpvpxMUDAPzZ7ATHAX9MfKf5KyoqzfJ2d87SIFmNfGXQy0+DuuYGgtArxyhyu6CZkeWMDtC5eQMEoYo+6ryLXKxrnPnWeSNtRcrXxdPP3JrV85an0mwAzB706mhST5je4422BzbnO4Po7Ou2u+BIrXYq+jsVoPVVLsWjo6BDIyq4e0VgwOryANIg2vUcE3M2cifOHPOVdZURRa7OSDNmWw6u6Pj3VxtrFNAVtqjno0/HoNTAHXuOQ08mkiBXwk45zRBx5UUuVuVARzBbmVZ/ng6ovg9sKjuudp3gdzdvTFakuhO1IOWaRE9iFYwvzl5xI5YaWXYLSuSReEqMkoJoTTxmfoGU+zOZNN4E8UAAAAASUVORK5CYII=");
				}
				z-index: 9;
				background-size: 100% 100%;
				width: 56rpx;
				height: 70rpx;
				position: absolute;
				left: 0;
				top: 0;
				
			}
			.img,
			.easy-loadimage,
			.origin-img,
			.loading-img,
			.loadfail-img {
				border-radius:10px;
				width: 270rpx;
				height: 270rpx;
			}
		}
		.c-item-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 20rpx;
			flex: 1;
			.r-title {
				text-align: left;
				line-height: 44rpx;
				image {
					width: 58rpx;
					height: 28rpx;
					margin-right: 10rpx;
				}
				text {
					color: #333333;
					font-size:32rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
				}
			}
			.r-info {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				.quan {
					display: flex;
					align-items: center;
					justify-content: space-between;
					position: relative;
					height: 34rpx;
					border:1px solid #FB4144;
					border-radius:4px;
					min-width: 115rpx;
					image {
						width: 40rpx;
						height: 34rpx;
					}
					text {
						padding: 0 10rpx;
						text-align: center;
						flex: 1;
						font-size:24rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color: #FF4D52;
					}
				}
				.volume {
					// flex: 1;
					// text-align: right;
					font-size:24rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color: #999999;
				}
			}
			.r-price {
				display: flex;
				justify-content: space-between;
				.post-coupon {
					color: #999999;
					font-family:PingFangSC-Regular,PingFang SC;
					text {
					  font-size:24rpx;
					  font-family:PingFangSC-Regular,PingFang SC;
					  font-weight:400;
					  color:rgba(153,153,153,1);
					  &:nth-of-type(2) {
						font-size:22rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						color:rgba(51,51,51,1);
					  }
					  &:nth-of-type(3) {
						font-size:32rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						color:rgba(51,51,51,1);
					  }
					}
				}
				.original-price {
					text {
						color: #999999;
						font-size:24rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						text-decoration: line-through;
					}
				}
			}
			.r-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				height:56rpx;
				background:linear-gradient(270deg,rgba(255,77,82,1) 0%,rgba(255,119,73,1) 100%);
				border-radius:8px;
				image {
					width: 30rpx;
					height: 30rpx;
				}
				text {
					color: #ffffff;
					margin-left: 15rpx;
					font-size:30rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
				}
			}
		}	
	}
}
</style>