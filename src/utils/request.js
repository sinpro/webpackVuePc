import Vue from 'vue';
import axios from 'axios';
import store from '../store';
import MyPromise, { resolve } from 'promise'; // 兼容ie10，promise resolve之后 then不执行的问题
import router from '../router';
import browser from 'utils/browser';
import device from 'utils/device';
import e2eeUtil from './e2ee_util';
import { MessageBox } from 'element-ui';
import i18n from '../i18n';
import utils from 'utils';
import api from 'src/apis/chb_logon';
let ajaxCounter = 0;
function rqs(data) {
    return JSON.stringify(data);
}

/**
 * messageBox单例模式
 */
const h = new Vue().$createElement;
let messageBoxInstance = null;
let mainMessageBox = function DoneMessageBox(options) {
    if (messageBoxInstance) {
        return;
    } else {
        options.center = true;
        options.closeOnClickModal = false;
        options.showClose = false;
        messageBoxInstance = MessageBox(options);
    }
};
const singleMessageBox = mainMessageBox;
// 获取vue链
const $$vue = Vue.prototype;
/**
 * 处理生产环境和开发环境接口请求地址
 * @param config
 * @returns {any}
 */
let urlWhiteList = ['/nibsCommVersionCtrl/versionCtrlQuery']
function handlePreUrl(config = {}) {
    const {
        url = '', // 接口地址
        devPreUrl = '', // 开发环境url前缀地址
        prodPreUrl = '', // 生产环境url前缀地址
        demoPreUrl = '' // demo环境url前缀地址
    } = config;
    let fixUrl = url; // 拼接的url
    if (NODE_ENV === 'production') {
        if (NODE_MODE == 'demo') {
            fixUrl = `${demoPreUrl}${ENV_CONFIG.apiPrefixPath}${url}`;
        } else {
            let getUrl = window.location.href.split('webbank')[0];
            fixUrl =
                window.location.href.indexOf('webbank-beta') != -1
                    ? `${getUrl}${ENV_CONFIG.apiProdfixBetaPath}${url}`
                    : `${getUrl}${ENV_CONFIG.apiProdfixPath}${url}`;
        }
    } else {
        if (NODE_MODE == 'demo') {
            fixUrl = `${demoPreUrl}${ENV_CONFIG.apiPrefixPath}${url}`;
        } else {
            fixUrl = `${devPreUrl}${ENV_CONFIG.apiPrefixPath}${url}`;
            // fixUrl = `${demoPreUrl}${ENV_CONFIG.apiPrefixPath}${url}`;
        }
    }
    // 白名单放行
    if (
        e2eeUtil.isWhiteList(config.url) || 
        urlWhiteList.includes(config.url)|| 
        config.url.startsWith('/noTextCipher/') ||
        config.url.startsWith('/noLogin/')) {
        return Object.assign(config, { url: fixUrl });
    }
    // e2ee准备好
    if (e2eeUtil.ready()) {
        e2eeEncryptRequest(config);
        return Object.assign(config, { url: fixUrl });
    }
    // e2ee没有准备好则等待
    return new Promise((resolve, reject) => {
        let count = 0;
        const timer = setInterval(() => {
            count++;
            if (e2eeUtil.ready()) {
                clearInterval(timer);
                e2eeEncryptRequest(config);
                resolve(Object.assign(config, { url: fixUrl }));
            } else if (count > 15) {
                store.commit('setLoading', false);
                clearInterval(timer);
                reject();
            }
        }, 1000);
    });
}
const ajax = axios.create({
    baseURL: '',
    timeout: 180000,
    transformRequest: [rqs],
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        'X-origin': '',
        'Access-Control-Allow-Origin': '*'
    }
});
ajax.interceptors.request.use(
    config => {
        if (!config['noLoading']) {
            ajaxCounter++;
            store.commit('setLoading', true);
        }
        // 请求头设置token
        config.headers['X-Auth-Token'] = store.getters.getToken
            ? store.getters.getToken
            : null;
        config.headers['Accept-Language'] = store.getters.getLang;
        const uuid = require('uuid');
        let uu,
            localUU = window.localStorage.getItem('pcUuid');
        if (localUU) {
            uu = localUU;
        } else {
            uu = uuid.v1();
            window.localStorage.setItem('pcUuid', uu);
        }
        config.headers['deviceId'] = window.localStorage.getItem('pcUuid');
        // 允许get请求下，可设置请求头
        if (config.method === 'get') {
            config.data = {};
            return handlePreUrl(config);
        }
        const browserObj = browser.matchVersion();
        let routeObj = store.getters.getRouteObj;
        config.data.head = {
            channel: 'WEB',
            deviceType: 'PC',
            legalPersonCode: '001',
            deviceId: window.localStorage.getItem('pcUuid'),
            deviceName: '',
            deviceOs: device?.deviceOs || '',
            deviceOsVersion: device?.deviceOsVersion || '',
            browserName: browserObj.browser,
            browserMajor: browserObj.version.split('.')[0],
            custNo: store.getters.getUserInfo.custNo
                ? store.getters.getUserInfo.custNo
                : '',
            unifiedAuthenticationInf: config.data.body?.unifiedAuthenticationInf
                ? config.data.body.unifiedAuthenticationInf
                : undefined,
            tranCode: config.data.body?.tranCode
                ? config.data.body.tranCode
                : undefined,
            menuCode: routeObj.menuCode,
            tranToken: config['preventRepeat']
                ? store.getters.getTranToken
                : undefined
        };
        if (config && config.data && config.data.body) {
            delete config.data.body.unifiedAuthenticationInf;
            delete config.data.body.tranCode;
        }
        return handlePreUrl(config);
    },
    err => {
        ajaxCounter = 0;
        store.commit('setLoading', false);
        console.log(err, 3333);
        if (!err.config.url.includes('/updateE2eeKey')) {
            // 更新加密因子不需要报错
            $$vue.$alert(i18n.t('COMMON.TIMEOUT_NET'), i18n.t('COMMON.TITLE_TIPS'), {
                confirmButtonText: i18n.t('COMMON.BUTTON_CONFIRM'),
                center: true,
                callback: action => {
                    return new MyPromise((resolve, reject) => reject(err));
                }
            });
        }
    }
);

