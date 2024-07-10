<template lang="">
  <div id="headbar" >
    <!-- 头像和昵称 -->
    <div class="account cursor-pointer">
      <el-dropdown @command="handleCommand">
        <span class="flex-center">
          <!-- 头像 -->
          <el-avatar :src="info.avatar || avatar" class="mr5"></el-avatar>
          <!-- 昵称 -->
          <span class="username mr5"> {{info.name}} </span>
        </span>

        <template #dropdown>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changePassword" v-if="canChangePassword">更改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 修改密码 -->

    <el-dialog id="changepwd" title="修改密码" v-model="dialogVisible" width="450px">
      <el-form label-width="100px" >
        <el-form-item label="账号">
          <span>{{info.account}}</span>
        </el-form-item>
        <!-- <el-form-item label="原密码">
          <el-input v-model="dialogData.old" type="password"></el-input>
        </el-form-item> -->
        <el-form-item label="新密码">
          <el-input v-model="dialogData.new" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码">
          <el-input v-model="dialogData.repeat" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <span ></span>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>

  <div id="headbar-clear"></div>
</template>

<script>

import avatar from '@/assets/img/avatar.png'
import api from '@/util/api'
import storage from '@/assets/js/storage'
import auth from '@/util/auth'

export default {
  props: {

  },
  data() {
    return {
      dialogVisible: false,
      dialogData: {},
      avatar: avatar,
      canChangePassword: api.Account?.ChangePassword !== undefined,
      info: auth.info,
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        storage.Remove("admin")
        location.href = '/login'
      } else if (command === 'changePassword') {
        this.dialogData = {}
        this.dialogVisible = true
      }
    },
    async changePassword() {
      if (!this.dialogData.new || this.dialogData.new.length < 4) {
        alertWarning("密码至少需4位数")
        return
      }
      if (this.dialogData.new !== this.dialogData.repeat) {
        alertWarning("两次密码不一致")
        return
      }
      let data = await api.Account?.ChangePassword({password: this.dialogData.new})
      if (data) {
        this.dialogVisible = false
        this.dialogData = {}
      }
    }
  },

}
</script>

<style lang="scss" scoped>
#headbar {
  position: fixed;
  top: 0;
  left: 220px;
  right: 0;
  padding: 10px;
  background: #FFF;
  border-bottom: 1px solid #DFDFDF;
  z-index: 998;
  .account {
    float: right;
  }
}

#headbar-clear {
  margin-top: 60px;
}

#changepwd {
  .el-input {
    max-width: 250px;
  }
}
</style>