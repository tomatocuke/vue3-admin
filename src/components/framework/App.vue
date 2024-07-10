<template>
  <!-- 登录页面 -->
  <Login v-if="!isLogin" />

  <!-- 菜单栏 -->
  <div id="left" v-if="isLogin">
    <Menubar />
  </div>
  <!-- 主体 -->
  <div id="right" v-if="isLogin">
    <!-- 头部 -->
    <Headbar />
    <!-- 菜单选项卡 -->
    <MenuTab />
    <!-- 主体 有缓存的路由页面-->
    <div id="container" >
      <router-view v-slot="{ Component }">
        <keep-alive :include="routerCache">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>

</template>


<script>
import router from '@/router/cache'
import Login from '@/components/framework/Login.vue'
import Loading from '@/components/ui/loading.vue'
import Menubar from '@/components/framework/Menubar.vue'
import Headbar from '@/components/framework/Headbar.vue'
import MenuTab from '@/components/framework/Menutab.vue'
import auth from '@/config/auth'

export default {
  name: "app",
  components: { Login, Loading, Menubar, Headbar, MenuTab },
  data() {
    return {
      isLogin: auth.isLogin && location.pathname !== '/login',
      routerCache: router.Cache,
    }
  },
}

</script>

<style lang="scss">
#app {
  display: flex;
  height: 100%;
}

#left {
  height: 100%;
  width: 220px;
  background: #001628;
}

#right {
  overflow-x: hidden;
  flex: 1;
}

#container {
  padding: 15px;
  margin: 15px;
  background-color: #FFF;
}
</style>