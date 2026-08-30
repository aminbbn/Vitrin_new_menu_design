# Vitrin Digital Menu Experience — Standalone Frontend Prototype

> پروتوتایپ بازطراحی تجربه منوی دیجیتال مشتریان ویترین (Vitrin)
> رویکرد: **برندمحور (Brand-Driven)**، **مبتنی بر تم (Template-Based)** و **موبایل‌محور (Mobile-First)**

---

## 🌟 نمای کلی پروژه (Project Overview)

این پروژه پروتوتایپ مستقل فرانت‌اند برای تجربه جدید منوی دیجیتال مشتریان ویترین است. در این معماری، منوی رستوران از حالت سنتی و بلوکی خارج شده و به یک **مینی‌وب‌سایت اختصاصی برند رستوران** تبدیل می‌شود که دارای دو فاز اساسی است:

1. **تجربه معرفی و هیرو برند (Hero / Brand Intro Experience)**
2. **تجربه کاوش منو (Menu Exploration Experience)**

ترنزیشن پیوسته و روان (بدون Hard-Cut) از هیرو به منو، قلب تپنده این تجربه کاربری است.

---

## 🚀 ویژگی‌های کلیدی پیاده‌سازی شده

- **۳ پوسته کاملاً متمایز با ساختار یکپارچه داده (Shared Data Model):**
  - **پوسته ۱: تحریریه‌ای و غوطه‌ور (Theme 01: Immersive / Editorial)** — هیرو تمام‌صفحه سینمایی، تم مشکی/زمردی/طلایی، ترنزیشن فشردگی هیرو به هدر چسبان، بخش‌های برجسته با تصویر بزرگ و کارت‌های افقی.
  - **پوسته ۲: مدرن و خوراک‌محور (Theme 02: Modern / Food-First)** — هیرو ۵۰vh با تصویر امضای غذا، ترنزیشن سریع‌تر، چیپ‌های دسته‌بندی استیکی، کارت‌های عمودی عکس‌محور و دسترسی آنی.
  - **پوسته ۳: مینیمال و معماری‌محور (Theme 03: Minimal / Design-Led)** — چیدمان هندسی دوگانه، تایپوگرافی برجسته، ترنزیشن ماسک و کشف محتوا، فضاهای منفی متوازن و ریتم نامتقارن کارت‌ها.
- **تضمین محدودیت‌های شفاف محصول (No Cart / No Checkout):**
  - صرفاً جهت معرفی، پرزنت و مشاهده محتویات غذا، قیمت‌ها، زمان آماده‌سازی، کالری، ترکیبات، نشان‌های گیاه‌خواری و تند بودن.
  - پنجره جزئیات محصول (Product Detail Sheet) بدون هرگونه دکمه افزودن به سبد خرید یا ثبت سفارش.
- **ناوبری چسبان دسته‌بندی‌ها (Sticky Category Navigation):**
  - تشخیص خودکار سکشن فعال با `IntersectionObserver`
  - اسکرول نرم (Smooth Scroll) به سکشن مربوطه هنگام کلیک روی دسته‌ها
- **پشتیبانی کامل از زبان فارسی و راست‌چین (RTL & Persian Typography):**
  - جهت‌گیری `dir="rtl"`
  - فرمت خودکار قیمت به تومان با اعداد فارسی (`formatToman`)
  - تعریف متغیرهای فونت برای جایگزینی مستقیم با `IRANYekanX`
- **حالت پنل مدیریت ویترین (Vitrin Dashboard Experience Designer Mode):**
  - امکان تغییر زنده رنگ شاخص (Accent Color)، تیترهای هیرو، سرعت ترنزیشن و خروجی JSON کانفیگ جهت ادغام در پنل آینده ویترین.
- **جعبه‌ابزار تست رسپانسیو (Responsive Viewport Switcher):**
  - تست فوری در ۳۶۰px (اندروید استاندارد)، ۳۹۰px (آیفون پرو)، ۴۳۰px (آیفون پلاس/مکس) و Full Responsive Web.

---

## 📂 ساختار فایل‌ها و معماری ماژولار

