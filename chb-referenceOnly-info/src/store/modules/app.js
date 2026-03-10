import i18n from '../../i18n';
import { safeGetLocalStorage, safeSetLocalStorage, safeSetSession, safeGetSession } from 'src/utils/commonfn.js';
// import Cookies from 'js-cookie';
function setToken(state, token = '') {
    localStorage.setItem('token', token);
    state.token = token
};
// 设置用户菜单数据
function setInitUserMenus(state, menus = []) {
    safeSetLocalStorage('initUserMenus', menus);
    state.initUserMenus = menus;
}
// 设置用户菜单数据
function setUserMenus(state, menus = []) {
    safeSetLocalStorage('userMenus', menus);
    state.userMenus = menus;
}
// 设置用户菜单选中
function setUserMenusAct(state, userMenusAct = '') {
    safeSetLocalStorage('userMenusAct', userMenusAct);
    state.userMenusAct = userMenusAct;
}
// 设置用户侧边菜单栏
function setSliderMenus(state, menus = []) {
    safeSetLocalStorage('sliderMenus', menus);
    state.sliderMenus = menus;
}
// 设置侧边菜单栏选中
function setSliderMenusAct(state, sliderMenusAct = '') {
    safeSetLocalStorage('sliderMenusAct', sliderMenusAct);
    state.sliderMenusAct = sliderMenusAct;
}
// 设置面包屑列表
function setBreadcrumb(state, breadcrumb = []) {
    safeSetLocalStorage('breadcrumb', breadcrumb);
    state.breadcrumb = breadcrumb;
}
//设置用户登录信息
function setUserInfo(state, userInfo = []) {
    safeSetSession('userInfo', userInfo);
    state.userInfo = userInfo;
}
//设置三语言显示 langOptions
function setLangOptions(state, langOptions = []) {
    safeSetLocalStorage('langOptions', langOptions);
    state.langOptions = langOptions;
}
// 设置三语言标志 lang
function setLang(state, lang = '') {
    safeSetLocalStorage('lang', lang);
    state.lang = lang;
}
// 设置路由信息 routeObj
function setRouteObj(state, routeObj = {}) {
    safeSetLocalStorage('routeObj', routeObj);
    state.routeObj = routeObj;
}
// 设置字体标志
function setFontSize(state, fontSize = '') {
    safeSetLocalStorage('fontSize', fontSize);
    state.fontSize = fontSize;
}
// 设置字体状态
function setFontStuts(state, fontStuts = '') {
    safeSetLocalStorage('fontStuts', fontStuts);
    state.fontStuts = fontStuts;
}

// 设置防重复tranToken
function setTranToken(state, tranToken = '') {
    safeSetLocalStorage('tranToken', tranToken);
    state.tranToken = tranToken;
}
// 设置特殊的specialBizType
function setSpecialBizType(state, specialBizType = '') {
    safeSetLocalStorage('specialBizType', specialBizType);
    state.specialBizType = specialBizType;
}
// 是否点击侧边栏、首页、导航栏跳转页面
function setIsClickSliderHomeNavJump(state, isClickSliderHomeNavJump = '') {
    safeSetLocalStorage('isClickSliderHomeNavJump', isClickSliderHomeNavJump);
    state.isClickSliderHomeNavJump = isClickSliderHomeNavJump;
}


