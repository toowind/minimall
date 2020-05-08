<template>
  <view class="income">
    <view ref="warp">
      <view class="title">
        <view class="left">
          <view class="text">
            可提现金额
            <image src="./../../static/images/profit/sy_help_icon.png" alt="" @tap="$refs.isShowPopup3.open()" />
          </view>
          <view class="money">
            {{ t_money == 0 ? Number(t_money).toFixed(2) : Number(t_money/100).toFixed(2) }}
            <text class="unit">元</text>
          </view>
        </view>
        <view class="withDraw" @click="withdrawalThrottle">
          提现
          <image class="img" src="./../../static/images/profit/next_icon.png" alt="" />
        </view>
      </view>
      <view class="count">
        <view class="thisMouth line_right">
          <view class="text">上月预估收入(元)</view>
          <view class="money">{{ Number(last_month_total_income / 100).toFixed(2) }}</view>
        </view>
        <view class="nextMouth">
          <view class="text">本月预估收入(元)</view>
          <view class="money">{{ Number(month_total_income / 100).toFixed(2) }}</view>
        </view>
      </view>
      <view class="notes">
        每月25日结号结算上个月预估收入
        <view class="img" @tap.stop="isShowPopup3 = true"></view>
      </view>
      <view class="tabs">
        <view :class="tabsActive == 1 ? 'active' : ''" style="border-radius: 31upx 0 0 31upx;" @tap="tabsChange(1)">
          今日
        </view>
        <view :class="tabsActive == 2 ? 'active' : ''" @tap="tabsChange(2)">
          昨日
        </view>
        <view :class="tabsActive == 3 ? 'active' : ''" @tap="tabsChange(3)">
          近7日
        </view>
        <view :class="tabsActive == 4 ? 'active' : ''" style="border-right:none;border-radius: 0 31upx 31upx 0;" @tap="tabsChange(4)">
          近30日
        </view>
      </view>
      <view class="tabs_notes">
        <text>预估收入(元)：</text>
        <text class="money">{{ Number(orderData.total_income / 100).toFixed(2) }}</text>
      </view>
      <view class="cash_notes">
        注:订单数据同步会有1~10分钟的延迟, 请耐心等待哈~
      </view>
  </view>
  <view :style="{'padding-bottom': '50upx'}">
    <view class="tabs_list">
      <view class="list_title line_bottom">
        <view class="left">
          分享分销数据
          <text class="tags">订单统计以完成支付为准</text>
        </view>
        <view class="right" @click="goOrderPage(2)">
          全部订单明细
          <image class="arrow" src="./../../static/images/profit/sy_next_icon.png" alt="" />
        </view>
      </view>
      <view class="one">
        <view class="left">
          <view class="one_name">
            订单量
            <image src="./../../static/images/profit/sy_help2_icon.png" alt="" @click="tips(1)" />
          </view>
          <view class="one_num">{{ orderData.share.total_order }}</view>
        </view>
        <view class="right">
          <view class="one_name">
            有效订单
            <image src="./../../static/images/profit/sy_help2_icon.png" alt="" @click="tips(2)" />
          </view>
          <view class="one_num">{{ orderData.share.live_order }}</view>
        </view>
      </view>
      <view class="two" style="padding-top:0;">
        <view class="left">
          <view class="one_name">
            订单金额
          </view>
          <view class="one_num">{{ Number(orderData.share.price/100).toFixed(2) }}</view>
        </view>
        <view class="right">
          <view class="one_name">
            推广收益
          </view>
          <view class="one_num">{{ Number(orderData.share.income/100).toFixed(2) }}</view>
        </view>
      </view>
    </view>

    <view class="tabs_list">
      <view class="list_title line_bottom">
        <view class="left">
          领券自购返利
          <text class="tags">订单统计以完成支付为准</text>
        </view>
        <view class="right" @click="goOrderPage(1)">
          全部订单明细
          <image class="arrow" src="./../../static/images/profit/sy_next_icon.png" alt="" />
        </view>
      </view>
      <view class="one">
        <view class="left">
          <view class="one_name">
            订单量
            <image src="./../../static/images/profit/sy_help2_icon.png" alt="" @click="tips(1)" />
          </view>
          <view class="one_num">{{ orderData.self.total_order }}</view>
        </view>
        <view class="right">
          <view class="one_name">
            有效订单
            <image src="./../../static/images/profit/sy_help2_icon.png" alt="" @click="tips(2)" />
          </view>
          <view class="one_num">{{ orderData.self.live_order }}</view>
        </view>
      </view>
      <view class="two" style="padding-top:0;">
        <view class="left">
          <view class="one_name">
            订单金额
          </view>
          <view class="one_num">{{ Number(orderData.self.price / 100).toFixed(2) }}</view>
        </view>
        <view class="right">
          <view class="one_name">
            推广收益
          </view>
          <view class="one_num">{{ Number(orderData.self.income / 100).toFixed(2) }}</view>
        </view>
      </view>
    </view>
  </view>

  <!-- <uni-popup ref="showAuth" class="auth-container transfer-container">
   <view class="warp_box">
      <text class="auth-title tf-title">为保障账户安全, 请完成实名认证</text>
      <view style="display: flex;width: 100%;">
        <text class="confirmBtn" style="flex: 1;" @tap.stop="$refs.showAuth.close()">取消</text>
        <text class="confirmBtn" style="flex: 1;" @tap.stop="authFn">去认证</text>
      </view>
    </view>
  </uni-popup> -->
  <uni-popup ref="showAuth" type="dialog">
    <uni-popup-dialog content="为保障账户安全, 请完成实名认证" :before-close="true" @confirm="authFn"
     @close="$refs.showAuth.close()" confirm-text="去认证" confirm-color="#EA4E3D"></uni-popup-dialog>
  </uni-popup>


  <uni-popup ref="showTransfer" :maskClick="false" class="transfer-container">
    <view class="warp_box">
      <image @click="$refs.showTransfer.close()" class="close" src="./../../static/images/profit/close_icon.png" alt="">
      <text class="tf-title">划转成功</text>
      <view class="tf-context">请在<text>我的钱包</text>中查看余额入账情况, 并提现</view>
      <text class="confirmBtn" @tap.stop="$refs.showTransfer.close()">查看</text>
    </view>
  </uni-popup>

  <uni-popup ref="isShowPopup1" :maskClick="false" class="transfer-container">
    <view class="warp_box">
      <image @click="$refs.isShowPopup1.close()" class="close" src="./../../static/images/profit/close_icon.png" alt="">
      <text class="tf-title">订单量</text>
      <text class="tf-context">所选时间段内好友支付成功的订单</text>
      <text class="confirmBtn" @tap.stop="$refs.isShowPopup1.close()">我知道了</text>
    </view>
  </uni-popup>


  <uni-popup ref="isShowPopup2" :maskClick="false" class="transfer-container">
    <view class="warp_box">
      <image @click="$refs.isShowPopup2.close()" class="close" src="./../../static/images/profit/close_icon.png" alt="">
      <text class="tf-title">有效订单</text>
      <text class="tf-context">所选时间段内好友支付成功且未取消/未退货的订单</text>
      <text class="confirmBtn" @tap.stop="$refs.isShowPopup2.close()">我知道了</text>
    </view>
  </uni-popup>


  <uni-popup ref="isShowPopup3" type="dialog" class="transfer-container">
    <view class="warp_box">
      <image @tap="$refs.isShowPopup3.close()" class="close" src="./../../static/images/profit/close_icon.png" alt="">
      <text class="tf-title">结算说明</text>
      <view class="tf-context" style="color: #666666;font-size: 28upx;text-align: left;">每月25号结算上个月1-30号好友确认收货的订单，结算完成后“可提现金额”才会同步更新金额。因结算订单量大，结算时间会较长，结算会在25号晚上完成，建议您26号进行提现。</view>
      <view class="tf-context" style="color: #666666;font-size: 28upx;text-align: left;">举例：1月份确认收货的订单，2月25号才会进行结算，以此类推。</view>
      <text class="confirmBtn" @tap.stop="$refs.isShowPopup3.close()">我知道了</text>
    </view>
  </uni-popup>
  </view>
