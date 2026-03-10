var envConfig = {
    /* =============================== 本地开发环境配置 ============================== */
    dev: {
        apiPrefixPath: '/nibs/dev/api', // dev
        apiProdfixPath: 'api',
        apiProdfixBetaPath: 'api-beta',
        assetsUrl: './',
        loan_calculator: 'https://uat.chbank.com/',
        e2eeLicense:'VVBiNk9jUEpncTVJQjd3MytUc2hzbnJFOTdNNmpMM29RSHNsUE11NTk0eUowd2tYdTB6V3lVdDFJeFpuU2NwTkJYTTlYTUJGWCs0V3VjOUViL0pHelRhd0NHVGp6K0cyNlZ5VkNvQWVQQk5nVWVDdXkvZVlwcWZMOWhrUHA3WEIwZERUdTdHYmwzbE12Wk4zSDNDM3hGQ2hSSWJncGRuK0l6WmRCTVhqSHhzPXsiaWQiOjAsInR5cGUiOiJ0ZXN0IiwicGxhdGZvcm0iOjEwLCJub3RiZWZvcmUiOiIyMDI1MTEyNCIsIm5vdGFmdGVyIjoiMjAyNjA1MjQifQ==',
        staticImageUrlPrePath: 'https://220.241.39.45/nibs/flame/staticzip/nibs/', // 内管上传的静态图片路径
        deepLinkAppHost: 'https://h5.shinedin.com/chbActivityToApp/index.html',
    },
    /* =============================== sit环境配置 ================================ */
    sit: {
        apiPrefixPath: '/nibs/new/api', // sit
        apiProdfixPath: 'api',
        apiProdfixBetaPath: 'api-beta',
        assetsUrl: 'https://10.98.33.100:10004/nibs/new/webbank/',
        loan_calculator: 'https://uat.chbank.com/',
        e2eeLicense:'VVBiNk9jUEpncTVJQjd3MytUc2hzbnJFOTdNNmpMM29RSHNsUE11NTk0eUowd2tYdTB6V3lVdDFJeFpuU2NwTkJYTTlYTUJGWCs0V3VjOUViL0pHelRhd0NHVGp6K0cyNlZ5VkNvQWVQQk5nVWVDdXkvZVlwcWZMOWhrUHA3WEIwZERUdTdHYmwzbE12Wk4zSDNDM3hGQ2hSSWJncGRuK0l6WmRCTVhqSHhzPXsiaWQiOjAsInR5cGUiOiJ0ZXN0IiwicGxhdGZvcm0iOjEwLCJub3RiZWZvcmUiOiIyMDI1MTEyNCIsIm5vdGFmdGVyIjoiMjAyNjA1MjQifQ==',
        staticImageUrlPrePath: 'https://220.241.39.45/nibs/flame/staticzip/nibs/',
        deepLinkAppHost: 'https://h5.shinedin.com/chbActivityToApp/index.html',
    },
    /* =============================== uat环境配置 ================================ */
    uat: {
        apiPrefixPath: '/nibs/uat/api', // uat
        apiProdfixPath: 'api',
        apiProdfixBetaPath: 'api-beta',
        assetsUrl: 'https://10.98.33.100:10004/nibs/uat/webbank/',
        loan_calculator: 'https://uat.chbank.com/',
        e2eeLicense:'VVBiNk9jUEpncTVJQjd3MytUc2hzbnJFOTdNNmpMM29RSHNsUE11NTk0eUowd2tYdTB6V3lVdDFJeFpuU2NwTkJYTTlYTUJGWCs0V3VjOUViL0pHelRhd0NHVGp6K0cyNlZ5VkNvQWVQQk5nVWVDdXkvZVlwcWZMOWhrUHA3WEIwZERUdTdHYmwzbE12Wk4zSDNDM3hGQ2hSSWJncGRuK0l6WmRCTVhqSHhzPXsiaWQiOjAsInR5cGUiOiJ0ZXN0IiwicGxhdGZvcm0iOjEwLCJub3RiZWZvcmUiOiIyMDI1MTEyNCIsIm5vdGFmdGVyIjoiMjAyNjA1MjQifQ==',
        staticImageUrlPrePath: 'https://220.241.39.45/nibs/flame/staticzip/nibs/',
        deepLinkAppHost: 'https://h5.shinedin.com/chbActivityToApp/index.html',
    },
    /* =============================== pre环境配置 ================================ */
    pre: {
        apiPrefixPath: '', // pre
        apiProdfixPath: 'api',
        apiProdfixBetaPath: 'api-beta',
        assetsUrl: 'https://10.98.33.100:10004/nibs/uat/webbank/',
        loan_calculator: 'https://uat.chbank.com/',
        staticImageUrlPrePath: 'https://220.241.39.47/nibs/flame/staticzip/nibs/',
        e2eeLicense:'elNMQWk2TWZMVnZnNVIxcmRIVzBOeiszNDE4cEpMb1BoWTdIaWo1TWtvai9nV3B5MWFSWW1WeDFBc3M1K04wM3ZCVDROaGw5cG14SFFvT29OS1lEU0x4SkFHZHQrTHF4MTBiR1hKNTg0Uk9JTnFMZk9TZSsxaU9DaTA3TmJXK25sZkFjd2ZmNjRNVzNHbUY1MFU2QWpFSHFVYmQ2Y2dZVzZvMVZTVTcyeDBVPXsiaWQiOjAsInR5cGUiOiJ0ZXN0IiwicGxhdGZvcm0iOjEwLCJub3RiZWZvcmUiOiIyMDI1MDUyMiIsIm5vdGFmdGVyIjoiMjAyNTExMjIifQ==',
        deepLinkAppHost: 'https://h5.shinedin.com/chbActivityToApp/index.html',
    },
    /* =============================== prod环境配置 ================================ */
    prod: {
        apiPrefixPath: '',
        apiProdfixPath: 'api',
        apiProdfixBetaPath: 'api-beta',
        assetsUrl: 'https://10.98.33.100:10004/nibs/uat/webbank/',
        loan_calculator: 'https://www.chbank.com/',
        staticImageUrlPrePath: 'https://www.ibanking.chbank.com/nibs/flame/staticzip/nibs/',
        e2eeLicense:'aDBOcGJValhQZVBRaWhQZnE1NmhoN1FxY1FWUzY0QTdYamx0WkQrRFlnUnZ5TkNQOGIxa0RFem1OSHg0VEFXbVp6aG9WZnpyNkxBSG16VTRhRU56SEd4SzVHa2tNQTNsMWNyMndCYzFKRWNSSlJjNEc3eWgrSStJaE5ORHRoQlM2TzJVdXZEOXBRZVVpNFhWSFVUQ3ZoQTdtVUs5R3VmckNRbUJydm5tQzhFPXsiaWQiOjAsInR5cGUiOiJwcm9kdWN0IiwicGFja2FnZSI6WyIiXSwiYXBwbHluYW1lIjpbIipjaGJhbmsuY29tKiIsImNoYmFuay5jb20iXSwicGxhdGZvcm0iOjEwfQ==',
        deepLinkAppHost: 'https://www.ibanking.chbank.com/chbActivityToApp/index.html',
    },
    /* =============================== mock环境配置 ================================ */
    demo: {
        apiPrefixPath: '',
        base_url: './',
        assetsUrl: 'https://10.98.33.100:10004/nibs/new/webbank/',
        loan_calculator: 'https://uat.chbank.com/',
        e2eeLicense:'VVBiNk9jUEpncTVJQjd3MytUc2hzbnJFOTdNNmpMM29RSHNsUE11NTk0eUowd2tYdTB6V3lVdDFJeFpuU2NwTkJYTTlYTUJGWCs0V3VjOUViL0pHelRhd0NHVGp6K0cyNlZ5VkNvQWVQQk5nVWVDdXkvZVlwcWZMOWhrUHA3WEIwZERUdTdHYmwzbE12Wk4zSDNDM3hGQ2hSSWJncGRuK0l6WmRCTVhqSHhzPXsiaWQiOjAsInR5cGUiOiJ0ZXN0IiwicGxhdGZvcm0iOjEwLCJub3RiZWZvcmUiOiIyMDI1MTEyNCIsIm5vdGFmdGVyIjoiMjAyNjA1MjQifQ==',
        staticImageUrlPrePath: 'https://220.241.39.45/nibs/flame/staticzip/nibs/',
        deepLinkAppHost: 'https://h5.shinedin.com/chbActivityToApp/index.html',
    }
};
module.exports = envConfig;