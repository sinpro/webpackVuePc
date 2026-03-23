import  ajax  from "utils/request";

export default {
    /**
     * @author
     * @describe
     * @date
     */
    generateEncryptionKey: data => {
        return ajax ({
            url: "generateEncryptionKey.do",
            method: "post",
            data: {
                body: data
            },
            devPreUrl: "/api",
            prodPreUrl: ""
        })
    },
    /**
     * @author
     * @describe
     * @date
     */
    updateE2eeKey: data => {
        return ajax ({
            url: "updateE2eeKey.do",
            method: "post",
            data: {
                body: data
            },
            devPreUrl: "/api",
            prodPreUrl: ""
        })
    }
}