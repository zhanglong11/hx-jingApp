<template>
  <div class="main">
    <div class="main-header">
      <uni-steps :options="timelineList" :active="activeIndex"></uni-steps>
    </div>
    <uni-form-custom ref="issuedForm" :model="issuedForm" :rules="rules" style="margin-top: 15px;" align="left">
      <uni-card v-if="[2, 6].includes(form.rectifyStatus) && form.userType === 1">
        <uni-form-item label="整改要求" prop="rectifyContent">
          <textarea v-model="issuedForm.rectifyContent" placeholder="请输入" auto-height />
        </uni-form-item>
        <uni-form-item label="整改期限" isLink prop="rectifyDeadline">
          <uni-date-picker
            v-model="issuedForm.rectifyDeadline"
            value-format="YYYY-MM-DD HH:mm:ss"
            mode="date"
            fields="day"
          />
        </uni-form-item>
        <view class="btn-wrapper">
          <button class="button" type="primary" @click="submit(1)">整改下达</button>
        </view>
      </uni-card>
    </uni-form-custom>
    <uni-form-custom ref="rectifyForm" :model="rectifyForm" :rules="rules" style="margin-top: 15px;" align="left">
      <uni-card v-if="form.rectifyStatus === 3 && form.userType === 2">
        <uni-form-item label="整改人">{{ $store.state.user.userName }}</uni-form-item>
        <uni-form-item label="整改日期" isLink prop="rectifyTime">
          <uni-date-picker
            v-model="rectifyForm.rectifyTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            mode="date"
            fields="day"
          />
        </uni-form-item>
        <uni-form-item label="整改结果" prop="rectifyResult">
          <textarea v-model="rectifyForm.rectifyResult" placeholder="请输入" auto-height />
        </uni-form-item>
        <uni-form-item label="上传附件" prop="rectifyFileId">
          <uni-attachment v-model="rectifyForm.rectifyFileId" edit></uni-attachment>
        </uni-form-item>
        <view class="btn-wrapper">
          <button class="button" type="primary" @click="submit(2)">提交整改</button>
        </view>
      </uni-card>
    </uni-form-custom>
    <uni-form-custom ref="reviewForm" :model="reviewForm" :rules="rules" style="margin-top: 15px;" align="left">
      <uni-card v-if="form.rectifyStatus === 4 && form.userType === 1">
        <uni-form-item label="复查日期" prop="reviewTime">
          <uni-date-picker
            v-model="reviewForm.reviewTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            mode="date"
            fields="day"
          />
        </uni-form-item>
        <uni-form-item label="复查人">{{ $store.state.user.userName }}</uni-form-item>
        <uni-form-item label="复检结果" isLink prop="reviewResult">
          <uni-select
            v-model="reviewForm.reviewResult"
            :options="[
              { label: '合格', value: 1 },
              { label: '不合格', value: 0 }
            ]"
          ></uni-select>
        </uni-form-item>
        <uni-form-item label="复检意见" prop="reviewOpinion">
          <textarea v-model="reviewForm.reviewOpinion" placeholder="请输入" auto-height />
        </uni-form-item>
        <uni-form-item label="上传附件" prop="reviewFileId">
          <uni-attachment v-model="reviewForm.reviewFileId" edit></uni-attachment>
        </uni-form-item>
        <view class="btn-wrapper">
          <button class="button" type="primary" @click="submit(3)">提交</button>
        </view>
      </uni-card>
    </uni-form-custom>
    <uni-card title="检查信息">
      <uni-form-item v-if="form.planNature >= 4" label="检查名称">
        <view>{{ form.planName }}</view>
      </uni-form-item>
      <uni-form-item v-if="form.planNature <= 4" label="检查计划名称">
        <view>{{ form.planName }}</view>
      </uni-form-item>
      <uni-form-item v-if="form.planNature <= 4" label="计划检查日期">
        <view>{{ form.planInspectTime | ymd }}</view>
      </uni-form-item>
      <uni-form-item label="检查性质">
        <view>{{ $getLabel(planNatureList, form.planNature) }}</view>
      </uni-form-item>
      <!-- <uni-form-item label="检查项目">
        <view>{{ form.inspectItem }}</view>
      </uni-form-item>
      <uni-form-item label="检查部位">
        <view>{{ form.inspectArea }}</view>
      </uni-form-item> -->
      <uni-form-item label="检查内容">
        <view>{{ form.inspectContent }}</view>
      </uni-form-item>
      <uni-form-item label="检查数量">
        <view>{{ form.inspectNum }}</view>
      </uni-form-item>
      <uni-form-item label="允许偏差">
        <view>{{ form.allowableDeviation }}</view>
      </uni-form-item>
      <uni-form-item label="检查要求">
        <view>{{ form.inspectRequirements }}</view>
      </uni-form-item>
      <uni-form-item label="受检班组">
        <view>{{ form.beInspectedDeptName }}</view>
      </uni-form-item>
      <uni-form-item label="受检负责人">
        <view>{{ form.beInspectedPrincipalName }}</view>
      </uni-form-item>
      <uni-form-item label="检查部门">
        <view>{{ form.inspectDeptName }}</view>
      </uni-form-item>
      <uni-form-item label="备注">
        <view>{{ form.planRemark }}</view>
      </uni-form-item>
      <uni-form-item class="file-item" label="附件">
        <uni-attachment v-model="form.planFileId"></uni-attachment>
      </uni-form-item>
    </uni-card>

    <uni-card title="检查结果">
      <uni-form-item label="本次检查内容">
        <view>{{ form.inspectContent }}</view>
      </uni-form-item>
      <uni-form-item label="检查结果">
        <view>{{ ['合格', '不合格'][form.inspectStatus - 1] }}</view>
      </uni-form-item>
      <template v-if="form.inspectStatus === 2">
        <!-- <uni-form-item label="不合格位置">
          1号楼，3好，5层 2号楼
        </uni-form-item>
        <uni-form-item label="不合格构件">
          1号楼3层；构件名称 1号楼5曾
          <p class="primary-link">查看模型 >></p>
        </uni-form-item> -->
        <uni-form-item label="问题等级">
          <view>{{ $getLabel(issueLevelList, form.issueLevel) }}</view>
        </uni-form-item>
        <uni-form-item label="紧急程度">
          <view>{{ $getLabel(emergencyLevelList, form.emergencyLevel) }}</view>
        </uni-form-item>
        <uni-form-item label="问题描述">
          <view>{{ form.issueDescription }}</view>
        </uni-form-item>
      </template>
      <uni-form-item label="备注">
        <view>{{ form.taskRemark }}</view>
      </uni-form-item>
      <uni-form-item class="file-item" label="现场照片">
        <uni-attachment v-model="form.taskFileId"></uni-attachment>
      </uni-form-item>
      <uni-form-item v-if="form.planNature" label="检查负责人">
        {{ form.inspectPrincipalName }}
      </uni-form-item>
      <uni-form-item v-if="form.planNature" label="检查执行人">
        {{ form.inspectExecutorName }}
      </uni-form-item>
      <uni-form-item label="检查日期">
        <view>{{ form.actualInspectTime | ymd }}</view>
      </uni-form-item>
    </uni-card>

    <template v-for="item in rectifyReviewDetailList">
      <uni-card :key="item.inspectRectifyId + 'a'" title="整改信息">
        <uni-form-item label="整改结果">
          <view>{{ item.rectifyResult }}</view>
        </uni-form-item>
        <uni-form-item label="附件">
          <uni-attachment v-model="item.rectifyFileId"></uni-attachment>
        </uni-form-item>
        <uni-form-item label="整改人">{{ item.rectifyPrincipalName }}</uni-form-item>
        <uni-form-item label="整改日期">
          <view>{{ item.rectifyTime | ymd }}</view>
        </uni-form-item>
      </uni-card>
      <uni-card :key="item.inspectRectifyId + 'b'" title="复查结果">
        <uni-form-item label="复查日期">
          <view>{{ item.reviewTime | ymd }}</view>
        </uni-form-item>
        <uni-form-item label="复查人">{{ item.reviewPrincipalName }}</uni-form-item>
        <uni-form-item label="复检结果">
          <view>{{ ['不合格', '合格'][item.reviewResult] }}</view>
        </uni-form-item>
        <uni-form-item label="复检意见">
          <view>{{ item.reviewOpinion }}</view>
        </uni-form-item>
        <uni-form-item label="附件">
          <uni-attachment v-model="item.reviewFileId"></uni-attachment>
        </uni-form-item>
      </uni-card>
    </template>
    <!--标注开始-->
    <template v-if="$hasPower('qualityDetailCommentDetail')">
      <uni-comment
        :id="id"
        ref="comment"
        :canDelete="$hasPower('qualityDetailCommentDelete')"
        type="QualityInspectRecord"
        @success="refresh"
      />
    </template>
    <!--标注结束-->
  </div>
