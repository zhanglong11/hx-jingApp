<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-card class="card">
          <uni-form-item label="甲供材计划单名称" disabled align="left">
            {{ itemInfo.supplyPlanName }}
          </uni-form-item>
          <uni-form-item v-if="itemInfo.auditStatus" label="">
            <view>
              <span class="circle" :style="{ backgroundColor: procurementStatus[itemInfo.auditStatus].color }"></span
              >{{ procurementStatus[itemInfo.auditStatus].name }}
            </view>
          </uni-form-item>
          <uni-form-item label="甲供材计划单编号" disabled align="left">
            {{ itemInfo.supplyPlanCode }}
          </uni-form-item>
          <uni-form-item label="合同编号" disabled align="left">
            {{ itemInfo.contractCode }}
          </uni-form-item>
          <uni-form-item label="合同名称" disabled align="left">
            {{ itemInfo.contractName }}
          </uni-form-item>
          <uni-form-item label="项目经理" disabled align="left">
            {{ itemInfo.projectManagerName }}
          </uni-form-item>
          <uni-form-item label="收货人" disabled align="left">
            {{ itemInfo.consigneeName }}
          </uni-form-item>
          <uni-form-item label="填报时间" disabled align="left">
            {{ itemInfo.updateTime | formatData }}
          </uni-form-item>
          <uni-form-item label="供应商" disabled align="left">
            {{ itemInfo.secondParty }}
          </uni-form-item>
          <uni-form-item label="供应联系人" disabled align="left">
            {{ itemInfo.secondPartyLinkman }}
          </uni-form-item>
          <uni-form-item label="联系电话" disabled align="left">
            {{ itemInfo.secondPartyMobile }}
          </uni-form-item>
        </uni-card>
        <view v-if="$hasPower('procurementPartyToSupplier') && itemInfo.supplyStatus === 0" class="btn-wrapper">
          <button class="button" type="primary" @click="getNotifySupply()">
            一键通知联系人
          </button>
        </view>
        <uni-card class="card">
          <h4>甲供材计划明细</h4>
          <view class="table-wrapper">
            <scroll-view scroll-x>
              <wTable
                headbBackground="#EEEEEE"
                :columns="columns"
                :data="itemInfo.detailList ? itemInfo.detailList : []"
                border
                @click.native="handlePreviewDetailInfo"
              />
            </scroll-view>
          </view>
        </uni-card>

        <!-- 审批记录 start -->
        <template v-for="(items, i) in approvalRecordList">
          <view v-if="getApprovalTitle(i)" :key="i + '_0'" class="card-title" style="margin: 30rpx;">{{
            getApprovalTitle(i)
          }}</view>
          <uni-card v-if="items.endTime" :key="i" class="card">
            <uni-form-item align="left" label="审核状态" disabled>
              {{ getApprovalFlag(items.taskVariables.flag) }}
            </uni-form-item>
            <uni-form-item align="left" label="审核日期" disabled>
              {{ items.endTime | formatData }}
            </uni-form-item>
            <uni-form-item align="left" label="审核意见" disabled>
              {{ items.taskVariables.remark }}
            </uni-form-item>
            <uni-form-item align="left" :label="getApprovalName(i)" disabled>
              {{ items.taskVariables.taskDelegateName }}
            </uni-form-item>
          </uni-card>
        </template>
        <!-- 审批记录 end -->

        <!-- 通用审批 start -->
        <uni-check-card :id="id" ref="checkCard" />
        <!-- 通用审批 end -->

        <view class="btn-wrapper">
          <button
            v-if="itemInfo.isRevocation === 0 && itemInfo.auditStatus === 1 && userId === itemInfo.creator"
            class="button"
            type="primary"
            @click="handleCancellation"
          >
            作废
          </button>
          <button
            v-if="itemInfo.isRevocation === 1 && userId === itemInfo.creator"
            class="button"
            type="primary"
            @click="handleRevocation"
          >
            撤回
          </button>
          <button
            v-if="$hasPower('MaterialPlanListEdit') && itemInfo.auditStatus === 2 && itemInfo.supplyStatus === 1"
            class="button"
            type="primary"
            @click="finishSupply"
          >
            供货完成
          </button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import UniCard from '@/components/uni-card/uni-card'