</template>
<script>
  import { getToken } from '../../utils/auth.js'
  import uniPopup from '@/components/uni-popup/uni-popup.vue'
  import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
  // import {_getUserData, _getOrderData, _withdraw} from '@/api/module/user.js'
  /**
   * @desc 函数节流
   * @param func 函数
   * @param wait 延迟执行毫秒数
   * @param type 1 表时间戳版，2 表定时器版
   */
  function throttle(func, wait, type) {
    if (type === 1) {
      var previous = 0;
    } else if (type === 2) {
      var timeout;
    }

    return function() {
      var context = this;
      var args = arguments;
      if (type === 1) {
        var now = Date.now();

        if (now - previous > wait) {
          this[func].apply(context, args);
          previous = now;
        } else {
          this.$toast('操作频繁，请稍后重试!');
        }
      } else if (type === 2) {
        if (!timeout) {
          timeout = setTimeout(() => {
            timeout = null;
            this[func].apply(context, args);
          }, wait)
        }
      }

    }
  }
  export default {
    data() {
      return {
        isShowPopup: false,
        tabsActive: 1,
        t_money: 0, // 提现金额
        is_bind_card: 0, // 是否认证 0为没认证 1为认证
        orderData: {
          total_income: 0, // 预估收入
          self: {
            income: 0,
            live_order: 0,
            price: 0,
            total_order: 0
          },
          share: {
            income: 0,
            live_order: 0,
            price: 0,
            total_order: 0
          }
        },
        last_month_total_income: 0, // 上月预估收入
        month_total_income: 0, // 本月预估收入
        orderParams: {
          uid: uni.getStorageSync('userInfo') ? uni.getStorageSync('userInfo').uid : '43714797',
          start_date: this.$dateFn.formatTime(new Date(), '{y}-{m}-{d}'),
          end_date: this.$dateFn.formatTime(new Date(), '{y}-{m}-{d}')
        },
        // 映射天数字段
        mappingDayParam: {
          1: 1,
          2: -1,
          3: 7,
          4: 30
        },
      }
    },
    components: {uniPopup, uniPopupDialog},
    onShow() {
      // zq.saCommSendData('myMyAccou', {});
      this.getUserData();
    },
    onHide() {
      this.$refs.showAuth.close()
    },
    methods: {
      // 获取用户信息
      getUserData() {
        return new Promise(resolve => {
          this.$Qapi._getUserData().then(res => {
            let {
              status,
              data
            } = res;
            if (status === 0) {
              this.t_money = data.money;
              this.is_bind_card = data.userInfo.is_bind_card;
              uni.getStorage({
                key: 'is_bind_card',
                success: () => {},
                fail:() => {
                  uni.setStorage('is_bind_card', data.userInfo.is_bind_card)
                }
              })
              uni.setStorageSync('userInfo', data.userInfo)
              this.getOrderData();
            }
          });
        });
      },
      // 获取订单数据
      getOrderData() {
        this.orderParams.uid = uni.getStorageSync('userInfo') ? uni.getStorageSync('userInfo').uid : '43714797'
        this.$Qapi._getOrderData({
          data: JSON.stringify({ ...this.orderParams
          })
        }).then(res => {
          let {
            status,
            data
          } = res;
          if (status === 0) {
            if (!this.last_month_total_income) {
              this.last_month_total_income = data.last_month_total_income;
            }
            if (!this.month_total_income) {
              this.month_total_income = data.month_total_income;
            }
            this.orderData = data;
          }
        });
      },
      // 划转弹框
      transferMoney() {
        this.$refs.showTransfer.close();
        let token = GetToken(),
          getHost = this.$methods.getHost();
        window.WebViewJavascriptBridge.callHandler(
          "openSourceUrl", {
            type: 0,
            url: getHost + '/html/income/index.html?token=' + token
          }
        );
      },
      // 用户点击提现, 查看是否认证
      withdrawalThrottle: throttle('cashWithdrawal', 1000, 1),
      cashWithdrawal() {
        let is_bind_card = uni.getStorageSync('is_bind_card');
        if (is_bind_card == 0) {
          // 未认证则让用户去认证
          this.$refs.showAuth.open();
        } else {
          if (this.t_money != 0) {
            // 认证了
            this.$Qapi._withdraw().then(res => {
              if (res.status == 0) {
                this.t_money = 0;
                this.$refs.showTransfer.open()
              } else {
                uni.showToast({
                  title: '操作失败，请联系客服或稍后重试',
                  duration: 2000,
                  position: 'center'
                })
              }
            });
          } else {
            uni.showToast({
              title: '无可提现金额',
              duration: 2000,
              position: 'center'
            })
          }
        }
      },
      authFn() {
        console.log('_--------认证---》》》》')
        uni.navigateTo({
          url: '/pages/profit/certifyUser'
        })
      },
      tabsChange(e) {
        if (this.tabsActive == e) {
          return;
        }
        this.tabsActive = e;
        this.formatOrderTime(this.mappingDayParam[e]);
        this.getOrderData();
      },
      // 格式化订单时间
      formatOrderTime(day) {
        let that = this,
          currentTime = this.$dateFn.formatTime(new Date(), '{y}-{m}-{d}'), //今天;
          preDate = null;
        switch (day) {
          case -1:
            preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
            preDate = this.$dateFn.formatTime(preDate, '{y}-{m}-{d}'); //前一天
            that.orderParams.start_date = preDate;
            that.orderParams.end_date = currentTime;
            break;
          case 1:
            that.orderParams.start_date = currentTime;
            that.orderParams.end_date = currentTime;
            break;
          case 7:
            preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7);
            preDate = this.$dateFn.formatTime(preDate, '{y}-{m}-{d}'); //前七天
            that.orderParams.start_date = preDate;
            that.orderParams.end_date = currentTime;
            break;
          case 30:
            preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 30);
            preDate = this.$dateFn.formatTime(preDate, '{y}-{m}-{d}'); //前三十天
            that.orderParams.start_date = preDate;
            that.orderParams.end_date = currentTime;
            break;
        }
      },
      goOrderPage(type) {
        // type 2为分享分销数据、1为领劵自购返利
        // day 1为今天 -1为昨天 7为近7天 30为近30天
        let that = this,
          day = this.mappingDayParam[this.tabsActive],
          preDate = null,
          currentTime = this.$dateFn.formatTime(new Date().getTime() - 24 * 60 * 60 * 1000, '{y}-{m}-{d}').split('-'), //昨日;
          dateStr = '';
        switch (day) {
          case 7:
            preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7);
            preDate = this.$dateFn.formatTime(preDate, '{y}-{m}-{d}').split('-'); //前七天
            break;
          case 30:
            preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 30);
            preDate = this.$dateFn.formatTime(preDate, '{y}-{m}-{d}').split('-'); //前三十天
            break;
        }
        if (day != 1 && day != -1) {
          if (preDate[0] == currentTime[0]) {
            // 同一年
            dateStr = `${preDate[1]}月${preDate[2]}日--${currentTime[1]}月${currentTime[2]}日`
          } else {
            dateStr =
              `${currentTime[0]}年${preDate[1]}月${preDate[2]}日--${currentTime[0]}年${currentTime[1]}月${currentTime[2]}日`
          }
        } else {
          dateStr = '99'
        }
        uni.navigateTo({
          url: `/pages/profit/orderIndex?type=${type}&day=${day}&dateStr=${dateStr}`
        })
      },
      tips(e) {
        if (e == 1) {
          this.$refs.isShowPopup1.open()
        } else if (e == 2) {
          this.$refs.isShowPopup2.open()
          // this.isShowPopup2 = !this.isShowPopup2;
        }
      }
    }
  };
