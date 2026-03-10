import Vue from 'vue';
import App from './App.vue';
import i18n from './i18n';
import router from './router';
import store from './store';
import 'lib-flexible';

import './style/index.scss';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import axios from 'axios';
Vue.prototype.$axios = axios;

// 全局注册流动保安
import softToken from './components/bank-softToken/index';

Vue.prototype.$softToken = softToken;
Vue.use(ElementUI, {
    zIndex: 30000
});



// 注册全局工具
import * as commonfn from './utils/commonFn.js';
Object.keys(commonfn).forEach(fun => {
    Vue.prototype[`$${fun}`] = commonfn[fun];
});
// 注册全局正则
import * as regExp from './utils/regExp';
Vue.prototype.regExp = regExp;
// 注册全局指令
import * as directives from './directives';
Object.keys(directives).forEach(fun => {
    Vue.prototype[`$${fun}`] = directives[fun];
});
// 注册全局过滤器
import * as filters from './filters';
Object.keys(filters.default).forEach(fun => {
    Vue.filter(`${fun}`, filters.default[fun]);
    Vue.prototype[`$${fun}`] = filters.default[fun];
});

if (isMockEnv) {
    const mock = require('../mock');
    mock.mockXHR();
}
const root = document.createElement('div');
document.body.appendChild(root);
window.vm = new Vue({
    render: c => c(App),
    i18n,
    router,
    store,
    silentTranslationWarn: true,

}).$mount(root);