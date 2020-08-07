<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="computedList.length" class="scroll-roll" scroll-y>
      <view class="main-body">
        <ul class="list card">
          <li v-for="item in computedList" :key="item.id" class="item" @click="handlePlanClick(item.id)">
            <p>{{ item.supplyPlanName }}</p>
          </li>
        </ul>
      </view>
    </scroll-view>
    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="computedList.length === 0" />
    <!-- 无数据空载页 end -->
  </view>
</template>

<script>
import { Api } from '@/api/material'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      planList: [],
      keyWords: '',
      form: {
        page: 1,
        projectId: '',
        rows: 999
      }
    }
  },

  onLoad(options) {
    this.init(options)
  },
  onShow() {
    this.getPartyListInfo()
  },
  computed: {
    ...mapGetters(['projectId']),
    computedList() {
      if (this.keyWords) {
        return this.planList.filter(item => {
          return (
            item.supplyPlanName.toLowerCase().includes(this.keyWords.toLowerCase()) ||
            item.createTime.toLowerCase().includes(this.keyWords.toLowerCase())
          )
        })
      } else {
        return [...this.planList]
      }
    }
  },

  methods: {
    init(options) {
      this.form.projectId = this.projectId
    },
    //关键词搜索
    handleSearchBarInput(e) {
      this.keyWords = e.value.trim()
    },
    // 计划单列表页
    async getPartyListInfo() {
      let res = await Api.getPartyList(this.form)
      this.planList = (res.data && res.data.records) || []
    },
    handlePlanClick(planId) {
      uni.$emit('update:list', { planId: planId })
      uni.navigateBack()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('list.less');
</style>
