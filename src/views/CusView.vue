<template>
  <div>
    <div class="search-bar">
      <el-input v-model="params.name" placeholder="请输入姓名"></el-input>
      <el-input v-model="params.account" placeholder="请输入账号"></el-input>
      <el-button type="primary" @click="findBySearch()" style="margin-left: 10px;">查找</el-button>
      <el-button type="primary" @click="add()">新建</el-button>
    </div>
    <div class="cus-table-container">
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{
          background: '#333852',
          color: '#fff'
        }"
      >
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="sex" label="性别" width="180"></el-table-column>
        <el-table-column prop="account" label="账号" width="180"></el-table-column>
        <el-table-column prop="password" label="密码" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">  <!-- 使用'slot-scope'来定义作用域插槽，并将作用域变量命名为'scope' -->
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button type="primary" @click="rowClickHandler(scope.row)">日志</el-button>
            <el-popconfirm title="确定删除吗?" @confirm="del(scope.row)" style="margin-left: 10px;">
              <el-button slot="reference" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
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

<script>
import request from '@/utils/request.js';
// import "@/assets/css/login.css";
import router from '@/router';
export default {
  name: "cus",
  data() {
    return {
      params: {
        name: '',
        account: '',
      },
      tableData: [],
      dialogFormVisible: false,
      form: {},
      formLabelWidth: '120px',
    };
  },
  created() {
    // this.load();
    this.findBySearch();
  },
  methods: {
    load() {
      request.get("/cus").then(res => {
        this.tableData = res.data;
      });
    },
    findBySearch() {
      request.get("/cus/search", {
        params: this.params
      }).then(res => {
        if (res.code === '0') {
          this.tableData = res.data;
        }
      });
    },
    edit(obj) {
      this.form = obj;
      this.dialogFormVisible = true;
    },
    add() {
      this.form = {};
      this.dialogFormVisible = true;
      this.findBySearch();
    },
    del(cus) {
      request.delete("/cus/del/" + cus.id).then(res => {
        if (res.code === '0') {
          //表示删除操作成功，此时会通过this.$message方法弹出一个提示框
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.findBySearch();
        } else {
          //如果服务端返回的状态码不是'0'，则表示删除操作出现了问题
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      });
    },
    submit() {
      request.post("/cus", this.form).then(res => {
        if (res.code === '0') {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.findBySearch();
        } else {
          console.log("666");
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      });
    },
    rowClickHandler(row) {
      // 获取用户ID
      const userAccount = row.account;
      // 假设日志页面的路由地址是 /log/user/:id，这里根据用户ID构建具体的URL
      const logUrl = `/log?account=${userAccount}`;
      // 进行页面跳转，可以根据你的项目实际使用的路由跳转方式进行调整，这里假设使用Vue Router的 `push` 方法
      router.push(logUrl);
    }
  }
};
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  width: 600px;
}

.search-bar el-input {
  width: 150px!important; /* 设置输入框宽度为150px */
  margin-right: 10px;
}

.cus-table-container {
  margin-bottom: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.dialog-footer el-button {
  margin-left: 10px;
}

.operation-buttons {
  display: flex;
  justify-content: space-between;
}
</style>