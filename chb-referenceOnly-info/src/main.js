import Vue from 'vue';
import App from './App.vue';
import i18n from './i18n';
import router from './router';
import store from './store';
import tools from './utils/cldTools'; //之前装好的组件
import 'lib-flexible';
import dialogTools from './utils/dialog'

import './style/index.scss';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import axios from 'axios';
Vue.prototype.$axios = axios;

// 全局注册流动保安
import softToken from './components/chb-softToken/index.js';

Vue.prototype.$softToken = softToken;
Vue.prototype.$tools = tools;
Vue.prototype.$myDialog = dialogTools;
Vue.use(ElementUI, {
    zIndex: 30000
});


function createITag() {
    let itag = document.createElement('i');
    console.log(itag, 'itag')
    itag.innerText = '测试一下';
    itag.style.position = 'absolute';
    itag.style.top = 0;
    itag.style.left = 0;
    // itag.style.opacity = 0;
    // itag.style.fontSize = '1px';
    let outerWrap = document.getElementsByClassName('el-message-box__headerbtn');
    console.log(outerWrap, 'outerWrap')
    console.dir(outerWrap, 'outerWrap')
    outerWrap.appendChild(itag)
}

import baseComponent from './components';
Vue.use(baseComponent);
import w3cComponents from './components/w3cComponents';
Vue.use(w3cComponents);


// 注册全局工具
import * as commonfn from './utils/commonFn.js';
Object.keys(commonfn).forEach(fun => {
    Vue.prototype[`$${fun}`] = commonfn[fun];
});
// 注册全局正则
import * as regExp from './utils/regExp';
//console.error('555555555555', regExp);
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
let lang = window.localStorage.getItem("lang") || "zh-CN"
if (lang == "zh-HK") {
    document.getElementById("html").setAttribute('lang', "zh-HK");
    document.getElementById("html").setAttribute('xml:lang', "zh-HK");
} else if (lang == "zh-CN") {
    document.getElementById("html").setAttribute('lang', "zh-cn");
    document.getElementById("html").setAttribute('xml:lang', "zh-cn");
} else {
    document.getElementById("html").setAttribute('lang', "en");
    document.getElementById("html").setAttribute('xml:lang', "en");
}

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