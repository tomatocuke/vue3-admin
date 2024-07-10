<template>
  <div @click="clipboard">
    <el-tooltip :content="content" placement="top" :show-after="600" >
      <div type="text" :class="{'cursor-pointer': copy, 'overflow-dot': true, }" >{{content}}</div>
    </el-tooltip>
  </div>
</template>

<script>

export default {
  name: 'tooltip',
  props: {
    content: String || Number,
    copy: Boolean,
  },
  methods: {
    clipboard() {
      navigator.clipboard.writeText(this.content).then(_=>{
        alertSuccess('已复制')
      })
    }
  }
}
</script>

<style scoped>

</style>
