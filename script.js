// إظهار وإخفاء شريط الإعدادات
function toggleSettings() {
  const settingsPanel = document.getElementById('settings-panel');
  settingsPanel.classList.toggle('active');
}
 
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch(error => {
      console.error('Service Worker registration failed:', error);
    });
  });
}
// تغيير الوضع الليلي
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// تغيير اللغة
function changeLanguage() {
  const lang = document.getElementById('language-selector').value;
  alert(`تم اختيار اللغة: ${lang}`);
  // يمكنك إضافة منطق لتغيير اللغة باستخدام مكتبات مثل i18n.
}

// تغيير لون الموقع
function changeThemeColor(color) {
  document.body.style.setProperty('--primary-color', color);
}

// شريط التقدم (Progress Bar)
function showProgress() {
  const progressBar = document.getElementById('progress-bar');
  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) clearInterval(interval);
    else {
      width++;
      progressBar.style.width = width + '%';
    }
  }, 20);
}

// عرض الأدوات
function showTool(toolName) {
  const container = document.getElementById('tool-container');
  container.innerHTML = ''; // مسح المحتوى السابق

  switch (toolName) {
    case 'currency':
      container.innerHTML = `
        <h3><i class="fas fa-dollar-sign" style="color: #ffcc00;"></i> محول العملات</h3>
        <div class="input-group">
          <i class="fas fa-coins" style="color: #ffcc00;"></i>
          <input type="number" id="amount" placeholder="أدخل المبلغ">
        </div>
        <select id="fromCurrency">
          <option value="USD">دولار أمريكي (USD)</option>
          <option value="EUR">يورو (EUR)</option>
          <option value="GBP">جنيه إسترليني (GBP)</option>
        </select>
        <select id="toCurrency">
          <option value="USD">دولار أمريكي (USD)</option>
          <option value="EUR">يورو (EUR)</option>
          <option value="GBP">جنيه إسترليني (GBP)</option>
        </select>
        <button onclick="convertCurrency()">تحويل</button>
        <h4 id="result"></h4>
      `;
      break;

    case 'bmi':
      container.innerHTML = `
        <h3><i class="fas fa-weight" style="color: #3498db;"></i> حاسبة BMI</h3>
        <div class="input-group">
          <i class="fas fa-weight-hanging" style="color: #3498db;"></i>
          <input type="number" id="weight" placeholder="الوزن (كغ)">
        </div>
        <div class="input-group">
          <i class="fas fa-ruler-vertical" style="color: #3498db;"></i>
          <input type="number" id="height" placeholder="الطول (سم)">
        </div>
        <button onclick="calculateBMI()">حساب</button>
        <h4 id="bmi-result"></h4>
      `;
      break;

    case 'unit':
      container.innerHTML = `
        <h3><i class="fas fa-balance-scale" style="color: #e74c3c;"></i> محول الوحدات</h3>
        <div class="input-group">
          <i class="fas fa-scale-balanced" style="color: #e74c3c;"></i>
          <input type="number" id="value" placeholder="القيمة">
        </div>
        <select id="fromUnit">
          <option value="kg">كيلوجرام</option>
          <option value="lb">رطل</option>
        </select>
        <select id="toUnit">
          <option value="kg">كيلوجرام</option>
          <option value="lb">رطل</option>
        </select>
        <button onclick="convertUnit()">تحويل</button>
        <h4 id="unit-result"></h4>
      `;
      break;

    case 'word-counter':
      container.innerHTML = `
        <h3><i class="fas fa-font" style="color: #2ecc71;"></i> عداد الكلمات</h3>
        <div class="input-group">
          <i class="fas fa-pencil-alt" style="color: #2ecc71;"></i>
          <textarea id="text" placeholder="أدخل النص هنا"></textarea>
        </div>
        <button onclick="countWords()">عد الكلمات</button>
        <h4 id="word-count"></h4>
      `;
      break;

    case 'password-generator':
      container.innerHTML = `
        <h3><i class="fas fa-key" style="color: #9b59b6;"></i> توليد كلمات مرور</h3>
        <div class="input-group">
          <i class="fas fa-lock" style="color: #9b59b6;"></i>
          <input type="number" id="length" placeholder="عدد الحروف" value="8">
        </div>
        <button onclick="generatePassword()">توليد</button>
        <h4 id="password-result"></h4>
      `;
      break;

    case 'todo':
      container.innerHTML = `
        <h3><i class="fas fa-tasks" style="color: #f1c40f;"></i> إدارة المهام</h3>
        <div class="input-group">
          <i class="fas fa-plus" style="color: #f1c40f;"></i>
          <input type="text" id="task-input" placeholder="أضف مهمة جديدة">
        </div>
        <button onclick="addTask()">إضافة</button>
        <ul id="task-list"></ul>
      `;
      loadTasks(); // تحميل المهام المحفوظة
      break;
  }
}