</script>
<style lang="scss">
  .income {
    background: rgba(246, 246, 246, 1);

    .title {
      height: 186upx;
      background: url("./../../static/images/profit/sy_top_bg.png") no-repeat;
      background-size: cover;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 40upx;

      .left {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;

        .text {
          font-size: 30upx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          margin-bottom: 30upx;
          display: flex;
          justify-content: center;
          align-items: center;

          image {
            width: 28upx;
            height: 28upx;
            margin-left: 10upx;
          }
        }

        .money {
          font-size: 54upx;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          display: flex;
          justify-content: center;
          align-items: flex-end;
          line-height: 1;

          .unit {
            font-family: PingFangSC-Regular, PingFang SC;
            font-size: 30upx;
            margin-bottom: 6upx;
          }
        }
      }

      .withDraw {
        width: 150upx;
        height: 56upx;
        background: linear-gradient(180deg,
          rgba(255, 230, 204, 1) 0%,
          rgba(255, 176, 112, 1) 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50upx;
        font-size: 30upx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(144, 75, 27, 1);

        .img {
          width: 12upx;
          height: 18upx;
          margin-left: 10upx;
        }
      }
    }

    .count {
      height: 145upx;
      background: #fff;
      display: flex;
      align-items: center;

      .thisMouth,
      .nextMouth {
        padding: 0 50upx;
        width: 50%;
        display: flex;
        flex-direction: column;

        .text {
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          font-size: 24upx;
          margin-bottom: 14upx;
        }

        .money {
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          font-size: 40upx;
          color: rgba(51, 51, 51, 1);
        }
      }
    }

    .notes {
      width: 100%;
      height: 60upx;
      padding: 0 30upx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 26upx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(110, 91, 40, 1);
      background: rgba(255, 249, 233, 1);

      .img {
        width: 26upx;
        height: 26upx;
        margin-left: 6upx;
        background: url("./../../static/images/profit/sy_help1_icon.png") no-repeat;
        background-size: 100% 100%;
        position: relative;
      }
    }

    .tabs {
      height: 61upx;
      margin: 0 30upx;
      margin-top: 30upx;
      border: 1px solid rgba(234, 78, 61, 1);
      border-radius: 31upx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;

      view {
        flex: 1;
        text-align: center;
        font-size: 28upx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(234, 78, 61, 1);
        height: 100%;
        line-height: 61upx;
        box-sizing: border-box;
        border-right: 1upx solid rgba(234, 78, 61, 1);
      }

      .active {
        background: rgba(234, 78, 61, 1);
        color: #fff;
        position: relative;

        &:after {
          content: " ";
          position: absolute;
          left: 50%;
          bottom: -9upx;
          width: 14upx;
          height: 14upx;
          background: rgba(234, 78, 61, 1);
          transform: rotate(45deg);
        }
      }
    }

    .tabs_notes {
      margin: 28upx 30upx 20upx;
      height: 56upx;
      background: rgba(255, 249, 233, 1);
      text-align: center;
      line-height: 56upx;
      font-size: 30upx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(110, 91, 40, 1);
      display: flex;
      justify-content: center;
      align-items: center;

      .money {
        font-size: 42upx;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: rgba(234, 78, 61, 1);
        line-height: 56upx;
      }
    }

    .tabs_list {
      margin-bottom: 16upx;
      background: #fff;

      .list_title {
        padding: 22upx 30upx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
          font-size: 30upx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(51, 51, 51, 1);

          .tags {
            background: #fff9e9;
            font-size: 22upx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(234, 78, 61, 1);
            padding: 4upx 9upx 4upx 11upx;
            border-radius: 31upx;
          }
        }

        .right {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24upx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);

          .arrow {
            width: 10upx;
            height: 18upx;
            margin-left: 8upx;
          }
        }
      }
    }

    .one,
    .two {
      padding: 50upx 35upx;
      background: #fff;
      display: flex;

      .left,
      .right {
        .one_name {
          display: flex;
          align-items: center;
          font-size: 24upx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }

        .one_num {
          margin-top: 2upx;
          font-size: 40upx;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }

        image {
          width: 24upx;
          height: 24upx;
          margin-left: 3upx;
          margin-bottom: 1upx;
        }
      }

      .left,
      .right {
        flex: 1;
        width: 50%;
      }
    }

    .line_bottom {
      position: relative;

      &:before {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0; //控制细线出现在顶部还是底部
        width: 100%;
        height: 1upx;
        border-bottom: 1px solid #cccccc;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }

    .line_right {
      position: relative;

      &:before {
        content: " ";
        position: absolute;
        top: 0;
        right: 0;
        width: 1upx;
        height: 100%;
        border-right: 1upx solid #cccccc;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleX(0.5);
        transform: scaleX(0.5);
      }
    }

    .auth-container {
      display: flex;
      flex-direction: column;
      width: 600upx;
      justify-content: space-between;

      .van-dialog__content {
        height: 194upx;
        display: flex;
        align-items: center;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        font-size: 36upx;
        padding: 0 37upx;
      }

      .van-dialog__footer {
        flex: 1;
        border-top: 1px solid #CCCCCC;

        button {
          font-size: 36upx;

          &:nth-child(1) {
            color: #666666;
            border-right: 1upx solid #CCCCCC;
          }

          &:nth-child(2) {
            color: #EA4E3D;
          }
        }
      }
    }

    .transfer-container {
      overflow: visible;
      .warp_box {
        padding: 36upx 66upx;
        width: 640upx;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 32upx;
      }
      .tf-title {
        text-align: center;
        color: #333333;
        font-size: 36upx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
      }

      .tf-context {
        margin: 38upx 0 35upx 0;
        font-size: 30upx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 40upx;
        text-align: center;

        >span {
          color: #EA4E3D;
        }
      }
      .confirmBtn {
        width: 100%;
       display: flex;
       justify-content: center;
       align-items: center;
       height: 80upx;
       background: #EA4E3D;
       border-radius: 40upx;
       font-family: PingFangSC-Regular, PingFang SC;
       font-weight: 400;
       font-size: 28upx;
       color: #fff;
      }
      .close {
        position: absolute;
        bottom: -76upx;
        left: 50%;
        transform: translateX(-50%);
        width: 50upx;
        height: 50upx;

      }
    }
  }

  .cash_notes {
    width: 100%;
    height: 48upx;
    background: rgba(255, 233, 235, 1);
    padding-left: 30upx;
    line-height: 48upx;
    font-size: 24upx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 78, 82, 1);
  }

  .popup {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    z-index: 99;

    .content {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding-bottom: 40upx;
      width: 690upx;
      padding-top: 56upx;
      background-color: #ffffff;
      border-radius: 44upx;
      background-size: 100% 100%;
      font-size: 28upx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 40upx;

      .iKnow {
        width: 562upx;
        height: 80upx;
        background: rgba(234, 78, 61, 1);
        border-radius: 40upx;
        font-size: 36upx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        margin: 0 auto;
        text-align: center;
        line-height: 80upx;
      }
    }
  }
</style>
