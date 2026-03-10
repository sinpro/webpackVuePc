import Vue from 'vue';
import Router from 'vue-router';
import { MessageBox } from 'element-ui';
Vue.use(Router);
import i18n from '../i18n';
// 解决侧边栏重复点击报错问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({showSpinner: false})


import store from 'src/store';
import routes from './routes';
import whitePath from './whitePath';
const router = new Router({
    mode: 'hash',
    scrollBehavior: () => ({
        x: 0,
        y: 0
    }),
    routes
});
router.beforeEach((to, from, next) => {
    NProgress.start();
    const token = store.state.app.token || '';
    console.log(to,token,'fgdhgjdfhdfh')
    let routeObj = {};
    routeObj.path = to.path;
    routeObj.title = to.meta.title;
    routeObj.menuCode = to.meta.menuCode;
    if (token) {
        next()
    } else {
        if (whitePath.includes(to.path)) {
            next();

        } else {
            next({
                path: '/chb_logon/index'
            });
        }
    }
});
router.afterEach(to => {
    NProgress.done();
    // setTimeout(() => {
    //     if (to.name === 'HomeIndex') {
    //         const garyFlag = window.sessionStorage.getItem('homePageGray');
    //         if (garyFlag === '1') {
    //             document.body && (document.body.style.filter = 'grayscale(1)');
    //         } else {
    //             document.body && (document.body.style.filter = '');
    //         }
    //     } else {
    //         document.body.style.filter = ''
    //     }
    // });
});
export default router;
