<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view v-if="itemInfo" class="main-body">
        <uni-card class="card">
          <uni-form-item label="甲供材计划单名称" disabled align="left">
            {{ itemInfo.supplyPlanName }}
          </uni-form-item>
          <uni-form-item label="">
            <view>
              <span class="circle" :style="{ backgroundColor: procurementStatus[itemInfo.supplyStatus].color }"></span
              >{{ procurementStatus[itemInfo.supplyStatus].name }}
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
            {{ itemInfo.createTime | ymd }}
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
              <wTable headbBackground="#EEEEEE" :columns="columns" :data="tableData" border   @click.native="handlePreviewDetailInfo"/>
            </scroll-view>
          </view>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import UniCard from '@/components/uni-card/uni-card'
import { Api } from '@/api/material'
export default {
  name: 'Detail',
  components: { UniCard },
  data() {
    return {
      id: '',
      procurementStatus: [
        {
          name: '待通知',
          value: '0',
          color: '#ff0000'
        },
        {
          name: '采购中',
          value: '1',
          color: '#0079fe'
        },
        {
          name: '已完成',
          value: '2',
          color: '#25cc70'
        }
      ],
      itemInfo: '',
      tableData: [],
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
          // render: (h, { row }) => {
          //   return h('view', row.quantity - row.totalSupplyNum || 0)
          // }
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
          align: 'center'
        },
        {
          title: '备注',
          key: 'remark',
          align: 'center'
        }
      ]
    }
  },
  onLoad(options) {
    this.id = options.id || ' '
    this.init()
  },
  methods: {
    init() {
      this.getPartyDetail()
    },
    handlePreviewDetailInfo() {
      this.$utils.toUrl(`/pages/material/procurementParty/table?id=${this.id}`)
    },
    async getNotifySupply() {
      let res = await Api.getNotifySupply(this.id)
      if (res.code === 200) {
        this.$utils.showToast('已通知联系人')
        setTimeout(() => {
          this.$utils.goBack()
        }, 1500)
      }
    },
    async getPartyDetail() {
      let res = await Api.getPartyDetail(this.id)
      this.itemInfo = res.data || {}
      this.tableData = res.data.detailList || []
      if (res.data.detailList) {
        res.data.detailList.forEach(e => (e.contractSurplus = e.quantity - e.totalSupplyNum || 0))
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../detail.less');
</style>
