export default [
    {
        path: "/bank_home/home/index",
        name: "homeIndex",
        component: (resolve => require.ensure([],() => resolve(require('views/bank_home/index')))),
        meta: {
            menuCode: "",
            title:""
        }
    }
]