<template>
<div style="padding: 0px;">
    <div class="product-page-wrapper">
            <div class="product-card" style="width: 60%;  min-height: 500px; border-radius: 20px;">
                <div class="product-info-container">
                    <el-row :gutter="20">
                        <el-col :span="14">
                            <img :src="'http://47.120.25.179:8080/files/' + goodsData.picture" alt=""
                                style="width: 100%; height: 400px; border-radius: 20px;">
                        </el-col>
                        <el-col :span="10">
                            <div class="product-name" style="font-size: 23px; font-weight: 900; margin-bottom: 10px;">
                                {{goodsData.name}}
                            </div>
                            <div class="product-price" style="color: orange; margin-top: 15px;">单价：<span style="font-size: 25px;">{{goodsData.price}}￥</span></div>
                            <div class="product-category" style="margin-top: 10px;">分类：{{goodsData.category}}</div>
                            <div class="product-description" style="margin-top: 10px;">详细介绍：{{goodsData.describe}}</div>
                            
                            <el-input-number v-model="number" label="请输入数量" style="margin-top: 15px;"></el-input-number>
                            <div class="product-action-buttons">
                                <el-button type="primary" @click="addToCart">加入购物车</el-button>
                                <el-button type="warning" @click="purchase">立即购买</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
    </div>
    <div>
        <el-dialog title="价格结算" :visible.sync="paidFormVisible">
            <div>
                总价格为：{{totalMoney}}
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="noPay()">取 消</el-button>
                <el-button type="primary" @click="pay()">立即付款</el-button>
            </div>
            <div>
                地址选择：
                <el-select v-model="selectedAddress" placeholder="请选择地址">
                    <el-option
                        v-for="address in addresses"
                        :key="address.address_id"
                        :label="`${address.recipient_name}-${address.phone_number}-${address.detailed_address}`"
                        :value="address">
                    </el-option>
                </el-select>
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

<style scoped>

.product-page-wrapper {
    padding: 20px;
    background: linear-gradient(to bottom, #242645, white);
    justify-content: center;
    display: flex;
    /* padding: 0; 将原来的20px修改为0，去掉四周的内边距，也就是白边 */
}

.main-container {
    display: flex;
    justify-content: center;
}

.product-card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
    background-color: #f9f9f9;
}

.product-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.product-info-container {
    padding: 15px 20px;
}

.product-name {
    text-align: center;
}

.product-price {
    text-align: center;
}

/* .product-description {
     text-align: center;
}*/

/* .product-category {
    text-align: center;
} */

.product-action-buttons {
    display: flex;
    /* justify-content: space-between; */
    margin-top: 20px;
}

.product-action-buttons el-button {
    flex: 1;
    margin: 0 5px;
}
</style>

<script>
import request from '@/utils/request.js';
import router from '@/router';
export default {
    data() {
        let goodsId = this.$route.query.id;

        return{
            // localStorage.setItem('userAccount', userAccount);
            // const value = localStorage.getItem('key');
            user: JSON.parse(localStorage.getItem('userAccount')||'{}'),
            goodsId: goodsId,
            number:1,
            goodsData: {},
            totalMoney: 0,
            is_paid: null,

            paidFormVisible:false,
            paidVisible: false,
            addresses: [],
            selectedAddress: null
        }
    },
    mounted() {
        this.loadGoods()
    },
    methods: {
        loadGoods() {
            request.get('/goods/selectById/' + this.goodsId).then(res => {
                this.goodsData = res.data
            })
            this.fetchAddresses();
        },
        addToCart() {
            const cartItem = {
                goodsid: this.goodsId,
                goodsnumber: this.number,
                // 可以添加其他需要的信息，比如用户 ID 等
                cusaccount: this.user // 如果有用户 ID 的话
            };

            request.post('/cart/add', cartItem).then(res => {
                if(res.code === '0'){
                    this.$router.push({path: '/ShopLayout'});
                    this.$message({
                    message:'成功添加购物车',
                    type:'success'
                    });
                }else{
                    this.$message({
                    message:res.msg,
                    type:'error'
                    });
                }
                // 可以根据实际情况添加提示信息
            });
        },
        purchase() {
            this.totalMoney += this.goodsData.price*this.number;
            this.paidFormVisible=true;
        },
        pay(){
            this.paidVisible = true;
            this.paidFormVisible = false;
        },
        noPay(){
            this.paidFormVisible = false;
            this.totalMoney=0;
        },
        paidSucc(){
            this.is_paid = new Date();
            this.addToOrder();
            this.addLog();

            this.totalMoney=0;
            this.selectedAddress = null;
            this.paidVisible = false;
            this.paidFormVisible = false;
            this.is_paid = null;
        },
        paidFail(){
            this.addToOrder();

            this.totalMoney=0;
            this.selectedAddress = null;
            this.paidVisible = false;
            this.paidFormVisible = false;
        },
        fetchAddresses() {
            request.get('/address/selectByAccount/' + this.user).then(res => {
                this.addresses = res.data;
            });
            
        },
        addToOrder(){
            const order = {
                cus_account: this.user,
                goods_id: this.goodsId,
                order_date: new Date(),
                goods_number: this.number,
                address_id: this.selectedAddress.address_id,
                is_paid: this.is_paid,
            };
            request.post("/order/submit",order).then(res =>{
                if(res.code === '0'){
                    this.$message({
                    message:'成功添加到订单',
                    type:'success'
                    });
                }else{
                    this.$message({
                    message:res.msg,
                    type:'error'
                    });
                }
            
            })
        },
        addLog(){
            const log = {
                cus_account : this.user,
                goods_id : this.goodsId, 
                log_date : new Date(), 
                behavior_type : "purchase",
                goods_num: this.number,
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

    }
}

</script>

