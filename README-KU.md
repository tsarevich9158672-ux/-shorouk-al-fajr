# Shorouk Al Fajr — Hosting

ئەم وەشانە frontend ـەکە بە API و database ـی فایل پەیوەست دەکات، بۆیە گۆڕانکارییەکانی Admin بۆ هەموو بەکارهێنەرەکان دەردەکەون.

## ڕێکخستنی خێرا
1. ئەم folder ـە upload/deploy بکە بۆ hosting ـێک کە Node.js + persistent disk هەبێت.
2. Build command: `npm install`
3. Start command: `npm start`
4. Environment variable دابنێ: `ADMIN_PASSWORD=وشەی نهێنییەکی بەهێز`
5. پۆرتی hosting ـەکە بە `PORT` دیاری دەکرێت.

**تێبینی:** `data/site-data.json` database ـەکەیە. Hosting ـەکەت دەبێت persistent storage هەبێت، بۆ ئەوەی داتا لە restart ـدا نەسڕێتەوە.
