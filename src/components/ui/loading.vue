<template>
  <div v-show="loading" v-loading="true" class="absolute-full" :element-loading-text="text"></div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String, 
      default: 'Loading...'
    },
  },
}
</script>

<style scoped>
.absolute-full {
  z-index: 999;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>