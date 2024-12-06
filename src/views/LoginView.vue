<template>
  <div>
    <div class="login">
      <div class="mylogin">
        <h4>商城登录</h4>
        <el-form
          :model="cus"
          :rules="loginRules"
          ref="cus"
          label-width="0px"
        >
        <!-- 账号输入项 -->
          <el-form-item label="" prop="account" style="margin-top: 10px">
            <el-row>
              <el-col :span="2">
                <span class="el-icon-s-custom"></span>
              </el-col>
              <el-col :span="22">
                <el-input
                  class="inps"
                  placeholder="账号"
                  v-model="cus.account"
                >
                </el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 密码输入项 -->
          <el-form-item label="" prop="password">
            <el-row>
              <el-col :span="2">
                <span class="el-icon-lock"></span>
              </el-col>
              <el-col :span="22">
                <el-input
                  class="inps"
                  type="password"
                  placeholder="密码"
                  v-model="cus.password"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item style="margin-top: 5px">
            <!-- <router-link to="/cus"> -->
            <el-button type="primary" round class="submitBtn" @click="login()">
              登录
            </el-button>
            <!-- </router-link> -->
          </el-form-item>
          <div class="unlogin">
            <!-- <router-link :to="{ path: '/forgetpwd' }"> 忘记密码? </router-link>
            | -->
            <router-link :to="{ path: '/register' }">注册新账号</router-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapMutations } from "vuex";
import request from '@/utils/request.js';
import "@/assets/css/login.css"
export default {
  name: "Login",
  data: function () {
    return {
      cus:{},
      // cus: {
      //   account: "",
      //   passWord: "",
      // },
      loginRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
 
  methods: {
    // ...mapMutations(["changeLogin"]),
    login() {
      const userAccount = this.cus.account;
      const userPassword = this.cus.password;
      if (!userAccount) {
        return this.$message({
          type: "error",
          message: "账号不能为空！",
        });
      }
      if (!userPassword) {
        return this.$message({
          type: "error",
          message: "密码不能为空！",
        });
      }
      if(userAccount&&userPassword){
        if(userAccount == "11"){
          request.post("/cus/login",this.cus).then(res=>{
          if(res.code === '0'){
            this.$router.push({path: '/Layout'});
            this.$message({
            message:'管理员登录成功！',
            type:'success'
          });
          }else{
            this.$message({
              message:res.msg,
              type:'error'
            });
          }
        })
        }else{
          request.post("/cus/login",this.cus).then(res=>{
          if(res.code === '0'){
            this.$router.push({path: '/ShopLayout'});
            this.$message({
            message:'用户登录成功！',
            type:'success'
            });
          }else{
            this.$message({
              message:res.msg,
              type:'error'
            });
          }
        })
        }
        localStorage.setItem('userAccount', JSON.stringify(userAccount));
      } 
    },
  },
};
</script>

