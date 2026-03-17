import bankRadio from './components/bank_radio/bank_radio';
import bankRadioGroup from './components/bank_radio/bank_radio_group';
import bankCheckbox from './components/bank_checkbox/bank_checkbox';
import bankCheckboxGroup from './components/bank_checkbox/bank_checkbox_group';
import bankScrollbar from './components/scrollbar/main';
import bankSelect from './components/bank_select/bank_select';
import bankOption from './components/bank_select/bank_option';
import bankDatePicker from './components/bank_date-picker/picker/date_picker';
import bankForm from './components/bank_form/bank_form';
import bankFormItem from './components/bank_form/bank_form_item';
import bankCarousel from './components/bank_carousel/main';
import bankCarouselItem from './components/bank_carousel/item';
import bankPagination from './components/bank_pagination/pagination';
import bankLink from './components/bank_link/main';
import bankInput from './components/bank_input/input';
import bankSwitch from './components/bank_switch/index';
import bankDialog from './components/bank_dialog/component';

import MessageBox from './components/message-box/index.js';
import Dialog from "./components/dialog/index.js";
import bankInputNumber from './components/bank_input-number';

export default (Vue) => {
    Vue.component('bank_radio', bankRadio)
    Vue.component('bank_radio-group', bankRadioGroup)
    Vue.component('bank_checkbox', bankCheckbox)
    Vue.component('bank_checkbox-group', bankCheckboxGroup)
    Vue.component('bank_scrollbar', bankScrollbar)
    Vue.component('bank_select', bankSelect)
    Vue.component('bank_option', bankOption)
    Vue.component('bank_date-picker', bankDatePicker)
    Vue.component('bank_form', bankForm)
    Vue.component('bank_form-item', bankFormItem)
    Vue.component('bank_carousel', bankCarousel)
    Vue.component('bank_carousel-item', bankCarouselItem)
    Vue.component('bank_pagination', bankPagination)
    Vue.component('bank_link', bankLink)
    Vue.component('bank_input', bankInput)
    Vue.component('bank_switch', bankSwitch)

    // 覆盖EL-dialog,解决el-dialog右上角close识别为close问题,如果后续项目全部替换el-dialog为bank_dialog,就可以去掉这个覆盖,
    // 覆盖EL-dialog,解决el-dialog右上角close识别为close问题,如果后续项目全部替换el-dialog为bank_dialog,就可以去掉这个覆盖,
    // 覆盖EL-dialog,解决el-dialog右上角close识别为close问题,如果后续项目全部替换el-dialog为bank_dialog,就可以去掉这个覆盖,
    Vue.component(Dialog.name, Dialog);

    Vue.component('bank_dialog', bankDialog)

    // 改写elementUI样式框 方法1: 解决测试提的bug,elementui 弹框被识别为 close问题 
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$prompt = MessageBox.prompt;

    Vue.component('bank_input_number', bankInputNumber)
}
