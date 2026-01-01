#!/usr/bin/env node

/**
 * Open browser with mobile emulation for testing
 *
 * Usage:
 *   node open-mobile.js
 *   npm run mobile
 */

import { execSync } from 'child_process';
import os from 'os';

const PORT = 3002;
const URL = `http://localhost:${PORT}`;

// Colors for console
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function openBrowser() {
  const platform = os.platform();

  log('\n🚀 Opening NeoLingua in Mobile Emulation Mode...\n', 'cyan');
  log(`📱 URL: ${URL}`, 'green');
  log(`🌐 Device: iPhone 12 Pro (390x844)`, 'yellow');
  log(`\n💡 Tip: Press F12 → Toggle Device Toolbar (Ctrl+Shift+M)\n`, 'cyan');

  try {
    if (platform === 'win32') {
      // Windows - Open Chrome with mobile emulation
      const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
      const args = [
        '--new-window',
        '--window-size=390,844',
        '--user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"',
        `--app=${URL}`
      ].join(' ');

      execSync(`start "" "${chromePath}" ${args}`, { stdio: 'ignore' });

    } else if (platform === 'darwin') {
      // macOS - Open Chrome with mobile emulation
      const cmd = `open -na "Google Chrome" --args --new-window --window-size=390,844 --user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15" --app="${URL}"`;
      execSync(cmd, { stdio: 'ignore' });

    } else {
      // Linux - Open Chrome with mobile emulation
      const cmd = `google-chrome --new-window --window-size=390,844 --user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" --app="${URL}" &`;
      execSync(cmd, { stdio: 'ignore' });
    }

    log('✅ Browser opened successfully!\n', 'green');
    log('📋 Manual Steps:', 'cyan');
    log('   1. Press F12 to open DevTools', 'yellow');
    log('   2. Click Toggle Device Toolbar (Ctrl+Shift+M)', 'yellow');
    log('   3. Select "iPhone 12 Pro" from dropdown', 'yellow');
    log('   4. Refresh page (F5)\n', 'yellow');

  } catch (error) {
    log('⚠️  Could not auto-open. Opening default browser instead...', 'yellow');

    // Fallback to default browser
    const openCmd = platform === 'win32' ? 'start' :
                    platform === 'darwin' ? 'open' : 'xdg-open';

    execSync(`${openCmd} ${URL}`, { stdio: 'ignore' });

    log('\n📱 To enable mobile view:', 'cyan');
    log('   1. Press F12', 'yellow');
    log('   2. Press Ctrl+Shift+M', 'yellow');
    log('   3. Select device: iPhone 12 Pro\n', 'yellow');
  }
}

// Run
openBrowser();
