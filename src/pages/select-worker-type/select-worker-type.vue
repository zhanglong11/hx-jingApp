<template>
  <div class="main">
    <uni-search-bar placeholder="搜索用户名" @input="handleInput"></uni-search-bar>
    <scroll-view class="scroll-roll" scroll-with-animation scroll-y :scroll-into-view="activeAlpha" @click.stop>
      <div class="group-list">
        <div v-for="group in computedList" :key="group.workType" class="item">
          <h3 :id="group.workType">{{ group.argText }}</h3>
          <ul class="user-list">
            <li
              v-for="user in group.children"
              :key="user.id"
              :class="{ active: user.checked, 'is-disabled': !user.workType }"
              @click="handleClick(user)"
            >
              <div class="check"></div>
              <uni-avatar :user="user" :size="80"></uni-avatar>
              <div class="info">
                <p class="name">{{ user.name }}</p>
                <p class="depart">{{ user.groupName }} / {{ user.labourCompanyName }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import { groupBy, sortBy, map, cloneDeep } from 'lodash'
export default {
  name: 'SelectUser',
  data() {
    return {
      q: '',
      activeAlpha: '',
      key: '',
      list: [],
      multiple: false,
      checkedIds: []
    }
  },
  computed: {
    computedList() {
      let list
      if (this.q) {
        list = this.list.filter(e => e.name.includes(this.q))
      } else {
        list = this.list
      }
      let groupList = groupBy(list, item => {
        return item.workType || '#'
      })

      const result = map(groupList, (v, k) => ({
        children: v,
        workType: k,
        argText: this.$getLabelFromArg('workType', k)
      }))
      return sortBy(result, 'workType')
    },
    checkedList() {
      return this.list.filter(e => e.checked)
    }
  },
  onLoad(option) {
    this.key = option.key
    this.multiple = option.multiple === 'true'
    this.checkedIds = option.checkedIds ? option.checkedIds.split(',') : []
  },
  onShow() {
    // 获取所有的劳务人员
    this.fly.labour
      .post('employee/list', {
        page: 1,
        jobStatus: 'jobStatus_1',
        rows: 100000,
        projectId: wx.getStorageSync('projectId')
      })
      .then(res => {
        res.data.records.forEach(e => (e.checked = this.checkedIds.includes(e.id)))
        this.list = res.data.records
      })
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'save') {
      this.submit()
    }
  },
  methods: {
    handleClick(f) {
      if (!f.workType) return
      if (this.multiple) {
        f.checked = !f.checked
      } else {
        uni.$emit('update:select-worker-type', {
          key: this.key,
          value: [f]
        })
        uni.navigateBack()
      }
    },
    handleInput({ value }) {
      this.q = value
    },
    submit() {
      if (this.checkedList.length === 0) {
        this.$utils.showToast('请选择成员')
        return
      }
      uni.$emit('update:select-worker-type', { key: this.key, value: this.checkedList })
      uni.navigateBack()
    }
  }
}
</script>

<style lang="less" scoped>
@import '../select-user/select-user.less';
</style>
