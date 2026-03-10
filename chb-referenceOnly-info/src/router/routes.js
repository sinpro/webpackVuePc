import bank_logon from './bank_logon'; // 登录
import bank_home from './bank_home'; // 首页



// 不需要动态判断权限
const constantRoutes = [
    {
        path: '/serverError',
        name: 'serverError',
        component: !prodTypeEnv
            ? resolve =>
                require.ensure([], () =>
                    resolve(require('src/views/chb_commonPage/errorPage'))
                )
            : () =>
                import(
            /* webpackChunkName: "chb_commonPage" */ 'src/views/chb_commonPage/errorPage'
                )
    },
    {
        path: '*',
        name: '404',
        component: !prodTypeEnv
            ? resolve =>
                require.ensure([], () =>
                    resolve(require('src/views/chb_commonPage/errorPage'))
                )
            : () =>
                import(
            /* webpackChunkName: "chb_commonPage" */ 'src/views/chb_commonPage/errorPage'
                )
    }
];
// 需求动态判断权限并通过addRoutes 动态添加的页面
const asyncRoutes = [
    ...bank_logon, // 登录
    ...bank_home, // 首页
    {
        path: '/bank_layout/index',
        name: 'bank_layout',
        component:  resolve =>
                require.ensure([], () =>
                    resolve(require('src/components/bank_layout'))
                ),
        meta: {
            menuCode: '',
            title: 'routerView',
            navTitle: 'routerView'
        },
        children: [
            ...chb_acctManagement, // 账户
            ...chb_depositBusiness, // 存款
        ]
    }
];
const routes = [
    ...constantRoutes,
    ...asyncRoutes
];
export default [...routes];