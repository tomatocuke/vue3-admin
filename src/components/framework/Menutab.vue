<template>
  <el-tabs
    v-model="menu.current"
    type="card"
    closable
    @tab-remove="removeTab"
    @tab-change="clickTab"
    style="background-color: #FFF;"
  >
    <template v-for="item in menu.tabs" :key="item.name">
      <el-tab-pane :label="item.name" :name="item.path">
        <!-- {{ item.content }} -->
      </el-tab-pane>
      
    </template>
    
  </el-tabs>
</template>

<script>

import global from '@/util/global'
import router from '@/router/cache'

export default {
  props: {

  },
  data() {
    return {
      menu: global.menu,
    }
  },
  methods: {
    clickTab(path) {
      this.$router.push(path)
    },
    removeTab (path) {
      let paths = Object.keys(this.menu.tabs)
      // 移除当前标签时, 优先进入右边的标签页，次选进入左边的标签页
      let idx = paths.indexOf(path)
      let leftIdx = idx-1, rightIdx = idx+1
      if (rightIdx < paths.length) {
        global.menu.current = paths[rightIdx]
      } else if (leftIdx >= 0) {
        global.menu.current = paths[leftIdx]
      }

      // 删除tab
      delete(global.menu.tabs[path])

      // 删除页面缓存
      router.RemoveCache(path)
    }
  }
}

</script>
