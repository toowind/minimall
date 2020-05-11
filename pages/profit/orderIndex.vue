<template>
  <view class="order-container">
    <view class="navTitle" :style="{'padding-top': statusBar + 'px',height:customBar+'px'}">
      <image class="back" src="../../static/images/profit/back_icon.png" mode="" @tap="backFn"></image>
      <text>{{navTitle}}</text>
    </view>
    <view :style="{height: customBar -1 +'px'}"></view>
    <view class="order-top-wrap" >
      <view class="o-t-time">
        <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
           <text class="rq">{{ displayTime }}</text>
        </picker>
        <uni-icons type="arrowdown" @click="datetimeShow=false" v-if="!dateStr || dateStr == '99'" ></uni-icons>
        <view class="history-time" v-if="dateStr && dateStr != '99'">
          <text>{{ dateStr }}</text>
          <uni-icons type="close" @click="closeDateQuery()"></uni-icons>
        </view>
      </view>

      <!-- 如果用户是当前月或者当前月的上一月显示副标题 显示 -->
      <block v-if="isCurrentAndPrevMonth">
        <!--
                    1. tabsActive选择 -> 已付款
                    2. 已付款存在订单
                 -->
        <block v-if="tabsActive === 1 && orderListObj[getUserSelectOrderType[1]].list.length">
          <view class="o-t-income">
            预估收入(元):<text class="money">{{orderListObj[getUserSelectOrderType[1]].total_income/100}}</text>
          </view>
        </block>
        <!--
                    1. tabsActive选择 -> 已完成
                    2. userSelTimeLqNextTime -> 当前时间 小于 当前时间的下月25号 显示
                 -->
        <block v-if="tabsActive === 2 && userSelTimeLqNextTime && orderListObj[getUserSelectOrderType[2]].list.length">
          <view class="o-t-income">
            待结算收入(元):<text class="money">{{orderListObj[getUserSelectOrderType[2]].total_income/100}}</text>
          </view>
        </block>
        <!--
                    1. tabsActive选择 -> 已结算
                    2. userSelTimeGtNextTime -> 当前时间 大于 当前时间的下月25号 显示
                -->
        <block v-if="tabsActive === 3 && userSelTimeGtNextTime && orderListObj[getUserSelectOrderType[3]].list.length">
          <view class="o-t-income">
            已结算收入(元):<text class="money">{{orderListObj[getUserSelectOrderType[3]].total_income/100}}</text>
          </view>
        </block>
      </block>
      <!-- 不是当月也不是当月的上一月 -->
      <block v-else>
        <!-- 显示已结算 -->
        <block v-if="tabsActive === 3 && orderListObj[getUserSelectOrderType[3]].list.length">
          <view class="o-t-income">
            已结算收入(元):<text class="money">{{orderListObj[getUserSelectOrderType[3]].total_income/100}}</text>
          </view>
        </block>
      </block>

    </view>
    <view class="order-cont-wrap">
      <view class="tabs">
        <view :class="tabsActive == 1?'active':''" style="border-radius: 31rpx 0 0 31rpx;" @click="tabsChange(1)">已付款</view>
        <view :class="tabsActive == 2?'active':''" @click="tabsChange(2)">已完成</view>
        <view :class="tabsActive == 3?'active':''" @click="tabsChange(3)">已结算</view>
        <view :class="tabsActive == 4?'active':''" style="border-right:none;border-radius: 0 31rpx 31rpx 0;" @click="tabsChange(4)">已失效</view>
      </view>
      <view class="tabs_notes">
        <text>订单数据同步会有1~10分钟的延迟，请耐心等待哈~</text>
      </view>
      <!-- 已付款 -->
      <view class="list_container" v-show="tabsActive === 1">
        <order-list :orderType="getUserSelectOrderType[1]" :list="orderListObj[getUserSelectOrderType[1]].list" v-if="orderListObj[getUserSelectOrderType[1]].list.length > 0" />
        <text class="noMoreData" v-else>- 我是有底线的 -</text>
      </view>

      <!-- 已完成 -->
      <view class="list_container" v-show="tabsActive === 2">
        <order-list :orderType="getUserSelectOrderType[2]" :list="orderListObj[getUserSelectOrderType[2]].list" v-if="orderListObj[getUserSelectOrderType[2]].list.length > 0" />
        <text class="noMoreData" v-else>- 我是有底线的 -</text>
      </view>

      <!-- 已结算 -->
      <view class="list_container" v-show="tabsActive === 3" >
        <order-list :orderType="getUserSelectOrderType[3]" :list="orderListObj[getUserSelectOrderType[3]].list" v-if="orderListObj[getUserSelectOrderType[3]].list.length > 0"/>
        <text class="noMoreData" v-else>- 我是有底线的 -</text>
      </view>

      <!-- 已失效 -->
      <view class="list_container" v-show="tabsActive === 4" >
        <order-list :orderType="getUserSelectOrderType[4]" :list="orderListObj[getUserSelectOrderType[4]].list" v-if="orderListObj[getUserSelectOrderType[4]].list.length > 0"
          :user_rate_config="orderListObj[getUserSelectOrderType[4]].user_rate_config" />
        <text class="noMoreData" v-else>- 我是有底线的 -</text>
      </view>
    </view>
    <!-- <van-popup class="date-time-wrap" position="bottom" :show="datetimeShow" closeable>
      <van-datetime-picker ref="datetime" :value="currentDate" type="date" :min-date="minDate" :max-date="maxDate"
        @cancel="onPickerCancel" @confirm="onPickerConfirm" @formatter="formatter" />
    </van-popup> -->
  </view>
