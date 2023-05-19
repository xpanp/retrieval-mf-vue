import {createRouter, createWebHistory} from 'vue-router'
import VueCookies from 'vue-cookies'
const routes = [
    {
        path:'/',
        name:'layout',
        redirect:'/home',
        component:()=>import('../views/Layout.vue'),
        children:[
            {
                path:'/home',
                name:"检索",
                component:()=>import('@/views/home.vue')
            },{
                path:'/uploadfile',
                name:"文件上传",
                component:()=>import('@/views/UploadPic.vue')
            },{
                path:'/batchupload',
                name:"批量上传",
                component:()=>import('@/views/UploadDir.vue')
            }
        ]
    },
    {
        path:'/user/register',
        name:"注册",
        component:()=>import('../views/Register.vue')
    },
    {
        path: '/user/login',
        name: '登录',
        component: () => import('../views/Login.vue')
    },
    {
        path:"/:pathMatch(.*)*",
        name:"错误页面",
        component:()=>import("@/views/Error404.vue")
    }
]
const router = createRouter({
    history:createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    // to and from are both route objects. must call `next`.
    if(to.path=='/user/register'||to.path==='/user/login'){
        next()
    }else{
        let token = VueCookies.get("token")
        if(!token){
            return next("/user/login")
        }else{
            next()
        }
    }
})
export default router