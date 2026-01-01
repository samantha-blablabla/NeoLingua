# 🧪 Test Guide - Street Talk Sandbox

## ✅ Quick Test Checklist

### **Bước 1: Mở App**
```
URL: http://localhost:3000
```

### **Bước 2: Tìm Street Talk Card**

Trên **Home Screen**, scroll xuống và tìm card này:

```
┌─────────────────────────────────┐
│ ● Live AI Coaching              │
│                                  │
│ STREET TALK                      │
│ SANDBOX                     ⚡   │
└─────────────────────────────────┘
```

**Đặc điểm:**
- Có dot xanh neon (●) nhấp nháy
- Text "Live AI Coaching"
- Icon ⚡ bên phải
- Background: Dark với subtle glow
- Hover effect: Icon rotate

### **Bước 3: Click vào Card**

➡️ Click anywhere trên card
➡️ App sẽ chuyển sang Street Talk screen

---

## 📱 Street Talk Screen Layout

### **Header (Top)**
```
[X]                           [LIVE ●]

⚡ Street Talk
   Sandbox

SCENARIO
Coffee shop vibes
Học cách gọi cafe cực nghệ
```

### **Chat Area (Middle)**
- Tin nhắn AI bên trái (white gradient)
- Tin nhắn của bạn bên phải (lime gradient)
- Animated typing indicator khi AI đang response

### **Input Box (Bottom)**
```
┌─────────────────────────────────┐
│ Vibe check... type here     [⚡] │
└─────────────────────────────────┘
```

---

## 🧪 Test Cases

### **Test 1: Initial Load**
✅ Header hiển thị "Street Talk Sandbox"
✅ Live indicator (green dot) đang pulse
✅ Scenario text hiển thị
✅ AI tự động gửi greeting message
✅ Typing indicator xuất hiện trước message

### **Test 2: Send Message**
**Action:**
```
Type: Hi, I want to buy coffee
Press: Enter (or click ⚡)
```

**Expected Result:**
✅ Your message xuất hiện bên phải (lime color)
✅ Typing indicator xuất hiện
✅ AI response sau 2-3 giây
✅ AI message có vocab highlights
✅ AI message có 🔥 URBAN UPGRADE suggestion

### **Test 3: Vocab Interaction**
**Action:**
- Tìm từ có highlight (màu lime với underline)
- Click vào từ đó

**Expected Result:**
✅ Popup xuất hiện với animation
✅ Hiển thị từ vựng + nghĩa tiếng Việt
✅ Nút "HEAR PRONUNCIATION" hoạt động
✅ Click X hoặc outside để đóng popup

### **Test 4: Text-to-Speech**
**Action:**
- Click icon 🔊 bên cạnh AI message

**Expected Result:**
✅ Browser đọc message bằng giọng nói
✅ Text được clean (không đọc emoji/format)

### **Test 5: Urban Optimization**
**Action:**
```
Type: I would like to order a coffee please
```

**Expected Result:**
✅ AI response có format:
```
🔥 URBAN UPGRADE:
"I would like to order a coffee"
→ "Can I get a coffee?" or "Coffee, please!"
```

### **Test 6: Street Tips**
**Expected (occasionally):**
```
💬 STREET TIP: "Can I get..." sounds more natural
than "I want to buy" at cafes!
```

---

## 🐛 Common Issues

### **Issue 1: Card không hiển thị**
**Check:**
- Scroll down trên home screen
- Card nằm giữa "Mission Card" và "Daily Word"

### **Issue 2: Click không work**
**Check:**
- Dev server đang chạy?
- Console có lỗi? (F12)
- Try hard refresh (Ctrl+Shift+R)

### **Issue 3: "API key not configured"**
**Solution:**
```bash
# Tạo file .env.local
echo VITE_GEMINI_API_KEY=your_key_here > .env.local

# Restart dev server
# Ctrl+C to stop
npm run dev
```

### **Issue 4: AI không response**
**Check:**
- API key đúng chưa?
- Internet connection ổn?
- Console có error message?
- Check Gemini API quota

### **Issue 5: Vocab không highlight**
**Reason:**
- AI chưa format theo đúng syntax
- Cần có format: `**word|meaning**`

**Solution:**
- Normal behavior, không phải lỗi
- AI sẽ highlight ở message tiếp theo

---

## 📸 Visual Checklist

### **Home Screen - Street Talk Card**
```
Look for:
├─ Position: After "Mission Card", before "Daily Word"
├─ Style: Dark card with border glow
├─ Indicator: Green pulsing dot
├─ Icon: ⚡ (Lightning bolt)
└─ Text: "STREET TALK SANDBOX"
```

### **Chat Screen - Header**
```
Look for:
├─ Back button (X) - top left
├─ LIVE indicator - top right (pulsing)
├─ ⚡ Icon with title
├─ Scenario text
└─ Context in Vietnamese (italic, gray)
```

### **Chat Screen - Messages**
```
AI Message (Left):
├─ Label: "URBAN GURU" with gray dot
├─ Bubble: White/zinc gradient
├─ Corner: Rounded tl-[8px]
└─ TTS button: 🔊 icon

Your Message (Right):
├─ Label: "YOU" with lime dot
├─ Bubble: Lime gradient
├─ Corner: Rounded tr-[8px]
└─ No TTS button
```

### **Typing Indicator**
```
├─ Label: "URBAN GURU"
├─ 3 dots: Animated, lime color
└─ Glow effect around dots
```

---

## 🎯 Expected Behavior Summary

### **On Load:**
1. ✅ Screen transition smooth
2. ✅ Header renders completely
3. ✅ Typing indicator appears
4. ✅ AI greeting message shows (~2s)

### **On User Input:**
1. ✅ Message appears immediately
2. ✅ Input clears
3. ✅ Typing indicator shows
4. ✅ AI responds with feedback

### **On Vocab Click:**
1. ✅ Background blurs
2. ✅ Popup slides up
3. ✅ Definition shows
4. ✅ TTS button works

### **Performance:**
- ✅ Smooth animations (60fps)
- ✅ No layout shift
- ✅ Fast response time (<3s)
- ✅ Proper scroll behavior

---

## 🔍 Debug Mode

### **Check Console (F12):**
```javascript
// Should see:
"SW registered: ..."  // Service Worker
// No red errors

// If see:
"API key not configured" → Add .env.local
"Failed to fetch" → Check internet
```

### **Check Network Tab:**
```
Filter: gemini
Look for: API calls to generativelanguage.googleapis.com
Status: 200 (success)
```

---

## ✅ Success Criteria

**All these should work:**
- [x] Street Talk card visible on home
- [x] Click opens chat screen
- [x] AI sends greeting automatically
- [x] Can send messages
- [x] AI responds with content
- [x] Vocab highlights clickable
- [x] TTS works
- [x] Urban Optimization appears
- [x] Smooth animations
- [x] Back button returns to home

---

## 📞 If Still Not Working

1. **Kill and restart dev server:**
```bash
Ctrl+C
npm run dev
```

2. **Clear browser cache:**
```
Ctrl+Shift+Delete → Clear cache
```

3. **Check file changes:**
```bash
git status
# Make sure UrbanChat.tsx is updated
```

4. **Rebuild:**
```bash
npm run build
npm run preview
```

---

**Current Server:**
- Local: http://localhost:3000
- Network: http://192.168.100.98:3000

**Last Updated:** 2026-01-01