</template>

<script>
  import uniIcons from "@/components/uni-icons/uni-icons.vue"
  import orderList from './orderList'
  export default {
    components: {
      orderList,
      uniIcons
    },
    computed: {
      // 用户选择当前的时间(小于&等于)当前用户选择时间的下月25日之前
      userSelTimeLqNextTime() {
        let selectedTS = this.$dateFn.formatTime(new Date(this.selectedTime), '{y}-{m}-{d}').split('-'),
          nextMonth = Number(selectedTS[1]) + 1,
          nextTime = null,
          now = +new Date();
        if (nextMonth >= 13) {
          nextMonth = 1;
          if (String(nextMonth).length > 0 && nextMonth < 10) {
            nextMonth = '0' + nextMonth;
          }
          nextTime = +new Date(`${Number(selectedTS[0]) + 1}-${nextMonth}-25`);
        } else {
          if (String(nextMonth).length > 0 && nextMonth < 10) {
            nextMonth = '0' + nextMonth;
          }
          nextTime = +new Date(`${selectedTS[0]}-${nextMonth}-25`);
        }
        /*
            now 为当前时间的时间戳
            nextTime 为当前时间的下一月25号时间戳
        */
        return now < nextTime;
      },
      // 用户选择当前的时间(大于)当前用户选择时间的下月25日之后
      userSelTimeGtNextTime() {
        let selectedTS = this.$dateFn.formatTime(new Date(this.selectedTime), '{y}-{m}-{d}').split('-'),
          nextMonth = Number(selectedTS[1]) + 1,
          nextTime = null,
          now = +new Date();
        if (nextMonth >= 13) {
          nextMonth = 1;
          if (String(nextMonth).length > 0 && nextMonth < 10) {
            nextMonth = '0' + nextMonth;
          }
          nextTime = +new Date(`${Number(selectedTS[0]) + 1}-${nextMonth}-25`);
        } else {
          if (String(nextMonth).length > 0 && nextMonth < 10) {
            nextMonth = '0' + nextMonth;
          }
          nextTime = +new Date(`${selectedTS[0]}-${nextMonth}-25`);
        }
        /*
            now 为当前时间的时间戳
            nextTime 为当前时间的下一月25号时间戳
        */
        return now >= nextTime;
      },
      startDate() {
        return this.getDate('start');
      },
      endDate() {
        return this.getDate('end');
      }
    },
    data() {
      return {
        customBar: this.customBar,
        statusBar: this.statusBar,
        navTitle: '',
        minDate: new Date(2000, 0, 1).getTime(),
        maxDate: new Date().getTime(),
        currentDate: new Date().getTime(),
        datetimeShow: false,
        tabsActive: 1,
        loading: false,
        finished: false,
        displayTime: this.$dateFn.formatTime(new Date(), '{y}年{m}月{d}日'),
        selectedTime: +new Date(), // 时间戳
        // 订单请求参数
        orderParams: {
          type: '',
          day: '',
          date: '',
          page: 1,
          page_size: 8,
          status: 1,
          // uid: uni.getStorageInfoSync('userInfo') ? uni.getStorageInfoSync('userInfo').uid : '43714797'
          uid: '43714797'
        },
        // 订单数据映射
        getUserSelectOrderType: {
          1: 'paidList',
          2: 'completedList',
          3: 'settledList',
          4: 'failureList'
        },
        orderListObj: {
          paidList: {
            list: [],
            total_income: 0,
            user_rate_config: 0
          }, // 已付款
          completedList: {
            list: [],
            total_income: 0,
            user_rate_config: 0
          }, // 已完成
          settledList: {
            list: [],
            total_income: 0,
            user_rate_config: 0
          }, // 已结算
          failureList: {
            list: [],
            total_income: 0,
            user_rate_config: 0
          }
        },
        // 选择的时间
        selectedTimeText: '',
        // 是否是当前月份或者上一个月份
        isCurrentAndPrevMonth: true,
        dateStr: ''
      }
    },
    onLoad(params) {
      console.log(')))))))))--->>>>', params)
      this.type = params.type
      this.day = params.day
      this.dateStr = params.dateStr
      this.init();
    },
    onReady() {
      if (this.type == 1) {
          this.navTitle= '领券自购订单'
        // zq.saCommSendData('selfOrder', {}); // 自购订单
      } else {
          this.navTitle = '分销推广订单'
        // zq.saCommSendData('distributionOrder', {}); // 分销订单
      }
    },
    // 加载数据
    onReachBottom() {
      this.orderParams.page++;
      this.getOrderData(this.tabsActive);
    },
    methods: {
      // 初始化
      init() {
        let that = this;
        that.orderParams = Object.assign(that.orderParams, { type:this.type,day:this.day,dateStr: this.dateStr
        });
        that.dateStr = that.orderParams.dateStr;
        delete that.orderParams.dateStr;
        this.initOrderParams(this.dateStr ? true : false);

      },
      // 获取列表数据
      getOrderData(e = this.tabsActive) {
        let that = this,
          nowSelectStr = 'paidList';
        nowSelectStr = this.getUserSelectOrderType[e] || 'paidList';
        this.loading = true;
        if (this.orderParams.page == 1 && this.orderListObj[nowSelectStr].list.length) {
          this.orderParams.page++;
        }
        console.log('---params--rq===>>>', this.orderParams)
        this.$Qapi._getOrderList({
          data: JSON.stringify({ ...this.orderParams
          })
        }).then(res => {
          if (res.status === 0) {
            if (res.data.list.length) {
              if (this.orderListObj[nowSelectStr].list.length && this.orderParams.page != 1) {
                this.$set(this.orderListObj[nowSelectStr], 'list', this.orderListObj[nowSelectStr].concat(res.data.list));
              } else {
                this.$set(this.orderListObj[nowSelectStr], 'list', res.data.list);
              }
              this.orderListObj[nowSelectStr].total_income = res.data.total_income;
              this.orderListObj[nowSelectStr].user_rate_config = res.data.user_rate_config;
              console.log('-----list-->', this.orderListObj)
              this.finished = false;
            } else {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
          this.loading = false;
        })
      },
      bindDateChange: function(e) {
        const d = e.target.value.split('-')
        this.onPickerConfirm(e.target.value)
        this.displayTime = d[0]+'年'+d[1]+'月' + d[2]+'日'
      },
      getDate(type) {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (type === 'start') {
          year = year - 20;
        } else if (type === 'end') {
          year = year;
          month = month;
          day = day
        }
        month = month > 9 ? month : '0' + month;
        day = day > 9 ? day : '0' + day;
        return `${year}-${month}-${day}`;
      },
      // 格式化订单时间
      formatOrderTime() {
        let that = this,
          day = Number(this.orderParams.day),
          currentTime = this.$dateFn.formatTime(new Date(), '{m}-{d}').split('-'), //今天;
          preDate = null;
        switch (day) {
          case -1:
            that.selectedTimeText = `-1`;
            break;
          case 1:
            that.selectedTimeText = `1`;
            break;
          case 7:
            preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7);
            preDate = this.$dateFn.formatTime(preDate, '{m}-{d}').split('-'); //前七天
            that.selectedTimeText = `${preDate[0]}月${preDate[1]}-${currentTime[0]}月${currentTime[1]}日订单数据`;
            break;
          case 30:
            preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 30);
            preDate = this.$dateFn.formatTime(preDate, '{m}-{d}').split('-'); //前三十天
            that.selectedTimeText = `${preDate[0]}月${preDate[1]}-${currentTime[0]}月${currentTime[1]}日订单数据`;
            break;
        }
      },
      // 切换订单状态
      tabsChange(e) {
        if (this.tabsActive == e) {
          return;
        }

        this.tabsActive = e;
        this.orderParams.status = e;
        let nowSelectStr = this.getUserSelectOrderType[e];
        if (this.orderListObj[nowSelectStr].list.length) {
          return;
        }
        this.initOrderParams(this.dateStr ? true : false, this.currentDate);
      },
      // 选择时间组件确认回调
      onPickerConfirm(value) {
        let that = this,
          currentTime = that.$dateFn.formatTime(new Date(), '{y}-{m}-{d}').split('-'),
          selectedTime = that.$dateFn.formatTime(new Date(value), '{y}-{m}-{d}').split('-');
        that.dateStr = '';
        that.orderListObj = {
          paidList: {
            list: [],
            total_income: 0,
            user_rate_config: 0
          }, // 已付款
          completedList: {
            list: [],
            total_income: 0,
            user_rate_config: 0
          }, // 已完成
          settledList: {
            list: [],
            total_income: 0,
            user_rate_config: 0
          }, // 已结算
          failureList: {
            list: [],
            total_income: 0,
            user_rate_config: 0
          }
        };
        // 如果当前选择年份等于当前年则走以下逻辑。
        if (Number(currentTime[0]) === Number(selectedTime[0])) {
          // 如果当前选择月份等于当前月份 或者 当前月份的上一月份则显示副标题。
          if ((Number(currentTime[1]) === Number(selectedTime[1])) || (Number(currentTime[1]) - 1 === Number(
              selectedTime[1]))) {
            that.isCurrentAndPrevMonth = true;
          } else {
            // 如果当前选择月份不是当前月份也不是上月份则不显示副标题
            that.isCurrentAndPrevMonth = false;
          }
        } else {
          // 如果当前选择年不等于当前年则不显示。
          that.isCurrentAndPrevMonth = false;
        }
        that.initOrderParams(false, value);
        that.displayTime = `${selectedTime[0]}年${selectedTime[1]}月${selectedTime[2]}日`;
        that.selectedTime = value;
        that.datetimeShow = false;
      },
      // 关闭时间查询
      closeDateQuery() {
        this.dateStr = '';
        this.orderListObj = {
          paidList: {
            list: [],
            total_income: 0,
            user_rate_config: 0
          }, // 已付款
          completedList: {
            list: [],
            total_income: 0,
            user_rate_config: 0
          }, // 已完成
          settledList: {
            list: [],
            total_income: 0,
            user_rate_config: 0
          }, // 已结算
          failureList: {
            list: [],
            total_income: 0,
            user_rate_config: 0
          }
        };
        this.initOrderParams(false);
      },
      // 初始化orderParams参数
      initOrderParams(hasDay = true, dateValue = null) {
        let orderListObj = this.orderListObj,
          currentTime = this.$dateFn.formatTime(new Date(), '{y}-{m}-{d}'), //今天;
          preDate = null,
          params = {
            type: this.type,
            page: 1,
            page_size: 8,
            status: this.tabsActive,
            // uid: uni.getStorageInfoSync('userInfo') ? uni.getStorageInfoSync('userInfo').uid : '43714797',
            uid: '43714797',
            start_date: '',
            end_date: ''
          };
        if (hasDay) {
          // 当前传Day
          switch (Number(this.day)) {
            case 1:
              params.start_date = currentTime;
              params.end_date = currentTime;
              break;
            case -1:
              preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
              preDate = this.$dateFn.formatTime(preDate, '{y}-{m}-{d}'); //前一天
              params.start_date = preDate;
              params.end_date = currentTime;
              break;
            case 7:
              preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7);
              preDate = this.$dateFn.formatTime(preDate, '{y}-{m}-{d}'); //前七天
              params.start_date = preDate;
              params.end_date = currentTime;
              break;
            case 30:
              preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 30);
              preDate = this.$dateFn.formatTime(preDate, '{y}-{m}-{d}'); //前三十天
              params.start_date = preDate;
              params.end_date = currentTime;
              break;
          }
        } else {
          // 当前传Date
          let currentTime = this.$dateFn.formatTime(dateValue ? new Date(dateValue) : new Date(), '{y}-{m}-{d}');
          params.start_date = currentTime;
          params.end_date = currentTime;
        }
        this.orderParams = params;
        this.getOrderData(this.tabsActive);
      },
      backFn(){
        uni.navigateBack({delta:1})
      }
    }
  }
