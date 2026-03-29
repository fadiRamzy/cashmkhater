# 🔥 دليل Firebase — المزامنة الفورية الحقيقية

## كلمة المرور: `Fadicash@2026`

---

## نشر الموقع (60 ثانية)

1. افتح **https://app.netlify.com/drop**
2. اسحب `index.html` وأفلته
3. رابطك جاهز فوراً

---

## إعداد Firebase للمزامنة الفورية

### الخطوة 1 — إنشاء المشروع
1. اذهب إلى **https://console.firebase.google.com**
2. اضغط "Add project" → أدخل اسم المشروع → Continue → Create project

### الخطوة 2 — تفعيل Firestore
1. في القائمة الجانبية: **Build → Firestore Database**
2. اضغط "Create database"
3. اختر **"Start in test mode"** ← (يتيح القراءة والكتابة بدون مصادقة)
4. اختر أقرب منطقة (مثلاً `europe-west1`)
5. اضغط "Enable"

### الخطوة 3 — إضافة Web App
1. **Project Settings** (أيقونة الترس) → **General**
2. في قسم "Your apps" → اضغط أيقونة `</>`
3. أدخل اسم التطبيق (مثلاً "risk-system") → "Register app"
4. **انسخ القيم التالية من الكود المعروض:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",           ← انسخ هذا
  authDomain: "xxx.firebaseapp.com",  ← انسخ هذا
  projectId: "your-project-id",  ← انسخ هذا
  appId: "1:xxx:web:xxx"         ← انسخ هذا
};
```

### الخطوة 4 — ربط الموقع
1. افتح موقعك وأدخل كلمة المرور
2. اضغط **⚙️ لوحة التحكم**
3. في قسم "ربط Firebase":
   - أدخل `apiKey`
   - أدخل `projectId`
   - أدخل `authDomain`
   - أدخل `appId` (اختياري)
4. اضغط **"🔌 ربط وتفعيل المزامنة"**
5. انتظر رسالة التأكيد ✅

---

## كيف تعمل المزامنة؟

```
المستخدم A يرفع Excel
        ↓
يُكتب في Firestore
        ↓
onSnapshot() يُطلَق على جميع الأجهزة
        ↓
UI يتحدث فورياً على جميع المتصفحات
```

- **مستخدم A** يرفع ملف → يظهر فوراً عند **مستخدم B**
- **مستخدم A** يضيف تقرير → يظهر فوراً عند **مستخدم B**
- **مستخدم A** يحذف سجلات → تختفي فوراً عند **مستخدم B**
- بعد أي refresh → البيانات تُحمَّل تلقائياً من Firebase

---

## القواعد الأمنية الموصى بها

في Firestore → Rules → استبدل بهذا:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /customers/{document=**} {
      allow read, write: if true; // أو أضف مصادقة
    }
  }
}
```

---

## الحد المجاني لـ Firebase (Spark Plan)
- 50,000 قراءة/يوم مجانية
- 20,000 كتابة/يوم مجانية  
- 1 GB تخزين مجاني
- كافٍ تماماً لآلاف السجلات

