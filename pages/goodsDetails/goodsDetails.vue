<template>
  <view class="fx-gsDetails-container">
    <swiper v-if="return_cash" class="userListSwiperBox userListSwiper" :indicator-dots="false" :autoplay="true" :interval="3000" :duration="500" :vertical="true" circular>
      <swiper-item class="items" v-for="(imgList,index) in userList" :key="index">
        <image class="avatar" lazy-load :src="imgList.avatar" alt="" />
        <view style="display:flex;align-items:center;line-height:64rpx;">
          <text>刚刚 </text>
         <text class="nickname">&nbsp;{{imgList.nickname || '****'}}&nbsp;</text>
         <text>分销该商品</text>
         赚了
         <text style="color:#F2B35F;" :class="[imgList.random]">&nbsp;{{imgList.cash}}元</text>
         </view>
      </swiper-item>
    </swiper>
    <view class="gs-banner-wrap">
      <swiper class="swiper" :indicator-dots="true" :autoplay="true">
        <swiper-item v-for="(banner, key) in productData.goods_gallery_urls.imageList" :key="banner.url">
          <view class="swiper-item">
            <image :lazy-load="true" :src="banner.url"></image>
          </view>
        </swiper-item>
      </swiper>
    </view>
    <view class="gs-base-wrap">
      <view class="base-title css-hide-2 vm">
        <image class="vm" src="@/static/images/index/home_jd_icon@2x.png"></image>
        <text class="vm">{{ productData.goods_name }}</text>
      </view>
      <view class="base-sub-data">
        <view class="sub-data-l">
          <text>原价</text>
          <text>{{ productData.min_group_price }}</text>
        </view>
        <view class="sub-data-r">
          <text class="praise">好评率{{ productData.goodCommentsShare }}</text>
          <text class="sales">月销量{{ productData.orderCount30days }}</text>
        </view>
      </view>
      <view class="base-discount">
        <view class="base-left">
          <view class="quan" v-if="productData.coupon_discount > 0 && productData.isCoupon == 1">
            <image src="@/static/images/index/quan_icon@2x.png"></image>
            <text>{{productData.coupon_discount}}元</text>
          </view>
          <view class="quan" v-if="!isPg && !isCoupon">
            <image src="@/static/images/index/fan_icon.png"></image>
            <text>{{formaters(productData.return_cash)}}元</text>
          </view>
          <view class="base-pc-price">
            <text class="name">{{P_name}}&nbsp;</text>
            <text class="currency">¥&nbsp;</text>
            <text class="price">{{P_price}}</text>
          </view>
        </view>
        <view class="earn">
          <text>分享赚¥{{formaters(productData.return_cash)}}</text>
        </view>
      </view>
      <view class="cupon_normal_wrap" v-if="coupon_discount * 1 != 0">
        <view class="cupon_wrap_left">
          <view class="cupon">
            <text class="span_one">{{formaters(productData.coupon_discount)}}</text>
            <text class="unit">元&nbsp;</text>
            <text class="desc">隐藏优惠券</text>
          </view>
        </view>
        <view class="cupon_wrap_right">
          <text class="participate_in">{{ Number(productData.coupon_discount) == 0 ? "立即抢购" : "立即领券" }}</text>
        </view>
      </view>
    </view>
    <view class="no_cupon" v-if="isCoupon == 0">
      <view class="top" v-if="!(isPg && !isCoupon)">注:购买时按原价支付,购买成功后返回[京东分享赚]查看返利</view>
      <view class="bottom" v-if="!(isPg && !isCoupon)">
        <image class="img" src="@/static/images/index/no_cupon_bg.png" alt="">
          <text class="text">*实际返利金额以最终到账为准,每月随收益发放*</text>
      </view>
    </view>
    <view class="gs-copyOrder-wrap" @tap="copyOrderCont">
      <view class="title">推荐文案, 点击复制</view>
      <view class="name">[京东]{{ productData.goods_name }}</view>
      <view class="line">----------------------------------</view>
      <view class="context">
        <view>{{isCoupon == 1?'🔥爆款冲量🔥':'疯了疯了💢'}}</view>
        <view style="margin:.1rem 0;">{{isPg ==1 && isCoupon ==0?'拼购价':isCoupon == 1?'❗原价':'超低惊喜价'}}:¥{{ isPg ==1 && isCoupon==0?available_price:min_group_price}}</view>
        <view style="margin:.1rem 0;" v-if="isCoupon == 1">{{'💰'+ priceName}}: ¥{{available_price}}</view>
        <view style="margin:.1rem 0;" v-else>实惠到爆炸，不买太遗憾了👇</view>
        <view>{{isCoupon == 1?'下单链接👉': '入口👉'}}: {{productShareUrl.purchaseUrl || ''}}</view>
      </view>
    </view>
    <view class="gs-goodsDetail-wrap" v-if="Object.keys(productData).length && productData.goods_gallery_urls.imageList.length">
      <view class="d-title">商品详情</view>
      <view class="d-cont">
        <view class="d-item" v-for="(image, key) in productData.goods_gallery_urls.imageList" :key="image.url">
          <easy-loadimage mode="widthFix" class="img" loading-mode="skeleton-1" :open-transition="false" :scroll-top="scrollTop"
            :image-src="image.url"></easy-loadimage>
        </view>
      </view>
    </view>
    <view class="gs-bottom-wrap">
      <view class="home-tag" @tap="jumpToPage('../index/index')">
        <image src="@/static/images/goodsDetails/tab_home_icon@2x.png" mode=""></image>
        <text>首页</text>
      </view>
      <view class="handler-btn">
        <navigator class="buy-self" @tap="jumpOtherApp()">
          <text>自己买</text>
          <text>省{{ allCash }}元</text>
        </navigator>
        <navigator class="buy-share" target="miniProgram" app-id="wx91d27dbf599dff74">
          <text>分享让好友购买</text>
          <text>赚{{ return_cash }}元</text>
        </navigator>
      </view>
    </view>
  </view>
