<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <!-- 合同基本信息 start -->
        <uni-card>
          <uni-form-item label="合同名称" isCell align="left">
            {{ form.name }}
          </uni-form-item>
          <uni-form-item label="状态" isCell align="left">
            <uni-status :options="contractStatusList" :value="form.status + ''"></uni-status>
          </uni-form-item>
          <uni-form-item label="合同类型" isCell align="left">
            {{ $getLabelFromArg('contractType', form.type + '') }}
          </uni-form-item>
          <uni-form-item label="合同编号" isCell align="left">
            {{ form.code }}
          </uni-form-item>
          <uni-form-item label="合同金额" isCell align="left"> {{ form.amount }} 万元 </uni-form-item>
          <uni-form-item label="合同工期" isCell align="left"> {{ form.duration }} 天 </uni-form-item>
          <uni-form-item label="开工日期" isCell align="left">
            {{ form.startDate | formatData }}
          </uni-form-item>
          <uni-form-item label="竣工日期" isCell align="left">
            {{ form.endDate | formatData }}
          </uni-form-item>
          <uni-form-item label="质保期" isCell align="left"> {{ form.guaranteePeriod }} 天 </uni-form-item>
          <uni-form-item label="工程类型" isCell align="left">
            {{ $getLabelFromArg('engineeringType', form.engineeringType + '') }}
          </uni-form-item>
          <uni-form-item label="投资类型" isCell align="left">
            {{ $getLabelFromArg('investmentType', form.investmentType + '') }}
          </uni-form-item>
          <uni-form-item label="甲方名称" isCell align="left">
            {{ form.firstParty }}
          </uni-form-item>
          <uni-form-item label="甲方联系人" isCell align="left">
            {{ form.firstPartyLinkman }}
          </uni-form-item>
          <uni-form-item label="甲方联系电话" isCell align="left">
            {{ form.firstPartyMobile }}
          </uni-form-item>
          <uni-form-item label="乙方名称" isCell align="left">
            {{ form.secondParty }}
          </uni-form-item>
          <uni-form-item label="乙方联系人" isCell align="left">
            {{ form.secondPartyLinkman }}
          </uni-form-item>
          <uni-form-item label="乙方联系电话" isCell align="left">
            {{ form.secondPartyMobile }}
          </uni-form-item>
        </uni-card>
        <!-- 合同基本信息 end -->
        <!-- 合同附件信息 start -->
        <view class="card-title">合同附件信息</view>
        <uni-card>
          <uni-form-item label="电子版合同" isCell align="left" class="file">
            <uni-attachment v-model="form.electronicContractFileIds"></uni-attachment>
          </uni-form-item>
          <uni-form-item label="纸质版合同" isCell align="left" class="file">
            <uni-attachment v-model="form.paperContractFileIds"></uni-attachment>
          </uni-form-item>
        </uni-card>
        <!-- 合同附件信息end -->
        <!-- 创建人 start -->
        <uni-card>
          <uni-form-item label="创建人" isCell align="left">
            {{ form.creatorName }}
          </uni-form-item>
          <uni-form-item label="创建时间" isCell align="left">
            {{ form.createTime }}
          </uni-form-item>
        </uni-card>
        <!-- 创建人 end -->
        <uni-card>
          <uni-form-item label="备注" isCell align="left" type="textarea">
            {{ form.remark }}
          </uni-form-item>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import Api from '@/api/agreement'
export default {
  components: {},
  data() {
    return {
      form: {},
      tableData: [],
      contractStatusList: [],
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
          title: '规格',
          key: 'specifications',
          align: 'center'
        },
        {
          title: '型号',
          key: 'model',
          align: 'center',
          width: 360
        },
        {
          title: '单位',
          key: 'unit',
          width: 140,
          align: 'center'
        },
        {
          title: '数量',
          key: 'quantity',
          width: 120,
          align: 'center'
        },
        {
          title: '单价',
          key: 'unitPrice',
          width: 120,
          align: 'center'
        },
        {
          title: '合价',
          key: 'combinedPrice',
          align: 'center'
        }
      ]
    }
  },
  onLoad(options) {
    this.contractId = options.contractId
  },
  onShow() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.getContractDetail()
      this.getTableData()
      this.getContractStatusList()
    },
    // 获取合同类型
    getContractStatusList() {
      let list = []
      let colors = ['#999999', '#25CC70', '#FEDF50', '#FF8000', '#0079FE', '#25CC70', '#FF0808']
      this.$getArgList('contractStatus').map((e, i) => {
        list.push({
          label: e.label,
          value: e.value,
          color: colors[i]
        })
      })
      this.contractStatusList = list
    },
    //合同详情
    async getContractDetail() {
      let res = await Api.getContractById(this.contractId)
      this.form = { ...res.data }
    },
    async getTableData() {
      let res = await Api.getContractInventoryPurchase({ contractId: this.contractId })
      this.tableData = res.data.records
    },
    handlePreviewDetailInfo() {
      this.$utils.toUrl(`/pages/agreement/table?contractId=${this.contractId}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./detail.less');
</style>
