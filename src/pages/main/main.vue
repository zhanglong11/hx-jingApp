<template>
  <view class="content main">
    <div class="bg">
      <div class="blue">
        <div class="projectWrap">
          <div
            v-if="token"
            class="select-project"
            @click="$utils.toUrl(`/pages/select-project/select-project?projectId=${projectId}`)"
          >
            <b>{{ projectName }}</b
            ><i></i>
          </div>
          <div v-else style="flex: 1;overflow: hidden"></div>
        </div>
      </div>
      <div class="gray"></div>
    </div>
    <div class="weather-con">
      <div class="weather card">
        <image src="@/static/images/main/weather.png" alt="" />
        <div>
          <header>
            <div class="value">{{ weatherInfo.temperature | formatStr }}°C</div>
            <div class="date">{{ weatherInfo.temperatureTime | formatData }}</div>
          </header>
          <footer>
            <div class="info">
              {{ weatherInfo.weather | formatStr }} {{ weatherInfo.windDirection | formatStr }}
              {{ weatherInfo.windPower | formatStr }}
            </div>
            <div class="location">
              <uni-icons type="location" size="16" color="#666"></uni-icons>{{ weatherInfo.city | formatStr }}
            </div>
          </footer>
        </div>
      </div>
    </div>
    <scroll-view class="scroll-roll" scroll-y>
      <div
        class="main-body"
        :class="{
          'empty-wrapper': list.length === 0
        }"
      >
        <ul class="module-list card">
          <!-- 精装修 start -->
          <template v-if="$appType === 1">
            <li v-if="$hasPower('DecorationProgressSmartDecoration')" @click="$utils.toUrl('/pages/task/progress')">
              <image src="@/static/images/main/work-process.png" />
              <p>工序管理</p>
            </li>
            <li
              v-if="$hasPower('ConstructionLogSmartDecoration')"
              @click="$utils.toUrl('/pages/log-SmartDecoration/log')"
            >
              <image src="@/static/images/main/log.png" />
              <p>施工日志</p>
            </li>
            <li @click="toBim()">
              <image src="@/static/images/main/BIM.png" />
              <p>BIM模型</p>
            </li>
            <!-- <li @click="$utils.toUrl('/pages/bim-model/select-model-room')">
              <image src="@/static/images/main/room-demo.png" />
              <p>样板间预览</p>
            </li> -->
            <li v-if="$hasPower('ContractSmartDecoration')" @click="$utils.toUrl('/pages/contract/index')">
              <image src="@/static/images/main/contract.png" />
              <p>合同管理</p>
            </li>
            <li v-if="$hasPower('Quality')" @click="$utils.toUrl('/pages/application/application-quality')">
              <image src="@/static/images/main/quality.png" />
              <p>质量管理</p>
            </li>
            <li v-if="$hasPower('Safe')" @click="$utils.toUrl('/pages/application/application-safe')">
              <image src="@/static/images/main/secure.png" />
              <p>安全管理</p>
            </li>
            <li
              v-if="$hasPower('SuppliesSmartDecoration')"
              @click="$utils.toUrl('/pages/application/application-material?type=1')"
            >
              <image src="@/static/images/main/material.png" />
              <p>材料管理</p>
            </li>
            <li v-if="$hasPower('DataManage')" @click="$utils.toUrl('/pages/document/index')">
              <!--            <li @click="$utils.toUrl('/pages/document/index')">-->
              <image src="@/static/images/main/doc.png" />
              <p>文档管理</p>
            </li>
          </template>
          <!-- 精装修 end -->
          <!-- 开发商 start -->
          <template v-if="$appType === 2">
            <li @click="$utils.toUrl('/pages/task/progress')">
              <image src="@/static/images/main/work-process.png" />
              <p>工序管理</p>
            </li>
            <li @click="toBim()">
              <image src="@/static/images/main/BIM.png" />
              <p>BIM模型</p>
            </li>
            <li @click="$utils.toUrl('/pages/inspect/index')">
              <image src="@/static/images/main/quality.png" />
              <p>质量检查</p>
            </li>
            <li @click="$utils.toUrl('/pages/safe/index')">
              <image src="@/static/images/main/secure.png" />
              <p>安全管理</p>
            </li>
            <li v-if="$hasPower('ContractDetail') || !token" @click="$utils.toUrl('/pages/agreement/index')">
              <image src="@/static/images/main/contract.png" />
              <p>合同管理</p>
            </li>
            <li
              v-if="$hasPower('MaterialPlanListView') || !token"
              @click="$utils.toUrl('/pages/material/planList/index')"
            >
              <image src="@/static/images/main/substance.png" />
              <p>甲供材计划单</p>
            </li>
            <li
              v-if="$hasPower('procurementPartyDetail') || $hasPower('procurementSupplierDetail') || !token"
              @click="procurementNotice()"
            >
              <image src="@/static/images/main/doc.png" />
              <p>采购通知</p>
            </li>
            <li
              v-if="$hasPower('MaterialConfirmCodeDetail') || !token"
              @click="$utils.toUrl('/pages/material/confirmation/index')"
            >
              <image src="@/static/images/main/material.png" />
              <p>材料确认单</p>
            </li>
          </template>
          <!-- 开发商 end -->
          <!-- 施工 start -->
          <template v-if="$appType === 3">
            <li @click="$utils.toUrl('/pages/labour/labour-list')">
              <image src="@/static/images/main/laowu.png" />
              <p>劳务管理</p>
            </li>
            <li @click="$utils.toUrl('/pages/log/log')">
              <image src="@/static/images/main/log2.png" />
              <p>施工日志</p>
            </li>
            <li @click="toBim()">
              <image src="@/static/images/main/BIM.png" />
              <p>BIM模型</p>
            </li>
            <li @click="$utils.toUrl('/pages/application/application-schedule')">
              <image src="@/static/images/main/jindu.png" />
              <p>进度管理</p>
            </li>
            <li @click="$utils.toUrl('/pages/application/application-quality')">
              <image src="@/static/images/main/quality.png" />
              <p>质量管理</p>
            </li>
            <li @click="$utils.toUrl('/pages/application/application-safe')">
              <image src="@/static/images/main/secure.png" />
              <p>安全管理</p>
            </li>
            <li @click="$utils.toUrl('/pages/application/application-material?type=0')">
              <image src="@/static/images/main/substance.png" />
              <p>物资设备</p>
            </li>
            <li @click="$utils.toUrl('/pages/document/index')">
              <image src="@/static/images/main/doc.png" />
              <p>文档管理</p>
            </li>
          </template>
          <!-- 施工 end -->
        </ul>
        <ul v-if="list.length > 0" class="log-list">
          <li v-for="(e, i) in list" :key="i" class="card" :class="{ unread: e.readFlag === 2 }" @click="toDetails(e)">
            <p>
              <span>{{ e.content }}</span>
            </p>
            <p>
              <span class="time">{{ e.createTime | date }}</span>
            </p>
          </li>
        </ul>
        <!-- 无数据空载页 start -->
        <EmptyTemplate v-if="list.length === 0" />

        <!-- 无数据空载页 end -->
      </div>
    </scroll-view>
  </view>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { workFlowApi } from '@/api/work-flow'
