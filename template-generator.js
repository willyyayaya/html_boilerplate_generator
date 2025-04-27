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
    
    // 獲取CSS框架
    const cssFramework = document.querySelector('input[name="cssFramework"]:checked').value;
    
    // 獲取布局模板
    const layoutTemplate = document.querySelector('input[name="layoutTemplate"]:checked').value;
    
    // 獲取組件
    const includeHero = document.getElementById('includeHero').checked;
    const includeNavbar = document.getElementById('includeNavbar').checked;
    const includeCard = document.getElementById('includeCard').checked;
    const includeForm = document.getElementById('includeForm').checked;
    
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
      }
      
      // 標題
      if (includeTitle) {
        htmlParts.push('  <title>' + pageTitle + '</title>');
      }
      
      // CSS框架
      if (cssFramework === 'bootstrap') {
        htmlParts.push('  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">');
      } else if (cssFramework === 'tailwind') {
        htmlParts.push('  <script src="https://cdn.tailwindcss.com"></script>');
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
      
      // 添加組件樣式
      if (includeHeader) {
        htmlParts.push('    header {');
        htmlParts.push('      background-color: #f8f9fa;');
        htmlParts.push('      padding: 20px;');
        htmlParts.push('      margin-bottom: 20px;');
        htmlParts.push('      border-radius: 5px;');
        htmlParts.push('    }');
      }
      
      if (includeNavbar) {
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
      
      htmlParts.push('  </style>');
      
      htmlParts.push('</head>');
      htmlParts.push('<body>');
      
      // 添加Header區域
      if (includeHeader) {
        htmlParts.push('  <header>');
        
        // 添加導航欄
        if (includeNavbar) {
          htmlParts.push('    <nav>');
          htmlParts.push('      <ul>');
          htmlParts.push('        <li><a href="#">首頁</a></li>');
          htmlParts.push('        <li><a href="#">關於我們</a></li>');
          htmlParts.push('        <li><a href="#">服務</a></li>');
          htmlParts.push('        <li><a href="#">聯絡我們</a></li>');
          htmlParts.push('      </ul>');
          htmlParts.push('    </nav>');
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
          htmlParts.push('  <main>');
          htmlParts.push('    <section>');
          htmlParts.push('      <h2>歡迎來到' + pageTitle + '</h2>');
          htmlParts.push('      <p>這是網站的主要內容區域。</p>');
          
          // 添加卡片組件
          if (includeCard) {
            htmlParts.push('      <div class="card">');
            htmlParts.push('        <h3>卡片標題</h3>');
            htmlParts.push('        <p>卡片內容</p>');
            htmlParts.push('      </div>');
          }
          
          // 添加表單組件
          if (includeForm) {
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
        htmlParts.push('  <footer>');
        htmlParts.push('    <p>&copy; 2025 ' + pageTitle + '. 保留所有權利。</p>');
        htmlParts.push('  </footer>');
      }
      
      // JavaScript框架
      if (cssFramework === 'bootstrap') {
        htmlParts.push('  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>');
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
      includeForm: document.getElementById('includeForm').checked
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