ajax.interceptors.response.use(
    response => {
        if (response.config.url.includes('/login/unifiedLogin')) {
            store.commit(
                'setToken',
                NODE_MODE === 'demo' ? 'ddd0223' : response.headers['x-auth-token']
            );
        }
        if (!response.config['noLoading'] && ajaxCounter > 0) {
            ajaxCounter--;
        }
        if (ajaxCounter <= 0) {
            ajaxCounter = 0;
            store.commit('setLoading', false);
        }
        let result = e2eeDecryptReponse(response);
        if (response.config.responseType == 'blob') {
            result = {
                headers: response.headers || {},
                data: response.data || {}
            };
            return new MyPromise(resolve => resolve(result));
        }

        if (result.head.returnCode === '000000') {
            return new MyPromise(resolve => resolve(result));
        } else {
            if (response.config['preventRepeat']) {
                if (store.getters.getSpecialBizTypen) {
                    getCommonToken(store.getters.getSpecialBizType);
                } else {
                    getCommonToken(store.getters.getRouteObj.bizType);
                }
            }
            if (errCodeList.errorMsgObj[result.head.returnCode]) {
                // let errorMsg=((result.head.returnCode=='PEGW000004' || result.head.returnCode=='PEGW000007')&&store.getters.getLang=='en')
                // ?'You have logged on to i-Banking in another device. The logon session has expired for security reason. '
                // :result.head.returnMessage;
                // 周瑜说直接取这个不再做单独处理
                let errorMsg = result.head.returnMessage;
                if (result.head.returnCode === 'sys-update') {
                    singleMessageBox({
                        title: i18n.t('COMMON.LABEL_CONFIRM'),
                        message: i18n.t('COMMON.SYSTEM_UP'),
                        confirmButtonText: i18n.t('COMMON.CHECH_DETAIL'),
                        showCancelButton: false,
                        type: 'warning',
                        callback: action => {
                            messageBoxInstance = null;
                            api.logout({}).then(res => {
                                store.commit('setToken', '');
                                store.commit('setUserInfo', {});
                                store.commit('setUserMenus', []);
                                store.commit('setUserMenusAct', '');
                                store.commit('setSliderMenus', []);
                                store.commit('setSliderMenusAct', '');
                                store.commit('setBreadcrumb', []);
                                store.commit('setCarouselList', []);
                                if (router.history.current.name !== 'logon') {
                                    router.replace({ path: '/chb_logon/logon/index' });
                                }
                                sessionStorage.setItem('isSoftToken', '');
                                const url = utils.matchPath('ABOUT_SYSTEM');
                                window.open(url);
                            });
                        }
                    });
                    return;
                }
                singleMessageBox({
                    title: i18n.t('COMMON.TITLE_TIPS'),
                    message: errorMsg,
                    confirmButtonText: i18n.t('COMMON.BUTTON_CONFIRM'),
                    showCancelButton: false,
                    type: 'warning',
                    center: true,
                    callback: action => {
                        api.logout({}).then(res => {
                            store.commit('setToken', '');
                            store.commit('setUserInfo', {});
                            store.commit('setUserMenus', []);
                            store.commit('setUserMenusAct', '');
                            store.commit('setSliderMenus', []);
                            store.commit('setSliderMenusAct', '');
                            store.commit('setBreadcrumb', []);
                            store.commit('setCarouselList', []);
                            router.replace({ path: '/chb_logon/logon/index' });
                            sessionStorage.setItem('isSoftToken', '');
                            setTimeout(() => {
                                window.location.reload();
                            }, 200)
                        });
                    }
                });
            } else {
                const specialAllLsit = Object.keys(errCodeList.specialAllErrorCode);
                const specialHalfLsit = Object.keys(errCodeList.specialHalfErrorCode);
                let bool = specialAllLsit.includes(result.head.returnCode);
                if (!bool) {
                    //  基金的錯誤碼會出現 EC100110,EC306467 的情況，所以修改此處邏輯
                    bool = specialHalfLsit.some(item =>
                        result.head.returnCode.includes(item)
                    );
                }
                if (!bool) {
                    // 错误码 + 接口维度特殊处理
                    const specialErrcodeList = Object.keys(errCodeList.errCodeUrlList);
                    console.log(specialErrcodeList, 'specialErrcodeList');
                    if (specialErrcodeList.includes(result.head.returnCode)) { // 判断错误码
                        const specialUrlList = Object.keys(errCodeList.errCodeUrlList[result.head.returnCode]);
                        const urlKey = specialUrlList.filter(item => response.config.url.includes(item));
                        if (urlKey && urlKey.length) { // 判断接口名
                            const errCodeMap = errCodeList.errCodeUrlList[result.head.returnCode];
                            const bsnCodeList = errCodeMap[urlKey[0]];
                            const bsnCode = JSON.parse(response.config.data)?.body?.bsnCode || '';
                            if(bsnCodeList && bsnCodeList.length) { // 判断是否是公共接口
                                console.log(bsnCodeList.filter(item => item == bsnCode));
                                if (bsnCodeList.filter(item => item == bsnCode)?.length) bool = true;  // 公共接口判断交易码
                            } else bool = true;
                        }
                    }
                }
                if (!bool) {
                    $$vue.$alert(result.head.returnMessage, i18n.t('COMMON.TITLE_TIPS'), {
                        confirmButtonText: i18n.t('COMMON.BUTTON_CONFIRM'),
                        center: true,
                        callback: action => { }
                    });
                    return new MyPromise((resolve, reject) => reject(result));
                } else {
                    return new MyPromise((resolve, reject) => reject(result));
                }
            }
        }
    },
    err => {
        console.log(err,'3333333333-----err')
        ajaxCounter = 0;
        store.commit('setLoading', false);
        if (!err.config.url.includes('/updateE2eeKey') && !err.config.url.includes('/fss-file/download')) {
            if(err.response&&err.response.status==503){
                console.log(err.response,'55555555-----err.response')
                router.replace({ path: '/chb_transferService/fastTransfer/ngErrorMsg' });
            }else{
                // 更新加密因子和图片下载不需要报错
                $$vue.$alert(i18n.t('COMMON.SYS_ERROR'), i18n.t('COMMON.TITLE_TIPS'), {
                    confirmButtonText: i18n.t('COMMON.BUTTON_CONFIRM'),
                    center: true,
                    callback: action => { }
                });
            }
        }
        return new MyPromise((resolve, reject) => reject(err));
    }
);
// 加密
function e2eeEncryptRequest(config) {
    console.warn(config.data, config.url, '加密-传入参数');
    if (e2eeUtil.enable()) {
        config.encrypt = true;
        const timestamp = new Date().getTime();
        console.log(
            e2eeUtil.expire(),
            '--expire',
            timestamp,
            '--timestamp',
            e2eeUtil.expire() - timestamp,
            '--加密减法计算'
        );
        if (e2eeUtil.expire() - timestamp > 0) {
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
            config.headers['E-EXCHANGE-ID'] = e2eeUtil.exchangeId();
            try {
                config.data = e2eeUtil.encrypt(JSON.stringify(config.data));
            } catch (e) {
                $$vue.$alert(i18n.t('COMMON.FAIL_ENCRYPT'));
                throw e;
            }
        } else {
            console.log('是否时间已过期');
            window.location.reload();
        }
    }
}
// 解密
function e2eeDecryptReponse(response) {
    if (e2eeUtil.enable() && response.config?.encrypt) {
        const timestamp = new Date().getTime();
        if (e2eeUtil.expire() - timestamp > 0) {
            response.encrypt = true;
            response.headers['Content-Type'] = 'application/json;charset=UTF-8';
            response.headers['E-EXCHANGE-ID'] = e2eeUtil.exchangeId();
            try {
                let obj = e2eeUtil.decrypt(response.data);
                let responseData = JSON.parse(obj) || {};
                console.log(responseData, response.config.url, '解密-返回参数');
                return responseData;
            } catch (e) {
                console.log(e, '解密失败')
                // $$vue.$alert(i18n.t('COMMON.FAIL_DECRYPT'));
                // throw e;
            }
        }
    } else {
        return response.data || {};
    }
}

export default ajax;
