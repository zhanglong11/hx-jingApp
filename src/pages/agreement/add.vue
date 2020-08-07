<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-card>
          <uni-form-item label="合同编号" isRequired>
            <textarea v-model="form.code" auto-height placeholder="请输入合同编号" />
          </uni-form-item>
          <uni-form-item label="合同名称" isRequired>
            <textarea v-model="form.name" auto-height placeholder="请输入合同名称" />
          </uni-form-item>

          <!--<uni-form-item label="合同类型" isRequired isLink>
            <view :class="{ placeholder: !form.contractText.trim() }" @click="handleContractClick">{{
              form.contractText || '请选择'
            }}</view>
          </uni-form-item>-->
          <uni-form-item label="招采方式" isRequired isLink>
            <view :class="{ placeholder: !form.purchaseText.trim() }" @click="handlePurchaseClick">{{
              form.purchaseText || '请选择'
            }}</view>
          </uni-form-item>
          <uni-form-item label="质保期(月)" isRequired>
            <input v-model="form.guaranteePeriod" type="number" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="甲方" isRequired>
            <textarea v-model="form.firstParty" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="甲方联系人" isRequired>
            <input v-model="form.firstPartyLinkman" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="甲方联系电话" isRequired>
            <input v-model="form.firstPartyMobile" type="number" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="乙方" isRequired>
            <textarea v-model="form.secondParty" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="乙方联系人" isRequired>
            <input v-model="form.secondPartyLinkman" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="乙方联系电话" isRequired>
            <input v-model="form.secondPartyMobile" type="number" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="使用单位">
            <textarea v-model="form.userCompanyName" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="使用单位联系人">
            <input v-model="form.userCompanyLinkman" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="使用单位电话">
            <input v-model="form.userCompanyMobile" type="number" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="监理单位">
            <textarea v-model="form.supervisionCompanyName" auto-height placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="监理单位联系人">
            <input v-model="form.supervisionCompanyLinkman" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="监理单位电话">
            <input v-model="form.supervisionCompanyMobile" type="number" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="甲方项目工程师">
            <input v-model="form.firstPartyEngineerLinkman" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="甲方项目工程师电话">
            <input v-model="form.firstPartyEngineerMoblie" type="number" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="项目负责人">
            <input v-model="form.projectLinkman" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="项目负责人电话">
            <input v-model="form.projectMobile" type="number" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="采购负责人">
            <input v-model="form.purchaseLinkman" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="采购负责人电话">
            <input v-model="form.purchaseMobile" type="number" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="甲供材单位">
            <input v-model="form.supplyCompanyName" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="甲供材单位联系人">
            <input v-model="form.supplyCompanyLinkman" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="甲供材单位电话">
            <input v-model="form.supplyCompanyMobile" type="number" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="供货周期(月)">
            <input v-model="form.supplyMaterialPeriod" type="number" placeholder="请输入" />
          </uni-form-item>
          <uni-form-item label="备注" type="textarea" align="left">
            <textarea v-model="form.remark" :maxlength="100" auto-height placeholder="请输入" />
          </uni-form-item>
        </uni-card>
        <!-- 合同附件信息 start -->
        <view class="card-title">合同附件信息</view>
        <uni-card isForm>
          <uni-form-item label="电子合同" class="file" isRequired>
            <uni-attachment v-model="form.electronicContractFileIds" :hasVideo="false" edit></uni-attachment>
          </uni-form-item>
          <uni-form-item label="纸质合同" class="file" isRequired>
            <uni-attachment v-model="form.paperContractFileIds" :hasVideo="false" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
        <!-- 合同附件信息end -->
        <view class="card-title">合同清单信息</view>
        <uni-card isForm>
          <uni-form-item label="合同清单明细" class="file" isRequired>
            <uni-attachment
              isExcel
              v-model="inventoryAttachment"
              @uploadListSuccess="handleSuccess"
              edit
            ></uni-attachment>
          </uni-form-item>
        </uni-card>
      </view>
      <view class="btn-wrapper">
        <button class="button" type="primary" :loading="isLoading" @click="handleLogSubmit">保存</button>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

