
<template>
  <div >
    <div  >
      <Echarts :option="echartOption" height="450px" />
    </div>
    
  </div>

</template>

<script>
import Echarts from '@/components/ui/echarts.vue'
import api from '@/config/api'

const echartOption = {
  title: {
    text: '近7日数据'
  },
  xAxis: reactive({
    type: 'category',
    data: [],
  }),
  yAxis: {
    type: 'value'
  },
  series: reactive([
    {
      data: [],
      type: 'line'
    }
  ])
}

// 折线图
api.Home.Echarts().then(data => {
  if (data) {
    echartOption.xAxis.data = data.date
    echartOption.series[0].data = data.list
  }
})


export default {
  components: { Echarts },
  data() {
    return {
      echartOption,
    }
  },
  methods: {
    
  },
  activated() {
    log("重新进入首页，此周期不受缓存影响")
  },
  mounted() {

  }

}


</script>


<style lang="scss" scoped>


</style>