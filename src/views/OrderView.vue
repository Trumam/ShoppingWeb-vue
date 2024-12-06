<template>
  <div>
      <div class="search-bar">
          <el-input v-model="orderParams.cusAccount" placeholder="请输入顾客账号"></el-input>
          
          <el-button type="primary" @click="findBySearch()" style="margin-left: 10px;">查找</el-button>
          
      </div>
      <div class="order-table-container">
          <el-table
              :data="tableData"
              style="width: 100%"
              :header-cell-style="{
                  background: '#333852',
                  color: '#fff'
              }"
          >
              <el-table-column prop="cus_account" label="顾客账号" width="180"></el-table-column>
              <el-table-column prop="goods_id" label="商品ID" width="180"></el-table-column>
              <el-table-column prop="address_id" label="地址ID" width="180"></el-table-column>
              <el-table-column prop="order_date" label="下单时间" width="180"></el-table-column>
              <el-table-column prop="goods_number" label="商品数量" width="180"></el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope" class="operation-buttons">
                      <el-button type="primary" @click="ship(scope.row)">确认发货</el-button>
                      <el-popconfirm title="确定删除吗?" @confirm="del(scope.row)"style="margin-left: 10px;">
                          <el-button slot="reference" type="danger">删除</el-button>
                      </el-popconfirm>
                  </template>
              </el-table-column>
          </el-table>
      </div>
  </div>
</template>

<script>
import request from '@/utils/request.js';
import "@/assets/css/login.css";
import router from '@/router';
export default {
  data() {
      return {
          orderParams: {
              cusAccount: '',
              goodsName: '',
          },
          tableData: [],
          formLabelWidth: '120px',
      }
  },
  mounted() {
      this.loadOrders();
  },
  methods: {
      loadOrders() {
          request.get("/order/findAll").then(res => {
              this.tableData = res.data;
          })
      },
      findBySearch() {
          request.get("/order/search", {
              params: this.orderParams
          }).then(res => {
              if (res.code === '0') {
                  this.tableData = res.data;
              }
          })
      },
      del(order) {
          request.delete("/order/del/" + order.order_id).then(res => {
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
      ship(order) {
          // 这里添加付款逻辑
          // 假设付款成功后更新订单状态
          order.is_shipped = new Date();
          request.post('/order/updateship', order).then(res => {
              if (res.code === '0') {
                  this.$message({
                      message: '发货成功',
                      type: 'success'
                  });
                  this.loadOrders();
              } else {
                  this.$message({
                      message: res.msg,
                      type: 'error'
                  });
              }
          });
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

.order-table-container {
  margin-bottom: 15px;
}

.operation-buttons {
  display: flex;
  justify-content: space-between;
}
</style>