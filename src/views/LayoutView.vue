<template>
    <div>
        <!-- 外层容器，用于整体布局 -->
        <el-container>
            <!-- 头部区域，设置了背景颜色、字体颜色等样式 -->
            <el-header style="background-color: #242645; color: white; padding: 10px 0;">
                <!-- 显示管理员字样，设置了字体大小和左边距 -->
                <img src="../assets/imgs/mylogo.png" alt="logo" style="width: 40px; height: 40px; margin-left: 15px;">
                <span class="header-text" style="font-size: 20px; margin-left: 15px;">管理员</span>
                <!-- 退出登录按钮，设置了按钮类型、右边距以及点击事件 -->
                <el-button type="warning" style="float: right; margin-right: 15px;" @click="$router.push('/')">退出登录</el-button>
            </el-header>
        </el-container>
        <el-container>
            <!-- 侧边栏区域，设置了背景颜色、最小高度、宽度等样式 -->
            <el-aside style="overflow: hidden; min-height: 100vh; background-color: #333852; width: 250px;">
                <!-- 菜单组件，设置了默认激活项、路由模式、背景颜色、文本颜色等样式 -->
                <el-menu :default-active="$route.path" router background-color="#333852" text-color="#fff" active-text-color="#ffd04b">
                    <!-- 管理用户菜单项，替换为用户相关图标 -->
                    <el-menu-item index="/cus">
                        <i class="el-icon-user"></i>
                        <span slot="title">管理用户</span>
                    </el-menu-item>
                    <!-- 管理商品菜单项，替换为商品相关图标 -->
                    <el-menu-item index="/goods">
                        <i class="el-icon-goods"></i>
                        <span slot="title">管理商品</span>
                    </el-menu-item>
                    <!-- 管理订单菜单项，替换为订单相关图标 -->
                    <el-menu-item index="/order">
                        <i class="el-icon-document-checked"></i>
                        <span slot="title">管理订单</span>
                    </el-menu-item>
                    <!-- 管理销售报表菜单项，替换为报表相关图标 -->
                    <el-menu-item index="/salesreport">
                        <i class="el-icon-data-analysis"></i>
                        <span slot="title">查询销售报表</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <!-- 主要内容区域，用于显示路由视图 -->
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </div>
</template>

<style>
    /* 菜单组件样式，去除右边框 */
 .el-menu {
        border-right: none!important;
    }
    /* 整体页面的字体设置，与前面登录页面风格统一 */
    body {
        font-family: "Source Sans Pro";
    }
    /* 头部区域的字体样式设置 */
 .el-header span {
        font-weight: bold;
    }
    /* 菜单项的图标和标题的样式设置，使其更加美观协调 */
 .el-menu-item i {
        margin-right: 10px;
    }
 .el-menu-item span {
        vertical-align: middle;
    }

    /* 退出登录按钮的样式美化 */
 .el-header.el-button[type="warning"] {
        background-color: #f57c00; /* 设置背景颜色为橙色系，可根据喜好调整 */
        border-color: #f57c00; /* 设置边框颜色与背景色一致 */
        color: white; /* 设置文字颜色为白色，使其更醒目 */
        cursor: pointer; /* 添加鼠标指针样式，使其更具交互性 */
        transition: background-color 0.3s ease, border-color 0.3s ease; /* 添加过渡效果，使颜色变化更平滑 */
    }

 .el-header.el-button[type="warning"]:hover {
        background-color: #f9a825; /* 鼠标悬停时背景色变浅，可根据喜好调整 */
        border-color: #f9a825; /* 边框颜色也相应改变 */
    }
</style>

<script>
    export default {
        name: "Layout",
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
{script}