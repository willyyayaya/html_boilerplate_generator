// 頁面加載後運行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化頁面和事件
    initUI();
    bindEvents();
    
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
    
    // 是否使用快速設置
    const quickSetup = document.getElementById('quickSetup').checked;
    
    // 獲取基本元素選擇
    const includeDoctype = quickSetup || document.getElementById('includeDoctype').checked;
    const includeHtmlStructure = quickSetup || document.getElementById('includeHtmlStructure').checked;
    const includeMeta = quickSetup || document.getElementById('includeMeta').checked;
    const includeTitle = quickSetup || document.getElementById('includeTitle').checked;
    const includeCssLink = quickSetup || document.getElementById('includeCssLink').checked;
    const includeJsScript = quickSetup || document.getElementById('includeJsScript').checked;
    
    // 獲取自定義內容
    const pageTitle = document.getElementById('pageTitle').value || '我的網站';
    const cssFile = document.getElementById('cssFile').value || 'style.css';
    const jsFile = document.getElementById('jsFile').value || 'script.js';
    const language = document.getElementById('language').value || 'zh-Hant';
    const charset = document.getElementById('charset').value || 'UTF-8';
    const viewport = document.getElementById('viewport').value || 'width=device-width, initial-scale=1.0';
    
    // 獲取進階設置
    const includeHeader = document.getElementById('includeHeader').checked;
    const includeNav = document.getElementById('includeNav').checked;
    const includeMain = document.getElementById('includeMain').checked;
    const includeAside = document.getElementById('includeAside').checked;
    const includeFooter = document.getElementById('includeFooter').checked;
    
    // 獲取Meta標籤
    const description = document.getElementById('description').value;
    const keywords = document.getElementById('keywords').value;
    const author = document.getElementById('author').value;
    
    // 新增功能: 社交媒體Meta標籤
    const includeSocialMeta = document.getElementById('includeSocialMeta') && document.getElementById('includeSocialMeta').checked;
    const ogTitle = document.getElementById('ogTitle') ? document.getElementById('ogTitle').value : '';
    const ogDescription = document.getElementById('ogDescription') ? document.getElementById('ogDescription').value : '';
    const ogImage = document.getElementById('ogImage') ? document.getElementById('ogImage').value : '';
    
    // 新增功能: 主題色彩
    const includeThemeColor = document.getElementById('includeThemeColor') && document.getElementById('includeThemeColor').checked;
    const themeColor = document.getElementById('themeColor') ? document.getElementById('themeColor').value : '#4CAF50';
    
    // 獲取CSS框架
    const cssFramework = document.querySelector('input[name="cssFramework"]:checked').value;
    
    // 新增功能: Modern Normalize CSS
    const includeNormalize = document.getElementById('includeNormalize') && document.getElementById('includeNormalize').checked;
    
    // 新增功能: jQuery
    const includeJQuery = document.getElementById('includeJQuery') && document.getElementById('includeJQuery').checked;
    
    // 獲取佈局模板
    const layoutTemplate = document.querySelector('input[name="layoutTemplate"]:checked').value;
    
    // 獲取組件
    const includeHero = document.getElementById('includeHero').checked;
    const includeNavbar = document.getElementById('includeNavbar').checked;
    const includeCard = document.getElementById('includeCard').checked;
    const includeForm = document.getElementById('includeForm').checked;
    
    // 新增功能: Bootstrap導航欄
    const includeBootstrapNavbar = document.getElementById('includeBootstrapNavbar') && document.getElementById('includeBootstrapNavbar').checked;
    
    // 新增功能: 假文本和圖片
    const includeDummyText = document.getElementById('includeDummyText') && document.getElementById('includeDummyText').checked;
    const includeDummyImages = document.getElementById('includeDummyImages') && document.getElementById('includeDummyImages').checked;
    
    // 新增功能: 表格、輪播和折疊面板
    const includeTable = document.getElementById('includeTable') && document.getElementById('includeTable').checked;
    const includeCarousel = document.getElementById('includeCarousel') && document.getElementById('includeCarousel').checked;
    const includeAccordion = document.getElementById('includeAccordion') && document.getElementById('includeAccordion').checked;
    
    // 新增功能: Web App Manifest
    const includeManifest = document.getElementById('includeManifest') && document.getElementById('includeManifest').checked;
    const appName = document.getElementById('appName') ? document.getElementById('appName').value : pageTitle;
    const manifestColor = document.getElementById('manifestColor') ? document.getElementById('manifestColor').value : '#4CAF50';
    
    // 新增功能: Favicons
    const includeFavicons = document.getElementById('includeFavicons') && document.getElementById('includeFavicons').checked;
    
    // 新增功能: Google Analytics
    const includeAnalytics = document.getElementById('includeAnalytics') && document.getElementById('includeAnalytics').checked;
    const gaId = document.getElementById('gaId') ? document.getElementById('gaId').value : '';
    
    // 新增功能: 頁面特效
    const includeFadeIn = document.getElementById('includeFadeIn') && document.getElementById('includeFadeIn').checked;
    const includeFadeInAfterLoad = document.getElementById('includeFadeInAfterLoad') && document.getElementById('includeFadeInAfterLoad').checked;
    const includeCookieNotice = document.getElementById('includeCookieNotice') && document.getElementById('includeCookieNotice').checked;
    const includeAnnouncementBar = document.getElementById('includeAnnouncementBar') && document.getElementById('includeAnnouncementBar').checked;
    const announcementText = document.getElementById('announcementText') ? document.getElementById('announcementText').value : '重要公告：這是一則公告訊息';
    const includeUpgradeMessage = document.getElementById('includeUpgradeMessage') && document.getElementById('includeUpgradeMessage').checked;
    const includeBasicHTML5Tags = document.getElementById('includeBasicHTML5Tags') && document.getElementById('includeBasicHTML5Tags').checked;
    const includeTrollface = document.getElementById('includeTrollface') && document.getElementById('includeTrollface').checked;
    const customEasterEggImage = document.getElementById('customEasterEggImage') ? document.getElementById('customEasterEggImage').value : '';
    const customEasterEggSequence = document.getElementById('customEasterEggSequence') ? document.getElementById('customEasterEggSequence').value : '';
    
    // 使用數組儲存HTML片段
    const htmlParts = [];
    
    // Doctype
    if (includeDoctype) {
      htmlParts.push('<!DOCTYPE html>');
    }
    
    // HTML結構
    if (includeHtmlStructure) {
      htmlParts.push('<html' + (language ? ' lang="' + language + '"' : '') + '>');
      htmlParts.push('<head>');
      
      // Meta標籤
      if (includeMeta) {
        htmlParts.push('  <meta charset="' + charset + '">');
        htmlParts.push('  <meta name="viewport" content="' + viewport + '">');
        
        // 額外的Meta標籤
        if (description) {
          htmlParts.push('  <meta name="description" content="' + description + '">');
        }
        if (keywords) {
          htmlParts.push('  <meta name="keywords" content="' + keywords + '">');
        }
        if (author) {
          htmlParts.push('  <meta name="author" content="' + author + '">');
        }
        
        // 新增功能: 社交媒體Meta標籤
        if (includeSocialMeta) {
          htmlParts.push('  <!-- Open Graph / Facebook -->');
          htmlParts.push('  <meta property="og:type" content="website">');
          htmlParts.push('  <meta property="og:url" content="https://example.com/">');
          htmlParts.push('  <meta property="og:title" content="' + (ogTitle || pageTitle) + '">');
          htmlParts.push('  <meta property="og:description" content="' + (ogDescription || description) + '">');
          if (ogImage) {
            htmlParts.push('  <meta property="og:image" content="' + ogImage + '">');
          }
          
          htmlParts.push('  <!-- Twitter -->');
          htmlParts.push('  <meta property="twitter:card" content="summary_large_image">');
          htmlParts.push('  <meta property="twitter:url" content="https://example.com/">');
          htmlParts.push('  <meta property="twitter:title" content="' + (ogTitle || pageTitle) + '">');
          htmlParts.push('  <meta property="twitter:description" content="' + (ogDescription || description) + '">');
          if (ogImage) {
            htmlParts.push('  <meta property="twitter:image" content="' + ogImage + '">');
          }
        }
        
        // 新增功能: 主題色彩
        if (includeThemeColor) {
          htmlParts.push('  <meta name="theme-color" content="' + themeColor + '">');
        }
      }
      
      // 新增功能: Web App Manifest
      if (includeManifest) {
        htmlParts.push('  <link rel="manifest" href="manifest.json">');
        
        // 生成manifest.json文件內容的註釋
        htmlParts.push('  <!-- 建議創建以下manifest.json文件:');
        htmlParts.push('  {');
        htmlParts.push('    "name": "' + appName + '",');
        htmlParts.push('    "short_name": "' + appName + '",');
        htmlParts.push('    "start_url": ".",');
        htmlParts.push('    "display": "standalone",');
        htmlParts.push('    "background_color": "#ffffff",');
        htmlParts.push('    "theme_color": "' + manifestColor + '",');
        htmlParts.push('    "icons": [');
        htmlParts.push('      {');
        htmlParts.push('        "src": "icon-192x192.png",');
        htmlParts.push('        "sizes": "192x192",');
        htmlParts.push('        "type": "image/png"');
        htmlParts.push('      },');
        htmlParts.push('      {');
        htmlParts.push('        "src": "icon-512x512.png",');
        htmlParts.push('        "sizes": "512x512",');
        htmlParts.push('        "type": "image/png"');
        htmlParts.push('      }');
        htmlParts.push('    ]');
        htmlParts.push('  }');
        htmlParts.push('  -->');
      }
      
      // 新增功能: Favicons
      if (includeFavicons) {
        htmlParts.push('  <!-- Favicons -->');
        htmlParts.push('  <link rel="icon" href="favicon.ico">');
        htmlParts.push('  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">');
        htmlParts.push('  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">');
        htmlParts.push('  <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">');
        htmlParts.push('  <link rel="mask-icon" href="safari-pinned-tab.svg" color="' + themeColor + '">');
        htmlParts.push('  <meta name="msapplication-TileColor" content="' + themeColor + '">');
      }
      
      // 標題
      if (includeTitle) {
        htmlParts.push('  <title>' + pageTitle + '</title>');
      }
      
      // CSS框架
      if (cssFramework === 'bootstrap') {
        htmlParts.push('  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet">');
      } else if (cssFramework === 'tailwind') {
        htmlParts.push('  <script src="https://cdn.tailwindcss.com"></script>');
      }
      
      // 新增功能: Modern Normalize CSS
      if (includeNormalize) {
        htmlParts.push('  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/modern-normalize@2.0.0/modern-normalize.min.css">');
      }
      
      // CSS連結
      if (includeCssLink && cssFile) {
        if (!cssFile.startsWith('http') && !cssFile.startsWith('//')) {
          htmlParts.push('  <!-- 注意: 以下樣式文件在預覽中可能不存在 -->');
          htmlParts.push('  <link rel="stylesheet" href="' + cssFile + '">');
        } else {
          htmlParts.push('  <link rel="stylesheet" href="' + cssFile + '">');
        }
      }
      
      // 新增功能: 頁面淡入效果CSS
      if (includeFadeIn || includeFadeInAfterLoad) {
        htmlParts.push('  <style id="fade-in-styles">');
        if (includeFadeIn) {
          htmlParts.push('    body {');
          htmlParts.push('      opacity: 0;');
          htmlParts.push('      transition: opacity 0.5s ease;');
          htmlParts.push('    }');
          htmlParts.push('    body.fade-in {');
          htmlParts.push('      opacity: 1;');
          htmlParts.push('    }');
        } else if (includeFadeInAfterLoad) {
          htmlParts.push('    body {');
          htmlParts.push('      opacity: 0;');
          htmlParts.push('    }');
          htmlParts.push('    body.loaded {');
          htmlParts.push('      opacity: 1;');
          htmlParts.push('      transition: opacity 0.8s ease;');
          htmlParts.push('    }');
        }
        htmlParts.push('  </style>');
      }
      
      // 添加基本樣式，確保預覽效果更好
      htmlParts.push('  <style>');
      htmlParts.push('    body {');
      htmlParts.push('      font-family: Arial, sans-serif;');
      htmlParts.push('      line-height: 1.6;');
      htmlParts.push('      margin: 0;');
      htmlParts.push('      padding: 20px;');
      htmlParts.push('    }');
      
      // 如果使用自定義布局而非框架，添加必要的樣式
      if (cssFramework === 'none') {
        if (layoutTemplate === 'two' || layoutTemplate === 'three') {
          htmlParts.push('    .container {');
          htmlParts.push('      max-width: 1200px;');
          htmlParts.push('      margin: 0 auto;');
          htmlParts.push('    }');
          htmlParts.push('    .row {');
          htmlParts.push('      display: flex;');
          htmlParts.push('      flex-wrap: wrap;');
          htmlParts.push('      margin: 0 -15px;');
          htmlParts.push('    }');
          
          if (layoutTemplate === 'two') {
            htmlParts.push('    .col-md-8 {');
            htmlParts.push('      flex: 0 0 66.666667%;');
            htmlParts.push('      max-width: 66.666667%;');
            htmlParts.push('      padding: 0 15px;');
            htmlParts.push('    }');
            htmlParts.push('    .col-md-4 {');
            htmlParts.push('      flex: 0 0 33.333333%;');
            htmlParts.push('      max-width: 33.333333%;');
            htmlParts.push('      padding: 0 15px;');
            htmlParts.push('    }');
          } else if (layoutTemplate === 'three') {
            htmlParts.push('    .col-md-3 {');
            htmlParts.push('      flex: 0 0 25%;');
            htmlParts.push('      max-width: 25%;');
            htmlParts.push('      padding: 0 15px;');
            htmlParts.push('    }');
            htmlParts.push('    .col-md-6 {');
            htmlParts.push('      flex: 0 0 50%;');
            htmlParts.push('      max-width: 50%;');
            htmlParts.push('      padding: 0 15px;');
            htmlParts.push('    }');
          }
        }
      }
      
      // 新增功能: 公告欄
      if (includeAnnouncementBar) {
        htmlParts.push('    .announcement-bar {');
        htmlParts.push('      background-color: #ff9800;');
        htmlParts.push('      color: white;');
        htmlParts.push('      text-align: center;');
        htmlParts.push('      padding: 10px;');
        htmlParts.push('      font-weight: bold;');
        htmlParts.push('    }');
      }
      
      // 新增功能: 舊瀏覽器升級提示
      if (includeUpgradeMessage) {
        htmlParts.push('    .browser-upgrade {');
        htmlParts.push('      background: #f44336;');
        htmlParts.push('      color: white;');
        htmlParts.push('      padding: 10px;');
        htmlParts.push('      text-align: center;');
        htmlParts.push('    }');
        htmlParts.push('    .browser-upgrade a {');
        htmlParts.push('      color: white;');
        htmlParts.push('      text-decoration: underline;');
        htmlParts.push('    }');
      }
      
      // 新增功能: Cookie通知
      if (includeCookieNotice) {
        htmlParts.push('    .cookie-notice {');
        htmlParts.push('      position: fixed;');
        htmlParts.push('      bottom: 0;');
        htmlParts.push('      left: 0;');
        htmlParts.push('      right: 0;');
        htmlParts.push('      background: rgba(0, 0, 0, 0.85);');
        htmlParts.push('      color: white;');
        htmlParts.push('      padding: 15px;');
        htmlParts.push('      text-align: center;');
        htmlParts.push('      z-index: 9999;');
        htmlParts.push('      display: none;');
        htmlParts.push('    }');
        htmlParts.push('    .cookie-notice button {');
        htmlParts.push('      background: white;');
        htmlParts.push('      color: black;');
        htmlParts.push('      border: none;');
        htmlParts.push('      padding: 8px 15px;');
        htmlParts.push('      margin-left: 10px;');
        htmlParts.push('      cursor: pointer;');
        htmlParts.push('      border-radius: 3px;');
        htmlParts.push('    }');
      }
      
      // 添加組件樣式
      if (includeHeader) {
        htmlParts.push('    header {');
        htmlParts.push('      background-color: #f8f9fa;');
        htmlParts.push('      padding: 20px;');
        htmlParts.push('      margin-bottom: 20px;');
        htmlParts.push('      border-radius: 5px;');
        htmlParts.push('    }');
      }
      
      if (includeNavbar && !includeBootstrapNavbar) {
        htmlParts.push('    nav ul {');
        htmlParts.push('      list-style: none;');
        htmlParts.push('      padding: 0;');
        htmlParts.push('      display: flex;');
        htmlParts.push('      gap: 20px;');
        htmlParts.push('    }');
        htmlParts.push('    nav li {');
        htmlParts.push('      margin: 0;');
        htmlParts.push('    }');
        htmlParts.push('    nav a {');
        htmlParts.push('      text-decoration: none;');
        htmlParts.push('      color: #0366d6;');
        htmlParts.push('    }');
      }
      
      if (includeHero) {
        htmlParts.push('    .hero {');
        htmlParts.push('      background-color: #e9ecef;');
        htmlParts.push('      padding: 40px 20px;');
        htmlParts.push('      text-align: center;');
        htmlParts.push('      border-radius: 5px;');
        htmlParts.push('      margin-bottom: 20px;');
        htmlParts.push('    }');
      }
      
      if (includeCard) {
        htmlParts.push('    .card {');
        htmlParts.push('      border: 1px solid #ddd;');
        htmlParts.push('      border-radius: 5px;');
        htmlParts.push('      padding: 20px;');
        htmlParts.push('      margin-bottom: 20px;');
        htmlParts.push('      box-shadow: 0 2px 4px rgba(0,0,0,0.1);');
        htmlParts.push('    }');
      }
      
      // 新增功能: 表格樣式
      if (includeTable) {
        htmlParts.push('    table {');
        htmlParts.push('      width: 100%;');
        htmlParts.push('      border-collapse: collapse;');
        htmlParts.push('      margin-bottom: 20px;');
        htmlParts.push('    }');
        htmlParts.push('    th, td {');
        htmlParts.push('      padding: 12px 15px;');
        htmlParts.push('      text-align: left;');
        htmlParts.push('      border-bottom: 1px solid #ddd;');
        htmlParts.push('    }');
        htmlParts.push('    th {');
        htmlParts.push('      background-color: #f8f9fa;');
        htmlParts.push('      font-weight: bold;');
        htmlParts.push('    }');
        htmlParts.push('    tr:hover {');
        htmlParts.push('      background-color: #f5f5f5;');
        htmlParts.push('    }');
        htmlParts.push('    @media screen and (max-width: 768px) {');
        htmlParts.push('      table {');
        htmlParts.push('        display: block;');
        htmlParts.push('        overflow-x: auto;');
        htmlParts.push('      }');
        htmlParts.push('    }');
      }
      
      if (includeForm) {
        htmlParts.push('    form {');
        htmlParts.push('      max-width: 500px;');
        htmlParts.push('    }');
        htmlParts.push('    .form-group {');
        htmlParts.push('      margin-bottom: 15px;');
        htmlParts.push('    }');
        htmlParts.push('    form label {');
        htmlParts.push('      display: block;');
        htmlParts.push('      margin-bottom: 5px;');
        htmlParts.push('    }');
        htmlParts.push('    form input, form textarea {');
        htmlParts.push('      width: 100%;');
        htmlParts.push('      padding: 8px;');
        htmlParts.push('      border: 1px solid #ddd;');
        htmlParts.push('      border-radius: 4px;');
        htmlParts.push('    }');
        htmlParts.push('    form button {');
        htmlParts.push('      background-color: #0366d6;');
        htmlParts.push('      color: white;');
        htmlParts.push('      border: none;');
        htmlParts.push('      padding: 10px 15px;');
        htmlParts.push('      border-radius: 4px;');
        htmlParts.push('      cursor: pointer;');
        htmlParts.push('    }');
      }
      
      if (includeFooter) {
        htmlParts.push('    footer {');
        htmlParts.push('      background-color: #f8f9fa;');
        htmlParts.push('      padding: 20px;');
        htmlParts.push('      margin-top: 20px;');
        htmlParts.push('      text-align: center;');
        htmlParts.push('      border-radius: 5px;');
        htmlParts.push('    }');
      }
      
      // 新增功能: 彩蛋(Trollface)的樣式
      if (includeTrollface) {
        const easterEggImageUrl = customEasterEggImage || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBkPSJNMTAwLDU1LjEsNjMuMiwzMS44Yy0uNy0uNC0xLjQtLjQtMi4xLDAtMS43LDEuNC0zLjUsMi44LTUuMiw0LjItMi43LDIuMi01LjQsNC40LTguMSw2LjYtMSwuOC0yLjUsMS0zLjYsMC02LjgtNi4yLTE0LjktNy42LTIyLjMtMy44LTYuOSwzLjYtMTAuMiw5LjMtMTAsOTQuOS0uNiw5LDUuOSwxNS43LDE0LjgsMTUuNC44LS41LDItMS41LDMuMy0xLjksMS4zLS4zLDIuNi0uMSwzLjguNSwyLjcsMS4zLDUuNCwyLjUsOC4xLDMuOC42LjMsMS4zLjMsMS45LDAsMy42LTEuOCw3LjMtMy42LDExLTUuNCw0LjUtMi4yLDktNC40LDEzLjQtNi42LjctLjMsMS40LS4zLDIuMSwwLDYuNCwyLjgsMTIuOCw1LjUsMTkuMiw4LjMuNy4zLDEuNC4zLDIuMSwwLDQtMS44LDgtMy42LDEyLTUuNCwxLjItLjUsMi40LS41LDMuNSwwLDIuNywxLjIsNS4zLDIuNCw4LDMuNi42LjMsMS4zLjIsMS45LDAsMy0xLjMsNi0yLjcsOS00LDEuMi0uNSwyLjUtLjQsMy43LjIsNS43LDIuNywxMS41LDUuNSwxNy4yLDguMi42LjMsMS4zLjMsMS45LDAsMy4zLTEuNSw2LjctMy4xLDEwLTQuNiwxLjEtLjUsMi4yLS41LDMuMywwLDMuMiwxLjYsNi40LDMuMSw5LjYsNC43LjYuMywyLDEuNiwzLjYsMiw2LjYsMS41LDEzLjItLjEsMTgtNC44QzE3OC4yLDEzNS4xLDE3OSwxMjUuOSwxNzcuMSwxMTNsLS45LTktLjgtOC0uNi02LS4yLTJhMTcuOCwxNy44LDAsMCwwLTYuMi0xMS42Yy0xLjctMS40LTMuMy0yLjItNi0yLjhsLTkuNy0yLjMtNy4yLTEuN2MtMS40LS4zLTEuOC0uOS0xLjUtMi4yLjQtMS45LDEtMy44LDEuMi01LjguMi0xLjYuNS0zLjEuNi00LjcuMS0yLTEuMi0zLjMtMy4yLTMuMS0yLjIuMi00LjQuNC02LjYuOC0uNy4xLTEuNC4yLTIuMS4zLTEuMS4yLTEuNy0uMi0yLjEtMS4zLS42LTEuOC0xLjItMy43LTEuNy01LjZzLTEtMy45LTEuNi01LjgtLjktMS40LTIuNC0xLjNjLTIuNS4xLTUuMS4yLTcuNi4xLTkuMi0uMi0xOC40LS41LTI3LjYtLjVzLTE4LjQtLjQtMjcuNi0xLjNjLTMuMi0uMy01LjcsLjgtNy44LDNsLTcuOCw4LjRjLS43LC44LTEuNCwxLjYtMiwzLjIsLjgsLjQsMS41LC42LDIuMiwuNywxLC4yLDIuMS4zLDIuOS40LDEuNiwuMSwyLjQsLjksMi42LDIuNSwuMiwyLjEsLjUsMi44LDIuNiwyLjYsMi4zLS4zLDQuNS0uNiw2LjgtLjksMSwuMywxLjgsLjgsMS43LDEuN3MtLjgsMi0xLjksMi43Wm0tNjAuMiw1LjljMi43LDAsNS0yLjMsNS01cy0yLjMtNS01LTUtNSwyLjMtNSw1LDIuMyw1LDUsWk0xNTQsMTUwbC00MS42LTE5LjktNDMuNy0yMC45Yy0uNy0uMy0xLjMtLjMtMS45LDAtNi40LDMuMi0xMi44LDYuMy0xOS4yLDkuNS0uNiwuMy0uNywxLTEuMiwxLjItMS4xLDEuMi0xLjQuOC4yLDEuOSw0LjMsMywxOS44LDguNCwzOC44LDE2LjUsMTYuNS43LDUzLjQsMi4zLDY4LS40LjgtLjQtLjEtMi4zLTEuNy0zcy0yLjEtLjgtMi0yLjJaIi8+PC9zdmc+";
        htmlParts.push('    .trollface-easter-egg {');
        htmlParts.push('      display: none;');
        htmlParts.push('      position: fixed;');
        htmlParts.push('      bottom: 20px;');
        htmlParts.push('      right: 20px;');
        htmlParts.push('      width: 100px;');
        htmlParts.push('      height: 100px;');
        htmlParts.push('      background-image: url("' + easterEggImageUrl + '");');
        htmlParts.push('      background-size: contain;');
        htmlParts.push('      z-index: 9999;');
        htmlParts.push('      cursor: pointer;');
        htmlParts.push('    }');
      }
      
      htmlParts.push('  </style>');
      
      htmlParts.push('</head>');
      
      // 新增功能: 為頁面淡入效果添加類名
      if (includeFadeIn) {
        htmlParts.push('<body class="fade-in">');
      } else if (includeFadeInAfterLoad) {
        htmlParts.push('<body>');
      } else {
        htmlParts.push('<body>');
      }
      
      // 新增功能: 舊瀏覽器升級提示
      if (includeUpgradeMessage) {
        htmlParts.push('  <!--[if lt IE 11]>');
        htmlParts.push('    <div class="browser-upgrade">');
        htmlParts.push('      <p>您正在使用<strong>過時的</strong>瀏覽器。請<a href="https://browsehappy.com/">升級您的瀏覽器</a>以獲得更好的體驗。</p>');
        htmlParts.push('    </div>');
        htmlParts.push('  <![endif]-->');
      }
      
      // 新增功能: 公告欄
      if (includeAnnouncementBar) {
        htmlParts.push('  <div class="announcement-bar">');
        htmlParts.push('    ' + announcementText);
        htmlParts.push('  </div>');
      }
      
      // 添加Header區域
      if (includeHeader) {
        htmlParts.push('  <header>');
        
        // 添加導航欄
        if (includeNavbar) {
          if (includeBootstrapNavbar && cssFramework === 'bootstrap') {
            // Bootstrap導航欄
            htmlParts.push('    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">');
            htmlParts.push('      <div class="container-fluid">');
            htmlParts.push('        <a class="navbar-brand" href="#">' + pageTitle + '</a>');
            htmlParts.push('        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">');
            htmlParts.push('          <span class="navbar-toggler-icon"></span>');
            htmlParts.push('        </button>');
            htmlParts.push('        <div class="collapse navbar-collapse" id="navbarNav">');
            htmlParts.push('          <ul class="navbar-nav">');
            htmlParts.push('            <li class="nav-item">');
            htmlParts.push('              <a class="nav-link active" aria-current="page" href="#">首頁</a>');
            htmlParts.push('            </li>');
            htmlParts.push('            <li class="nav-item">');
            htmlParts.push('              <a class="nav-link" href="#">關於我們</a>');
            htmlParts.push('            </li>');
            htmlParts.push('            <li class="nav-item">');
            htmlParts.push('              <a class="nav-link" href="#">服務</a>');
            htmlParts.push('            </li>');
            htmlParts.push('            <li class="nav-item">');
            htmlParts.push('              <a class="nav-link" href="#">聯絡我們</a>');
            htmlParts.push('            </li>');
            htmlParts.push('          </ul>');
            htmlParts.push('        </div>');
            htmlParts.push('      </div>');
            htmlParts.push('    </nav>');
          } else {
            // 一般導航欄
            htmlParts.push('    <nav>');
            htmlParts.push('      <ul>');
            htmlParts.push('        <li><a href="#">首頁</a></li>');
            htmlParts.push('        <li><a href="#">關於我們</a></li>');
            htmlParts.push('        <li><a href="#">服務</a></li>');
            htmlParts.push('        <li><a href="#">聯絡我們</a></li>');
            htmlParts.push('      </ul>');
            htmlParts.push('    </nav>');
          }
        }
        
        // 添加Hero區塊
        if (includeHero) {
          htmlParts.push('    <div class="hero">');
          htmlParts.push('      <h1>' + pageTitle + '</h1>');
          htmlParts.push('      <p>歡迎來到我的網站</p>');
          htmlParts.push('    </div>');
        }
        
        htmlParts.push('  </header>');
      }
      
      // 根據佈局模板添加內容
      if (layoutTemplate === 'single') {
        // 單欄佈局
        if (includeMain) {
          htmlParts.push('  <main class="' + (cssFramework === 'bootstrap' ? 'container' : '') + '">');
          htmlParts.push('    <section>');
          htmlParts.push('      <h2>歡迎來到' + pageTitle + '</h2>');
          
          // 新增功能: 假文本
          if (includeDummyText) {
            htmlParts.push('      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget nunc lobortis mattis aliquam faucibus. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>');
            htmlParts.push('      <p>Proin eget tortor risus. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Proin eget tortor risus. Cras ultricies ligula sed magna dictum porta. Pellentesque in ipsum id orci porta dapibus.</p>');
          } else {
            htmlParts.push('      <p>這是網站的主要內容區域。</p>');
          }
          
          // 新增功能: 基本HTML5標籤展示
          if (includeBasicHTML5Tags) {
            htmlParts.push('      <div class="html5-tags-demo">');
            htmlParts.push('        <h3>HTML5 語義化標籤示例</h3>');
            htmlParts.push('        <article>');
            htmlParts.push('          <h4>文章標題</h4>');
            htmlParts.push('          <p>這是一個 <mark>article</mark> 元素，用於表示獨立的內容區塊。</p>');
            htmlParts.push('          <figure>');
            htmlParts.push('            <figcaption>圖表說明 (figcaption 元素)</figcaption>');
            htmlParts.push('            <p>這是一個 <mark>figure</mark> 元素的內容。</p>');
            htmlParts.push('          </figure>');
            htmlParts.push('        </article>');
            htmlParts.push('        <details>');
            htmlParts.push('          <summary>詳細資訊 (點擊展開)</summary>');
            htmlParts.push('          <p>這是使用 details 和 summary 元素創建的可展開內容。</p>');
            htmlParts.push('        </details>');
            htmlParts.push('        <p>其他語義化元素還包括: <mark>section</mark>, <mark>nav</mark>, <mark>aside</mark>, <mark>header</mark>, <mark>footer</mark> 等。</p>');
            htmlParts.push('      </div>');
          }
          
          // 新增功能: 表格
          if (includeTable) {
            htmlParts.push('      <h3>資料表格</h3>');
            htmlParts.push('      <table>');
            htmlParts.push('        <thead>');
            htmlParts.push('          <tr>');
            htmlParts.push('            <th>#</th>');
            htmlParts.push('            <th>姓名</th>');
            htmlParts.push('            <th>電子郵件</th>');
            htmlParts.push('            <th>角色</th>');
            htmlParts.push('          </tr>');
            htmlParts.push('        </thead>');
            htmlParts.push('        <tbody>');
            htmlParts.push('          <tr>');
            htmlParts.push('            <td>1</td>');
            htmlParts.push('            <td>王小明</td>');
            htmlParts.push('            <td>ming@example.com</td>');
            htmlParts.push('            <td>管理員</td>');
            htmlParts.push('          </tr>');
            htmlParts.push('          <tr>');
            htmlParts.push('            <td>2</td>');
            htmlParts.push('            <td>李小華</td>');
            htmlParts.push('            <td>hua@example.com</td>');
            htmlParts.push('            <td>編輯</td>');
            htmlParts.push('          </tr>');
            htmlParts.push('          <tr>');
            htmlParts.push('            <td>3</td>');
            htmlParts.push('            <td>張小芳</td>');
            htmlParts.push('            <td>fang@example.com</td>');
            htmlParts.push('            <td>用戶</td>');
            htmlParts.push('          </tr>');
            htmlParts.push('        </tbody>');
            htmlParts.push('      </table>');
          }
          
          // 新增功能: 輪播 (Bootstrap)
          if (includeCarousel && cssFramework === 'bootstrap') {
            htmlParts.push('      <h3>圖片輪播</h3>');
            htmlParts.push('      <div id="carouselExample" class="carousel slide mb-4" data-bs-ride="carousel">');
            htmlParts.push('        <div class="carousel-indicators">');
            htmlParts.push('          <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>');
            htmlParts.push('          <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1" aria-label="Slide 2"></button>');
            htmlParts.push('          <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2" aria-label="Slide 3"></button>');
            htmlParts.push('        </div>');
            htmlParts.push('        <div class="carousel-inner">');
            htmlParts.push('          <div class="carousel-item active">');
            
            // 假圖片或佔位符
            if (includeDummyImages) {
              htmlParts.push('            <img src="https://via.placeholder.com/800x400?text=Slide+1" class="d-block w-100" alt="Slide 1">');
            } else {
              htmlParts.push('            <div style="background: #777; height: 400px; display: flex; align-items: center; justify-content: center;">');
              htmlParts.push('              <h5 style="color: white;">幻燈片 1</h5>');
              htmlParts.push('            </div>');
            }
            
            htmlParts.push('            <div class="carousel-caption d-none d-md-block">');
            htmlParts.push('              <h5>第一張幻燈片</h5>');
            htmlParts.push('              <p>這是第一張幻燈片的描述文字。</p>');
            htmlParts.push('            </div>');
            htmlParts.push('          </div>');
            htmlParts.push('          <div class="carousel-item">');
            
            if (includeDummyImages) {
              htmlParts.push('            <img src="https://via.placeholder.com/800x400?text=Slide+2" class="d-block w-100" alt="Slide 2">');
            } else {
              htmlParts.push('            <div style="background: #777; height: 400px; display: flex; align-items: center; justify-content: center;">');
              htmlParts.push('              <h5 style="color: white;">幻燈片 2</h5>');
              htmlParts.push('            </div>');
            }
            
            htmlParts.push('            <div class="carousel-caption d-none d-md-block">');
            htmlParts.push('              <h5>第二張幻燈片</h5>');
            htmlParts.push('              <p>這是第二張幻燈片的描述文字。</p>');
            htmlParts.push('            </div>');
            htmlParts.push('          </div>');
            htmlParts.push('          <div class="carousel-item">');
            
            if (includeDummyImages) {
              htmlParts.push('            <img src="https://via.placeholder.com/800x400?text=Slide+3" class="d-block w-100" alt="Slide 3">');
            } else {
              htmlParts.push('            <div style="background: #777; height: 400px; display: flex; align-items: center; justify-content: center;">');
              htmlParts.push('              <h5 style="color: white;">幻燈片 3</h5>');
              htmlParts.push('            </div>');
            }
            
            htmlParts.push('            <div class="carousel-caption d-none d-md-block">');
            htmlParts.push('              <h5>第三張幻燈片</h5>');
            htmlParts.push('              <p>這是第三張幻燈片的描述文字。</p>');
            htmlParts.push('            </div>');
            htmlParts.push('          </div>');
            htmlParts.push('        </div>');
            htmlParts.push('        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">');
            htmlParts.push('          <span class="carousel-control-prev-icon" aria-hidden="true"></span>');
            htmlParts.push('          <span class="visually-hidden">Previous</span>');
            htmlParts.push('        </button>');
            htmlParts.push('        <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">');
            htmlParts.push('          <span class="carousel-control-next-icon" aria-hidden="true"></span>');
            htmlParts.push('          <span class="visually-hidden">Next</span>');
            htmlParts.push('        </button>');
            htmlParts.push('      </div>');
          }
          
          // 新增功能: 折疊面板 (Accordion)
          if (includeAccordion && cssFramework === 'bootstrap') {
            htmlParts.push('      <h3>折疊面板</h3>');
            htmlParts.push('      <div class="accordion mb-4" id="accordionExample">');
            htmlParts.push('        <div class="accordion-item">');
            htmlParts.push('          <h2 class="accordion-header">');
            htmlParts.push('            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">');
            htmlParts.push('              折疊面板 #1');
            htmlParts.push('            </button>');
            htmlParts.push('          </h2>');
            htmlParts.push('          <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">');
            htmlParts.push('            <div class="accordion-body">');
            if (includeDummyText) {
              htmlParts.push('              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum malesuada felis sed massa faucibus, at gravida massa efficitur. Ut auctor mi sit amet neque tincidunt efficitur.</p>');
            } else {
              htmlParts.push('              <p>這是第一個折疊面板的內容。點擊標題可以展開或收起此內容。</p>');
            }
            htmlParts.push('            </div>');
            htmlParts.push('          </div>');
            htmlParts.push('        </div>');
            htmlParts.push('        <div class="accordion-item">');
            htmlParts.push('          <h2 class="accordion-header">');
            htmlParts.push('            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">');
            htmlParts.push('              折疊面板 #2');
            htmlParts.push('            </button>');
            htmlParts.push('          </h2>');
            htmlParts.push('          <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">');
            htmlParts.push('            <div class="accordion-body">');
            if (includeDummyText) {
              htmlParts.push('              <p>Nulla facilisi. Praesent euismod urna ac sapien facilisis, at blandit dui dictum. Fusce aliquam interdum libero, vel hendrerit sapien.</p>');
            } else {
              htmlParts.push('              <p>這是第二個折疊面板的內容。點擊標題可以展開或收起此內容。</p>');
            }
            htmlParts.push('            </div>');
            htmlParts.push('          </div>');
            htmlParts.push('        </div>');
            htmlParts.push('        <div class="accordion-item">');
            htmlParts.push('          <h2 class="accordion-header">');
            htmlParts.push('            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">');
            htmlParts.push('              折疊面板 #3');
            htmlParts.push('            </button>');
            htmlParts.push('          </h2>');
            htmlParts.push('          <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">');
            htmlParts.push('            <div class="accordion-body">');
            if (includeDummyText) {
              htmlParts.push('              <p>Etiam non magna sed arcu euismod feugiat. Donec euismod, nisl vel tincidunt lacinia, nunc elit ultrices nunc, vel tincidunt magna nunc vel magna.</p>');
            } else {
              htmlParts.push('              <p>這是第三個折疊面板的內容。點擊標題可以展開或收起此內容。</p>');
            }
            htmlParts.push('            </div>');
            htmlParts.push('          </div>');
            htmlParts.push('        </div>');
            htmlParts.push('      </div>');
          }
          
          // 添加卡片組件
          if (includeCard) {
            if (cssFramework === 'bootstrap') {
              htmlParts.push('      <div class="row row-cols-1 row-cols-md-3 g-4 mb-4">');
              for (let i = 1; i <= 3; i++) {
                htmlParts.push('        <div class="col">');
                htmlParts.push('          <div class="card h-100">');
                if (includeDummyImages) {
                  htmlParts.push('            <img src="https://via.placeholder.com/300x200?text=Card+Image+' + i + '" class="card-img-top" alt="Card image">');
                }
                htmlParts.push('            <div class="card-body">');
                htmlParts.push('              <h5 class="card-title">卡片標題 ' + i + '</h5>');
                if (includeDummyText) {
                  htmlParts.push('              <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec diam placerat, aliquam est et, porta urna.</p>');
                } else {
                  htmlParts.push('              <p class="card-text">這是卡片 ' + i + ' 的內容描述。</p>');
                }
                htmlParts.push('              <a href="#" class="btn btn-primary">了解更多</a>');
                htmlParts.push('            </div>');
                htmlParts.push('          </div>');
                htmlParts.push('        </div>');
              }
              htmlParts.push('      </div>');
            } else {
              htmlParts.push('      <div class="card">');
              htmlParts.push('        <h3>卡片標題</h3>');
              if (includeDummyText) {
                htmlParts.push('        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec diam placerat, aliquam est et, porta urna.</p>');
              } else {
                htmlParts.push('        <p>卡片內容</p>');
              }
              htmlParts.push('      </div>');
            }
          }
          
          // 添加表單組件
          if (includeForm) {
            if (cssFramework === 'bootstrap') {
              htmlParts.push('      <h3>聯絡表單</h3>');
              htmlParts.push('      <form class="mb-4">');
              htmlParts.push('        <div class="mb-3">');
              htmlParts.push('          <label for="name" class="form-label">姓名</label>');
              htmlParts.push('          <input type="text" class="form-control" id="name" required>');
              htmlParts.push('        </div>');
              htmlParts.push('        <div class="mb-3">');
              htmlParts.push('          <label for="email" class="form-label">電子郵件</label>');
              htmlParts.push('          <input type="email" class="form-control" id="email" required>');
              htmlParts.push('        </div>');
              htmlParts.push('        <div class="mb-3">');
              htmlParts.push('          <label for="message" class="form-label">訊息</label>');
              htmlParts.push('          <textarea class="form-control" id="message" rows="4" required></textarea>');
              htmlParts.push('        </div>');
              htmlParts.push('        <button type="submit" class="btn btn-primary">送出</button>');
              htmlParts.push('      </form>');
            } else {
              htmlParts.push('      <form>');
              htmlParts.push('        <div class="form-group">');
              htmlParts.push('          <label for="name">姓名：</label>');
              htmlParts.push('          <input type="text" id="name" name="name" required>');
              htmlParts.push('        </div>');
              htmlParts.push('        <div class="form-group">');
              htmlParts.push('          <label for="email">電子郵件：</label>');
              htmlParts.push('          <input type="email" id="email" name="email" required>');
              htmlParts.push('        </div>');
              htmlParts.push('        <div class="form-group">');
              htmlParts.push('          <label for="message">訊息：</label>');
              htmlParts.push('          <textarea id="message" name="message" rows="4" required></textarea>');
              htmlParts.push('        </div>');
              htmlParts.push('        <button type="submit">提交</button>');
              htmlParts.push('      </form>');
            }
          }
          
          htmlParts.push('    </section>');
          htmlParts.push('  </main>');
        }
      } else if (layoutTemplate === 'two') {
        // 雙欄佈局
        htmlParts.push('  <div class="container">');
        htmlParts.push('    <div class="row">');
        
        if (includeMain) {
          htmlParts.push('      <main class="col-md-8">');
          htmlParts.push('        <section>');
          htmlParts.push('          <h2>主要內容</h2>');
          htmlParts.push('          <p>這是網站的主要內容區域。</p>');
          
          // 添加卡片或表單
          if (includeCard) {
            htmlParts.push('          <div class="card">');
            htmlParts.push('            <h3>卡片標題</h3>');
            htmlParts.push('            <p>卡片內容</p>');
            htmlParts.push('          </div>');
          }
          
          htmlParts.push('        </section>');
          htmlParts.push('      </main>');
        }
        
        if (includeAside) {
          htmlParts.push('      <aside class="col-md-4">');
          htmlParts.push('        <section>');
          htmlParts.push('          <h2>側邊欄</h2>');
          htmlParts.push('          <p>這是側邊欄區域。</p>');
          
          // 添加側邊欄組件
          if (includeForm) {
            htmlParts.push('          <form>');
            htmlParts.push('            <div class="form-group">');
            htmlParts.push('              <label for="search">搜尋：</label>');
            htmlParts.push('              <input type="search" id="search" name="search">');
            htmlParts.push('            </div>');
            htmlParts.push('            <button type="submit">搜尋</button>');
            htmlParts.push('          </form>');
          }
          
          htmlParts.push('        </section>');
          htmlParts.push('      </aside>');
        }
        
        htmlParts.push('    </div>');
        htmlParts.push('  </div>');
      } else if (layoutTemplate === 'three') {
        // 三欄佈局
        htmlParts.push('  <div class="container">');
        htmlParts.push('    <div class="row">');
        
        if (includeAside) {
          htmlParts.push('      <aside class="col-md-3">');
          htmlParts.push('        <section>');
          htmlParts.push('          <h2>左側欄</h2>');
          htmlParts.push('          <p>這是左側邊欄區域。</p>');
          htmlParts.push('        </section>');
          htmlParts.push('      </aside>');
        }
        
        if (includeMain) {
          htmlParts.push('      <main class="col-md-6">');
          htmlParts.push('        <section>');
          htmlParts.push('          <h2>主要內容</h2>');
          htmlParts.push('          <p>這是網站的主要內容區域。</p>');
          
          // 添加卡片
          if (includeCard) {
            htmlParts.push('          <div class="card">');
            htmlParts.push('            <h3>卡片標題</h3>');
            htmlParts.push('            <p>卡片內容</p>');
            htmlParts.push('          </div>');
          }
          
          // 添加表單
          if (includeForm) {
            htmlParts.push('          <form>');
            htmlParts.push('            <div class="form-group">');
            htmlParts.push('              <label for="name">姓名：</label>');
            htmlParts.push('              <input type="text" id="name" name="name" required>');
            htmlParts.push('            </div>');
            htmlParts.push('            <div class="form-group">');
            htmlParts.push('              <label for="email">電子郵件：</label>');
            htmlParts.push('              <input type="email" id="email" name="email" required>');
            htmlParts.push('            </div>');
            htmlParts.push('            <button type="submit">提交</button>');
            htmlParts.push('          </form>');
          }
          
          htmlParts.push('        </section>');
          htmlParts.push('      </main>');
        }
        
        if (includeAside) {
          htmlParts.push('      <aside class="col-md-3">');
          htmlParts.push('        <section>');
          htmlParts.push('          <h2>右側欄</h2>');
          htmlParts.push('          <p>這是右側邊欄區域。</p>');
          htmlParts.push('        </section>');
          htmlParts.push('      </aside>');
        }
        
        htmlParts.push('    </div>'); // row 結束
        htmlParts.push('  </div>'); // container 結束
      }
      
      // 添加Footer區域
      if (includeFooter) {
        htmlParts.push('  <footer class="' + (cssFramework === 'bootstrap' ? 'mt-5 py-4 bg-light' : '') + '">');
        htmlParts.push('    <div class="' + (cssFramework === 'bootstrap' ? 'container text-center' : '') + '">');
        htmlParts.push('      <p>&copy; 2025 ' + pageTitle + '. 保留所有權利。</p>');
        htmlParts.push('    </div>');
        htmlParts.push('  </footer>');
      }
      
      // 新增功能: Cookie通知
      if (includeCookieNotice) {
        htmlParts.push('  <div class="cookie-notice" id="cookieNotice">');
        htmlParts.push('    <p>本網站使用Cookie以確保您獲得最佳的網站體驗。</p>');
        htmlParts.push('    <button id="acceptCookies">接受</button>');
        htmlParts.push('    <button id="declineCookies">拒絕</button>');
        htmlParts.push('  </div>');
      }
      
      // 新增功能: Trollface彩蛋
      if (includeTrollface) {
        const easterEggTitle = customEasterEggImage ? '自定義彩蛋' : 'Trollface彩蛋';
        htmlParts.push('  <div class="trollface-easter-egg" id="trollfaceEgg" title="' + easterEggTitle + '"></div>');
      }
      
      // 新增功能: jQuery
      if (includeJQuery || includeFadeInAfterLoad || includeCookieNotice) {
        htmlParts.push('  <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>');
      }
      
      // JavaScript框架
      if (cssFramework === 'bootstrap') {
        htmlParts.push('  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"></script>');
      }
      
      // 新增功能: Google Analytics
      if (includeAnalytics && gaId) {
        htmlParts.push('  <!-- Google Analytics -->');
        htmlParts.push('  <script async src="https://www.googletagmanager.com/gtag/js?id=' + gaId + '"></script>');
        htmlParts.push('  <script>');
        htmlParts.push('    window.dataLayer = window.dataLayer || [];');
        htmlParts.push('    function gtag(){dataLayer.push(arguments);}');
        htmlParts.push('    gtag(\'js\', new Date());');
        htmlParts.push('    gtag(\'config\', \'' + gaId + '\');');
        htmlParts.push('  </script>');
      }
      
      // 各種特效和互動的JavaScript
      const hasJsFeatures = includeFadeIn || includeFadeInAfterLoad || includeCookieNotice || includeTrollface;
      
      if (hasJsFeatures) {
        htmlParts.push('  <script>');
        
        // 網頁載入後執行的代碼
        htmlParts.push('    document.addEventListener("DOMContentLoaded", function() {');
        
        // 頁面淡入效果
      if (includeFadeIn) {
          htmlParts.push('      // 頁面淡入效果');
          htmlParts.push('      setTimeout(function() {');
          htmlParts.push('        document.body.classList.add("fade-in");');
          htmlParts.push('      }, 100);');
        }
        
        // Trollface彩蛋
        if (includeTrollface) {
          const triggerSequence = customEasterEggSequence || 'troll';
          
          htmlParts.push('      // 隱藏的彩蛋 - 按下鍵盤序列後顯示');
          htmlParts.push('      let keySequence = "";');
          htmlParts.push('      const targetSequence = "' + triggerSequence + '";');
          htmlParts.push('      document.addEventListener("keydown", function(e) {');
          htmlParts.push('        keySequence += e.key.toLowerCase();');
          htmlParts.push('        if (keySequence.includes(targetSequence)) {');
          htmlParts.push('          document.getElementById("trollfaceEgg").style.display = "block";');
          htmlParts.push('          keySequence = "";');
          htmlParts.push('        }');
          htmlParts.push('        // 只保留最後' + (triggerSequence.length > 5 ? triggerSequence.length : 5) + '個按鍵');
          htmlParts.push('        if (keySequence.length > ' + (triggerSequence.length > 5 ? triggerSequence.length : 5) + ') {');
          htmlParts.push('          keySequence = keySequence.slice(-' + (triggerSequence.length > 5 ? triggerSequence.length : 5) + ');');
          htmlParts.push('        }');
          htmlParts.push('      });');
          htmlParts.push('      // 點擊Trollface後隱藏');
          htmlParts.push('      document.getElementById("trollfaceEgg").addEventListener("click", function() {');
          htmlParts.push('        this.style.display = "none";');
          htmlParts.push('      });');
        }
        
        htmlParts.push('    });');
        
        // jQuery相關功能
        if (includeJQuery) {
          htmlParts.push('    $(document).ready(function() {');
          
          // 頁面完全加載後淡入
          if (includeFadeInAfterLoad) {
            htmlParts.push('      // 頁面完全加載後淡入');
            htmlParts.push('      $(window).on("load", function() {');
            htmlParts.push('        setTimeout(function() {');
            htmlParts.push('          $("body").addClass("loaded");');
            htmlParts.push('        }, 100);');
            htmlParts.push('      });');
          }
          
          // Cookie通知
          if (includeCookieNotice) {
            htmlParts.push('      // Cookie通知');
            htmlParts.push('      if (!localStorage.getItem("cookiesAccepted")) {');
            htmlParts.push('        $("#cookieNotice").show();');
            htmlParts.push('      }');
            htmlParts.push('      ');
            htmlParts.push('      $("#acceptCookies").click(function() {');
            htmlParts.push('        localStorage.setItem("cookiesAccepted", "true");');
            htmlParts.push('        $("#cookieNotice").hide();');
            htmlParts.push('      });');
            htmlParts.push('      ');
            htmlParts.push('      $("#declineCookies").click(function() {');
            htmlParts.push('        localStorage.setItem("cookiesAccepted", "false");');
            htmlParts.push('        $("#cookieNotice").hide();');
            htmlParts.push('      });');
          }
          
          htmlParts.push('    });');
        }
        
        htmlParts.push('  </script>');
      }
      
      // JavaScript腳本
      if (includeJsScript && jsFile) {
        if (!jsFile.startsWith('http') && !jsFile.startsWith('//')) {
          htmlParts.push('  <!-- 注意: 以下腳本文件在預覽中可能不存在 -->');
          htmlParts.push('  <script src="' + jsFile + '"></script>');
          } else {
          htmlParts.push('  <script src="' + jsFile + '"></script>');
        }
      }
      
      htmlParts.push('</body>');
      htmlParts.push('</html>');
    }
    
    // 使用换行符连接所有部分
    const htmlOutput = htmlParts.join('\n');
    document.getElementById('output').value = htmlOutput;
    
    // 更新预览
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
    const previewFrame = document.getElementById('previewFrame');
    const htmlContent = document.getElementById('output').value;
    
    if (previewFrame && htmlContent) {
      try {
        // 刪除之前的iframe內容，避免重複加載
        const frameWindow = previewFrame.contentWindow;
        if (frameWindow) {
          try {
            frameWindow.document.open();
            frameWindow.document.write('');
            frameWindow.document.close();
          } catch (e) {
            console.log('清除iframe內容失敗: ' + e.message);
          }
        }
        
        // 創建一個blob URL來代替直接寫入iframe內容
        // 這樣可以確保正確的MIME類型
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const blobURL = URL.createObjectURL(blob);
        
        // 使用blob URL加載預覽
        previewFrame.src = blobURL;
        
        // 當iframe加載完成後釋放blob URL
        previewFrame.onload = function() {
          URL.revokeObjectURL(blobURL);
          
          // 處理iframe內部的資源加載錯誤
          try {
            const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
            
            // 確保iframe內的表單和交互元素正常工作
            const forms = frameDoc.querySelectorAll('form');
            forms.forEach(form => {
              form.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('在預覽模式中表單提交已被禁用');
              });
            });
            
            // 添加交互性提示
            const interactiveElements = frameDoc.querySelectorAll('a, button, input[type="submit"]');
            interactiveElements.forEach(el => {
              if (el.tagName.toLowerCase() === 'a') {
                el.addEventListener('click', function(e) {
                  e.preventDefault();
                  alert('在預覽模式中連結導航已被禁用');
                });
              } else if (el.type !== 'text' && el.type !== 'email' && el.type !== 'textarea') {
                el.addEventListener('click', function(e) {
                  if (e.target.type === 'submit') {
                    e.preventDefault();
                  }
                });
              }
            });
            
            // 在iframe內部添加錯誤處理
            const errorHandler = frameDoc.createElement('script');
            errorHandler.textContent = `
              // 攔截控制台錯誤
              window.addEventListener('error', function(event) {
                // 阻止404錯誤顯示在控制台
                if (event.filename && (event.filename.endsWith('.css') || event.filename.endsWith('.js'))) {
                  event.preventDefault();
                  return false;
                }
              }, true);
            `;
            frameDoc.head.appendChild(errorHandler);
            
            // 增強表單展示
            if (frameDoc.querySelector('form')) {
              const formStyle = frameDoc.createElement('style');
              formStyle.textContent = `
                form {
                  max-width: 500px;
                  margin: 0 auto 20px;
                  padding: 20px;
                  border: 1px solid #ddd;
                  border-radius: 8px;
                  background-color: #f9f9f9;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                .form-group {
                  margin-bottom: 15px;
                }
                form label {
                  display: block;
                  margin-bottom: 8px;
                  font-weight: bold;
                  color: #333;
                }
                form input, form textarea, form select {
                  width: 100%;
                  padding: 10px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  font-size: 16px;
                  transition: border-color 0.3s;
                }
                form input:focus, form textarea:focus, form select:focus {
                  border-color: #0366d6;
                  outline: none;
                  box-shadow: 0 0 5px rgba(3, 102, 214, 0.3);
                }
                form button {
                  background-color: #0366d6;
                  color: white;
                  border: none;
                  padding: 12px 20px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 16px;
                  font-weight: bold;
                  transition: background-color 0.3s;
                }
                form button:hover {
                  background-color: #0056b3;
                }
              `;
              frameDoc.head.appendChild(formStyle);
            }
          } catch (e) {
            console.log('無法添加iframe錯誤處理或樣式: ' + e.message);
          }
        };
      } catch (e) {
        console.error('預覽更新失敗: ' + e.message);
        
        // 回退到舊方法
        try {
          const preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
          preview.open();
          preview.write(htmlContent);
          preview.close();
        } catch (e2) {
          console.error('預覽回退方法也失敗: ' + e2.message);
        }
      }
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