var graceChecker = require('@/utils/graceChecker.js')
import contractType from '../../lib/contractType.js'
import Api from '@/api/agreement'
export default {
  data() {
    return {
      contractType: contractType,
      isLoading: false,
      inventoryAttachment: '', //清单明细
      form: {
        projectId: this.projectId,
        type: 2,
        status: 0,
        code: '',
        name: '',
        purchaseMode: '', //招采方式
        purchaseText: '', //招采方式文本
        guaranteePeriod: null, //保质期
        firstParty: '',
        firstPartyLinkman: '',
        firstPartyMobile: null,
        secondParty: '',
        secondPartyLinkman: '',
        secondPartyMobile: '',
        remark: '',
        creatorName: '',
        userCompanyName: '',
        userCompanyLinkman: '',
        userCompanyMobile: '',
        supervisionCompanyName: '',
        supervisionCompanyLinkman: '',
        supervisionCompanyMobile: '',
        projectLinkman: '',
        projectMobile: '',
        firstPartyEngineerLinkman: '',
        firstPartyEngineerMoblie: '',
        purchaseLinkman: '',
        purchaseMobile: '',
        supplyCompanyName: '',
        supplyCompanyLinkman: '',
        supplyCompanyMobile: '',
        supplyMaterialPeriod: null,
        electronicContractFileIds: '',
        paperContractFileIds: '',
        inventoryAttachmentIdList: [] //清单明细
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
      rule: [
        {
          name: 'code',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入合同编号'
        },
        {
          name: 'name',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入合同名称'
        },
        {
          name: 'name',
          checkType: 'lengthLt',
          checkRule: 20,
          errorMsg: '合同名称长度需小于'
        },
        {
          name: 'purchaseMode',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请选择招采方式'
        },
        {
          name: 'guaranteePeriod',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入质保期'
        },
        {
          name: 'guaranteePeriod',
          checkType: 'number',
          checkRule: '',
          errorMsg: '质保期必须是数字'
        },
        {
          name: 'firstParty',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入甲方名称'
        },
        {
          name: 'firstPartyLinkman',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入甲方联系人'
        },
        {
          name: 'firstPartyMobile',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '甲方联系人电话不能为空'
        },
        {
          name: 'firstPartyMobile',
          checkType: 'isMobile',
          checkRule: '',
          errorMsg: '电话格式不正确'
        },
        {
          name: 'secondParty',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入乙方名称'
        },
        {
          name: 'secondPartyLinkman',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请输入乙方联系人'
        },
        {
          name: 'secondPartyMobile',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '乙方联系人电话不能为空'
        },
        {
          name: 'secondPartyMobile',
          checkType: 'isMobile',
          checkRule: '',
          errorMsg: '电话格式不正确'
        },
        {
          name: 'userCompanyMobile',
          checkType: 'isMobile',
          checkRule: '',
          errorMsg: '使用单位电话格式不正确'
        },
        {
          name: 'supervisionCompanyMobile',
          checkType: 'isMobile',
          checkRule: '',
          errorMsg: '监理单位电话格式不正确'
        },
        {
          name: 'projectMobile',
          checkType: 'isMobile',
          checkRule: '',
          errorMsg: '项目负责人电话格式不正确'
        },
        {
          name: 'firstPartyEngineerMoblie',
          checkType: 'isMobile',
          checkRule: '',
          errorMsg: '甲方工程师电话格式不正确'
        },
        {
          name: 'purchaseMobile',
          checkType: 'isMobile',
          checkRule: '',
          errorMsg: '采购负责人电话格式不正确'
        },
        {
          name: 'supplyCompanyMobile',
          checkType: 'isMobile',
          checkRule: '',
          errorMsg: '甲供材单位联系人电话格式不正确'
        },
        {
          name: 'supplyMaterialPeriod',
          checkType: 'number',
          checkRule: '',
          errorMsg: '供货周期必须是数字'
        },
        {
          name: 'electronicContractFileIds',
          checkType: 'notnull',
          checkRule: '',
          errorMsg: '请上传电子版'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  methods: {
    // 选择合同类型
    handleContractClick() {
      let vm = this
      uni.showActionSheet({
        itemList: vm.contractType.map(e => e.label),
        success({ tapIndex }) {
          console.log(vm.contractType, tapIndex)
          let selectedItem = vm.contractType[tapIndex]
          vm.form.contract = selectedItem.value
          vm.form.contractText = selectedItem.label
        }
      })
    },
    // 选择招采方式
    handlePurchaseClick() {
      let vm = this
      uni.showActionSheet({
        itemList: vm.purchaseList.map(e => e.label),
        success({ tapIndex }) {
          let selectedItem = vm.purchaseList[tapIndex]
          vm.form.purchaseMode = selectedItem.value
          vm.form.purchaseText = selectedItem.label
        }
      })
    },
    async handleSuccess(id) {
      let res = await Api.addOrderFile({ fileId: id, contractId: this.contractId || '', nameCode: 10, contractType: 2 })
      this.form.inventoryAttachmentIdList = [res.data]
    },
    handleFormValid() {
      // 表单验证
      let isValid = true
      let checkRes = graceChecker.check(this.form, this.rule)
      if (!checkRes) {
        this.$utils.showToast(graceChecker.error)
        isValid = false
      }
      return isValid
    },
    async handleLogSubmit() {
      let valid = this.handleFormValid()
      if (!valid) return
      if (!this.form.electronicContractFileIds) {
        this.$utils.showToast('请上传电子版合同')
        return false
      }
      if (!this.form.paperContractFileIds) {
        this.$utils.showToast('请上传纸质版合同')
        return false
      }
      if (this.form.inventoryAttachmentIdList.length === 0) {
        this.$utils.showToast('请上传清单文件')
        return false
      }
      this.isLoading = true
      let res = await Api.addContract({ ...this.form, projectId: this.projectId })
      this.isLoading = false
      uni.navigateBack({ delta: 1 })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./add.less');
</style>
