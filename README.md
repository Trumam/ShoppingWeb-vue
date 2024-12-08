学号：202230443118
姓名：谢东昊

# 前端代码

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### 文件夹简要说明
#### public：
存放项目的 index.html 文件。该 index.html 是整个 Vue 应用的入口页面，浏览器加载这个页面后，Vue 应用会挂载到指定的 DOM 元素上并开始运行。
#### src：
##### assets：
存放项目中的各类静态资源文件，比如图片（放在 imgs 子文件夹下）、样式文件（放在 css 子文件夹下）。
##### components：
存放 Vue 组件的目录。
##### router：
存放路由配置文件index.js。
##### utils：
放置项目中的一些工具函数、工具类等。

##### views：
存放 Vue 应用中不同页面视图对应的组件。

##### App.vue文件：
这是整个 Vue 应用的根组件，相当于所有其他组件的容器

##### main.js文件：
这是 Vue 项目的入口 JavaScript 文件。

#### package.json文件
这是 Node.js 项目（包括 Vue 项目，因为 Vue 项目也是基于 Node.js 生态构建的）的核心配置文件，包含了项目的基本信息。
