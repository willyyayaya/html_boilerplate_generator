// 頁面加載後運行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化頁面和事件
    initUI();
    bindEvents();
    
    // 初始化CSS模板
    initCssTemplates();
    
    // 初始化JS模板
    initJsTemplates();
    
    // 初始化拖放排版
    initDragDropBuilder();
    
    // 觸發初始生成以展示預設模板
    generateTemplate();
  });
  
  // 初始化UI和主題
  function initUI() {
    // 從localStorage讀取主題設置
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.getElementById('themeToggle').checked = true;
    }
    
    // 從localStorage讀取用戶最後的設置
    loadUserSettings();
  }
  
  // 綁定所有事件處理
  function bindEvents() {
    // 主題切換
    document.getElementById('themeToggle').addEventListener('change', toggleTheme);
    
    // 標籤頁切換
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        activateTab(tabId);
      });
    });
    
    // 快速設置選項
    document.getElementById('quickSetup').addEventListener('change', function() {
      const customPanel = document.getElementById('customElementsPanel');
      customPanel.style.display = this.checked ? 'none' : 'block';
    });
    
    // 按鈕事件
    document.getElementById('generateBtn').addEventListener('click', generateTemplate);
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
    document.getElementById('downloadBtn').addEventListener('click', downloadTemplate);
    document.getElementById('applyTemplateBtn').addEventListener('click', applySelectedTemplate);
    document.getElementById('saveTemplateBtn').addEventListener('click', saveCurrentTemplate);
    document.getElementById('loadTemplateBtn').addEventListener('click', loadSavedTemplate);
  }
  
  // 激活選定的標籤頁
  function activateTab(tabId) {
    // 移除所有標籤頁的活動狀態
    const parentElement = document.querySelector(`.tab[data-tab="${tabId}"]`).closest('.tabs').parentElement;
    const tabs = parentElement.querySelectorAll('.tab');
    const contents = parentElement.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.classList.remove('active');
    });
    contents.forEach(content => {
      content.classList.remove('active');
    });
    
    // 激活選定的標籤頁
    parentElement.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
    parentElement.querySelector(`#${tabId}`).classList.add('active');
    
    // 如果是預覽標籤，更新預覽
    if (tabId === 'preview') {
      updatePreview();
    }
  }
  
  // 切換深色/淺色主題
  function toggleTheme() {
    const isDarkMode = document.getElementById('themeToggle').checked;
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('darkMode', isDarkMode);
  }
  
  /**
   * 生成模板時立即應用表單選擇
   */
  function generateTemplate() {
    // 保存用戶設置
    saveUserSettings();
    
    // 獲取自定義 CSS 和 JS
    const customCSS = document.getElementById('cssEditor') ? document.getElementById('cssEditor').value : '';
    const customJS = document.getElementById('jsEditor') ? document.getElementById('jsEditor').value : '';
    
    // 獲取畫布內容
    const pageCanvas = document.getElementById('pageCanvas');
    let canvasContent = '';
    
    if (pageCanvas) {
      // 複製畫布內容並移除編輯相關的屬性
      const canvasClone = pageCanvas.cloneNode(true);
      const editableElements = canvasClone.querySelectorAll('.editable-element');
      
      editableElements.forEach(element => {
        // 移除編輯相關的屬性
        element.removeAttribute('draggable');
        element.removeAttribute('data-element-type');
        element.removeAttribute('data-element-id');
        element.classList.remove('editable-element');
        element.classList.remove('selected');
        
        // 保留其他類名
        const classList = Array.from(element.classList);
        element.className = classList.join(' ');
      });
      
      canvasContent = canvasClone.innerHTML;
    }
    
    // 生成 HTML 模板
    const htmlParts = [];
    
    // 添加 DOCTYPE
      htmlParts.push('<!DOCTYPE html>');
    
    // 添加 HTML 標籤
    htmlParts.push('<html lang="zh-Hant">');
    
    // 添加 head 部分
      htmlParts.push('<head>');
    htmlParts.push('  <meta charset="UTF-8">');
    htmlParts.push('  <meta name="viewport" content="width=device-width, initial-scale=1.0">');
    htmlParts.push('  <title>' + (document.getElementById('pageTitle').value || '我的網站') + '</title>');
    
    // 添加 CSS
    htmlParts.push('  <style>');
    htmlParts.push('    /* 基本樣式 */');
    htmlParts.push('    :root {');
    htmlParts.push('      --primary-color: #4CAF50;');
    htmlParts.push('      --secondary-color: #2196F3;');
    htmlParts.push('      --text-color: #333;');
    htmlParts.push('      --bg-color: #fff;');
    htmlParts.push('      --border-color: #ddd;');
    htmlParts.push('      --border-radius: 4px;');
    htmlParts.push('      --spacing: 20px;');
    htmlParts.push('    }');
    
    htmlParts.push('    * {');
    htmlParts.push('      box-sizing: border-box;');
    htmlParts.push('      margin: 0;');
    htmlParts.push('      padding: 0;');
    htmlParts.push('    }');
    
    htmlParts.push('    body {');
    htmlParts.push('      font-family: "Noto Sans TC", sans-serif;');
    htmlParts.push('      line-height: 1.6;');
    htmlParts.push('      color: var(--text-color);');
    htmlParts.push('      background-color: var(--bg-color);');
    htmlParts.push('    }');
      
      // 添加自定義 CSS
    if (customCSS) {
      htmlParts.push('    /* 自定義樣式 */');
      htmlParts.push(customCSS);
    }
    
    // 添加畫布內容的樣式
    htmlParts.push('    /* 畫布內容樣式 */');
    htmlParts.push('    .page-content {');
    htmlParts.push('      position: relative;');
    htmlParts.push('      width: 100%;');
    htmlParts.push('      min-height: 100vh;');
    htmlParts.push('      padding: var(--spacing);');
          htmlParts.push('    }');
    
    // 添加常用元素的樣式
    htmlParts.push('    /* 常用元素樣式 */');
          htmlParts.push('    .container {');
          htmlParts.push('      max-width: 1200px;');
          htmlParts.push('      margin: 0 auto;');
    htmlParts.push('      padding: 0 var(--spacing);');
          htmlParts.push('    }');
          
    htmlParts.push('    .section {');
    htmlParts.push('      margin: var(--spacing) 0;');
    htmlParts.push('      padding: var(--spacing);');
    htmlParts.push('      border: 1px solid var(--border-color);');
    htmlParts.push('      border-radius: var(--border-radius);');
            htmlParts.push('    }');
    
    htmlParts.push('    .button {');
    htmlParts.push('      display: inline-block;');
    htmlParts.push('      padding: 8px 16px;');
    htmlParts.push('      background-color: var(--primary-color);');
        htmlParts.push('      color: white;');
        htmlParts.push('      border: none;');
    htmlParts.push('      border-radius: var(--border-radius);');
        htmlParts.push('      cursor: pointer;');
    htmlParts.push('      text-decoration: none;');
    htmlParts.push('      transition: background-color 0.3s;');
        htmlParts.push('    }');
    
    htmlParts.push('    .button:hover {');
    htmlParts.push('      background-color: var(--secondary-color);');
        htmlParts.push('    }');
    
    htmlParts.push('    .form-group {');
    htmlParts.push('      margin-bottom: var(--spacing);');
        htmlParts.push('    }');
    
    htmlParts.push('    .form-control {');
    htmlParts.push('      width: 100%;');
    htmlParts.push('      padding: 8px;');
    htmlParts.push('      border: 1px solid var(--border-color);');
    htmlParts.push('      border-radius: var(--border-radius);');
        htmlParts.push('    }');
      
        htmlParts.push('    .card {');
    htmlParts.push('      border: 1px solid var(--border-color);');
    htmlParts.push('      border-radius: var(--border-radius);');
    htmlParts.push('      padding: var(--spacing);');
    htmlParts.push('      margin-bottom: var(--spacing);');
        htmlParts.push('    }');
    
    htmlParts.push('    .card-title {');
    htmlParts.push('      margin-bottom: 10px;');
    htmlParts.push('      color: var(--primary-color);');
        htmlParts.push('    }');
    
    htmlParts.push('    .card-content {');
    htmlParts.push('      color: var(--text-color);');
        htmlParts.push('    }');
    
    htmlParts.push('  </style>');
    
    // 添加外部 CSS 文件
    if (document.getElementById('includeCssLink').checked) {
      const cssFile = document.getElementById('cssFile').value || 'style.css';
      htmlParts.push('  <link rel="stylesheet" href="' + cssFile + '">');
    }
    
    // 添加外部字體
    htmlParts.push('  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet">');
      
      htmlParts.push('</head>');
      
    // 添加 body 部分
        htmlParts.push('<body>');
    
    // 添加畫布內容
    htmlParts.push('  <div class="page-content">');
    htmlParts.push('    <div class="container">');
    htmlParts.push(canvasContent);
        htmlParts.push('    </div>');
        htmlParts.push('  </div>');
    
    // 添加 JavaScript
    if (document.getElementById('includeJsScript').checked) {
      const jsFile = document.getElementById('jsFile').value || 'script.js';
      htmlParts.push('  <script src="' + jsFile + '"></script>');
    }
    
    // 添加自定義 JavaScript
    if (customJS) {
        htmlParts.push('  <script>');
      htmlParts.push(customJS);
        htmlParts.push('  </script>');
      }
      
      htmlParts.push('</body>');
      htmlParts.push('</html>');
    
    // 更新輸出
    const output = htmlParts.join('\n');
    document.getElementById('output').value = output;
    
    // 更新預覽
    updatePreview();
  }
  
  /**
   * 應用選定的預設模板
   */
  function applySelectedTemplate() {
    const template = document.getElementById('templateSelect').value;
    
    // 確保顯示進階選項卡
    activateTab('advanced');
    
    // 根據選定的模板預設值
    switch(template) {
      case 'blog':
        setTemplateBlog();
        break;
      case 'portfolio':
        setTemplatePortfolio();
        break;
      case 'landing':
        setTemplateLanding();
        break;
      case 'ecommerce':
        setTemplateEcommerce();
        break;
      default:
        setTemplateBlank();
    }
    
    // 回到基本設置選項卡
    activateTab('basic');
    
    // 生成模板代碼
    generateTemplate();
  }
  
  // 設置部落格模板
  function setTemplateBlog() {
    document.getElementById('pageTitle').value = '我的部落格';
    document.getElementById('includeHeader').checked = true;
    document.getElementById('includeNav').checked = true;
    document.getElementById('includeMain').checked = true;
    document.getElementById('includeAside').checked = true;
    document.getElementById('includeFooter').checked = true;
    document.getElementById('description').value = '個人部落格網站';
    document.getElementById('includeNavbar').checked = true;
    // 設置佈局為雙欄
    document.querySelector('input[name="layoutTemplate"][value="two"]').checked = true;
    // 確保在選擇部落格模板時表單顯示正確
    document.getElementById('includeForm').checked = false;
  }
  
  // 設置作品集模板
  function setTemplatePortfolio() {
    document.getElementById('pageTitle').value = '我的作品集';
    document.getElementById('includeHeader').checked = true;
    document.getElementById('includeNav').checked = true;
    document.getElementById('includeMain').checked = true;
    document.getElementById('includeFooter').checked = true;
    document.getElementById('includeHero').checked = true;
    document.getElementById('includeCard').checked = true;
    // 預設使用Bootstrap框架
    document.querySelector('input[name="cssFramework"][value="bootstrap"]').checked = true;
    // 設置單欄佈局
    document.querySelector('input[name="layoutTemplate"][value="single"]').checked = true;
  }
  
  // 設置著陸頁模板
  function setTemplateLanding() {
    document.getElementById('pageTitle').value = '歡迎來到我的網站';
    document.getElementById('includeHeader').checked = true;
    document.getElementById('includeHero').checked = true;
    document.getElementById('includeForm').checked = true;
    document.getElementById('includeFooter').checked = true;
    document.getElementById('includeMain').checked = true;
    // 可選用Tailwind
    document.querySelector('input[name="cssFramework"][value="tailwind"]').checked = true;
    // 設置單欄佈局
    document.querySelector('input[name="layoutTemplate"][value="single"]').checked = true;
  }
  
  // 設置電商模板
  function setTemplateEcommerce() {
    document.getElementById('pageTitle').value = '線上商店';
    document.getElementById('includeHeader').checked = true;
    document.getElementById('includeNav').checked = true;
    document.getElementById('includeMain').checked = true;
    document.getElementById('includeFooter').checked = true;
    document.getElementById('includeNavbar').checked = true;
    document.getElementById('includeCard').checked = true;
  }
  
  // 設置空白模板
  function setTemplateBlank() {
    document.getElementById('pageTitle').value = '我的網站';
    document.getElementById('includeHeader').checked = false;
    document.getElementById('includeNav').checked = false;
    document.getElementById('includeMain').checked = false;
    document.getElementById('includeAside').checked = false;
    document.getElementById('includeFooter').checked = false;
    document.getElementById('includeHero').checked = false;
    document.getElementById('includeNavbar').checked = false;
    document.getElementById('includeCard').checked = false;
    document.getElementById('includeForm').checked = false;
  }
  
  // 保存當前模板設置
  function saveCurrentTemplate() {
    const templateName = document.getElementById('templateName').value || '預設模板';
    
    // 收集所有設置
    const settings = {
      pageTitle: document.getElementById('pageTitle').value,
      language: document.getElementById('language').value,
      charset: document.getElementById('charset').value,
      viewport: document.getElementById('viewport').value,
      cssFile: document.getElementById('cssFile').value,
      jsFile: document.getElementById('jsFile').value,
      // 基本元素
      includeDoctype: document.getElementById('includeDoctype').checked,
      includeHtmlStructure: document.getElementById('includeHtmlStructure').checked,
      includeMeta: document.getElementById('includeMeta').checked,
      includeTitle: document.getElementById('includeTitle').checked,
      includeCssLink: document.getElementById('includeCssLink').checked,
      includeJsScript: document.getElementById('includeJsScript').checked,
      // 進階元素
      includeHeader: document.getElementById('includeHeader').checked,
      includeNav: document.getElementById('includeNav').checked,
      includeMain: document.getElementById('includeMain').checked,
      includeAside: document.getElementById('includeAside').checked,
      includeFooter: document.getElementById('includeFooter').checked,
      // Meta 標籤
      description: document.getElementById('description').value,
      keywords: document.getElementById('keywords').value,
      author: document.getElementById('author').value,
      // CSS 框架
      cssFramework: document.querySelector('input[name="cssFramework"]:checked').value,
      // 佈局模板
      layoutTemplate: document.querySelector('input[name="layoutTemplate"]:checked').value,
      // 組件
      includeHero: document.getElementById('includeHero').checked,
      includeNavbar: document.getElementById('includeNavbar').checked,
      includeCard: document.getElementById('includeCard').checked,
      includeForm: document.getElementById('includeForm').checked,
      
      // 新增功能: 社交媒體META
      includeSocialMeta: document.getElementById('includeSocialMeta') ? document.getElementById('includeSocialMeta').checked : false,
      ogTitle: document.getElementById('ogTitle') ? document.getElementById('ogTitle').value : '',
      ogDescription: document.getElementById('ogDescription') ? document.getElementById('ogDescription').value : '',
      ogImage: document.getElementById('ogImage') ? document.getElementById('ogImage').value : '',
      
      // 新增功能: 主題色彩
      includeThemeColor: document.getElementById('includeThemeColor') ? document.getElementById('includeThemeColor').checked : false,
      themeColor: document.getElementById('themeColor') ? document.getElementById('themeColor').value : '#4CAF50',
      
      // 新增功能: Modern Normalize CSS
      includeNormalize: document.getElementById('includeNormalize') ? document.getElementById('includeNormalize').checked : false,
      
      // 新增功能: jQuery
      includeJQuery: document.getElementById('includeJQuery') ? document.getElementById('includeJQuery').checked : false,
      
      // 新增功能: Bootstrap導航欄
      includeBootstrapNavbar: document.getElementById('includeBootstrapNavbar') ? document.getElementById('includeBootstrapNavbar').checked : false,
      
      // 新增功能: 內容和組件
      includeDummyText: document.getElementById('includeDummyText') ? document.getElementById('includeDummyText').checked : false,
      includeDummyImages: document.getElementById('includeDummyImages') ? document.getElementById('includeDummyImages').checked : false,
      includeTable: document.getElementById('includeTable') ? document.getElementById('includeTable').checked : false,
      includeCarousel: document.getElementById('includeCarousel') ? document.getElementById('includeCarousel').checked : false,
      includeAccordion: document.getElementById('includeAccordion') ? document.getElementById('includeAccordion').checked : false,
      
      // 新增功能: Web App Manifest和Favicons
      includeManifest: document.getElementById('includeManifest') ? document.getElementById('includeManifest').checked : false,
      appName: document.getElementById('appName') ? document.getElementById('appName').value : '',
      manifestColor: document.getElementById('manifestColor') ? document.getElementById('manifestColor').value : '#4CAF50',
      includeFavicons: document.getElementById('includeFavicons') ? document.getElementById('includeFavicons').checked : false,
      
      // 新增功能: Google Analytics
      includeAnalytics: document.getElementById('includeAnalytics') ? document.getElementById('includeAnalytics').checked : false,
      gaId: document.getElementById('gaId') ? document.getElementById('gaId').value : '',
      
      // 新增功能: 特效和互動
      includeFadeIn: document.getElementById('includeFadeIn') ? document.getElementById('includeFadeIn').checked : false,
      includeFadeInAfterLoad: document.getElementById('includeFadeInAfterLoad') ? document.getElementById('includeFadeInAfterLoad').checked : false,
      includeCookieNotice: document.getElementById('includeCookieNotice') ? document.getElementById('includeCookieNotice').checked : false,
      includeAnnouncementBar: document.getElementById('includeAnnouncementBar') ? document.getElementById('includeAnnouncementBar').checked : false,
      announcementText: document.getElementById('announcementText') ? document.getElementById('announcementText').value : '',
      includeUpgradeMessage: document.getElementById('includeUpgradeMessage') ? document.getElementById('includeUpgradeMessage').checked : false,
      includeBasicHTML5Tags: document.getElementById('includeBasicHTML5Tags') ? document.getElementById('includeBasicHTML5Tags').checked : false,
      includeTrollface: document.getElementById('includeTrollface') ? document.getElementById('includeTrollface').checked : false,
      customEasterEggImage: document.getElementById('customEasterEggImage') ? document.getElementById('customEasterEggImage').value : '',
      customEasterEggSequence: document.getElementById('customEasterEggSequence') ? document.getElementById('customEasterEggSequence').value : ''
    };
    
    // 儲存到localStorage
    let savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '{}');
    savedTemplates[templateName] = settings;
    localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));
    
    alert(`模板 "${templateName}" 已保存！`);
  }
  
  // 加載保存的模板
  function loadSavedTemplate() {
    const templateName = document.getElementById('templateName').value;
    if (!templateName) {
      alert('請輸入要加載的模板名稱');
      return;
    }
    
    const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '{}');
    const settings = savedTemplates[templateName];
    
    if (!settings) {
      alert(`找不到名為 "${templateName}" 的模板`);
      return;
    }
    
    // 應用設置
    applySavedSettings(settings);
    
    // 重新生成模板
    generateTemplate();
    
    alert(`已加載模板 "${templateName}"`);
  }
  
  // 應用保存的設置
  function applySavedSettings(settings) {
    // 應用基本設置
    document.getElementById('pageTitle').value = settings.pageTitle || '';
    document.getElementById('language').value = settings.language || 'zh-Hant';
    document.getElementById('charset').value = settings.charset || 'UTF-8';
    document.getElementById('viewport').value = settings.viewport || 'width=device-width, initial-scale=1.0';
    document.getElementById('cssFile').value = settings.cssFile || '';
    document.getElementById('jsFile').value = settings.jsFile || '';
    
    // 應用基本元素選項
    document.getElementById('includeDoctype').checked = settings.includeDoctype !== false;
    document.getElementById('includeHtmlStructure').checked = settings.includeHtmlStructure !== false;
    document.getElementById('includeMeta').checked = settings.includeMeta !== false;
    document.getElementById('includeTitle').checked = settings.includeTitle !== false;
    document.getElementById('includeCssLink').checked = settings.includeCssLink !== false;
    document.getElementById('includeJsScript').checked = settings.includeJsScript !== false;
    
    // 應用進階元素選項
    document.getElementById('includeHeader').checked = settings.includeHeader || false;
    document.getElementById('includeNav').checked = settings.includeNav || false;
    document.getElementById('includeMain').checked = settings.includeMain || false;
    document.getElementById('includeAside').checked = settings.includeAside || false;
    document.getElementById('includeFooter').checked = settings.includeFooter || false;
    
    // 應用Meta標籤
    document.getElementById('description').value = settings.description || '';
    document.getElementById('keywords').value = settings.keywords || '';
    document.getElementById('author').value = settings.author || '';
    
    // 應用CSS框架
    const cssFramework = settings.cssFramework || 'none';
    document.querySelector(`input[name="cssFramework"][value="${cssFramework}"]`).checked = true;
    
    // 應用佈局模板
    const layoutTemplate = settings.layoutTemplate || 'single';
    document.querySelector(`input[name="layoutTemplate"][value="${layoutTemplate}"]`).checked = true;
    
    // 應用組件選項
    document.getElementById('includeHero').checked = settings.includeHero || false;
    document.getElementById('includeNavbar').checked = settings.includeNavbar || false;
    document.getElementById('includeCard').checked = settings.includeCard || false;
    document.getElementById('includeForm').checked = settings.includeForm || false;
    
    // 新增功能: 社交媒體META
    if (document.getElementById('includeSocialMeta')) {
      document.getElementById('includeSocialMeta').checked = settings.includeSocialMeta || false;
      if (document.getElementById('ogTitle')) document.getElementById('ogTitle').value = settings.ogTitle || '';
      if (document.getElementById('ogDescription')) document.getElementById('ogDescription').value = settings.ogDescription || '';
      if (document.getElementById('ogImage')) document.getElementById('ogImage').value = settings.ogImage || '';
    }
    
    // 新增功能: 主題色彩
    if (document.getElementById('includeThemeColor')) {
      document.getElementById('includeThemeColor').checked = settings.includeThemeColor || false;
      if (document.getElementById('themeColor')) document.getElementById('themeColor').value = settings.themeColor || '#4CAF50';
    }
    
    // 新增功能: Modern Normalize CSS
    if (document.getElementById('includeNormalize')) {
      document.getElementById('includeNormalize').checked = settings.includeNormalize || false;
    }
    
    // 新增功能: jQuery
    if (document.getElementById('includeJQuery')) {
      document.getElementById('includeJQuery').checked = settings.includeJQuery || false;
    }
    
    // 新增功能: Bootstrap導航欄
    if (document.getElementById('includeBootstrapNavbar')) {
      document.getElementById('includeBootstrapNavbar').checked = settings.includeBootstrapNavbar || false;
    }
    
    // 新增功能: 內容和組件
    if (document.getElementById('includeDummyText')) {
      document.getElementById('includeDummyText').checked = settings.includeDummyText || false;
    }
    if (document.getElementById('includeDummyImages')) {
      document.getElementById('includeDummyImages').checked = settings.includeDummyImages || false;
    }
    if (document.getElementById('includeTable')) {
      document.getElementById('includeTable').checked = settings.includeTable || false;
    }
    if (document.getElementById('includeCarousel')) {
      document.getElementById('includeCarousel').checked = settings.includeCarousel || false;
    }
    if (document.getElementById('includeAccordion')) {
      document.getElementById('includeAccordion').checked = settings.includeAccordion || false;
    }
    
    // 新增功能: Web App Manifest和Favicons
    if (document.getElementById('includeManifest')) {
      document.getElementById('includeManifest').checked = settings.includeManifest || false;
      if (document.getElementById('appName')) document.getElementById('appName').value = settings.appName || '';
      if (document.getElementById('manifestColor')) document.getElementById('manifestColor').value = settings.manifestColor || '#4CAF50';
    }
    if (document.getElementById('includeFavicons')) {
      document.getElementById('includeFavicons').checked = settings.includeFavicons || false;
    }
    
    // 新增功能: Google Analytics
    if (document.getElementById('includeAnalytics')) {
      document.getElementById('includeAnalytics').checked = settings.includeAnalytics || false;
      if (document.getElementById('gaId')) document.getElementById('gaId').value = settings.gaId || '';
    }
    
    // 新增功能: 特效和互動
    if (document.getElementById('includeFadeIn')) {
      document.getElementById('includeFadeIn').checked = settings.includeFadeIn || false;
    }
    if (document.getElementById('includeFadeInAfterLoad')) {
      document.getElementById('includeFadeInAfterLoad').checked = settings.includeFadeInAfterLoad || false;
    }
    if (document.getElementById('includeCookieNotice')) {
      document.getElementById('includeCookieNotice').checked = settings.includeCookieNotice || false;
    }
    if (document.getElementById('includeAnnouncementBar')) {
      document.getElementById('includeAnnouncementBar').checked = settings.includeAnnouncementBar || false;
      if (document.getElementById('announcementText')) document.getElementById('announcementText').value = settings.announcementText || '';
    }
    if (document.getElementById('includeUpgradeMessage')) {
      document.getElementById('includeUpgradeMessage').checked = settings.includeUpgradeMessage || false;
    }
    if (document.getElementById('includeBasicHTML5Tags')) {
      document.getElementById('includeBasicHTML5Tags').checked = settings.includeBasicHTML5Tags || false;
    }
    if (document.getElementById('includeTrollface')) {
      document.getElementById('includeTrollface').checked = settings.includeTrollface || false;
      if (document.getElementById('customEasterEggImage')) {
        document.getElementById('customEasterEggImage').value = settings.customEasterEggImage || '';
      }
      if (document.getElementById('customEasterEggSequence')) {
        document.getElementById('customEasterEggSequence').value = settings.customEasterEggSequence || '';
      }
    }
  }
  
  // 保存用戶設置
  function saveUserSettings() {
    const settings = {
      pageTitle: document.getElementById('pageTitle').value,
      language: document.getElementById('language').value,
      charset: document.getElementById('charset').value,
      viewport: document.getElementById('viewport').value,
      cssFile: document.getElementById('cssFile').value,
      jsFile: document.getElementById('jsFile').value,
      quickSetup: document.getElementById('quickSetup').checked
    };
    
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }
  
  // 加載用戶設置
  function loadUserSettings() {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      
      // 應用設置
      document.getElementById('pageTitle').value = settings.pageTitle || '';
      document.getElementById('language').value = settings.language || 'zh-Hant';
      document.getElementById('charset').value = settings.charset || 'UTF-8';
      document.getElementById('viewport').value = settings.viewport || 'width=device-width, initial-scale=1.0';
      document.getElementById('cssFile').value = settings.cssFile || '';
      document.getElementById('jsFile').value = settings.jsFile || '';
      document.getElementById('quickSetup').checked = settings.quickSetup !== false;
      
      // 如果用戶禁用了快速設置，顯示自定義元素面板
      if (!settings.quickSetup) {
        document.getElementById('customElementsPanel').style.display = 'block';
      }
    }
  }
  
  /**
   * 更新預覽
   */
  function updatePreview() {
    const output = document.getElementById('output').value;
    const previewFrame = document.getElementById('previewFrame');
    
    if (previewFrame) {
      const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
      doc.open();
      doc.write(output);
      doc.close();
      
      // 調整預覽框架大小
      previewFrame.style.height = doc.body.scrollHeight + 'px';
    }
  }
  
  /**
   * 複製生成的代碼到剪貼簿
   */
  function copyToClipboard() {
    const output = document.getElementById('output');
    output.select();
    output.setSelectionRange(0, 99999); // For mobile devices
    
    try {
      // 現代方法
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(output.value)
          .then(() => alert("已複製到剪貼簿！"))
          .catch(() => fallbackCopyMethod());
      } else {
        // 回退到舊方法
        fallbackCopyMethod();
      }
    } catch (err) {
      alert("複製失敗，請手動複製。");
      console.error("複製失敗:", err);
    }
    
    function fallbackCopyMethod() {
      document.execCommand("copy");
      alert("已複製到剪貼簿！");
    }
  }
  
  /**
   * 下載HTML模板文件
   */
  function downloadTemplate() {
    const content = document.getElementById('output').value;
    if (!content) {
      alert('請先生成模板！');
      return;
    }
    
    const pageTitle = document.getElementById('pageTitle').value || '我的網站';
    const filename = pageTitle.replace(/\s+/g, '-').toLowerCase() + '.html';
    
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // 在template_generator.js中添加
  function initCssTemplates() {
    // 定義CSS模板
    window.cssTemplates = {
      'modern': {
        name: '現代簡約',
        variables: {
          primaryColor: '#4CAF50',
          secondaryColor: '#2196F3',
          textColor: '#333333',
          backgroundColor: '#ffffff',
          fontFamily: "'Noto Sans TC', Arial, sans-serif",
          borderRadius: '4px'
        },
        cssCode: `/* 現代簡約樣式 */
:root {
  --primary-color: {{primaryColor}};
  --secondary-color: {{secondaryColor}};
  --text-color: {{textColor}};
  --bg-color: {{backgroundColor}};
  --font-family: {{fontFamily}};
  --border-radius: {{borderRadius}};
}

body {
  font-family: var(--font-family);
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
  color: var(--text-color);
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.75rem; }
h4 { font-size: 1.5rem; }
h5 { font-size: 1.25rem; }
h6 { font-size: 1rem; }

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  color: var(--secondary-color);
  text-decoration: underline;
}

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: var(--border-radius);
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

.btn-primary {
  color: #fff;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}
`
      },
      'business': {
        name: '商務正式',
        variables: {
          primaryColor: '#0066cc',
          secondaryColor: '#003366',
          textColor: '#333333',
          backgroundColor: '#ffffff',
          fontFamily: "'Noto Serif TC', Georgia, serif",
          borderRadius: '0px'
        },
        cssCode: `/* 商務正式樣式 */
:root {
  --primary-color: {{primaryColor}};
  --secondary-color: {{secondaryColor}};
  --text-color: {{textColor}};
  --bg-color: {{backgroundColor}};
  --font-family: {{fontFamily}};
  --border-radius: {{borderRadius}};
}

body {
  font-family: var(--font-family);
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 15px;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--secondary-color);
}

h1 { font-size: 2.25rem; }
h2 { font-size: 1.8rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }
h5 { font-size: 1.1rem; }
h6 { font-size: 1rem; }

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: var(--border-radius);
  transition: all 0.2s ease-in-out;
}

.btn-primary {
  color: #fff;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}
`
      },
      'colorful': {
        name: '活潑色彩',
        variables: {
          primaryColor: '#ff6b6b',
          secondaryColor: '#4ecdc4',
          textColor: '#313131',
          backgroundColor: '#f8f9fa',
          fontFamily: "'Noto Sans TC', Arial, sans-serif",
          borderRadius: '8px'
        },
        cssCode: `/* 活潑色彩樣式 */
:root {
  --primary-color: {{primaryColor}};
  --secondary-color: {{secondaryColor}};
  --text-color: {{textColor}};
  --bg-color: {{backgroundColor}};
  --font-family: {{fontFamily}};
  --border-radius: {{borderRadius}};
  --accent-color: #ffd166;
  --success-color: #06d6a0;
  --warning-color: #ffc857;
  --danger-color: #ef476f;
}

body {
  font-family: var(--font-family);
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--primary-color);
}

h1 { font-size: 3rem; }
h2 { font-size: 2.5rem; }
h3 { font-size: 2rem; }
h4 { font-size: 1.5rem; }
h5 { font-size: 1.25rem; }
h6 { font-size: 1rem; }

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: all 0.3s ease;
}

a:hover {
  color: var(--secondary-color);
  text-decoration: none;
}

.btn {
  display: inline-block;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 2px solid transparent;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.btn-primary {
  color: #fff;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0,0,0,0.15);
}
`
      }
    };
    
    // 將模板添加到選擇器中
    const cssTemplateSelect = document.getElementById('cssTemplateSelect');
    for (const [key, template] of Object.entries(window.cssTemplates)) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = template.name;
      cssTemplateSelect.appendChild(option);
    }
    
    // 初始化顏色和編輯器
    document.getElementById('css-primaryColor').value = '#4CAF50';
    document.getElementById('css-secondaryColor').value = '#2196F3';
    document.getElementById('css-textColor').value = '#333333';
    document.getElementById('css-backgroundColor').value = '#ffffff';
    
    // 綁定CSS模板選擇事件
    cssTemplateSelect.addEventListener('change', applyCssTemplate);
    
    // 綁定顏色變化事件
    document.getElementById('css-primaryColor').addEventListener('change', updateCssPreview);
    document.getElementById('css-secondaryColor').addEventListener('change', updateCssPreview);
    document.getElementById('css-textColor').addEventListener('change', updateCssPreview);
    document.getElementById('css-backgroundColor').addEventListener('change', updateCssPreview);
    
    // 綁定預覽按鈕
    document.getElementById('updateCssPreviewBtn').addEventListener('click', updateCssPreview);
  }

  function applyCssTemplate() {
    const selectedTemplate = document.getElementById('cssTemplateSelect').value;
    if (!selectedTemplate) return;
    
    const template = window.cssTemplates[selectedTemplate];
    
    // 填充CSS變數編輯表單
    for (const [varName, varValue] of Object.entries(template.variables)) {
      const input = document.getElementById('css-' + varName);
      if (input) {
        input.value = varValue;
      }
    }
    
    // 更新CSS編輯器
    const cssEditor = document.getElementById('cssEditor');
    let cssCode = template.cssCode;
    
    // 替換變數
    for (const [varName, varValue] of Object.entries(template.variables)) {
      cssCode = cssCode.replace(new RegExp(`{{${varName}}}`, 'g'), varValue);
    }
    
    cssEditor.value = cssCode;
    
    // 預覽CSS
    updateCssPreview();
  }

  function updateCssPreview() {
    // 獲取CSS代碼
    let cssCode = document.getElementById('cssEditor').value;
    
    // 替換變數
    const primaryColor = document.getElementById('css-primaryColor').value;
    const secondaryColor = document.getElementById('css-secondaryColor').value;
    const textColor = document.getElementById('css-textColor').value;
    const backgroundColor = document.getElementById('css-backgroundColor').value;
    
    cssCode = cssCode.replace(/{{primaryColor}}/g, primaryColor);
    cssCode = cssCode.replace(/{{secondaryColor}}/g, secondaryColor);
    cssCode = cssCode.replace(/{{textColor}}/g, textColor);
    cssCode = cssCode.replace(/{{backgroundColor}}/g, backgroundColor);
    
    // 更新預覽框架的樣式
    const previewFrame = document.getElementById('previewFrame');
    if (previewFrame && previewFrame.contentDocument) {
      let styleElement = previewFrame.contentDocument.getElementById('customCssStyle');
      
      if (!styleElement) {
        styleElement = previewFrame.contentDocument.createElement('style');
        styleElement.id = 'customCssStyle';
        previewFrame.contentDocument.head.appendChild(styleElement);
      }
      
      styleElement.textContent = cssCode;
    }
  }

  function initJsTemplates() {
    // 定義JS模塊
    window.jsModules = {
      'form-validation': {
        name: '表單驗證',
        dependencies: ['jquery'],
        code: `// 表單驗證模組
document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      let isValid = true;
      
      // 驗證必填欄位
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          
          // 創建錯誤提示
          let errorMsg = field.nextElementSibling;
          if (!errorMsg || !errorMsg.classList.contains('error-message')) {
            errorMsg = document.createElement('div');
            errorMsg.classList.add('error-message');
            errorMsg.textContent = '此欄位為必填';
            field.parentNode.insertBefore(errorMsg, field.nextElementSibling);
          }
        } else {
          field.classList.remove('error');
          let errorMsg = field.nextElementSibling;
          if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
          }
        }
      });
      
      if (!isValid) {
        e.preventDefault();
      }
    });
  });
});`
      },
      'smooth-scroll': {
        name: '平滑滾動',
        dependencies: [],
        code: `// 平滑滾動模組
document.addEventListener('DOMContentLoaded', function() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 50,
          behavior: 'smooth'
        });
      }
    });
  });
});`
      },
      'image-lightbox': {
        name: '圖片燈箱',
        dependencies: [],
        code: `// 圖片燈箱模組
document.addEventListener('DOMContentLoaded', function() {
  // 創建燈箱元素
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.display = 'none';
  lightbox.style.position = 'fixed';
  lightbox.style.zIndex = '1000';
  lightbox.style.top = '0';
  lightbox.style.left = '0';
  lightbox.style.width = '100%';
  lightbox.style.height = '100%';
  lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  lightbox.style.justifyContent = 'center';
  lightbox.style.alignItems = 'center';
  
  const lightboxImg = document.createElement('img');
  lightboxImg.style.maxWidth = '90%';
  lightboxImg.style.maxHeight = '90%';
  lightboxImg.style.border = '3px solid white';
  lightboxImg.style.borderRadius = '5px';
  
  lightbox.appendChild(lightboxImg);
  document.body.appendChild(lightbox);
  
  // 為所有圖片添加點擊事件
  const images = document.querySelectorAll('img[data-lightbox]');
  images.forEach(image => {
    image.style.cursor = 'pointer';
    image.addEventListener('click', function() {
      lightboxImg.src = this.src;
      lightbox.style.display = 'flex';
    });
  });
  
  // 點擊燈箱關閉
  lightbox.addEventListener('click', function() {
    this.style.display = 'none';
  });
});`
      },
      'responsive-menu': {
        name: '響應式選單',
        dependencies: [],
        code: `// 響應式選單模組
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav ul');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  } else {
    console.warn('響應式選單需要 .menu-toggle 按鈕和 nav ul 元素');
    
    // 自動創建必要元素
    if (!menuToggle && document.querySelector('nav')) {
      const toggle = document.createElement('button');
      toggle.className = 'menu-toggle';
      toggle.innerHTML = '<span></span><span></span><span></span>';
      toggle.style.display = 'none';
      toggle.style.flexDirection = 'column';
      toggle.style.justifyContent = 'space-between';
      toggle.style.width = '30px';
      toggle.style.height = '25px';
      toggle.style.background = 'none';
      toggle.style.border = 'none';
      toggle.style.cursor = 'pointer';
      toggle.style.padding = '0';
      
      const spans = toggle.querySelectorAll('span');
      spans.forEach(span => {
        span.style.display = 'block';
        span.style.height = '3px';
        span.style.width = '100%';
        span.style.backgroundColor = '#333';
        span.style.borderRadius = '3px';
        span.style.transition = 'all 0.3s ease';
      });
      
      document.querySelector('nav').prepend(toggle);
      
      // 添加媒體查詢樣式
      const style = document.createElement('style');
      style.textContent = '@media screen and (max-width: 768px) {' +
        '.menu-toggle { display: flex !important; }' +
        'nav ul { display: none; position: absolute; top: 100%; left: 0; width: 100%; background: white; flex-direction: column; padding: 20px 0; box-shadow: 0 5px 10px rgba(0,0,0,0.1); }' +
        'nav ul.active { display: flex !important; }' +
        'nav ul li { margin: 10px 0; }' +
        '.menu-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(8px, 6px); }' +
        '.menu-toggle.active span:nth-child(2) { opacity: 0; }' +
        '.menu-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(8px, -6px); }' +
        '}';
      document.head.appendChild(style);
      
      // 重新獲取元素並設置事件
      const newToggle = document.querySelector('.menu-toggle');
      const navUl = document.querySelector('nav ul');
      
      if (newToggle && navUl) {
        newToggle.addEventListener('click', function() {
          navUl.classList.toggle('active');
          newToggle.classList.toggle('active');
        });
      }
    }
  }
});`
      },
      'theme-switch': {
        name: '深淺主題切換',
        dependencies: [],
        code: `// 深淺主題切換模組
document.addEventListener('DOMContentLoaded', function() {
  // 檢查是否已存在主題切換按鈕
  let themeSwitch = document.getElementById('theme-switch');
  
  if (!themeSwitch) {
    // 創建主題切換按鈕
    themeSwitch = document.createElement('button');
    themeSwitch.id = 'theme-switch';
    themeSwitch.className = 'theme-switch-btn';
    themeSwitch.innerHTML = '🌓';
    themeSwitch.title = '切換深淺主題';
    
    // 設置樣式
    themeSwitch.style.position = 'fixed';
    themeSwitch.style.bottom = '20px';
    themeSwitch.style.right = '20px';
    themeSwitch.style.width = '40px';
    themeSwitch.style.height = '40px';
    themeSwitch.style.borderRadius = '50%';
    themeSwitch.style.background = '#fff';
    themeSwitch.style.border = '1px solid #ddd';
    themeSwitch.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    themeSwitch.style.cursor = 'pointer';
    themeSwitch.style.fontSize = '20px';
    themeSwitch.style.display = 'flex';
    themeSwitch.style.alignItems = 'center';
    themeSwitch.style.justifyContent = 'center';
    themeSwitch.style.zIndex = '999';
    
    document.body.appendChild(themeSwitch);
  }
  
  // 檢查或創建深色主題樣式
  let darkThemeStyle = document.getElementById('dark-theme-style');
  
  if (!darkThemeStyle) {
    darkThemeStyle = document.createElement('style');
    darkThemeStyle.id = 'dark-theme-style';
    darkThemeStyle.textContent = 
      ':root.dark-theme {' +
      '  --text-color: #f0f0f0;' +
      '  --bg-color: #222;' +
      '  --border-color: #444;' +
      '}' +
      ':root.dark-theme body {' +
      '  background-color: var(--bg-color);' +
      '  color: var(--text-color);' +
      '}' +
      ':root.dark-theme .theme-switch-btn {' +
      '  background: #444;' +
      '  border-color: #666;' +
      '  color: #f0f0f0;' +
      '}';
    document.head.appendChild(darkThemeStyle);
  }
  
  // 從localStorage載入主題設置
  const isDarkMode = localStorage.getItem('darkTheme') === 'true';
  if (isDarkMode) {
    document.documentElement.classList.add('dark-theme');
  }
  
  // 綁定主題切換事件
  themeSwitch.addEventListener('click', function() {
    document.documentElement.classList.toggle('dark-theme');
    const isDark = document.documentElement.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDark);
  });
});`
      }
    };
    
    // 將模塊添加到容器中
    const jsModulesContainer = document.getElementById('jsModulesContainer');
    
    for (const [key, module] of Object.entries(window.jsModules)) {
      const moduleGroup = document.createElement('div');
      moduleGroup.className = 'module-group';
      moduleGroup.innerHTML = `
        <input type="checkbox" id="js-module-${key}" class="js-module" data-module="${key}">
        <label for="js-module-${key}">${module.name}${module.dependencies.length > 0 ? ` (需要: ${module.dependencies.join(', ')})` : ''}</label>
      `;
      jsModulesContainer.appendChild(moduleGroup);
    }
    
    // 綁定JS模組選擇事件
    document.querySelectorAll('.js-module').forEach(checkbox => {
      checkbox.addEventListener('change', updateJsPreview);
    });
    
    // 初始化JS編輯器
    const jsEditor = document.getElementById('jsEditor');
    jsEditor.value = '// 在此編輯JavaScript代碼...';
  }

  function updateJsPreview() {
    const selectedModules = document.querySelectorAll('.js-module:checked');
    let jsCode = '';
    let dependencies = new Set();
    
    selectedModules.forEach(module => {
      const moduleKey = module.dataset.module;
      const moduleInfo = window.jsModules[moduleKey];
      
      // 收集依賴
      moduleInfo.dependencies.forEach(dep => dependencies.add(dep));
      
      // 添加代碼
      jsCode += `/* ${moduleInfo.name} */\n${moduleInfo.code}\n\n`;
    });
    
    // 更新JS編輯器
    document.getElementById('jsEditor').value = jsCode || '// 在此編輯JavaScript代碼...';
    
    // 更新依賴項顯示
    const dependenciesContainer = document.getElementById('jsDependencies');
    if (dependencies.size > 0) {
      let dependenciesInfo = '/* 此代碼需要以下依賴：\n';
      dependencies.forEach(dep => {
        dependenciesInfo += ` - ${dep}\n`;
      });
      dependenciesInfo += '*/';
      
      dependenciesContainer.textContent = dependenciesInfo;
    } else {
      dependenciesContainer.textContent = '';
    }
    
    // 更新預覽框架的腳本
    const previewFrame = document.getElementById('previewFrame');
    if (previewFrame && previewFrame.contentDocument) {
      let scriptElement = previewFrame.contentDocument.getElementById('customJsScript');
      
      if (!scriptElement) {
        scriptElement = previewFrame.contentDocument.createElement('script');
        scriptElement.id = 'customJsScript';
        previewFrame.contentDocument.body.appendChild(scriptElement);
      }
      
      // 先添加依賴
      if (dependencies.has('jquery') && !previewFrame.contentDocument.querySelector('script[src*="jquery"]')) {
        const jqueryScript = previewFrame.contentDocument.createElement('script');
        jqueryScript.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
        previewFrame.contentDocument.head.appendChild(jqueryScript);
      }
      
      // 延遲添加自定義腳本，確保依賴已加載
      setTimeout(() => {
        scriptElement.textContent = jsCode;
      }, 100);
    }
  }

  function initDragDropBuilder() {
    // 檢查必要的DOM元素
    const elementPalette = document.getElementById('elementPalette');
    const pageCanvas = document.getElementById('pageCanvas');
    const propertiesPanel = document.getElementById('propertiesPanel');
    
    if (!elementPalette || !pageCanvas || !propertiesPanel) {
      console.warn('找不到拖放排版所需的DOM元素');
      return;
    }
    
    // 元素庫定義
    const elements = [
      { type: 'header', name: '標題區塊', icon: '📝', defaultContent: '標題文字' },
      { type: 'paragraph', name: '段落文字', icon: '📄', defaultContent: '段落內容' },
      { type: 'image', name: '圖片', icon: '🖼️', defaultContent: 'https://via.placeholder.com/400x300' },
      { type: 'button', name: '按鈕', icon: '🔘', defaultContent: '按鈕文字' },
      { type: 'form', name: '表單', icon: '📋', defaultContent: '' },
      { type: 'section', name: '區塊', icon: '📦', defaultContent: '' },
      { type: 'divider', name: '分隔線', icon: '➖', defaultContent: '' },
      { type: 'list', name: '列表', icon: '📋', defaultContent: '' },
      { type: 'quote', name: '引用區塊', icon: '💬', defaultContent: '引用內容' },
      { type: 'card', name: '卡片', icon: '🗂️', defaultContent: '' }
    ];
    
    // 創建元素庫項目
    elements.forEach(element => {
      const item = document.createElement('div');
      item.className = 'element-item';
      item.draggable = true;
      item.dataset.elementType = element.type;
      item.dataset.defaultContent = element.defaultContent;
      item.innerHTML = `
        <div class="element-icon">${element.icon}</div>
        <span class="element-name">${element.name}</span>
      `;
      
      // 綁定拖拽事件
      item.addEventListener('dragstart', handleDragStart);
      
      elementPalette.appendChild(item);
    });
    
    // 設置畫布拖放區域
    pageCanvas.addEventListener('dragover', handleDragOver);
    pageCanvas.addEventListener('drop', handleDrop);
    pageCanvas.addEventListener('dragleave', handleDragLeave);
    
    // 拖拽開始處理
    function handleDragStart(e) {
      const elementType = e.target.dataset.elementType;
      const defaultContent = e.target.dataset.defaultContent;
      
      e.dataTransfer.setData('text/plain', JSON.stringify({
        type: elementType,
        content: defaultContent
      }));
      e.dataTransfer.effectAllowed = 'copy';
      
      // 添加拖拽時的視覺反饋
      e.target.classList.add('dragging');
    }
    
    // 拖拽經過處理
    function handleDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      pageCanvas.classList.add('drag-over');
    }
    
    // 拖拽離開處理
    pageCanvas.addEventListener('dragleave', function(e) {
      e.preventDefault();
      if (e.target === pageCanvas) {
        pageCanvas.classList.remove('drag-over');
      }
    });
    
    // 放置處理
    function handleDrop(e) {
      e.preventDefault();
      const elementType = e.dataTransfer.getData('text/plain');
      
      // 根據元素類型創建對應的DOM元素
      const element = createElementByType(elementType);
      
      // 計算放置位置（相對於畫布的左上角）
      const rect = pageCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 確保元素不會超出畫布邊界
      const maxX = rect.width - element.offsetWidth;
      const maxY = rect.height - element.offsetHeight;
      
      element.style.position = 'absolute';
      element.style.left = Math.min(Math.max(0, x), maxX) + 'px';
      element.style.top = Math.min(Math.max(0, y), maxY) + 'px';
      
      // 添加到畫布
      pageCanvas.appendChild(element);
      
      // 選中元素並顯示屬性面板
      selectElement(element);
      
      // 添加拖動時的視覺反饋
      pageCanvas.classList.remove('drag-over');
      
      // 觸發自定義事件，通知元素已添加
      const event = new CustomEvent('elementAdded', {
        detail: { element, type: elementType }
      });
      pageCanvas.dispatchEvent(event);
    }
    
    // 根據類型創建元素
    function createElementByType(type) {
      let element;
      
      switch(type) {
        case 'header':
          element = document.createElement('h2');
          element.textContent = '標題文字';
          element.className = 'editable-element';
          break;
        
        case 'paragraph':
          element = document.createElement('p');
          element.textContent = '這是一段示例文字。點擊編輯此文字內容。';
          element.className = 'editable-element';
          break;
        
        case 'image':
          element = document.createElement('img');
          element.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMjAwIDE1MCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzY2NiI+5Zu+54mH5L2N572u5ZyW5ZOB5Zu+5qGI6LyJ5YWlPC90ZXh0Pjwvc3ZnPg==';
          element.alt = '示例圖片';
          element.className = 'editable-element';
          element.style.maxWidth = '200px';
          break;
        
        case 'button':
          element = document.createElement('button');
          element.textContent = '按鈕';
          element.className = 'editable-element';
          break;
        
        case 'form':
          element = document.createElement('form');
          element.className = 'editable-element';
          element.innerHTML = `
            <div class="form-group">
              <label for="name">姓名：</label>
              <input type="text" id="name" name="name">
            </div>
            <div class="form-group">
              <label for="email">電子郵件：</label>
              <input type="email" id="email" name="email">
            </div>
            <button type="submit">提交</button>
          `;
          element.style.width = '300px';
          break;
        
        case 'section':
          element = document.createElement('section');
          element.className = 'editable-element';
          element.style.width = '300px';
          element.style.height = '150px';
          element.style.border = '1px dashed #ccc';
          element.style.display = 'flex';
          element.style.alignItems = 'center';
          element.style.justifyContent = 'center';
          element.textContent = '內容區塊';
          break;
        
        case 'divider':
          element = document.createElement('hr');
          element.className = 'editable-element';
          element.style.width = '100%';
          element.style.margin = '20px 0';
          break;
        
        case 'list':
          element = document.createElement('ul');
          element.className = 'editable-element';
          element.innerHTML = `
            <li>列表項目 1</li>
            <li>列表項目 2</li>
            <li>列表項目 3</li>
          `;
          break;
        
        case 'quote':
          element = document.createElement('blockquote');
          element.className = 'editable-element';
          element.style.borderLeft = '4px solid #ccc';
          element.style.padding = '10px 20px';
          element.style.margin = '10px 0';
          element.style.backgroundColor = '#f9f9f9';
          element.textContent = '這是一段引用文字';
          break;
        
        case 'card':
          element = document.createElement('div');
          element.className = 'editable-element card';
          element.style.width = '300px';
          element.style.border = '1px solid #ddd';
          element.style.borderRadius = '5px';
          element.style.padding = '15px';
          element.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
          element.innerHTML = `
            <h3>卡片標題</h3>
            <p>卡片內容描述文字</p>
            <button>了解更多</button>
          `;
          break;
        
        default:
          element = document.createElement('div');
          element.textContent = '未知元素';
          element.className = 'editable-element';
      }
      
      // 添加雙擊編輯功能
      element.addEventListener('dblclick', function(e) {
        if (element.tagName !== 'IMG' && element.tagName !== 'FORM') {
          const text = prompt('編輯內容:', this.textContent);
          if (text !== null) {
            this.textContent = text;
          }
        }
      });
      
      // 添加選中和移動事件
      element.addEventListener('click', function(e) {
        e.stopPropagation();
        selectElement(this);
      });
      
      // 使元素可移動
      makeElementDraggable(element);
      
      return element;
    }
    
    // 讓元素可以拖動
    function makeElementDraggable(element) {
      element.addEventListener('mousedown', startDragging);
      
      function startDragging(e) {
        if (e.target !== element) return;
        
        e.preventDefault();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = parseInt(element.style.left) || 0;
        const startTop = parseInt(element.style.top) || 0;
        
        function dragMove(e) {
          const newLeft = startLeft + (e.clientX - startX);
          const newTop = startTop + (e.clientY - startY);
          
          element.style.left = newLeft + 'px';
          element.style.top = newTop + 'px';
        }
        
        function dragEnd() {
          document.removeEventListener('mousemove', dragMove);
          document.removeEventListener('mouseup', dragEnd);
        }
        
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
      }
    }
    
    // 選中元素並顯示屬性面板
    function selectElement(element) {
      // 移除之前的選中狀態
      document.querySelectorAll('.editable-element.selected').forEach(el => {
        el.classList.remove('selected');
      });
      
      // 添加選中狀態
      element.classList.add('selected');
      
      // 顯示屬性面板
      showPropertiesPanel(element);
    }
    
    // 取消選中事件
    pageCanvas.addEventListener('click', function(e) {
      if (e.target === pageCanvas) {
        document.querySelectorAll('.editable-element.selected').forEach(el => {
          el.classList.remove('selected');
        });
        propertiesPanel.innerHTML = '<p>未選中任何元素</p>';
      }
    });
    
    // 顯示屬性面板
    function showPropertiesPanel(element) {
      propertiesPanel.innerHTML = '';
      
      // 標題
      const panelTitle = document.createElement('h4');
      panelTitle.textContent = '元素屬性';
      propertiesPanel.appendChild(panelTitle);
      
      // 元素類型
      const elementType = document.createElement('div');
      elementType.innerHTML = `<strong>類型:</strong> ${element.tagName.toLowerCase()}`;
      propertiesPanel.appendChild(elementType);
      
      // 創建通用樣式控制
      createStyleControls(propertiesPanel, element);
      
      // 根據元素類型創建特定屬性控制
      if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'H4' || element.tagName === 'H5' || element.tagName === 'H6' || element.tagName === 'P' || element.tagName === 'BLOCKQUOTE') {
        createTextControls(propertiesPanel, element);
      } else if (element.tagName === 'IMG') {
        createImageControls(propertiesPanel, element);
      } else if (element.tagName === 'BUTTON') {
        createButtonControls(propertiesPanel, element);
      }
      
      // 添加刪除按鈕
      const deleteButton = document.createElement('button');
      deleteButton.textContent = '刪除元素';
      deleteButton.className = 'delete-element-btn';
      deleteButton.addEventListener('click', function() {
        element.remove();
        propertiesPanel.innerHTML = '<p>元素已刪除</p>';
      });
      
      propertiesPanel.appendChild(deleteButton);
    }
    
    // 創建樣式控制
    function createStyleControls(panel, element) {
      const styleControls = document.createElement('div');
      styleControls.className = 'style-controls';
      styleControls.innerHTML = '<h4>基本樣式</h4>';
      
      // 寬度控制
      const widthControl = document.createElement('div');
      widthControl.className = 'control-group';
      widthControl.innerHTML = `
        <label>寬度:</label>
        <input type="text" value="${element.style.width || 'auto'}" placeholder="auto">
      `;
      widthControl.querySelector('input').addEventListener('change', function() {
        element.style.width = this.value;
      });
      
      // 高度控制
      const heightControl = document.createElement('div');
      heightControl.className = 'control-group';
      heightControl.innerHTML = `
        <label>高度:</label>
        <input type="text" value="${element.style.height || 'auto'}" placeholder="auto">
      `;
      heightControl.querySelector('input').addEventListener('change', function() {
        element.style.height = this.value;
      });
      
      // 邊距控制
      const marginControl = document.createElement('div');
      marginControl.className = 'control-group';
      marginControl.innerHTML = `
        <label>外邊距:</label>
        <input type="text" value="${element.style.margin || '0'}" placeholder="0">
      `;
      marginControl.querySelector('input').addEventListener('change', function() {
        element.style.margin = this.value;
      });
      
      // 內邊距控制
      const paddingControl = document.createElement('div');
      paddingControl.className = 'control-group';
      paddingControl.innerHTML = `
        <label>內邊距:</label>
        <input type="text" value="${element.style.padding || '0'}" placeholder="0">
      `;
      paddingControl.querySelector('input').addEventListener('change', function() {
        element.style.padding = this.value;
      });
      
      // 背景色控制
      const bgColorControl = document.createElement('div');
      bgColorControl.className = 'control-group';
      bgColorControl.innerHTML = `
        <label>背景色:</label>
        <input type="color" value="${element.style.backgroundColor ? rgbToHex(element.style.backgroundColor) : '#ffffff'}">
      `;
      bgColorControl.querySelector('input').addEventListener('change', function() {
        element.style.backgroundColor = this.value;
      });
      
      // 文字色控制
      const textColorControl = document.createElement('div');
      textColorControl.className = 'control-group';
      textColorControl.innerHTML = `
        <label>文字色:</label>
        <input type="color" value="${element.style.color ? rgbToHex(element.style.color) : '#000000'}">
      `;
      textColorControl.querySelector('input').addEventListener('change', function() {
        element.style.color = this.value;
      });
      
      // 邊框控制
      const borderControl = document.createElement('div');
      borderControl.className = 'control-group';
      borderControl.innerHTML = `
        <label>邊框:</label>
        <input type="text" value="${element.style.border || 'none'}" placeholder="1px solid #000">
      `;
      borderControl.querySelector('input').addEventListener('change', function() {
        element.style.border = this.value;
      });
      
      // 添加到面板
      styleControls.appendChild(widthControl);
      styleControls.appendChild(heightControl);
      styleControls.appendChild(marginControl);
      styleControls.appendChild(paddingControl);
      styleControls.appendChild(bgColorControl);
      styleControls.appendChild(textColorControl);
      styleControls.appendChild(borderControl);
      
      panel.appendChild(styleControls);
    }
    
    // 創建文字控制
    function createTextControls(panel, element) {
      const textControls = document.createElement('div');
      textControls.className = 'text-controls';
      textControls.innerHTML = '<h4>文字樣式</h4>';
      
      // 文字內容
      const textContent = document.createElement('div');
      textContent.className = 'control-group';
      textContent.innerHTML = `
        <label>文字內容:</label>
        <textarea rows="3">${element.textContent}</textarea>
      `;
      textContent.querySelector('textarea').addEventListener('change', function() {
        element.textContent = this.value;
      });
      
      // 字體大小
      const fontSize = document.createElement('div');
      fontSize.className = 'control-group';
      fontSize.innerHTML = `
        <label>字體大小:</label>
        <input type="text" value="${element.style.fontSize || 'inherit'}" placeholder="16px">
      `;
      fontSize.querySelector('input').addEventListener('change', function() {
        element.style.fontSize = this.value;
      });
      
      // 字體粗細
      const fontWeight = document.createElement('div');
      fontWeight.className = 'control-group';
      fontWeight.innerHTML = `
        <label>字體粗細:</label>
        <select>
          <option value="normal" ${element.style.fontWeight === 'normal' ? 'selected' : ''}>正常</option>
          <option value="bold" ${element.style.fontWeight === 'bold' ? 'selected' : ''}>粗體</option>
          <option value="lighter" ${element.style.fontWeight === 'lighter' ? 'selected' : ''}>細體</option>
        </select>
      `;
      fontWeight.querySelector('select').addEventListener('change', function() {
        element.style.fontWeight = this.value;
      });
      
      // 文字對齊
      const textAlign = document.createElement('div');
      textAlign.className = 'control-group';
      textAlign.innerHTML = `
        <label>文字對齊:</label>
        <select>
          <option value="left" ${element.style.textAlign === 'left' ? 'selected' : ''}>靠左</option>
          <option value="center" ${element.style.textAlign === 'center' ? 'selected' : ''}>置中</option>
          <option value="right" ${element.style.textAlign === 'right' ? 'selected' : ''}>靠右</option>
          <option value="justify" ${element.style.textAlign === 'justify' ? 'selected' : ''}>兩端對齊</option>
        </select>
      `;
      textAlign.querySelector('select').addEventListener('change', function() {
        element.style.textAlign = this.value;
      });
      
      // 添加到面板
      textControls.appendChild(textContent);
      textControls.appendChild(fontSize);
      textControls.appendChild(fontWeight);
      textControls.appendChild(textAlign);
      
      panel.appendChild(textControls);
    }
    
    // 創建圖片控制
    function createImageControls(panel, element) {
      const imageControls = document.createElement('div');
      imageControls.className = 'image-controls';
      imageControls.innerHTML = '<h4>圖片屬性</h4>';
      
      // 圖片URL
      const imageUrl = document.createElement('div');
      imageUrl.className = 'control-group';
      imageUrl.innerHTML = `
        <label>圖片URL:</label>
        <input type="text" value="${element.src}" placeholder="https://example.com/image.jpg">
      `;
      imageUrl.querySelector('input').addEventListener('change', function() {
        element.src = this.value;
      });
      
      // 替代文字
      const altText = document.createElement('div');
      altText.className = 'control-group';
      altText.innerHTML = `
        <label>替代文字:</label>
        <input type="text" value="${element.alt}" placeholder="圖片描述">
      `;
      altText.querySelector('input').addEventListener('change', function() {
        element.alt = this.value;
      });
      
      // 邊框圓角
      const borderRadius = document.createElement('div');
      borderRadius.className = 'control-group';
      borderRadius.innerHTML = `
        <label>邊框圓角:</label>
        <input type="text" value="${element.style.borderRadius || '0'}" placeholder="0">
      `;
      borderRadius.querySelector('input').addEventListener('change', function() {
        element.style.borderRadius = this.value;
      });
      
      // 添加到面板
      imageControls.appendChild(imageUrl);
      imageControls.appendChild(altText);
      imageControls.appendChild(borderRadius);
      
      panel.appendChild(imageControls);
    }
    
    // 創建按鈕控制
    function createButtonControls(panel, element) {
      const buttonControls = document.createElement('div');
      buttonControls.className = 'button-controls';
      buttonControls.innerHTML = '<h4>按鈕屬性</h4>';
      
      // 按鈕文字
      const buttonText = document.createElement('div');
      buttonText.className = 'control-group';
      buttonText.innerHTML = `
        <label>按鈕文字:</label>
        <input type="text" value="${element.textContent}" placeholder="按鈕">
      `;
      buttonText.querySelector('input').addEventListener('change', function() {
        element.textContent = this.value;
      });
      
      // 按鈕類型
      const buttonType = document.createElement('div');
      buttonType.className = 'control-group';
      buttonType.innerHTML = `
        <label>按鈕類型:</label>
        <select>
          <option value="button" ${element.type === 'button' ? 'selected' : ''}>一般按鈕</option>
          <option value="submit" ${element.type === 'submit' ? 'selected' : ''}>提交按鈕</option>
          <option value="reset" ${element.type === 'reset' ? 'selected' : ''}>重置按鈕</option>
        </select>
      `;
      buttonType.querySelector('select').addEventListener('change', function() {
        element.type = this.value;
      });
      
      // 圓角
      const borderRadius = document.createElement('div');
      borderRadius.className = 'control-group';
      borderRadius.innerHTML = `
        <label>按鈕圓角:</label>
        <input type="text" value="${element.style.borderRadius || '0'}" placeholder="4px">
      `;
      borderRadius.querySelector('input').addEventListener('change', function() {
        element.style.borderRadius = this.value;
      });
      
      // 添加到面板
      buttonControls.appendChild(buttonText);
      buttonControls.appendChild(buttonType);
      buttonControls.appendChild(borderRadius);
      
      panel.appendChild(buttonControls);
    }
    
    // RGB 顏色值轉 HEX
    function rgbToHex(rgb) {
      if (!rgb || rgb === 'transparent') return '#ffffff';
      
      // 檢查是否已經是十六進制格式
      if (rgb.startsWith('#')) return rgb;
      
      // 從 rgb(r, g, b) 格式解析
      const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
      if (!match) return '#ffffff';
      
      function toHex(num) {
        const hex = parseInt(num).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }
      
      return `#${toHex(match[1])}${toHex(match[2])}${toHex(match[3])}`;
    }
  }