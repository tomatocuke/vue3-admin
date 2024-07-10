<template>
  <div id="logo" >
    <img src="../../assets/svg/logo.svg" alt="">
  </div>
  <el-menu
    id="menubar"
    unique-opened
    background-color="transparent"
    active-text-color="#FFF"
    :default-active="menu.current"
    >
    <!-- 菜单来源于App.vue -->
    <template v-for="(item, i) in menus">
      <!-- 带展开栏的 -->
      <el-sub-menu v-if="!item.hidden && item.children && item.children.length > 0 && item.children[0].path " class="menu-item" :key="i" :index="item.path || i.toString()">
        <template #title>
          <component class="el-icon" :is="item.icon??''"></component>
          <span>{{item.name}}</span>
        </template>
        <el-menu-item v-for="(child, j) in item.children" class="menu-item" :key="j" :index="child.path || j.toString()"  @click="matchTab">
          <span>{{child.name}}</span>
        </el-menu-item>
      </el-sub-menu>
      <!-- 不带展开栏的 -->
      <el-menu-item v-else-if="!item.hidden" :key="0-i" class="menu-item" :index="item.path"  @click="matchTab">
        <component class="el-icon" :is="item.icon??''"></component>
        <span>{{item.name}}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import router from '@/router/cache'
import auth from '@/util/auth'
import global from '@/util/global'

export default {
  name: 'menubar',
  props: { 
   
  },
  data() {
    return {
      menus: auth.menus,
      menu: global.menu,
    }
  },
  mounted() {
    this.matchTab({index: location.pathname })
  },
  methods: {
    // 当前菜单匹配标签页
    matchTab(menu) {
      if (!this.menus) {
        alertWarning("菜单加载失败")
        return 
      }

      if (location.pathname == '/') {
        setTimeout(() => { this.matchTab({index: location.pathname}) }, 500)
      }

      let path = menu.index

      if (path == '/' || path == '/login') {
        return
      }

      let match, menus
      for (let i = 0; i < this.menus?.length; i++) {
        if (this.menus[i].children?.length > 0 && this.menus[i].children[0].path) {
          menus = this.menus[i].children
        } else {
          menus =  [this.menus[i]]
        }
        for (let j = 0; j < menus.length; j++) {
          if (path === menus[j].path) {
            match = menus[j]
            break
          }
        }
        if (match) {
          break
        }
      }
      if (match) {
        // 添加页面缓存
        router.AddCache(path)
        global.menu.current = path
        global.menu.tabs[path] = match
      } else {
        log("未匹配到路径:" + path)
      }
      
      this.$router.push(path)
    },
  
  },
  
}
</script>

<style lang="scss" scoped>
#logo {
  --header-height: 60px;
  height: var(--header-height);
  line-height: var(--header-height);
  width: 100%;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  background: #002140;
  text-align: center;
}
#logo img {
  height: 48px ;
}
#menubar {
  border-right: 1px solid #001628;
  .menu-item {
    * {
      color: #FFF;
      opacity: 0.7;
      font-weight: 500;
      font-size: 15px;
    }
    svg {
      font-size: 20px;
      margin-left: 10px;
    }
    &:hover > * {
      opacity: 1;
      font-weight: 800;
    }
    &:deep(.el-sub-menu__icon-arrow) {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.7);
    }
    .el-menu-item {
      background: #000D17;
      padding-left: 62px; /*右移*/
    }
    
  }
  .el-menu-item.is-active {
    background: #1890ff;
    border-radius: 5px;
    opacity: 1;
  }
}
</style>