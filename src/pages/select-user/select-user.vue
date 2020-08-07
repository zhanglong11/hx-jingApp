<template>
  <div class="main">
    <uni-search-bar placeholder="搜索用户名" @input="handleInput"></uni-search-bar>
    <scroll-view class="scroll-roll" scroll-with-animation scroll-y :scroll-into-view="activeAlpha" @click.stop>
      <div class="group-list">
        <div v-for="group in computedList" :key="group.firstLetter" class="item">
          <h3 :id="group.firstLetter">{{ group.firstLetter }}</h3>
          <ul class="user-list">
            <li
              v-for="user in group.children"
              :key="user.id"
              :class="{ active: user.checked }"
              @click="handleClick(user)"
            >
              <div class="check"></div>
              <uni-avatar :user="user" :size="80"></uni-avatar>
              <div class="info">
                <p class="name">{{ user.name }}</p>
                <p class="depart">{{ user.organName }} / {{ user.roleName }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll-view>
    <aside class="alpha-list" @click.stop>
      <ul>
        <li v-for="e in computedList" :key="e.firstLetter" @click="activeAlpha = e.firstLetter">
          {{ e.firstLetter }}
          <div class="max">{{ e.firstLetter }}</div>
        </li>
      </ul>
    </aside>
    <!-- <footer v-if="multiple">
      <scroll-view class="footer-user-list" scroll-x>
        <ul>
          <li v-for="user in checkedList" :key="user.id" @click="remove(user)">
            <uni-avatar :user="user" :size="60"></uni-avatar>
            <uni-icons class="close" type="clear" color="red" size="16"></uni-icons>
          </li>
        </ul>
      </scroll-view>
      <button class="submit" size="mini" @click="submit">确定 ({{ checkedList.length }})</button>
    </footer> -->
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
      canChooseUserIdList: [],
      disabledUserIds: [],
      multiple: false,
      roles: []
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
      if (this.canChooseUserIdList.length) {
        list = list.filter(e => this.canChooseUserIdList.includes(e.userId))
      }
      if (this.disabledUserIds.length) {
        list = list.filter(e => !this.disabledUserIds.includes(e.userId))
      }
      if (this.roles.length) {
        list = this.list.filter(e => this.roles.includes(e.roleName))
      }
      let groupList = groupBy(list, 'firstLetter')
      const result = map(groupList, (v, k) => ({ children: v, firstLetter: k }))
      return sortBy(result, 'firstLetter')
    },
    checkedList() {
      return this.list.filter(e => e.checked)
    }
  },
  onLoad(option) {
    let list = cloneDeep(this.$store.state.project.userList)
    list.forEach(e => (e.checked = false))
    this.key = option.key
    this.multiple = option.multiple === 'true'
    this.roles = option.roles.split(',').filter(e => e)
    if (option.canChooseUserIds) {
      this.canChooseUserIdList = option.canChooseUserIds.split(',')
    }
    if (option.disabledUserIds) {
      this.disabledUserIds = option.disabledUserIds.split(',')
    }
    const checkedIds = option.checkedIds ? option.checkedIds.split(',') : []
    list.forEach(user => {
      if (checkedIds.includes('' + user.id)) {
        user.checked = true
      }
    })
    this.list = list
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'save') {
      this.submit()
    }
  },
  methods: {
    handleClick(f) {
      if (this.multiple) {
        f.checked = !f.checked
      } else {
        uni.$emit('update:select-user', { key: this.key, value: [f] })
        uni.navigateBack()
      }
    },
    handleInput({ value }) {
      this.q = value
    },
    remove(user) {
      user.checked = false
    },
    submit() {
      if (this.checkedList.length === 0) {
        this.$utils.showToast('请选择成员')
        return
      }
      uni.$emit('update:select-user', { key: this.key, value: this.checkedList })
      uni.navigateBack()
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./select-user.less');
</style>