</template>

<script>
import rectifyStatusList from './lib/rectifyStatusList'
import emergencyLevelList from './lib/emergencyLevelList'
import issueLevelList from './lib/issueLevelList'
import planNatureList from './lib/planNatureList'
import _ from 'lodash'
export default {
  name: 'Detail',
  data() {
    return {
      form: {},
      timelineList: [],
      rectifyStatusList,
      emergencyLevelList,
      issueLevelList,
      planNatureList,
      activeIndex: null,
      issuedForm: {},
      rectifyForm: {},
      reviewForm: {},
      rectifyReviewDetailList: [],
      currentRectifyIndex: -1, // 控制最下方加载的整改复查信息
      timeLineStatusList: [
        { value: 1, label: '待整改' },
        { value: 2, label: '未复查' },
        { value: 3, label: '复检通过' },
        { value: 4, label: '复检不通过' }
      ],
      rules: {
        rectifyContent: { required: true },
        rectifyDeadline: { required: true },
        rectifyTime: { required: true },
        rectifyResult: { required: true },
        reviewTime: { required: true },
        reviewResult: { required: true }
      }
    }
  },
  onLoad(options) {
    this.id = options.id
  },
  onReachBottom() {
    this.loadMore()
  },
  onNavigationBarButtonTap(obj) {
    this.$refs.comment.showAdd()
  },
  created() {
    // #ifdef  APP-PLUS
    if (!this.$hasPower('qualityDetailCommentAdd')) {
      let webView = this.$mp.page.$getAppWebview()
      webView.setTitleNViewButtonStyle(0, {
        text: '',
        fontSize: 0
      })
    }
    // #endif
    this.refresh()
  },
  mounted() {},
  methods: {
    refresh() {
      this.fly.safety.get('inspect/get/' + this.id).then(res => {
        const defaultTimelineList = [
          { title: res.data.planName },
          { title: '检查未通过', active: true, color: '#25CC70' }
        ]
        const hash = {
          null: {
            1: [{ title: res.data.planName }, { title: '检查通过', active: true, color: '#25CC70' }],
            2: [{ title: res.data.planName }, { title: '检查未通过', active: true, color: '#F95E5A' }]
          },
          1: {
            1: [{ title: res.data.planName }, { title: '检查通过', active: true, color: '#25CC70' }],
            2: [
              { title: res.data.planName },
              { title: '检查未通过', active: true, color: '#F95E5A' },
              { title: '待整改' },
              { title: '整改中' }
            ],
            3: [
              { title: res.data.planName },
              { title: '检查未通过' },
              { title: '整改中', active: true },
              { title: '复查' }
            ],
            4: [
              { title: res.data.planName },
              { title: '检查未通过' },
              { title: '未复查', active: true },
              { title: '复查' }
            ],
            5: [
              { title: res.data.planName },
              { title: '检查未通过' },
              { title: '未复查' },
              { title: '复查通过', active: true }
            ],
            6: [
              { title: res.data.planName },
              { title: '检查未通过' },
              { title: '复查不合格' },
              { title: '待整改', active: true, color: '#F95E5A' }
            ]
          },
          2: {
            1: [{ title: res.data.planName }, { title: '检查通过', active: true, color: '#25CC70' }],
            2: [
              { title: res.data.planName },
              { title: '检查未通过', active: true },
              { title: '待整改' },
              { title: '整改中' }
            ],
            3: [
              { title: res.data.planName },
              { title: '检查未通过' },
              { title: '整改下达', active: true },
              { title: '整改完成' }
            ],
            4: [
              { title: res.data.planName },
              { title: '检查未通过' },
              { title: '整改完成', active: true },
              { title: '复查' }
            ],
            5: [
              { title: res.data.planName },
              { title: '检查未通过' },
              { title: '整改完成' },
              { title: '复查通过', active: true }
            ],
            6: [
              { title: res.data.planName },
              { title: '检查未通过' },
              { title: '复查不合格' },
              { title: '待整改', active: true, color: '#F95E5A' }
            ]
          }
        }
        // 当userType 非检查人，非受检人时，流程图与检查人保持一致
        let userType = res.data.userType === 0 ? 1 : res.data.userType
        let latelyStatus = res.data.inspectStatus === 2 ? res.data.rectifyStatus : res.data.inspectStatus //检查项最新的状态
        this.timelineList = hash[userType][latelyStatus] || defaultTimelineList
        this.activeIndex = _.findIndex(this.timelineList, { active: true })
        this.form = res.data
      })
    },
    async submit(type) {
      const inspectRectifyId = _.last(this.form.historyDtoList)?.rectifyReviewId
      console.log(this.form)
      if (type === 1) {
        await this.$refs.issuedForm.validate()
        await this.fly.safety.post('rectify/release', {
          ..._.pick(this.form, ['inspectPlanId', 'inspectTaskId']),
          ...this.issuedForm
        })
      } else if (type === 2) {
        await this.$refs.rectifyForm.validate()
        await this.fly.safety.post('rectify/submitRectify', {
          inspectRectifyId,
          ...this.rectifyForm
        })
      } else if (type === 3) {
        await this.$refs.reviewForm.validate()
        await this.fly.safety.post('rectify/submitReview', {
          inspectRectifyId,
          ...this.reviewForm
        })
      }
      this.$utils.showToast('提交成功')
      this.$utils.goBack()
    },
    remove() {},
    loadMore() {
      if (this.currentRectifyIndex === this.form.historyDtoList.length - 1) {
        return false
      }
      this.currentRectifyIndex += 1
      const id = this.form.historyDtoList[this.currentRectifyIndex].rectifyReviewId
      this.fly.safety.get('rectify/get/' + id).then(res => {
        this.rectifyReviewDetailList.push(res.data)
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.uni-card {
  width: 700px;
}
.main {
  padding-top: 0;
  padding-bottom: 30px;
  .main-header {
    overflow: hidden;
    border-radius: 30px;
    font-size: 13px;
    display: block;
    background-color: #fff;
    line-height: 48px;
    padding: 25px 0 5px;
  }
}
.btn-wrapper {
  width: 680px;
}
.primary-link {
  text-align: right;
  color: @mainColor;
}
</style>
