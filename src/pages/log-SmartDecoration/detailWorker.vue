<template>
  <view class="main">
    <view class="main-body">
      <!-- 实时数据 -->
      <div class="card summary">
        <div>
          <!-- <view class="read-status">
            <uni-status :options="readStatus" :value="info.status"></uni-status>
          </view> -->
          <ul>
            <li>
              <h6>编制日期</h6>
              <p>{{ info.diaryDate | formatData }}</p>
            </li>
            <li>
              <h6>记录人员</h6>
              <p>{{ info.creatorName }}</p>
            </li>
          </ul>
        </div>
      </div>

      <!-- 基本信息 start -->
      <view>
        <view class="card-header">基本信息</view>
        <uni-card isForm>
          <uni-form-item label="日志编号" :border="false" align="left">
            <view class="placeholder">{{ info.code }}</view>
          </uni-form-item>
          <uni-form-item label="施工人员" :border="false" align="left">
            <view class="placeholder">{{ info.constructionPersonNames }}</view>
          </uni-form-item>
        </uni-card>
        <!-- 施工人员的工种信息 start -->
        <block v-if="workerList.length">
          <uni-card
            v-for="item in workerList"
            :key="item.workType"
            :title="item.workTypeName + `   (${item.persons.length}人)`"
          >
            <uni-form-item
              v-for="subItem in item.persons"
              :key="subItem.constructionPersonId"
              :border="false"
              align="left"
              :label="subItem.constructionPersonName"
            >
              <view class="placeholder">{{ subItem.areaResponsible }}</view>
            </uni-form-item>
          </uni-card>
        </block>
        <!-- 施工人员的工种信息 end -->
      </view>
      <!-- 基本信息end -->
      <!-- 今日天气信息start -->
      <view>
        <view class="card-header">天气</view>
        <uni-card isForm>
          <uni-form-item label="今日天气" :border="false" align="left">
            <view class="placeholder">{{ info.todayWeather }}</view>
          </uni-form-item>
          <uni-form-item label="温度(℃)" :border="false" align="left">
            <view v-if="info.lowTemperature" class="placeholder"
              >{{ info.lowTemperature + '°C' }}~{{ info.highTemperature + '°C' }}</view
            >
          </uni-form-item>
          <!--          <uni-form-item label="上午温度(℃)" :border="false" align="left">-->
          <!--            <view class="placeholder">{{ info.morningWeather && info.morningWeather + '°C' }}</view>-->
          <!--          </uni-form-item>-->
          <!--          <uni-form-item label="午间温度(℃)" :border="false" align="left">-->
          <!--            <view class="placeholder">{{ info.noonWeather && info.noonWeather + '°C' }}</view>-->
          <!--          </uni-form-item>-->
          <!--          <uni-form-item label="下午温度(℃)" :border="false" align="left">-->
          <!--            <view class="placeholder">{{ info.afternoonWeather && info.afternoonWeather + '°C' }}</view>-->
          <!--          </uni-form-item>-->
        </uni-card>
      </view>
      <!-- 今日天气信息end -->
      <!--  -->
      <view>
        <view class="card-header">进度</view>
        <uni-card isForm>
          <uni-form-item label="施工完成工序" :border="false" align="left">
            <view class="placeholder">{{ info.floorScheduleNames }}</view>
          </uni-form-item>
          <uni-form-item label="发现问题" :border="false" align="left">
            <view class="placeholder">{{ info.findProblem || '无' }}</view>
          </uni-form-item>
          <uni-form-item label="解决方案" :border="false" align="left">
            <view class="placeholder">{{ info.solution || '无' }}</view>
          </uni-form-item>
          <uni-form-item label="解决时间" :border="false" align="left">
            <view class="placeholder">{{ info.solveTime || '无' }}</view>
          </uni-form-item>
        </uni-card>
      </view>
      <view>
        <view class="card-header">其他</view>
        <uni-card class="attachment">
          <uni-form-item label="抄送" align="left" :border="false">
            <view class="placeholder">{{ info.copyToPersonNames }}</view>
          </uni-form-item>
          <uni-form-item label="备注" align="left" :border="false">
            <view class="placeholder">{{ info.remark || '无' }}</view>
          </uni-form-item>
          <uni-form-item label="附件" align="left" :border="false">
            <uni-attachment v-model="info.fileIds"></uni-attachment>
          </uni-form-item>
        </uni-card>
      </view>
    </view>
  </view>
</template>

<script>
import readStatus from './lib/readStatus'
import safeStatus from './lib/safeStatus'
import { Api } from '@/api/material/purchaseOrder'
export default {
  data() {
    return {
      id: null,
      info: {},
      workerList: [],

      readStatus,
      safeStatus,
      showBarOperate: ''
    }
  },
  onLoad(option) {
    this.id = option.id
    // if (!option.messageId) {
    //   return
    // }
    // this.fly.system.get('message/read/' + option.messageId)
  },
  onNavigationBarButtonTap(obj) {
    this.showBarOperate = !this.showBarOperate
  },
  onShow() {
    this.handleQueryLogInfo()
  },
  methods: {
    async handleQueryLogInfo() {
      let result = await this.fly.log.get(`/decorate/diary/get/${this.id}`)
      if (result.code === 200) {
        this.info = result.data || {}
        let workerList = this.info.personList || []
        console.log('111', workerList)
        this.workerList = _.map(workerList, item => {
          return {
            workTypeName: item.workTypeName,
            workTypeId: item.workTypeId,
            personNum: item.personNum,
            persons: item.persons,
            personNames: _.map(item.persons, 'constructionPersonName').join(','),
            personIds: _.map(item.persons, 'constructionPersonId').join(',')
          }
        })
        this.$set(this.info, 'constructionPersonNames', _.map(this.workerList, 'personNames').join(','))
      }
    }
  }
}
</script>

<style lang="less">
@import url('./detail.less');
@import url('./log-add.less');
</style>
