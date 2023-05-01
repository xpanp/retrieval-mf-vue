// 定义正则,并定义为全局变量
const regs = {
    email:/^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/,
    number:/^([0]|[1-9]|[0-9])$/,
    password:/^[a-zA-Z0-9]+$/,
    fileDir: /^(\/[-\w\\]+)+\/?$/
}
const verify = (rule, value, reg, callback)=>{
    if(value){
        if(reg.test(value)){
            callback()
        }else{
            //rule.message是form表单中设置的message
            callback(new Error(rule.message))
        }
    }else{
        callback()
    }
}
export default{
    email:(rule,value,callback)=>{
        return verify(rule, value, regs.email, callback)
    },
    number:(rule,value,callback)=>{
        return verify(rule,value,regs.number,callback)
    },
    password:(rule, value, callback)=>{
        return verify(rule,value,regs.password,callback)
    },
    fileDir:(rule, value, callback)=>{
        return verify(rule,value,regs.fileDir,callback)
    }
}