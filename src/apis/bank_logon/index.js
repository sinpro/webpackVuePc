import  ajax  from "untils/request";

export default {
    /**
     * @author
     * @describe
     * @date
     */
    generateImgCode: data => {
        return ajax ({
            url: "",
            method: "post",
            data: {
                body: data
            },
            devPreUrl: "/api",
            prodPreUrl: ""
        })
    }
}