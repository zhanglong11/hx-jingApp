<template>
  <div class="select-contract-inventory" @click="handleClick">
    <slot></slot>
  </div>
</template>
<script>
import { uniqueId } from 'lodash'
export default {
  name: 'SelectContractInventory',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    contractId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      key: ''
    }
  },
  created() {
    this.key = uniqueId('contractInventory_')
    uni.$on('update:select-contractInventory', data => {
      if (data.key === this.key) {
        this.$emit('change', data.value)
      }
    })
  },
  methods: {
    handleClick() {
      this.$utils.toUrl(
        `/pages/material/planList/selectContractInventory?contractId=${this.contractId}&key=${this.key}`
      )
    }
  }
}
</script>
<style lang="less" scoped>
</style>