import qualityType from '@/pages/user/setting-items/lib/qualityType'
export default {
  filters: {
    date(val) {
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  data() {
    return {
      list: [],
      qualityType,
      date: moment().format('YYYY-MM-DD')
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    },
    projectName() {
      return this.$store.state.project.projectName
    },
    project() {
      return uni.getStorageSync('project')
    },
    token() {
      return this.$store.state.user.token
    },
    weatherInfo() {
      return this.$store.state.project.weatherInfo
    },
    userId() {
      return this.$store.state.user.userId
    },
    // 待办跳转定义
    taskTodoPower() {
      return this.$store.state.userPower.taskTodoPower
    }
  },
  onLoad() {
    this.getUserList()
  },
  onShow() {
    this.init()
    // console.log(this.$store)
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.getWeather()
      this.getMessage()
    },
    // 获取项目用户数据
    getUserList() {
      if (!this.token || !this.projectId) {
        return
      }
      this.$store.dispatch('getUserList', this.projectId)
      this.$store.dispatch('getDepartmentList')
    },
    // 获取天气
    getWeather() {
      if (!this.token) {
        return
      }
      this.fly.system.post('weather/info', { lng: this.project.longitude, lat: this.project.latitude }).then(res => {
        let datas = res.data || {}
        this.$store.commit('setWeatherInfo', datas)
      })
    },
    // 获取日志
    getMessage() {
      if (!this.token) {
        this.list = []
        uni.stopPullDownRefresh()
        return
      }

      if (this.$appType !== 2) {
        this.queryMessageList()
      } else {
        this.getTaskTodo()
      }
    },
    // 获取我的待办
    async getTaskTodo() {
      let params = {
        sortField: 'createTime',
        sortValue: 'desc',
        taskStatus: 0,
        projectId: this.projectId || '',
        page: 1,
        rows: 10
      }
      let result = await workFlowApi.queryTaskList(params)
      let datas = result.data
      let list = datas.records || []
      list.map(item => {
        item.content = item.taskName
      })
      this.list = list
    },
    // 获取日志列表
    queryMessageList() {
      this.fly.system
        .post('common/message/list', { category: 'CONSTRCTION_MANAGE', projectId: this.projectId }, { isLoading: true })
        .then(res => {
          this.list = res.data.records || []
        })
        .catch(err => {
          this.list = []
        })
    },
    // 跳转详情
    toDetails(item) {
      if (item.redirectUrl === '/quality/statistics/details') {
        this.fly.safety
          .post(`/quality/acceptanceApply/page`, { projectId: uni.getStorageSync('projectId') })
          .then(res => {
            let currentData = _.find(res.data.records, item => item.id === item.extension)
            let currentUrl = this.qualityType[currentData.acceptanceType - 1].url
            this.$utils.toUrl(`/pages/quality/statistics/acceptance/${currentUrl}/detail?id=${item.extension}`)
          })
      }
      this.$utils.toUrl(`${item.redirectUrl}?id=${item.extension}`)
      // if (this.$appType === 1) {
      //   this.$utils.toUrl(`/pages/log/detail?id=${e.sourceId}&messageId=${e.messageId}`)
      // } else {
      //   let url = `${this.taskTodoPower[e.processDefinitionCategory]}?id=${e.targetId}`
      //   if (!url) {
      //     this.$utils.showToast('功能开发中，敬请期待!')
      //     return
      //   }
      //   this.$utils.toUrl(url)
      // }
    },
    // 采购通知
    procurementNotice() {
      let url = this.$hasPower('procurementPartyDetail')
        ? '/pages/material/procurementParty/index'
        : '/pages/material/procurementSupplier/index'
      this.$utils.toUrl(url)
    },
    // 跳转bim模型
    toBim() {
      this.$utils.toUrl(`/pages/bim-model/index?id=&projectId=${this.projectId}&showBtn=true&bimType=1`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./main.less');
</style>
