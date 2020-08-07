<template>
  <view class="main">
    <view class="main-body">
      <div v-if="saveTime" class="save-time">实时保存{{ saveTime }}</div>
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="记录人员" isRequired>
            <input v-model.trim="form.recordUserName" readonly placeholder="请输入" name="recordUserName" disabled />
          </uni-form-item>
          <uni-form-item label="编制日期" isRequired>
            <!-- <uni-date-picker v-model="form.diaryDate" fields="day" mode="date"></uni-date-picker> -->
            {{ form.diaryDate | formatData }}
          </uni-form-item>
          <uni-form-item label="施工人员" isLink isRequired>
            <uni-select-worker-type
              v-model="form.constructionPersonNames"
              :ids.sync="form.constructionPersonIds"
              @change="handleSelectSuccess"
            ></uni-select-worker-type>
          </uni-form-item>
          <!-- 施工人员的工种信息 start -->
          <block v-if="form.workerList.length">
            <uni-form-item
              v-for="item in form.workerList"
              :key="item.workType"
              :label="$getLabelFromArg('workType', item.workType)"
              align="left"
            >
              <view class="placeholder">{{ item.children.length }}人</view>
            </uni-form-item>
          </block>

          <!-- 施工人员的工种信息 end -->
        </uni-card>

        <!-- 今日天气信息start -->
        <view>
          <view class="card-header">天气</view>
          <uni-card isForm>
            <uni-form-item label="今日天气" isRequired>
              <input v-model.trim="form.todayWeather" placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="温度(℃)">
              <!--              <span>{{ form.lowTemperature }}~{{ form.highTemperature }}</span>-->
              <view style="display: flex;justify-content: flex-end;margin-right: -13px;">
                <input v-model.number="form.lowTemperature" style="width: 25px" />
                ~
                <input v-model.number="form.highTemperature" style="width: 25px;text-align: left;" />
              </view>
            </uni-form-item>
            <!--            <uni-form-item label="午间温度(℃)">-->
            <!--              <input v-model.number="form.noonWeather" placeholder="请输入温度" />-->
            <!--            </uni-form-item>-->
            <!--            <uni-form-item label="下午温度(℃)">-->
            <!--              <input v-model.number="form.afternoonWeather" placeholder="请输入温度" />-->
            <!--            </uni-form-item>-->
          </uni-card>
        </view>
        <!-- 今日天气信息end -->
        <!--  -->
        <!-- 进度状况 start-->
        <view>
          <view class="card-header">进度</view>
          <uni-card isForm>
            <uni-form-item label="今日早会内容" align="left" isRequired class="block-item" prop="morningMeetingContent">
              <textarea
                v-model.trim="form.morningMeetingContent"
                :maxlength="-1"
                placeholder="请填写早会内容"
                auto-height
              />
            </uni-form-item>
            <uni-form-item label="今日晚会内容" align="left" isRequired class="block-item" prop="eveningMeetingContent">
              <textarea
                v-model.trim="form.eveningMeetingContent"
                :maxlength="-1"
                placeholder="请填写晚会内容"
                auto-height
              />
            </uni-form-item>
            <uni-form-item
              label="今日早场巡查情况"
              align="left"
              isRequired
              class="block-item"
              prop="morningShowCondition"
            >
              <textarea
                v-model.trim="form.morningShowCondition"
                :maxlength="-1"
                placeholder="请填写今日早场巡查情况"
                auto-height
              />
            </uni-form-item>
            <uni-form-item
              label="今日晚场巡查情况"
              align="left"
              isRequired
              class="block-item"
              prop="eveningShowCondition"
            >
              <textarea
                v-model.trim="form.eveningShowCondition"
                :maxlength="-1"
                placeholder="请填写今日晚场巡查情况"
                auto-height
              />
            </uni-form-item>
            <uni-form-item label="今日施工完成进度">
              <!--              <textarea-->
              <!--                v-model="form.floorScheduleNames"-->
              <!--                :ids="form.floorScheduleIds"-->
              <!--                auto-height-->
              <!--                disabled-->
              <!--                placeholder="请选择"-->
              <!--                @click="handleOpenDrawer"-->
              <!--              />-->
              <textarea
                v-model.trim="form.floorScheduleNames"
                :maxlength="-1"
                placeholder="请输入施工完成进度"
                auto-height
              />
            </uni-form-item>

            <uni-form-item label="发现问题">
              <textarea v-model.trim="form.findProblem" :maxlength="-1" placeholder="请填写内容" auto-height />
            </uni-form-item>
            <uni-form-item label="解决方案">
              <textarea v-model.trim="form.solution" :maxlength="-1" placeholder="请填写内容" auto-height />
            </uni-form-item>
            <uni-form-item label="解决时间">
              <uni-date-picker
                v-model="form.solveTime"
                fields="minute"
                mode="date"
                placeholder="请选择解决时间"
              ></uni-date-picker>
            </uni-form-item>
          </uni-card>
        </view>
        <!-- 附件上传 -->
        <view>
          <view class="card-header">其他</view>
          <uni-card isForm>
            <uni-form-item label="抄送" isLink isRequired prop="copyToPersonIds">
              <uni-select-user v-model="form.copyToPersonIds" :name.sync="form.copyToPersonNames" multiple />
            </uni-form-item>
            <uni-form-item label="备注" type="textarea" align="left" class="block-item">
              <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
            </uni-form-item>
            <uni-form-item class="file-item" label="上传附件">
              <uni-attachment v-model="form.fileIds" edit></uni-attachment>
            </uni-form-item>
          </uni-card>
        </view>
      </uni-form-custom>
    </view>
    <view class="btn-wrapper">
      <button class="button" type="primary" :loading="isLoading" @click="handleLogSubmit">保存</button>
    </view>
    <uni-drawer ref="productList" :width="750" mode="right">
      <SelectEntity
        :uUid="uUid"
        :floorId.sync="form.floorId"
        :floorScheduleIds.sync="form.floorScheduleIds"
        :floorScheduleNames.sync="form.floorScheduleNames"
        @selected="handleSelectedProcedure"
      />
    </uni-drawer>
  </view>
