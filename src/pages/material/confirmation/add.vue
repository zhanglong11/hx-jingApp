<template>
  <view class="main">
    <div class="scroll-roll">
      <view class="main-body">
        <uni-card isForm>
          <uni-form-item label="材料确认单编号">
            <input v-model="form.confirmCode" disabled placeholder="自动生成" />
          </uni-form-item>
          <uni-form-item label="甲供材计划单" isRequired isLink>
            <select-plan-number v-model="form.groupName" class="align-right" :placeholder="form.groupName" @change="handlePlanList" />
          </uni-form-item>
          <uni-form-item label="甲供材计划编号">
            <view>{{ form.supplyPlanCode }}</view>
          </uni-form-item>
          <uni-form-item label="合同" isRequired>
            <view>{{ form.contractName }}</view>
          </uni-form-item>
        </uni-card>
        <!-- 材料确认明细 start -->
        <view>
          <view class="card-title">材料确认明细</view>

          <uni-card v-for="(item, index) in planListData" :key="index" isForm>
            <uni-form-item label="序号">
              <view class="placeholder">{{ index + 1 < 10 ? '0' + (index + 1) : index + 1 }}</view>
            </uni-form-item>
            <uni-form-item label="名称">
              <view class="placeholder">{{ item.itemName }}</view>
            </uni-form-item>
            <uni-form-item label="型号">
              <view class="placeholder">{{ item.model }}</view>
            </uni-form-item>
            <uni-form-item label="规格">
              <view class="placeholder">{{ item.specifications }}</view>
            </uni-form-item>
            <uni-form-item label="计划供应量">
              <view class="placeholder">{{ item.supplyNum }}</view>
            </uni-form-item>
            <uni-form-item label="上期累计量">
              <view class="placeholder">{{ item.lastSupplyNum }}</view>
            </uni-form-item>
            <uni-form-item label="本期供应量">
              <input v-model="item.currentSupplyNum" type="number" placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="单价">
              <input v-model="item.currentUnitPrice" type="number" placeholder="请输入" />
            </uni-form-item>
            <uni-form-item label="合价">
              <view>{{ item.currentUnitPrice * item.currentSupplyNum || 0 }}</view>
            </uni-form-item>
            <uni-form-item label="本期累计量">
              <view>{{ Number(item.lastSupplyNum) + Number(item.currentSupplyNum) || 0 }}</view>
            </uni-form-item>
            <uni-form-item label="是否超供">
              <view>{{ isOverFull(item) }}</view>
            </uni-form-item>
            <uni-form-item label="使用部位">
              <view>{{ item.usedPart }}</view>
            </uni-form-item>
          </uni-card>
        </view>
        <!-- 材料确认明细 end -->
        <!-- 合计信息 start -->
        <uni-card isForm>
          <uni-form-item label="合计">
            <view class="placeholder">{{ total }}</view>
          </uni-form-item>
          <uni-form-item label="应付款(合计*合同约定支付比例)">
            <view class="placeholder">{{ total }}</view>
          </uni-form-item>
          <uni-form-item label="上期已付款">
            <view class="placeholder">{{ form.lastSupplyMoney || 0 }}</view>
          </uni-form-item>
        </uni-card>
        <!-- 合计信息end -->
        <uni-card isForm>
          <uni-form-item label="备注" type="textarea" align="left">
            <textarea v-model="form.remark" :maxlength="-1" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="附件" class="file">
            <uni-attachment v-model="form.fileId" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
        <view class="btn-wrapper">
          <button class="button" type="primary" @click="handleLogSubmit">保存</button>
        </view>
      </view>
    </div>
  </view>
</template>

