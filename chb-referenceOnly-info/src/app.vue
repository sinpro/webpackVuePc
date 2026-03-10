<!--
  * @author:doujiandong
  * @date:2023/05/13
  * @describe:开发模板
  * @modified:
-->
<template>
  <transition name="fadeIn">
    <router-view></router-view>
  </transition>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import e2eeUtil from 'src/utils/e2ee_util';
import api from 'src/apis/chb_logon';
import mobilePath from 'src/router/mobilePath';
export default {
  data() {
    return {
      name: '',
      age: ''
    };
  },
  computed: {
    ...mapGetters([
      'getUserMenus',
      'getUserMenusAct',
      'getSliderMenus',
      'getSliderMenusAct'
    ])
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        // console.log(newVal,this.getUserMenus,this.getSliderMenus,'newValnewValnewValnewVal')
        if (newVal.meta.navTitle || newVal.meta.isRleoadNav) {
          let menuAll =
            this.$getActiveClickArr(newVal.path, this.getUserMenus) || [];
          let currSilder =
            menuAll.length > 0 ? this.filterArr(menuAll[0].children) : null;
          let currSliderSelect = menuAll[menuAll.length - 1] || {};

          this.setUserMenusAct(menuAll[0]?.name);
          this.setSliderMenus(currSilder);
          this.setSliderMenusAct(
            currSliderSelect.name && currSliderSelect.meta.isRleoadNav
          );
          if (newVal.path !== '/chb_logon/logon/index') {
            if (
              newVal.path == '/chb_investService/fund/fundBuy/index' &&
              newVal.query?.channelType == 'noLogin'
            ) {
              document.getElementById('CHBankTitle').innerHTML =
                this.$t('COMMON.DOCUMENT_TITIE') +
                ' - ' +
                this.$t(`${this.$route.meta.newTitle}`);
              return;
            }
            document.getElementById('CHBankTitle').innerHTML =
              this.$t('COMMON.DOCUMENT_TITIE') +
              ' - ' +
              this.$t(`${this.$route.meta.title}`);
          } else {
            document.getElementById('CHBankTitle').innerHTML = this.$t(
              'COMMON.DOCUMENT_TITIE'
            );
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    console.log(this.getUrlParams(), `8978864545645`);
    if (this.getUrlParams().lang) {
      this.setLang(this.getUrlParams().lang);
    }
    window.$agreeClick = this.$agreeClick;
    if (NODE_ENV === 'production') {
      window.addEventListener('beforeunload', e =>
        this.beforeundloadHandler(e)
      ); // 页面刷新
    } else {
      window.app = this;
    }
    this.stopF5Refresh();
    let bool = mobilePath.some(item => window.location.href.includes(item));
    if (!bool) {
      // 初始化端对端加密工具
      e2eeUtil.init();
    }
  },
  methods: {
    ...mapMutations([
      'setToken',
      'setUserInfo',
      'setUserMenus',
      'setSliderMenus',
      'setSliderMenusAct',
      'setBreadcrumb',
      'setUserMenusAct',
      'setLangOptions',
      'setLang',
      'setRouteObj'
    ]),
    // 获取url
    getUrlParams() {
      let url = window.location.href;
      console.log(url, 'urlurlurl');
      var theRequest = new Object();
      if (url.indexOf('?') != -1) {
        url = url.split('?')[1];
        url = decodeURIComponent(url.replace(/%20/g, '+'));
        var str = url.substr(0);
        var strs = str.split('&');
        strs.splice('?', 0);
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
        }
      }
      return theRequest;
    },
    // 设置语言
    setLang(lang) {
      let options = [
        { label: this.$t('COMMON.SIMPLE_FOT'), value: 'zh-CN' },
        { label: this.$t('COMMON.TRADICTON_FOT'), value: 'zh-HK' },
        { label: 'English', value: 'en' }
      ];
      this.$store.commit(
        'setLangOptions',
        options.filter(item => item.value !== lang)
      );
      this.$i18n.locale = lang;
      this.$store.commit('setLang', lang);
      document.title = this.$t('COMMON.DOCUMENT_TITIE');
      this.$nextTick(()=>{
        this.$forceUpdate();
      })
    },
    filterArr(list) {
      list = list
        .map(item => {
          if (item && item.meta.navTitle) {
            return {
              ...item,
              children:
                item.children && item.children.length > 0
                  ? this.filterArr(item.children)
                  : item.children
            };
          }
        })
        .filter(item => item != undefined);
      return list;
    },
    stopF5Refresh() {
      document.onkeydown = function (e) {
        let evt = window.event || e;
        let code = evt.keyCode || evt.which;
        if (code > 111 && code < 124) {
          if (evt.preventDefault) {
            evt.preventDefault();
          } else {
            evt.returnValue = false;
          }
        }
      };
    },
    beforeundloadHandler(e) {
      console.log('***', e);
      let isIE = false;
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        isIE = true;
      } else {
        isIE = false;
      }
      // 当用户尝试离开页面时，returnValue 设置空字符串，防止浏览器默认的离开页面提示
      console.log('isIE', isIE);
      let event = e || window.event;
      console.log('event', event);
      if (window.location.href.indexOf('/chb_logon/logon/index') > -1) {
        return;
      } else {
        this.logoutFun();
      }
      if (event) {
        if (isIE) {
          event.defaultPrevented = true;
          event.preventDefault();
        } else {
          event.defaultPrevented = true;
          event.returnValue = '';
          event.preventDefault();
        }
      }
    },
    logoutFun() {
      let flag = this.$route.query?.channelType || '';
      const res = sessionStorage.getItem('changeLang');
      if (res || flag == 'noLogin') {
        sessionStorage.removeItem('changeLang');
      } else {
        this.clearCacheInfo();
      }
    },
    clearCacheInfo() {
      this.setToken('');
      this.setUserInfo({});
      this.setUserMenus([]);
      this.setUserMenusAct('');
      this.setSliderMenus([]);
      this.setSliderMenusAct('');
      this.setBreadcrumb([]);
      sessionStorage.clear();
      localStorage.setItem('refreshAndLogout', true); //标记需要刷新页面
      localStorage.setItem('isLogoutFn', true);
    }
  },
  beforeDestroy() {
    this.logoutFun();
  },
  destroyed() {
    e2eeUtil.clearTimer();
    window.removeEventListener('beforeunload', e =>
      this.beforeundloadHandler(e)
    );
  }
};
</script>
<style lang="scss" scoped>
.wrap-app {
  &-content {
    // min-width: 1440px;
    min-width: 1000px;
  }
}
</style>
<style type="text/css" media="print,screen">
@media print {
  div {
    -webkit-print-color-adjust: exact;
    -moz-print-color-adjust: exact;
    -ms-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  @page {
    margin: 20px;
    /* size:A4 */
  }
  .bank-main-content {
    border-radius: 0 !important;
  }
  .bank-main,
  .cont,
  .wrap-trading-detail,
  .el-main {
    padding: 0 !important;
  }

  .breadCrumb,
  .btn,
  .bank-header,
  .bank-main-silder,
  .bank-footer {
    display: none !important;
  }
  .bank-main-content,.minWidthAuto {
    margin: 0 !important;
    width: 100%!important;
    max-width: 75%;
    margin-left: 0!important;
    background: #fff;
    overflow: visible!important;
  }

  /* table {
    page-break-inside: avoid;
    page-break-after: avoid;
    page-break-before: avoid;
  } */
  body {
    /* margin: 1cm !important; */
    height: auto !important;
  }
  .bank-layout-content,
  .bank-main-content .cont-wrap {
    height: auto !important;
    width: 100%!important;
    background-color: #fff!important;
  }
  /* .bank-layout{
    width: auto;
  } */
}
</style>