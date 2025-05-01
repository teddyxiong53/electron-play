// 侧边栏导航项点击事件处理
const navItems = document.querySelectorAll('.nav-items a');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        // 移除所有active类
        navItems.forEach(nav => nav.classList.remove('active'));
        // 添加active类到当前点击项
        item.classList.add('active');
    });
});

// 聊天列表项点击事件处理
const chatItems = document.querySelectorAll('.chat-item');
chatItems.forEach(item => {
    item.addEventListener('click', () => {
        // 移除所有active类
        chatItems.forEach(chat => chat.classList.remove('active'));
        // 添加active类到当前点击项
        item.classList.add('active');
        
        // 更新聊天窗口标题和内容
        const chatName = item.querySelector('.chat-name').textContent;
        const chatHeader = document.querySelector('.chat-title h2');
        chatHeader.textContent = chatName;
    });
});