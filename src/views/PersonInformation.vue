<template>
    <div>
        <div style="padding: 20px;">
            <h1>欢迎，{{this.userDate.name}} !</h1>
            <p>邮箱：{{this.userDate.account}}</p>
            <p>性别：{{this.userDate.sex}}</p>
            <el-button type="primary" @click="editInfo">修改个人信息</el-button>

            <el-popconfirm title="确定退出登录吗?" @confirm="logout">
                <el-button slot="reference" type="warning">退出登录</el-button>
            </el-popconfirm>

            <el-popconfirm title="确定删除吗?" @confirm="deleteAccount()">
                <el-button slot="reference" type="danger">注销账号</el-button>
            </el-popconfirm>
        </div>
        <div>
            <el-dialog title="填写" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth">
                    <el-input v-model="form.sex" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="账号" :label-width="formLabelWidth">
                    <el-input v-model="form.account" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
  
  <style>
  /* 可以添加一些样式来美化页面 */
  </style>
  
  <script>
  import request from '@/utils/request.js';
  import router from '@/router';
  export default {
    data() {
      return {
        userAccount: JSON.parse(localStorage.getItem('userAccount')||'{}'),
        userDate:{},
        dialogFormVisible: false,
        form: [],
      };
    },
    mounted() {
        this.loadUserData();
    },
    methods: {
        loadUserData(){
            request.get('/cus/searchByAccount/' + this.userAccount).then(res => {
                this.userDate = res.data;
            });
        },
        logout() {
            // 实现退出登录逻辑，清除本地存储的用户信息等
            localStorage.removeItem('userAccount');
            // 跳转到登录页面或其他操作
            this.$router.push('/');
        },
        editInfo(){
            this.form = this.userDate;
            this.dialogFormVisible = true;
        },
        deleteAccount() {
            // 实现注销账号逻辑，可能需要向后端发送请求
            request.delete("/cus/del/"+ this.userDate.id).then(res=>{
            if(res.code === '0'){
                this.$message({
                    message:'删除成功',
                    type:'success'
                });
            }else{
                this.$message({
                    message:res.msg,
                    type:'error'
                });
            }
            logout();
        })
            
        },
        submit() {
        request.post("/cus", this.form).then(res => {
            if (res.code === '0') {
            this.$message({
                message: '操作成功',
                type: 'success'
            });
            this.dialogFormVisible = false;
            this.loadUserData();
            } else {
            this.$message({
                message: res.msg,
                type: 'error'
            });
            }
        });
        },
    }
  };
  </script>