</script>
<style>
  
</style>
<style lang="scss">
  .order-container {
    .navTitle {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color:rgba(51,51,51,1);
      font-size:36rpx;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      background-color: #fff;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 2;
      .back {
        width: 22rpx;
        height: 36rpx;
        position: absolute;
        left: 28rpx;
        bottom: 20rpx;
      }
    }
    width: 100%;
    height: 100%;
    background-color: #F6F6F6;
    overflow: scroll;

    .order-top-wrap {
      width: 100%;
      background: #FFFFFF;
      padding: 25rpx 30rpx;

      .o-t-time {
        display: flex;
        align-items: center;

        .rq {
          margin-right: 5rpx;
          font-size: 30rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }

        .history-time {
          display: flex;
          align-items: center;
          height: 45rpx;
          padding: 0 12rpx;
          background-color: #FFF9E9;
          border-radius: 44rpx 56rpx 56rpx 0px;

          >text {
            color: #6E5B28;
            font-size: 24rpx;
            margin-right: 10rpx;
          }
        }
      }

      .o-t-income {
        margin-top: 50rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 56rpx;
        background: #FFF9E9;
        font-size: 30rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(110, 91, 40, 1);

        .money {
          font-size: 42rpx;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #EA4E3D;
        }
      }
    }

    .order-cont-wrap {
      padding: 0 30rpx;

      .tabs {
        height: 61rpx;
        margin: 30rpx 0;
        border: 2rpx solid rgba(234, 78, 61, 1);
        border-radius: 31rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;

        view {
          flex: 1;
          text-align: center;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(234, 78, 61, 1);
          height: 100%;
          line-height: 61rpx;
          box-sizing: border-box;
          border-right: 1px solid rgba(234, 78, 61, 1);
        }

        .active {
          background: rgba(234, 78, 61, 1);
          color: #fff;
          position: relative;

          &:after {
            content: " ";
            position: absolute;
            left: 50%;
            bottom: -9rpx;
            width: 14rpx;
            height: 14rpx;
            background: rgba(234, 78, 61, 1);
            transform: rotate(45deg);
          }
        }
      }

      .tabs_notes {
        margin: 28rpx 30rpx 20rpx;
        height: 56rpx;
        background: rgba(255, 249, 233, 1);
        text-align: center;
        line-height: 56rpx;
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(110, 91, 40, 1);
        display: flex;
        justify-content: center;
        align-items: center;

        .money {
          font-size: 42rpx;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: rgba(234, 78, 61, 1);
          line-height: 56rpx;
        }
      }
    }
    .list_container {
      width: 100%;
      text-align: center;
      .noMoreData {
       font-size:24rpx;
       font-family:PingFangSC-Regular,PingFang SC;
       font-weight:400;
       color:rgba(153,153,153,1);
      }
    }
    .date-time-wrap {
      width: 100%;
      top: 100%;
      left: 50%;
      -webkit-transform: translate3d(-50%, -100%, 0);
      transform: translate3d(-50%, -100%, 0);

      .van-picker__cancel {
        color: #666666;
        font-weight: 500;
      }

      .van-picker__confirm {
        color: #EA4E3D;
        font-weight: 500;
      }
    }
  }
</style>
