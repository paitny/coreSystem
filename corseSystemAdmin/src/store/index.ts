import { createStore } from 'vuex';
import user from "./modules/user";
import route from "../store/modules/route";
import app from "../store/modules/app";
import getters from "../store/getters";

export default createStore({
    state: {},
    getters,
    mutations: {},
    actions: {},
    modules: {
        user,
        route,
        app,
      
    },
});
