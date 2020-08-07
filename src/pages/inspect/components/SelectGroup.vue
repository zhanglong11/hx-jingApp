<template>
  <div>
    <view class="label" :class="{ placeholder: !Boolean(text) }" @click="show">
      {{ text || placeholder }}
    </view>
    <w-picker
      ref="picker"
      mode="linkage"
      :level="2"
      default-type="value"
      :options="options"
      :value="computedValue"
      @confirm="change"
    ></w-picker>
  </div>
</template>

<script>
import wPicker from '@/components/w-picker/w-picker'
import _ from 'lodash'
export default {
  name: 'SelectGroup',
  components: { wPicker },
  props: {
    placeholder: {
      type: String,
      default: '请选择'
    },
    value: {
      default: null
    }
  },
  data() {
    return {
      options: [],
      flatList: []
    }
  },
  computed: {
    text() {
      let target = _.find(this.flatList, { value: this.value })
      if (target) {
        return target.name
      } else {
        return ''
      }
    },
    computedValue() {
      let target = _.find(this.flatList, { value: this.value })
      if (target) {
        return [target.labourCompanyName, this.value]
      } else {
        return []
      }
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.fly.labour.get('group/baseList/' + localStorage.getItem('projectId')).then(res => {
        this.flatList = res.data
        res.data.forEach(e => {
          e.value = e.id
          e.label = e.name
        })
        this.options = _.chain(res.data)
          .groupBy('labourCompanyName')
          .map((v, k) => ({
            label: k,
            value: k,
            children: v
          }))
          .values()
          .value()
      })
    },
    change(e) {
      let value = e.value
      if (value.length === 2) {
        let target = _.find(this.flatList, { id: e.value[1] })
        this.$emit('input', value[1])
        this.$emit('update:principal', target.principal)
        this.$emit('update:principalName', target.principalName)
        this.$emit('update:name', target.name)
      }
    },
    show() {
      this.$refs.picker.show()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.placeholder {
  color: @placeholderColor;
}
</style>
