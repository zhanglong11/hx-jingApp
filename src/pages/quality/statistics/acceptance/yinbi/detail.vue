<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div>
        <uni-card>
          <uni-form-item label="验收名称" isRequired>
            <div>{{ info.acceptanceName }}{{ info.acceptanceApplyNumber }}</div>
          </uni-form-item>
          <uni-form-item label="验收类型" align="left" :disabled="true">
            <div>{{ type }}</div>
          </uni-form-item>
          <uni-form-item label="隐蔽项目" :border="false" align="left" :disabled="true">
            <div>{{ info.hideProject }}</div>
          </uni-form-item>
          <uni-form-item label="隐蔽部位" :border="false" align="left" :disabled="true">
            <div>{{ info.hidePart }}</div>
          </uni-form-item>
          <uni-form-item label="隐蔽内容" :border="false" align="left" :disabled="true">
            <div>{{ info.hideContent }}</div>
          </uni-form-item>
        </uni-card>

        <uni-card>
          <uni-form-item label="验收结果" align="left" :disabled="true">
            {{ $getLabel(resultList, info.hideResult) }}
          </uni-form-item>
          <uni-form-item label="验收日期" :border="false" align="left" :disabled="true">
            <div>{{ info.acceptanceDate }}</div>
          </uni-form-item>
          <uni-form-item label="验收人" :border="false" align="left" :disabled="true">
            <div>{{ info.acceptanceManName }}</div>
          </uni-form-item>
          <uni-form-item label="备注" :border="false" align="left" :disabled="true">
            <div>{{ info.remark }}</div>
          </uni-form-item>
          <uni-form-item label="附件" :border="false" align="left" :disabled="true">
            <uni-attachment :value="info.fileIds" />
          </uni-form-item>
        </uni-card>
        <template v-if="$hasPower('QualityAcceptanceDetailCommentDetail')">
          <uni-comment
            :id="id"
            ref="comment"
            :canDelete="$hasPower('QualityAcceptanceDetailCommentDelete')"
            type="QualityAcceptanceRecord"
            @success="refresh"
          />
        </template>
        <div style="height:14px" />
      </div>
    </scroll-view>
  </div>
</template>

<script>
import Api from '@/api/quality/accept'
import acceptType from '../acceptType'
import { get, find } from 'lodash'
export default {
  name: 'Edit',
  data() {
    return {
      info: {
        targetList: []
      },
      resultList: [
        { label: '通过', value: 1 },
        { label: '没通过', value: 0 }
      ],
      id: null
    }
  },
  onLoad(options) {
    this.id = options.id
  },
  computed: {
    type() {
      return get(find(acceptType, { value: this.info.acceptanceType }), 'name')
    }
  },
  onNavigationBarButtonTap(obj) {
    this.$refs.comment.showAdd()
  },
  created() {
    // #ifdef  APP-PLUS
    if (!this.$hasPower('QualityAcceptanceDetailCommentAdd')) {
      let webView = this.$mp.page.$getAppWebview()
      webView.setTitleNViewButtonStyle(0, {
        text: '',
        fontSize: 0
      })
    }
    // #endif
    this.refresh()
  },
  methods: {
    async refresh() {
      const res = await Api.getAcceptanceDetail(this.id)
      this.info = res.data
    },
    getResult(value) {
      return get(find(this.resultList, { value }), 'name')
    }
  }
}
</script>

<style scoped lang="less">
@import url('../danwei/detail.less');
</style>
