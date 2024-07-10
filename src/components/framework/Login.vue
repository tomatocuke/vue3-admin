<template>
  <!-- 通过dialog最高层级z-index覆盖真实页面 -->
  <div  id="dialog-login" class="absolute-full"></div>

  <div id="login" class="absolute-center">
    <div class="title flex">
      <img src="../../assets/svg/logo.svg" alt="">
      <div class="cn">{{ title }}</div>
    </div>
    <el-input v-model="form.account" type="text" size="large" placeholder="账号"></el-input>
    <el-input v-model="form.password" type="password" size="large" placeholder="密码"></el-input>
    <el-button type="primary" size="large" @click="submit" :loading="loading">登&nbsp;&nbsp;录</el-button>
  </div>

</template>

<script>
import api from '@/util/api'
import storage from '@/assets/js/storage'

export default {
  data() {
    return {
      loading: false,
      title: VITE_APP_NAME,
      form: {
        account: '',
        password: '',
      },
    }
  },
  methods: {
    async submit() {
      if (this.form.account == '' || this.form.password == '') {
        alertWarning("请填写账号密码")
        return
      }
      this.loading = true
      let data = await api.Account.Login(this.form).finally(_=>{ this.loading = false })
      if (data) {
        storage.SetJson("admin", data)
        location.href = '/'
      }
    }
  }
}

</script>
  
<style lang="scss" scoped>
#dialog-login {
  background: linear-gradient(120deg, #E971AE, #3C96E4);
  // background-image: url('../../assets/img/bg_login.jpg');
  background-repeat: no-repeat;
}

.absolute-full {
  z-index: 999;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

#login {
  z-index: 1000;
  top: 40%;
  width: 360px;
  background-color: rgba(0, 0, 0, 0.45);
  padding: 20px 40px 35px;
  border-radius: 5px;
  text-align: center;
  color: #fff;
  font-size: 24px;

  &>div {
    margin-bottom: 20px;
  }
 
  .title {
    padding-bottom: 15px;
    img {
      width: 30%;
    }
    div {
      margin-top: 5px;
    }
    .en {
      font-size: 15px;
    }
  }
  .el-button {
    width: 100%;
  }
}

</style>