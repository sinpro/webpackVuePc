
import VueI18n from 'vue-i18n';
import Vue from 'vue';
import ElementUI from 'element-ui';

import localezhCN from 'element-ui/lib/locale/lang/zh-CN'
import localezhTW from 'element-ui/lib/locale/lang/zh-TW'
import localeEn from 'element-ui/lib/locale/lang/en'

Vue.use(VueI18n);
import en from "./lang/en";
import zh_CN from "./lang/zh_CN";
import zh_HK from "./lang/zh_HK";

const lang = navigator.language == 'zh-CN' ? 'zh-CN' : navigator.language.startsWith('en') ? 'en' : 'zh-HK'; //zh-CN、en-US、zh-TW、
console.log(lang,'---------------lang--------------+++++')
const i18n = new VueI18n({
    locale: window.localStorage.getItem("lang") || lang,
    fallbackLocale: lang,
    messages: {
        'en': { ...en, ...localeEn },
        'zh-CN': { ...zh_CN, ...localezhCN },
        'zh-HK': { ...zh_HK, ...localezhTW }
    },
    silentTranslationWarn: true
});

Vue.use(ElementUI, {
    i18n: (key, value) => i18n.t(key, value) //重点！！在注册Element时设置i18n的处理方法（这里有个小坑）,为了实现element插件的多语言切换
});

export default i18n