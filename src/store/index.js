import {createStore} from 'vuex'
export default createStore({
    state:{
        // 用户信息
        loginUserInfo:null,
        percentage: 0,
        status:"",
        tip:"后台正在处理...",
        taskId:''
    },
    getters:{
        getLoginUserInfo:(state)=>{
            return state.loginUserInfo
        },
        getToken:(state)=>{
            return state.token
        },
        getPercentage:(state)=>{
            return state.percentage
        },
        getStatus:(state)=>{
            return state.status
        },
        getTip:(state)=>{
            return state.tip
        }
    },
    mutations:{
        updateLoginUserInfo:(state,value)=>{
            state.loginUserInfo=value
        },
        updatePercentage:(state,value)=>{
            state.percentage=value
        },
        updateStatus:(state,value)=>{
            state.status=value
        },
        updateTip:(state,value)=>{
            state.tip=value
        },
    },
    actions:{

    },
    modules:{
        
    }
})