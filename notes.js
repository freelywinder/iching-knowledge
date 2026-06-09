// notes.js：纯前端本地笔记增强模块
(function() {
    const STORAGE_KEY = 'yijing_personal_notes';
    
    // 1. 读取所有本地笔记
    function getNotes() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    }

    // 2. 保存或清除单条笔记
    window.savePersonalNote = function(itemId, content) {
        const cleanId = itemId.trim(); // 清除原始数据中可能存在的尾随空格
        const notes = getNotes();
        if (content.trim() === '') {
            delete notes[cleanId]; // 内容为空时删除记录，节省空间
        } else {
            notes[cleanId] = content;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        alert('笔记已保存至本地浏览器！');
    };

    // 3. 自动注入笔记 UI (使用 MutationObserver 确保在原有内容渲染后执行)
    function injectNoteUI() {
        if (typeof window.KNOWLEDGE_DATA === 'undefined') return;
        
        window.KNOWLEDGE_DATA.forEach(item => {
            const cleanId = item.id.trim();
            // 尝试寻找原有知识点的外层容器 (需根据你的实际 HTML 结构调整选择器)
            const container = document.getElementById(cleanId) || document.querySelector(`[data-id="${cleanId}"]`);
            
            if (container && !container.querySelector('.personal-note-box')) {
                const existingNote = getNotes()[cleanId] || '';
                const noteHTML = `
                    <div class="personal-note-box" style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
                        <h4 style="margin-top: 0; color: #333;">✍️ 我的学习心得</h4>
                        <textarea id="note-input-${cleanId}" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit; resize: vertical;" placeholder="在此处记录你的感悟或补充知识...">${existingNote}</textarea>
                        <button onclick="savePersonalNote('${cleanId}', document.getElementById('note-input-${cleanId}').value)" style="margin-top: 10px; padding: 6px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">保存笔记</button>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', noteHTML);
            }
        });
    }

    // 监听 DOM 变化，一旦知识库渲染完成，立即注入笔记框
    const observer = new MutationObserver((mutations) => {
        injectNoteUI();
    });
    
    // 假设你的知识库主容器 ID 为 'knowledge-container'，请根据实际情况修改
    const targetNode = document.getElementById('knowledge-container') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true });
    
    // 页面初始加载时也执行一次
    window.addEventListener('DOMContentLoaded', injectNoteUI);
})();
