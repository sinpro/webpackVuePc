<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-show="visible"
      class="el-dialog__wrapper"
      @click.self="handleWrapperClick"
      ref="dialogWrapper"
    >
      <div
        role="dialog"
        :key="key"
        aria-modal="true"
        :aria-label="myAriaLabel"
        tabindex="0"
        :class="[
          'el-dialog',
          { 'is-fullscreen': fullscreen, 'el-dialog--center': center },
          customClass
        ]"
        ref="dialog"
        :style="style"
      >
        <!-- 自动聚焦到弹窗中 -->
        <!-- <input
          v-if="visible"
          id="bank-dialog-first-node"
          type="text"
          style="width: 0; height: 0; opacity: 0"
          tabindex="-1"
        /> -->

        <div class="el-dialog__header">
          <slot name="title">
            <span class="el-dialog__title" :tabindex="title ? '0' : '-1'">{{
              title
            }}</span>
          </slot>
          <button
            type="button"
            :title="btnTitle"
            class="el-dialog__headerbtn"
            :aria-label="i18n.t('common.Close')"
            v-if="showClose"
            :tabindex="showClose ? '0' : '-1'"
            @click="handleClose"
          >
            <i class="el-dialog__close el-icon el-icon-close"></i>
            <!--方法1: 解决测试提的bug,elementui 弹框被识别为 close问题,目前el-dialog被覆盖,可以不用这里 -->
            <i class="the_visible_icon_for_read">{{
              i18n.t('common.Close')
            }}</i>
          </button>
        </div>
        <div class="el-dialog__body" v-if="rendered">
          <slot></slot>
        </div>
        <div class="el-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from 'element-ui/lib/utils/popup';
import Migrating from 'element-ui/lib/mixins/migrating';
import emitter from 'element-ui/lib/mixins/emitter';
import i18n from 'src/i18n';

export default {
  name: 'ElDialog',

  mixins: [Popup, emitter, Migrating],

  props: {
    focusId: {
      type: String,
      default: ''
    },
    btnTitle: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },

    modal: {
      type: Boolean,
      default: true
    },

    modalAppendToBody: {
      type: Boolean,
      default: true
    },

    appendToBody: {
      type: Boolean,
      default: false
    },

    lockScroll: {
      type: Boolean,
      default: true
    },

    closeOnClickModal: {
      type: Boolean,
      default: true
    },

    closeOnPressEscape: {
      type: Boolean,
      default: true
    },

    showClose: {
      type: Boolean,
      default: true
    },

    width: String,

    fullscreen: Boolean,

    customClass: {
      type: String,
      default: ''
    },

    top: {
      type: String,
      default: '15vh'
    },
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false
    },

    destroyOnClose: Boolean,

    visible: {
      type: Boolean,
      default: false
    },
    dialogLabel: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      closed: false,
      key: 0,
      i18n
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.closed = false;
        this.$emit('open');
        this.$el.addEventListener('scroll', this.updatePopper);
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0;
        });
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
        // 自动聚焦到弹窗上,如果页面dialog嵌套iframe，那么聚焦会有问题，可以参考bank-iframe的处理方法，或者看我代码提交记录的其他对方，有写处理方法
        setTimeout(() => {
          // 之前旧逻辑，但是会被识别出编辑框 空白，测试会提缺陷，好烦
          // const el = document.getElementById('bank-dialog-first-node');
          // el && el.focus();

          // 这种有缺陷，会把后续内容识别出来,但是也可以修复上面问题，个人其实更推荐这个
          let hasTabindexList =
            this.$refs.dialogWrapper.querySelectorAll('[tabindex]');
          if (hasTabindexList && hasTabindexList.length > 0) {
            const el = hasTabindexList[0];
            el && el.focus();
            return false;
          }

          // 这种不会识别出编辑框，空白，修复上面问题
          //   let tempInput = document.createElement('input');
          //   tempInput.setAttribute('id','bank-dialog-first-node');
          //   tempInput.setAttribute('tabindex','-1');
          //   tempInput.style.width = '0';
          //   tempInput.style.height = '0';
          //   tempInput.style.opacity = '0';
          //   tempInput.style.fontSize = '0px';
          //   tempInput &&tempInput.focus();
          //   this.$refs.dialogWrapper.insertBefore(tempInput,this.$refs.dialog)
        }, 500);
      } else {
        this.$el.removeEventListener('scroll', this.updatePopper);
        if (!this.closed) this.$emit('close');
        if (this.destroyOnClose) {
          this.$nextTick(() => {
            this.key++;
          });
        }

        // try {
        //   const el = document.getElementById('bank-dialog-first-node')
        //   el&&this.$refs.dialogWrapper.removeChild(el)
        // } catch (error) {
        //   console.log('真的是',error)
        // }
      }
    }
  },
  created() {},

  computed: {
    style() {
      let style = {};
      if (!this.fullscreen) {
        style.marginTop = this.top;
        if (this.width) {
          style.width = this.width;
        }
      }
      return style;
    },
    myAriaLabel() {
      return this.title || this.dialogLabel || i18n.t('common.Dialog');
    }
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          size: 'size is removed.'
        }
      };
    },
    handleWrapperClick() {
      if (!this.closeOnClickModal) return;
      this.handleClose();
    },
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false);
        this.$emit('close');
        this.closed = true;
      }
    },
    updatePopper() {
      this.broadcast('ElSelectDropdown', 'updatePopper');
      this.broadcast('ElDropdownMenu', 'updatePopper');
    },
    afterEnter() {
      this.$emit('opened');
    },
    afterLeave() {
      this.$emit('closed');
      if (this.focusId) {
        console.log(
          '11',
          this.focusId,
          document.getElementById(`${this.focusId}`)
        );
        document.getElementById(`${this.focusId}`).focus();
      }
    }
  },

  mounted() {
    if (this.visible) {
      this.rendered = true;
      this.open();
      if (this.appendToBody) {
        document.body.appendChild(this.$el);
      }
      // 自动聚焦到弹窗上
      setTimeout(() => {
        const el = document.getElementById('bank-dialog-first-node');
        el && el.focus();
      }, 500);
    }
  },

  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>

<style scoped>
.the_visible_icon_for_read {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  font-size: 1px;
}
</style>