</template>

<script>
  import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue'
  export default {
    data() {
      return {
        queryParams: {}, // 页面参数
        productData: {}, // 商品详情数据
        productShareUrl: {}, // 商品分享url 
        scrollTop: 0,
        isPg: 0,
        isCoupon: null,
        coupon_discount: 0,
        P_name: '', // 商品展示名称
        P_price: 0.00, // 商品展示价格
        min_group_price: 0.00, // 商品原价
        available_price: 0.00, // 返回价格
        priceName: '',
        imgList: {},
        userList: [
          {avatar: 'https://res.youth.cn/Public/Spare/avatar_180/touxiang36.jpg/120x120', nickname: '祥海祥海祥海祥海祥海'},
          {avatar: 'http://res.youth.cn/avatar_202004_13_13v_5e94334b027a145918149f.jpg/120x120', nickname: '兔白白'},
          {avatar: 'http://res.youth.cn/avatar_202004_13_13q_5e94333f6307945918148u.jpg/120x120', nickname: '天王盖地虎'},
          {avatar: 'https://res.youth.cn/Public/Spare/avatar_180/touxiang55.jpg/120x120', nickname: '花妮'},
          {avatar: 'http://res.youth.cn/avatar_202004_13_13f_5e9433309451d45918145t.jpg/120x120', nickname: 'JB and NH'},
          {avatar: 'http://res.youth.cn/avatar_202004_13_13v_5e9433350a0ed45918144u.jpg/120x120', nickname: '郭生'},
          {avatar: 'http://res.youth.cn/avatar_202004_13_13o_5e9433394b39345918143v.jpg/120x120 ', nickname: '花朵'},
          {avatar: 'http://res.youth.cn/avatar_202004_13_130_5e94332e2015945918142a.jpg/120x120', nickname: '策离'},
          {avatar: 'https://res.youth.cn/Public/Spare/avatar_180/touxiang26.jpg/120x120 ', nickname: '洛洛憬'},
        ]
      }
    },
    onPageScroll({
      scrollTop
    }) {
      // 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
      this.scrollTop = scrollTop;
    },
    onLoad(e) {
      let that = this;
      that.queryParams = e;
      that.init();
    },
    computed: {
      allCash() {
        let that = this,
          num = Object.keys(this.productData).length && (Number(that.productData.coupon_discount) + Number(that.productData
            .return_cash));
        return num.toFixed(2);
      },
      return_cash() {
        // 返利价
        let that = this;
        return Object.keys(that.productData).length && Number(that.productData.return_cash).toFixed(2);
      }
    },
    methods: {
      init() {
        let that = this;
        that.getProductInfo();
        that.getProductShareUrl();
      },
      // 导航跳转到指定页面
      jumpToPage(url, params) {
        let queryStr = '?';
        if (params && Object.keys(params).length > 0) {
          for (let key in params) {
            queryStr += key + '=' + params[key] + '&';
          }
          if (queryStr.endsWith('&')) {
            queryStr = queryStr.substring(0, queryStr.length - 1);
          }
        }
        uni.switchTab({
          url: url + queryStr
        });
      },
      fix_PN_PR() {
        if (this.isPg == 1 && this.isCoupon == 1) {
          this.P_name = '拼购券后价'
          this.P_price = this.formaters(this.available_price)
        } else if (this.isPg == 1 && this.isCoupon == 0) {
          this.P_name = '拼购价'
          this.P_price = this.formaters(this.available_price)
        } else if (this.isPg == 0 && this.isCoupon == 1) {
          this.P_name = '券后价'
          this.P_price = this.formaters(this.available_price)
        } else if (this.isPg == 0 && this.isCoupon == 0) {
          this.P_name = '返利价'
          this.P_price = this.formaters(this.available_price)
          const n = (Number(this.min_group_price) - this.return_cash).toFixed(2)
          this.P_price = this.formaters(n)
        }
      },

      // 复制订单内容
      copyOrderCont() {
        let that = this,
          data = ''
        if (this.isCoupon) {
          data =
            `[京东]${that.productData.goods_name}\n----------------------------------\n🔥爆款冲量🔥\n❗原价:¥${that.min_group_price}\n💰${that.P_name}: ¥${that.available_price}，快抢快抢\n下单链接👉: ${that.productShareUrl.purchaseUrl}`;
        } else {
          data =
            `[京东]${that.productData.goods_name}\n----------------------------------\n疯了疯了💢\n${that.isPg == 1?'拼购价':'超低惊喜价'}:¥${that.isPg == 1?that.available_price:that.min_group_price}\n实惠到爆炸，不买太遗憾了👇\n入口👉: ${that.productShareUrl.purchaseUrl}`;
        }


        // data = `[京东]${that.productData.goods_name}\n----------------------------------\n京东价:¥${that.productData.min_group_price}\n券后价: ¥${that.productData.discountPrice}\n抢购链接: ${that.productShareUrl.purchaseUrl}`;
        uni.setClipboardData({
          data,
          success: () => {
            uni.showToast({
              title: '专属链接复制成功',
              duration: 3000,
              icon: 'none'
            });
            console.log('setClipboardData->success');
          },
          fail: () => {
            console.log('setClipboardData->fail');
          }
        })
      },
      // 获取商品详情数据
      async getProductInfo() {
        try {
          let that = this,
            queryParams = that.queryParams,
            {
              status,
              data
            } = await that.$Kapi._getProductInfo(queryParams);
          if (status === that.$resCode.successCode) {
            that.productData = data;
            that.productData.return_cash = (Number(data.return_cash) * Number(data.user_percent || 0.5)).toFixed(2);
            this.isPg = data.isPg // 是否拼购
            this.isCoupon = data.isCoupon // 是否有优惠券
            this.coupon_discount = data.coupon_discount // 优惠券金额
            this.min_group_price = data.min_group_price
            this.available_price = Number(data.discountPrice)
            this.priceName = data.priceName
            this.fix_PN_PR()
            this.getUserInfo(this.return_cash)
          }
        } catch (e) {
          console.log(e, 'error -> _getProductInfo');
        }
      },
      async getProductShareUrl() {
        try {
          let that = this,
            queryParams = that.queryParams,
            {
              status,
              data
            } = await that.$Kapi._getProductShareUrl(queryParams);
          if (status === that.$resCode.successCode) {
            that.productShareUrl = data;
            console.log(data);
          }
        } catch (e) {
          console.log(e, 'error -> _getProductShareUrl');
        }
      },
      // 获取滚动用户信息
      async getUserInfo(e) {
        let {
          status,
          data
        } = await this.$Kapi._getUserInfo()
        if (status == 0) {
          data.map(item => {
            const random = parseInt((Math.random()*10)) + 1
            item.cash = (e *random).toFixed(2)
          })
          this.userList = data
        } else {
          this.userList.map(item => {
            const random = parseInt((Math.random()*10)) + 1
            item.cash = (e *random).toFixed(2)
          })
        }
      },
      // 跳转其他app
      jumpOtherApp() {
        wx.navigateToMiniProgram({
          appId: "wx91d27dbf599dff74",
          path: `pages/union/proxy/proxy?spreadUrl=${this.productShareUrl.purchaseUrl}&EA_PTAG=17078.27.118`,
          extraData: {
            open: "auth"
          },
          success(res) {
            console.log(res);
          },
          fail(e) {
            console.log(e)
          }
        });
      },
      // 格式化金额
      formaters(value) {
        if (!value || Number(value) == 0) return ''
        value = value.toString()
        let end = ''
        if (value.indexOf('.') > -1) {
          let s = value.split('.')[0]
          let s1 = value.split('.')[1] && value.split('.')[1].toString()
          // 01
          if (s1[0] == 0 && s1[1] == 0) {
            end = s
          } else if (s1[0] == 0 && s1[1] != 0) {
            end = s + '.' + s1
          } else if (s1[0] != 0 && s1[1] == 0) {
            end = s + '.' + s1[0]
          } else if (s1[0] != 0 && s1[1] != 0) {
            end = s + '.' + s1
          }
        } else {
          end = value
        }
        return end
      },
    },
    components: {
      easyLoadimage
    }
  }
