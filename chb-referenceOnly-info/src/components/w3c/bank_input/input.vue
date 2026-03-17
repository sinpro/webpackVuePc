<template>
  <div
    :class="[
      type === 'textarea' ? 'el-textarea' : 'el-input',
      inputSize ? 'el-input--' + inputSize : '',
      {
        'is-disabled': inputDisabled,
        'is-exceed': inputExceed,
        'el-input-group': $slots.prepend || $slots.append,
        'el-input-group--append': $slots.append,
        'el-input-group--prepend': $slots.prepend,
        'el-input--prefix': $slots.prefix || prefixIcon,
        'el-input--suffix':
          $slots.suffix || suffixIcon || clearable || showPassword
      },
      isNeedFakeText ? 'barrier_free_text_wrap' : ''
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="el-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        class="el-input__inner"
        v-bind="$attrs"
        :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :aria-readonly="readonly"
        :autocomplete="passwordViewInput"
        :aria-autocomplete="passwordViewInput"
        ref="input"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
        role="input"
      />
      <!-- 前置内容 -->
      <span class="el-input__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="el-input__icon" v-if="prefixIcon" :class="prefixIcon"> </i>
      </span>
      <!-- 后置内容 -->
      <span class="el-input__suffix" v-if="getSuffixVisible()">
        <span class="el-input__suffix-inner">
          <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
            <slot name="suffix"></slot>
            <i class="el-input__icon" v-if="suffixIcon" :class="suffixIcon">
            </i>
          </template>
          <i
            v-if="showClear"
            class="el-input__icon el-icon-circle-close el-input__clear"
            @mousedown.prevent
            @click="clear"
            @keydown.enter="clear"
          ></i>
          <i
            v-if="showPwdVisible"
            class="el-input__icon el-icon-view el-input__clear"
            @click="handlePasswordVisible"
            @keydown.enter="handlePasswordVisible"
          ></i>
          <span v-if="isWordLimitVisible" class="el-input__count">
            <span class="el-input__count-inner">
              {{ textLength }}/{{ upperLimit }}
            </span>
          </span>
        </span>
        <i
          class="el-input__icon"
          v-if="validateState"
          :class="['el-input__validateIcon', validateIcon]"
        >
        </i>
      </span>
      <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
      <!-- <span class="el-input__inner myFakerSpanInput" @click="handleFakeInput" v-if="isUseFakeInput &&!focused">{{theFakeAmtText(value)}}</span> -->
      <input
        class="el-input__inner myFakerSpanInput"
        v-model="valueFaker"
        v-bind="$attrs"
        @focus="handleFakeInput"
        @keydown.enter="handleFakeInput"
        v-show="isUseFakeInput && !focused"
      />
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      class="el-textarea__inner"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :aria-readonly="readonly"
      :autocomplete="autoComplete || autocomplete"
      :aria-autocomplete="autoComplete || autocomplete"
      role="textarea"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    >
    </textarea>
    <span
      v-if="isWordLimitVisible && type === 'textarea'"
      class="el-input__count"
      >{{ textLength }}/{{ upperLimit }}</span
    >

    <!-- 解决无障碍语音某些场景无法识别问题,fake text -->
    <div
      v-bind="$attrs"
      v-if="isNeedFakeText"
      :class="{
        'el-input__inner': type !== 'textarea',
        'el-textarea__inner': type == 'textarea'
      }"
      class="barrier_free_text"
    >
      {{ theInputFakeText }}
    </div>
  </div>
</template>
<script>
import emitter from 'element-ui/lib/mixins/emitter';
import Migrating from 'element-ui/lib/mixins/migrating';
import calcTextareaHeight from './calcTextareaHeight';
import merge from 'element-ui/lib/utils/merge';
import { isKorean } from 'element-ui/lib/utils/shared';
import mathTools from '../../../../utils/mathTools';

