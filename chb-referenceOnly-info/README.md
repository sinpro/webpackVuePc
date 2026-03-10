## 介绍
> 一个功能完善的vue-webpack快速开发模板，具有babel hot-reload eslint sass http-proxy minified extract-text ...等功能
> 更轻量

### npm配置

### 开发工具
- [vscode](http://code.visualstudio.com/)
- [nodejs](http://nodejs.org/)

### 参考资料
- [saa@3.x](http://sass-lang.com/)
- [webpack@4.x](http://webpack.js.org/)
- [vue@2.x](http://cn.vue.org/)
- [vue-router@2.x](http://router.vue.js.org/zh-cn)
- [vuex@2.x](http://vuex.vue.js.org/zh-cn)

### 项目结构
```js

├── -build/			    //构建目录
├── -cofig/ 		    //项目配置
├── -src/
│   ├── -components/	//全局组件
│   ├── -directives/	//指令
│   ├── -filters/		//过滤器
│   ├── -il8n/ 			//多语言
│   ├── -mock/			//mock数据
│   ├── -mixins/		//混合
│   ├── -modules/		//模块依赖
│   ├── -router/		//路由相关
│   ├── -store/			//状态管理
│   ├── -style/			//全局样式
│   ├── -utils/			//自定方法
│   ├── -views/			//页面入口
│   ├── -app.vue        //入口容器
│   └── -main.js        //入口js
├── -test/				//单元测试
├── -tool/				//开发工具
├── -.babelrc			//beabel文件
├── -.eslintignore		//eslint忽略配置
├── -.eslintrc.js       //eslint规则配置
├── -.gitignore         //git忽略配置
├── -index.ejs			//启动页面
├── -package.json		//配置文件
└── -README 			//帮助文档
```

### 使用
```bash
# git clone
> git clone ...

# 初始化
> cd 项目
> npm install

# 开发模式
> npm run dev

# 立即构建
> npm run build

# 构建监听
> npm run watch

# 单元测试
> npm test
```

### git提交
> [版本号-类型-提交人]:提交描述
```
feature: 新增新功能
fix: 修改新功能
docs: 改动文档
style: 格式化代码
refactor: 重构代码
test: 新增单元测试
other: 其他工作，如更新配置
```

### 前端模块
> 1、登录           chb_logon               【登录】
> 2、首页           chb_homePage            【首页、限时推广】
> 3、账户           chb_acctManagement      【账户概览、交易记录、电子结单】
> 4、存款           chb_depositBusiness     【定期存款、利率】
> 5、转账           chb_transferService     【转账/转数快、转账交易记录、电汇、汇款查询、预约管理】
> 6、缴费服务       chb_billPayment         【缴费EPSCO、电子账单(EBPP)】
> 7、外汇           chb_foreignExchange     【外币牌价、外币兑换】
> 8、投资           chb_investService       【基金、外币挂钩存款、交易记录、投资风险评估、衍生产品知识影片】
> 9、信用卡         chb_creditCard          【我的信用卡、报失信用卡、网上确认信用卡、申请信用卡、信用额套现分期（透支）-申请、信用额套现分期-递交文件】
> 10、贷款          chb_loanService         【我的贷款、私人贷款、楼宇贷款、抵押透支服务】
> 11、设定          chb_mySettings          【转账、海外自动柜员机交易、报失卡、申请支票簿、新增/删除账户、流动保安设定、更改登入密码、更改登入名称、更改联系资料、账户重启】
> 12、公共页面      chb_commonPage          【404页面、启动网银】
```删掉模块
chb_onlineApplication
chb_promoteService
chb_statementService
chb_aboutUs
chb_openApi
chb_startUpEbank
```

镜像配置
npm config set registry http://10.120.237.11/npm/
npm config set sass_binary_site=http://10.120.237.11/media/software/node/node-sass/