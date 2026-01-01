# 🚀 Groq API Setup Guide

**Groq là giải pháp AI miễn phí tốt nhất cho NeoLingua**

---

## ✨ Tại sao chọn Groq?

- ✅ **Hoàn toàn miễn phí**: 14,400 requests/day (không cần thẻ tín dụng)
- ✅ **Cực nhanh**: ~500 tokens/second (nhanh hơn Gemini 10x)
- ✅ **Model mạnh**: Llama 3.3 70B - vượt trội cho conversation
- ✅ **Không giới hạn token**: Không lo quota hết giữa chừng
- ✅ **API đơn giản**: Tương thích OpenAI, dễ integrate

---

## 📋 Hướng dẫn lấy API Key (2 phút)

### **Bước 1: Đăng ký tài khoản**

1. Truy cập: https://console.groq.com
2. Click **"Sign Up"**
3. Chọn một trong:
   - Sign up with Google
   - Sign up with GitHub
   - Sign up with Email

### **Bước 2: Tạo API Key**

1. Sau khi đăng nhập, vào: https://console.groq.com/keys
2. Click **"Create API Key"**
3. Đặt tên (ví dụ: "NeoLingua")
4. Click **"Submit"**
5. **QUAN TRỌNG**: Copy key ngay (chỉ hiện 1 lần!)

Ví dụ key:
```
gsk_1234567890abcdefghijklmnopqrstuvwxyz...
```

### **Bước 3: Thêm key vào project**

1. Mở file `.env.local` trong thư mục project
2. Thay `your_groq_api_key_here` bằng key vừa copy:

```bash
# .env.local
VITE_GROQ_API_KEY=gsk_1234567890abcdefghijklmnopqrstuvwxyz...
```

3. **Lưu file** (Ctrl+S)

### **Bước 4: Restart dev server**

```bash
# Stop server (Ctrl+C)
# Start lại
npm run dev
```

---

## 🧪 Test ngay

1. Mở http://localhost:3001
2. Click vào **"Street Talk Sandbox"**
3. AI sẽ tự động chào và bắt đầu conversation
4. Gõ tin nhắn để test!

---

## 🎯 Models có sẵn

Groq hiện hỗ trợ:

| Model | Best for | Speed |
|-------|----------|-------|
| **llama-3.3-70b-versatile** ⭐ | Conversation, chat, roleplay | ⚡⚡⚡ |
| llama-3.1-70b-versatile | General purpose | ⚡⚡⚡ |
| mixtral-8x7b-32768 | Long context | ⚡⚡ |
| gemma-7b-it | Lightweight tasks | ⚡⚡⚡⚡ |

**NeoLingua đang dùng**: `llama-3.3-70b-versatile` (tốt nhất cho urban conversation)

---

## 💡 Limits (Free Tier)

```
Requests per day:    14,400
Requests per minute: 30
Tokens per minute:   14,400
```

**Đủ cho:**
- 480 conversations mỗi ngày
- Mỗi conversation ~30 messages
- = ~14,400 messages/day

➡️ **Quá đủ cho usage cá nhân!**

---

## 🐛 Troubleshooting

### **Lỗi: "API key not configured"**

**Nguyên nhân:**
- Chưa thay `your_groq_api_key_here`
- Hoặc key không hợp lệ

**Giải pháp:**
1. Check file `.env.local`
2. Đảm bảo key bắt đầu bằng `gsk_`
3. Restart dev server

### **Lỗi: "401 Unauthorized"**

**Nguyên nhân:**
- API key sai hoặc đã bị revoke

**Giải pháp:**
1. Vào https://console.groq.com/keys
2. Tạo key mới
3. Update lại `.env.local`

### **Lỗi: "429 Too Many Requests"**

**Nguyên nhân:**
- Vượt quá 30 requests/minute

**Giải pháp:**
- Đợi 1 phút rồi thử lại
- Hoặc giảm tốc độ gửi message

### **AI không trả lời**

**Check:**
1. Internet connection ổn?
2. Console có error? (F12)
3. API key đúng chưa?

```bash
# Test API key
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $VITE_GROQ_API_KEY"
```

---

## 🔐 Security Notes

⚠️ **QUAN TRỌNG:**

1. **Không commit `.env.local`** lên GitHub
   - File này đã có trong `.gitignore`
   - Nếu leak key → Revoke ngay tại console

2. **Không share API key**
   - Mỗi người nên có key riêng
   - Free tier đủ dùng rồi

3. **Production deployment:**
   - Nên dùng backend proxy
   - Không để key trên client
   - Hoặc dùng Vercel Environment Variables

---

## 📊 So sánh với Gemini

| Feature | Groq | Gemini |
|---------|------|--------|
| **Giá** | $0 (14.4k/day) | $0 (60 req/min) ❌ Quota hết |
| **Tốc độ** | ⚡⚡⚡⚡⚡ 500 tok/s | ⚡⚡ 50 tok/s |
| **Model** | Llama 3.3 70B | Gemini 2.0 Flash |
| **Uptime** | 99.9% | 99.9% |
| **Setup** | Dễ | Dễ |

**Verdict**: Groq thắng về tốc độ và quota 🏆

---

## 🔗 Tài liệu tham khảo

- **Groq Console**: https://console.groq.com
- **API Docs**: https://console.groq.com/docs
- **Playground**: https://console.groq.com/playground
- **Status Page**: https://status.groq.com

---

## 🆘 Cần giúp?

Nếu gặp vấn đề:
1. Check [Troubleshooting](#-troubleshooting)
2. Xem console logs (F12)
3. Open issue trên GitHub

---

**📅 Last Updated:** 2026-01-01
**Status:** ✅ Production Ready
**Migration from:** Google Gemini → Groq

*Built with ❤️ using Groq & Claude Code*
