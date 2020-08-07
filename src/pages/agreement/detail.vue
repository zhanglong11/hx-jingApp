<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <!-- 合同基本信息 start -->
        <uni-card>
          <uni-form-item label="合同名称" disabled align="left">
            {{ form.name }}
          </uni-form-item>
          <uni-form-item label="合同编号" disabled align="left">
            {{ form.code }}
          </uni-form-item>
          <uni-form-item label="合同类型" disabled align="left">
            采购合同
          </uni-form-item>
          <uni-form-item label="招采方式" disabled align="left">
            {{
              form.purchaseMode !== null && form.purchaseMode !== undefined
                ? form.purchaseMode === 1
                  ? '招标'
                  : '非招标'
                : ''
            }}
          </uni-form-item>
          <uni-form-item label="质保期(月)" disabled align="left">
            {{ form.guaranteePeriod }}
          </uni-form-item>
          <uni-form-item label="甲方" disabled align="left">
            {{ form.firstParty }}
          </uni-form-item>
          <uni-form-item label="甲方联系人" disabled align="left">
            {{ form.firstPartyLinkman }}
          </uni-form-item>
          <uni-form-item label="甲方联系电话" disabled align="left">
            {{ form.firstPartyMobile }}
          </uni-form-item>
          <uni-form-item label="乙方" disabled align="left">
            {{ form.secondParty }}
          </uni-form-item>
          <uni-form-item label="乙方联系人" disabled align="left">
            {{ form.secondPartyLinkman }}
          </uni-form-item>
          <uni-form-item label="乙方联系电话" disabled align="left">
            {{ form.secondPartyMobile }}
          </uni-form-item>
          <uni-form-item label="使用单位" disabled align="left">
            {{ form.userCompanyName }}
          </uni-form-item>
          <uni-form-item label="使用单位联系人" disabled align="left">
            {{ form.userCompanyLinkman }}
          </uni-form-item>
          <uni-form-item label="使用单位电话" disabled align="left">
            {{ form.userCompanyMobile }}
          </uni-form-item>
          <uni-form-item label="监理单位" disabled align="left">
            {{ form.supervisionCompanyName }}
          </uni-form-item>
          <uni-form-item label="监理单位联系人" disabled align="left">
            {{ form.supervisionCompanyLinkman }}
          </uni-form-item>
          <uni-form-item label="监理单位电话" disabled align="left">
            {{ form.supervisionCompanyMobile }}
          </uni-form-item>
          <uni-form-item label="甲供材单位" disabled align="left">
            {{ form.supplyCompanyName }}
          </uni-form-item>
          <uni-form-item label="甲供材单位联系人" disabled align="left">
            {{ form.supplyCompanyLinkman }}
          </uni-form-item>
          <uni-form-item label="甲供材单位电话" disabled align="left">
            {{ form.supplyCompanyMobile }}
          </uni-form-item>
          <uni-form-item label="供货周期(月)" disabled align="left">
            {{ form.supplyMaterialPeriod }}
          </uni-form-item>
          <uni-form-item label="甲方项目工程师" disabled align="left">
            {{ form.firstPartyEngineerLinkman }}
          </uni-form-item>
          <uni-form-item label="甲方项目工程师电话" disabled align="left">
            {{ form.firstPartyEngineerMoblie }}
          </uni-form-item>
          <uni-form-item label="项目负责人" disabled align="left">
            {{ form.projectLinkman }}
          </uni-form-item>
          <uni-form-item label="项目负责人电话" disabled align="left">
            {{ form.projectMobile }}
          </uni-form-item>
          <uni-form-item label="采购负责人" disabled align="left">
            {{ form.purchaseLinkman }}
          </uni-form-item>
          <uni-form-item label="采购负责人联系电话" disabled align="left">
            {{ form.purchaseMobile }}
          </uni-form-item>
        </uni-card>
        <!-- 合同基本信息 end -->
        <!-- 合同附件信息 start -->
        <view class="card-title">合同附件信息</view>
        <uni-card>
          <uni-form-item label="电子版合同" disabled align="left" class="file">
            <uni-attachment v-model="form.electronicContractFileIds"></uni-attachment>
          </uni-form-item>
          <uni-form-item label="纸质版合同" disabled align="left" class="file">
            <uni-attachment v-model="form.paperContractFileIds"></uni-attachment>
          </uni-form-item>
        </uni-card>

        <!-- 合同附件信息end -->
        <!-- 合同清单信息 start -->

        <view class="card-title">合同清单信息</view>
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
        <!-- 合同清单信息end -->
        <!-- 创建人 start -->
        <uni-card>
          <uni-form-item label="创建人" disabled align="left">
            {{ form.creatorName }}
          </uni-form-item>
          <uni-form-item label="创建时间" disabled align="left">
            {{ form.createTime }}
          </uni-form-item>
        </uni-card>
        <!-- 创建人 end -->
        <uni-card>
          <uni-form-item label="备注" disabled align="left" type="textarea">
            {{ form.remark }}
          </uni-form-item>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import wTable from '@/components/wTable/wTable.vue'
import Api from '@/api/agreement'
export default {
  components: {
    wTable
  },
  data() {
    return {
      form: {},
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
    this.getContractDetail()
    this.getTableData()
  },
  methods: {
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
