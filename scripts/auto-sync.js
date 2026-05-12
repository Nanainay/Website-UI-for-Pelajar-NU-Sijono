const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const REPO_PATH = __dirname;
const GIT = 'git';
const PUSH_URL = 'https://github.com/Nanainay/Website-UI-for-Pelajar-NU-Sijono.git';
const WATCH_INTERVAL = 10; // detik

// File yang diabaikan dari watch
const IGNORED = ['.git', 'node_modules', '.vscode', 'uploads', 'dist', 'logs'];

function isIgnored(filePath) {
  const relPath = path.relative(REPO_PATH, filePath);
  const parts = relPath.split(path.sep);
  return parts.some(part => IGNORED.includes(part));
}

function getGitStatus() {
  try {
    const result = execSync(`${GIT} -C "${REPO_PATH}" status --porcelain`, { encoding: 'utf-8' });
    return result.trim();
  } catch (e) {
    return '';
  }
}

function commitAndPush() {
  const now = new Date().toISOString().replace(/[:.]/g, '-');
  const message = `Auto-save: ${now}`;

  try {
    console.log(`[${now}] Changes terdeteksi, melakukan commit...`);

    execSync(`${GIT} -C "${REPO_PATH}" add -A`, { encoding: 'utf-8' });
    execSync(`${GIT} -C "${REPO_PATH}" commit -m "${message}"`, { encoding: 'utf-8' });
    execSync(`${GIT} -C "${REPO_PATH}" push -u origin master`, { encoding: 'utf-8' });

    console.log(`[${now}] ✅ Commit & Push berhasil!`);
  } catch (e) {
    const msg = e.message || e.stdout || '';
    if (msg.includes('nothing to commit') || msg.includes('up to date')) {
      console.log(`[${now}] Tidak ada perubahan baru.`);
    } else {
      console.error(`[${now}] ❌ Error: ${msg.substring(0, 200)}`);
    }
  }
}

function watch() {
  console.log('🔄 Auto-Sync dimulai...');
  console.log(`📁 Memantau: ${REPO_PATH}`);
  console.log(`⏱️  Interval: ${WATCH_INTERVAL} detik`);
  console.log('');

  let lastState = getGitStatus();

  setInterval(() => {
    const currentState = getGitStatus();

    if (currentState && currentState !== lastState) {
      commitAndPush();
      lastState = currentState;
    }
  }, WATCH_INTERVAL * 1000);
}

watch();