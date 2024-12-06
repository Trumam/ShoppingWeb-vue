<template>
    <div>
      <!-- 使用Element UI的输入框组件el-input，用于让用户输入账号信息 -->
      <el-input
          class="inps"
          placeholder="账号"
          v-model="cus.account"
      >
      </el-input>
    </div>
</template>
  
<script>
  export default {
    data: function () {
      // data函数用于定义组件内部的响应式数据，每个组件实例都有自己独立的数据副本
      return {
        // 定义一个名为cus的对象，初始化为空对象，用于后续存放与客户相关的信息，比如账号、密码等
        cus: {},
      };
    },
    // 这里可以添加其他的组件选项，比如methods用于定义组件的方法、computed用于定义计算属性等（当前示例暂未展示其他选项内容）
  };
</script>
  


<!-- el-input组件，双向绑定params.name变量，用于接收用户输入的姓名，显示相应的占位提示文字 -->
<el-input v-model="params.name" placeholder="请输入姓名"></el-input>
<!-- el-input组件，双向绑定params.account变量，用于接收用户输入的账号，显示相应的占位提示文字 -->
<el-input v-model="params.account" placeholder="请输入账号"></el-input>
<!-- el-button组件，绑定点击事件findBySearch，点击时执行查找操作 -->
<el-button type="primary" @click="findBySearch()" style="margin-left: 10px;">查找</el-button>

<script>
export default {
    methods: {
      // 定义名为del的方法，该方法接收一个名为cus的参数（从代码上下文推测，cus应该是包含客户相关信息的对象，且具有id属性，用于标识要删除的客户），
// 用于向服务器发起删除指定客户信息的请求，并根据服务器返回的结果进行相应的提示以及页面数据更新操作。
del(cus) {
    // 使用request对象发起一个DELETE类型的HTTP请求，请求的URL是"/cus/del/"加上要删除客户的id值（通过cus.id获取），
    // 这意味着会向服务端对应的删除客户信息的接口发送请求，传递要删除客户的唯一标识，让服务端执行删除操作。
    request.delete("/cus/del/" + cus.id).then(res => {
        // 当请求得到服务端响应后（then回调被触发），会检查响应数据中的code属性（通常用于表示请求处理结果的状态码，这里假设'0'表示成功）。
        if (res.code === '0') {
            // 如果服务端返回的状态码为'0'，表示删除操作成功，此时会通过this.$message方法弹出一个提示框，向用户展示"删除成功"的消息，
            // 并且提示框的类型设置为'success'，通常在界面上会以一种表示成功的样式（比如绿色背景、对勾图标等）呈现给用户，让用户直观知晓操作成功了。
            this.$message({
                message: '删除成功',
                type: 'success'
            });
            // 调用this.findBySearch方法，推测该方法用于根据一定条件重新查询客户数据，目的是在删除操作成功后，
            // 及时更新页面上显示的客户信息列表，使得页面展示的数据与数据库中的实际数据保持一致，提供最新的客户信息视图给用户。
            this.findBySearch();
        } else {
            // 如果服务端返回的状态码不是'0'，则表示删除操作出现了问题，此时同样通过this.$message方法弹出提示框，
            // 提示框中展示服务端返回的错误消息（通过res.msg获取），并且将提示框类型设置为'error'，在界面上一般会以表示错误的样式（比如红色背景、叉号图标等）呈现，
            // 告知用户删除操作失败以及失败的原因（由服务端返回的具体错误消息说明）。
            this.$message({
                message: res.msg,
                type: 'error'
            });
        }
    });
},
        // 定义名为load的方法，用于从服务端获取客户相关数据（这里假设是获取所有客户数据）
        load() {
            // 使用request对象发起GET请求到"/cus"接口，当请求成功返回后（then回调被触发）
            request.get("/cus").then(res => {
                // 将返回的数据赋值给组件的tableData变量
                this.tableData = res.data;
            });
        },
        // 定义名为findBySearch的方法，用于根据用户输入的条件进行客户数据的搜索查找
        findBySearch() {
            // 使用request对象发起GET请求到"/cus/search"接口，并传递参数params
            request.get("/cus/search", {
                params: this.params
            }).then(res => {
                // 当请求返回的状态码（假设接口返回的格式中有code字段表示状态）为'0'时，表示查找成功
                if (res.code === '0') {
                    // 将查找到的符合条件的数据赋值给tableData变量，以便在页面上更新显示搜索结果
                    this.tableData = res.data;
                }
            });
        },
    }
}
</script>



