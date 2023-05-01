import {createStore} from 'vuex'
export default createStore({
    state:{
        // 用户信息
        loginUserInfo:null,
    },
    getters:{
        getLoginUserInfo:(state)=>{
            return state.loginUserInfo
        },
        getToken:(state)=>{
            return state.token
        }
    },
    mutations:{
        updateLoginUserInfo:(state,value)=>{
            state.loginUserInfo=value
        },
    },
    actions:{

    },
    modules:{
        
    }
})