<script>
var graceChecker = require('@/utils/graceChecker.js')
import selectPlanNumber from './components/select-plan-number'
import { Api } from '@/api/material'
import { mapGetters } from 'vuex'
export default {
  components: {
    selectPlanNumber
  },
  data() {
    return {
      form: {
        groupName: '', //甲供材计划名称
        labourCompanyName: '', //甲供材计划编号
        employeeName: '', //合同名称,
        contractName: '',
        // createTime: '',
        // creator: '',
        // creatorName: '',
        detailList: [
          {
            contractId: '',
            currentSupplyNum: 0,
            currentUnitPrice: 0,
            itemName: '',
            lastSupplyNum: 0,
            materialId: '',
            model: '',
            overfulfilFlag: 0,
            specifications: '',
            supplyDetailId: '',
            supplyNum: 0,
            supplyPlanId: '',
            totalSupplyNum: 0,
            usedPart: ''
          }
        ],
        fileId: '',
        // id: '',
        // isRevocation: 0,
        // lastSupplyMoney: 0,
        // period: 0,
        projectId: '',
        remark: '',
        // secondParty: '',
        // secondPartyLinkman: '',
        // secondPartyMobile: '',
        // status: 0,
        // supplierId: '',
        supplyPlanCode: '',
        supplyPlanId: ''
        // supplyPlanName: '',
        // updateTime: ''
      },
      purchaseList: [
        {
          label: '招标',
          value: '1'
        },
        {
          label: '非招标',
          value: '2'
        }
      ],
      planListInfo: {},
      planListData: [],
      id: '',
      rules: [
        {
          name: 'currentSupplyNum',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入本期供应量'
        },
        {
          name: 'currentUnitPrice',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入单价'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    total() {
      console.log(this.planListData)
      return (
        this.planListData.reduce(
          (acc, cur) => acc + _.get(cur, 'currentUnitPrice', 0) * _.get(cur, 'currentSupplyNum', 0),
          0
        ) || 0
      )
    }
  },
  onLoad(options) {
    this.form.projectId = this.projectId
    // this.handleCreatedOrderID()

    this.id = options.ids || ''
    this.init(options)
  },
  watch: {
  form(val){
    // console.log('group',val.groupName)
    this.form.groupName=val.groupName

}
  },
  methods: {
    async init(options) {
      if (this.id) {
        this.handlePlanList(options)
      }
    },
    //页面打开时自动生成材料确认单号
    // async handleCreatedOrderID() {},
    async handlePlanList(e) {
      this.form.groupName = e.ids
      let res = await Api.getPartyDetail(e.ids)
      this.form = {
        ...this.form,
        supplyPlanCode: res.data.supplyPlanCode,
        supplyPlanName: res.data.supplyPlanName,
        supplyPlanId: res.data.id,
        contractName: res.data.contractName,
        lastSupplyMoney: res.data.lastSupplyMoney,
        contractId: res.data.contractId,
        secondParty: res.data.secondParty,
        confirmerName: res.data.confirmerName
      }
      let cloneData =
        res.data.detailList &&
        res.data.detailList.map(d => {
          let o = {}
          o.contractId = d.contractId
          o.supplyPlanId = d.id
          o.model = d.model
          o.materialId = d.materialId
          o.supplyDetailId = d.id
          o.itemName = d.itemName
          o.specifications = d.specifications
          o.supplyNum = d.supplyNum
          o.lastSupplyNum = d.lastSupplyNum
          o.usedPart = d.usedPart
          return o
        })
      this.planListData = this.form.detailList = cloneData || []
    },
    async handleLogSubmit() {
      let valid = this.handleFormValid()
      if (!valid) return
      this.form.detailList.forEach(item => {
        item.totalSupplyNum = Number(item.lastSupplyNum) + Number(item.currentSupplyNum)
      })
      let form = { ...this.form, ...{ detailList: this.planListData } }
      let res = await Api.getConfirmationSubmit(form)
      if (res.code === 200) {
        this.$utils.showToast('添加成功')
      }
      // this.handleInitForm()
      this.$utils.goBack()
    },
    handleFormValid() {
      let isValid = true
      if (!this.form.groupName.trim()) {
        this.$utils.showToast('请先选择甲供材计划单')
        isValid = false
      } else {
        this.planListData.forEach(item => {
          const representRes = graceChecker.check(item, this.rules)
          if (!representRes) {
            this.$utils.showToast(graceChecker.error)
            isValid = false
          }
        })
      }
      return isValid
    },
    isOverFull(item) {
      const totalSupplyNum = Number(item.lastSupplyNum) + Number(item.currentSupplyNum)
      return totalSupplyNum > item.supplyNum ? '是' : '否'
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./add.less');
</style>
