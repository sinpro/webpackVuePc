import login from './logon';
export default [
    {
        path: "/bank_logon/index",
        name: "bank_logon",
        redirect: {
            component: (resolve => require.ensure([],() => resolve(require('src/components/bank_main/bankView')))),
        },
        children: [
            ...login
        ]
    }
    
]