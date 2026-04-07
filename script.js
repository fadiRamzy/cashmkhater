/* ====================================================
   MAKHATI ALGHITHAI — Smart Arabic Diet Planner
   Fully offline | No backend | Pure JS calculations
   ==================================================== */

// ============================================
//   FOOD DATABASE (Arabic / Egyptian Foods)
// ============================================
// Each item: { name, cal, pro, carb, fat, unit, portion, tags }
// tags: budget = "low" | "mid" | "high"
// category = protein | carb | fat | veggie | fruit | dairy

const FOODS = {
  // ======= PROTEINS =======
  proteins: [
    { name: "بيض مسلوق", cal: 155, pro: 13, carb: 1.1, fat: 11, unit: "بيضة", portion: 1, budget: "low", tags: ["all"] },
    { name: "بيض مقلي بالزيت", cal: 185, pro: 12, carb: 1, fat: 14, unit: "بيضة", portion: 1, budget: "low", tags: ["all"] },
    { name: "بيض عيون بالسمن", cal: 200, pro: 12, carb: 1, fat: 16, unit: "بيضة", portion: 1, budget: "mid", tags: ["all"] },
    { name: "صدر دجاج مشوي", cal: 165, pro: 31, carb: 0, fat: 3.6, unit: "جم", portion: 100, budget: "mid", tags: ["all"] },
    { name: "صدر دجاج مسلوق", cal: 145, pro: 30, carb: 0, fat: 2.5, unit: "جم", portion: 100, budget: "mid", tags: ["all"] },
    { name: "أفخاذ دجاج مشوية", cal: 200, pro: 26, carb: 0, fat: 10, unit: "جم", portion: 100, budget: "mid", tags: ["all"] },
    { name: "تونة معلبة بالماء", cal: 110, pro: 25, carb: 0, fat: 1, unit: "علبة (185 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "سردين معلب بالزيت", cal: 200, pro: 21, carb: 0, fat: 13, unit: "علبة (125 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "فول مدمس", cal: 180, pro: 13, carb: 28, fat: 1.5, unit: "طبق (200 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "فول مدمس بالزيت والكمون", cal: 220, pro: 13, carb: 28, fat: 5, unit: "طبق", portion: 1, budget: "low", tags: ["all"] },
    { name: "عدس أحمر مطبوخ", cal: 165, pro: 13, carb: 28, fat: 0.5, unit: "طبق (200 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "شوربة عدس", cal: 130, pro: 9, carb: 22, fat: 1, unit: "طبق كبير", portion: 1, budget: "low", tags: ["all"] },
    { name: "لحم بقر مشوي", cal: 215, pro: 26, carb: 0, fat: 12, unit: "جم", portion: 100, budget: "high", tags: ["all"] },
    { name: "كبدة بانيه", cal: 245, pro: 28, carb: 7, fat: 12, unit: "قطعتان (150 جم)", portion: 1, budget: "mid", tags: ["all"] },
    { name: "فراخ كاملة مشوية", cal: 180, pro: 25, carb: 0, fat: 9, unit: "جم", portion: 100, budget: "mid", tags: ["all"] },
    { name: "جمبري مشوي", cal: 120, pro: 24, carb: 1, fat: 2, unit: "جم", portion: 100, budget: "high", tags: ["all"] },
    { name: "سمك بياض مشوي", cal: 120, pro: 22, carb: 0, fat: 3, unit: "جم", portion: 100, budget: "mid", tags: ["all"] },
    { name: "بلطي مشوي", cal: 140, pro: 26, carb: 0, fat: 4, unit: "سمكة متوسطة", portion: 1, budget: "low", tags: ["all"] },
    { name: "حمص مسلوق", cal: 180, pro: 10, carb: 27, fat: 3, unit: "طبق (180 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "فاصوليا بيضاء مطبوخة", cal: 155, pro: 11, carb: 28, fat: 0.5, unit: "طبق (200 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "زبادي يوناني خالي الدسم", cal: 100, pro: 17, carb: 6, fat: 0.7, unit: "كوب (200 جم)", portion: 1, budget: "mid", tags: ["all"] },
    { name: "جبنة قريش", cal: 90, pro: 14, carb: 3, fat: 2, unit: "طبق (150 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "جبنة بيضاء خفيفة", cal: 120, pro: 10, carb: 2, fat: 8, unit: "شريحتان (50 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "مكورة دجاج مشوية", cal: 175, pro: 22, carb: 5, fat: 7, unit: "3 قطع", portion: 1, budget: "mid", tags: ["all"] },
  ],

  // ======= CARBOHYDRATES =======
  carbs: [
    { name: "أرز أبيض مطبوخ", cal: 206, pro: 4.3, carb: 45, fat: 0.4, unit: "طبق (200 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "أرز بني مطبوخ", cal: 218, pro: 4.5, carb: 46, fat: 1.6, unit: "طبق (200 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "مكرونة مسلوقة", cal: 220, pro: 8, carb: 43, fat: 1.3, unit: "طبق (200 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "شعرية مسلوقة", cal: 200, pro: 7, carb: 41, fat: 1, unit: "طبق (180 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "خبز بلدي", cal: 270, pro: 9, carb: 55, fat: 1.5, unit: "رغيف", portion: 1, budget: "low", tags: ["all"] },
    { name: "خبز توست أبيض", cal: 80, pro: 2.7, carb: 15, fat: 1, unit: "شريحة", portion: 1, budget: "low", tags: ["all"] },
    { name: "خبز توست أسمر", cal: 72, pro: 3.5, carb: 13, fat: 1, unit: "شريحة", portion: 1, budget: "low", tags: ["all"] },
    { name: "شوفان مطبوخ بالماء", cal: 150, pro: 5, carb: 27, fat: 2.5, unit: "طبق (200 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "بطاطس مسلوقة", cal: 130, pro: 3, carb: 28, fat: 0.2, unit: "حبتان متوسطتان", portion: 1, budget: "low", tags: ["all"] },
    { name: "بطاطا حلوة مشوية", cal: 115, pro: 2, carb: 27, fat: 0.1, unit: "حبة متوسطة", portion: 1, budget: "low", tags: ["all"] },
    { name: "كورن فليكس بالحليب", cal: 185, pro: 5, carb: 37, fat: 2, unit: "طبق (200 مل)", portion: 1, budget: "mid", tags: ["all"] },
    { name: "خبز صاج رقيق", cal: 180, pro: 6, carb: 37, fat: 1, unit: "رغيفان", portion: 1, budget: "low", tags: ["all"] },
    { name: "كسكس مطبوخ", cal: 176, pro: 6, carb: 36, fat: 0.3, unit: "طبق (180 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "عيش شمس", cal: 250, pro: 8, carb: 52, fat: 1, unit: "رغيف", portion: 1, budget: "low", tags: ["all"] },
    { name: "قرصانة بر", cal: 215, pro: 7, carb: 44, fat: 1.5, unit: "طبق", portion: 1, budget: "low", tags: ["all"] },
  ],

  // ======= VEGETABLES =======
  veggies: [
    { name: "سلطة خضراء مشكلة", cal: 30, pro: 2, carb: 5, fat: 0.5, unit: "طبق كبير", portion: 1, budget: "low", tags: ["all"] },
    { name: "خيار وطماطم", cal: 25, pro: 1.5, carb: 5, fat: 0.2, unit: "طبق", portion: 1, budget: "low", tags: ["all"] },
    { name: "بروكلي مسلوق", cal: 55, pro: 4, carb: 11, fat: 0.6, unit: "طبق (200 جم)", portion: 1, budget: "mid", tags: ["all"] },
    { name: "كوسة مشوية", cal: 35, pro: 2.5, carb: 7, fat: 0.4, unit: "طبق", portion: 1, budget: "low", tags: ["all"] },
    { name: "جزر مسلوق", cal: 50, pro: 1.2, carb: 12, fat: 0.3, unit: "طبق", portion: 1, budget: "low", tags: ["all"] },
    { name: "سبانخ مطبوخة", cal: 50, pro: 5, carb: 6, fat: 0.8, unit: "طبق (200 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "ملوخية مطبوخة", cal: 50, pro: 3.5, carb: 6, fat: 1, unit: "طبق", portion: 1, budget: "low", tags: ["all"] },
    { name: "فاصوليا خضراء مسلوقة", cal: 45, pro: 3, carb: 9, fat: 0.3, unit: "طبق", portion: 1, budget: "low", tags: ["all"] },
    { name: "بامية مطبوخة", cal: 55, pro: 3, carb: 10, fat: 0.5, unit: "طبق", portion: 1, budget: "low", tags: ["all"] },
    { name: "فلفل ألوان", cal: 35, pro: 1, carb: 8, fat: 0.3, unit: "حبتان", portion: 1, budget: "mid", tags: ["all"] },
    { name: "طماطم طازجة", cal: 22, pro: 1, carb: 4.8, fat: 0.2, unit: "حبتان", portion: 1, budget: "low", tags: ["all"] },
    { name: "خيار طازج", cal: 16, pro: 0.7, carb: 3.6, fat: 0.1, unit: "حبتان", portion: 1, budget: "low", tags: ["all"] },
    { name: "ثوم ومقليات مع خضروات", cal: 70, pro: 2, carb: 10, fat: 3, unit: "طبق", portion: 1, budget: "low", tags: ["all"] },
  ],

  // ======= FRUITS =======
  fruits: [
    { name: "موز", cal: 90, pro: 1.1, carb: 23, fat: 0.3, unit: "حبة متوسطة", portion: 1, budget: "low", tags: ["all"] },
    { name: "تفاح", cal: 80, pro: 0.4, carb: 21, fat: 0.2, unit: "حبة متوسطة", portion: 1, budget: "low", tags: ["all"] },
    { name: "برتقال", cal: 65, pro: 1.2, carb: 16, fat: 0.2, unit: "حبة كبيرة", portion: 1, budget: "low", tags: ["all"] },
    { name: "عنب", cal: 70, pro: 0.6, carb: 18, fat: 0.2, unit: "عنقود صغير (100 جم)", portion: 1, budget: "mid", tags: ["all"] },
    { name: "بطيخ أحمر", cal: 50, pro: 1, carb: 12, fat: 0.2, unit: "شريحتان كبيرتان", portion: 1, budget: "low", tags: ["all"] },
    { name: "خوخ", cal: 60, pro: 1.4, carb: 15, fat: 0.3, unit: "حبتان", portion: 1, budget: "mid", tags: ["all"] },
    { name: "فراولة", cal: 50, pro: 1, carb: 12, fat: 0.5, unit: "كوب (150 جم)", portion: 1, budget: "mid", tags: ["all"] },
    { name: "مانجو", cal: 100, pro: 1.4, carb: 25, fat: 0.4, unit: "شريحتان كبيرتان", portion: 1, budget: "mid", tags: ["all"] },
  ],

  // ======= DAIRY =======
  dairy: [
    { name: "حليب كامل الدسم", cal: 150, pro: 8, carb: 11, fat: 8, unit: "كوب (250 مل)", portion: 1, budget: "low", tags: ["all"] },
    { name: "حليب خالي الدسم", cal: 90, pro: 9, carb: 12, fat: 0.2, unit: "كوب (250 مل)", portion: 1, budget: "low", tags: ["all"] },
    { name: "زبادي عادي", cal: 120, pro: 8, carb: 14, fat: 3.5, unit: "كوب (200 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "لبن رايب", cal: 100, pro: 9, carb: 12, fat: 2.5, unit: "كوب (250 مل)", portion: 1, budget: "low", tags: ["all"] },
    { name: "جبن رومي قليل الدسم", cal: 80, pro: 8, carb: 1, fat: 5, unit: "شريحة (30 جم)", portion: 1, budget: "mid", tags: ["all"] },
    { name: "قشطة بالعسل", cal: 180, pro: 3, carb: 20, fat: 10, unit: "طبق صغير", portion: 1, budget: "mid", tags: ["all"] },
  ],

  // ======= FATS / EXTRAS =======
  fats: [
    { name: "زيت زيتون", cal: 120, pro: 0, carb: 0, fat: 14, unit: "ملعقة كبيرة", portion: 1, budget: "mid", tags: ["all"] },
    { name: "لبن زبادي يوناني بالعسل", cal: 160, pro: 14, carb: 18, fat: 2, unit: "كوب", portion: 1, budget: "mid", tags: ["all"] },
    { name: "مكسرات مشكلة", cal: 160, pro: 5, carb: 8, fat: 14, unit: "حفنة صغيرة (30 جم)", portion: 1, budget: "mid", tags: ["all"] },
    { name: "فول سوداني", cal: 170, pro: 7.5, carb: 6, fat: 14, unit: "حفنة صغيرة (30 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "بذر الكتان المطحون", cal: 55, pro: 1.9, carb: 3, fat: 4.3, unit: "ملعقة كبيرة (10 جم)", portion: 1, budget: "mid", tags: ["all"] },
    { name: "حمص بالطحينة", cal: 200, pro: 8, carb: 22, fat: 10, unit: "طبق صغير (150 جم)", portion: 1, budget: "low", tags: ["all"] },
    { name: "طاحينة", cal: 90, pro: 2.6, carb: 3, fat: 8, unit: "ملعقة كبيرة", portion: 1, budget: "low", tags: ["all"] },
    { name: "أفوكادو", cal: 160, pro: 2, carb: 9, fat: 15, unit: "نصف حبة", portion: 1, budget: "high", tags: ["all"] },
  ],

  // ======= DRINKS / SNACKS =======
  snacks: [
    { name: "زبادي بالفواكه", cal: 140, pro: 7, carb: 24, fat: 2, unit: "كوب", portion: 1, budget: "low", tags: ["all"] },
    { name: "شوفان بالحليب والعسل", cal: 250, pro: 8, carb: 45, fat: 4, unit: "طبق متوسط", portion: 1, budget: "low", tags: ["all"] },
    { name: "عصير برتقال طازج", cal: 110, pro: 1.7, carb: 26, fat: 0.3, unit: "كوب كبير", portion: 1, budget: "low", tags: ["all"] },
    { name: "سموذي موز وحليب", cal: 200, pro: 6, carb: 38, fat: 3, unit: "كوب كبير", portion: 1, budget: "low", tags: ["all"] },
    { name: "بسكويت شوفان منزلي", cal: 120, pro: 3, carb: 20, fat: 4, unit: "3 قطع", portion: 1, budget: "low", tags: ["all"] },
    { name: "تمر", cal: 140, pro: 1.2, carb: 38, fat: 0.2, unit: "4 حبات", portion: 1, budget: "low", tags: ["all"] },
    { name: "عصير خضار مشكل", cal: 80, pro: 3, carb: 16, fat: 0.5, unit: "كوب", portion: 1, budget: "mid", tags: ["all"] },
    { name: "كوكتيل فواكه خفيف", cal: 120, pro: 1.5, carb: 29, fat: 0.5, unit: "طبق متوسط", portion: 1, budget: "low", tags: ["all"] },
    { name: "عيش بسكويت بالجبنة القريش", cal: 160, pro: 10, carb: 22, fat: 3, unit: "وجبة", portion: 1, budget: "low", tags: ["all"] },
    { name: "جرانولا بالزبادي", cal: 220, pro: 9, carb: 33, fat: 7, unit: "طبق", portion: 1, budget: "mid", tags: ["all"] },
  ]
};

// ============================================
//   MEAL TEMPLATES
// ============================================
// Each template: array of food categories and items
const MEAL_TEMPLATES = {
  breakfast: [
    { protein: ["بيض مسلوق", "جبنة قريش", "زبادي يوناني خالي الدسم"], carb: ["خبز بلدي", "خبز توست أبيض", "شوفان مطبوخ بالماء"], side: ["خيار وطماطم", "طماطم طازجة"] },
    { protein: ["بيض مقلي بالزيت", "بيض عيون بالسمن"], carb: ["خبز بلدي", "خبز توست أسمر"], side: ["خيار وطماطم", "طماطم طازجة"] },
    { protein: ["فول مدمس", "فول مدمس بالزيت والكمون"], carb: ["خبز بلدي", "عيش شمس"], side: ["خيار وطماطم"] },
    { protein: ["زبادي يوناني خالي الدسم", "جبنة قريش"], carb: ["شوفان مطبوخ بالماء", "كورن فليكس بالحليب"], side: ["موز", "فراولة", "تفاح"] },
    { protein: ["بيض مسلوق", "زبادي عادي"], carb: ["خبز توست أسمر", "خبز صاج رقيق"], side: ["خيار طازج"] },
  ],
  snack1: [
    ["موز", "تفاح", "برتقال"],
    ["زبادي بالفواكه", "زبادي يوناني خالي الدسم"],
    ["مكسرات مشكلة", "فول سوداني"],
    ["تمر", "بسكويت شوفان منزلي"],
    ["فراولة", "عنب"],
    ["جبنة قريش", "خيار وطماطم"],
  ],
  lunch: [
    { protein: ["صدر دجاج مشوي", "أفخاذ دجاج مشوية", "صدر دجاج مسلوق"], carb: ["أرز أبيض مطبوخ", "أرز بني مطبوخ", "مكرونة مسلوقة"], veggie: ["سلطة خضراء مشكلة", "بروكلي مسلوق", "كوسة مشوية"] },
    { protein: ["تونة معلبة بالماء", "سردين معلب بالزيت", "سمك بياض مشوي", "بلطي مشوي"], carb: ["أرز أبيض مطبوخ", "أرز بني مطبوخ", "بطاطس مسلوقة"], veggie: ["سلطة خضراء مشكلة", "خيار وطماطم"] },
    { protein: ["لحم بقر مشوي", "كبدة بانيه"], carb: ["أرز أبيض مطبوخ", "خبز بلدي"], veggie: ["سلطة خضراء مشكلة", "جزر مسلوق"] },
    { protein: ["عدس أحمر مطبوخ", "شوربة عدس"], carb: ["أرز أبيض مطبوخ", "خبز بلدي", "عيش شمس"], veggie: ["سلطة خضراء مشكلة", "خيار وطماطم"] },
    { protein: ["فراخ كاملة مشوية", "صدر دجاج مشوي"], carb: ["أرز بني مطبوخ", "كسكس مطبوخ"], veggie: ["فاصوليا خضراء مسلوقة", "بروكلي مسلوق"] },
    { protein: ["سمك بياض مشوي", "جمبري مشوي"], carb: ["بطاطا حلوة مشوية", "أرز أبيض مطبوخ"], veggie: ["سلطة خضراء مشكلة", "فلفل ألوان"] },
  ],
  snack2: [
    ["عصير برتقال طازج", "سموذي موز وحليب"],
    ["جبنة قريش", "خيار طازج"],
    ["مكسرات مشكلة", "تمر"],
    ["زبادي يوناني خالي الدسم", "تفاح"],
    ["جرانولا بالزبادي", "زبادي بالفواكه"],
    ["فول سوداني", "موز"],
    ["عيش بسكويت بالجبنة القريش"],
  ],
  dinner: [
    { protein: ["صدر دجاج مسلوق", "صدر دجاج مشوي", "أفخاذ دجاج مشوية"], carb: ["بطاطس مسلوقة", "خبز توست أسمر", "بطاطا حلوة مشوية"], veggie: ["سلطة خضراء مشكلة", "كوسة مشوية", "سبانخ مطبوخة"] },
    { protein: ["بيض مسلوق", "بيض مقلي بالزيت"], carb: ["خبز توست أسمر", "خبز بلدي"], veggie: ["خيار وطماطم", "طماطم طازجة"] },
    { protein: ["تونة معلبة بالماء", "سردين معلب بالزيت"], carb: ["خبز توست أسمر", "خبز صاج رقيق"], veggie: ["سلطة خضراء مشكلة", "فلفل ألوان"] },
    { protein: ["جبنة قريش", "زبادي يوناني خالي الدسم"], carb: ["شوفان مطبوخ بالماء", "خبز توست أسمر"], veggie: ["تفاح", "موز"] },
    { protein: ["فول مدمس", "حمص مسلوق"], carb: ["خبز بلدي", "خبز صاج رقيق"], veggie: ["خيار وطماطم", "سلطة خضراء مشكلة"] },
    { protein: ["شوربة عدس", "فاصوليا بيضاء مطبوخة"], carb: ["خبز توست أسمر", "خبز بلدي"], veggie: ["سلطة خضراء مشكلة"] },
  ]
};

// ============================================
//   HELPERS
// ============================================
function randFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function findFood(name) {
  for (const cat of Object.values(FOODS)) {
    const found = cat.find(f => f.name === name);
    if (found) return found;
  }
  return null;
}

function scaleFood(food, targetCals) {
  const ratio = targetCals / food.cal;
  return {
    name: food.name,
    cal: Math.round(food.cal * ratio),
    pro: Math.round(food.pro * ratio * 10) / 10,
    carb: Math.round(food.carb * ratio * 10) / 10,
    fat: Math.round(food.fat * ratio * 10) / 10,
    amount: food.unit,
    baseAmount: food.portion,
    ratio: ratio
  };
}

function formatAmount(food, ratio) {
  const r = Math.round(ratio * 10) / 10;
  if (r === 1) return `${food.portion} ${food.unit}`;
  if (food.unit === 'جم') return `${Math.round(food.portion * ratio)} ${food.unit}`;
  if (r <= 1.2 && r >= 0.8) return `${food.portion} ${food.unit}`;
  const x = Math.round(r * 2) / 2;
  return `${x} × ${food.unit}`;
}

// ============================================
//   CALCULATION ENGINE
// ============================================
function calculateBMR(weight, height, age, gender) {
  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
}

function calculateBMI(weight, height) {
  const h = height / 100;
  return weight / (h * h);
}

function getBMIStatus(bmi) {
  if (bmi < 18.5) return { text: "نقص الوزن", color: "#3498db" };
  if (bmi < 25) return { text: "وزن طبيعي ✓", color: "#2dbe6c" };
  if (bmi < 30) return { text: "وزن زائد", color: "#f39c12" };
  if (bmi < 35) return { text: "سمنة درجة 1", color: "#e67e22" };
  if (bmi < 40) return { text: "سمنة درجة 2", color: "#e74c3c" };
  return { text: "سمنة مرضية", color: "#c0392b" };
}

function getDeficit(bmi, targetWeight, currentWeight) {
  const needLoss = targetWeight < currentWeight;
  if (!needLoss) return 0;
  if (bmi < 25) return 0.10;
  if (bmi < 30) return 0.15;
  if (bmi < 35) return 0.20;
  return 0.25;
}

function calcMacros(calories, conditions) {
  let pct = { pro: 0.30, carb: 0.45, fat: 0.25 };
  if (conditions.includes("diabetes")) { pct.carb = 0.35; pct.pro = 0.35; pct.fat = 0.30; }
  if (conditions.includes("kidney")) { pct.pro = 0.20; pct.carb = 0.55; pct.fat = 0.25; }
  const pro = Math.round((calories * pct.pro) / 4);
  const carb = Math.round((calories * pct.carb) / 4);
  const fat = Math.round((calories * pct.fat) / 9);
  return { pro, carb, fat };
}

// ============================================
//   SCROLL TO FORM
// ============================================
function scrollToForm() {
  document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
//   GENERATE DIET PLAN
// ============================================
let lastUserData = null;

function generateDiet() {
  // Validate required fields
  const gender = document.querySelector('input[name="gender"]:checked');
  const age = document.getElementById('age').value;
  const height = document.getElementById('height').value;
  const weight = document.getElementById('weight').value;
  const activity = document.querySelector('input[name="activity"]:checked');

  if (!gender || !age || !height || !weight || !activity) {
    alert('يرجى ملء جميع الحقول الإلزامية (الجنس، العمر، الطول، الوزن، مستوى النشاط)');
    return;
  }

  const btn = document.querySelector('.btn-submit');
  btn.classList.add('loading');
  btn.textContent = '...جاري الحساب';

  setTimeout(() => {
    // Collect all data
    const userData = {
      name: document.getElementById('name').value || 'صديقي',
      gender: gender.value,
      age: parseInt(age),
      height: parseFloat(height),
      weight: parseFloat(weight),
      targetWeight: parseFloat(document.getElementById('targetWeight').value) || parseFloat(weight),
      activityFactor: parseFloat(activity.value),
      workType: document.getElementById('workType').value,
      sleep: parseFloat(document.getElementById('sleep').value) || 7,
      waterInput: parseFloat(document.getElementById('water').value) || 0,
      conditions: [...document.querySelectorAll('input[name="conditions"]:checked')].map(e => e.value),
      medications: document.getElementById('medications').value,
      allergies: document.getElementById('allergies').value,
      favFoods: document.getElementById('favFoods').value,
      avoidFoods: document.getElementById('avoidFoods').value,
      budget: document.querySelector('input[name="budget"]:checked')?.value || 'medium',
      country: document.getElementById('country').value,
      fatPercent: parseFloat(document.getElementById('fatPercent').value) || null,
      muscleMass: parseFloat(document.getElementById('muscleMass').value) || null,
      visceralFat: parseFloat(document.getElementById('visceralFat').value) || null,
      inbodyBMR: parseFloat(document.getElementById('inbodyBMR').value) || null,
      waterPercent: parseFloat(document.getElementById('waterPercent').value) || null,
    };

    lastUserData = userData;
    renderResults(userData);

    btn.classList.remove('loading');
    btn.innerHTML = '<span class="btn-icon">✨</span> إنشاء نظامي الغذائي';

    document.getElementById('results').style.display = 'block';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
  }, 800);
}

// ============================================
//   RENDER RESULTS
// ============================================
function renderResults(u) {
  // ---- Calculations ----
  const bmi = calculateBMI(u.weight, u.height);
  const bmr = u.inbodyBMR || calculateBMR(u.weight, u.height, u.age, u.gender);
  const tdee = Math.round(bmr * u.activityFactor);
  const deficit = getDeficit(bmi, u.targetWeight, u.weight);
  const targetCals = Math.round(tdee * (1 - deficit));
  const macros = calcMacros(targetCals, u.conditions);
  const bmiStatus = getBMIStatus(bmi);

  // Recommended water (weight * 30-35 ml)
  const recWater = Math.round(u.weight * 0.033 * 10) / 10;

  // ---- Warning ----
  const warningBox = document.getElementById('warningBox');
  const warningText = document.getElementById('warningText');
  let warnings = [];
  if (bmi > 35) warnings.push("⚠️ مؤشر كتلة الجسم لديك مرتفع جداً. يُنصح بشدة باستشارة طبيب أو أخصائي تغذية قبل البدء بأي نظام غذائي.");
  if (u.conditions.includes("diabetes")) warnings.push("⚠️ لديك مرض السكري — تم تعديل نسبة الكارب. يجب استشارة طبيبك.");
  if (u.conditions.includes("kidney")) warnings.push("⚠️ مشاكل الكلى تستلزم تحديد البروتين. راجع طبيبك.");
  if (u.conditions.includes("liver")) warnings.push("⚠️ مشاكل الكبد تستلزم متابعة طبية دقيقة للنظام الغذائي.");

  if (warnings.length > 0) {
    warningText.innerHTML = warnings.join('<br>');
    warningBox.style.display = 'flex';
  } else {
    warningBox.style.display = 'none';
  }

  // ---- Welcome ----
  document.getElementById('welcomeName').textContent = `نظامك الغذائي يا ${u.name}`;

  // ---- Analysis Cards ----
  const analysisGrid = document.getElementById('analysisGrid');
  analysisGrid.innerHTML = `
    <div class="analysis-card" style="--accent-color: ${bmiStatus.color}">
      <div class="card-icon">⚖️</div>
      <div class="card-value">${bmi.toFixed(1)}</div>
      <div class="card-unit">كجم/م²</div>
      <div class="card-label">مؤشر كتلة الجسم</div>
      <div class="card-status" style="color:${bmiStatus.color}">${bmiStatus.text}</div>
    </div>
    <div class="analysis-card" style="--accent-color:#9b59b6">
      <div class="card-icon">🔥</div>
      <div class="card-value">${Math.round(bmr)}</div>
      <div class="card-unit">سعرة/يوم</div>
      <div class="card-label">معدل الحرق الأساسي BMR</div>
    </div>
    <div class="analysis-card" style="--accent-color:#e67e22">
      <div class="card-icon">⚡</div>
      <div class="card-value">${tdee}</div>
      <div class="card-unit">سعرة/يوم</div>
      <div class="card-label">إجمالي استهلاك الطاقة TDEE</div>
    </div>
    <div class="analysis-card" style="--accent-color:#2dbe6c">
      <div class="card-icon">🎯</div>
      <div class="card-value">${targetCals}</div>
      <div class="card-unit">سعرة/يوم</div>
      <div class="card-label">هدف السعرات اليومي</div>
      <div class="card-status" style="color:#2dbe6c">${deficit > 0 ? `عجز ${Math.round(deficit*100)}%` : 'صيانة الوزن'}</div>
    </div>
    ${u.fatPercent ? `<div class="analysis-card" style="--accent-color:#e74c3c"><div class="card-icon">📊</div><div class="card-value">${u.fatPercent}%</div><div class="card-unit"></div><div class="card-label">نسبة الدهون</div></div>` : ''}
    ${u.visceralFat ? `<div class="analysis-card" style="--accent-color:#c0392b"><div class="card-icon">🫀</div><div class="card-value">${u.visceralFat}</div><div class="card-unit">درجة</div><div class="card-label">الدهون الحشوية</div></div>` : ''}
  `;

  // ---- Macros ----
  document.getElementById('macrosSection').innerHTML = `
    <div class="macros-section">
      <h3>🥗 توزيع الماكروز اليومية</h3>
      <div class="macros-grid">
        <div class="macro-card">
          <div class="macro-bar" style="background:rgba(52,152,219,0.2)">🥩</div>
          <div class="m-val">${macros.pro}</div>
          <div class="m-unit">جرام</div>
          <div class="m-label">بروتين</div>
          <div class="m-cals">${Math.round(macros.pro * 4)} سعرة</div>
        </div>
        <div class="macro-card">
          <div class="macro-bar" style="background:rgba(241,196,15,0.2)">🍚</div>
          <div class="m-val">${macros.carb}</div>
          <div class="m-unit">جرام</div>
          <div class="m-label">كربوهيدرات</div>
          <div class="m-cals">${Math.round(macros.carb * 4)} سعرة</div>
        </div>
        <div class="macro-card">
          <div class="macro-bar" style="background:rgba(231,76,60,0.2)">🥑</div>
          <div class="m-val">${macros.fat}</div>
          <div class="m-unit">جرام</div>
          <div class="m-label">دهون</div>
          <div class="m-cals">${Math.round(macros.fat * 9)} سعرة</div>
        </div>
      </div>
    </div>
  `;

  // ---- Diet Plan ----
  const plan = buildMealPlan(targetCals, macros, u);
  const dietSection = document.getElementById('dietPlanSection');
  dietSection.innerHTML = `<h3>🍽️ النظام الغذائي اليومي</h3>` + plan.map(meal => renderMealCard(meal)).join('');

  // ---- Recommendations ----
  const stepsRec = bmi < 25 ? '7,000 - 10,000' : bmi < 30 ? '8,000 - 12,000' : '5,000 - 8,000';
  const exerciseRec = getExerciseRec(u.conditions, bmi);
  const waterRec = recWater;

  document.getElementById('recommendationsSection').innerHTML = `
    <div class="recommendations-section">
      <h3>💡 التوصيات اليومية</h3>
      <div class="recs-grid">
        <div class="rec-card">
          <div class="rec-icon">💧</div>
          <div class="rec-title">الماء اليومي</div>
          <div class="rec-value">${waterRec} لتر</div>
          <div class="rec-note">موزعة على مدار اليوم</div>
        </div>
        <div class="rec-card">
          <div class="rec-icon">👟</div>
          <div class="rec-title">خطوات يومية</div>
          <div class="rec-value">${stepsRec}</div>
          <div class="rec-note">خطوة يومياً</div>
        </div>
        <div class="rec-card">
          <div class="rec-icon">🏃</div>
          <div class="rec-title">التمارين المقترحة</div>
          <div class="rec-value" style="font-size:0.9rem">${exerciseRec.type}</div>
          <div class="rec-note">${exerciseRec.duration}</div>
        </div>
        <div class="rec-card">
          <div class="rec-icon">😴</div>
          <div class="rec-title">النوم</div>
          <div class="rec-value">7 - 9 ساعات</div>
          <div class="rec-note">للتعافي وحرق الدهون</div>
        </div>
        <div class="rec-card">
          <div class="rec-icon">📅</div>
          <div class="rec-title">مراجعة النتائج</div>
          <div class="rec-value">كل 4 أسابيع</div>
          <div class="rec-note">قس الوزن والمقاسات</div>
        </div>
        <div class="rec-card">
          <div class="rec-icon">🚫</div>
          <div class="rec-title">يجب تقليله</div>
          <div class="rec-value" style="font-size:0.85rem">السكر والمقليات</div>
          <div class="rec-note">والمشروبات الغازية</div>
        </div>
      </div>
      <p style="margin-top:1.25rem; font-size:0.8rem; color:#888; line-height:1.7;">
        ⚠️ <strong>تنبيه طبي:</strong> هذا النظام إرشادي فقط. يُنصح باستشارة طبيب أو أخصائي تغذية معتمد قبل البدء، خاصة في حال وجود أمراض مزمنة أو أدوية.
      </p>
    </div>
  `;
}

// ============================================
//   BUILD MEAL PLAN
// ============================================
function buildMealPlan(totalCals, macros, userData) {
  // Calorie distribution: 25% / 10% / 35% / 10% / 20%
  const mealCals = {
    breakfast: Math.round(totalCals * 0.25),
    snack1: Math.round(totalCals * 0.10),
    lunch: Math.round(totalCals * 0.35),
    snack2: Math.round(totalCals * 0.10),
    dinner: Math.round(totalCals * 0.20),
  };

  const meals = [];

  // BREAKFAST
  const bfTemplate = randFrom(MEAL_TEMPLATES.breakfast);
  meals.push(buildStructuredMeal('فطار', '🌅', '7:00 - 8:00 ص', mealCals.breakfast,
    [randFrom(bfTemplate.protein), randFrom(bfTemplate.carb), randFrom(bfTemplate.side)],
    '#e8f8f0'));

  // SNACK 1
  const sn1 = randFrom(MEAL_TEMPLATES.snack1);
  meals.push(buildSimpleMeal('سناك صباحي', '🍎', '10:30 ص', mealCals.snack1,
    Array.isArray(sn1) ? [randFrom(sn1)] : [sn1], '#fff8e1'));

  // LUNCH
  const lunchTemplate = randFrom(MEAL_TEMPLATES.lunch);
  meals.push(buildStructuredMeal('غداء', '🍽️', '1:00 - 2:00 م', mealCals.lunch,
    [randFrom(lunchTemplate.protein), randFrom(lunchTemplate.carb), randFrom(lunchTemplate.veggie)],
    '#e8f0fe'));

  // SNACK 2
  const sn2 = randFrom(MEAL_TEMPLATES.snack2);
  meals.push(buildSimpleMeal('سناك مسائي', '🥤', '4:30 م', mealCals.snack2,
    Array.isArray(sn2) ? [randFrom(sn2)] : [sn2], '#fce4ec'));

  // DINNER
  const dinnerTemplate = randFrom(MEAL_TEMPLATES.dinner);
  meals.push(buildStructuredMeal('عشاء', '🌙', '7:00 - 8:00 م', mealCals.dinner,
    [randFrom(dinnerTemplate.protein), randFrom(dinnerTemplate.carb), randFrom(dinnerTemplate.veggie)],
    '#f3e5f5'));

  return meals;
}

function buildStructuredMeal(name, icon, time, targetCals, foodNames, bgColor) {
  // Distribute calories: 50% protein, 35% carb/veggie, 15% sides
  const items = [];
  const weights = [0.45, 0.40, 0.15];
  let totalMeal = { cal: 0, pro: 0, carb: 0, fat: 0 };

  foodNames.forEach((fname, i) => {
    const food = findFood(fname);
    if (!food) return;
    const itemCals = Math.round(targetCals * weights[i]);
    const ratio = Math.max(0.5, Math.min(3, itemCals / food.cal));
    const item = {
      name: food.name,
      amount: formatAmount(food, ratio),
      cal: Math.round(food.cal * ratio),
      pro: Math.round(food.pro * ratio * 10) / 10,
      carb: Math.round(food.carb * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
    };
    items.push(item);
    totalMeal.cal += item.cal;
    totalMeal.pro += item.pro;
    totalMeal.carb += item.carb;
    totalMeal.fat += item.fat;
  });

  return { name, icon, time, items, total: totalMeal, bgColor };
}

function buildSimpleMeal(name, icon, time, targetCals, foodNames, bgColor) {
  const items = [];
  let totalMeal = { cal: 0, pro: 0, carb: 0, fat: 0 };

  foodNames.forEach(fname => {
    const food = findFood(fname);
    if (!food) return;
    const ratio = Math.max(0.5, Math.min(3, targetCals / food.cal));
    const item = {
      name: food.name,
      amount: formatAmount(food, ratio),
      cal: Math.round(food.cal * ratio),
      pro: Math.round(food.pro * ratio * 10) / 10,
      carb: Math.round(food.carb * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
    };
    items.push(item);
    totalMeal.cal += item.cal;
    totalMeal.pro += item.pro;
    totalMeal.carb += item.carb;
    totalMeal.fat += item.fat;
  });

  return { name, icon, time, items, total: totalMeal, bgColor };
}

// ============================================
//   RENDER MEAL CARD
// ============================================
function renderMealCard(meal) {
  const foodItemsHtml = meal.items.map(item => `
    <div class="food-item">
      <span class="food-name">${item.name}</span>
      <span class="food-amount">${item.amount}</span>
      <div class="food-macro-tags">
        <span class="food-tag tag-p">${item.pro}ب</span>
        <span class="food-tag tag-c">${item.carb}ك</span>
        <span class="food-tag tag-f">${item.fat}د</span>
      </div>
    </div>
  `).join('');

  return `
    <div class="meal-card">
      <div class="meal-header" style="background:${meal.bgColor}">
        <div class="meal-header-right">
          <span class="meal-icon">${meal.icon}</span>
          <div>
            <div class="meal-name">${meal.name}</div>
            <div class="meal-time">⏰ ${meal.time}</div>
          </div>
        </div>
        <span class="meal-cals-badge">🔥 ${Math.round(meal.total.cal)} سعرة</span>
      </div>
      <div class="meal-body">
        <div class="meal-macros-row">
          <span class="meal-macro"><span class="mm-dot" style="background:#3498db"></span> بروتين: ${Math.round(meal.total.pro)} جم</span>
          <span class="meal-macro"><span class="mm-dot" style="background:#f1c40f"></span> كارب: ${Math.round(meal.total.carb)} جم</span>
          <span class="meal-macro"><span class="mm-dot" style="background:#e74c3c"></span> دهون: ${Math.round(meal.total.fat)} جم</span>
        </div>
        <div class="food-items">${foodItemsHtml}</div>
      </div>
    </div>
  `;
}

// ============================================
//   EXERCISE RECOMMENDATIONS
// ============================================
function getExerciseRec(conditions, bmi) {
  if (conditions.includes("kidney") || conditions.includes("liver")) {
    return { type: "مشي خفيف فقط", duration: "20-30 دقيقة يومياً" };
  }
  if (bmi > 35) {
    return { type: "مشي + سباحة", duration: "30 دقيقة / 4 أيام" };
  }
  if (bmi > 25) {
    return { type: "كارديو + وزن حر", duration: "40-45 دقيقة / 4-5 أيام" };
  }
  return { type: "رفع أثقال + كارديو", duration: "45-60 دقيقة / 5 أيام" };
}

// ============================================
//   ACTIONS
// ============================================
function regeneratePlan() {
  if (!lastUserData) return;
  renderResults(lastUserData);
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

function newUser() {
  document.getElementById('dietForm').reset();
  document.getElementById('results').style.display = 'none';
  document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
  lastUserData = null;
}

function printPlan() {
  window.print();
}

function downloadPDF() {
  // Use browser's built-in print-to-PDF
  const printCSS = `
    <style>
      body { font-family: 'Cairo', sans-serif; direction: rtl; font-size: 13px; }
      .hero, .form-section, .site-footer, .results-actions, .btn-action { display: none !important; }
      .results-section { display: block !important; padding: 20px !important; background: #fff !important; }
      .analysis-card, .meal-card, .macro-card { break-inside: avoid; }
      .macros-section { background: #333 !important; color: #fff !important; }
    </style>
  `;

  const originalTitle = document.title;
  document.title = `نظام غذائي - ${lastUserData?.name || 'مستخدم'}`;

  const style = document.createElement('style');
  style.id = 'pdf-style';
  style.innerHTML = `
    @media screen {
      .hero, .form-section, .site-footer { display: block; }
    }
  `;

  window.print();
  document.title = originalTitle;
}

// ============================================
//   INIT — Checkbox "لا شيء" mutual exclusion
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const noneCheck = document.getElementById('cond-none');
  const allChecks = document.querySelectorAll('input[name="conditions"]');

  if (noneCheck) {
    noneCheck.addEventListener('change', () => {
      if (noneCheck.checked) {
        allChecks.forEach(c => { if (c !== noneCheck) c.checked = false; });
      }
    });
    allChecks.forEach(c => {
      if (c !== noneCheck) {
        c.addEventListener('change', () => {
          if (c.checked) noneCheck.checked = false;
        });
      }
    });
  }
});
