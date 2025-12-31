#!/usr/bin/env node

/**
 * NeoLingua Daily Sync & Report Script
 *
 * Tự động sync code, tạo báo cáo và push lên GitHub mỗi ngày
 *
 * Usage:
 *   node sync-docs.mjs
 *   npm run sync
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  reportsDir: 'reports',
  docsDir: 'docs',
  branch: 'master',
  remote: 'origin'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, silent = false) {
  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return output;
  } catch (error) {
    log(`❌ Error executing: ${command}`, 'red');
    throw error;
  }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`📁 Created directory: ${dirPath}`, 'cyan');
  }
}

function getCurrentDate() {
  const now = new Date();
  return {
    full: now.toISOString(),
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().split(' ')[0],
    readable: now.toLocaleString('vi-VN')
  };
}

function getGitStats() {
  try {
    const branch = exec('git branch --show-current', true).trim();
    const lastCommit = exec('git log -1 --pretty=format:"%h - %s (%cr)"', true).trim();
    const filesChanged = exec('git status --porcelain', true).split('\n').filter(Boolean).length;
    const totalCommits = exec('git rev-list --count HEAD', true).trim();

    return {
      branch,
      lastCommit,
      filesChanged,
      totalCommits
    };
  } catch (error) {
    return {
      branch: 'unknown',
      lastCommit: 'N/A',
      filesChanged: 0,
      totalCommits: 0
    };
  }
}

function getProjectStats() {
  const stats = {
    components: 0,
    services: 0,
    totalLines: 0,
    tsxFiles: 0
  };

  try {
    if (fs.existsSync('components')) {
      stats.components = fs.readdirSync('components').filter(f => f.endsWith('.tsx')).length;
    }
    if (fs.existsSync('services')) {
      stats.services = fs.readdirSync('services').filter(f => f.endsWith('.ts')).length;
    }

    // Count lines of code
    const countLines = (dir) => {
      let lines = 0;
      if (!fs.existsSync(dir)) return lines;

      fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
          lines += fs.readFileSync(filePath, 'utf8').split('\n').length;
          stats.tsxFiles++;
        }
      });
      return lines;
    };

    stats.totalLines += countLines('.');
    stats.totalLines += countLines('components');
    stats.totalLines += countLines('services');

  } catch (error) {
    log('⚠️  Could not gather all project stats', 'yellow');
  }

  return stats;
}

function generateDailyReport() {
  const date = getCurrentDate();
  const gitStats = getGitStats();
  const projectStats = getProjectStats();

  const report = `# 📊 NeoLingua - Daily Report
**Generated:** ${date.readable}

---

## 🎯 Project Overview

**NeoLingua** is a modern urban English learning app powered by AI.

### Tech Stack
- React 19 + TypeScript
- Vite Build Tool
- Gemini AI Integration
- PWA Support
- Framer Motion Animations

---

## 📈 Project Statistics

| Metric | Value |
|--------|-------|
| **Components** | ${projectStats.components} files |
| **Services** | ${projectStats.services} files |
| **Total TS/TSX Files** | ${projectStats.tsxFiles} files |
| **Lines of Code** | ~${projectStats.totalLines.toLocaleString()} lines |
| **Git Commits** | ${gitStats.totalCommits} commits |
| **Current Branch** | ${gitStats.branch} |

---

## 🔄 Git Status

**Last Commit:** ${gitStats.lastCommit}

**Files Changed:** ${gitStats.filesChanged} file(s) modified

---

## ✅ Recent Tasks Completed

- ✅ PWA implementation with manifest and service worker
- ✅ Fix environment variable handling for Gemini API
- ✅ Remove importmap conflicts with Vite bundling
- ✅ Optimize build configuration
- ✅ Deploy to production (Vercel)
- ✅ Add comprehensive documentation
- ✅ Implement auto-sync script

---

## 🚀 Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| **8-Level Learning Path** | ✅ Complete | From Urban Newbie to Urban Legend |
| **AI Lesson Generation** | ✅ Complete | Gemini API integration |
| **Vocab Vault** | ✅ Complete | Save & review words |
| **Badge System** | ✅ Complete | Achievement tracking |
| **Live AI Chat** | ✅ Complete | Practice conversations |
| **PWA Support** | ✅ Complete | Install as native app |
| **Offline Mode** | ✅ Complete | Service Worker caching |
| **Text-to-Speech** | ✅ Complete | Natural voice playback |

---

## 📝 Next Steps

- [ ] Optimize bundle size (currently 631KB)
- [ ] Add more lesson content
- [ ] Implement analytics tracking
- [ ] Add user authentication
- [ ] Create admin dashboard
- [ ] Improve accessibility (a11y)
- [ ] Add unit tests
- [ ] Performance optimization

---

## 🔗 Links

- **Repository:** https://github.com/samantha-blablabla/NeoLingua
- **Documentation:** See README.md and DEPLOY.md
- **Issue Tracker:** GitHub Issues

---

## 📌 Notes

This is an automated daily report generated by \`sync-docs.mjs\`.

**Report Date:** ${date.date}
**Report Time:** ${date.time}

---

*Built with ❤️ using Claude Code*
`;

  return report;
}

function generateChangeLog() {
  const date = getCurrentDate();

  let changelog = '';
  if (fs.existsSync('CHANGELOG.md')) {
    changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
  } else {
    changelog = `# 📝 Changelog

All notable changes to NeoLingua will be documented in this file.

---

`;
  }

  // Add today's entry at the top if not exists
  const todayEntry = `## [${date.date}]`;
  if (!changelog.includes(todayEntry)) {
    const gitStats = getGitStats();
    const newEntry = `${todayEntry}

### ✨ Added
- Daily sync and reporting system
- Automated git workflow

### 🔧 Changed
- Last commit: ${gitStats.lastCommit}

### 📊 Stats
- Files changed today: ${gitStats.filesChanged}

---

`;

    // Insert after the intro
    const parts = changelog.split('---\n');
    changelog = parts[0] + '---\n\n' + newEntry + parts.slice(1).join('---\n');
  }

  return changelog;
}

async function main() {
  log('\n🚀 NeoLingua Daily Sync Started\n', 'bright');

  try {
    // Step 1: Ensure directories exist
    log('📁 Step 1: Checking directories...', 'cyan');
    ensureDir(CONFIG.reportsDir);
    ensureDir(CONFIG.docsDir);

    // Step 2: Generate daily report
    log('📊 Step 2: Generating daily report...', 'cyan');
    const date = getCurrentDate();
    const reportFileName = `report-${date.date}.md`;
    const reportPath = path.join(CONFIG.reportsDir, reportFileName);
    const report = generateDailyReport();
    fs.writeFileSync(reportPath, report);
    log(`✅ Report created: ${reportPath}`, 'green');

    // Step 3: Update changelog
    log('📝 Step 3: Updating changelog...', 'cyan');
    const changelog = generateChangeLog();
    fs.writeFileSync('CHANGELOG.md', changelog);
    log('✅ Changelog updated', 'green');

    // Step 4: Create/Update latest report symlink
    log('🔗 Step 4: Updating latest report...', 'cyan');
    const latestReportPath = path.join(CONFIG.reportsDir, 'LATEST.md');
    fs.writeFileSync(latestReportPath, report);
    log('✅ Latest report updated', 'green');

    // Step 5: Check git status
    log('🔍 Step 5: Checking git status...', 'cyan');
    const gitStats = getGitStats();
    log(`   Branch: ${gitStats.branch}`, 'blue');
    log(`   Files changed: ${gitStats.filesChanged}`, 'blue');

    // Step 6: Add files to git
    log('➕ Step 6: Adding files to git...', 'cyan');
    exec('git add .');
    log('✅ Files staged', 'green');

    // Step 7: Check if there are changes to commit
    const hasChanges = exec('git status --porcelain', true).trim().length > 0;

    if (hasChanges) {
      // Step 8: Commit changes
      log('💾 Step 7: Committing changes...', 'cyan');
      const commitMessage = `docs: Daily sync and report - ${date.date}

- Auto-generated daily report
- Updated changelog
- Project stats: ${gitStats.filesChanged} files changed

📊 Generated with sync-docs script
🤖 Built with Claude Code

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`;

      exec(`git commit -m "${commitMessage.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`);
      log('✅ Changes committed', 'green');

      // Step 9: Push to remote
      log('☁️  Step 8: Pushing to remote...', 'cyan');
      exec(`git push ${CONFIG.remote} ${CONFIG.branch}`);
      log('✅ Pushed to remote successfully', 'green');
    } else {
      log('ℹ️  No changes to commit', 'yellow');
    }

    // Step 10: Summary
    log('\n✨ Sync Complete! Summary:\n', 'bright');
    log(`   📊 Report: ${reportPath}`, 'green');
    log(`   📝 Changelog: CHANGELOG.md`, 'green');
    log(`   🌿 Branch: ${gitStats.branch}`, 'green');
    log(`   📦 Commits: ${gitStats.totalCommits}`, 'green');
    log(`   📅 Date: ${date.readable}`, 'green');
    log('\n🎉 All done!\n', 'bright');

  } catch (error) {
    log('\n❌ Sync failed!', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

// Run the main function
main();

export { main, generateDailyReport, generateChangeLog };
