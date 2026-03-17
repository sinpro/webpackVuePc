<template>
  <a
    :class="[
      'el-link',
      type ? `el-link--${type}` : '',
      disabled && 'is-disabled',
      underline && !disabled && 'is-underline'
    ]"
    :href="disabled ? null : href"
    v-bind="$attrs"
    @click="handleClick"
    @keydown.enter="handleClick"
    tabindex="0"
  >
    <i :class="icon" v-if="icon"></i>

    <span v-if="$slots.default" class="el-link--inner" tabindex="0">
      <slot></slot>
    </span>

    <template v-if="$slots.icon"
      ><slot v-if="$slots.icon" name="icon"></slot
    ></template>
  </a>
</template>

<script>
export default {
  name: 'ElLink',

  props: {
    type: {
      type: String,
      default: 'default'
    },
    underline: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    href: {
      type: String,
      default: ''
    },
    icon: String
  },

  methods: {
    handleClick(event) {
      if (!this.disabled) {
        if (!this.href) {
          event.preventDefault();
          this.$emit('click', event);
        }
      }
    }
  }
};
</script>