// banner图片缓存
function setCarouselList(state, carouselList = []) {
    safeSetLocalStorage('carouselList', carouselList);
    state.carouselList = carouselList;
}
// 设置当菜单功能被禁用时，禁止主页内容被点击
function setMenuAllow(state, menuAllow = true) {
    safeSetLocalStorage('menuAllow', menuAllow);
    state.menuAllow = menuAllow;
}
//设置待办事项数量缓存
function setTodoNum(state, todoNumObj = {}) {
    safeSetLocalStorage('todoNumObj', todoNumObj);
    state.todoNumObj = todoNumObj;
}
export default {
    // namespaced: true, // 模块化局部命名
    state: {
        loading: false,//是否需要loading
        maskLayer: false,//是否需要遮罩层
        token: localStorage.getItem('token'), //token
        initUserMenus: safeGetLocalStorage('initUserMenus', []),// 原始菜单列表
        userMenus: safeGetLocalStorage('userMenus', []),// 菜单列表
        userMenusAct: safeGetLocalStorage('userMenusAct', ''),// 菜单选中
        sliderMenus: safeGetLocalStorage('sliderMenus', []),// 侧边栏菜单
        sliderMenusAct: safeGetLocalStorage('sliderMenusAct', ''),// 侧边栏选中
        breadcrumb: safeGetLocalStorage('breadcrumb', ''),// 面包屑列表
        userInfo: safeGetSession('userInfo', ''),// 用户登录信息
        langOptions: safeGetLocalStorage('langOptions', [{ label: i18n.t('COMMON.TRADICTON_FOT'), value: 'zh-HK' }, { label: 'English', value: 'en' }]), //三语言列表
        lang: safeGetLocalStorage('lang', ''), //三语言标志
        routeObj: safeGetLocalStorage('routeObj', {}), //路由信息
        fontSize: safeGetLocalStorage('fontSize', 'A'), //设置字体标志
        fontStuts: safeGetLocalStorage('fontStuts', 'small'), //设置字体状态  small  middle big
        tranToken: safeGetLocalStorage('tranToken', ''), //设置字体标志
        specialBizType: safeGetLocalStorage('specialBizType', ''), //设置字体标志
        isClickSliderHomeNavJump: safeGetLocalStorage('isClickSliderHomeNavJump', ''), // 是否点击侧边栏、首页、导航栏跳转页面
        isFold: safeGetSession('isFold', 'false'), // 是否折叠
        carouselList: safeGetLocalStorage('carouselList', []),//banner图片缓存
        menuAllow: safeGetLocalStorage('menuAllow', true),//主页内容是否被禁用
        todoNumObj:safeGetLocalStorage('todoNumObj', {}), //待办事项
    },
    mutations: {
        setLoading(state, boolean) {
            state.loading = boolean;
        },
        setMaskLayer(state, boolean) {
            state.maskLayer = boolean;
        },
        setFlowNo(state, flowNo) {
            state.flowNo = flowNo;
        },
        setToken,
        setInitUserMenus,
        setUserMenus,
        setUserMenusAct,
        setSliderMenus,
        setSliderMenusAct,
        setBreadcrumb,
        setUserInfo,
        setLangOptions,
        setLang,
        setRouteObj,
        setFontSize,
        setFontStuts,
        setTranToken,
        setSpecialBizType,
        setIsClickSliderHomeNavJump,
        setIsFold(state, isFold) {
            safeSetSession('isFold', isFold)
            state.isFold = isFold;
        },
        setCarouselList,
        setMenuAllow,
        setTodoNum
    },
    actions: {
        // getUserMenus(ctx, Vue) {
        //   Vue.$api.getMenus().then((res) => {
        //     const { menuList } = res.data;
        //     ctx.commit('setUserMenus', Object.freeze(menuList)); // 数据太大，需要freeze一下，否则耗性能
        //   });
        // }
    },
    getters: {
        getLoading(state) {
            return state.loading;
        },
        getMaskLayer(state) {
            return state.maskLayer;
        },
        getToken(state) {
            return state.token;
        },
        getFlowNo(state) {
            return state.flowNo
        },
        getInitUserMenus(state) {
            return state.initUserMenus;
        },
        getUserMenus(state) {
            return state.userMenus;
        },
        getUserMenusAct(state) {
            return state.userMenusAct;
        },
        getSliderMenus(state) {
            return state.sliderMenus;
        },
        getSliderMenusAct(state) {
            return state.sliderMenusAct;
        },
        getBreadcrumb(state) {
            return state.breadcrumb;
        },
        getUserInfo(state) {
            return state.userInfo;
        },
        getLangOptions(state) {
            return state.langOptions;
        },
        getLang(state) {
            return state.lang;
        },
        getRouteObj(state) {
            return state.routeObj;
        },
        getFontSize(state) {
            return state.fontSize;
        },
        getFontStuts(state) {
            return state.fontStuts;
        },
        getTranToken(state) {
            return state.tranToken;
        },
        getSpecialBizType(state) {
            return state.specialBizType;
        },
        getIsClickSliderHomeNavJump(state) {
            return state.isClickSliderHomeNavJump;
        },
        getCarouselList(state) {
            return state.carouselList;
        },
        getMenuAllow(state) {
          return state.menuAllow;
        },
        getTodoNum(state) {
          return state.todoNumObj;
        },
        getIsFold(state) {
            return eval((state.isFold).toLowerCase());
            // return state.isFold;
        }
    }
};