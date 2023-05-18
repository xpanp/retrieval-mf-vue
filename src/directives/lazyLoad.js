import B_gray from '../assets/images/loading.png'; // 原始占位图

export const lazyLoad = {
    bind: function (el, binding) {
        // ie浏览器没有IntersectionObserver接口        
        if (IntersectionObserver) {
            let targetSrc = el.src; // 记录img原本要加载的图片地址            
            el.src = B_gray; // 将图片更换为占位图            
            // 创建一个IntersectionObserver对象            
            let lazyImageObserver = new IntersectionObserver((entries) => { // 开始监听后的回调函数                
                    entries.forEach((entry) => {
                    if (entry.intersectionRatio > 0) { // 当前元素在视窗内可见
                        el.src = targetSrc; // 替换当前元素的src为目标图片地址                        
                        lazyImageObserver.unobserve(el); // 使IntersectionObserver停止监听特定目标元素。释放资源
                    }
                })
            })
            lazyImageObserver.observe(el); // 使IntersectionObserver开始监听一个目标元素。
        }
    }
}
