import api from '../apis/chb_logon';
import apis from '../apis/chb_commonPage';


/**
 * 播放图形验证码
 * @param {*} imgCodeToken 图片toekn 
 * @param {*} 
 */
export function audioCaptcha(imgCodeToken = '') {
    // post请求
    api.audioCaptcha({
        imgCodeToken,
    }).then(res => {
        const { head = {}, body = {} } = res;
        if (head.returnCode == '000000') {
            const { audioCaptchaBase64 = '', audioCaptchaName = '' } = body;
            var snd = new Audio("data:audio/wav;base64," + audioCaptchaBase64);
            snd.play()
        }

    });
}


/**
 * 防重复获取token
 * @param {*} imgCodeToken 图片toekn 
 * @param {*} 
 */
export function getCommonToken(bizType = '') {
    // post请求
    apis.getCommonToken({
        bizType,
    }).then(res => {
        const { body = {}, head = {} } = res
        if (head.returnCode === '000000') {
            const { tranToken = '' } = body;
            store.commit('setTranToken', tranToken);
        }
    });
}


/**
 * 微通密碼控件
 * @param {*} type 類型 
 *  1- /common/getHsmPublicKey encryptAlphaPINAndGenerateMAC   
 *  2- /common/getHsmPublicKeyForCardPin encryptAlphaPINAndGenerateMAC  
 *  3- /common/getHsmPublicKey encryptChangeAlphaPINAndGenerateMAC
 * @param {*} pin  舊密碼
 * @param {*} newPin 新密碼
 * @param {*} modPw 是否修改密碼 true/false
 * @param {*} 
 */

export async function wtPassWord(type='',pin='',newPin='',modPw=false) {
    let pinModulus = '',
        pinExponent = "010001",
        triDesKeyLen = 2,
        iv = null,
        timestamp = '',
        webPin = '';
    console.log(wtLicen,'--------wtLicen-----v-wtLicen')
    const wtRc=type!='3'?wtLicen.genRC():'';
    console.log(wtRc,'-------wtRc')
    try {
        const res = type=='2'?await apis.getHsmPublicKeyForCardPin():await apis.getHsmPublicKey();
        if (res.head?.returnCode === '000000') {
            pinModulus = res.body.hsmPublicKey;
            timestamp = res.body.currentServerTime.replace(/[-:： ]/g, '');
        }
        if(type=='1'||type=='2'){
            webPin = await wt1000.wt1003(
                pinModulus,
                pinExponent,
                triDesKeyLen,
                iv,
                pin,
                timestamp
            );
        }else if(type=='3'){
            console.log(pin,'pin-pinpinpinpin-pin')
            const getCryptPin=modPw?pin:await wtLicen.sDecryptPM(pin).str
            console.log(getCryptPin,'getCryptPin--getCryptPin')
            webPin = await wt1000.wt1004(
                pinModulus,
                pinExponent,
                triDesKeyLen,
                iv,
                getCryptPin,
                newPin,
                timestamp
            );
        }
        console.log(webPin,'---webPin----')
        return {enc:webPin,randomNum:wtRc};
    } catch (err) {
        console.log('密碼加密報錯', err);
    }
}