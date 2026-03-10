import home from './home';
export default [
    {
        path: "/bank_home/index",
        name: "bankHome",
        redirect: {
            path: "/bank_home/home/index"
        },
        component: (resolve => require.ensure([],() => resolve(require('src/components/bank_main/bankView')))),
        children: [
            ...home
        ]
    }
    
]