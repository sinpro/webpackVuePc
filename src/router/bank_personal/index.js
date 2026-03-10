import personInfo from './personInfo';
import settings from './settings';
export default [
    {
        path: "/bank_personal/index",
        name: "bankPersonal",
        redirect: {
            path: "/bank_personal/personInfo/index",
        },
        meta:{
            menuCode: "",
            title: ""
        },
        component: resolve => require.ensure([],() => resolve(require('src/components/bank_main/bankView'))),
        children: [
            ...personInfo,
            ...settings,
        ]
    }
    
]