// محول العملات
async function convertCurrency() {
  const amount = parseFloat(document.getElementById('amount')?.value);
  const fromCurrency = document.getElementById('fromCurrency')?.value;
  const toCurrency = document.getElementById('toCurrency')?.value;

  if (!amount || !fromCurrency || !toCurrency) {
    document.getElementById('result').innerText = 'يرجى إدخال جميع البيانات.';
    return;
  }

  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const data = await response.json();
    const rate = data.rates[toCurrency];
    const result = (amount * rate).toFixed(2);

    document.getElementById('result').innerText = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
  } catch (error) {
    document.getElementById('result').innerText = 'حدث خطأ أثناء التحويل. يرجى المحاولة لاحقًا.';
  }
}

// حاسبة BMI
function calculateBMI() {
  const weight = parseFloat(document.getElementById('weight')?.value);
  const height = parseFloat(document.getElementById('height')?.value) / 100;

  if (!weight || !height) {
    document.getElementById('bmi-result').innerText = 'يرجى إدخال الوزن والطول.';
    return;
  }

  const bmi = (weight / (height * height)).toFixed(2);
  document.getElementById('bmi-result').innerText = `مؤشر كتلة الجسم: ${bmi}`;
}

// محول الوحدات
function convertUnit() {
  const value = parseFloat(document.getElementById('value')?.value);
  const fromUnit = document.getElementById('fromUnit')?.value;
  const toUnit = document.getElementById('toUnit')?.value;

  if (!value || !fromUnit || !toUnit) {
    document.getElementById('unit-result').innerText = 'يرجى إدخال جميع البيانات.';
    return;
  }

  let result;
  if (fromUnit === 'kg' && toUnit === 'lb') {
    result = (value * 2.20462).toFixed(2);
  } else if (fromUnit === 'lb' && toUnit === 'kg') {
    result = (value / 2.20462).toFixed(2);
  } else {
    result = value.toFixed(2);
  }

  document.getElementById('unit-result').innerText = `النتيجة: ${result}`;
}

// عداد الكلمات
function countWords() {
  const text = document.getElementById('text')?.value.trim();

  if (!text) {
    document.getElementById('word-count').innerText = 'يرجى إدخال نص.';
    return;
  }

  const words = text.split(/\s+/).filter(word => word.length > 0).length;
  document.getElementById('word-count').innerText = `عدد الكلمات: ${words}`;
}

// توليد كلمات المرور
function generatePassword() {
  const length = parseInt(document.getElementById('length')?.value);

  if (!length || length <= 0) {
    document.getElementById('password-result').innerText = 'يرجى إدخال عدد الحروف.';
    return;
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  document.getElementById('password-result').innerText = `كلمة المرور: ${password}`;
}

// إدارة المهام
function addTask() {
  const taskInput = document.getElementById('task-input');
  const taskText = taskInput.value.trim();

  if (!taskText) {
    alert('يرجى إدخال مهمة.');
    return;
  }

  const taskList = document.getElementById('task-list');
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${taskText}</span>
    <button onclick="markTaskDone(this)">تم</button>
    <button onclick="deleteTask(this)">حذف</button>
  `;
  taskList.appendChild(li);
  taskInput.value = '';

  saveTasks(); // حفظ المهام بعد الإضافة
}

function markTaskDone(button) {
  const taskItem = button.parentElement;
  taskItem.style.textDecoration = 'line-through';
  taskItem.style.color = '#2ecc71';
  saveTasks(); // حفظ المهام بعد التعديل
}

function deleteTask(button) {
  const taskItem = button.parentElement;
  taskItem.remove();
  saveTasks(); // حفظ المهام بعد الحذف
}

// حفظ المهام باستخدام LocalStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#task-list li span').forEach(task => {
    tasks.push(task.innerText);
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// تحميل المهام من LocalStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  tasks.forEach(taskText => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${taskText}</span>
      <button onclick="markTaskDone(this)">تم</button>
      <button onclick="deleteTask(this)">حذف</button>
    `;
    taskList.appendChild(li);
  });
}

// وضع "توضيحي" (Tutorial Mode)
function showTutorial() {
  alert('مرحبًا بك في موقع الأدوات المجانية! يمكنك استخدام الأدوات المختلفة بالنقر على الأزرار الموجودة في الصفحة.');
}

// زر المشاركة
function shareTool() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    alert('تم نسخ الرابط بنجاح! شاركه مع أصدقائك.');
  }).catch(err => {
    console.error('حدث خطأ أثناء نسخ الرابط:', err);
  });
}

// تسجيل الدخول البسيط
function login() {
  const username = prompt('أدخل اسم المستخدم:');
  const password = prompt('أدخل كلمة المرور:');

  if (username === 'admin' && password === 'password') {
    alert('تم تسجيل الدخول بنجاح!');
  } else {
    alert('اسم المستخدم أو كلمة المرور غير صحيحة.');
  }
}

// إعلان مباشر (Affiliate Marketing)
function showAffiliateAd() {
  const affiliateLink = 'https://example.com/product'; // استبدل هذا بالرابط التابع الخاص بك
  window.open(affiliateLink, '_blank');
}

// تحويل الموقع إلى PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch(error => {
      console.error('Service Worker registration failed:', error);
    });
  });
}