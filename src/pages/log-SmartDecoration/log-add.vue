<template>
  <view class="main">
    <view class="main-body">
      <div v-if="saveTime" class="save-time">实时保存{{ saveTime }}</div>
      <uni-card isForm>
        <uni-form-item label="工程名称" isRequired>
          <textarea v-model.trim="form.name" auto-height placeholder="请输入" name="name" />
        </uni-form-item>
        <uni-form-item label="施工人员" isLink isRequired>
          <uni-select-user
            v-model="form.constructionPersonIds"
            :name.sync="form.constructionPersonNames"
            multiple
            @input="handleUserSelected"
          />
        </uni-form-item>
        <uni-form-item label="施工人数" isRequired>
          <input v-model.number="form.constructionPersonCount" readonly placeholder="请输入" />
        </uni-form-item>
        <uni-form-item label="项目负责人" isLink isRequired>
          <uni-select-user v-model="form.chargePersonId" :name.sync="form.chargePersonName" />
        </uni-form-item>
        <uni-form-item label="记录人员" isRequired>
          <input v-model.trim="form.recordUserName" readonly placeholder="请输入" name="recordUserName" />
        </uni-form-item>
        <uni-form-item label="编制日期" isLink isRequired>
          <uni-date-picker
            v-model="form.diaryDate"
            fields="day"
            mode="date"
            @input="handleTimeChange"
          ></uni-date-picker>
        </uni-form-item>
      </uni-card>

      <!-- 今日天气信息 -->
      <view>
        <view class="card-header">天气</view>
        <uni-card isForm>
          <uni-form-item label="今日天气" isRequired>
            <input v-model.trim="form.todayWeather" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="上午温度(℃)">
            <input v-model.number="form.morningWeather" placeholder="请输入温度" />
          </uni-form-item>
          <uni-form-item label="午间温度(℃)">
            <input v-model.number="form.noonWeather" placeholder="请输入温度" />
          </uni-form-item>
          <uni-form-item label="下午温度(℃)">
            <input v-model.number="form.afternoonWeather" placeholder="请输入温度" />
          </uni-form-item>
        </uni-card>
      </view>
      <!-- 进度状况 -->
      <view>
        <view class="card-header">进度</view>
        <uni-card isForm>
          <uni-form-item label="施工过程" align="left" class="block-item">
            <textarea v-model.trim="form.constructionProcess" :maxlength="-1" placeholder="请填写内容" auto-height />
          </uni-form-item>
          <uni-form-item label="施工进度" align="left" class="block-item">
            <textarea v-model.trim="form.constructionProgress" :maxlength="-1" placeholder="请填写内容" auto-height />
          </uni-form-item>
          <uni-form-item label="验收记录" align="left" class="block-item">
            <textarea v-model.trim="form.acceptanceRecord" :maxlength="-1" placeholder="请填写内容" auto-height />
          </uni-form-item>
          <uni-form-item label="变更记录" align="left" class="block-item">
            <textarea v-model.trim="form.changeRecord" :maxlength="-1" placeholder="请填写内容" auto-height />
          </uni-form-item>
          <uni-form-item label="签证记录" align="left" class="block-item">
            <textarea v-model.trim="form.visaRecord" :maxlength="-1" placeholder="请填写内容" auto-height />
          </uni-form-item>
          <uni-form-item label="待办事宜" align="left" class="block-item">
            <textarea v-model.trim="form.waitThing" :maxlength="-1" placeholder="请填写内容" auto-height />
          </uni-form-item>
        </uni-card>
        <view class="card-header">安全问题</view>
        <uni-card isForm>
          <uni-form-item label="安全问题" align="left" class="block-item">
            <textarea v-model.trim="form.safetyProblem" :maxlength="-1" placeholder="请填写内容" auto-height />
          </uni-form-item>
          <uni-form-item label="处理时间" isLink>
            <uni-date-picker v-model="form.safetyHandleDate" fields="minute" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="处理意见" align="left" class="block-item">
            <textarea v-model.trim="form.safetyHandleOption" :maxlength="-1" placeholder="请填写内容" auto-height />
          </uni-form-item>
          <uni-form-item label="处理过程" align="left" class="block-item">
            <textarea v-model.trim="form.safetyHandleProcess" :maxlength="-1" placeholder="请填写内容" auto-height />
          </uni-form-item>
          <uni-form-item label="处理人" align="left" class="block-item">
            <textarea v-model.trim="form.safetyHandlePersonName" :maxlength="-1" placeholder="请填写内容" auto-height />
          </uni-form-item>
          <uni-form-item label="处理结果" isLink>
            <uni-select v-model="form.safetyHandleResult" :options="safeStatus"></uni-select>
          </uni-form-item>
        </uni-card>
        <view class="card-header">质量问题</view>
        <uni-card isForm>
          <uni-form-item label="质量问题" align="left" class="block-item">
            <textarea v-model.trim="form.qualityProblem" :maxlength="-1" placeholder="请填写内容" auto-height />
          </uni-form-item>
          <uni-form-item label="处理时间" isLink>
            <uni-date-picker v-model="form.qualityHandleDate" fields="minute" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="处理意见" align="left" class="block-item">
            <textarea v-model.trim="form.qualityHandleOption" :maxlength="-1" placeholder="请填写内容" auto-height />
          </uni-form-item>
          <uni-form-item label="处理过程" align="left" class="block-item">
            <textarea v-model.trim="form.qualityHandleProcess" :maxlength="-1" placeholder="请填写内容" auto-height />
          </uni-form-item>
          <uni-form-item label="处理人" align="left" class="block-item">
            <textarea
              v-model.trim="form.qualityHandlePersonName"
              :maxlength="-1"
              placeholder="请填写内容"
              auto-height
            />
          </uni-form-item>
          <uni-form-item label="处理结果" isLink>
            <uni-select v-model="form.qualityHandleResult" :options="safeStatus"></uni-select>
          </uni-form-item>

          <!--            <uni-form-item label="物资设备进退场情况" align="left" class="block-item" isRequired>-->
          <!--              <textarea v-model.trim="form.equipmentEnterExit" :maxlength="-1" placeholder="请填写内容" auto-height />-->
          <!--            </uni-form-item>-->
          <!--            <uni-form-item label="进度情况" align="left" class="block-item" isRequired>-->
          <!--              <textarea v-model.trim="form.constructionProgress" :maxlength="-1" placeholder="请填写内容" auto-height />-->
          <!--            </uni-form-item>-->
        </uni-card>
      </view>
      <!-- 附件上传 -->
      <view>
        <view class="card-header">其他</view>
        <uni-card isForm>
          <uni-form-item label="抄送" isLink isRequired>
            <uni-select-user v-model="form.copyToPersonId" :name.sync="form.copyToPersonName" multiple />
          </uni-form-item>
          <uni-form-item label="备注" type="textarea" align="left" class="block-item">
            <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
          </uni-form-item>
          <uni-form-item class="file-item" label="上传附件">
            <uni-attachment v-model="form.fileIds" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
      </view>
    </view>
    <view class="btn-wrapper">
      <button class="button" type="primary" :loading="isLoading" @click="handleLogSubmit">保存</button>
    </view>
  </view>
