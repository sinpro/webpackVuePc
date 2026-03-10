const Mock = require('mockjs');
const { createReturnData } = require('../untils');
export default [
    /*--
     * @author:doujiandong/zhouyu
     * @date:2023/06/15
     * @describe:检查登录是否需要图形验证码
     * @modified:
     */
    {
        url: '/login/checkNeedImgCode',
        type: 'post',
        response: function (config) {
            return createReturnData(
                Mock.mock({
                    'needImgCode|1': ['0', '1']
                })
            );
        }
    },
    /*--
     * @author:doujiandong/zhouyu
     * @date:2023/06/15
     * @describe:统一登录
     * @modified:
     */
    {
        url: '/common/getHsmPublicKey',
        type: 'post',
        response: function (config) {
            return createReturnData(
                Mock.mock({
                    "hsmPublicKey": "BA1BB7A187418316BFFCBE947A228935A36A9071CD0506FBAE8163A012D8C749C7E367223D52430E2C61208104025AA7C3B12E4D68CA2FBC4DE83E06FCC583AEAB31478710DE302D5D866249D585B81AB620D8C10E0294234DF260CA1A21AD842A45659E04F5B6FF5AC71B4250C8432878D2640C00A7561348F60B996F7AF7191CEDFB588B6322E5F46E2011E39A53432682BC8ABA32A15635A64060EDB76315DA7E0BB37E48B8CDB0736A4499A0AF7CB50EC35605225B124B10A6AD7CF0217AFF3053087C3B4A9E6D875A04AA33AB888D55553613C8017538096F5077FF0B9209FFE4D78477F86A1691E506FFE588E831990B6AED91EFAE98AD362D3E7423CD",
                    "currentServerTime": "2024-03-13 11:24:47"
                })
            );
        }
    },
    /*--
     * @author:doujiandong/zhouyu
     * @date:2023/06/15
     * @describe:退出
     * @modified:
     */
    {
        url: '/login/logout',
        type: 'post',
        response: function (config) {
            return createReturnData(Mock.mock({}));
        }
    },
]
