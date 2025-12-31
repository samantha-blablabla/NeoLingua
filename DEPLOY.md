# 🚀 Deploy NeoLingua - Hướng dẫn chi tiết

## 📱 Preview Local trên Mobile

### Cách 1: Qua Network (Cùng WiFi)
```bash
npm install
npm run dev
```
Truy cập địa chỉ Network (VD: `http://192.168.1.x:5173`) trên điện thoại

### Cách 2: Qua Tunnel công khai
```bash
# Sử dụng ngrok
npx ngrok http 5173

# Hoặc localtunnel
npx localtunnel --port 5173
```

---

## 🌐 Deploy Production (Miễn phí 100%)

### **Option 1: Vercel ⭐ (Khuyến nghị)**

#### Bước 1: Chuẩn bị API Key
1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Tạo API key mới cho Gemini
3. Copy API key

#### Bước 2: Push code lên GitHub
```bash
git add .
git commit -m "Deploy NeoLingua PWA"
git push origin main
```

#### Bước 3: Deploy trên Vercel
1. Truy cập [vercel.com](https://vercel.com)
2. Đăng nhập bằng GitHub
3. Click **"New Project"**
4. Import repository `NeoLingua`
5. **Framework Preset**: Vite (tự động detect)
6. **Environment Variables**: Thêm
   - Key: `VITE_GEMINI_API_KEY`
   - Value: [API key bạn vừa tạo]
7. Click **Deploy**

#### Bước 4: Kiểm tra
- URL sẽ có dạng: `https://neolingua-xyz.vercel.app`
- Truy cập trên mobile để test PWA

---

### **Option 2: Netlify**

```bash
# Build project
npm run build

# Deploy qua Netlify CLI
npx netlify-cli deploy --prod
```

**Hoặc qua UI:**
1. [netlify.com](https://netlify.com) → New Site
2. Import từ GitHub
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment: `VITE_GEMINI_API_KEY`

---

### **Option 3: Cloudflare Pages**

1. [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect GitHub repository
3. Build command: `npm run build`
4. Build output: `dist`
5. Environment variables: `VITE_GEMINI_API_KEY`

---

## 📲 Cài đặt như App thật trên Mobile

### **Trên Android (Chrome/Edge)**
1. Mở website đã deploy
2. Menu (3 chấm) → **"Add to Home screen"**
3. App sẽ xuất hiện trên màn hình chính

### **Trên iOS (Safari)**
1. Mở website đã deploy
2. Nhấn nút **Share** (icon mũi tên hướng lên)
3. Chọn **"Add to Home Screen"**
4. App sẽ xuất hiện trên màn hình chính

### **Đặc điểm của PWA:**
✅ Fullscreen (không thanh địa chỉ)
✅ Icon riêng trên Home screen
✅ Splash screen khi mở
✅ Hoạt động offline (nhờ Service Worker)
✅ Giống app native 100%

---

## 🎨 Tạo Icon chuyên nghiệp

**Yêu cầu:**
- Icon 512x512px (PNG)
- Icon 192x192px (PNG)
- Background: `#0A0A0A`
- Foreground: `#CCFF00`

**Tools miễn phí:**
- [Canva](https://canva.com) - Template app icon
- [Figma](https://figma.com) - Design custom
- [RealFaviconGenerator](https://realfavicongenerator.net) - Tạo đầy đủ icon sizes

**Sau khi có icon:**
1. Đổi tên thành `icon-192.png` và `icon-512.png`
2. Bỏ vào folder `/public`
3. Xóa file `icon-placeholder.svg`
4. Deploy lại

---

## 🔧 Cấu hình nâng cao

### Bật HTTPS cho Localhost (test PWA local)
```bash
npm install -D @vitejs/plugin-basic-ssl
```

Update `vite.config.ts`:
```typescript
import basicSsl from '@vitejs/plugin-basic-ssl'

export default {
  plugins: [basicSsl()],
  server: { https: true }
}
```

### Cache Strategy cho PWA
- Static assets: Cache-first
- API calls: Network-first
- Offline fallback: Show cached data

---

## 📊 Chi phí

| Platform | Miễn phí | Giới hạn |
|----------|----------|----------|
| **Vercel** | ✅ | 100GB bandwidth/tháng |
| **Netlify** | ✅ | 100GB bandwidth/tháng |
| **Cloudflare Pages** | ✅ | Unlimited requests |
| **GitHub Pages** | ✅ | 1GB storage |

**Khuyến nghị:** Vercel (tích hợp tốt nhất với Vite + auto deploy)

---

## 🐛 Troubleshooting

### PWA không hiện "Add to Home Screen"
- ✅ Kiểm tra HTTPS (bắt buộc)
- ✅ Kiểm tra `manifest.json` hợp lệ
- ✅ Kiểm tra có icon 192x192 và 512x512
- ✅ Service Worker đã đăng ký thành công

### Service Worker không hoạt động
- ✅ Clear cache trình duyệt
- ✅ Kiểm tra Console có lỗi gì
- ✅ Unregister SW cũ: DevTools → Application → Service Workers

### Gemini API không hoạt động
- ✅ Kiểm tra API key đúng
- ✅ Kiểm tra environment variable tên: `VITE_GEMINI_API_KEY`
- ✅ Rebuild project sau khi thêm env

---

## 🎯 Checklist Deploy

- [ ] Git push code lên GitHub
- [ ] Tạo Gemini API key
- [ ] Deploy trên Vercel/Netlify
- [ ] Thêm environment variable
- [ ] Test trên mobile
- [ ] Add to Home Screen
- [ ] Kiểm tra PWA features (offline, fullscreen)
- [ ] Thay icon placeholder bằng icon thật

---

**🎉 Xong! App của bạn đã sẵn sàng để chia sẻ cho cả thế giới!**
