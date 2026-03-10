import Vue from 'vue';
import Router from 'vue-router';
import api from '../apis/chb_commonPage';
import { MessageBox } from 'element-ui';
Vue.use(Router);
import i18n from '../i18n';
// 解决侧边栏重复点击报错问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};
import store from 'src/store';
import routes from './routes';
import { getCommonToken, isMobile } from 'src/utils/commonfn';
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
    if (!store.getters.getLang) {
        const lang = navigator.language == 'zh-CN' ? 'zh-CN' : navigator.language.startsWith('en') ? 'en' : 'zh-HK'; //zh-CN、en-US、zh-TW、
        console.log(lang, 'langlanglanglang---')
        let options = [
            { label: i18n.t('COMMON.SIMPLE_FOT'), value: 'zh-CN' },
            { label: i18n.t('COMMON.TRADICTON_FOT'), value: 'zh-HK' },
            { label: 'English', value: 'en' }
        ]
        // console.log(this.$i18n,`this.$i18n--this.$i18n--+++`)
        i18n.locale = lang;
        store.commit('setLangOptions', (options.filter(item => item.value !== lang)));
        store.commit('setLang', lang)
        document.title = i18n.t('COMMON.DOCUMENT_TITIE')
    }
    // 基金以及其他业务免登陆 处理---start--
    let channelType = to.query?.channelType || ''
    let isLoginGoUrl =
        localStorage.getItem('isLoginGoUrl') || '';
    if (channelType == 'noLogin' && !whitePath.includes(to.path)) {
        // sessionStorage.setItem('changeLang', true);
        let urlLang = to.query?.lang ? to.query.lang : navigator.language == 'zh-CN' ? 'zh-CN' : navigator.language.startsWith('en') ? 'en' : 'zh-HK'; //zh-CN、en-US、zh-TW、
        console.log(urlLang, 'urlLangurlLangurlLang----')
        let options = [
            { label: i18n.t('COMMON.SIMPLE_FOT'), value: 'zh-CN' },
            { label: i18n.t('COMMON.TRADICTON_FOT'), value: 'zh-HK' },
            { label: 'English', value: 'en' }
        ]
        i18n.locale = urlLang;
        store.commit('setLangOptions', (options.filter(item => item.value !== urlLang)));
        store.commit('setLang', urlLang)
        whitePath.push(to.path)
    } else {
        if (isLoginGoUrl) {
            // console.log(whitePath, 'whitePath')
            whitePath.splice(whitePath.indexOf(isLoginGoUrl), 1)
        }
    }
    // 基金以及其他业务免登陆 处理---end--
    const token = store.state.app.token || '';
    let routeObj = {};
    routeObj.path = to.path;
    routeObj.title = to.meta.title;
    routeObj.menuCode = to.meta.menuCode;
    routeObj.bizType = to.meta.bizType;
    routeObj.navTitle = to.meta.navTitle;
    store.commit('setRouteObj', routeObj)
    const bizType = to.meta.bizType || '';
    const menuCode = to.meta.menuCode || '';
    if (token) {
        querySusMenu(menuCode, next, to);
        if (bizType) {
            if (store.getters.getSpecialBizType) {
                getCommonToken(store.getters.getSpecialBizType);
            } else {
                getCommonToken(bizType);
            }
        } else {
            store.commit('setTranToken', '');
            store.commit('setSpecialBizType', '');
        }
        next()
    } else {
        querySusMenu(menuCode, next, to);
        if (whitePath.includes(to.path)) {
            if (isMobile() && to.path == '/chb_logon/logon/index') {
                next({
                    path: '/chb_logon/appGuide/index'
                });
            } else {
                next();
            }

        } else {
            next({
                path: '/chb_logon/index'
            });
        }
    }
});
router.afterEach(to => {
    setTimeout(() => {
        if (to.name === 'HomeIndex') {
            const garyFlag = window.sessionStorage.getItem('homePageGray');
            if (garyFlag === '1') {
                document.body && (document.body.style.filter = 'grayscale(1)');
            } else {
                document.body && (document.body.style.filter = '');
            }
        } else {
            document.body.style.filter = ''
        }
    });
});
function querySusMenu(menuCode, next, to) {
    if (menuCode === 'W00' || menuCode === 'W01') {
        if (localStorage.getItem('refreshAndLogout')) {
            localStorage.removeItem('refreshAndLogout')
        }
        next();
    } else {
        api
            .querySusMenu({
                menuCode
            })
            .then(res => {
                if (res.head.returnCode === '000000') {
                    localStorage.removeItem('isHiddeAccOverFlag')
                    if (res.body?.tipType) {
                        if(menuCode=='W0201'&&res.body.campaignNo=='1000052141'&&res.body.flag=='1'){
                            localStorage.setItem('isHiddeAccOverFlag', true);
                        }
                        // 提示类型：0-禁止，1-警告
                        if (res.body.tipType === '0' && res.body.tip) {
                            MessageBox.alert(res.body.tip, {
                                center: true,
                                showClose: false,
                                type: 'warning'
                            }).catch(() => {
                                router.replace('/chb_homePage/home/index');
                            });
                            store.commit('setMenuAllow', false)
                        } else if (res.body.tipType === '1' && res.body.tipWarning && to.meta?.warnCloudPopup) {
                            MessageBox.confirm(res.body.tipWarning, {
                                confirmButtonText: i18n.t('COMMON.BUTTON_CONTINUE'),
                                cancelButtonText: i18n.t('COMMON.BUTTON_CANCEL'),
                                center: true,
                                showClose: false,
                                type: 'warning'
                            }).then(() => {
                                store.commit('setMenuAllow', true)
                            }).catch(() => {
                                router.replace('/chb_homePage/home/index');
                                store.commit('setMenuAllow', false)
                            })
                        } else {
                            store.commit('setMenuAllow', true)
                        }
                    } else if (to.query?.channelType == 'noLogin' && whitePath.includes(to.path) && to.path == '/chb_investService/fund/fundBuy/index') { // 基金免登陸的
                        if (isMobile()) {
                            next({
                                path: '/chb_logon/appGuide/index'
                            });
                        } else {
                            next();
                        }
                    } else if (localStorage.getItem('refreshAndLogout')) {
                        // 刷新页面，退出登录
                        // 重新进入页面时，清除标记
                        localStorage.removeItem('refreshAndLogout')
                        store.commit('setMenuAllow', true)
                        next({
                            path: '/chb_logon/index'
                        });
                    } else {
                        store.commit('setMenuAllow', true)
                        next();
                    }
                }
            });
    }
}
export default router;
