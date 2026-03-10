import store from '../store';
import router from '../router';

import link from './link';
import Vue from 'vue';
const $$vue = Vue.prototype;

/**
 * 处理xxx的工具
 * 豆江东
 * @param name  storage的key值
 * @param defaultVal  storage的默认值
 * @returns {*}
 */
export function safeGetLocalStorage(name = '', defaultVal = '') {
    if (!name) return;
    let localNameDatas;
    const getLocalData = localStorage.getItem(name);
    if (getLocalData && getLocalData !== '[object Object]') {
        if (/^(\[|\{)/.test(getLocalData)) {
            localNameDatas = JSON.parse(getLocalData);
        } else {
            localNameDatas = getLocalData;
        }
    } else {
        localNameDatas = defaultVal;
    }
    return localNameDatas;
}
/**
 * 设置安全localStorage数据
 * @param name
 * @param defaultVal
 */
export function safeSetLocalStorage(name = '', defaultVal = '') {
    if (!name) return;
    let safeValue = defaultVal;
    if (typeof safeValue === 'object') {
        safeValue = JSON.stringify(safeValue);
    }
    localStorage.setItem(name, safeValue)
}
/**
 * 获取安全localStorage数据
 * @param name  storage的key值
 * @param defaultVal  storage的默认值
 * @returns {*}
 */
export function safeGetSession(name = '', defaultVal = '') {
    if (!name) return;
    let localNameDatas;
    const getLocalData = sessionStorage.getItem(name);
    if (getLocalData && getLocalData !== '[object Object]') {
        if (/^(\[|\{)/.test(getLocalData)) {
            localNameDatas = JSON.parse(getLocalData);
        } else {
            localNameDatas = getLocalData;
        }
    } else {
        localNameDatas = defaultVal;
    }
    return localNameDatas;
}

/**
 * 设置安全localStorage数据
 * @param name
 * @param defaultVal
 */
export function safeSetSession(name = '', defaultVal = '') {
    if (!name) return;
    let safeValue = defaultVal;
    if (typeof safeValue === 'object') {
        safeValue = JSON.stringify(safeValue);
    }
    sessionStorage.setItem(name, safeValue)
}

/**
* 获取对应选中的当前侧边栏项的所有节点
* @param menuNo 当前传入的menuNo
* @param arr 当前的整条数组
* @param concatArr 默认为空，不用传
*/
//
export const getActiveClickArr = (path = '', arr = [], concatArr = []) => {
    if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            let currentArr = concatArr.concat();
            currentArr.push(arr[i]);
            if (path && (arr[i].path === path) && (arr[i].meta.navTitle || arr[i].meta.isRleoadNav)) {
                return currentArr;
            }
            if (arr[i].children && arr[i].children.length > 0) {
                let resultArr = getActiveClickArr(
                    path,
                    arr[i].children,
                    currentArr
                );
                if (resultArr) {
                    return resultArr;
                }
            }
        }
    }

}

/**
 * 递归找到最后一个menuChildList
 * @param arr 当前的整条数组
 */
export const recursionChild = (arr = {}) => {
    if (arr.children && arr.children.length > 0) {
        return recursionChild(arr.children[0])
    } else {
        return arr
    }
}
/**
 * 递归找到树形列表中对应的一个
 * @param arr 当前的整条数组
 * @param name 当前的name名称
 */
export function deepQuery(tree = [], name) {
    let isGet = false;
    let retNode = null;
    function deepSearch(tree, name) {
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].children && tree[i].children.length > 0) {
                deepSearch(tree[i].children, name)
            }
            if (name === tree[i].menuPath || isGet) {
                isGet || (retNode = tree[i]);
                isGet = true;
                break;
            }
        }
    }
    deepSearch(tree, name)
    return retNode;
}
/**
 * 递归找到树形列表中对应的一个
 * @param arr 当前的整条数组
 * @param name 当前的menuNo
 */
export function deepQuerya(tree = [], menuNo = '') {
    let isGet = false;
    let retNode = null;
    function deepSearch(tree, menuNo) {
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].children && tree[i].children.length > 0) {
                deepSearch(tree[i].children, menuNo)
            }
            if (menuNo === tree[i].menuNo || isGet) {
                isGet || (retNode = tree[i]);
                isGet = true;
                break;
            }
        }
    }
    deepSearch(tree, menuNo)
    return retNode || {};
}
/**
 * 找到最深的节点做选中处理
* @url url
*/
export function selectDeep(deepChild, allFirstArr, query, isJumpTab) {
    store.commit('setBreadcrumb', (getActiveClickArr(deepChild.menuNo, [allFirstArr]))); // 重置面包屑
    store.commit('setUserMenusAct', store.getters.getBreadcrumb[0].menuNo); // 设置头部选中
    if (deepChild.isTabAdd === '1') {
        store.commit('setSliderMenusAct', store.getters.getBreadcrumb[store.getters.getBreadcrumb.length - 2].menuNo); // 设置选中侧边栏
    } else {
        store.commit('setSliderMenusAct', store.getters.getBreadcrumb[store.getters.getBreadcrumb.length - 1].menuNo); // 设置选中侧边栏
    }
    if (!isJumpTab) {
        if (JSON.stringify(query) == '{}' || !query) {
            router.push(store.getters.getBreadcrumb[store.getters.getBreadcrumb.length - 1].menuPath); // 跳转到对应路由
        }
    }
}
/**
 * ie获取mac地址和ip
 * @param 
 */
