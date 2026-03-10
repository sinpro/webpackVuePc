export default [
    {
        path: "/bank_personal/personInfo/index",
        name: "personInfoIndex",
        component: resolve => require.ensure([],() => resolve(require('views/bank_personal/personInfo/index'))),
        meta: {
            menuCode: "",
            title: ""
        }
    },
    {
        path: "/bank_personal/personInfo/confirm",
        name: "personInfoConfirm",
        component: resolve => require.ensure([],() => resolve(require('views/bank_personal/personInfo/confirm'))),
        meta: {
            menuCode: "",
            title: ""
        }
    }
]