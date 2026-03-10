/**
 * 创建公共返回API
 * @param { Any } data
 * @param {string} code
 * @param {string} message
 */
exports.createReturnData = (data, code, message) => {
    if (!data) {
        throw new Error('return data is need');
    }
    return {
        head: {
            iCIFID: "00000",
            errorCode: code || '000000',
            errorMsg: message || '请求成功',
            returnCode: code || '000000',
            returnMessage: message || '请求成功',
        },
        body: { ...data },
    };
};