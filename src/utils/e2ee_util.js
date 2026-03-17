import api from 'src/apis/common';
const forge = require('node-forge');
localStorage.setItem('e2ee.retry_count', 0);
import store from '../store';
const defaultExcludeUrls = ['/generateEncryptionKey.do'];
const e2ee = {
    key: '',
    exchangeId: '',
    excludeUrls: [...defaultExcludeUrls],
    enable: true,
    ready: false,
    retry: 0,
    timer: null,
    expire: ''
};
const clearTimer = () => {
    clearInterval(e2ee.timer)
}

const init = async function () {
    e2ee.ready = false;
    e2ee.retry = 0;
    const rng = new SecureRandom();
    const c = secp256r1();
    const clientKey = pick_rand(rng, c).toString();

    const curve = get_curve(c);
    const G = get_G(c, curve);
    const a = new BigInteger(clientKey);
    let P = G.multiply(a);
    let clientX = P.getX().toBigInteger().toString();
    let clientY = P.getY().toBigInteger().toString();
    const res = await api.generateEncryptionKey({ clientX, clientY });
    if (!res) {
        e2ee.ready = true;
        return;
    }

    const { serverX = '', serverY = '', generateSessionKey = '', excludeUrls = '', enable = '', expire = '' } = res.body || {};
    e2ee.exchangeId = generateSessionKey || '';
    e2ee.excludeUrls = [...excludeUrls];
    e2ee.enable = enable || '';


    P = new ECPointFp(curve, curve.fromBigInteger(new BigInteger(serverX)), curve.fromBigInteger(new BigInteger(serverY)));
    const S = P.multiply(a);
    clientX = S.getX().toBigInteger().toString();
    clientY = S.getY().toBigInteger().toString();

    let xBytes = new Uint8Array(S.getX().toBigInteger().toByteArray());
    if (xBytes.length == 32) {
        e2ee.ready = true;
        e2ee.key = '';
        e2ee.expire = expire;
        for (let i = 0; i < xBytes.length; i += 1) {
            e2ee.key += String.fromCharCode(xBytes[i]);
        }
        e2ee.timer = setInterval(async () => {
            if (!await api.updateE2eeKey()) {
                clearInterval(e2ee.timer)
                init()
            }
        }, 10 * 60 * 1000)
    } else if (++e2ee.retry < 15) {
        localStorage.setItem('e2ee.retry_count', e2ee.retry);
        console.log(`reload e2ee: retry count ${e2ee.retry}`);
        return await this.init()
    } else {
        console.log('reload e2ee: retry count more then 15')
    }
};

const encrypt = function (bytes) {
    const iv = forge.random.getBytesSync(12);
    const cipher = forge.cipher.createCipher('AES-GCM', e2ee.key);
    cipher.start({
        iv: iv, // should be a 12-byte binary-encoded string or byte buffer
        //additionalData: 'binary-encoded string', // optional
        tagLength: 128 // optional, defaults to 128 bits
    });
    cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(bytes)));
    cipher.finish();
    const encrypted = cipher.output;
    const tag = cipher.mode.tag;
    return forge.util.encode64(iv + encrypted.data + tag.data);
};

const decrypt = function (bytes) {
    // console.log(bytes,'bytesbytes')
    bytes = atob(bytes);
    const iv = bytes.slice(0, 12);
    const tag = bytes.slice(-16);
    const data = bytes.slice(12, bytes.length - 16);
    const decipher = forge.cipher.createDecipher('AES-GCM', e2ee.key);
    decipher.start({
        iv: iv, //additionalData: 'binary-encoded string', // optional
        tagLength: 128, // optional, defaults to 128 bits
        tag: tag // authentication tag from encryption
    });
    decipher.update(forge.util.createBuffer(data));
    const pass = decipher.finish();
    // pass is false if there was a failure (eg: authentication tag didn't match)
    if (pass) {
        // outputs decrypted hex
        return decipher.output.toString();
    }
};

const ready = function () {
    return e2ee.ready;
};
const enable = function () {
    return e2ee.enable && !!e2ee.key
};

const isWhiteList = function (url) {
    return e2ee.excludeUrls.includes(url);
};

const exchangeId = function () {
    return e2ee.exchangeId
};
const expire = function () {
    return e2ee.expire
};


export default {
    init,
    encrypt,
    decrypt,
    ready,
    enable,
    exchangeId,
    isWhiteList,
    clearTimer,
    expire
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 私有方法区
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function pick_rand(rng, c) {
    const n = new BigInteger(c.getN().toString());
    const n1 = n.subtract(BigInteger.ONE);
    const r = new BigInteger(n.bitLength(), rng);
    return r.mod(n1).add(BigInteger.ONE);
}

function get_curve(c) {
    return new ECCurveFp(
        new BigInteger(c.getCurve().getQ().toString()),
        new BigInteger(c.getCurve().getA().toBigInteger().toString()),
        new BigInteger(c.getCurve().getB().toBigInteger().toString())
    );
}

function get_G(c, curve) {
    return new ECPointFp(
        curve,
        curve.fromBigInteger(new BigInteger(c.getG().getX().toBigInteger().toString())),
        curve.fromBigInteger(new BigInteger(c.getG().getY().toBigInteger().toString()))
    );
}