</script>

<style lang="scss">
  .fx-gsDetails-container {
    .userListSwiperBox {
      width: 634rpx;
      height: 64rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 30rpx;
      top: 30rpx;
      z-index: 8;
    }

    .userListSwiper {
      height: 60rpx;
      background: rgba(0, 0, 0, 0.6);
      font-size: 30rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      border-radius: 35rpx;
      padding: 0 27rpx 0 10rpx;

      .items {
        width: 100%;
        height: 60rpx;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        color: #fff;

        .avatar {
          width: 42rpx;
          height: 42rpx;
          margin-right: 10rpx;
          border-radius: 100px;
        }

        .nickname {
          display: inline-block;
          max-width: 130rpx;
          color: #F2B35F;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
    }

    .gs-banner-wrap {
      width: 100%;
      height: 750rpx;

      .swiper {
        height: 100%;

        .swiper-item {
          height: 100%;
        }
      }
    }

    .gs-base-wrap {
      overflow: hidden;
      background-color: #FFFFFF;
      padding: 20rpx 30rpx 0 30rpx;

      .base-title {
        text-align: left;
        line-height: 44rpx;

        image {
          width: 58rpx;
          height: 28rpx;
          margin-right: 10rpx;
        }

        text {
          color: #333333;
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
        }
      }

      .base-sub-data {
        padding: 20rpx 0 30rpx 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .sub-data-l {
          text {
            font-size: 26rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #969696;
          }

          text:nth-child(2) {
            text-decoration: line-through;
          }
        }

        .sub-data-r {
          .praise {
            font-size: 26rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #969696
          }

          .sales {
            margin-left: 20rpx;
            font-size: 26rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #969696
          }
        }
      }

      .base-discount {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 24rpx;

        .base-left {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: baseline;

          .quan {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            height: 34rpx;
            border: 1px solid #FB4144;
            border-radius: 4px;
            min-width: 115rpx;
            margin-right: 20rpx;

            image {
              width: 40rpx;
              height: 34rpx;
            }

            text {
              padding: 0 10rpx;
              text-align: center;
              flex: 1;
              font-size: 24rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #FF4D52;
            }
          }

          .base-pc-price {
            .name {
              text-align: left;
              width: 100%;
              font-size: 28rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #FF4D52;
            }

            .currency {
              font-size: 22rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #FF4D52;
            }

            .price {
              font-size: 34rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #FF4D52;
            }

          }
        }

        .earn {
          padding: 15rpx 23rpx;
          background: -webkit-gradient(linear, right top, left top, from(#ff4d52), to(#ff7749));
          background: linear-gradient(270deg, #ff4d52, #ff7749);
          border-radius: 32rpx 0 0 32rpx;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: baseline;
          -ms-flex-align: baseline;
          align-items: baseline;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          font-size: 30rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #fff;
          line-height: 26rpx;
        }
      }

      .cupon_normal_wrap {
        margin: 30rpx 0;
        background: url("../../static/images/goodsDetails/xq_quan_bg@2x.png") no-repeat;
        background-size: 100% 100%;
        width: 100%;
        height: 85rpx;
        display: flex;
        align-items: center;
        justify-content: baseline;
        color: #ff4e52;

        .cupon_wrap_left {
          height: 100%;
          display: flex;
          align-items: center;
          padding-left: 28rpx;
          flex: 1;

          .cupon {
            font-size: 22rpx;
            font-weight: 700;
            letter-spacing: 1rpx;

            .span_one {
              font-size: 44rpx;
              letter-spacing: 1rpx;
            }

            .unit {
              font-size: 28rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #ff4e52;
              letter-spacing: 1rpx;
              padding: 0 10rpx 0 5rpx;
            }

            .desc {
              font-size: 24rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ff4e52;
            }
          }
        }

        .cupon_wrap_right {
          width: 200rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .participate_in {
            text-align: center;
            width: 167rpx;
            font-size: 32rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ff4e52;
          }
        }
      }
    }

    .no_cupon {
      width: 100%;

      .top {
        width: 100%;
        height: 48rpx;
        background: rgba(255, 233, 235, 1);
        text-align: center;
        line-height: 48rpx;
        color: #FF4E52;
      }

      .bottom {
        width: 100%;
        background: #FFF9E9;
        padding: 30rpx 30rpx 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .img {
          width: 690rpx;
          height: 100rpx;
          margin-bottom: 30rpx;
        }

        .text {
          font-size: 22rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(172, 151, 94, 1);
        }
      }
    }

    .gs-copyOrder-wrap {
      margin-top: 15rpx;
      padding: 30rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      background: #ffffff;

      .title {
        font-size: 30rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: rgba(102, 102, 102, 1);
        line-height: 42rpx;
      }

      .name {
        width: 690rpx;
        margin-top: 10rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 48rpx;
      }

      .line {
        width: 100%;
        margin-top: 10rpx;
        margin-bottom: 23rpx;
        text-align: left;
        color: #979797;
      }

      .context {
        width: 100%;
        text-align: left;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 38rpx;
      }
    }

    .gs-goodsDetail-wrap {
      background-color: #ffffff;
      margin-top: 16rpx;
      padding: 15rpx 30rpx 100rpx;

      .d-title {
        padding-bottom: 16rpx;
        height: 88rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #666;
        line-height: 42rpx;
      }

      .d-cont {
        padding-top: 24rpx;

        .d-item {
          &:last-child {
            margin-bottom: 0;
          }

          margin-bottom: 10rpx;
          width: 100%;

          image {
            width: 100%;
          }
        }
      }
    }

    .gs-bottom-wrap {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100rpx;
      background-color: #fff;
      position: fixed;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 1998;

      .home-tag {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        width: 110rpx;
        height: 100%;
        padding: 10rpx 0 7rpx 0;

        image {
          width: 44rpx;
          height: 44rpx;
          margin-bottom: 12rpx;
        }

        text {
          height: 24rpx;
          font-size: 24rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 24rpx;
        }
      }

      .handler-btn {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: row;
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;

        .buy-self {
          background: #f2b35f;
          width: 50%;
          height: 100%;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;

          text {
            font-size: 32rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 32rpx;

            &:last-child {
              font-weight: 500;
              margin-top: 10rpx;
            }
          }
        }

        .buy-share {
          background: #ea4e3d;
          width: 50%;
          height: 100%;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;

          text {
            font-size: 32rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 32rpx;

            &:last-child {
              font-weight: 500;
              margin-top: 10rpx;
            }
          }
        }
      }
    }
  }
</style>
