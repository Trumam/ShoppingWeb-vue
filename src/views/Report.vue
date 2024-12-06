<template>
    <div>
        <div class="date-filter">
            <label>开始时间：</label>
            <input type="date" v-model="startDate" class="date-input">
            <label>结束时间：</label>
            <input type="date" v-model="endDate" class="date-input">
            <el-button type="primary" @click="fetchSalesReport" class="query-button">查询</el-button>
        </div>
        <h1>销售额趋势分析</h1>
        <div>
            <!-- 这里添加一个div元素作为图表的容器，设置一个id以便在JavaScript中获取到它 -->
            <div id="salesMoneyChart" style="width: 800px;height:400px;"></div>
        </div>

        <h2>销售数量趋势分析</h2>
        <div>
            <div id="salesNumChart" style="width: 800px;height:400px;"></div>
        </div>

        <h3>最受欢迎的三种商品</h3>
        <table>
            <thead>
            <tr>
                <th>产品名称</th>
                <th>销售量(件)</th>
            </tr>
            </thead>
            <tbody v-for="product in topSellingProducts" :key="product.name">
            <tr>
                <td>{{product.goodsName}}</td>
                <td>{{product.goodsNum}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<style>
    table {
    border-collapse: collapse;
    width: 100%;
    }

    th,
    td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    }

    th {
    background-color: #333852;
    color: white;
    }

    .date-filter {
    display: flex;
    align-items: center;
    gap: 10px; /* 设置元素之间的间距 */
}

.date-input {
    padding: 5px 10px; /* 设置输入框内边距 */
    border: 1px solid #ccc; /* 设置边框样式 */
    border-radius: 4px; /* 设置边框圆角 */
}


</style>

<script>
import request from '@/utils/request.js';
import * as echarts from 'echarts';
import router from '@/router';
export default {
    data() {
        return {        
            startDate: '',
            endDate: '',
            salesMoneyData: [],
            // 假设这里存放销售趋势数据，格式为 { dates: [], sales: [], quantities: [] }
            salesNumData: [],
            topSellingProducts: [],
        };
    },
    // mounted() {
    //     this.fetchSalesReport();
    // },
    methods: {
        drawSalesMoneyChart() {
            console.log(this.startDate, this.endDate);

            request.get('/report/salesMoney', {
                params: {
                    begin: this.startDate,
                    end: this.endDate
                }
            }).then(res => {
                this.salesMoneyData = res.data;

                // 1. 确定完整的月份序列
                const start = new Date(this.startDate);
                const end = new Date(this.endDate);
                const allMonths = [];
                while (start <= end) {
                    const year = start.getFullYear();
                    const month = String(start.getMonth() + 1).padStart(2, '0');
                    allMonths.push(`${year}-${month}`);
                    start.setMonth(start.getMonth() + 1);
                }

                // 2. 根据返回数据填充销售额数据，没有数据的月份设为0
                const monthsWithData = this.salesMoneyData.map(item => item.month);
                const totalSalesWithData = this.salesMoneyData.map(item => item.totalSales);
                const months = allMonths.map(month => {
                    const index = monthsWithData.indexOf(month);
                    if (index!== -1) {
                        return month;
                    } else {
                        return month;
                    }
                });
                const totalSales = allMonths.map(month => {
                    const index = monthsWithData.indexOf(month);
                    if (index!== -1) {
                        return totalSalesWithData[index];
                    } else {
                        return 0;
                    }
                });

                const chartDom = document.getElementById('salesMoneyChart');
                const myChart = echarts.init(chartDom);

                const option = {
                    xAxis: {
                        type: 'category',
                        data: months
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} ￥'
                        }
                    },
                    series: [
                        {
                            data: totalSales,
                            type: 'line',
                            name: '销售额'
                        }
                    ]
                };

                myChart.setOption(option);
            });
        },

        drawSalesNumChart() {
            console.log(this.startDate, this.endDate);

            request.get('/report/salesNum', {
                params: {
                    begin: this.startDate,
                    end: this.endDate
                }
            }).then(res => {
                this.salesNumData = res.data;

                // 1. 确定完整的月份序列
                const start = new Date(this.startDate);
                const end = new Date(this.endDate);
                const allMonths = [];
                while (start <= end) {
                    const year = start.getFullYear();
                    const month = String(start.getMonth() + 1).padStart(2, '0');
                    allMonths.push(`${year}-${month}`);
                    start.setMonth(start.getMonth() + 1);
                }

                // 2. 根据返回数据填充销售数量数据，没有数据的月份设为0
                const monthsWithData = this.salesNumData.map(item => item.month);
                const totalSalesNumWithData = this.salesNumData.map(item => item.totalNum);
                const months = allMonths.map(month => {
                    const index = monthsWithData.indexOf(month);
                    if (index!== -1) {
                        return month;
                    } else {
                        return month;
                    }
                });
                const totalNum = allMonths.map(month => {
                    const index = monthsWithData.indexOf(month);
                    if (index!== -1) {
                        return totalSalesNumWithData[index];
                    } else {
                        return 0;
                    }
                });

                const chartDom = document.getElementById('salesNumChart');
                const myChart = echarts.init(chartDom);

                const option = {
                    xAxis: {
                        type: 'category',
                        data: months
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: totalNum,
                            type: 'line',
                            name: '销售数量'
                        }
                    ]
                };

                myChart.setOption(option);
            });
        },

        getTopSellingProducts() {
            request.get('/report/salesTop', {
                params: {
                    begin: this.startDate,
                    end: this.endDate
                }
            }).then(res => {
                this.topSellingProducts = res.data;
            });
        },

        fetchSalesReport() {
            const start = this.startDate;
            const end = this.endDate;
            if (!start ||!end) {
                alert('请选择开始时间和结束时间');
                return;
            }
            if(start > end){
                alert('开始时间不能大于结束时间');
                return;
            }
            this.drawSalesMoneyChart();
            this.drawSalesNumChart();
            this.getTopSellingProducts();
                    
        }
    }
};
</script>
