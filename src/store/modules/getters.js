const getters = {
    languages: state => state.app.languages,
    getURL: state => {
        if (NODE_ENV === "production") {
            return state.app.productionURL;
        } else {
            return state.app.developmentURL;
        }
    },
    flowNo: state => state.app.flowNo,
    requestLoading: state => state.app.requestLoading
};
export default getters;