<template>
  <div>
      <div class="search-bar">
          <el-input v-model="params.name" placeholder="请输入商品名"></el-input>
          <el-input v-model="params.category" placeholder="请输入类别"></el-input>
          <el-button type="primary" @click="findBySearch()" style="margin-left: 10px;">查找</el-button>
          <el-button type="primary" @click="add()">新建</el-button>
      </div>
      <div class="goods-table-container">
          <el-table
              :data="tableData"
              style="width: 100%"
              :header-cell-style="{
                  background: '#333852',
                  color: '#fff'
              }"
          >
              <el-table-column label="照片">
                  <template v-slot="scope">
                      <el-image
                              style="width: 100px; height: 100px"
                              :src="'http://47.120.25.179:8080/files/' + scope.row.picture"
                              :preview-src-list="['http://47.120.25.179:8080/files/' + scope.row.picture]">
                      </el-image>
                  </template>
              </el-table-column>
              <el-table-column prop="name" label="商品名" width="180"></el-table-column>
              <el-table-column prop="price" label="价格" width="100"></el-table-column>
              <el-table-column prop="describe" label="描述" width="360"></el-table-column>
              <el-table-column prop="category" label="类别" width="100"></el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope" class="operation-buttons">
                      <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
                      <el-popconfirm title="确定删除吗?" @confirm="del(scope.row)"style="margin-left: 10px;">
                          <el-button slot="reference" type="danger">删除</el-button>
                      </el-popconfirm>
                  </template>
              </el-table-column>
          </el-table>
      </div>
      <div>
          <el-dialog title="填写" :visible.sync="dialogFormVisible">
              <el-form :model="form">
                  <el-form-item label="商品名" :label-width="formLabelWidth">
                      <el-input v-model="form.name" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="照片" :label-width="formLabelWidth">
                      <el-upload
                              action="http://47.120.25.179:8080/files/upload"
                              :on-success="successUpload"
                      >
                          <el-button size="small" type="primary">点击上传</el-button>
                      </el-upload>
                  </el-form-item>
                  <el-form-item label="价格" :label-width="formLabelWidth">
                      <el-input v-model="form.price" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="描述" :label-width="formLabelWidth">
                      <el-input v-model="form.describe" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="类别" :label-width="formLabelWidth">
                      <el-input v-model="form.category" autocomplete="off"></el-input>
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
import router from '@/router';
export default {
  name: "goods",
  data() {
      return {
          params: {
              name: '',
              category: '',
          },
          tableData: [],
          dialogFormVisible: false,
          form: {},
          formLabelWidth: '120px',
      }
  },
  created() {
      // this.load();
      this.findBySearch();
  },
  methods: {
      load() {
          request.get("/goods").then(res => {
              this.tableData = res.data;
          })
      },
      findBySearch() {
          request.get("/goods/search", {
              params: this.params
          }).then(res => {
              if (res.code === '0') {
                  this.tableData = res.data;
              }
          })
      },
      edit(obj) {
          this.form = obj;
          this.dialogFormVisible = true;
      },
      add() {
          this.form = {};
          this.dialogFormVisible = true;
          this.findBySearch();
          console.log("add");
          
      },
      del(goods) {
          request.delete("/goods/del/" + goods.id).then(res => {
            console.log(this.form.id);
              if (res.code === '0') {
                  this.$message({
                      message: '删除成功',
                      type: 'success'
                  });
                  this.findBySearch();
              } else {
                  this.$message({
                      message: res.msg,
                      type: 'error'
                  });
              }
          })
          
      },
      submit() {
        request.post("/goods", this.form).then(res => {
            if (res.code === '0') {
            this.$message({
                message: '操作成功',
                type: 'success'
            });
            this.dialogFormVisible = false;
            this.findBySearch();
            } else {
            this.$message({
                message: res.msg,
                type: 'error'
            });
            }
        });
        },
      successUpload(res) {
          console.log(res)
          this.form.picture = res.data;
      }
  }
}
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

.goods-table-container {
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