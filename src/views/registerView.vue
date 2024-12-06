<template>
    <div class="register">
        <div class="myregister">
            <h4>用户注册</h4>
            <el-form
            :model="cus"
            ref="cus"
            label-width="0px"
            >
                <!-- 姓名输入项 -->
                <el-form-item label="" prop="name" style="margin-top: 10px">
                    <el-row>
                    <el-col :span="2">
                        <span class="el-icon-s-custom"></span>
                    </el-col>
                    <el-col :span="22">
                        <el-input
                        class="inps"
                        placeholder="姓名"
                        v-model="cus.name"
                        >
                        </el-input>
                    </el-col>
                    </el-row>
                </el-form-item>
                <!-- 性别输入项 -->
                <el-form-item label="" prop="sex" style="margin-top: 10px">
                    <el-row>
                    <el-col :span="2">
                        <span class="el-icon-user"></span>
                    </el-col>
                    <el-col :span="22">
                        <el-input
                        class="inps"
                        placeholder="性别"
                        v-model="cus.sex"
                        >
                        </el-input>
                    </el-col>
                    </el-row>
                </el-form-item>
                <!-- 账号输入项 -->
                <el-form-item label="" prop="account" style="margin-top: 10px">
                    <el-row>
                    <el-col :span="2">
                        <span class="el-icon-s-promotion"></span>
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
                <!-- 注册按钮 -->
                <el-form-item style="margin-top: 30px">
                    <el-button type="primary" round class="registerBtn" @click="register()">
                    注册
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
  </template>
  
  <script>
  import request from '@/utils/request.js';
  import "@/assets/css/register.css"
  export default {
    name: "register",
    data: function () {
      return {
        cus:{}
      };
    },
   
    methods: {
      register() {
        request.post("/cus",this.cus).then(res =>{ 
            if(res.code === '0'){
                this.$message({
                    message:'注册成功',
                    type:'success'
                });
                this.$router.push('/');
            }else{
                this.$message({
                    message:res.msg,
                    type:'error'
                });
            }
        })
      },
    },
  };
  </script>
  
  