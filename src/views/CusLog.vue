<template>
    <div>
      <div v-if="logs && logs.length > 0">
        <ul>
          <li v-for="log in logs" :key="log.log_id">
            <!-- 使用 div 块将每条日志信息括起来 -->
            <div class="log-block">
              <div class="log-item">
                <p>日志 ID：{{ log.log_id }}</p>
                <p>商品 ID: {{ log.goods_id }}</p>
                <p>客户账号：{{ log.cus_account }}</p>
                <p>日志时间：{{ formatDate(log.log_date) }}</p>
                <p>操作类型：{{ log.behavior_type }}</p>
                <p>商品数量：{{ log.goods_num }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>
        暂无日志数据。
      </div>
    </div>
  </template>
  
  <script>
  import request from '@/utils/request.js';
  import router from '@/router';
  export default {
    data() {
      return {
        logs: [],
        userAccount: ''
      };
    },
    mounted() {
      this.loadOrders();
    },
    methods: {
      loadOrders() {
        this.userAccount = this.$route.query.account;
        console.log(this.userAccount);
        request.get('/log/selectByAccount/' + this.userAccount).then(res => {
          if (res.code === '0') {
            this.logs = res.data;
          } else {
            console.error(res.msg);
          }
        });
      },
      formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleString();
      }
    }
  };
  </script>
  
  <style scoped>
  /* 为新添加的日志块添加样式 */
  .log-block {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  .dot {
    margin-right: 5px;
  }
  .green-dot {
    color: green;
  }
  .gray-dot {
    color: gray;
  }
  .order-item {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  .el-button[disabled] {
    display: none!important;
  }
  .order-details-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>