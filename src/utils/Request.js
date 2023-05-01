// 引入路由
import router from '@/router/index.js'
import axios from 'axios'
// loading效果element plus
import { ElLoading } from 'element-plus'
import Message from "@/utils/Message"

const contentTypeForm = "application/x-www.form-urlencoded;charset=UTF-8"
const contentTypeJson = "application/json"
//引入cookies
import VueCookies from 'vue-cookies'
const instance = axios.create({
    baseURL: '/api',
    timeout: 10 * 1000
})


let loading = null
// 请求拦截器
instance.interceptors.request.use(
    config => {
        //不是所有都需要loading
        const token = VueCookies.get("token")
        if(token){
            config.headers.Authorization = token
        }
        
        if (config.showLoading) {
            loading = ElLoading.service({
                lock: true,
                text: "加载中......",
                background: 'rgba(0,0,0,0.7)'
            })
        }
        return config
    }, (error) => {
        if (error.config.showLoading && loading) {
            loading.close()
        }
        Message.error("请求发送失败")
        return Promise.reject("请求发送失败")
    })

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        const {showLoading, errorCallback, showError} = response.config
        if(showLoading && loading){
            loading.close()
        }
        const code = response.data.code
        if(code === 0){
            // 请求成功返回数据
            return response.data
        }else if(code === 3){      
            // 错误特殊提醒
            return Promise.reject({showError:false,msg:"注册失败"})

        }else if(code === 4){
            Message.error("用户名或者密码错误")
            // 错误特殊提醒
            return Promise.reject({showError:false,msg:"用户名或者密码错误"})
        }
        else{
            if(errorCallback){
                errorCallback(response.data)
            }
            return Promise.reject({showError:showError,msg:response.data.msg})
        }
    }, (error) => {
        console.log("出现错误",error.response)
        // 服务端回复错误时，提醒用户，响应拦截器做点什么
        // 请求报错,后端服务不正常500，502状态码
        const responseData = error.response.data
        if(error.config.showLoading && loading){
            loading.close()
        }
        const status = error.response.status
        if(status==401){
            Message.error(responseData.msg)
            return Promise.reject({showError:true,msg:"用户名或密码错误"})
        }

        return Promise.reject({showError:true,msg:"请重试！"})
    }
)
// 请求封装
const request = (config) => {
    //适合文件上传
    // axios请求接收的参数url,params,dataType,showLoading,errorCallback,showError
    const {url, params, dataType, showLoading=true,errorCallback,showError= true} = config
    let contentType = contentTypeForm
    //可以使用 FormData 上传文件
    let formData = new FormData()
    for(let key in params){
        formData.append(key,params[key] == undefined ? "" : params[key])
    }
    
    if(dataType != null && dataType === 'json'){
        contentType = contentTypeJson
    }
    let headers = {
        'Content-Type':contentType,
        'X-Requested-With':'XMLHttpRequest'
    }
    return instance.post(url,formData,{
        headers:headers,
        showLoading:showLoading,
        errorCallback:errorCallback,
        showError :showError
    }).catch(error=>{
        if(error.showError){
            Message.error(error.msg)
        }
        // 这里是为什么判断if(!result)的原因
        return null
    })
}
export default request