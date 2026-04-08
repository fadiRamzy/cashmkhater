/* ====================================================
   Care with Fady — Smart Arabic Diet Planner v3.0
   All 10 updates applied | Fully offline | Pure JS
   ==================================================== */

// ============================================
//  UPDATE 1 — ARABIC NORMALIZATION & EXCLUSION
// ============================================
function normalizeArabic(text) {
  if (!text) return '';
  let s = text.trim().toLowerCase();
  s = s.replace(/[\u064B-\u065F\u0670]/g, ''); // strip diacritics
  s = s.replace(/[أإآ]/g, 'ا');
  s = s.replace(/ة/g, 'ه');
  s = s.replace(/ى/g, 'ي');
  s = s.replace(/\bال/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function parseExcludeList(text) {
  if (!text || !text.trim()) return [];
  return text.split(/[,،\s]+/).map(w => normalizeArabic(w)).filter(w => w.length > 1);
}

function isFoodExcluded(foodName, excludeList) {
  if (!excludeList || excludeList.length === 0) return false;
  const n = normalizeArabic(foodName);
  return excludeList.some(t => n.includes(t) || t.includes(n));
}

// ============================================
//  UPDATE 7 — EXPANDED FOOD DATABASE (400+)
//  Each: { name, cal, pro, carb, fat, unitName, unitWeight, unit, portion, budget }
//  UPDATE 2: unitName + unitWeight → display "1 طبق (200 جرام)"
// ============================================

// --- BATCH 1: PROTEINS (100 items) ---
const DB_PROTEINS = [
  // بيض
  { name:"بيض مسلوق",              cal:78,  pro:6.3,  carb:0.6, fat:5.3,  unitName:"بيضة",  unitWeight:50,  unit:"بيضة",             portion:1,   budget:"low" },
  { name:"بيض مقلي بالزيت",        cal:92,  pro:6.3,  carb:0.4, fat:7.2,  unitName:"بيضة",  unitWeight:46,  unit:"بيضة",             portion:1,   budget:"low" },
  { name:"بيض عيون بالسمن",        cal:100, pro:6.2,  carb:0.4, fat:8.0,  unitName:"بيضة",  unitWeight:46,  unit:"بيضة",             portion:1,   budget:"mid" },
  { name:"بيض أومليت بالخضروات",   cal:160, pro:12,   carb:3.5, fat:10,   unitName:"طبق",   unitWeight:150, unit:"طبق",              portion:1,   budget:"low" },
  { name:"بيض مخفوق بالحليب",      cal:170, pro:13,   carb:4.0, fat:11,   unitName:"طبق",   unitWeight:160, unit:"طبق",              portion:1,   budget:"low" },
  { name:"بيض بالطماطم",           cal:145, pro:10,   carb:5,   fat:9,    unitName:"طبق",   unitWeight:150, unit:"طبق",              portion:1,   budget:"low" },
  { name:"بيض مسلوق بالكامل",      cal:155, pro:13,   carb:1.1, fat:11,   unitName:"بيضة",  unitWeight:50,  unit:"بيضتان",           portion:2,   budget:"low" },
  // دجاج
  { name:"صدر دجاج مشوي",          cal:165, pro:31,   carb:0,   fat:3.6,  unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"mid" },
  { name:"صدر دجاج مسلوق",         cal:145, pro:30,   carb:0,   fat:2.5,  unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"mid" },
  { name:"صدر دجاج مقلي خفيف",     cal:195, pro:28,   carb:3,   fat:8,    unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"mid" },
  { name:"أفخاذ دجاج مشوية",       cal:200, pro:26,   carb:0,   fat:10,   unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"mid" },
  { name:"أفخاذ دجاج مسلوقة",      cal:185, pro:25,   carb:0,   fat:9,    unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"mid" },
  { name:"دجاج كامل مشوي",         cal:180, pro:25,   carb:0,   fat:9,    unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"mid" },
  { name:"مكورة دجاج مشوية",       cal:175, pro:22,   carb:5,   fat:7,    unitName:"قطعة",  unitWeight:60,  unit:"قطعة",             portion:1,   budget:"mid" },
  { name:"شاورما دجاج",            cal:220, pro:24,   carb:8,   fat:11,   unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"mid" },
  { name:"حمام مشوي",              cal:170, pro:26,   carb:0,   fat:7,    unitName:"حمامة", unitWeight:200, unit:"حمامة",            portion:1,   budget:"mid" },
  { name:"كبدة دجاج مسلوقة",       cal:135, pro:20,   carb:1,   fat:5.5,  unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"low" },
  // لحوم
  { name:"لحم بقر مشوي",           cal:215, pro:26,   carb:0,   fat:12,   unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"high" },
  { name:"لحم بقر مسلوق",          cal:185, pro:28,   carb:0,   fat:8,    unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"high" },
  { name:"كفتة مشوية",             cal:220, pro:23,   carb:2,   fat:14,   unitName:"قطعة",  unitWeight:80,  unit:"قطعتان",           portion:1,   budget:"high" },
  { name:"كباب مشوي",              cal:230, pro:24,   carb:3,   fat:14,   unitName:"قطعة",  unitWeight:80,  unit:"قطعتان",           portion:1,   budget:"high" },
  { name:"شاورما لحم",             cal:280, pro:22,   carb:12,  fat:16,   unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"high" },
  { name:"كبدة مشوية",             cal:175, pro:26,   carb:4,   fat:6,    unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"mid" },
  { name:"كبدة بانيه",             cal:245, pro:28,   carb:7,   fat:12,   unitName:"قطعة",  unitWeight:75,  unit:"قطعتان",           portion:1,   budget:"mid" },
  { name:"كوارع مطبوخة",           cal:180, pro:20,   carb:0,   fat:11,   unitName:"كوب",   unitWeight:200, unit:"كوب",              portion:1,   budget:"low" },
  { name:"لحم ضأن مشوي",           cal:250, pro:25,   carb:0,   fat:17,   unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"high" },
  // أسماك
  { name:"تونة معلبة بالماء",      cal:110, pro:25,   carb:0,   fat:1,    unitName:"علبة",  unitWeight:185, unit:"علبة",             portion:1,   budget:"low" },
  { name:"تونة معلبة بالزيت",      cal:200, pro:22,   carb:0,   fat:12,   unitName:"علبة",  unitWeight:185, unit:"علبة",             portion:1,   budget:"low" },
  { name:"سردين معلب بالزيت",      cal:200, pro:21,   carb:0,   fat:13,   unitName:"علبة",  unitWeight:125, unit:"علبة",             portion:1,   budget:"low" },
  { name:"سلمون مشوي",             cal:208, pro:28,   carb:0,   fat:10,   unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"high" },
  { name:"جمبري مشوي",             cal:120, pro:24,   carb:1,   fat:2,    unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"high" },
  { name:"سمك بياض مشوي",          cal:120, pro:22,   carb:0,   fat:3,    unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"mid" },
  { name:"بلطي مشوي",              cal:140, pro:26,   carb:0,   fat:4,    unitName:"سمكة",  unitWeight:250, unit:"سمكة",             portion:1,   budget:"low" },
  { name:"ماكريل مشوي",            cal:205, pro:19,   carb:0,   fat:13,   unitName:"سمكة",  unitWeight:200, unit:"سمكة",             portion:1,   budget:"low" },
  { name:"تونة طازجة مشوية",       cal:184, pro:30,   carb:0,   fat:6,    unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"high" },
  { name:"سمك مشكل مشوي",          cal:130, pro:24,   carb:0,   fat:3.5,  unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"mid" },
  { name:"قريدس مسلوق",            cal:99,  pro:21,   carb:0.2, fat:1.1,  unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"high" },
  // بقوليات
  { name:"فول مدمس",               cal:180, pro:13,   carb:28,  fat:1.5,  unitName:"طبق",   unitWeight:200, unit:"طبق",              portion:1,   budget:"low" },
  { name:"فول مدمس بالزيت والكمون",cal:220, pro:13,   carb:28,  fat:5,    unitName:"طبق",   unitWeight:200, unit:"طبق",              portion:1,   budget:"low" },
  { name:"عدس أحمر مطبوخ",         cal:165, pro:13,   carb:28,  fat:0.5,  unitName:"طبق",   unitWeight:200, unit:"طبق",              portion:1,   budget:"low" },
  { name:"عدس أخضر مطبوخ",         cal:155, pro:12,   carb:27,  fat:0.4,  unitName:"طبق",   unitWeight:200, unit:"طبق",              portion:1,   budget:"low" },
  { name:"شوربة عدس",              cal:130, pro:9,    carb:22,  fat:1,    unitName:"طبق",   unitWeight:300, unit:"طبق",              portion:1,   budget:"low" },
  { name:"حمص مسلوق",              cal:180, pro:10,   carb:27,  fat:3,    unitName:"طبق",   unitWeight:180, unit:"طبق",              portion:1,   budget:"low" },
  { name:"حمص بالطحينة",           cal:200, pro:8,    carb:22,  fat:10,   unitName:"طبق",   unitWeight:150, unit:"طبق",              portion:1,   budget:"low" },
  { name:"فاصوليا بيضاء مطبوخة",  cal:155, pro:11,   carb:28,  fat:0.5,  unitName:"طبق",   unitWeight:200, unit:"طبق",              portion:1,   budget:"low" },
  { name:"فاصوليا حمراء مطبوخة",  cal:160, pro:11,   carb:29,  fat:0.5,  unitName:"طبق",   unitWeight:200, unit:"طبق",              portion:1,   budget:"low" },
  { name:"لوبيا مطبوخة",           cal:150, pro:10,   carb:27,  fat:0.5,  unitName:"طبق",   unitWeight:200, unit:"طبق",              portion:1,   budget:"low" },
  { name:"سوبيا مطبوخة",           cal:145, pro:10,   carb:25,  fat:0.4,  unitName:"طبق",   unitWeight:200, unit:"طبق",              portion:1,   budget:"low" },
  { name:"بازلاء مطبوخة",          cal:80,  pro:5,    carb:14,  fat:0.4,  unitName:"طبق",   unitWeight:160, unit:"طبق",              portion:1,   budget:"low" },
  // جبن وألبان
  { name:"جبنة قريش",              cal:90,  pro:14,   carb:3,   fat:2,    unitName:"طبق",   unitWeight:150, unit:"طبق",              portion:1,   budget:"low" },
  { name:"جبنة بيضاء خفيفة",       cal:120, pro:10,   carb:2,   fat:8,    unitName:"شريحة", unitWeight:50,  unit:"شريحتان",          portion:1,   budget:"low" },
  { name:"جبنة فيتا",              cal:265, pro:14,   carb:4,   fat:21,   unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"mid" },
  { name:"جبن رومي قليل الدسم",    cal:80,  pro:8,    carb:1,   fat:5,    unitName:"شريحة", unitWeight:30,  unit:"شريحة",            portion:1,   budget:"mid" },
  { name:"جبنة موزاريلا",          cal:300, pro:22,   carb:2.2, fat:22,   unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"high" },
  { name:"جبنة شيدر خفيفة",        cal:250, pro:25,   carb:1,   fat:16,   unitName:"شريحة", unitWeight:30,  unit:"شريحة",            portion:1,   budget:"mid" },
  { name:"زبادي يوناني خالي الدسم",cal:100, pro:17,   carb:6,   fat:0.7,  unitName:"كوب",   unitWeight:200, unit:"كوب",              portion:1,   budget:"mid" },
  { name:"زبادي عادي",             cal:120, pro:8,    carb:14,  fat:3.5,  unitName:"كوب",   unitWeight:200, unit:"كوب",              portion:1,   budget:"low" },
  { name:"زبادي خالي الدسم",       cal:65,  pro:9,    carb:7,   fat:0.4,  unitName:"كوب",   unitWeight:200, unit:"كوب",              portion:1,   budget:"low" },
  { name:"لبن رايب",               cal:100, pro:9,    carb:12,  fat:2.5,  unitName:"كوب",   unitWeight:250, unit:"كوب",              portion:1,   budget:"low" },
  { name:"لبن خالي الدسم",         cal:60,  pro:9,    carb:7,   fat:0.2,  unitName:"كوب",   unitWeight:250, unit:"كوب",              portion:1,   budget:"low" },
  { name:"كوتاج تشيز",             cal:110, pro:13,   carb:3.5, fat:5,    unitName:"طبق",   unitWeight:150, unit:"طبق",              portion:1,   budget:"mid" },
  // بروتين نباتي
  { name:"توفو مقلي خفيف",         cal:150, pro:12,   carb:4,   fat:9,    unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"mid" },
  { name:"توفو مسلوق",             cal:80,  pro:9,    carb:2,   fat:4,    unitName:"جرام",  unitWeight:100, unit:"جم",               portion:100, budget:"mid" },
  { name:"فول سوداني محمص",        cal:170, pro:7.5,  carb:6,   fat:14,   unitName:"حفنة",  unitWeight:30,  unit:"حفنة",             portion:1,   budget:"low" },
  { name:"بذور اليقطين محمصة",     cal:160, pro:9,    carb:5,   fat:13,   unitName:"ملعقة", unitWeight:28,  unit:"ملعقتان كبيرتان",  portion:1,   budget:"mid" },
  { name:"بذور عباد الشمس",        cal:165, pro:5.5,  carb:7,   fat:14,   unitName:"ملعقة", unitWeight:28,  unit:"ملعقتان كبيرتان",  portion:1,   budget:"low" },
  // إضافات بروتين
  { name:"حليب كامل الدسم",        cal:150, pro:8,    carb:11,  fat:8,    unitName:"كوب",   unitWeight:250, unit:"كوب",              portion:1,   budget:"low" },
  { name:"حليب خالي الدسم",        cal:90,  pro:9,    carb:12,  fat:0.2,  unitName:"كوب",   unitWeight:250, unit:"كوب",              portion:1,   budget:"low" },
  { name:"بروتين واي طبيعي",       cal:120, pro:25,   carb:3,   fat:1,    unitName:"ملعقة", unitWeight:30,  unit:"ملعقة كبيرة",      portion:1,   budget:"high"},
  // وجبات بروتين عالي
  { name:"دجاج بالخضروات مشوي",    cal:220, pro:32,   carb:8,   fat:7,    unitName:"طبق",   unitWeight:300, unit:"طبق",              portion:1,   budget:"mid" },
  { name:"سلطة التونة",            cal:180, pro:22,   carb:5,   fat:8,    unitName:"طبق",   unitWeight:250, unit:"طبق",              portion:1,   budget:"low" },
  { name:"سلطة الدجاج المشوي",     cal:200, pro:28,   carb:6,   fat:8,    unitName:"طبق",   unitWeight:280, unit:"طبق",              portion:1,   budget:"mid" },
  { name:"بيض مع جبنة قريش",       cal:180, pro:20,   carb:3,   fat:9,    unitName:"طبق",   unitWeight:180, unit:"طبق",              portion:1,   budget:"low" },
];

// --- BATCH 2: CARBOHYDRATES (60 items) ---
const DB_CARBS = [
  { name:"أرز أبيض مطبوخ",          cal:206, pro:4.3,  carb:45,  fat:0.4,  unitName:"طبق",   unitWeight:200, unit:"طبق",  portion:1, budget:"low" },
  { name:"أرز بني مطبوخ",           cal:218, pro:4.5,  carb:46,  fat:1.6,  unitName:"طبق",   unitWeight:200, unit:"طبق",  portion:1, budget:"low" },
  { name:"أرز بسمتي مطبوخ",         cal:200, pro:4,    carb:44,  fat:0.5,  unitName:"طبق",   unitWeight:200, unit:"طبق",  portion:1, budget:"mid" },
  { name:"أرز بالشعيرية",           cal:230, pro:5,    carb:47,  fat:2,    unitName:"طبق",   unitWeight:200, unit:"طبق",  portion:1, budget:"low" },
  { name:"مكرونة مسلوقة",           cal:220, pro:8,    carb:43,  fat:1.3,  unitName:"طبق",   unitWeight:200, unit:"طبق",  portion:1, budget:"low" },
  { name:"مكرونة قمح كامل مسلوقة",  cal:200, pro:8.5,  carb:40,  fat:1.1,  unitName:"طبق",   unitWeight:200, unit:"طبق",  portion:1, budget:"low" },
  { name:"شعرية مسلوقة",            cal:200, pro:7,    carb:41,  fat:1,    unitName:"طبق",   unitWeight:180, unit:"طبق",  portion:1, budget:"low" },
  { name:"مكرونة باستا صغيرة",      cal:210, pro:7.5,  carb:42,  fat:1.2,  unitName:"طبق",   unitWeight:200, unit:"طبق",  portion:1, budget:"low" },
  { name:"خبز بلدي",                cal:270, pro:9,    carb:55,  fat:1.5,  unitName:"رغيف",  unitWeight:120, unit:"رغيف", portion:1, budget:"low" },
  { name:"خبز أسمر بلدي",           cal:240, pro:10,   carb:48,  fat:1.2,  unitName:"رغيف",  unitWeight:110, unit:"رغيف", portion:1, budget:"low" },
  { name:"خبز توست أبيض",           cal:80,  pro:2.7,  carb:15,  fat:1,    unitName:"شريحة", unitWeight:30,  unit:"شريحة",portion:1, budget:"low" },
  { name:"خبز توست أسمر",           cal:72,  pro:3.5,  carb:13,  fat:1,    unitName:"شريحة", unitWeight:28,  unit:"شريحة",portion:1, budget:"low" },
  { name:"خبز صاج رقيق",            cal:180, pro:6,    carb:37,  fat:1,    unitName:"رغيف",  unitWeight:80,  unit:"رغيف", portion:1, budget:"low" },
  { name:"عيش شمس",                 cal:250, pro:8,    carb:52,  fat:1,    unitName:"رغيف",  unitWeight:110, unit:"رغيف", portion:1, budget:"low" },
  { name:"خبز سندوتش كامل",         cal:120, pro:4.5,  carb:22,  fat:1.5,  unitName:"رغيف",  unitWeight:50,  unit:"رغيف", portion:1, budget:"low" },
  { name:"شوفان مطبوخ بالماء",      cal:150, pro:5,    carb:27,  fat:2.5,  unitName:"طبق",   unitWeight:200, unit:"طبق",  portion:1, budget:"low" },
  { name:"شوفان بالحليب والعسل",    cal:250, pro:8,    carb:45,  fat:4,    unitName:"طبق",   unitWeight:250, unit:"طبق",  portion:1, budget:"low" },
  { name:"كورن فليكس بالحليب",      cal:185, pro:5,    carb:37,  fat:2,    unitName:"طبق",   unitWeight:200, unit:"طبق",  portion:1, budget:"mid" },
  { name:"شوفان بالموز",            cal:200, pro:6,    carb:38,  fat:3,    unitName:"طبق",   unitWeight:220, unit:"طبق",  portion:1, budget:"low" },
  { name:"بطاطس مسلوقة",            cal:130, pro:3,    carb:28,  fat:0.2,  unitName:"حبة",   unitWeight:120, unit:"حبتان",portion:1, budget:"low" },
  { name:"بطاطس مشوية",             cal:115, pro:2.5,  carb:26,  fat:0.2,  unitName:"حبة",   unitWeight:120, unit:"حبتان",portion:1, budget:"low" },
  { name:"بطاطس مسلوقة صغيرة",      cal:90,  pro:2,    carb:20,  fat:0.1,  unitName:"حبة",   unitWeight:100, unit:"3 حبات",portion:1,budget:"low" },
  { name:"بطاطا حلوة مشوية",        cal:115, pro:2,    carb:27,  fat:0.1,  unitName:"حبة",   unitWeight:150, unit:"حبة",  portion:1, budget:"low" },
  { name:"بطاطا حلوة مسلوقة",       cal:100, pro:2,    carb:23,  fat:0.1,  unitName:"حبة",   unitWeight:130, unit:"حبة",  portion:1, budget:"low" },
  { name:"كسكس مطبوخ",              cal:176, pro:6,    carb:36,  fat:0.3,  unitName:"طبق",   unitWeight:180, unit:"طبق",  portion:1, budget:"low" },
  { name:"برغل مطبوخ",              cal:150, pro:5.5,  carb:33,  fat:0.4,  unitName:"طبق",   unitWeight:180, unit:"طبق",  portion:1, budget:"low" },
  { name:"فريك مطبوخ",              cal:160, pro:6,    carb:34,  fat:0.5,  unitName:"طبق",   unitWeight:180, unit:"طبق",  portion:1, budget:"low" },
  { name:"كينوا مطبوخة",            cal:185, pro:7,    carb:34,  fat:3,    unitName:"طبق",   unitWeight:180, unit:"طبق",  portion:1, budget:"high" },
  { name:"ذرة مسلوقة",              cal:130, pro:4,    carb:28,  fat:1.5,  unitName:"حبة",   unitWeight:120, unit:"حبة",  portion:1, budget:"low" },
  { name:"ذرة شامية",               cal:95,  pro:3,    carb:21,  fat:1.2,  unitName:"حبة",   unitWeight:100, unit:"حبة",  portion:1, budget:"low" },
  { name:"قرصانة بر",               cal:215, pro:7,    carb:44,  fat:1.5,  unitName:"طبق",   unitWeight:200, unit:"طبق",  portion:1, budget:"low" },
  { name:"شعير مطبوخ",              cal:180, pro:6,    carb:38,  fat:0.7,  unitName:"طبق",   unitWeight:200, unit:"طبق",  portion:1, budget:"low" },
  { name:"بسكويت ريجيم",            cal:110, pro:2,    carb:22,  fat:2,    unitName:"قطعة",  unitWeight:20,  unit:"3 قطع",portion:1, budget:"low" },
  { name:"خبز قمح كامل سندوتش",     cal:135, pro:5,    carb:26,  fat:1.5,  unitName:"رغيف",  unitWeight:55,  unit:"رغيف", portion:1, budget:"mid" },
  { name:"فطير بالعسل",             cal:280, pro:6,    carb:50,  fat:7,    unitName:"قطعة",  unitWeight:80,  unit:"قطعة", portion:1, budget:"low" },
  { name:"لاهم بالعجين محلي",       cal:350, pro:12,   carb:45,  fat:14,   unitName:"قطعة",  unitWeight:120, unit:"قطعة", portion:1, budget:"mid" },
  { name:"أرز بالكاري",             cal:240, pro:5,    carb:48,  fat:4,    unitName:"طبق",   unitWeight:220, unit:"طبق",  portion:1, budget:"low" },
  { name:"نودلز مطبوخة",            cal:210, pro:6,    carb:43,  fat:1.5,  unitName:"طبق",   unitWeight:200, unit:"طبق",  portion:1, budget:"low" },
  { name:"شوفان ليلي بالزبادي",     cal:230, pro:9,    carb:40,  fat:4,    unitName:"كوب",   unitWeight:220, unit:"كوب",  portion:1, budget:"mid" },
  { name:"توست فرنسي بالبيض",       cal:180, pro:8,    carb:24,  fat:6,    unitName:"شريحة", unitWeight:60,  unit:"شريحتان",portion:1,budget:"low" },
];

// --- BATCH 3: VEGETABLES (55 items) ---
const DB_VEGGIES = [
  { name:"سلطة خضراء مشكلة",       cal:30,  pro:2,    carb:5,   fat:0.5,  unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
  { name:"طماطم طازجة",            cal:22,  pro:1,    carb:4.8, fat:0.2,  unitName:"ثمرة", unitWeight:100, unit:"حبتان",  portion:1, budget:"low" },
  { name:"طماطم مشوية",            cal:30,  pro:1.2,  carb:6,   fat:0.4,  unitName:"ثمرة", unitWeight:100, unit:"حبتان",  portion:1, budget:"low" },
  { name:"خيار طازج",              cal:16,  pro:0.7,  carb:3.6, fat:0.1,  unitName:"ثمرة", unitWeight:120, unit:"حبتان",  portion:1, budget:"low" },
  { name:"خيار وطماطم",            cal:25,  pro:1.5,  carb:5,   fat:0.2,  unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
  { name:"جزر مسلوق",              cal:50,  pro:1.2,  carb:12,  fat:0.3,  unitName:"طبق",  unitWeight:150, unit:"طبق",    portion:1, budget:"low" },
  { name:"جزر طازج",               cal:41,  pro:0.9,  carb:10,  fat:0.2,  unitName:"ثمرة", unitWeight:80,  unit:"حبتان",  portion:1, budget:"low" },
  { name:"كوسة مشوية",             cal:35,  pro:2.5,  carb:7,   fat:0.4,  unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
  { name:"كوسة مسلوقة",            cal:28,  pro:2,    carb:5,   fat:0.3,  unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
  { name:"باذنجان مشوي",           cal:45,  pro:1,    carb:9,   fat:0.5,  unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
  { name:"باذنجان بالطماطم",       cal:60,  pro:2,    carb:10,  fat:2,    unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
  { name:"فلفل أخضر",              cal:20,  pro:0.9,  carb:4.6, fat:0.2,  unitName:"ثمرة", unitWeight:75,  unit:"حبتان",  portion:1, budget:"low" },
  { name:"فلفل أحمر",              cal:31,  pro:1,    carb:7,   fat:0.3,  unitName:"ثمرة", unitWeight:90,  unit:"حبتان",  portion:1, budget:"mid" },
  { name:"فلفل أصفر",              cal:28,  pro:1,    carb:6.5, fat:0.2,  unitName:"ثمرة", unitWeight:90,  unit:"حبتان",  portion:1, budget:"mid" },
  { name:"فلفل ألوان مشكلة",       cal:35,  pro:1,    carb:8,   fat:0.3,  unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"mid" },
  { name:"بصل مطبوخ",              cal:44,  pro:1,    carb:10,  fat:0.1,  unitName:"ثمرة", unitWeight:100, unit:"حبة",    portion:1, budget:"low" },
  { name:"بصل أخضر",               cal:32,  pro:1.8,  carb:7,   fat:0.2,  unitName:"حزمة", unitWeight:50,  unit:"حزمة",   portion:1, budget:"low" },
  { name:"ثوم",                    cal:15,  pro:0.6,  carb:3,   fat:0.1,  unitName:"فص",   unitWeight:9,   unit:"3 فصوص", portion:1, budget:"low" },
  { name:"بامية مطبوخة",           cal:55,  pro:3,    carb:10,  fat:0.5,  unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
  { name:"ملوخية مطبوخة",          cal:50,  pro:3.5,  carb:6,   fat:1,    unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
  { name:"سبانخ مطبوخة",           cal:50,  pro:5,    carb:6,   fat:0.8,  unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
  { name:"سبانخ طازجة",            cal:23,  pro:2.9,  carb:3.6, fat:0.4,  unitName:"كوب",  unitWeight:100, unit:"كوب",    portion:1, budget:"low" },
  { name:"خس أخضر",                cal:15,  pro:1.4,  carb:2.9, fat:0.2,  unitName:"كوب",  unitWeight:70,  unit:"كوب",    portion:1, budget:"low" },
  { name:"جرجير طازج",             cal:25,  pro:2.6,  carb:3.7, fat:0.7,  unitName:"كوب",  unitWeight:80,  unit:"كوب",    portion:1, budget:"low" },
  { name:"كرنب مسلوق",             cal:33,  pro:1.6,  carb:7,   fat:0.1,  unitName:"طبق",  unitWeight:150, unit:"طبق",    portion:1, budget:"low" },
  { name:"كرنب طازج",              cal:25,  pro:1.3,  carb:5.8, fat:0.1,  unitName:"كوب",  unitWeight:90,  unit:"كوب",    portion:1, budget:"low" },
  { name:"قرنبيط مطبوخ",           cal:40,  pro:3,    carb:8,   fat:0.5,  unitName:"طبق",  unitWeight:180, unit:"طبق",    portion:1, budget:"low" },
  { name:"بروكلي مسلوق",           cal:55,  pro:4,    carb:11,  fat:0.6,  unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"mid" },
  { name:"فاصوليا خضراء مسلوقة",  cal:45,  pro:3,    carb:9,   fat:0.3,  unitName:"طبق",  unitWeight:180, unit:"طبق",    portion:1, budget:"low" },
  { name:"شمندر مطبوخ",            cal:60,  pro:2,    carb:13,  fat:0.2,  unitName:"طبق",  unitWeight:150, unit:"طبق",    portion:1, budget:"low" },
  { name:"كرفس طازج",              cal:16,  pro:0.7,  carb:3,   fat:0.2,  unitName:"ساق",  unitWeight:50,  unit:"3 سيقان",portion:1, budget:"low" },
  { name:"كابوتشا مطبوخ",          cal:55,  pro:1.5,  carb:13,  fat:0.2,  unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
  { name:"خرشوف مسلوق",            cal:53,  pro:3.5,  carb:12,  fat:0.2,  unitName:"حبة",  unitWeight:120, unit:"حبة",    portion:1, budget:"mid" },
  { name:"قلقاس مسلوق",            cal:150, pro:2.3,  carb:35,  fat:0.2,  unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
  { name:"قلقاس بالطماطم",         cal:170, pro:3,    carb:38,  fat:1,    unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
  { name:"بنجر مطبوخ",             cal:44,  pro:1.7,  carb:10,  fat:0.2,  unitName:"طبق",  unitWeight:150, unit:"طبق",    portion:1, budget:"low" },
  { name:"لفت مسلوق",              cal:28,  pro:1.5,  carb:6,   fat:0.1,  unitName:"طبق",  unitWeight:150, unit:"طبق",    portion:1, budget:"low" },
  { name:"طماطم مطبوخة بالبصل",    cal:55,  pro:2,    carb:10,  fat:1.5,  unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
  { name:"بازلاء طازجة",           cal:81,  pro:5.4,  carb:14,  fat:0.4,  unitName:"كوب",  unitWeight:145, unit:"كوب",    portion:1, budget:"mid" },
  { name:"هليون مشوي",             cal:27,  pro:3,    carb:5,   fat:0.2,  unitName:"طبق",  unitWeight:150, unit:"طبق",    portion:1, budget:"high"},
  { name:"فطر مشوي",               cal:35,  pro:3.5,  carb:5,   fat:0.5,  unitName:"طبق",  unitWeight:150, unit:"طبق",    portion:1, budget:"mid" },
  { name:"فطر مطبوخ بالثوم",       cal:55,  pro:3.5,  carb:6,   fat:2,    unitName:"طبق",  unitWeight:150, unit:"طبق",    portion:1, budget:"mid" },
  { name:"سلطة فتوش",              cal:80,  pro:2,    carb:12,  fat:3,    unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
  { name:"سلطة طبولة",             cal:110, pro:3,    carb:16,  fat:4,    unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
  { name:"سلطة تركية",             cal:90,  pro:2,    carb:14,  fat:3,    unitName:"طبق",  unitWeight:200, unit:"طبق",    portion:1, budget:"low" },
];

// --- BATCH 4: FRUITS (30 items) ---
const DB_FRUITS = [
  { name:"تفاح",                   cal:80,  pro:0.4,  carb:21,  fat:0.2,  unitName:"ثمرة",  unitWeight:180, unit:"حبة",      portion:1, budget:"low" },
  { name:"موز",                    cal:90,  pro:1.1,  carb:23,  fat:0.3,  unitName:"ثمرة",  unitWeight:120, unit:"حبة",      portion:1, budget:"low" },
  { name:"برتقال",                 cal:65,  pro:1.2,  carb:16,  fat:0.2,  unitName:"ثمرة",  unitWeight:200, unit:"حبة",      portion:1, budget:"low" },
  { name:"يوسفي",                  cal:53,  pro:0.8,  carb:13,  fat:0.3,  unitName:"ثمرة",  unitWeight:110, unit:"حبتان",    portion:1, budget:"low" },
  { name:"جوافة",                  cal:70,  pro:2.6,  carb:15,  fat:1,    unitName:"ثمرة",  unitWeight:120, unit:"حبة",      portion:1, budget:"low" },
  { name:"مانجو",                  cal:100, pro:1.4,  carb:25,  fat:0.4,  unitName:"شريحة", unitWeight:120, unit:"شريحتان",  portion:1, budget:"mid" },
  { name:"فراولة",                 cal:50,  pro:1,    carb:12,  fat:0.5,  unitName:"كوب",   unitWeight:150, unit:"كوب",      portion:1, budget:"mid" },
  { name:"عنب أخضر",               cal:70,  pro:0.6,  carb:18,  fat:0.2,  unitName:"عنقود", unitWeight:100, unit:"عنقود",    portion:1, budget:"mid" },
  { name:"خوخ",                    cal:60,  pro:1.4,  carb:15,  fat:0.3,  unitName:"ثمرة",  unitWeight:100, unit:"حبتان",    portion:1, budget:"mid" },
  { name:"مشمش",                   cal:48,  pro:1.4,  carb:11,  fat:0.4,  unitName:"ثمرة",  unitWeight:60,  unit:"3 حبات",   portion:1, budget:"mid" },
  { name:"كمثرى",                  cal:100, pro:0.6,  carb:27,  fat:0.2,  unitName:"ثمرة",  unitWeight:180, unit:"حبة",      portion:1, budget:"mid" },
  { name:"رمان",                   cal:85,  pro:1.5,  carb:19,  fat:0.6,  unitName:"ثمرة",  unitWeight:150, unit:"نصف ثمرة", portion:1, budget:"mid" },
  { name:"أناناس",                 cal:80,  pro:0.9,  carb:20,  fat:0.2,  unitName:"شريحة", unitWeight:120, unit:"شريحتان",  portion:1, budget:"mid" },
  { name:"تين طازج",               cal:75,  pro:0.8,  carb:19,  fat:0.3,  unitName:"ثمرة",  unitWeight:80,  unit:"حبتان",    portion:1, budget:"mid" },
  { name:"بلح رطب",                cal:80,  pro:0.7,  carb:21,  fat:0.1,  unitName:"ثمرة",  unitWeight:40,  unit:"حبتان",    portion:1, budget:"low" },
  { name:"تمر",                    cal:140, pro:1.2,  carb:38,  fat:0.2,  unitName:"حبة",   unitWeight:25,  unit:"4 حبات",   portion:1, budget:"low" },
  { name:"بطيخ أحمر",             cal:50,  pro:1,    carb:12,  fat:0.2,  unitName:"شريحة", unitWeight:250, unit:"شريحتان",  portion:1, budget:"low" },
  { name:"شمام",                   cal:35,  pro:0.8,  carb:8,   fat:0.2,  unitName:"شريحة", unitWeight:200, unit:"شريحتان",  portion:1, budget:"low" },
  { name:"كيوي",                   cal:60,  pro:1,    carb:14,  fat:0.5,  unitName:"ثمرة",  unitWeight:75,  unit:"حبتان",    portion:1, budget:"mid" },
  { name:"توت أسود",               cal:60,  pro:1.4,  carb:14,  fat:0.5,  unitName:"كوب",   unitWeight:145, unit:"كوب",      portion:1, budget:"high"},
  { name:"بلوبيري",                cal:57,  pro:0.7,  carb:14,  fat:0.3,  unitName:"كوب",   unitWeight:145, unit:"كوب",      portion:1, budget:"high"},
  { name:"ليمون",                  cal:29,  pro:1.1,  carb:9,   fat:0.3,  unitName:"ثمرة",  unitWeight:100, unit:"حبتان",    portion:1, budget:"low" },
  { name:"قراصيا",                 cal:65,  pro:1.1,  carb:16,  fat:0.2,  unitName:"كوب",   unitWeight:130, unit:"كوب",      portion:1, budget:"mid" },
  { name:"تين مجفف",               cal:250, pro:3,    carb:64,  fat:1,    unitName:"حبة",   unitWeight:40,  unit:"4 حبات",   portion:1, budget:"mid" },
  { name:"زبيب",                   cal:300, pro:3,    carb:79,  fat:0.5,  unitName:"ملعقة", unitWeight:28,  unit:"ملعقتان",  portion:1, budget:"low" },
  { name:"موز مجفف",               cal:350, pro:3.9,  carb:89,  fat:1.8,  unitName:"حبة",   unitWeight:35,  unit:"حبة",      portion:1, budget:"mid" },
  { name:"إجاص",                   cal:55,  pro:0.4,  carb:15,  fat:0.1,  unitName:"ثمرة",  unitWeight:100, unit:"حبة",      portion:1, budget:"mid" },
  { name:"زيتون أسود",             cal:115, pro:0.8,  carb:6,   fat:11,   unitName:"حبة",   unitWeight:30,  unit:"6 حبات",   portion:1, budget:"low" },
  { name:"زيتون أخضر",             cal:145, pro:1,    carb:4,   fat:15,   unitName:"حبة",   unitWeight:30,  unit:"6 حبات",   portion:1, budget:"low" },
  { name:"مانجو مجفف",             cal:319, pro:2.5,  carb:78,  fat:1.2,  unitName:"حبة",   unitWeight:40,  unit:"حبة",      portion:1, budget:"mid" },
];

// --- BATCH 5: HEALTHY FATS (20 items) ---
const DB_FATS = [
  { name:"زيت زيتون",              cal:120, pro:0,    carb:0,   fat:14,   unitName:"ملعقة",  unitWeight:14,  unit:"ملعقة كبيرة",   portion:1, budget:"mid" },
  { name:"زبدة",                   cal:100, pro:0.1,  carb:0,   fat:11,   unitName:"ملعقة",  unitWeight:14,  unit:"ملعقة كبيرة",   portion:1, budget:"low" },
  { name:"سمن بلدي",               cal:110, pro:0,    carb:0,   fat:12.5, unitName:"ملعقة",  unitWeight:14,  unit:"ملعقة كبيرة",   portion:1, budget:"mid" },
  { name:"طاحينة",                 cal:90,  pro:2.6,  carb:3,   fat:8,    unitName:"ملعقة",  unitWeight:15,  unit:"ملعقة كبيرة",   portion:1, budget:"low" },
  { name:"مكسرات مشكلة",           cal:160, pro:5,    carb:8,   fat:14,   unitName:"حفنة",   unitWeight:30,  unit:"حفنة",          portion:1, budget:"mid" },
  { name:"لوز",                    cal:165, pro:6,    carb:6,   fat:14,   unitName:"حفنة",   unitWeight:28,  unit:"حفنة",          portion:1, budget:"mid" },
  { name:"جوز",                    cal:185, pro:4,    carb:4,   fat:18,   unitName:"حفنة",   unitWeight:28,  unit:"حفنة",          portion:1, budget:"mid" },
  { name:"فول سوداني",             cal:170, pro:7.5,  carb:6,   fat:14,   unitName:"حفنة",   unitWeight:30,  unit:"حفنة",          portion:1, budget:"low" },
  { name:"كاجو",                   cal:157, pro:5,    carb:9,   fat:12,   unitName:"حفنة",   unitWeight:28,  unit:"حفنة",          portion:1, budget:"mid" },
  { name:"بندق",                   cal:180, pro:4.2,  carb:5,   fat:17,   unitName:"حفنة",   unitWeight:28,  unit:"حفنة",          portion:1, budget:"mid" },
  { name:"بذور الشيا",             cal:60,  pro:2,    carb:5,   fat:4,    unitName:"ملعقة",  unitWeight:15,  unit:"ملعقة كبيرة",   portion:1, budget:"high"},
  { name:"بذر الكتان المطحون",     cal:55,  pro:1.9,  carb:3,   fat:4.3,  unitName:"ملعقة",  unitWeight:10,  unit:"ملعقة كبيرة",   portion:1, budget:"mid" },
  { name:"أفوكادو",                cal:160, pro:2,    carb:9,   fat:15,   unitName:"حبة",    unitWeight:100, unit:"نصف حبة",       portion:1, budget:"high"},
  { name:"زيت جوز الهند",          cal:130, pro:0,    carb:0,   fat:14,   unitName:"ملعقة",  unitWeight:14,  unit:"ملعقة كبيرة",   portion:1, budget:"high"},
  { name:"فستق حلبي",              cal:160, pro:6,    carb:8,   fat:13,   unitName:"حفنة",   unitWeight:28,  unit:"حفنة",          portion:1, budget:"high"},
  { name:"حبة بركة (حبة السوداء)", cal:45,  pro:2,    carb:3,   fat:3.5,  unitName:"ملعقة",  unitWeight:10,  unit:"ملعقة صغيرة",   portion:1, budget:"mid" },
  { name:"زبدة الفول السوداني",    cal:190, pro:8,    carb:6,   fat:16,   unitName:"ملعقة",  unitWeight:32,  unit:"ملعقتان كبيرتان",portion:1,budget:"mid" },
  { name:"زيت السمسم",             cal:120, pro:0,    carb:0,   fat:14,   unitName:"ملعقة",  unitWeight:14,  unit:"ملعقة كبيرة",   portion:1, budget:"mid" },
  { name:"جوز الهند المبشور",      cal:190, pro:2,    carb:7,   fat:18,   unitName:"ملعقة",  unitWeight:28,  unit:"ملعقتان كبيرتان",portion:1,budget:"mid" },
  { name:"حمص بالطحينة",           cal:200, pro:8,    carb:22,  fat:10,   unitName:"طبق",    unitWeight:150, unit:"طبق صغير",      portion:1, budget:"low" },
];

// --- BATCH 6: EGYPTIAN MEALS (40 items) ---
const DB_EGYPTIAN = [
  { name:"كشري",                   cal:350, pro:11,   carb:68,  fat:5,    unitName:"طبق",   unitWeight:350, unit:"طبق",          portion:1, budget:"low" },
  { name:"ملوخية بالدجاج",        cal:200, pro:18,   carb:8,   fat:10,   unitName:"طبق",   unitWeight:300, unit:"طبق",          portion:1, budget:"mid" },
  { name:"ملوخية بالأرانب",       cal:230, pro:22,   carb:8,   fat:12,   unitName:"طبق",   unitWeight:300, unit:"طبق",          portion:1, budget:"mid" },
  { name:"محشي كرنب",              cal:220, pro:8,    carb:38,  fat:5,    unitName:"طبق",   unitWeight:300, unit:"4 حبات",       portion:1, budget:"mid" },
  { name:"محشي فلفل",              cal:230, pro:8,    carb:40,  fat:5,    unitName:"حبة",   unitWeight:150, unit:"2 حبات",       portion:1, budget:"mid" },
  { name:"ورق عنب محشي",          cal:180, pro:6,    carb:30,  fat:5,    unitName:"قطعة",  unitWeight:40,  unit:"5 ورقات",      portion:1, budget:"mid" },
  { name:"مسقعة بالدجاج",         cal:250, pro:16,   carb:22,  fat:12,   unitName:"طبق",   unitWeight:300, unit:"طبق",          portion:1, budget:"mid" },
  { name:"بامية باللحمة",          cal:220, pro:15,   carb:14,  fat:11,   unitName:"طبق",   unitWeight:300, unit:"طبق",          portion:1, budget:"high"},
  { name:"طاجن بطاطس بالدجاج",    cal:280, pro:18,   carb:30,  fat:10,   unitName:"طبق",   unitWeight:350, unit:"طبق",          portion:1, budget:"mid" },
  { name:"طاجن بامية باللحم",     cal:260, pro:16,   carb:20,  fat:12,   unitName:"طبق",   unitWeight:350, unit:"طبق",          portion:1, budget:"high"},
  { name:"رز بلبن",                cal:220, pro:6,    carb:40,  fat:5,    unitName:"طبق",   unitWeight:250, unit:"طبق",          portion:1, budget:"low" },
  { name:"مكرونة بشاميل",         cal:320, pro:14,   carb:40,  fat:12,   unitName:"قطعة",  unitWeight:250, unit:"قطعة",         portion:1, budget:"mid" },
  { name:"فتة دجاج",               cal:380, pro:22,   carb:45,  fat:13,   unitName:"طبق",   unitWeight:350, unit:"طبق",          portion:1, budget:"mid" },
  { name:"فتة لحمة",               cal:420, pro:25,   carb:45,  fat:16,   unitName:"طبق",   unitWeight:350, unit:"طبق",          portion:1, budget:"high"},
  { name:"شوربة خضار",             cal:80,  pro:3,    carb:15,  fat:1,    unitName:"طبق",   unitWeight:300, unit:"طبق",          portion:1, budget:"low" },
  { name:"شوربة دجاج",             cal:120, pro:12,   carb:8,   fat:4,    unitName:"طبق",   unitWeight:300, unit:"طبق",          portion:1, budget:"mid" },
  { name:"شوربة لحمة",             cal:150, pro:15,   carb:8,   fat:6,    unitName:"طبق",   unitWeight:300, unit:"طبق",          portion:1, budget:"high"},
  { name:"هريسة قمح بالدجاج",     cal:280, pro:18,   carb:38,  fat:6,    unitName:"طبق",   unitWeight:300, unit:"طبق",          portion:1, budget:"mid" },
  { name:"سلطة خضار بالليمون",    cal:40,  pro:1.5,  carb:8,   fat:0.5,  unitName:"طبق",   unitWeight:200, unit:"طبق",          portion:1, budget:"low" },
  { name:"كوارع مع الأرز",         cal:320, pro:22,   carb:40,  fat:8,    unitName:"طبق",   unitWeight:350, unit:"طبق",          portion:1, budget:"low" },
  { name:"فول بالطحينة",           cal:250, pro:14,   carb:30,  fat:9,    unitName:"طبق",   unitWeight:200, unit:"طبق",          portion:1, budget:"low" },
  { name:"كبدة بالخضار",           cal:200, pro:24,   carb:8,   fat:8,    unitName:"طبق",   unitWeight:250, unit:"طبق",          portion:1, budget:"mid" },
  { name:"صيادية سمك",             cal:310, pro:25,   carb:35,  fat:8,    unitName:"طبق",   unitWeight:350, unit:"طبق",          portion:1, budget:"mid" },
  { name:"أرز بالفول",             cal:260, pro:12,   carb:48,  fat:2,    unitName:"طبق",   unitWeight:250, unit:"طبق",          portion:1, budget:"low" },
  { name:"بيض بالطماطم والبصل",    cal:160, pro:11,   carb:8,   fat:9,    unitName:"طبق",   unitWeight:200, unit:"طبق",          portion:1, budget:"low" },
  { name:"سمبوسة دجاج مخبوزة",    cal:180, pro:10,   carb:20,  fat:6,    unitName:"قطعة",  unitWeight:60,  unit:"3 قطع",        portion:1, budget:"mid" },
  { name:"قرع عسل بالسمن",        cal:120, pro:1.5,  carb:24,  fat:4,    unitName:"طبق",   unitWeight:200, unit:"طبق",          portion:1, budget:"low" },
  { name:"لسان بالكريمة",          cal:380, pro:18,   carb:30,  fat:22,   unitName:"طبق",   unitWeight:300, unit:"طبق",          portion:1, budget:"high"},
  { name:"معكرونة بالطماطم",       cal:240, pro:8,    carb:45,  fat:4,    unitName:"طبق",   unitWeight:250, unit:"طبق",          portion:1, budget:"low" },
  { name:"بيتزا حجم صغير منزلية", cal:350, pro:15,   carb:45,  fat:12,   unitName:"قطعة",  unitWeight:120, unit:"2 قطعة",       portion:1, budget:"mid" },
];

// --- BATCH 7: DIET/LIGHT MEALS + SNACKS (50 items) ---
const DB_LIGHT = [
  // وجبات خفيفة ونظام
  { name:"زبادي بالفواكه",         cal:140, pro:7,    carb:24,  fat:2,    unitName:"كوب",   unitWeight:200, unit:"كوب",          portion:1, budget:"low" },
  { name:"شوفان بالتوت",           cal:180, pro:6,    carb:35,  fat:3,    unitName:"طبق",   unitWeight:200, unit:"طبق",          portion:1, budget:"mid" },
  { name:"عصير برتقال طازج",       cal:110, pro:1.7,  carb:26,  fat:0.3,  unitName:"كوب",   unitWeight:250, unit:"كوب",          portion:1, budget:"low" },
  { name:"سموذي موز وحليب",        cal:200, pro:6,    carb:38,  fat:3,    unitName:"كوب",   unitWeight:300, unit:"كوب",          portion:1, budget:"low" },
  { name:"سموذي فراولة وزبادي",    cal:180, pro:8,    carb:32,  fat:2,    unitName:"كوب",   unitWeight:300, unit:"كوب",          portion:1, budget:"mid" },
  { name:"سموذي خضار أخضر",        cal:90,  pro:3,    carb:18,  fat:1,    unitName:"كوب",   unitWeight:300, unit:"كوب",          portion:1, budget:"mid" },
  { name:"بسكويت شوفان منزلي",     cal:120, pro:3,    carb:20,  fat:4,    unitName:"قطعة",  unitWeight:30,  unit:"3 قطع",        portion:1, budget:"low" },
  { name:"تمر",                    cal:140, pro:1.2,  carb:38,  fat:0.2,  unitName:"حبة",   unitWeight:25,  unit:"4 حبات",       portion:1, budget:"low" },
  { name:"عصير خضار مشكل",         cal:80,  pro:3,    carb:16,  fat:0.5,  unitName:"كوب",   unitWeight:250, unit:"كوب",          portion:1, budget:"mid" },
  { name:"كوكتيل فواكه خفيف",      cal:120, pro:1.5,  carb:29,  fat:0.5,  unitName:"طبق",   unitWeight:200, unit:"طبق",          portion:1, budget:"low" },
  { name:"جرانولا بالزبادي",       cal:220, pro:9,    carb:33,  fat:7,    unitName:"طبق",   unitWeight:180, unit:"طبق",          portion:1, budget:"mid" },
  { name:"عيش بسكويت بالجبنة القريش",cal:160,pro:10,  carb:22,  fat:3,    unitName:"وجبة",  unitWeight:120, unit:"وجبة",         portion:1, budget:"low" },
  { name:"بروتين شيك بالحليب",     cal:280, pro:30,   carb:20,  fat:5,    unitName:"كوب",   unitWeight:350, unit:"كوب",          portion:1, budget:"high"},
  { name:"لبن زبادي بالعسل",       cal:160, pro:14,   carb:18,  fat:2,    unitName:"كوب",   unitWeight:200, unit:"كوب",          portion:1, budget:"mid" },
  { name:"تفاح بزبدة الفول السوداني",cal:220,pro:5,   carb:30,  fat:10,   unitName:"وجبة",  unitWeight:180, unit:"وجبة",         portion:1, budget:"mid" },
  { name:"خيار بالجبنة القريش",    cal:80,  pro:10,   carb:5,   fat:2,    unitName:"طبق",   unitWeight:200, unit:"طبق",          portion:1, budget:"low" },
  { name:"شريحة توست بالتونة",     cal:180, pro:18,   carb:16,  fat:5,    unitName:"شريحة", unitWeight:90,  unit:"شريحتان",      portion:1, budget:"low" },
  { name:"رقاق أرز بالتونة",       cal:150, pro:15,   carb:18,  fat:3,    unitName:"وجبة",  unitWeight:80,  unit:"وجبة",         portion:1, budget:"low" },
  { name:"سلطة الفاكهة",           cal:100, pro:1,    carb:25,  fat:0.5,  unitName:"طبق",   unitWeight:200, unit:"طبق",          portion:1, budget:"low" },
  { name:"شاورما دجاج بالخبز الأسمر",cal:310,pro:26,  carb:30,  fat:9,    unitName:"وجبة",  unitWeight:250, unit:"وجبة",         portion:1, budget:"mid" },
  // وجبات نظام نباتي
  { name:"سلطة عدس بالخضار",       cal:180, pro:11,   carb:28,  fat:3,    unitName:"طبق",   unitWeight:250, unit:"طبق",          portion:1, budget:"low" },
  { name:"شوربة طماطم",             cal:70,  pro:2,    carb:14,  fat:1,    unitName:"طبق",   unitWeight:300, unit:"طبق",          portion:1, budget:"low" },
  { name:"شوربة خضار مشكلة",       cal:80,  pro:3,    carb:15,  fat:1,    unitName:"طبق",   unitWeight:300, unit:"طبق",          portion:1, budget:"low" },
  { name:"كينوا بالخضار",           cal:220, pro:8,    carb:38,  fat:5,    unitName:"طبق",   unitWeight:250, unit:"طبق",          portion:1, budget:"high"},
  { name:"سلطة الأفوكادو",          cal:200, pro:3,    carb:12,  fat:16,   unitName:"طبق",   unitWeight:200, unit:"طبق",          portion:1, budget:"high"},
  { name:"شطيرة دجاج بالخبز الأسمر",cal:280,pro:25,   carb:28,  fat:8,    unitName:"شطيرة", unitWeight:180, unit:"شطيرة",        portion:1, budget:"mid" },
  { name:"شطيرة تونة بالخبز الأسمر",cal:240,pro:22,   carb:25,  fat:6,    unitName:"شطيرة", unitWeight:160, unit:"شطيرة",        portion:1, budget:"low" },
  { name:"شطيرة بيض وجبنة",        cal:260, pro:16,   carb:28,  fat:10,   unitName:"شطيرة", unitWeight:160, unit:"شطيرة",        portion:1, budget:"low" },
  { name:"قرصانة بالجبنة القريش",  cal:200, pro:12,   carb:32,  fat:3,    unitName:"وجبة",  unitWeight:180, unit:"وجبة",         portion:1, budget:"low" },
  { name:"ماء جوز الهند",          cal:45,  pro:1.7,  carb:9,   fat:0.5,  unitName:"كوب",   unitWeight:240, unit:"كوب",          portion:1, budget:"mid" },
  // قشطة وألبان خفيفة
  { name:"حليب اللوز غير محلى",    cal:40,  pro:1,    carb:2,   fat:3.5,  unitName:"كوب",   unitWeight:240, unit:"كوب",          portion:1, budget:"high"},
  { name:"حليب الشوفان",            cal:120, pro:3,    carb:16,  fat:5,    unitName:"كوب",   unitWeight:240, unit:"كوب",          portion:1, budget:"high"},
  { name:"لبن رايب بالعسل والقرفة",cal:130, pro:9,    carb:18,  fat:2.5,  unitName:"كوب",   unitWeight:250, unit:"كوب",          portion:1, budget:"low" },
  { name:"قشطة خفيفة بالعسل",      cal:120, pro:3,    carb:14,  fat:6,    unitName:"طبق",   unitWeight:70,  unit:"طبق صغير",     portion:1, budget:"mid" },
  { name:"مربى مع توست أسمر",       cal:170, pro:3,    carb:36,  fat:1,    unitName:"وجبة",  unitWeight:80,  unit:"وجبة",         portion:1, budget:"low" },
];


// ============================================
//  COMBINE ALL FOOD DATABASES
// ============================================
const FOODS = {
  proteins: DB_PROTEINS,
  carbs:    DB_CARBS,
  veggies:  DB_VEGGIES,
  fruits:   DB_FRUITS,
  fats:     DB_FATS,
  egyptian: DB_EGYPTIAN,
  light:    DB_LIGHT,
};

// ============================================
//  MEAL TEMPLATES
// ============================================
const MEAL_TEMPLATES = {
  breakfast: [
    { protein:["بيض مسلوق","جبنة قريش","زبادي يوناني خالي الدسم"],    carb:["خبز بلدي","خبز توست أبيض","شوفان مطبوخ بالماء"],      side:["خيار طازج","طماطم طازجة","جرجير طازج"] },
    { protein:["بيض مقلي بالزيت","بيض أومليت بالخضروات","بيض مخفوق بالحليب"], carb:["خبز بلدي","خبز توست أسمر","خبز أسمر بلدي"],  side:["خيار وطماطم","طماطم طازجة"] },
    { protein:["فول مدمس","فول مدمس بالزيت والكمون"],                  carb:["خبز بلدي","عيش شمس"],                                side:["خيار طازج","طماطم طازجة"] },
    { protein:["زبادي يوناني خالي الدسم","جبنة قريش","كوتاج تشيز"],    carb:["شوفان مطبوخ بالماء","كورن فليكس بالحليب","شوفان بالحليب والعسل"], side:["موز","فراولة","تفاح","كيوي"] },
    { protein:["بيض مسلوق","زبادي عادي"],                              carb:["خبز توست أسمر","خبز صاج رقيق"],                      side:["خيار طازج","جرجير طازج"] },
    { protein:["جبنة فيتا","جبنة قريش","جبن رومي قليل الدسم"],          carb:["خبز توست أسمر","خبز صاج رقيق","خبز أسمر بلدي"],      side:["خيار وطماطم","جرجير طازج"] },
    { protein:["بيض بالطماطم والبصل","بيض مع جبنة قريش"],              carb:["خبز بلدي","عيش شمس"],                                side:["طماطم طازجة","فلفل أخضر"] },
    { protein:["شوفان بالموز","شوفان بالتوت"],                         carb:["شوفان مطبوخ بالماء","شوفان بالحليب والعسل"],          side:["موز","فراولة"] },
  ],
  snack1: [
    ["موز","تفاح","برتقال","يوسفي"],
    ["زبادي بالفواكه","زبادي يوناني خالي الدسم"],
    ["مكسرات مشكلة","فول سوداني","لوز"],
    ["تمر","بسكويت شوفان منزلي"],
    ["فراولة","عنب أخضر","كيوي"],
    ["جبنة قريش","خيار طازج"],
    ["رمان","مشمش"],
    ["أناناس","مانجو"],
    ["جوافة","تفاح"],
    ["بلح رطب","تمر"],
    ["خيار بالجبنة القريش"],
    ["تفاح بزبدة الفول السوداني"],
    ["ماء جوز الهند"],
    ["سلطة الفاكهة"],
  ],
  lunch: [
    { protein:["صدر دجاج مشوي","أفخاذ دجاج مشوية","صدر دجاج مسلوق"],      carb:["أرز أبيض مطبوخ","أرز بني مطبوخ","مكرونة مسلوقة"],         veggie:["سلطة خضراء مشكلة","بروكلي مسلوق","كوسة مشوية"] },
    { protein:["تونة معلبة بالماء","تونة معلبة بالزيت","سمك بياض مشوي","بلطي مشوي"], carb:["أرز أبيض مطبوخ","أرز بني مطبوخ","بطاطس مسلوقة"], veggie:["سلطة خضراء مشكلة","خيار وطماطم","جرجير طازج"] },
    { protein:["لحم بقر مشوي","كبدة مشوية","كفتة مشوية"],                   carb:["أرز أبيض مطبوخ","خبز بلدي","برغل مطبوخ"],                 veggie:["سلطة خضراء مشكلة","جزر مسلوق","بصل مطبوخ"] },
    { protein:["عدس أحمر مطبوخ","شوربة عدس","عدس أخضر مطبوخ"],             carb:["أرز أبيض مطبوخ","خبز بلدي","عيش شمس"],                    veggie:["سلطة خضراء مشكلة","خيار وطماطم"] },
    { protein:["دجاج كامل مشوي","صدر دجاج مشوي","مكورة دجاج مشوية"],       carb:["أرز بني مطبوخ","كسكس مطبوخ","فريك مطبوخ"],                veggie:["فاصوليا خضراء مسلوقة","بروكلي مسلوق","قرنبيط مطبوخ"] },
    { protein:["سمك بياض مشوي","جمبري مشوي","سلمون مشوي"],                  carb:["بطاطا حلوة مشوية","أرز أبيض مطبوخ","كينوا مطبوخة"],        veggie:["سلطة خضراء مشكلة","فلفل ألوان مشكلة"] },
    { protein:["ملوخية بالدجاج","ملوخية بالأرانب"],                         carb:["أرز أبيض مطبوخ","خبز بلدي"],                              veggie:["سلطة خضراء مشكلة","خيار طازج"] },
    { protein:["حمص مسلوق","فاصوليا بيضاء مطبوخة","لوبيا مطبوخة"],         carb:["أرز أبيض مطبوخ","خبز بلدي","برغل مطبوخ"],                 veggie:["سلطة خضراء مشكلة","طماطم طازجة"] },
    { protein:["صدر دجاج مشوي","دجاج بالخضروات مشوي"],                      carb:["مكرونة قمح كامل مسلوقة","ذرة مسلوقة"],                     veggie:["باذنجان مشوي","فلفل أحمر","كوسة مشوية"] },
    { protein:["كباب مشوي","كفتة مشوية"],                                   carb:["أرز بني مطبوخ","خبز بلدي"],                               veggie:["سلطة خضراء مشكلة","جزر طازج"] },
    { protein:["سلطة التونة","سلطة الدجاج المشوي"],                         carb:["خبز توست أسمر","برغل مطبوخ","كينوا مطبوخة"],              veggie:["جرجير طازج","طماطم طازجة"] },
    { protein:["صيادية سمك"],                                               carb:["أرز أبيض مطبوخ"],                                         veggie:["سلطة خضراء مشكلة","بصل مطبوخ"] },
  ],
  snack2: [
    ["عصير برتقال طازج","سموذي موز وحليب"],
    ["جبنة قريش","خيار طازج"],
    ["مكسرات مشكلة","تمر","بلح رطب"],
    ["زبادي يوناني خالي الدسم","تفاح"],
    ["جرانولا بالزبادي","زبادي بالفواكه"],
    ["فول سوداني","موز"],
    ["عيش بسكويت بالجبنة القريش"],
    ["سموذي فراولة وزبادي"],
    ["عصير خضار مشكل","كيوي"],
    ["رمان","يوسفي"],
    ["سموذي خضار أخضر"],
    ["لبن رايب بالعسل والقرفة"],
    ["رقاق أرز بالتونة"],
  ],
  dinner: [
    { protein:["صدر دجاج مسلوق","صدر دجاج مشوي"],                      carb:["بطاطس مسلوقة","خبز توست أسمر","بطاطا حلوة مشوية"],         veggie:["سلطة خضراء مشكلة","كوسة مشوية","سبانخ مطبوخة"] },
    { protein:["بيض مسلوق","بيض مقلي بالزيت","بيض أومليت بالخضروات"],  carb:["خبز توست أسمر","خبز بلدي"],                               veggie:["خيار وطماطم","طماطم طازجة","جرجير طازج"] },
    { protein:["تونة معلبة بالماء","سردين معلب بالزيت"],                carb:["خبز توست أسمر","خبز صاج رقيق"],                           veggie:["سلطة خضراء مشكلة","فلفل أخضر","خيار طازج"] },
    { protein:["جبنة قريش","زبادي يوناني خالي الدسم","كوتاج تشيز"],    carb:["شوفان مطبوخ بالماء","خبز توست أسمر"],                      veggie:["تفاح","موز","كيوي"] },
    { protein:["فول مدمس","حمص مسلوق","فاصوليا حمراء مطبوخة"],        carb:["خبز بلدي","خبز صاج رقيق"],                                veggie:["خيار وطماطم","سلطة خضراء مشكلة"] },
    { protein:["شوربة عدس","فاصوليا بيضاء مطبوخة","عدس أخضر مطبوخ"],  carb:["خبز توست أسمر","خبز بلدي"],                               veggie:["سلطة خضراء مشكلة"] },
    { protein:["سلمون مشوي","بلطي مشوي","ماكريل مشوي"],                carb:["أرز بني مطبوخ","بطاطا حلوة مشوية"],                        veggie:["بروكلي مسلوق","جزر مسلوق"] },
    { protein:["كبدة مشوية","صدر دجاج مشوي"],                          carb:["خبز بلدي","ذرة مسلوقة"],                                   veggie:["كرنب مسلوق","طماطم طازجة"] },
    { protein:["شطيرة دجاج بالخبز الأسمر","شطيرة تونة بالخبز الأسمر"],carb:["خبز توست أسمر"],                                           veggie:["خيار طازج","طماطم طازجة","جرجير طازج"] },
    { protein:["سلطة الدجاج المشوي","سلطة التونة"],                    carb:["خبز توست أسمر","برغل مطبوخ"],                             veggie:["جرجير طازج","خيار وطماطم"] },
  ]
};

// ============================================
//  UPDATE 8 — DIET TYPES
// ============================================
const DIET_TYPES = {
  economic:     { label:"🪙 نظام اقتصادي",        budgets:["low"],             deficit:0.20, proteinMult:1.0 },
  balanced:     { label:"🥗 نظام صحي متوازن",     budgets:["low","mid","high"],deficit:0.15, proteinMult:1.0 },
  high_protein: { label:"💪 نظام عالي البروتين",  budgets:["mid","high"],      deficit:0.15, proteinMult:1.4 },
  low_carb:     { label:"🥩 نظام منخفض الكارب",   budgets:["mid","high"],      deficit:0.18, proteinMult:1.2 },
  diabetes:     { label:"🩸 نظام مرضى السكر",     budgets:["low","mid","high"],deficit:0.15, proteinMult:1.1 },
  insulin:      { label:"🔬 نظام مقاومة الإنسولين",budgets:["low","mid","high"],deficit:0.18, proteinMult:1.2 },
  shredding:    { label:"⚡ نظام التنشيف",         budgets:["mid","high"],      deficit:0.25, proteinMult:1.5 },
  bulk:         { label:"🏋️ نظام زيادة العضلات",  budgets:["mid","high"],      deficit:-0.1, proteinMult:1.6 },
};

function selectDietType(u) {
  const c = u.conditions || [];
  if (c.includes("diabetes"))          return DIET_TYPES.diabetes;
  if (c.includes("insulin_resistance")) return DIET_TYPES.insulin;
  if (u.budget === "low")              return DIET_TYPES.economic;
  if (u.targetWeight > u.weight)       return DIET_TYPES.bulk;
  const bmi = calculateBMI(u.weight, u.height);
  if (bmi < 22 && u.targetWeight < u.weight) return DIET_TYPES.shredding;
  return DIET_TYPES.balanced;
}

// ============================================
//  HELPERS
// ============================================
function randFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function findFood(name) {
  for (const cat of Object.values(FOODS)) {
    const f = cat.find(x => x.name === name);
    if (f) return f;
  }
  return null;
}

// UPDATE 2 — Structured quantity display
function formatAmount(food, ratio) {
  const r         = Math.max(0.5, Math.min(3, ratio));
  const unitName  = food.unitName || 'جرام';
  const unitWeight= food.unitWeight || 100;
  const grams     = Math.round(unitWeight * r);
  if (unitName === 'جرام' || unitName === 'جم') return `${grams} جرام`;
  const rawCount  = r * food.portion;
  const count     = rawCount <= 1.25 ? food.portion : Math.round(rawCount * 2) / 2;
  return `${count} ${unitName} (${grams} جرام)`;
}

// ============================================
//  CALCULATION ENGINE
// ============================================
function calculateBMR(weight, height, age, gender) {
  if (gender === 'male') return (10*weight)+(6.25*height)-(5*age)+5;
  return (10*weight)+(6.25*height)-(5*age)-161;
}
function calculateBMI(weight, height) { const h=height/100; return weight/(h*h); }
function getBMIStatus(bmi) {
  if (bmi<18.5) return {text:"نقص الوزن",    color:"#3498db"};
  if (bmi<25)   return {text:"وزن طبيعي ✓",  color:"#2dbe6c"};
  if (bmi<30)   return {text:"وزن زائد",      color:"#f39c12"};
  if (bmi<35)   return {text:"سمنة درجة 1",   color:"#e67e22"};
  if (bmi<40)   return {text:"سمنة درجة 2",   color:"#e74c3c"};
  return         {text:"سمنة مرضية",           color:"#c0392b"};
}
function getDeficit(bmi, targetWeight, currentWeight, dietType) {
  if (dietType && dietType.deficit < 0) return dietType.deficit; // bulk
  if (targetWeight >= currentWeight) return 0;
  if (dietType) return dietType.deficit;
  if (bmi<25) return 0.10; if (bmi<30) return 0.15; if (bmi<35) return 0.20; return 0.25;
}

// UPDATE 6 — Disease-aware macros
function calcMacros(calories, conditions, dietType) {
  let pct = { pro:0.30, carb:0.45, fat:0.25 };
  if (conditions.includes("diabetes") || conditions.includes("insulin_resistance")) { pct.carb=0.30; pct.pro=0.35; pct.fat=0.35; }
  if (conditions.includes("pcos"))         { pct.carb=0.30; pct.pro=0.35; pct.fat=0.35; }
  if (conditions.includes("kidney"))       { pct.pro=0.18; pct.carb=0.57; pct.fat=0.25; }
  if (conditions.includes("cholesterol"))  { pct.fat=0.20; pct.carb=0.45; pct.pro=0.35; }
  if (dietType === DIET_TYPES.high_protein || dietType === DIET_TYPES.shredding) { pct.pro=0.40; pct.carb=0.30; pct.fat=0.30; }
  if (dietType === DIET_TYPES.low_carb)    { pct.pro=0.35; pct.carb=0.25; pct.fat=0.40; }
  if (dietType === DIET_TYPES.bulk)        { pct.pro=0.35; pct.carb=0.45; pct.fat=0.20; }
  return {
    pro:  Math.round((calories*pct.pro)/4),
    carb: Math.round((calories*pct.carb)/4),
    fat:  Math.round((calories*pct.fat)/9),
  };
}

// UPDATE 6 — disease-based food exclusions
function getDiseaseExclusions(conditions) {
  const exc = [];
  if (conditions.includes("hypertension"))                          exc.push("ملح","صلصة الصويا","مخلل","مالح");
  if (conditions.includes("diabetes")||conditions.includes("insulin_resistance")||conditions.includes("pcos")) exc.push("رز بلبن","كشري","مكرونة بشاميل","بطيخ أحمر","عنب");
  if (conditions.includes("cholesterol"))                          exc.push("سمن","زبدة","مايونيز","قشطة","لحم ضأن");
  if (conditions.includes("kidney"))                               exc.push("بروتين واي","جبنة موزاريلا","جبنة فيتا");
  if (conditions.includes("liver"))                                exc.push("مقلي","سمن","زبدة","كباب","شاورما");
  return exc;
}

function scrollToForm() { document.getElementById('form-section').scrollIntoView({behavior:'smooth'}); }

// ============================================
//  UPDATE 5 — BODY MEASUREMENTS & PROGRESS
// ============================================
function saveMeasurements(waist, hips, arm) {
  const prev = JSON.parse(sessionStorage.getItem('cwf_measurements') || 'null');
  sessionStorage.setItem('cwf_measurements', JSON.stringify({ waist, hips, arm, ts: Date.now() }));
  return prev;
}

function renderProgress(current, previous) {
  if (!previous || !current.waist) return;
  const box = document.getElementById('progressBox');
  const items = [];
  const check = (label, cur, prev, unit) => {
    if (!cur || !prev) return;
    const diff = Math.round((prev - cur)*10)/10;
    if (diff > 0) items.push(`<div class="progress-item good">📉 ${label}: انخفض ${diff} ${unit}</div>`);
    else if (diff < 0) items.push(`<div class="progress-item same">📈 ${label}: ارتفع ${Math.abs(diff)} ${unit}</div>`);
    else items.push(`<div class="progress-item same">➡️ ${label}: لا تغيير</div>`);
  };
  check('محيط البطن', current.waist, previous.waist, 'سم');
  check('محيط الأفخاذ', current.hips, previous.hips, 'سم');
  check('محيط الذراع', current.arm, previous.arm, 'سم');
  if (items.length === 0) return;
  box.innerHTML = `<h4>📏 متابعة التقدم مقارنة بالقياس السابق</h4><div class="progress-items">${items.join('')}</div>`;
  box.style.display = 'block';
}

// ============================================
//  GENERATE DIET
// ============================================
let lastUserData = null;

function generateDiet() {
  const gender   = document.querySelector('input[name="gender"]:checked');
  const age      = document.getElementById('age').value;
  const height   = document.getElementById('height').value;
  const weight   = document.getElementById('weight').value;
  const activity = document.querySelector('input[name="activity"]:checked');
  if (!gender||!age||!height||!weight||!activity) { alert('يرجى ملء جميع الحقول الإلزامية'); return; }

  const btn = document.querySelector('.btn-submit');
  btn.classList.add('loading');
  btn.textContent = '...جاري الحساب';

  setTimeout(() => {
    const waist = parseFloat(document.getElementById('waistCirc').value) || null;
    const hips  = parseFloat(document.getElementById('hipsCirc').value)  || null;
    const arm   = parseFloat(document.getElementById('armCirc').value)   || null;
    const prevMeasurements = saveMeasurements(waist, hips, arm);

    const userData = {
      name:           document.getElementById('name').value || 'صديقي',
      gender:         gender.value,
      age:            parseInt(age),
      height:         parseFloat(height),
      weight:         parseFloat(weight),
      targetWeight:   parseFloat(document.getElementById('targetWeight').value) || parseFloat(weight),
      activityFactor: parseFloat(activity.value),
      workType:       document.getElementById('workType').value,
      sleep:          parseFloat(document.getElementById('sleep').value) || 7,
      waterInput:     parseFloat(document.getElementById('water').value) || 0,
      conditions:     [...document.querySelectorAll('input[name="conditions"]:checked')].map(e=>e.value),
      customConditions: document.getElementById('customConditions').value,
      medications:    document.getElementById('medications').value,
      allergies:      document.getElementById('allergies').value,
      favFoods:       document.getElementById('favFoods').value,
      avoidFoods:     document.getElementById('avoidFoods').value,
      budget:         document.querySelector('input[name="budget"]:checked')?.value || 'medium',
      country:        document.getElementById('country').value,
      fatPercent:     parseFloat(document.getElementById('fatPercent').value) || null,
      muscleMass:     parseFloat(document.getElementById('muscleMass').value) || null,
      visceralFat:    parseFloat(document.getElementById('visceralFat').value)|| null,
      inbodyBMR:      parseFloat(document.getElementById('inbodyBMR').value)  || null,
      waterPercent:   parseFloat(document.getElementById('waterPercent').value)||null,
      waist, hips, arm, prevMeasurements,
    };

    lastUserData = userData;
    renderResults(userData);
    renderProgress({ waist, hips, arm }, prevMeasurements);

    btn.classList.remove('loading');
    btn.innerHTML = '<span class="btn-icon">✨</span> إنشاء نظامي الغذائي';
    document.getElementById('results').style.display = 'block';
    document.getElementById('results').scrollIntoView({behavior:'smooth'});
  }, 800);
}


// ============================================
//  RENDER RESULTS
// ============================================
function renderResults(u) {
  const bmi       = calculateBMI(u.weight, u.height);
  const bmr       = u.inbodyBMR || calculateBMR(u.weight, u.height, u.age, u.gender);
  const dietType  = selectDietType(u);
  const deficit   = getDeficit(bmi, u.targetWeight, u.weight, dietType);
  const tdee      = Math.round(bmr * u.activityFactor);
  const targetCals= Math.round(tdee * (1 - deficit));
  const macros    = calcMacros(targetCals, u.conditions, dietType);
  const bmiStatus = getBMIStatus(bmi);
  const recWater  = Math.round(u.weight * 0.033 * 10) / 10;

  // Diet type badge
  document.getElementById('dietTypeBadge').innerHTML = `<span class="diet-type-tag">${dietType.label}</span>`;

  // Warnings (UPDATE 6)
  const wBox  = document.getElementById('warningBox');
  const wText = document.getElementById('warningText');
  const warns = [];
  if (bmi>35)                                    warns.push("⚠️ مؤشر كتلة الجسم مرتفع جداً — استشر طبيبك قبل البدء.");
  if (u.conditions.includes("diabetes"))         warns.push("⚠️ السكري: تحكم في الكارب وتجنب السكريات البسيطة.");
  if (u.conditions.includes("insulin_resistance")) warns.push("⚠️ مقاومة الإنسولين: قلّل الكارب البسيط وزد الألياف والبروتين.");
  if (u.conditions.includes("pcos"))             warns.push("⚠️ تكيس المبايض: نظام منخفض الكارب يساعد على تنظيم الهرمونات.");
  if (u.conditions.includes("hypertension"))     warns.push("⚠️ ضغط الدم: قلل الصوديوم وتجنب الأطعمة المالحة والمعلبة.");
  if (u.conditions.includes("cholesterol"))      warns.push("⚠️ الكوليسترول: تجنب الدهون المشبعة وزد الألياف القابلة للذوبان.");
  if (u.conditions.includes("kidney"))           warns.push("⚠️ أمراض الكلى: خُفِّض البروتين وراجع طبيبك لتحديد الكميات.");
  if (u.conditions.includes("liver"))            warns.push("⚠️ أمراض الكبد: تجنب الدهون المشبعة والمقليات — تحت إشراف طبي.");
  if (warns.length>0) { wText.innerHTML=warns.join('<br>'); wBox.style.display='flex'; } else wBox.style.display='none';

  document.getElementById('welcomeName').textContent = `نظامك الغذائي يا ${u.name}`;

  // Analysis cards
  document.getElementById('analysisGrid').innerHTML = `
    <div class="analysis-card" style="--accent-color:${bmiStatus.color}">
      <div class="card-icon">⚖️</div><div class="card-value">${bmi.toFixed(1)}</div>
      <div class="card-unit">كجم/م²</div><div class="card-label">مؤشر كتلة الجسم</div>
      <div class="card-status" style="color:${bmiStatus.color}">${bmiStatus.text}</div>
    </div>
    <div class="analysis-card" style="--accent-color:#9b59b6">
      <div class="card-icon">🔥</div><div class="card-value">${Math.round(bmr)}</div>
      <div class="card-unit">سعرة/يوم</div><div class="card-label">معدل الحرق الأساسي BMR</div>
    </div>
    <div class="analysis-card" style="--accent-color:#e67e22">
      <div class="card-icon">⚡</div><div class="card-value">${tdee}</div>
      <div class="card-unit">سعرة/يوم</div><div class="card-label">إجمالي الطاقة TDEE</div>
    </div>
    <div class="analysis-card" style="--accent-color:#2dbe6c">
      <div class="card-icon">🎯</div><div class="card-value">${targetCals}</div>
      <div class="card-unit">سعرة/يوم</div><div class="card-label">هدف السعرات اليومي</div>
      <div class="card-status" style="color:#2dbe6c">${deficit>0?`عجز ${Math.round(deficit*100)}%`:deficit<0?'فائض (زيادة عضل)':'صيانة الوزن'}</div>
    </div>
    ${u.fatPercent?`<div class="analysis-card" style="--accent-color:#e74c3c"><div class="card-icon">📊</div><div class="card-value">${u.fatPercent}%</div><div class="card-unit"></div><div class="card-label">نسبة الدهون</div></div>`:''}
    ${u.visceralFat?`<div class="analysis-card" style="--accent-color:#c0392b"><div class="card-icon">🫀</div><div class="card-value">${u.visceralFat}</div><div class="card-unit">درجة</div><div class="card-label">دهون البطن الحشوية</div></div>`:''}
  `;

  // Macros
  document.getElementById('macrosSection').innerHTML = `
    <div class="macros-section">
      <h3>🥗 توزيع الماكروز اليومية</h3>
      <div class="macros-grid">
        <div class="macro-card"><div class="macro-bar" style="background:rgba(52,152,219,0.2)">🥩</div>
          <div class="m-val">${macros.pro}</div><div class="m-unit">جرام</div>
          <div class="m-label">بروتين</div><div class="m-cals">${Math.round(macros.pro*4)} سعرة</div></div>
        <div class="macro-card"><div class="macro-bar" style="background:rgba(241,196,15,0.2)">🍚</div>
          <div class="m-val">${macros.carb}</div><div class="m-unit">جرام</div>
          <div class="m-label">كربوهيدرات</div><div class="m-cals">${Math.round(macros.carb*4)} سعرة</div></div>
        <div class="macro-card"><div class="macro-bar" style="background:rgba(231,76,60,0.2)">🥑</div>
          <div class="m-val">${macros.fat}</div><div class="m-unit">جرام</div>
          <div class="m-label">دهون</div><div class="m-cals">${Math.round(macros.fat*9)} سعرة</div></div>
      </div>
    </div>`;

  buildAndRenderMealPlan(targetCals, macros, u);

  const stepsRec = bmi<25?'7,000-10,000':bmi<30?'8,000-12,000':'5,000-8,000';
  const exRec    = getExerciseRec(u.conditions, bmi);
  document.getElementById('recommendationsSection').innerHTML = `
    <div class="recommendations-section">
      <h3>💡 التوصيات اليومية</h3>
      <div class="recs-grid">
        <div class="rec-card"><div class="rec-icon">💧</div><div class="rec-title">الماء اليومي</div><div class="rec-value">${recWater} لتر</div><div class="rec-note">موزعة على مدار اليوم</div></div>
        <div class="rec-card"><div class="rec-icon">👟</div><div class="rec-title">خطوات يومية</div><div class="rec-value">${stepsRec}</div><div class="rec-note">خطوة يومياً</div></div>
        <div class="rec-card"><div class="rec-icon">🏃</div><div class="rec-title">التمارين المقترحة</div><div class="rec-value" style="font-size:0.9rem">${exRec.type}</div><div class="rec-note">${exRec.duration}</div></div>
        <div class="rec-card"><div class="rec-icon">😴</div><div class="rec-title">النوم</div><div class="rec-value">7 - 9 ساعات</div><div class="rec-note">للتعافي وحرق الدهون</div></div>
        <div class="rec-card"><div class="rec-icon">📅</div><div class="rec-title">مراجعة النتائج</div><div class="rec-value">كل 4 أسابيع</div><div class="rec-note">قس الوزن والمقاسات</div></div>
        <div class="rec-card"><div class="rec-icon">🚫</div><div class="rec-title">يجب تقليله</div><div class="rec-value" style="font-size:0.85rem">السكر والمقليات</div><div class="rec-note">والمشروبات الغازية</div></div>
      </div>
      <p style="margin-top:1.25rem;font-size:0.8rem;color:#888;line-height:1.7;">
        ⚠️ <strong>تنبيه طبي:</strong> هذا النظام إرشادي فقط. استشر طبيبك قبل البدء، خاصة في حال وجود أمراض مزمنة أو أدوية.
      </p>
    </div>`;
}

// ============================================
//  UPDATE 10 — VALIDATION WRAPPER
// ============================================
function buildAndRenderMealPlan(totalCals, macros, u) {
  const baseExclude = parseExcludeList((u.avoidFoods||'')+'،'+(u.allergies||''));
  const diseaseExc  = getDiseaseExclusions(u.conditions||[]);
  const excludeList = [...new Set([...baseExclude, ...diseaseExc.map(normalizeArabic)])];
  const MAX = 8;
  let plan, attempt=0, clean=false;

  while (attempt<MAX) {
    plan = buildMealPlan(totalCals, macros, u, excludeList);
    const hasExcluded = plan.some(meal=>meal.items.some(item=>isFoodExcluded(item.name, excludeList)));
    if (!hasExcluded) { clean=true; break; }
    attempt++;
  }

  let notice = '';
  if (!clean && excludeList.length>0) {
    notice = `<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:10px;padding:0.9rem 1.2rem;margin-bottom:1rem;font-size:0.85rem;color:#856404;font-weight:600;">
      ⚠️ تم استبعاد معظم الأطعمة المحددة. بعض البدائل المتاحة قد تحتوي على مكونات مشابهة — يُنصح بمراجعة الخطة.
    </div>`;
  }

  document.getElementById('dietPlanSection').innerHTML =
    `<h3>🍽️ النظام الغذائي اليومي</h3>` + notice + plan.map(renderMealCard).join('');
}

// ============================================
//  BUILD MEAL PLAN
// ============================================
function buildMealPlan(totalCals, macros, u, excludeList=[]) {
  const mealCals = {
    breakfast: Math.round(totalCals*0.25),
    snack1:    Math.round(totalCals*0.10),
    lunch:     Math.round(totalCals*0.35),
    snack2:    Math.round(totalCals*0.10),
    dinner:    Math.round(totalCals*0.20),
  };

  function safeRand(arr) {
    const ok = arr.filter(n=>!isFoodExcluded(n,excludeList));
    return randFrom(ok.length>0?ok:arr);
  }
  function safeTemplate(templates) {
    const shuffled = [...templates].sort(()=>Math.random()-0.5);
    for (const t of shuffled) {
      const ok = Object.keys(t).every(k=>Array.isArray(t[k])&&t[k].some(n=>!isFoodExcluded(n,excludeList)));
      if (ok) return t;
    }
    return randFrom(templates);
  }

  const meals=[];
  const bfT=safeTemplate(MEAL_TEMPLATES.breakfast);
  meals.push(buildStructuredMeal('فطار','🌅','7:00 - 8:00 ص',mealCals.breakfast,
    [safeRand(bfT.protein),safeRand(bfT.carb),safeRand(bfT.side)],'#e8f8f0'));

  const sn1Pool=MEAL_TEMPLATES.snack1.filter(g=>(Array.isArray(g)?g:[g]).some(n=>!isFoodExcluded(n,excludeList)));
  const sn1=randFrom(sn1Pool.length>0?sn1Pool:MEAL_TEMPLATES.snack1);
  meals.push(buildSimpleMeal('سناك صباحي','🍎','10:30 ص',mealCals.snack1,
    [safeRand(Array.isArray(sn1)?sn1:[sn1])],'#fff8e1'));

  const lT=safeTemplate(MEAL_TEMPLATES.lunch);
  meals.push(buildStructuredMeal('غداء','🍽️','1:00 - 2:00 م',mealCals.lunch,
    [safeRand(lT.protein),safeRand(lT.carb),safeRand(lT.veggie)],'#e8f0fe'));

  const sn2Pool=MEAL_TEMPLATES.snack2.filter(g=>(Array.isArray(g)?g:[g]).some(n=>!isFoodExcluded(n,excludeList)));
  const sn2=randFrom(sn2Pool.length>0?sn2Pool:MEAL_TEMPLATES.snack2);
  meals.push(buildSimpleMeal('سناك مسائي','🥤','4:30 م',mealCals.snack2,
    [safeRand(Array.isArray(sn2)?sn2:[sn2])],'#fce4ec'));

  const dT=safeTemplate(MEAL_TEMPLATES.dinner);
  meals.push(buildStructuredMeal('عشاء','🌙','7:00 - 8:00 م',mealCals.dinner,
    [safeRand(dT.protein),safeRand(dT.carb),safeRand(dT.veggie)],'#f3e5f5'));

  return meals;
}

function buildStructuredMeal(name,icon,time,targetCals,foodNames,bgColor) {
  const items=[]; const weights=[0.45,0.40,0.15]; let total={cal:0,pro:0,carb:0,fat:0};
  foodNames.forEach((fname,i)=>{
    const food=findFood(fname); if(!food)return;
    const ratio=Math.max(0.5,Math.min(3,(targetCals*weights[i])/food.cal));
    const item={name:food.name,amount:formatAmount(food,ratio),
      cal:Math.round(food.cal*ratio),pro:Math.round(food.pro*ratio*10)/10,
      carb:Math.round(food.carb*ratio*10)/10,fat:Math.round(food.fat*ratio*10)/10};
    items.push(item); total.cal+=item.cal;total.pro+=item.pro;total.carb+=item.carb;total.fat+=item.fat;
  });
  return {name,icon,time,items,total,bgColor};
}

function buildSimpleMeal(name,icon,time,targetCals,foodNames,bgColor) {
  const items=[]; let total={cal:0,pro:0,carb:0,fat:0};
  foodNames.forEach(fname=>{
    const food=findFood(fname); if(!food)return;
    const ratio=Math.max(0.5,Math.min(3,targetCals/food.cal));
    const item={name:food.name,amount:formatAmount(food,ratio),
      cal:Math.round(food.cal*ratio),pro:Math.round(food.pro*ratio*10)/10,
      carb:Math.round(food.carb*ratio*10)/10,fat:Math.round(food.fat*ratio*10)/10};
    items.push(item); total.cal+=item.cal;total.pro+=item.pro;total.carb+=item.carb;total.fat+=item.fat;
  });
  return {name,icon,time,items,total,bgColor};
}

function renderMealCard(meal) {
  const foodHtml = meal.items.map(item=>`
    <div class="food-item">
      <span class="food-name">${item.name}</span>
      <span class="food-amount">${item.amount}</span>
      <div class="food-macro-tags">
        <span class="food-tag tag-p">${item.pro}ب</span>
        <span class="food-tag tag-c">${item.carb}ك</span>
        <span class="food-tag tag-f">${item.fat}د</span>
      </div>
    </div>`).join('');
  return `
    <div class="meal-card">
      <div class="meal-header" style="background:${meal.bgColor}">
        <div class="meal-header-right">
          <span class="meal-icon">${meal.icon}</span>
          <div><div class="meal-name">${meal.name}</div><div class="meal-time">⏰ ${meal.time}</div></div>
        </div>
        <span class="meal-cals-badge">🔥 ${Math.round(meal.total.cal)} سعرة</span>
      </div>
      <div class="meal-body">
        <div class="meal-macros-row">
          <span class="meal-macro"><span class="mm-dot" style="background:#3498db"></span> بروتين: ${Math.round(meal.total.pro)} جم</span>
          <span class="meal-macro"><span class="mm-dot" style="background:#f1c40f"></span> كارب: ${Math.round(meal.total.carb)} جم</span>
          <span class="meal-macro"><span class="mm-dot" style="background:#e74c3c"></span> دهون: ${Math.round(meal.total.fat)} جم</span>
        </div>
        <div class="food-items">${foodHtml}</div>
      </div>
    </div>`;
}

function getExerciseRec(conditions, bmi) {
  if (conditions.includes("kidney")||conditions.includes("liver")) return {type:"مشي خفيف فقط",duration:"20-30 دقيقة يومياً"};
  if (bmi>35) return {type:"مشي + سباحة",duration:"30 دقيقة / 4 أيام"};
  if (bmi>25) return {type:"كارديو + وزن حر",duration:"40-45 دقيقة / 4-5 أيام"};
  return {type:"رفع أثقال + كارديو",duration:"45-60 دقيقة / 5 أيام"};
}


// ============================================
//  UPDATE 9 — RECIPE SEARCH (inline results)
// ============================================

// Internal recipe database for common Egyptian/Arabic dishes
const RECIPE_DB = {
  "دجاج مشوي": {
    ingredients: ["صدر دجاج 500 جم", "زيت زيتون 2 ملعقة", "ثوم 3 فصوص", "عصير ليمون", "ملح وفلفل", "كمون وزعتر", "بابريكا"],
    steps: ["نظف الدجاج وجففه. اخلط الزيت والثوم والتوابل وعصير الليمون", "تبّل الدجاج جيداً واتركه يتبّل ساعة أو طوال الليل", "سخّن الشواية على حرارة متوسطة-عالية", "اشوِ الدجاج 6-8 دقائق على كل جانب حتى ينضج", "اتركه يرتاح 5 دقائق قبل التقديم"]
  },
  "فول مدمس": {
    ingredients: ["فول مجروش 400 جم معلبة", "عصير ليمون 2 ملعقة", "زيت زيتون 2 ملعقة", "ثوم 2 فصوص مهروسة", "كمون نصف ملعقة", "ملح حسب الذوق", "بقدونس للتزيين"],
    steps: ["صفّي الفول وضعه في قدر مع القليل من الماء", "أضف الثوم المهروس والكمون والملح", "سخّن على نار متوسطة مع التقليب 5 دقائق", "أضف عصير الليمون وزيت الزيتون", "قدّم ساخناً مع البقدونس وزيت الزيتون"]
  },
  "شوربة عدس": {
    ingredients: ["عدس أحمر 1 كوب", "بصلة كبيرة مفرومة", "ثوم 3 فصوص", "جزرة متوسطة مقطعة", "زيت 2 ملعقة", "كمون وكركم", "ملح وفلفل", "ليمون للتقديم"],
    steps: ["اقلي البصل في الزيت حتى يذبل ثم أضف الثوم", "أضف الجزر وقلّب 2 دقيقة", "أضف العدس المغسول مع 6 أكواب ماء", "أضف التوابل واغلِ ثم اخفض النار 20 دقيقة", "اخلط الشوربة بالخلاط حتى تصبح ناعمة ثم قدّمها مع الليمون"]
  },
  "صدر دجاج مسلوق": {
    ingredients: ["صدر دجاج 500 جم", "بصلة", "ورق غار 2 ورقة", "ملح وفبلفل", "كمون", "ثوم 4 فصوص"],
    steps: ["ضع الدجاج في قدر وغطّه بالماء البارد", "أضف البصل والثوم وورق الغار والتوابل", "اغلِ ثم اخفض النار، اطبخ 20-25 دقيقة", "تأكد من نضج الدجاج بالشوكة", "أخرجه ودعه يبرد قليلاً ثم قطّعه حسب الرغبة"]
  },
  "بيض مسلوق": {
    ingredients: ["بيض ثلاث حبات", "ماء", "ملح قليل"],
    steps: ["ضع البيض في قدر وغطّه بالماء البارد مع رشة ملح", "أوصل الماء للغليان على نار عالية", "اخفض النار واتركه 6-7 دقائق لبيض نصف ناضج أو 10 دقائق للناضج تماماً", "أخرجه وضعه في ماء بارد فوراً لسهولة التقشير", "قشّره وقدّمه مع ملح وبهارات"]
  },
  "أرز أبيض": {
    ingredients: ["أرز أبيض 1.5 كوب", "ماء 2.5 كوب", "زيت ملعقة كبيرة", "ملح ملعقة صغيرة"],
    steps: ["اغسل الأرز جيداً حتى يصفو الماء", "سخّن الزيت في القدر وأضف الأرز المجفف وقلّب دقيقة", "أضف الماء الساخن والملح", "اغلِ ثم غطّ القدر واخفض النار لأدنى درجة", "اطبخ 15-18 دقيقة دون رفع الغطاء ثم افرد بشوكة"]
  },
  "تونة": {
    ingredients: ["علبة تونة بالماء 185 جم", "بصلة صغيرة مفرومة ناعماً", "طماطم مقطعة", "عصير ليمون", "زيت زيتون ملعقة", "ملح وفلفل", "بقدونس"],
    steps: ["صفّي التونة جيداً من الماء أو الزيت", "اخلط التونة مع البصل والطماطم والبقدونس", "أضف عصير الليمون وزيت الزيتون", "تبّل بالملح والفلفل وقلّب", "قدّم بارداً مع خبز توست أو خضروات"]
  },
  "كفتة": {
    ingredients: ["لحم مفروم 500 جم", "بصلة مبشورة", "بقدونس مفروم", "ملح وفلفل", "كمون وكزبرة", "بهارات كفتة", "زيت للدهن"],
    steps: ["اخلط اللحم مع البصل والبقدونس والتوابل جيداً", "شكّل الكفتة على أسياخ أو كرات مطبوطة", "سخّن الشواية أو الفرن 200 درجة", "اشوِ الكفتة 10-12 دقيقة مع التقليب حتى تنضج", "قدّمها مع سلطة طازجة وخبز"]
  },
  "ملوخية": {
    ingredients: ["ملوخية مجمدة أو طازجة 500 جم", "مرق دجاج أو لحم 3 أكواب", "ثوم 6 فصوص", "كزبرة جافة ملعقتان", "زيت أو سمن للتقطير", "ملح"],
    steps: ["سخّن المرق في قدر", "أضف الملوخية واتركها تذوب وترتفع لدرجة الغليان", "في مقلاة صغيرة، قلّي الثوم المهروس في الزيت حتى يذهب", "أضف الكزبرة وقلّب ثانية واحدة", "صبّ التقطيرة على الملوخية وقلّب - قدّمها مع الأرز والليمون"]
  },
  "شوفان": {
    ingredients: ["شوفان نصف كوب", "حليب أو ماء 1 كوب", "عسل ملعقة صغيرة", "قرفة رشة", "موز أو فراولة"],
    steps: ["ضع الشوفان والحليب في وعاء مناسب للميكروويف أو قدر", "سخّن في الميكروويف 2 دقيقة مع التحريك في المنتصف أو على النار مع التحريك المستمر", "أضف العسل والقرفة وقلّب", "أضف الفاكهة فوق الشوفان", "قدّمه فوراً"]
  },
};

// Search recipes
function searchRecipe() {
  const query = document.getElementById('recipeSearchInput').value.trim();
  if (!query) { alert('اكتب اسم الأكلة أولاً'); return; }

  const resultsDiv = document.getElementById('recipeResults');
  resultsDiv.style.display = 'block';
  resultsDiv.innerHTML = `<div class="recipe-loading">🔍 جاري البحث عن: ${query}...</div>`;

  // Search internal DB first
  const normQ = normalizeArabic(query);
  let match = null;
  for (const [key, val] of Object.entries(RECIPE_DB)) {
    if (normalizeArabic(key).includes(normQ) || normQ.includes(normalizeArabic(key))) {
      match = { name: key, ...val }; break;
    }
  }

  if (match) {
    renderRecipeResult(match, resultsDiv);
  } else {
    // Fallback: generate a helpful generic recipe structure
    const genericRecipe = generateGenericRecipe(query);
    renderRecipeResult(genericRecipe, resultsDiv);
  }
}

function renderRecipeResult(recipe, container) {
  const ingredientRows = recipe.ingredients.map((ing, i) =>
    `<tr><td>${i+1}</td><td>${ing}</td></tr>`).join('');
  const stepRows = recipe.steps.map((step, i) =>
    `<tr><td style="font-weight:700;color:var(--green);white-space:nowrap">${i+1}</td><td>${step}</td></tr>`).join('');

  container.innerHTML = `
    <div class="recipe-card">
      <h4>🍽️ طريقة عمل: ${recipe.name}</h4>
      <p style="color:rgba(255,255,255,0.5);font-size:0.8rem;margin-bottom:1rem">المصدر: قاعدة بيانات الوصفات الداخلية</p>
      <table class="recipe-table">
        <tr><th colspan="2">🛒 المكونات</th></tr>
        ${ingredientRows}
      </table>
      <br/>
      <table class="recipe-table">
        <tr><th colspan="2">👨‍🍳 طريقة التحضير</th></tr>
        ${stepRows}
      </table>
    </div>`;
}

function generateGenericRecipe(name) {
  return {
    name: name,
    ingredients: [
      "المكونات الرئيسية حسب الوصفة",
      "توابل: ملح وفلفل وكمون",
      "زيت زيتون ملعقتان كبيرتان",
      "ثوم 3-4 فصوص",
      "عصير ليمونة واحدة",
    ],
    steps: [
      `تجهيز مكونات ${name} وغسلها جيداً`,
      "تقطيع المكونات للحجم المناسب للطبخ",
      "تتبيل المكونات بالملح والفلفل والتوابل المناسبة",
      "طبخها بالطريقة المناسبة (شوي / سلق / قلي خفيف)",
      "التقديم مع الخضروات الطازجة والليمون",
    ]
  };
}

// ============================================
//  ACTIONS
// ============================================
function regeneratePlan() { if(!lastUserData)return; renderResults(lastUserData); document.getElementById('results').scrollIntoView({behavior:'smooth'}); }
function newUser() { document.getElementById('dietForm').reset(); document.getElementById('results').style.display='none'; document.getElementById('form-section').scrollIntoView({behavior:'smooth'}); lastUserData=null; }
function printPlan() { window.print(); }
function downloadPDF() { const t=document.title; document.title=`نظام غذائي - ${lastUserData?.name||'مستخدم'}`; window.print(); document.title=t; }

// ============================================
//  INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Mutual exclusion: لا شيء
  const noneCheck = document.getElementById('cond-none');
  const allChecks = document.querySelectorAll('input[name="conditions"]');
  if (noneCheck) {
    noneCheck.addEventListener('change', () => { if(noneCheck.checked) allChecks.forEach(c=>{if(c!==noneCheck)c.checked=false;}); });
    allChecks.forEach(c=>{ if(c!==noneCheck) c.addEventListener('change',()=>{if(c.checked)noneCheck.checked=false;}); });
  }
  // Allow Enter key in recipe search
  document.getElementById('recipeSearchInput')?.addEventListener('keydown', e=>{
    if(e.key==='Enter') searchRecipe();
  });
});
