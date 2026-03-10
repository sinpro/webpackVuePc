export default [
    // 登录页面
    {
        path: "/bank_logon/logon/index",
        name: "logon",
        component: (resolve => require.ensure([],() => resolve(require('view/bank_logon/login')))),
        meta: {
            menuCode: "",
            title: ""
        }
    }
]