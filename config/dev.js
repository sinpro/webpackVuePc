const host = {
    api: ' ',
    demo: ' ',
    dev: 'http://10.98.17.60:10051',
    sit: 'https://10.98.33.100:10004',
    uat: 'https://10.98.33.100:10004',
    pre: 'http://10.252.242.94:10004',
};
module.exports = {
    port: 8823,
    proxy: {
        // '(/basic/**)|(/permission/**)|(/trade/**)':{
        // 	target:host.uat,
        // 	changeOrigin:true,
        // 	pathRewrite:{
        // 		'^/basic':''
        // 	}
        // },
        '/api': {
            target: host[process.env.NODE_MODE],
            secure: false,
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        }
    },
    overLay: false,
    autoOpenBrowser: false
};