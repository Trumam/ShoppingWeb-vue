<template>
    <div class="cart-container">

        <div class="cart-table-container">
            <el-table
                :data="cartItems"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                :header-cell-style="{
                    background: '#333852',
                    color: '#fff'
                }"
            >
                <el-table-column type="selection" label="选择"></el-table-column>
                <el-table-column label="照片">
                    <template v-slot="scope">
                        <el-image
                                style="width: 50px; height: 50px"
                                :src="'http://47.120.25.179:8080/files/' + scope.row.goodsPicture"
                                :preview-src-list="['http://47.120.25.179:8080/files/' + scope.row.goodsPicture]">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsName" label="商品名称"></el-table-column>
                <el-table-column label="数量">
                    <template v-slot="scope">
                        <el-input-number
                                v-model="scope.row.goodsnumber"
                                :min="1"
                                @change="updateQuantity(scope.row)"
                        ></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="单价"></el-table-column>
                <el-table-column label="总价">
                    <template v-slot="scope">
                        {{ getTotalPrice(scope.row) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-popconfirm title="确定删除吗?" @confirm="del(scope.row)">
                            <el-button slot="reference" type="danger">删除</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="cart-actions">
            <el-button type="warning" @click="PriceSettle">购买</el-button>
        </div>
        <div class="price-settlement-dialog-container">
            <el-dialog title="价格结算" :visible.sync="paidFormVisible">
                <div>
                    总价格为：{{totalMoney}}
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="noPay()">取 消</el-button>
                    <el-button type="primary" @click="pay()">立即付款</el-button>
                </div>
                <div class="address-selection">
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
        <div class="payment-dialog-container">
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
            user: JSON.parse(localStorage.getItem('userAccount') || '{}'),
            cartItems: [],
            selectedItems: [],
            paidFormVisible: false,
            paidVisible: false,
            totalMoney: 0,
            addresses: [],
            selectedAddress: null
        }
    },
    mounted() {
        this.loadCartData();
    },
    methods: {
        loadCartData() {
            request.get('/cart/selectById/' + this.user).then(res => {
                this.cartItems = res.data;
            });
            this.fetchAddresses();
        },
        fetchAddresses() {
            request.get('/address/selectByAccount/' + this.user).then(res => {
                this.addresses = res.data;
            });
        },
        getTotalPrice(row) {
            return row.goodsnumber * row.price;
        },
        updateQuantity(row) {
            console.log(this.addresses);
            const goodsInCart = {
                cusaccount: row.cusaccount,
                goodsid: row.goodsid,
                goodsnumber: row.goodsnumber,
            };
            request.post('/cart/updateNumberInCart', goodsInCart).then(res => {
                if (res.code === '0') {
                    this.loadCartData();
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                }
            })
        },
        del(goods) {
            request.delete("/cart/del/" + goods.id).then(res => {
                if (res.code === '0') {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.loadCartData();
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                }
            })
        },
        PriceSettle() {
            for (let item of this.selectedItems) {
                this.totalMoney += item.goodsnumber * item.price;
            }
            this.paidFormVisible = true;
        },
        pay() {
            this.paidVisible = true;
            this.paidFormVisible = false;
        },
        noPay() {
            this.paidFormVisible = false;
            this.totalMoney = 0;
        },
        paidSucc() {
            // console.log(this.selectedItems)
            this.cartItems = this.cartItems.filter(
                (item) =>!this.selectedItems.includes(item)
            );
            for (let item of this.selectedItems) {
                item.is_paid = new Date(),
                    this.addToOrder(item);
                // this.update(item);//得补充逻辑！！！！！
                this.addLog(item);
                this.del(item);
            }
            this.selectedItems = [];
            this.totalMoney = 0;
            this.selectedAddress = null;
            this.paidVisible = false;
            this.paidFormVisible = false;
        },
        addLog(item) {
            const log = {
                cus_account: this.user,
                goods_id: item.goodsid,
                log_date: new Date(),
                behavior_type: "purchase",
                goods_num: item.goodsnumber,
            };
            request.post("/log/add", log).then(res => {
                if (res.code === '0') {
                    this.$message({
                        message: '成功添加购买日志',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }
            });
        },
        paidFail() {
            this.cartItems = this.cartItems.filter(
                (item) =>!this.selectedItems.includes(item)
            );
            for (let item of this.selectedItems) {
                item.is_paid = null,
                    this.addToOrder(item);
                this.del(item);
            }
            this.selectedItems = [];
            this.totalMoney = 0;
            this.selectedAddress = null;
            this.paidVisible = false;
            this.paidFormVisible = false;
        },
        update(item) {
            item.is_paid = new Date(),
                request.post("/order/update", item).then(res => {
                if (res.code === '0') {
                    this.$message({
                        message: '成功付款',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }
            })
        },
        addToOrder(item) {
            const order = {
                cus_account: this.user,
                goods_id: item.goodsid,
                // address_id: null,
                order_date: new Date(),
                goods_number: item.goodsnumber,
                address_id: this.selectedAddress.address_id,
                is_paid: item.is_paid,
            };
            request.post("/order/submit", order).then(res => {
                if (res.code === '0') {
                    this.$message({
                        message: '成功添加到订单',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }
            })
        },
        handleSelectionChange(val) {
            this.selectedItems = val;
        },
    }
}
</script>

<style scoped>
.cart-container {
    padding: 20px;
    background-color: #f9f9f9;
}

.cart-actions {
    margin-bottom: 15px;
}

.cart-table-container {
    margin-bottom: 15px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
}

.dialog-footer el-button {
    margin-left: 10px;
}

.address-selection {
    margin-top: 15px;
}

.price-settlement-dialog-container {
    margin-bottom: 15px;
}

.payment-dialog-container {
    margin-bottom: 15px;
}
</style>