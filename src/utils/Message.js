// 封装message
import { ElMessage } from "element-plus";
const showMessage = (msg, callback, type)=>{
    ElMessage({
        type:type,
        message:msg,
        duration:4000,
        showClose:true,
        onClose:()=>{
            if(callback){
                callback()
            }
        }
    })
}

const message = {
    error:(msg,callback)=>{
        showMessage(msg,callback,"error")
    },
    success:(msg,callback)=>{
        showMessage(msg,callback,"success")
    },
    warning:(msg,callback)=>{
        showMessage(msg,callback,"warning")
    }
}
export default message