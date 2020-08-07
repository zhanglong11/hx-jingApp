<template>
  <view class="main">
    <view class="main-body">
      <!-- 实时数据 -->
      <div class="card summary">
        <div>
          <h2>{{ info.name }}</h2>
          <view class="read-status">
            <uni-status :options="readStatus" :value="info.status"></uni-status>
          </view>
          <ul>
            <li>
              <h6>编制日期</h6>
              <p>{{ info.diaryDate | formatData }}</p>
            </li>
            <li>
              <h6>记录人员</h6>
              <p>{{ info.recordUserName }}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="card base-info">
        <h3 class="base-info-title">
          基本信息
        </h3>
        <ul>
          <li>
            <span class="label">日志编号</span><span class="value">{{ info.code }}</span>
          </li>
          <!--            <li>-->
          <!--              <span class="label">工程名称</span><span class="value">{{ info.name }}</span>-->
          <!--            </li>-->
          <li>
            <span class="label">项目负责人</span><span class="value">{{ info.chargePersonName }}</span>
          </li>
          <li>
            <span class="label">施工人员</span><span class="value">{{ info.constructionPersonNames }}</span>
          </li>
          <li>
            <span class="label">施工人数</span
            ><span class="value">{{ info.constructionPersonCount && info.constructionPersonCount + '人' }}</span>
          </li>
        </ul>
      </div>
      <div class="card weather">
        <h3 class="weather-title">
          今日天气
        </h3>
        <ul>
          <li>
            <span class="label">今天天气</span><span class="value">{{ info.todayWeather }}</span>
          </li>
          <li>
            <span class="label">上午温度（°C）</span
            ><span class="value">{{ info.morningWeather && info.morningWeather + '°C' }}</span>
          </li>
          <li>
            <span class="label">午间温度（°C）</span
            ><span class="value">{{ info.noonWeather && info.noonWeather + '°C' }}</span>
          </li>
          <li>
            <span class="label">下午温度（°C）</span
            ><span class="value">{{ info.afternoonWeather && info.afternoonWeather + '°C' }}</span>
          </li>
        </ul>
      </div>
      <div class="card progress">
        <h3 class="progress-title">
          进度
        </h3>
        <ul>
          <li>
            <h6>施工过程</h6>
            <div class="value">
              {{ info.constructionProcess || '无' }}
            </div>
          </li>
          <li>
            <h6>施工进度</h6>
            <div class="value">
              {{ info.constructionProgress || '无' }}
            </div>
          </li>
          <li>
            <h6>验收记录</h6>
            <div class="value">
              {{ info.acceptanceRecord || '无' }}
            </div>
          </li>
          <li>
            <h6>变更记录</h6>
            <div class="value">
              {{ info.changeRecord || '无' }}
            </div>
          </li>
          <li>
            <h6>签证记录</h6>
            <div class="value">
              {{ info.visaRecord || '无' }}
            </div>
          </li>
          <li>
            <h6>待办事宜</h6>
            <div class="value">
              {{ info.waitThing || '无' }}
            </div>
          </li>
        </ul>
      </div>

      <div class="card progress">
        <h3 class="progress-title">
          安全问题
        </h3>
        <ul>
          <li>
            <h6>安全问题</h6>
            <div class="value">{{ info.safetyProblem || '无' }}</div>
          </li>
          <li>
            <h6>处理时间</h6>
            <div class="value">{{ info.safetyHandleDate || '无' }}</div>
          </li>
          <li>
            <h6>处理意见</h6>
            <div class="value">{{ info.safetyHandleOption || '无' }}</div>
          </li>
          <li>
            <h6>处理过程</h6>
            <div class="value">{{ info.safetyHandleProcess || '无' }}</div>
          </li>
          <li>
            <h6>处理人</h6>
            <div class="value">{{ info.safetyHandlePersonName || '无' }}</div>
          </li>
          <li>
            <h6>处理结果</h6>
            <div class="value">
              <uni-status :options="safeStatus" :value="info.safetyHandleResult"></uni-status>
            </div>
          </li>
        </ul>
      </div>

      <div class="card progress">
        <h3 class="progress-title">
          安全问题
        </h3>
        <ul>
          <li>
            <h6>质量问题</h6>
            <div class="value">{{ info.qualityProblem || '无' }}</div>
          </li>
          <li>
            <h6>处理时间</h6>
            <div class="value">{{ info.qualityHandleDate || '无' }}</div>
          </li>
          <li>
            <h6>处理意见</h6>
            <div class="value">{{ info.qualityHandleOption || '无' }}</div>
          </li>
          <li>
            <h6>处理过程</h6>
            <div class="value">{{ info.qualityHandleProcess || '无' }}</div>
          </li>
          <li>
            <h6>处理人</h6>
            <div class="value">{{ info.qualityHandlePersonName || '无' }}</div>
          </li>
          <li>
            <h6>处理结果</h6>
            <div class="value">
              <!--                {{ ['未处理', '已处理'][info.qualityHandleResult] || '无'}}-->
              <uni-status :options="safeStatus" :value="info.qualityHandleResult"></uni-status>
            </div>
          </li>
          <!--            <li>-->
          <!--              <h6>物资设备进退情况</h6>-->
          <!--              <div class="value">{{ info.equipmentEnterExit }}</div>-->
          <!--            </li>-->
          <!--            <li>-->
          <!--              <h6>进度情况</h6>-->
          <!--              <div class="value">{{ info.constructionProgress }}</div>-->
          <!--            </li>-->
        </ul>
      </div>
      <div class="card attachment">
        <ul>
          <li>
            <span class="label">抄送</span><span class="value">{{ info.copyToPersonName }}</span>
          </li>
          <li>
            <span class="label" style="width:100px">备注</span><span class="value">{{ info.remark }}</span>
          </li>
          <li style="align-items: start;display: flex;">
            <span class="label" style="width:100px">附件</span
            ><span class="value"> <uni-attachment v-model="info.fileIds"></uni-attachment></span>
          </li>
        </ul>
      </div>
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
      let result = await this.fly.log.get(`/decorate/diary/get//${this.id}`)
      if (result.code === 200) {
        this.info = result.data || {}
      }
    }
  }
}
</script>

<style lang="less">
@import url('./detail.less');
.value('无') {
  color: red;
}
</style>
