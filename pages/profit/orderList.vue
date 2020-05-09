<template>
    <view class="o-c-list">
        <view v-if="items.goods_id" v-for="items in list" :key="items.goods_id" @click="goTo(items.goods_id)">
            <view class="ls-top">
                <view class="ls-top-img">
                    <image lazy-load :src="items.image || defaultImgUrl"/>
                </view>
                <view class="ls-top-product">
                    <text class="title css-hide-2">{{ items.goods_name }}</text>
                    <button class="btn">
                        <view v-if="orderType == 'paidList'">佣金生成</view>
                        <view v-if="orderType == 'completedList'">待结算</view>
                        <view v-if="orderType == 'settledList'">已结算</view>
                        <view v-if="orderType == 'failureList'">已失效</view>
                    </button>
                </view>
            </view>
            <view class="ls-body">
                <view>
                    <view class="pay-amount">
                        <text>购买数量</text>
                        <text>{{ items.goods_num }}</text>
                    </view>
                    <view class="pay-amount">
                        <text>付款金额</text>
                        <text>{{ Number((items.cos_price ||0) / 100).toFixed(2) }}</text>
                    </view>
                    <view class="pay-income">
                        <text>付款预估收入</text>
                        <text>{{ Number((items.expected_income ||0)/ 100).toFixed(2) }}</text>
                    </view>
                    <view class="pay-royalty">
                        <text>提成</text>
                        <text>{{ items.show_commission }}%</text>
                    </view>
                    <view class="pay-royalty">
                        <text class="text1">技术服务费</text>
                        <text class="text2">{{ (items.service_fee ? Number(items.service_fee / 100) : Number(items.service_fee)).toFixed(2) }}</text>
                    </view>
                </view>
            </view>
            <view class="ls-bottom">
                <view class="pay-time">{{ $dateFn.formatTime(new Date(Number(items.order_time)), '{y}-{m}-{d} {h}:{i}:{s}') }}付款</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: ['list', 'orderType'],
    data () {
      return {
          defaultImgUrl:require("../../static/images/profit/hb_icon.png"),
          dtImgUrl:require("../../static/images/profit/default_bg.png"),
          items:{}
      }
    },
    created() {
      console.log('----2------->>>', this.list)
    },
    mounted() {
      console.log('----------->>>', this.list)
    },
    methods:{
      goTo(id) {
        uni.navigateTo({
          url:`/pages/goodsDetails/goodsDetails?id=${id}`
        })
      }
    }
}
</script>

<style lang="scss">
.o-c-list {
    display: flex;
    flex-direction: column;
    > view {
        padding-top: 20rpx;
        margin-bottom: 30rpx;
        border-radius:20rpx;
        background: #FFFFFF;
        .ls-top {
            display: flex;
            flex-direction: row;
            padding: 0 20rpx;
            .ls-top-img {
                width: 180rpx;
                height: 180rpx;
                image {
                    width: 100%;
                    height: 100%;
                    border-radius: 20rpx;
                }
            }
            .ls-top-product {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                margin-left: 20rpx;
                width: 450rpx;
                .title {
                    line-height:42rpx;
                    font-size:32rpx;
                    font-family:PingFangSC-Regular,PingFang SC;
                    font-weight:400;
                    color:#333333;
                }
                .name {
                    margin: 15rpx 0 20rpx 0;
                    font-size:24rpx;
                    font-family:PingFangSC-Regular,PingFang SC;
                    font-weight:400;
                    color:#999999;
                }
                .btn {
                    height: 55rpx;
                    line-height: 55rpx;
                    align-self: start;
                    width: 200rpx;
                    border-radius:32px;
                    background:linear-gradient(270deg,rgba(234,89,69,1) 0%,rgba(255,144,101,1) 100%);
                    padding: 0 30rpx;
                    font-size: 32rpx;
                    font-family:PingFangSC-Regular,PingFang SC;
                    font-weight:400;
                    color:#FFFFFF;
                    &.invalid {
                        background:linear-gradient(270deg,rgba(184,184,184,1) 0%,rgba(208,208,208,1) 100%);
                        color: #FFFFFF;
                    }
                }
            }
        }
        .ls-body {
            padding: 33rpx 20rpx;
            view {
                display: flex;
                flex-wrap: wrap;
                .pay-amount,
                .pay-income,
                .pay-royalty {
                    width: 33.3%;
                    display: flex;
                    align-items: center;
                    .text1 {
                      color: #999999;
                      font-family:PingFangSC-Regular,PingFang SC;
                      font-size: 26rpx;
                    }
                    .text2  {
                      margin-top: 20rpx;
                      color: #333333;
                      font-size: .4rpx;
                      font-family:DINAlternate-Bold,DINAlternate;
                      font-weight:bold;
                    }
                }
                .pay-royalty {
                    margin-top: 35rpx;
                }
            }
        }
        .ls-bottom {
            padding: 20rpx 20rpx;
            border-top: 1px solid #E5E5E5;
            .pay-time {
                font-size:26rpx;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color: #999999;
            }
        }
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
