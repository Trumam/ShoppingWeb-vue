<template>
    <div>
        <div>
            <label>开始时间：</label>
            <input type="date" v-model="startDate">
            <label>结束时间：</label>
            <input type="date" v-model="endDate">
            <button @click="fetchSalesReport">查询</button>
        </div>

      <h1>销售报表</h1>
      <h2>销售报表概述</h2>
      <p>报告周期：[具体时间段]</p>
      <p>目的：简要说明该销售报表的目的，如提供销售业绩评估、辅助决策等。</p>
  
      <h2>销售关键指标</h2>
        <table>
        <thead>
            <tr>
            <th>指标</th>
            <th>数值</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>总销售额</td>
            <td>{{totalSales}}</td>
            </tr>
            <tr>
            <td>总销售量</td>
            <td>{{totalQuantity}}</td>
            </tr>
            <tr>
            <td>平均客单价</td>
            <td>{{averagePrice}}</td>
            </tr>
        </tbody>
        </table>
  
      <h2>销售趋势分析</h2>
      <div>
        <!-- 这里添加一个div元素作为图表的容器，设置一个id以便在JavaScript中获取到它 -->
        <div id="salesChart" style="width: 800px;height:400px;"></div>
      </div>
  
      <h2>产品销售分析</h2>
      <h3>畅销产品 TOP N</h3>
      <table>
        <thead>
          <tr>
            <th>产品名称</th>
            <th>销售额</th>
            <th>销售量</th>
            <th>占总销售额比例</th>
          </tr>
        </thead>
        <tbody v-for="product in topSellingProducts" :key="product.id">
          <tr>
            <td>{{product.name}}</td>
            <td>{{product.sales}}</td>
            <td>{{product.quantity}}</td>
            <td>{{product.percentage}}</td>
          </tr>
        </tbody>
      </table>
      <h3>滞销产品 TOP N</h3>
      <table>
        <thead>
          <tr>
            <th>产品名称</th>
            <th>销售额</th>
            <th>销售量</th>
            <th>原因分析</th>
          </tr>
        </thead>
        <tbody v-for="product in slowMovingProducts" :key="product.id">
          <tr>
            <td>{{product.name}}</td>
            <td>{{product.sales}}</td>
            <td>{{product.quantity}}</td>
            <td>{{product.reason}}</td>
          </tr>
        </tbody>
      </table>
      <h3>产品分类销售情况</h3>
      <table>
        <thead>
          <tr>
            <th>产品类别</th>
            <th>销售额</th>
            <th>销售量</th>
          </tr>
        </thead>
        <tbody v-for="category in productCategories" :key="category.id">
          <tr>
            <td>{{category.name}}</td>
            <td>{{category.sales}}</td>
            <td>{{category.quantity}}</td>
          </tr>
        </tbody>
      </table>
  
      <h2>客户分析</h2>
      <h3>新客户与老客户销售对比</h3>
      <table>
        <thead>
          <tr>
            <th>客户类型</th>
            <th>销售额</th>
            <th>销售量</th>
            <th>订单数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>新客户</td>
            <td>{{newCustomersSales}}</td>
            <td>{{newCustomersQuantity}}</td>
            <td>{{newCustomersOrders}}</td>
          </tr>
          <tr>
            <td>老客户</td>
            <td>{{existingCustomersSales}}</td>
            <td>{{existingCustomersQuantity}}</td>
            <td>{{existingCustomersOrders}}</td>
          </tr>
        </tbody>
      </table>
      <h3>客户地域分布</h3>
      <table>
        <thead>
          <tr>
            <th>地区</th>
            <th>销售额</th>
            <th>销售量</th>
          </tr>
        </thead>
        <tbody v-for="region in customerRegions" :key="region.id">
          <tr>
            <td>{{region.name}}</td>
            <td>{{region.sales}}</td>
            <td>{{region.quantity}}</td>
          </tr>
        </tbody>
      </table>
      <h3>客户忠诚度分析</h3>
      <table>
        <thead>
          <tr>
            <th>指标</th>
            <th>数值</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>客户复购率</td>
            <td>{{customerRepeatRate}}</td>
          </tr>
          <tr>
            <td>平均购买次数</td>
            <td>{{averagePurchaseFrequency}}</td>
          </tr>
        </tbody>
      </table>
  
      <h2>销售渠道分析</h2>
      <h3>不同销售渠道的销售额和销售量</h3>
      <table>
        <thead>
          <tr>
            <th>销售渠道</th>
            <th>销售额</th>
            <th>销售量</th>
          </tr>
        </thead>
        <tbody v-for="channel in salesChannels" :key="channel.id">
          <tr>
            <td>{{channel.name}}</td>
            <td>{{channel.sales}}</td>
            <td>{{channel.quantity}}</td>
          </tr>
        </tbody>
      </table>
      <h3>渠道销售趋势</h3>
      <p>观察不同渠道的销售趋势变化，评估渠道的发展潜力。</p>
      <div id="channelTrendChart"></div>
  
      <h2>促销活动效果评估</h2>
      <p>列出报告周期内的促销活动，包括活动名称、时间、目标和策略。分析促销活动对销售额、销售量、客单价等指标的影响，评估活动的效果。总结促销活动的经验教训，为未来的促销活动提供参考。</p>
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
    background-color: #4CAF50;
    color: white;
  }
  </style>
  
  <script>
  import request from '@/utils/request.js';
  import router from '@/router';
  export default {
    data() {
      return {
        startDate: '',
        endDate: '',

        totalSales: 0,
        totalQuantity: 0,
        averagePrice: 0,
        topSellingProducts: [],
        slowMovingProducts: [],
        productCategories: [],
        newCustomersSales: 0,
        newCustomersQuantity: 0,
        newCustomersOrders: 0,
        existingCustomersSales: 0,
        existingCustomersQuantity: 0,
        existingCustomersOrders: 0,
        customerRegions: [],
        customerRepeatRate: 0,
        averagePurchaseFrequency: 0,
        salesChannels: [],

        salesTrendData: []
        // 假设这里存放销售趋势数据，格式为 { dates: [], sales: [], quantities: [] }
      };
    },
    mounted() {
        this.fetchSalesReport();
    },
    methods: {

      drawSalesChart() {
            // const chartDom = document.getElementById('salesChart');
            // const myChart = echarts.init(chartDom);

            request.get('/report/monthly?year=2024').then(res => {
                this.salesTrendData = res.data;
            });

            const months = this.salesTrendData.map(item => item.month);
            const totalSales = this.salesTrendData.map(item => item.totalSales);

            console.log(months, totalSales);
            
            // const option = {
            //     xAxis: {
            //         type: 'category',
            //         data: months
            //     },
            //     yAxis: {
            //         type: 'value'
            //     },
            //     series: [
            //         {
            //             data: totalSales,
            //             type: 'line',
            //             name: '销售额'
            //         }
            //     ]
            // };

            // myChart.setOption(option);
        },


        // fetchSalesReport() {
        //     const params = {
        //         startDate: this.startDate,
        //         endDate: this.endDate
        //     };
        //     request.get('/api/sales-report', { params }).then(response => {
        //         const data = response.data;
        //         this.totalSales = data.totalSales;
        //         this.totalQuantity = data.totalQuantity;
        //         this.averagePrice = this.totalSales / this.totalQuantity;
        //         // 处理其他数据变量省略
        //         this.salesTrendData = data.salesTrendData;
        //         this.initSalesTrendChart();
        //     }).catch(error => {
        //         console.error('Error fetching sales report:', error);
        //     });
        // },

        // initSalesTrendChart() {
        // const chartDom = document.getElementById('salesTrendChart');
        // const myChart = echarts.init(chartDom);
        // const option = {
        //     xAxis: {
        //     type: 'category',
        //     data: this.salesTrendData.dates
        //     },
        //     yAxis: {
        //     type: 'value'
        //     },
        //     series: [
        //     {
        //         data: this.salesTrendData.sales,
        //         type: 'line',
        //         name: '销售额'
        //     },
        //     {
        //         data: this.salesTrendData.quantities,
        //         type: 'line',
        //         name: '销售量'
        //     }
        //     ]
        // };
        // myChart.setOption(option);
        // }
    }
  };
  </script>