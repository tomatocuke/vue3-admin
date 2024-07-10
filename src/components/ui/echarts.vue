<template>
  <div id="echart" :style="{height: height}"></div>
</template>

<script>
import { watch } from 'vue';
import * as echarts from 'echarts/core';
import { GridComponent, TitleComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition, TitleComponent]);

export default {
  name: 'Echarts',
  props: {
    option: Object,
    height: String,
  },
  setup() {

    return {
      
    }
  },
  mounted() {
    var chartDom = document.getElementById('echart');
    var myChart = echarts.init(chartDom);

    watch(() => this.option.series[0].data, (newVal) => {
      myChart.setOption(this.option)
    })
  }
}
</script>
