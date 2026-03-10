export default [
    // 登录页面
    {
        path: "/bank_logon/logon/index",
        name: "logonIndex",
        component: resolve => require.ensure([],() => resolve(require('views/bank_logon/index'))),
        meta: {
            menuCode: "",
            title: ""
        }
    }
]