export function getMacInfo() {
    let locator = new ActiveXObject("WbemScripting.SWbemLocator");
    let service = locator.ConnectServer(".");
    let properties = service.ExecQuery("select * from Win32_NetworkAdapterConfiguration where IPEnabled=True");
    let e = new Enumerator(properties);
    let p = e.item();
    return {
        mac: p.MACAddress,
        ip: p.IPAddress(0),
        macName: p.DNSHostName
    }
}

/**
 * 找到最深的节点做选中处理
* @url url
*/
export function nestedSearch(obj, keyChain) {
    const keys = keyChain.split(".");
    console.log(obj, keyChain, keys, 'keyskeys')
    return keys.reduce((p, n) => {
        p = p?.[n];
        return p;
    }, obj)
}


// 修改页面大小
export function changeZoom(zoomType) {
    if (zoomType == 'A') {
        document.body.classList.add('zoom-small');
        document.body.classList.remove('zoom-middle');
        document.body.classList.remove('zoom-big');
    } else if (zoomType == 'AA') {
        document.body.classList.add('zoom-middle');
        document.body.classList.remove('zoom-small');
        document.body.classList.remove('zoom-big');
    } else if (zoomType == 'AAA') {
        document.body.classList.add('zoom-big');
        document.body.classList.remove('zoom-small');
        document.body.classList.remove('zoom-middle');
    }
}
export function getFontSize(x = 0, size = 'small') {
    var elements = document.getElementsByTagName("*");
    var currFontSize = parseInt(window.getComputedStyle(elements[0], null).getPropertyValue('font-size'));
    var smallFontSize = 45, middleFontSize = 47, middleFontSize = 48;
    console.log(currFontSize, 'currFontSizecurrFontSize')
    for (var i = 0; i < elements.length; i++) {
        var fontSize = parseInt(window.getComputedStyle(elements[i], null).getPropertyValue('font-size'));
        fontSize += x;
        elements[i].style.fontSize = fontSize + "px";
    }
    if (size == 'A') {
        store.commit('setFontStuts', 'small'); // 
    } else if (size == 'AA') {
        store.commit('setFontStuts', 'middle'); // 
    } else if (size == 'AAA') {
        store.commit('setFontStuts', 'big'); // 
    }

}

// 协议跳转
export function agreeClick(str = '') {
    let url = link.matchPath(str)
    window.open(url)
}


let timer, flag;
/**
 * 节流原理：在一定时间内，只能触发一次
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
export const throttle = (func, wait = 1000, immediate = true) => {

    if (immediate) {
        if (!flag) {
            flag = true
            // 如果是立即执行，则在wait毫秒内开始时执行
            typeof func === 'function' && func()
            timer = setTimeout(() => {
                flag = false
            }, wait)
        }
    } else if (!flag) {
        flag = true
        // 如果是非立即执行，则在wait毫秒内的结束处执行
        timer = setTimeout(() => {
            flag = false
            typeof func === 'function' && func()
        }, wait)
    }
}


let timeout = null

/**
 * 防抖原理：一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
export const debounce = (func, wait = 1000, immediate = false) => {
    // 清除定时器
    if (timeout !== null) clearTimeout(timeout)
    // 立即执行，此类情况一般用不到
    if (immediate) {
        const callNow = !timeout
        timeout = setTimeout(() => {
            timeout = null
        }, wait)
        if (callNow) typeof func === 'function' && func()
    } else {
        // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
        timeout = setTimeout(() => {
            typeof func === 'function' && func()
        }, wait)
    }
}

/**
 * 判断是否是手机端
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
export function isMobile() {
    var userAgentInfo = navigator.userAgent;

    // 判断是否为Android设备
    if (/android/i.test(userAgentInfo)) {
        return true;
    }

    // 判断是否为IOS设备
    else if (/(iPhone|iPad|iPod)/i.test(userAgentInfo)) {
        return true;
    }

    // 其他情况默认为PC端
    else {
        return false;
    }
}

/**
 * 富文本图片的src添加前缀 
 * @param {*} htmlCont  内容
 * @param {*} preUrl   前缀
 */
export function replaceImgSrcPre(htmlCont,preUrl){
    htmlCont=htmlCont.replace(/<img[^>]+src="([^">]+)"/g,(match,src)=>{
        return match.replace(src,preUrl+src);
    })
    return htmlCont;
}

/**
 * 登出当前会话，清除所有 
 * @param {*} htmlCont  内容
 * @param {*} preUrl   前缀
 */
export function LogoutClear(){
    // 不需要提示
    // $$vue.$alert( 
    //     i18n.t('COMMON.THIS_LOGOT_TIPS'), 
    //     i18n.t('COMMON.TITLE_TIPS'), {
    //     confirmButtonText: i18n.t('COMMON.BUTTON_CONFIRM'),
    //     center: true,
    //     showClose: false,
    //     type:'warning',
    //     callback: action => {
            api.logout({}).then(res => {
                store.commit('setToken', '');
                store.commit('setUserInfo', {});
                store.commit('setUserMenus', []);
                store.commit('setUserMenusAct', '');
                store.commit('setSliderMenus', []);
                store.commit('setSliderMenusAct', '');
                store.commit('setBreadcrumb', []);
                store.commit('setCarouselList', []);
                sessionStorage.clear();
                localStorage.removeItem('bindMobileFlag');
                localStorage.removeItem('t24MobileNo');
                router.replace({ path: '/chb_logon/logon/index' });
            })
    //     }
    // });
}
 /**
   * 滚动到报错位置：滚动到报错位置
   *
   * @param {Function} func 滚动到报错位置
   * @return null
   */
export function scrollError(){
    $$vue.$nextTick(() => {
        let dom = document.querySelectorAll(".el-form-item__error");
        if (dom[0].style.display !== "none") {
            dom[0].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            return;
        }
    });
}