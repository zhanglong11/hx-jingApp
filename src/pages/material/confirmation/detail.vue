<template>
  <view class="main">
    <!--		视频在scroll-view中会出bug-->
    <div class="scroll-roll">
      <view class="main-body">
        <uni-card class="label-w7em">
          <uni-form-item label="材料确认单编号" disabled align="left">
            {{ infoList.confirmCode }}
          </uni-form-item>
          <uni-form-item class="status-wrapper">
            <!-- <view class="status wait">待审核</view> -->
            <!-- <view class="status">审核中</view> -->
            <!-- <view class="status danger">已驳回</view> -->
            <view class="status success">{{ ['草稿', '待审核', '已通过', '已驳回'][infoList.status] }}</view>
          </uni-form-item>
          <uni-form-item label="甲供材计划编号" disabled align="left">
            {{ infoList.supplyPlanCode }}
          </uni-form-item>
          <uni-form-item label="甲供材计划名称" disabled align="left">
            {{ infoList.supplyPlanName }}
          </uni-form-item>
          <uni-form-item label="合同编号" disabled align="left">
            {{ infoList.contractCode }}
          </uni-form-item>
          <uni-form-item label="合同名称" disabled align="left">
            {{ infoList.contractName }}
          </uni-form-item>
        </uni-card>
        <!-- 材料确认明细 start -->
        <view class="card-title">材料确认明细</view>
        <view class="table-wrapper">
          <scroll-view scroll-x>
            <wTable
              headbBackground="#EEEEEE"
              :columns="columns"
              :data="tableData"
              border
              @click.native="handlePreviewDetailInfo"
            />
          </scroll-view>
        </view>
        <!-- 材料确认明细 end -->
        <!-- 创建人 start -->
        <uni-card>
          <uni-form-item label="创建人" disabled align="left">
            {{ infoList.creatorName }}
          </uni-form-item>
          <uni-form-item label="创建时间" disabled align="left">
            {{ infoList.createTime | formatData }}
          </uni-form-item>
        </uni-card>
        <!-- 创建人 end -->

        <!-- 备注信息 start -->
        <uni-card>
          <uni-form-item label="备注" disabled align="left">
            {{ infoList.remark }}
          </uni-form-item>
          <uni-form-item label="附件" disabled align="left" class="file">
            <uni-attachment v-model="infoList.fileId"></uni-attachment>
          </uni-form-item>
        </uni-card>
        <!-- 备注信息 end -->
        <!-- 审批记录 start -->
        <template v-if="approvalRecordList.length > 0 && approvalRecordList[0].endTime">
          <view class="card-title approval-title">审核详情-供货单位</view>
          <uni-card v-if="approvalRecordList[0].endTime" class="card">
            <uni-form-item align="left" label="确认上表供货数量" disabled>
              {{ approvalRecordList[0].taskVariables.flag === '1' ? '正确' : '不正确' }}
            </uni-form-item>
            <uni-form-item align="left" label="确认日期" disabled>
              {{ approvalRecordList[0].endTime | formatData }}
            </uni-form-item>
            <uni-form-item align="left" label="负责人" disabled>
              {{ approvalRecordList[0].taskVariables.auditPerson }}
            </uni-form-item>
          </uni-card>
        </template>
        <template v-if="approvalRecordList.length > 1 && approvalRecordList[1].endTime">
          <view class="card-title approval-title">审核详情-收货单位</view>
          <uni-card v-if="approvalRecordList[1].endTime" class="card">
            <uni-form-item align="left" label="确认上表收货状态" disabled>
              {{ approvalRecordList[1].taskVariables.flag === '1' ? '合格' : '不合格' }}
            </uni-form-item>
            <uni-form-item align="left" label="审核日期" disabled>
              {{ approvalRecordList[1].endTime | formatData }}
            </uni-form-item>
            <uni-form-item align="left" label="数量" disabled>
              {{ approvalRecordList[1].taskVariables.receiptNumber }}
            </uni-form-item>
            <uni-form-item align="left" label="质量" disabled>
              {{ approvalRecordList[1].taskVariables.quality === '1' ? '合格' : '不合格' }}
            </uni-form-item>
            <uni-form-item align="left" label="收货人" disabled>
              {{ approvalRecordList[1].taskVariables.auditPerson }}
            </uni-form-item>
            <uni-form-item align="left" label="负责人" disabled>
              {{ approvalRecordList[1].taskVariables.chargePerson }}
            </uni-form-item>
          </uni-card>
        </template>

        <template v-if="approvalRecordList.length > 2 && approvalRecordList[2].endTime">
          <view class="card-title approval-title">审核详情-监理单位</view>
          <uni-card v-if="approvalRecordList[2].endTime" class="card">
            <uni-form-item align="left" label="审核结果" disabled>
              {{ approvalRecordList[2].taskVariables.flag === '1' ? '合格' : '不合格' }}
            </uni-form-item>
            <uni-form-item align="left" label="审核日期" disabled>
              {{ approvalRecordList[2].endTime | formatData }}
            </uni-form-item>
            <uni-form-item align="left" label="审核意见" disabled>
              {{ approvalRecordList[2].taskVariables.remark }}
            </uni-form-item>
            <uni-form-item align="left" label="质量" disabled>
              {{ approvalRecordList[2].taskVariables.quality === '1' ? '合格' : '不合格' }}
            </uni-form-item>
            <uni-form-item align="left" label="经办人" disabled>
              {{ approvalRecordList[2].taskVariables.auditPerson }}
            </uni-form-item>
            <uni-form-item align="left" label="总监（代表）" disabled>
              {{ approvalRecordList[2].taskVariables.chargePerson }}
            </uni-form-item>
          </uni-card>
        </template>

        <template v-if="approvalRecordList.length > 3 && approvalRecordList[3].endTime">
          <view class="card-title approval-title">审核详情-建设单位</view>
          <uni-card v-if="approvalRecordList[3].endTime" class="card">
            <uni-form-item align="left" label="审核结果" disabled>
              {{ approvalRecordList[3].taskVariables.flag === '1' ? '合格' : '不合格' }}
            </uni-form-item>
            <uni-form-item align="left" label="审核日期" disabled>
              {{ approvalRecordList[3].endTime | formatData }}
            </uni-form-item>
            <uni-form-item align="left" label="审核意见" disabled>
              {{ approvalRecordList[3].taskVariables.remark }}
            </uni-form-item>
            <uni-form-item align="left" label="质量" disabled>
              {{ approvalRecordList[3].taskVariables.quality === '1' ? '合格' : '不合格' }}
            </uni-form-item>
            <uni-form-item align="left" label="经办人" disabled>
              {{ approvalRecordList[3].taskVariables.auditPerson }}
            </uni-form-item>
            <uni-form-item align="left" label="总监（代表）" disabled>
              {{ approvalRecordList[3].taskVariables.chargePerson }}
            </uni-form-item>
          </uni-card>
        </template>
        <!-- 审批记录 end -->
        <!-- 通用审批 start -->
        <uni-check-card :id="id" ref="checkCard" />
        <!-- 通用审批 end -->

        <view
          v-if="(infoList.status === 1 || infoList.isRevocation === 1) && userId === infoList.creator"
          class="btn-wrapper"
        >
          <button
            v-if="!infoList.isRevocation&&infoList.status === 1 && userId === infoList.creator"
            class="button"
            type="primary"
            @click="handleCancellation"
          >
            作废
          </button>
          <button
            v-if="infoList.isRevocation&& userId === infoList.creator"
            class="button"
            type="primary"
            @click="handleRevocation"
          >
            撤回
          </button>
        </view>
      </view>
    </div>
  </view>