</template>

<script>
var graceChecker = require('../../utils/graceChecker.js')
import { mapGetters } from 'vuex'
import safeStatus from './lib/safeStatus'
export default {
  data() {
    return {
      form: {
        todayWeather: '',
        code: '',
        afternoonWeather: null,
        morningWeather: null,
        noonWeather: null,
        recordUserName: '',
        recordUserId: '',
        remark: '',
        fileIds: '',
        name: '',
        equipmentEnterExit: '',
        id: null,
        projectId: '',
        constructionPersonIds: '',
        constructionPersonNames: '',
        copyToPersonId: '',
        copyToPersonName: '',
        chargePersonId: '',
        chargePersonName: '',
        constructionPersonCount: null,
        constructionProgress: '',
        status: 0
      },
      rules: [
        {
          name: 'name',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入工程名称'
        },
        {
          name: 'constructionPersonIds',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择施工人员'
        },
        {
          name: 'chargePersonId',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择项目负责人'
        },
        {
          name: 'recordUserName',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入记录人员'
        },
        {
          name: 'diaryDate',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入编制日期'
        },
        {
          name: 'todayWeather',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入今日天气'
        },
        // {
        //   name: 'costructionContent',
        //   checkType: 'notnull',
        //   checkRule: '',
        //   errorMsg: '请输入施工工程及内容'
        // },
        // {
        //   name: 'qualityProblem',
        //   checkType: 'notnull',
        //   checkRule: '',
        //   errorMsg: '请输入质量情况'
        // },
        // {
        //   name: 'safetyProblem',
        //   checkType: 'notnull',
        //   checkRule: '',
        //   errorMsg: '请输入安全情况'
        // },
        // {
        //   name: 'equipmentEnterExit',
        //   checkType: 'notnull',
        //   checkRule: '',
        //   errorMsg: '请输入物资设备进退场情况'
        // },
        // {
        //   name: 'constructionProgress',
        //   checkType: 'notnull',
        //   checkRule: '',
        //   errorMsg: '请输入进度情况'
        // },
        {
          name: 'copyToPersonId',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择抄送人'
        }
      ],
      isLoading: false,
      safeStatus
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
      return this.$store.state.addCache.addLogCache
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
  mounted() {
    this.form.projectId = this.projectId
    this.init()
  },
  methods: {
    // 初始化
    init() {
      Object.assign(this.form, {
        recordUserName: this.userName,
        recordUserId: this.userId,
        todayWeather: this.weatherInfo.weather,
        morningWeather: this.weatherInfo.temperature,
        noonWeather: this.weatherInfo.temperature,
        afternoonWeather: this.weatherInfo.temperature
      })
      this.autoSave()
    },
    // 自动缓存
    autoSave() {
      if (this.formDataTemp) {
        Object.assign(this.form, this.formDataTemp)
      }
      this.$store.commit('setAddLogCache', this.form)
    },
    // 清除缓存
    clearCache() {
      this.$store.commit('clearCompanyTemp', 'addLogCache')
    },
    //选中施工人员，计算施工人数
    handleUserSelected(ids) {
      this.form.constructionPersonCount = ids ? ids.split(',').length : null
    },
    //选中编制日期
    handleTimeChange(data) {
      this.form.diaryDate = `${data} 00:00:00`
    },
    handleFormValid() {
      // 表单验证,施工人数验证是不是整数，项目Id及其他必选参数
      let isValid = true
      if (!this.form.projectId.trim()) {
        this.$utils.showToast('您还没有选择了项目')
        return false
      }
      let checkRes = graceChecker.check(this.form, this.rules)
      if (!checkRes) {
        this.$utils.showToast(graceChecker.error)
        return false
      }
      return isValid
    },
    // 添加数据
    handleLogSubmit() {
      // 验证通过，开始提交表单
      let valid = this.handleFormValid()
      if (!valid) return
      this.isLoading = true
      this.fly.log
        .post(`dailydiary/add`, this.form)
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
