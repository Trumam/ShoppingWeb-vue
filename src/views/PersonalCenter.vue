<template>
    <div>
        <div style="">
            <el-container>
                <el-aside style="overflow: hidden;min-height: 100vh;width: 250px;">
                    <el-menu 
                    :default-active="$route.path" router
                    @open="handleOpen"
                    @close="handleClose"
                    text-color="#242645"
                    active-text-color="#242645"
                    >
                        <el-menu-item index="/personInf">
                            <i class="el-icon-user-solid"></i>
                            <span slot="title">个人信息</span>
                        </el-menu-item>
                        <el-menu-item index="/address">
                            <i class="el-icon-location"></i>
                            <span slot="title">收货地址</span>
                        </el-menu-item>
                        <el-menu-item index="/cusOrder">
                            <i class="el-icon-document"></i>
                            <span slot="title">我的订单</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>

                <el-main style="padding: 0px;">
                    <router-view/>
                </el-main>
            </el-container>
        </div>
    </div>
</template>


<script>
import request from '@/utils/request.js';
import router from '@/router';
export default {
    data() {
        return{
            account: JSON.parse(localStorage.getItem('userAccount')||'{}'),
            cus:{}
        }

    },
    mounted() {
        this.loadimformation()
    },
    methods: {
        loadimformation(){
            request.get('/cus/searchByAccount/'+this.account).then(res => {
                this.cus = res.data;
                console.log(this.cus);
            });
        },
    }
}

</script>

