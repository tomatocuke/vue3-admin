<template>
  <el-date-picker type="daterange" :teleported="false" 
    value-format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" 
    v-model="data[prop]" 
    :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]" 
    :default-value="daterangeDefault()" 
    :shortcuts="daterangeShortcuts" 
    :disabled-date="daterangeDisable"  />
</template>


<script>
import timer from '@/assets/js/timer'

export default {
  props: {
    data: Object,
    prop: String,
  },
  data() {
    return {
      now: new Date(),
      daterangeShortcuts: getDaterangeShortcuts(),
    }
  },
  activated() {
    // 重进入页面时，检测是否日期变化
    let now = new Date()
    if (this.now.getDate() != now.getDate()) {
      this.now = now
      this.daterangeShortcuts = getDaterangeShortcuts()
    }
  },
  methods: {
    // 禁止选择超过今日
    daterangeDisable(maybeDate) {
      return maybeDate.getTime() > this.now
    },
    // 打开组件时显示上个月和本月（默认为当月和下个月）
    daterangeDefault() {
      return new Date(this.now.getFullYear(), this.now.getMonth() - 1, 1, 0, 0, 0)
    },

  }
}

function getDaterangeShortcuts() {
  let todayEnd = timer.New().DayEnd().Date()
  let yesterday = timer.New().AddDay(-1)
  return [
    { text: '今天', value: [timer.New().DayStart().Date(), todayEnd] },
    { text: '昨天', value: [yesterday.DayStart().Date(), yesterday.DayEnd().Date()] },
    { text: '最近7天', value: [timer.New().AddDay(-6).DayStart().Date(), todayEnd] },
    { text: '最近30天', value: [timer.New().AddDay(-29).DayStart().Date(), todayEnd] },
  ]
}
</script>