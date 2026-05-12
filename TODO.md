# Fix Vite EISDIR Error (EISDIR: illegal operation on a directory, read)

## Steps:

### 1. [COMPLETE] Edit vite.config.ts
- Added server config: hmr: {overlay: false}, fs: {allow: ['..']}
- Goal: Fix directory read error in dev server middleware

### 2. [USER ACTION NEEDED] Restart dev server
- Stop current Vite dev server (Ctrl+C)
- Run `pnpm dev` or `vite`
- Test http://localhost:5173 – overlay should be gone, no EISDIR

### 3. [PENDING] Verify fix
- Error overlay dismissed
- App loads without EISDIR

### 4. [PENDING] If persists
- list_files public/ 
- Consider Vite downgrade or rename index.php

Progress tracked here.