</template>

<script>
import wTable from '@/components/wTable/wTable.vue'
import { Api } from '@/api/material'
import { mapGetters } from 'vuex'
import { workFlowApi } from '@/api/work-flow'
var graceChecker = require('@/utils/graceChecker.js')

export default {
  components: {
    wTable
  },
  data() {
    return {
      form: {
        suppliesResult: null, //供货数量确认结果
        suppliesResultText: '',
        receiptValue: null, //收货方质量确认
        receiptText: '',
        receiptStatusText: '', //收货方收货状态确认
        receiptStatusValue: ''
      },
      tableData: [],
      infoList: '',
      id: '',
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
          title: '计划供应量',
          key: 'supplyNum',

          align: 'center'
        },
        {
          title: '上期累计量',
          key: 'lastSupplyNum',

          align: 'center'
        },
        {
          title: '本期供应量',
          key: 'currentSupplyNum',

          align: 'center'
        },
        {
          title: '单价',
          key: 'currentUnitPrice',
          width: 100,
          align: 'center'
        },
        {
          title: '合价',
          key: 'total',
          align: 'center',
          // render: (h, { row }) => {
          //   return h('view', row.currentUnitPrice * row.currentSupplyNum || 0)
          // }
        },
        {
          title: '本期累计量',
          key: 'totalSupplyNum',

          align: 'center'
        },
        {
          title: '是否超供',
          key: 'overfulfilFlag',
          align: 'center',
          // render: (h, { row }) => {
          //   return h('view', Number(row.lastSupplyNum) + Number(row.currentSupplyNum) > row.supplyNum ? '否' : '是')
          // }
        },
        {
          title: '使用部位',
          key: 'usedPart',

          align: 'center'
        }
      ],
      suppliesList: [
        {
          value: 1,
          label: '正确'
        },
        {
          value: 0,
          label: '不正确'
        }
      ], //供货数量确认结果选择项
      receiptList: [
        //供货商确认质量选择项
        {
          value: 1,
          label: '合格'
        },
        {
          value: 0,
          label: '不合格'
        }
      ],
      receiptStatusList: [
        //供货商确认收货状态选择项
        {
          value: 1,
          label: '合格'
        },
        {
          value: 0,
          label: '不合格'
        }
      ],
      buttonText: '提交',
      checkTime: '',
      approvalRecordList: [] // 审批记录
    }
  },
  computed: {
    startDate() {
      return this.getDate('start')
    },
    endDate() {
      return this.getDate('end')
    },
    ...mapGetters(['projectId']),
    userId() {
      return this.$store.state.user.userId
    }
  },
  onLoad(options) {
    this.init(options)
  },
  mounted() {
    this.form.projectId = this.projectId
  },
  methods: {
    init(options) {
      this.id = options.id || ''
      this.getConfirmationDetail()
      this.getTaskList()
    },
    // 获取审批记录title
    getApprovalTitle(index) {
      let statusText = ''
      switch (index) {
        case 0:
          statusText = '审核详情-供货单位'
          break
        case 1:
          statusText = '审核详情-收货单位'
          break
        case 2:
          statusText = '审核详情-监理单位'
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
        if (i > 0) {
          list.push(item)
        }
      })
      this.approvalRecordList = list
    },
    async getConfirmationDetail() {
      let res = await Api.getConfirmationDetail(this.id)
      this.infoList = res.data || {}
      this.tableData = res.data.detailList || []
      if (res.data.detailList) {
        res.data.detailList.forEach(e =>{
          e.total = e.currentUnitPrice * e.currentSupplyNum || 0
          e.overfulfilFlag=Number(e.lastSupplyNum) + Number(e.currentSupplyNum) > e.supplyNum ? '否' : '是'
        })
      }
    },
    async handleRevocation() {
      let res = await Api.getConfirmationRevocation(this.id)
      this.$utils.showToast(res.message)
      this.$utils.goBack()
    },
    async handleCancellation() {
      let res = await Api.getConfirmationCancellation(this.id)
      this.$utils.showToast(res.message)
      this.$utils.goBack()
    },
    handlePreviewDetailInfo() {
      this.$utils.toUrl(`/pages/material/confirmation/table?id=${this.id}`)
    },
    //供货上确认供货数量
    handleSupplyInfoClick() {
      let vm = this
      uni.showActionSheet({
        itemList: vm.suppliesList.map(e => e.label),
        success: function(res) {
          let selectItem = vm.suppliesList[res.tapIndex] || {}
          vm.form.suppliesResultText = selectItem.label
          vm.form.suppliesResult = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    //选中实际检查日期
    bindCheckTimeChange(e) {
      this.checkTime = e.target.value
    },
    //收货方收货状态确认
    handleReceiptStatusInfoClick() {
      let vm = this
      uni.showActionSheet({
        itemList: vm.receiptStatusList.map(e => e.label),
        success: function(res) {
          let selectItem = vm.receiptStatusList[res.tapIndex] || {}
          vm.form.receiptStatusText = selectItem.label
          vm.form.receiptStatusValue = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    //收货方收货数量确认
    handleReceiptTextInfoClick() {
      let vm = this
      uni.showActionSheet({
        itemList: vm.receiptList.map(e => e.label),
        success: function(res) {
          let selectItem = vm.receiptList[res.tapIndex] || {}
          vm.form.receiptText = selectItem.label
          vm.form.receiptValue = selectItem.value
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 设置日期控件的起止日期
    getDate(type) {
      const date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()

      if (type === 'start') {
        year = year - 60
      } else if (type === 'end') {
        year = year + 2
      }
      month = month > 9 ? month : '0' + month
      day = day > 9 ? day : '0' + day
      return `${year}-${month}-${day}`
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./detail.less');
</style>
