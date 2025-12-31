# ⚡ NeoLingua - Quick Start Guide

Hướng dẫn nhanh để chạy NeoLingua trong **5 phút**!

---

## 📋 Checklist

Trước khi bắt đầu, đảm bảo bạn có:

- [ ] Node.js v20 trở lên
- [ ] Git đã được cài đặt
- [ ] Code editor (VS Code khuyến nghị)
- [ ] Gemini API Key ([Lấy tại đây](https://makersuite.google.com/app/apikey))

---

## 🚀 Bắt đầu trong 5 bước

### **Bước 1: Clone Repository**

```bash
git clone https://github.com/samantha-blablabla/NeoLingua.git
cd NeoLingua
```

### **Bước 2: Cài đặt Dependencies**

```bash
npm install
```

### **Bước 3: Cấu hình API Key**

Tạo file `.env.local`:

```bash
# Windows
echo VITE_GEMINI_API_KEY=your_key_here > .env.local

# macOS/Linux
echo "VITE_GEMINI_API_KEY=your_key_here" > .env.local
```

Hoặc tự tạo file với nội dung:
```env
VITE_GEMINI_API_KEY=AIza...your_actual_key
```

### **Bước 4: Chạy Dev Server**

```bash
npm run dev
```

Mở trình duyệt: **http://localhost:3000**

### **Bước 5: Test trên Mobile** 📱

- Kết nối điện thoại cùng WiFi với máy tính
- Truy cập: **http://YOUR_IP:3000** (IP hiển thị trong console)
- Thử "Add to Home Screen"!

---

## 🎯 Các lệnh thường dùng

```bash
# Development
npm run dev          # Chạy dev server (http://localhost:3000)

# Build & Preview
npm run build        # Build production
npm run preview      # Preview production build

# Daily Tasks
npm run sync         # Auto sync + commit + push
npm run report       # Generate daily report

# Git
git status           # Xem thay đổi
git add .            # Stage changes
git commit -m "msg"  # Commit
git push origin master  # Push lên GitHub
```

---

## 📂 Cấu trúc Project (Quan trọng)

```
NeoLingua/
├── App.tsx              ⭐ Main app component
├── index.tsx            ⭐ Entry point
├── types.ts             📝 TypeScript definitions
├── lessons.ts           📚 Lesson data
├── components/          🧩 React components
│   ├── BadgeGallery.tsx
│   ├── UrbanChat.tsx
│   └── ...
├── services/            ⚙️ Business logic
│   ├── geminiService.ts  (AI integration)
│   ├── speechService.ts  (Text-to-Speech)
│   └── badgeService.ts   (Achievements)
├── public/              📁 Static assets
│   ├── manifest.json     (PWA config)
│   └── sw.js             (Service Worker)
└── reports/             📊 Daily reports
```

---

## 🔥 Features Demo

### **1. Learning Path** (8 cấp độ)
- Mở app → Click "START SPRINT"
- Xem bài học với vocab, podcast, challenges

### **2. Vocab Vault** (Lưu từ vựng)
- Vào lesson → Click ⭐ trên từ vựng
- Vào tab "VAULT" để xem lại

### **3. AI Chat** (Live conversation)
- Click "Street Talk Sandbox"
- Chat với AI để practice

### **4. PWA** (Install như app)
- Chrome: Menu → "Add to Home screen"
- Safari: Share → "Add to Home Screen"

---

## 🐛 Troubleshooting

### **Lỗi: Port 3000 đã được sử dụng**
```bash
# Vite sẽ tự động dùng port khác (3001, 3002...)
# Hoặc kill process cũ:
npx kill-port 3000
```

### **Lỗi: Cannot find module**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### **App không load trên mobile**
- Kiểm tra cùng WiFi chưa
- Thử tắt firewall
- Dùng IP thay vì localhost

### **Gemini API không hoạt động**
- Kiểm tra API key đúng chưa
- File `.env.local` đã tạo chưa
- Restart dev server sau khi thêm env

---

## 📱 Deploy lên Production

### **Nhanh nhất: Vercel One-Click**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/samantha-blablabla/NeoLingua)

### **Thủ công:**

1. Push code lên GitHub
2. Import vào Vercel/Netlify
3. Thêm env: `VITE_GEMINI_API_KEY`
4. Deploy!

Chi tiết: [DEPLOY.md](DEPLOY.md)

---

## 🎓 Học thêm

- [README.md](README.md) - Full documentation
- [DEPLOY.md](DEPLOY.md) - Deployment guide
- [docs/SYNC-GUIDE.md](docs/SYNC-GUIDE.md) - Sync script guide
- [reports/LATEST.md](reports/LATEST.md) - Latest project report

---

## 💡 Tips & Tricks

### **Development:**
- Dùng React DevTools extension
- Hot reload tự động khi edit code
- Check console (F12) để debug

### **Git Workflow:**
```bash
# Workflow hàng ngày
git pull origin master    # Lấy code mới
# ... code & test ...
git add .
git commit -m "feat: Add something"
npm run sync              # Auto push + report
```

### **Customize:**
- Màu sắc: Edit `index.html` (search `#CCFF00`)
- Lessons: Edit `lessons.ts`
- Components: Sửa file `.tsx` tương ứng

---

## 🆘 Cần help?

1. Đọc [Troubleshooting](#-troubleshooting)
2. Check [GitHub Issues](https://github.com/samantha-blablabla/NeoLingua/issues)
3. Xem console logs (F12)

---

## ✨ Next Steps

Sau khi chạy thành công:

- [ ] Explore tất cả 8 levels
- [ ] Thử AI Chat feature
- [ ] Test PWA trên mobile
- [ ] Customize màu sắc theo ý thích
- [ ] Deploy lên production
- [ ] Setup daily sync automation

---

**🎉 Chúc bạn code vui vẻ!**

*Quick Start Guide - Last updated: 2026-01-01*
