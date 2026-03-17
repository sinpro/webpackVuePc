export default {
    props: {
        // 是否禁用上下键选中
        disabledArrowUpDownSelect: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            hoverOption: -1
        };
    },

    computed: {
        optionsAllDisabled() {
            return this.options.filter(option => option.visible).every(option => option.disabled);
        }
    },

    watch: {
        hoverIndex(val) {
            if (typeof val === 'number' && val > -1) {
                this.hoverOption = this.options[val] || {};
            }
            this.options.forEach(option => {
                option.hover = this.hoverOption === option;
            });
        }
    },

    methods: {
        navigateOptions(direction) {
            console.log(direction, 'direeeeeeeeecction')
            if (!this.visible) {
                this.visible = true;
                return;
            }
            if (this.options.length === 0 || this.filteredOptionsCount === 0) return;
            if (!this.optionsAllDisabled) {
                if (direction === 'next') {
                    this.hoverIndex++;
                    if (this.hoverIndex === this.options.length) {
                        this.hoverIndex = 0;
                    }
                    if (this.disabledArrowUpDownSelect) return false;
                    this.$emit('input', this.options[this.hoverIndex].value);
                    this.emitChange(this.options[this.hoverIndex].value);
                    // this.nextAndPrev()
                } else if (direction === 'prev') {
                    this.hoverIndex--;
                    if (this.hoverIndex < 0) {
                        this.hoverIndex = this.options.length - 1;
                    }
                    if (this.disabledArrowUpDownSelect) return false;
                    this.$emit('input', this.options[this.hoverIndex].value);
                    this.emitChange(this.options[this.hoverIndex].value);
                    // this.nextAndPrev()
                }
                const option = this.options[this.hoverIndex];
                if (option.disabled === true ||
                    option.groupDisabled === true ||
                    !option.visible) {
                    this.navigateOptions(direction);
                }
                this.$nextTick(() => this.scrollToOption(this.hoverOption));
            }
        },
        // nextAndPrev(){
        //   if (this.options[this.hoverIndex]) {
        //     if (this.multiple) {
        //       const value = (this.value || []).slice();
        //       const optionIndex = this.getValueIndex(value, this.options[this.hoverIndex].value);
        //       if (optionIndex > -1) {
        //         value.splice(optionIndex, 1);
        //       } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
        //         value.push(this.options[this.hoverIndex].value);
        //       }
        //       this.$emit('input', value);
        //       this.emitChange(value);
        //       if (this.options[this.hoverIndex].created) {
        //         this.query = '';
        //         this.handleQueryChange('');
        //         this.inputLength = 20;
        //       }
        //       if (this.filterable) this.$refs.input.focus();
        //     } else {
        //       this.$emit('input', this.options[this.hoverIndex].value);
        //       this.emitChange(this.options[this.hoverIndex].value);
        //       // this.visible = false;
        //     }
        //     this.setSoftFocus();
        //     if (this.visible) return;
        //     this.$nextTick(() => {
        //       this.scrollToOption(this.options[this.hoverIndex]);
        //     });
        //   }
        // }
    }
};