```
/src
├── types/
│   └── menu.ts                 # تایپ‌های MenuItem, RestaurantData, MenuThemeConfig, ThemeId
├── data/
│   └── mockMenuData.ts         # دیتای واقع‌گرایانه رستوران بونو، عکس‌های باکیفیت و کانفیگ پوسته‌ها
├── utils/
│   └── formatters.ts           # تبدیل اعداد فارسی، فرمت تومان، اسکرول نرم
├── components/
│   ├── ThemeRenderer.tsx       # رندرر سراسری پوسته‌ها (سوئیچ تمپلیت بر اساس ThemeId)
│   ├── common/
│   │   ├── ProductDetailModal.tsx   # پنجره شیت اطلاعات محصول (اطلاعاتی محض، بدون سبد خرید)
│   │   └── RestaurantInfoModal.tsx  # شیت اطلاعات، آدرس، ساعات کاری، تلفن، وای‌فای و اینستاگرام
│   ├── themes/
│   │   ├── Theme01Immersive/   # کامپوننت‌های پوسته غوطه‌ور تحریریه‌ای
│   │   │   └── ImmersiveTheme.tsx
│   │   ├── Theme02Modern/      # کامپوننت‌های پوسته مدرن و فست‌کژوال
│   │   │   └── ModernTheme.tsx
│   │   └── Theme03Minimal/     # کامپوننت‌های پوسته مینیمال و معماری‌محور
│   │       └── MinimalTheme.tsx
│   └── showcase/
│       ├── ShowcaseToolbar.tsx # نوار ابزار کنترل تست، تغییر ویوپورت و تغییر وضعیت
│       └── ThemeCustomizer.tsx # پنل شبیه‌ساز Theme Designer ویترین برای ویرایش کانفیگ زنده
├── App.tsx                     # اپلیکیشن ریشه و مدیریت سناریوهای پرویو و کاستومر
├── index.css                   # متغیرهای CSS، استایل فونت‌ها و ترنزیشن‌ها
└── main.tsx                    # انتری‌پوینت ری‌اکت
```

---

## 🛠️ نحوه اجرا در محیط توسعه (How to Run)

```bash
# ۱. نصب پکیج‌ها (در صورت نیاز)
npm install

# ۲. اجرای سرور توسعه
npm run dev

# ۳. بیلد پروداکشن
npm run build

# ۴. بررسی تایپ‌اسکریپت و لینت
npm run lint
```

---

## 🧩 راهنمای اضافه کردن پوسته جدید (How to Add a New Theme)

1. در فایل `src/types/menu.ts`، شناسه تم جدید را به `ThemeId` اضافه کنید:
   ```typescript
   export type ThemeId = 'immersive' | 'modern' | 'minimal' | 'your_new_theme';
   ```
2. کانفیگ پیش‌فرض پوسته را در `src/data/mockMenuData.ts` تعریف کنید:
   ```typescript
   export const themeConfigs = {
     // ...
     your_new_theme: {
       id: 'your_new_theme',
       name: 'Theme 04: ...',
       nameFa: 'پوسته چهارم — ...',
       accentColor: '#...',
       // سایر فیلدهای MenuThemeConfig
     }
   }
   ```
3. پوشه جدیدی در `src/components/themes/Theme04YourTheme/` ساخته و ترنزیشن هیرو به منو و ساختار کارت‌ها را پیاده کنید.
4. کامپوننت جدید را در `src/components/ThemeRenderer.tsx` ایمپورت و در `switch-case` قرار دهید.

---

## 🔄 راهنمای ادغام در پروژه اصلی ویترین (Vitrin Integration Guide)

1. **کپی ماژول‌ها:** تمامی فایل‌های پوشه `src/components/themes/` و `src/types/menu.ts` را به ریپازیتوری اصلی ویترین منتقل کنید.
2. **اتصال به بک‌اند واقعی:** به جای `mockRestaurantData`، دیتای آبجکت `RestaurantData` را از API منوی ویترین پاس دهید.
3. **تزریق فونت `IRANYekanX`:** در فایل CSS اصلی، متغیر `--font-persian` را به فونت لایسنس‌دار IRANYekanX متصل کنید.
4. **طراحی دیتابیس:** فیلد `themeConfig` (شامل `themeId`, `accentColor`, `heroHeadline`, ...) به صورت یک آبجکت JSON ساده در سند رستوران ذخیره می‌شود.

---

## 📱 رعایت اصل Mobile-First

تارگت اصلی طراحی این پروژه ابعاد **۳۹۰ × ۸۴۴ پیکسل** است. تعاملات لمسی با دکمه‌های بزرگتر از ۴۴ پیکسل، هدرهای فشرده با اسکرول، عملکرد ۶۰ فریم بر ثانیه انیمیشن‌های Framer Motion و پشتیبانی کامل از `prefers-reduced-motion` پیاده‌سازی شده‌اند.
