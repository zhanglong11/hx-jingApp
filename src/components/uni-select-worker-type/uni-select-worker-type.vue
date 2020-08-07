<template>
  <textarea
    :value="value"
    auto-height
    :maxlength="-1"
    class="align-right"
    :placeholder="placeholder"
    disabled
    @click="jump"
  />
</template>

<script>
export default {
  props: {
    // 默认值
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: {
      type: Boolean,
      default: true
    },
    // 默认选中项
    ids: {
      type: String,
      default: ''
    },
    // 数据格式化
    propsSelect: {
      type: Object,
      default() {
        return {
          workType: 'workTypeId',
          name: 'constructionPersonName',
          id: 'constructionPersonId'
        }
      }
    }
  },
  data() {
    return {
      key: ''
    }
  },
  created() {
    this.key = _.uniqueId('user_')
    uni.$on('update:select-worker-type', ({ key, value }) => {
      if (key === this.key) {
        //  value  未分组处理的元数据
        let checkedList = this.formatterSelected(value)
        this.$emit('update:ids', _.map(checkedList, this.propsSelect.id).join(','))
        this.$emit('input', _.map(checkedList, this.propsSelect.name).join(','))
        let groupData = _.groupBy(checkedList, item => {
          return item[this.propsSelect.workType]
        })

        let result = _.map(groupData, (value, key) => {
          return {
            workType: key,
            children: value
          }
        })
        this.$emit('change', result)
      }
    })
  },
  methods: {
    formatterSelected(data) {
      let result = _.map(data, item => {
        let formatterItem = {}
        formatterItem.workTypeName = this.$getLabelFromArg('workType', item.workType)
        _.forEach(this.propsSelect, (v, k) => {
          formatterItem[v] = item[k]
        })
        return formatterItem
      })
      return result
    },
    jump() {
      this.$utils.toUrl(
        `/pages/select-worker-type/select-worker-type?key=${this.key}&multiple=${this.multiple}&checkedIds=${this.ids}`
      )
    }
  }
}
</script>

<style lang="less" scoped></style>
