<template>
    <div>
      <div v-if="orders && orders.length > 0">
        <ul>
          <li v-for="order in orders" :key="order.order_id">
            <div class="order-item" @click="showOrderDetails(order)">
              
              <p>订单 ID：{{ order.order_id }}</p>
              <p>客户账号：{{ order.cus_account }}</p>
              <p>下单时间：{{ formatDate(order.order_date) }}</p>
              <p>商品名称：{{ order.goods_name }}</p>
              <p>商品数量：{{ order.goods_number }}</p>
              <p>商品总价：{{ order.goods_price*order.goods_number }}</p>
              <p>订单状态：{{showStatus(order)}}</p>
              <p>
                <el-button type="primary" :disabled="order.is_paid" @click="payForOrder(order)" @click.stop>付款</el-button>
                <el-button type="primary" :disabled="order.is_received||!order.is_shipped" @click="received(order)" @click.stop>签收</el-button>
                <el-button type="primary" :disabled="order.is_completed||!order.is_received" @click="showVerification(order)" @click.stop>订单完成</el-button>
                <el-button type="danger" @click="deleteOrder(order)" @click.stop>删除</el-button>
              </p>
              

            </div>
          </li>
        </ul>
      </div>
      <div v-else>
        暂无订单数据。
      </div>
      <div v-if="showCodeInput">
        <el-dialog title="订单详情" :visible.sync="showCodeInput" @close="closeVerification">
          <div>
            <div>
              <input type="text" v-model="enteredCode">
            </div>
            <div>
              <span style="color: blue; cursor: pointer" @click="sendVerificationCode">发送验证码</span>
            </div>
          </div>
          <div>
            <el-button type="primary" @click="verifyCode">验证</el-button>
          </div>
        </el-dialog>
      </div>
      <div v-if="selectedOrder">
        <el-dialog title="订单详情" :visible.sync="showDetailsModal" @close="closeDetailsModal">

          <p>订单 ID：{{ selectedOrder.order_id }}</p>
          <p>下单时间：{{ formatDate(selectedOrder.order_date) }}</p>
          <p>客户账号：{{ selectedOrder.cus_account }}</p>

          <p>收货人名：{{ selectedOrder.recipient_name }}</p>
          <p>收货地址：{{ selectedOrder.detailed_address }}</p>
          <p>收货人电话：{{ selectedOrder.phone_number }}</p>

          <p>商品 ID：{{ selectedOrder.goods_id }}</p>
          <p>商品名称：{{ selectedOrder.goods_name }}</p>
          <p>商品单价：{{ selectedOrder.goods_price }}</p>
          <p>商品数量：{{ selectedOrder.goods_number }}</p>
          <p>商品总价：{{ selectedOrder.goods_price*selectedOrder.goods_number }}</p>
          <p>订单状态：{{showStatus(selectedOrder)}}</p>


          <p>
            <span v-if="selectedOrder.is_paid">
              <span class="dot green-dot">&#9679;</span>是否支付：是，支付时间：{{ formatDate(selectedOrder.is_paid) }}
            </span>
            <span v-else>
              <span class="dot gray-dot">&#9679;</span>是否支付：否
            </span>
          </p>
          <p>
            <span v-if="selectedOrder.is_shipped">
              <span class="dot green-dot">&#9679;</span>是否发货：是，发货时间：{{ formatDate(selectedOrder.is_shipped) }}
            </span>
            <span v-else>
              <span class="dot gray-dot">&#9679;</span>是否发货：否
            </span>
          </p>
          <p>
            <span v-if="selectedOrder.is_received">
              <span class="dot green-dot">&#9679;</span>是否签收：是，签收时间：{{ formatDate(selectedOrder.is_received) }}
            </span>
            <span v-else>
              <span class="dot gray-dot">&#9679;</span>是否签收：否
            </span>
          </p>
          <p>
            <span v-if="selectedOrder.is_completed">
              <span class="dot green-dot">&#9679;</span>是否完成：是，完成时间：{{ formatDate(selectedOrder.is_completed) }}
            </span>
            <span v-else>
              <span class="dot gray-dot">&#9679;</span>是否完成：否
            </span>
          </p>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeDetailsModal">关闭</el-button>
          </div>
        </el-dialog>
      </div>
      <div>
        <el-dialog title="付款界面(二维码为调查问卷)" :visible.sync="paidVisible"center="true">
            <div style="text-align: center;">  
                <img src="../assets/imgs/code.png" alt="支付二维码" style="width: 300px; height: 300px;">
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="paidFail()">取 消</el-button>
                <el-button type="primary" @click="paidSucc()">付款完成</el-button>
            </div>
        </el-dialog>
      </div>
    </div>
  </template>
  
  <script>
  import request from '@/utils/request.js';
  import router from '@/router';
  export default {
    data() {
      return {
        orders: [],
        user: JSON.parse(localStorage.getItem('userAccount') || '{}'),
        selectedOrder: null,
        showDetailsModal: false,

        showCodeInput: false,
        enteredCode: '',
        verificationCode: null, // 存储后端生成的验证码
        order:{},
        paidVisible: false,
        paidOrder:{},
      };
    },
    mounted() {
      this.loadOrders();
    },
    methods: {
      loadOrders() {
        request.get('/order/selectAllInfo/' + this.user).then(res => {
          if (res.code === '0') {
            this.orders = res.data;
          } else {
            console.error(res.msg);
          }
        });
      },
      formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleString();
      },
      showOrderDetails(order) {
        this.selectedOrder = order;
        this.showDetailsModal = true;
      },

      closeDetailsModal() {
        //this.selectedOrder = null;
        this.showDetailsModal = false;
      },
      payForOrder(order){
        this.paidVisible = true;
        this.paidOrder = order;
      },
      paidFail(){
        this.paidVisible = false;
      },
      paidSucc() {
        // 这里添加付款逻辑
        // 假设付款成功后更新订单状态
        this.paidOrder.is_paid = new Date();
        this.addLog(this.paidOrder);
        request.post('/order/updatepaid', this.paidOrder).then(res => {
          if (res.code === '0') {
            this.$message({
              message: '付款成功',
              type: 'success',
            });
            this.loadOrders();
          } else {
            this.$message({
              message: res.msg,
              type: 'error',
            });
          }
        });
        this.paidVisible = false;
        this.paidOrder={};
      },
      addLog(item){
        const log = {
          cus_account : this.user,
          goods_id : item.goods_id, 
          log_date : new Date(), 
          behavior_type : "purchase",
          goods_num: item.goods_number,
        };
        request.post("/log/add",log).then(res =>{
          if(res.code === '0'){
            this.$message({
            message:'成功添加购买日志',
            type:'success'
            });
          }else{
            this.$message({
            message:res.msg,
            type:'error'
            });
          }
        });
      },
      received(order) {
        order.is_received = new Date();
        request.post('/order/updatereceived', order).then(res => {
          if (res.code === '0') {
            this.$message({
              message: '签收成功',
              type: 'success',
            });
            this.loadOrders();
          } else {
            this.$message({
              message: res.msg,
              type: 'error',
            });
          }
        });
      },
      showVerification(order) {
        this.showCodeInput = true;
        this.order = order;
        console.log(this.order);
      },
      // closeVerification() {
      //   this.showCodeInput = false;
      // },
      sendVerificationCode() {
        // 这里假设向后端发送请求生成验证码并发送到邮箱
        
        request.post('/mail/sendVerificationCode', this.order).then(res => {
          this.verificationCode = res.data;
          if (res.code === '0') {
            this.$message({
              message: '验证码发送成功',
              type: 'success',
            });
          } else {
            this.$message({
              message: res.msg,
              type: 'error',
            });
          }
        });
        order={};
      },
      verifyCode() {
        if (this.enteredCode === this.verificationCode) {
          this.order.is_completed = new Date();
          request.post('/order/updatecompleted', this.order).then(res => {
            if (res.code === '0') {
              this.$message({
                message: '订单完成',
                type: 'success',
              });
              this.showCodeInput = false;
            } else {
              this.$message({
                message: res.msg,
                type: 'error',
              });
            }
          });
        } else {
          alert('验证码错误，请重新输入');
        }
        this.order={};
      },

      showStatus(order) {
        if (!order.is_paid) {
          return '付款中';
        }else if (!order.is_shipped) {
          return '发货中';
        }else if (!order.is_received) {
          return '运送中';
        }else if (!order.is_completed) {
          return '未完成';
        }else{
          return '已完成';
        };
      },

      deleteOrder(order){
        request.delete('/order/del/'+order.order_id).then(res=>{
          if (res.code === '0') {
            this.$message({
              message: '删除成功',
              type: 'success',
            });
            this.loadOrders();
          } else {
            this.$message({
              message: res.msg,
              type: 'error',
            });
          }
        })
      },
    },
  };
  </script>
  
  <style scoped>
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