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

        const token = VueCookies.get("token")
        if (token) {
            config.headers.Authorization = token
        }
        //不是所有都需要loading
        if (config.showLoading) {
            loading = ElLoading.service({
                lock: true,
                text: "加载中......",
                background: 'rgba(0,0,0,0.7)'
            })
        }
        return config
    }, (error) => {
        // 登陆过期在这里处理
        if (config.showLoading && loading) {
            loading.close()
        }
        Message.error("请求发送失败")
        return Promise.reject("请求发送失败")
    }
)

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        const { showLoading, errorCallback, showError } = response.config
        console.log(response.config)
        if (showLoading && loading) {
            loading.close()
        }
        if (response.status === 200) {
            // 请求成功返回数据
            return response.data
        } else {
            if (errorCallback) {
                errorCallback(response.data)
            }
            return Promise.reject({ showError: showError, msg: response.data.msg })
        }
    },
    (error) => {
        //状态码2**以外的触发此函数
        if (error.config.showLoading && loading) {
            loading.close()
        }
        const responseData = error.response.data
        // 状态
        if (responseData.code === 1) {
            return Promise.reject({ showError: true, msg: "请求参数错误" })
        } else if (responseData.code === 3) {
            router.push('/user/login')
            return Promise.reject({ showError: true, msg: "用户已存在,请登录" })
        } else if (responseData.code === 4) {
            return Promise.reject({ showError: true, msg: "用户名或密码错误" })
        } else if (responseData.code == undefined || responseData.code === 6) {
            return Promise.reject({ showError: true, msg: "你无操作权限，请登录管理员用户" })
        }
        return Promise.reject({ showError: true, msg: responseData.msg })
    }
)
// 请求封装
const request = (config) => {
    //适合文件上传
    // axios请求接收的参数url,params,dataType,showLoading,errorCallback,showError
    const { url, params, dataType, showLoading = true, errorCallback, showError = true } = config
    
    let contentType = contentTypeForm
    //可以使用 FormData 上传文件
    let formData = new FormData()
    for (let key in params) {
        formData.append(key, params[key] == undefined ? "" : params[key])
    }

    if (dataType != null && dataType === 'json') {
        contentType = contentTypeJson
    }
    let headers = {
        'Content-Type': contentType,
        'X-Requested-With': 'XMLHttpRequest'
    }
    return instance.post(url, formData, {
        headers: headers,
        showLoading: showLoading,
        errorCallback: errorCallback,
        showError: showError
    }).catch(error => {
        if (showError) {
            Message.error(error.msg)
        }
        // 这里是为什么判断if(!result)的原因
        return null
    })
}
export default request