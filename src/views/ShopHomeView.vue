<template>
    <div class="goods-display-container">
        <div class="search-section">
            <div class="search-bar">
            <el-input v-model="params.name" placeholder="请输入商品名"></el-input>
            <el-input v-model="params.category" placeholder="请输入类别"></el-input>
            <el-button type="primary" @click="findBySearch()" style="margin-left: 10px;">查找</el-button>
        </div>
        </div>

        <div class="goods-grid">
            <el-row>
                <el-col
                    :span="4"
                    v-for="item in goodsData"
                    :key="item.id"
                    class="goods-item"
                >
                    <img
                        @click="addLog(item.id)"
                        :src="'http://47.120.25.179:8080/files/' + item.picture"
                        alt=""
                        class="goods-image"
                    />
                    <div class="goods-name" style="margin-top: 10px;text-align: center;">
                        {{item.name}}
                    </div>
                    <div class="goods-price" style="margin-top: 10px;text-align: center;">
                        单价：￥{{item.price}}
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<style scoped>
/* .goods-display-container {
    padding: 20px;
    background-color: white;
    justify-content: center;

} */

/* .goods-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}  */

.goods-item {
    /* width: 20%;
    max-width: 20%; */
    padding: 10px;
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
}

.goods-item:hover {
    transform: translateY(-5px);
}

.goods-image {
    width: 100%;
    height: 220px;
    border-radius: 10px;
    border: 1px solid #cccccc;
}

.goods-name {
    font-weight: 500;
    font-size: 18px;
    width: 100%;
    color: #000000;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.goods-price {
    font-size: 18px;
    color: rgb(255, 80, 0);
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  width: 600px;
}

.search-section {
    width: 100%;
}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: center; /* 水平居中 */
  margin-top: 10px; /* 距离上方元素 10px */
  margin-bottom: 15px;
  width: 600px;
  background-color: #f0f0f0; /* 背景色 */
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>

<script>
import request from '@/utils/request.js';
import router from '@/router';
export default {
    data() {
        return {
            goodsData: [],
            log: {},

            params: {
                name: '',
                category: '',
            },
            tableData: [],
            dialogFormVisible: false,
            form: {},
            formLabelWidth: '120px',
        };
    },
    mounted() {
        this.loadGoods();
    },
    methods: {
        loadGoods() {
            request.get("/goods/get").then(res => {
                this.goodsData = res.data;
                // if(res.code === 0){
                //     this.goodsData = res.data
                // }else{
                //     this.$message.error(res.msg)
                // }
            });
        },
        navto(url) {
            location.href = url;
        },
        addLog(id) {
            const log = {
                cus_account: JSON.parse(localStorage.getItem('userAccount') || '{}'),
                goods_id: id,
                log_date: new Date(),
                behavior_type: "browse",
            };
            request.post("/log/add", log).then(res => {
                if (res.code === '0') {
                    this.$message({
                        message: '成功添加浏览日志',
                        type: 'success',
                    });
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                }
            });
            this.navto('/detail?id=' + id);
        },
        findBySearch() {
            request.get("/goods/search", {
                params: this.params
            }).then(res => {
                if (res.code === '0') {
                    this.goodsData = res.data;
                }
            })
        },
    },
};
</script>