export default {
  name: 'ElInput',

  componentName: 'ElInput',

  mixins: [emitter, Migrating],

  inheritAttrs: false,

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },

  data() {
    return {
      textareaCalcStyle: {},
      hovering: false,
      focused: false,
      isComposing: false,
      passwordVisible: false,
      valueFaker: ''
    };
  },

  props: {
    value: [String, Number],
    size: String,
    resize: String,
    bsnType: String,
    form: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    /** @Deprecated in next major version */
    autoComplete: {
      type: String,
      validator(val) {
        NODE_ENV !== 'production' &&
          console.warn(
            "[Element Warn][Input]'auto-complete' property will be deprecated in next major version. please use 'autocomplete' instead."
          );
        return true;
      }
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    tabindex: String,
    // 是否需要假的文字,用来无障碍语音识别
    isNeedFakeText: {
      type: Boolean,
      default: false
    },
    // 语音要读的文字
    fakeText: {
      type: [String, Number],
      default: ''
    },
    // 修复缺陷24698 第二点金额问题
    isUseFakeInput: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    theInputFakeText() {
      if (!this.isNeedFakeText) return '';
      if (this.fakeText) return this.fakeText;
      return this.value || this.$attrs.placeholder || '';
    },
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    validateState() {
      return this.elFormItem ? this.elFormItem.validateState : '';
    },
    needStatusIcon() {
      return this.elForm ? this.elForm.statusIcon : false;
    },
    validateIcon() {
      return {
        validating: 'el-icon-loading',
        success: 'el-icon-circle-check',
        error: 'el-icon-circle-close'
      }[this.validateState];
    },
    textareaStyle() {
      return merge({}, this.textareaCalcStyle, { resize: this.resize });
    },
    inputSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    inputDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    nativeInputValue() {
      return this.value === null || this.value === undefined
        ? ''
        : String(this.value);
    },
    showClear() {
      return (
        this.clearable &&
        !this.inputDisabled &&
        !this.readonly &&
        this.nativeInputValue &&
        (this.focused || this.hovering)
      );
    },
    showPwdVisible() {
      return (
        this.showPassword &&
        !this.inputDisabled &&
        !this.readonly &&
        (!!this.nativeInputValue || this.focused)
      );
    },
    isWordLimitVisible() {
      return (
        this.showWordLimit &&
        this.$attrs.maxlength &&
        (this.type === 'text' || this.type === 'textarea') &&
        !this.inputDisabled &&
        !this.readonly &&
        !this.showPassword
      );
    },
    upperLimit() {
      return this.$attrs.maxlength;
    },
    textLength() {
      if (typeof this.value === 'number') {
        return String(this.value).length;
      }

      return (this.value || '').length;
    },
    inputExceed() {
      // show exceed style if length of initial value greater then maxlength
      return this.isWordLimitVisible && this.textLength > this.upperLimit;
    },
    passwordViewInput() {
        if (this.showPassword && !this.passwordVisible || this.type == 'password') {
            return 'new-password'
        } 
        
        return this.autoComplete || this.autocomplete
        
    }
  },

  watch: {
    value(val) {
      this.$nextTick(this.resizeTextarea);
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [val]);
      }
      this.valueFaker = this.theFakeAmtText(val);
    },
    // native input value is set explicitly
    // do not use v-model / :value in template
    // see: https://github.com/ElemeFE/element/issues/14521
    nativeInputValue() {
      this.setNativeInputValue();
    },
    // when change between <input> and <textarea>,
    // update DOM dependent value and styles
    // https://github.com/ElemeFE/element/issues/14857
    type() {
      this.$nextTick(() => {
        this.setNativeInputValue();
        this.resizeTextarea();
        this.updateIconOffset();
      });
    }
  },

  methods: {
    theFakeAmtText(val) {
      if (!val) return val || '';
      return mathTools.formatMoneyNew(val); //起始可以把这个作为参数传进来，这样普适度就更高了
    },
    handleFakeInput() {
      this.$refs.input.focus();
      this.focused = true;
    },
    focus() {
      this.getInput().focus();
    },
    blur() {
      this.getInput().blur();
    },
    getMigratingConfig() {
      return {
        props: {
          icon: 'icon is removed, use suffix-icon / prefix-icon instead.',
          'on-icon-click': 'on-icon-click is removed.'
        },
        events: {
          click: 'click is removed.'
        }
      };
    },
    handleBlur(event) {
      this.focused = false;
      this.$emit('blur', event);
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [this.value]);
      }
    },
    select() {
      this.getInput().select();
    },
    resizeTextarea() {
      if (this.$isServer) return;
      const { autosize, type } = this;
      if (type !== 'textarea') return;
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
        };
        return;
      }
      const minRows = autosize.minRows;
      const maxRows = autosize.maxRows;

      this.textareaCalcStyle = calcTextareaHeight(
        this.$refs.textarea,
        minRows,
        maxRows
      );
    },
    setNativeInputValue() {
      const input = this.getInput();
      if (!input) return;
      if (input.value === this.nativeInputValue) return;
      input.value = this.nativeInputValue;
    },
    handleFocus(event) {
      this.focused = true;
      this.$emit('focus', event);
    },
    handleCompositionStart() {
      this.isComposing = true;
    },
    handleCompositionUpdate(event) {
      const text = event.target.value;
      const lastCharacter = text[text.length - 1] || '';
      this.isComposing = !isKorean(lastCharacter);
    },
    handleCompositionEnd(event) {
      if (this.isComposing) {
        this.isComposing = false;
        this.handleInput(event);
      }
    },
    handleInput(event) {
      // should not emit input during composition
      // see: https://github.com/ElemeFE/element/issues/10516
      if (this.isComposing) return;

      // hack for https://github.com/ElemeFE/element/issues/8548
      // should remove the following line when we don't support IE
      //  交易限额设定IE浏览器使用oninput会立即执行，导致页面小数点和逗号被删除缺陷
      // 判断是否是IE
      const userAgent = navigator.userAgent;
      const rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
      const ua = userAgent.toLowerCase();
      var match = rMsie.exec(ua);
      let browser = '';
      if (match !== null) {
        browser = 'IE';
      }
      if (this.bsnType === 'limit' && browser === 'IE') {
        const newVal = String(this.nativeInputValue).replace(/[^0-9]/g, '');
        if (event.target.value === newVal) {
          event.target.value = this.nativeInputValue;
          return;
        }
      } else {
        if (event.target.value === this.nativeInputValue) return;
      }
      if(this.type !== 'textarea'){
        // 文本输入框不可输入不可见字符：字节顺序标记\uFEF、不换行空格\u00A0、零宽空格 \u200B、零宽不连字\u200C、零宽连字\u200D、从左到右标记\u200E、右到左标记\u200F
        event.target.value = event.target.value.replace(/[\uFEFF\u00A0\u200B\u200C\u200D\u200E\u200F\u3000]+/g, "");
        // console.log("11111111111111","1222223\u200B000");
      }
      this.$emit('input', event.target.value);

      // ensure native input value is controlled
      // see: https://github.com/ElemeFE/element/issues/12850
      this.$nextTick(this.setNativeInputValue);
    },
    handleChange(event) {
      this.$emit('change', event.target.value);
    },
    calcIconOffset(place) {
      let elList = [].slice.call(
        this.$el.querySelectorAll(`.el-input__${place}`) || []
      );
      if (!elList.length) return;
      let el = null;
      for (let i = 0; i < elList.length; i++) {
        if (elList[i].parentNode === this.$el) {
          el = elList[i];
          break;
        }
      }
      if (!el) return;
      const pendantMap = {
        suffix: 'append',
        prefix: 'prepend'
      };

      const pendant = pendantMap[place];
      if (this.$slots[pendant]) {
        el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${
          this.$el.querySelector(`.el-input-group__${pendant}`).offsetWidth
        }px)`;
      } else {
        el.removeAttribute('style');
      }
    },
    updateIconOffset() {
      this.calcIconOffset('prefix');
      this.calcIconOffset('suffix');
    },
    clear() {
      this.$emit('input', '');
      this.$emit('change', '');
      this.$emit('clear');
    },
    handlePasswordVisible() {
      this.passwordVisible = !this.passwordVisible;
      this.focus();
    },
    getInput() {
      return this.$refs.input || this.$refs.textarea;
    },
    getSuffixVisible() {
      return (
        this.$slots.suffix ||
        this.suffixIcon ||
        this.showClear ||
        this.showPassword ||
        this.isWordLimitVisible ||
        (this.validateState && this.needStatusIcon)
      );
    }
  },

  created() {
    this.$on('inputSelect', this.select);
    this.valueFaker = this.theFakeAmtText(this.value);
  },

  mounted() {
    this.setNativeInputValue();
    this.resizeTextarea();
    this.updateIconOffset();
    // console.log(this.$attrs,'$attrs')
  },

  updated() {
    this.$nextTick(this.updateIconOffset);
  }
};
</script>
<style lang="scss" scoped>
.barrier_free_text_wrap {
  position: relative;
  .barrier_free_text {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    font-size: 1px !important;
    opacity: 0 !important;
  }
}
.myFakerSpanInput {
  position: absolute;
  top: 0;
  left: 0;
  // outline: 1px solid #DCDFE6 ;
  margin-top: 2px;
}
</style>