import { Api } from '@/api/material'
import { workFlowApi } from '@/api/work-flow'
export default {
  name: 'Detail',
  components: { UniCard },
  data() {
    return {
      id: '',
      procurementStatus: [
        {
          name: '草稿',
          value: '0',
          color: '#666'
        },
        {
          name: '待审核',
          value: '1',
          color: '#999999'
        },
        {
          name: '已通过',
          value: '2',
          color: '#0079fe'
        },
        {
          name: '已驳回',
          value: '3',
          color: '#ff0000'
        }
      ],
      itemInfo: {},
      columns: [
        {
          type: 'index',
          width: 100,
          align: 'center'
        },
        {
          title: '名称',
          key: 'itemName',
          align: 'center'
        },
        {
          title: '型号',
          key: 'model',
          align: 'center'
        },
        {
          title: '规格',
          key: 'specifications',
          align: 'center'
        },

        {
          title: '合同数量',
          key: 'quantity',
          align: 'center'
        },
        {
          title: '合同剩余量',
          key: 'contractSurplus',
          align: 'center'
        },
        {
          title: '本计划供应量',
          key: 'supplyNum',
          align: 'center'
        },
        {
          title: '使用部位',
          key: 'usedPart',
          align: 'center'
        },
        {
          title: '累计实际已供应量',
          key: 'totalSupplyNum',
          width: 240,
          align: 'center'
        },
        {
          title: '计划到场时间',
          key: 'planArrivalTime',
          width: 240,
          align: 'center'
        },
        {
          title: '备注',
          key: 'remark',
          align: 'center'
        }
      ],
      approvalRecordList: [] // 审批记录
    }
  },
  onLoad(options) {
    this.id = options.id || ' '
    this.init()
  },
  computed: {
    // 我的待办
    taskTodo() {
      return this.$store.state.userPower.taskTodo
    },
    userId() {
      return this.$store.state.user.userId
    }
  },
  methods: {
    // 初始化
    init() {
      this.getPartyDetail()
      this.getTaskList()
    },
    handlePreviewDetailInfo() {
      this.$utils.toUrl(`/pages/material/procurementParty/table?id=${this.id}`)
    },
    // 获取审批记录title
    getApprovalTitle(index) {
      let statusText = ''
      switch (index) {
        case 0:
          statusText = '审核详情-监理单位'
          break
        case 1:
          statusText = ''
          break
        case 2:
          statusText = '审核详情-建设单位'
          break
        case 3:
          statusText = ''
          break
      }
      return statusText
    },
    // 获取审批记录名字
    getApprovalName(index) {
      let statusText = ''
      switch (index) {
        case 0:
          statusText = '监理工程师'
          break
        case 1:
          statusText = '总监理工程师'
          break
        case 2:
          statusText = '专业工程师'
          break
        case 3:
          statusText = '项目经理'
          break
      }
      return statusText
    },
    // 获取审批状态
    getApprovalFlag(flag) {
      let statusText = ''
      switch (flag) {
        case '1':
          statusText = '通过'
          break
        case '2':
          statusText = '驳回'
          break
      }
      return statusText
    },
    // 获取所有审批意见
    async getTaskList() {
      if (!this.id) {
        return
      }
      let result = await workFlowApi.getTaskList(this.id)
      let datas = result.data || []
      let list = []
      datas.map((item, i) => {
        if (i > 0 && item.taskVariables.taskDelegateName) {
          list.push(item)
        }
      })
      this.approvalRecordList = list
    },
    async getNotifySupply() {
      let res = await Api.getNotifySupply(this.id)
      if (res.code === 200) {
        this.$utils.showToast('已通知联系人')
        this.$utils.goBack()
      }
    },
    async getPartyDetail() {
      let res = await Api.getPartyDetail(this.id)
      if (res.data.detailList) {
        res.data.detailList.forEach(e => (e.contractSurplus = e.quantity - e.totalSupplyNum || 0))
      }
      this.itemInfo = res.data || {}
    },
    async handleRevocation() {
      let res = await this.fly.construction.get(`/materialSupplyPlan/${this.id}/revocation`)
      this.$utils.showToast(res.message)
      this.$utils.goBack()
    },
    async handleCancellation() {
      let res = await this.fly.construction.get(`/materialSupplyPlan/${this.id}/cancellation`)
      this.$utils.showToast(res.message)
      this.$utils.goBack()
    },
    finishSupply() {
      this.fly.construction.get(`materialSupplyPlan/${this.id}/finishSupply`).then(res => {
        this.$utils.showToast('操作成功')
        this.$utils.goBack()
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../detail.less');
</style>