</template>

<script>
import moment from 'moment'
var graceChecker = require('../../utils/graceChecker.js')
import { mapGetters } from 'vuex'
import SelectEntity from './components/SelectEntity'
export default {
  components: {
    SelectEntity
  },
  data() {
    return {
      form: {
        type: 2,
        constructionPersonIds: '',
        constructionPersonNames: '',
        projectId: '',
        personAddList: [], //施工人员信息列表---要提交的数据
        workerList: [], //施工人员的工种分组信息
        floorScheduleNames: '',
        floorScheduleIds: ''
      },
      rules: {
        copyToPersonIds: [
          {
            required: true
          }
        ],
        morningMeetingContent: [
          {
            required: true
          }
        ],
        eveningMeetingContent: [
          {
            required: true
          }
        ],
        morningShowCondition: [
          {
            required: true
          }
        ],
        eveningShowCondition: [
          {
            required: true
          }
        ],
        floorScheduleIds: [
          {
            required: true
          }
        ]
      },
      isLoading: false,
      uUid: this.$utils.getUuid() || '' // 接收选择的构件或其他服务使用
    }
  },
  computed: {
    ...mapGetters(['projectId', 'userName', 'userId']),
    // 天气信息
    weatherInfo() {
      return this.$store.state.project.weatherInfo
    },
    // 表单缓存
    formDataTemp() {
      return this.$store.state.addCache.addManagerLogCache
    },
    // 上次保存时间
    saveTime() {
      return this.$store.state.addCache.saveTime
    }
  },
  beforeDestroy() {
    // 关闭自动缓存定时器
    this.$store.commit('closeCacheTimer')
  },
  onLoad() {
    this.form.projectId = this.projectId
    this.init()
  },
  methods: {
    // 显示工序选择模态框
    handleOpenDrawer() {
      this.$refs.productList.open()
    },
    // 选择工序完成
    handleSelectedProcedure(data) {
      // console.log('handleSelectedProcedure', data)
      // this.form.floorScheduleNames = _.map(data, 'fullName').join(',')
      // this.form.floorScheduleIds = _.map(data, 'scheduleId').join(',')
      this.$refs.productList.close()
    },
    // 根据工种选择施工人员完成的回调
    handleSelectSuccess(data) {
      this.form.workerList = [...data]
      this.form.personAddList = _.flattenDeep(_.map(data, 'children'))
    },
    // 初始化
    init() {
      console.log(this.weatherInfo)
      Object.assign(this.form, {
        recordUserName: this.userName,
        recordUserId: this.userId,
        todayWeather: this.weatherInfo.weather,
        highTemperature: this.weatherInfo.highTemperature,
        lowTemperature: this.weatherInfo.lowTemperature
        // morningWeather: this.weatherInfo.temperature,
        // noonWeather: this.weatherInfo.temperature,
        // afternoonWeather: this.weatherInfo.temperature
      })
      this.form.diaryDate = moment().format('YYYY-MM-DD HH:mm:ss')
      // console.log('init end manager')
      this.autoSave()
    },
    // 自动缓存
    autoSave() {
      if (this.formDataTemp) {
        Object.assign(this.form, this.formDataTemp)
      }
      this.$store.commit('setAddManagerLogCache', this.form)
    },
    // 清除缓存
    clearCache() {
      this.$store.commit('clearCompanyTemp', 'addManagerLogCache')
    },

    // 添加数据
    async handleLogSubmit() {
      console.log('submit', this.form)
      if (!this.form.personAddList.length) {
        this.$utils.showToast('请选择施工人员')
        return false
      }
      await this.$refs.form.validate()
      this.isLoading = true
      this.fly.log
        .post(`/decorate/diary/add`, this.form)
        .then(result => {
          if (result.code === 200) {
            this.$utils.showToast('操作成功')
            this.clearCache()
            setTimeout(() => {
              this.$utils.goBack()
            }, 1000)
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./log-add.less');
</style>
