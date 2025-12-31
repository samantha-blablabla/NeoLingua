# 📋 Sync-Docs Script Guide

Hướng dẫn sử dụng script tự động sync và tạo báo cáo hàng ngày cho NeoLingua.

---

## 🎯 Mục đích

Script `sync-docs.mjs` tự động thực hiện các công việc sau **mỗi ngày**:

1. ✅ Tạo báo cáo dự án (project stats, git status, features)
2. ✅ Cập nhật CHANGELOG.md
3. ✅ Commit tất cả thay đổi
4. ✅ Push lên GitHub

---

## 🚀 Cách sử dụng

### **Chạy thủ công:**

```bash
# Cách 1: Dùng npm script
npm run sync

# Cách 2: Dùng node trực tiếp
node sync-docs.mjs
```

### **Tự động hóa (Khuyến nghị):**

#### **Windows (Task Scheduler):**

1. Mở Task Scheduler
2. Tạo Basic Task mới
3. Trigger: Daily lúc 23:00
4. Action: Start a program
   - Program: `cmd.exe`
   - Arguments: `/c cd "C:\Users\Admin\OneDrive\Máy tính\NeoLingua" && npm run sync`

#### **macOS/Linux (Cron):**

```bash
# Mở crontab
crontab -e

# Thêm dòng này (chạy mỗi ngày lúc 23:00)
0 23 * * * cd /path/to/NeoLingua && npm run sync >> /tmp/sync-docs.log 2>&1
```

#### **GitHub Actions (CI/CD):**

Tạo file `.github/workflows/daily-sync.yml`:

```yaml
name: Daily Sync & Report

on:
  schedule:
    - cron: '0 23 * * *'  # 23:00 UTC mỗi ngày
  workflow_dispatch:  # Cho phép chạy thủ công

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Run sync script
        run: npm run sync
```

---

## 📊 Output

Script tạo ra các file sau:

### **1. Daily Report** 📄
- **Location:** `reports/report-YYYY-MM-DD.md`
- **Content:**
  - Project overview
  - Code statistics (components, services, LOC)
  - Git stats (commits, branch)
  - Features status
  - Next steps

### **2. Latest Report** 📌
- **Location:** `reports/LATEST.md`
- **Content:** Bản copy của report mới nhất (để dễ truy cập)

### **3. Changelog** 📝
- **Location:** `CHANGELOG.md`
- **Content:** Lịch sử thay đổi theo ngày

---

## 🔧 Cấu hình

Mở file `sync-docs.mjs` và sửa phần CONFIG:

```javascript
const CONFIG = {
  reportsDir: 'reports',      // Thư mục chứa báo cáo
  docsDir: 'docs',            // Thư mục chứa docs
  branch: 'master',           // Branch để push
  remote: 'origin'            // Remote repository
};
```

---

## 📈 Ví dụ Output

### **Console:**
```
🚀 NeoLingua Daily Sync Started

📁 Step 1: Checking directories...
📁 Created directory: reports
📊 Step 2: Generating daily report...
✅ Report created: reports/report-2025-12-31.md
📝 Step 3: Updating changelog...
✅ Changelog updated
🔗 Step 4: Updating latest report...
✅ Latest report updated
🔍 Step 5: Checking git status...
   Branch: master
   Files changed: 5
➕ Step 6: Adding files to git...
✅ Files staged
💾 Step 7: Committing changes...
✅ Changes committed
☁️  Step 8: Pushing to remote...
✅ Pushed to remote successfully

✨ Sync Complete! Summary:

   📊 Report: reports/report-2025-12-31.md
   📝 Changelog: CHANGELOG.md
   🌿 Branch: master
   📦 Commits: 38
   📅 Date: 31/12/2025, 23:00:00

🎉 All done!
```

### **Git Commit Message:**
```
docs: Daily sync and report - 2025-12-31

- Auto-generated daily report
- Updated changelog
- Project stats: 5 files changed

📊 Generated with sync-docs script
🤖 Built with Claude Code

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## 🐛 Troubleshooting

### **Lỗi: "git push failed"**
- Kiểm tra credentials (đã đăng nhập Git chưa)
- Kiểm tra quyền push lên repository
- Thử: `git config credential.helper store`

### **Lỗi: "No changes to commit"**
- Bình thường! Script sẽ skip commit nếu không có gì thay đổi

### **Lỗi: Module not found**
- Chạy: `npm install` trước

### **Script không tự động chạy (Cron/Task Scheduler)**
- Kiểm tra log file
- Đảm bảo đường dẫn tuyệt đối
- Kiểm tra quyền execute

---

## 🔒 Security Notes

⚠️ **Quan trọng:**

1. **Không commit sensitive files:**
   - `.env.local` đã được thêm vào `.gitignore`
   - API keys không bao giờ được commit

2. **Git credentials:**
   - Nếu dùng automation, cấu hình SSH keys
   - Không lưu password trong scripts

3. **Review before push:**
   - Script tự động push, hãy cẩn thận với sensitive data

---

## 📅 Best Practices

### **Khuyến nghị:**

1. **Chạy hàng ngày vào cuối ngày** (23:00)
2. **Review reports định kỳ** để theo dõi tiến độ
3. **Backup reports** quan trọng
4. **Customize commit messages** nếu cần

### **Workflow gợi ý:**

```bash
# Buổi sáng: Bắt đầu làm việc
git pull origin master
npm run dev

# Trong ngày: Code & commit như thường
git add .
git commit -m "feat: Add new feature"

# Cuối ngày: Chạy sync
npm run sync
```

---

## 🎨 Customization

### **Thêm thông tin vào Report:**

Edit hàm `generateDailyReport()` trong `sync-docs.mjs`:

```javascript
function generateDailyReport() {
  // ... existing code ...

  // Thêm section mới
  const customSection = `
## 🎯 My Custom Section

- Custom metric 1: ${value1}
- Custom metric 2: ${value2}
`;

  const report = `# 📊 NeoLingua - Daily Report
${customSection}
...
`;

  return report;
}
```

### **Thay đổi Commit Message Format:**

Tìm dòng này và sửa theo ý:

```javascript
const commitMessage = `docs: Daily sync and report - ${date.date}

- Auto-generated daily report
- Updated changelog
...
`;
```

---

## 📚 Related Files

- [sync-docs.mjs](../sync-docs.mjs) - Script chính
- [package.json](../package.json) - NPM scripts
- [CHANGELOG.md](../CHANGELOG.md) - Project changelog
- [reports/](../reports/) - Thư mục chứa reports

---

## 🆘 Support

Nếu gặp vấn đề:

1. Kiểm tra [Troubleshooting](#-troubleshooting)
2. Xem logs: `reports/LATEST.md`
3. Open issue trên GitHub

---

**📌 Last Updated:** 2025-12-31

*Script được tạo với ❤️ bởi Claude Code*
