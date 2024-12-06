<template>
    <div>
        <el-container>
            <el-header class="admin-header" style="background-color: #242645; color: white; padding: 0px;">
                <img src="../assets/imgs/mylogo.png" alt="logo" style="width: 40px; height: 40px; margin-left: 15px;">
                <span class="header-text" style="font-size: 20px; margin-left: 15px;">商城</span>
            </el-header>
        </el-container>
        <el-container style="overflow: hidden;  background-color: #242645; width: 100%;">
            <el-menu
                :default-active="$route.path"
                router
                mode="horizontal"
                class="admin-menu"
                background-color="#242645"
                text-color="#fff"
                active-text-color="#ffd04b"
            >
                <el-menu-item index="/shophome" class="menu-item">
                    <i class="el-icon-menu"></i>
                    <span slot="title">商品首页</span>
                </el-menu-item>
                <el-menu-item index="/shopcart" class="menu-item">
                    <i class="el-icon-shopping-cart-2"></i>
                    <span slot="title">购物车</span>
                </el-menu-item>
                <el-menu-item index="/personalCenter" class="menu-item">
                    <i class="el-icon-user"></i>
                    <span slot="title">个人中心</span>
                </el-menu-item>
            </el-menu>
        </el-container>
        <el-container>
            <el-main class="admin-main"style="padding: 0px;">
                <router-view/>
            </el-main>
        </el-container>
    </div>
</template>

<style scoped>
   .admin-menu {
        border-right: none!important;
        height: 50px;
        line-height: 50px;
    }

   .menu-item {
        padding: 0 20px;
        cursor: pointer;
    }

   .menu-item:hover {
        background-color: rgba(200, 200, 200, 0.5);
    }

   .admin-header {
        display: flex;
        align-items: center;
        height: 60px;
    }

   .header-text {
        font-weight: bold;
    }

   /* .admin-main {
        padding: 20px;
        background-color: #f9f9f9;
    } */
</style>

<script>
    export default {
        name: "ShopLayout",
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>