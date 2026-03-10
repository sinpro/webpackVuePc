export default [
    {
        path: "/bank_personal/settings/index",
        name: "settingsInfoIndex",
        component: resolve => require.ensure([],() => resolve(require('views/bank_personal/settings/index'))),
        meta: {
            menuCode: "",
            title: ""
        }
    },
    {
        path: "/bank_personal/settings/confirm",
        name: "settingsConfirm",
        component: resolve => require.ensure([],() => resolve(require('views/bank_personal/settings/confirm'))),
        meta: {
            menuCode: "",
            title: ""
        }
    }
]