import logon from './logon';
export default [
    {
        path: "/bank_logon/index",
        name: "bankLogon",
        redirect: {
            path: "/bank_logon/logon/index",
        },
        component: resolve => require.ensure([],() => resolve(require('src/components/bank_main/bankView'))),
        children: [
            ...logon
        ]
    }
    
]