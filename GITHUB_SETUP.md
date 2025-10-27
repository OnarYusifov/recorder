# 🔐 GitHub Authentication & Push

## Quick Steps

### 1️⃣ Get GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Settings:
   - **Note:** "Dokploy Recorder Deploy"
   - **Expiration:** 90 days (or No expiration for convenience)
   - **Scopes:** ✅ Check **"repo"** (full control)
4. Click **"Generate token"**
5. **Copy the token** (starts with `ghp_...`)
   ⚠️ Save it somewhere - you can't see it again!

---

### 2️⃣ Configure Git with Token

Run this command (replace `YOUR_TOKEN`):

```bash
git remote set-url origin https://OnarYusifov:YOUR_TOKEN@github.com/OnarYusifov/recorder.git
```

**Example:**
```bash
git remote set-url origin https://OnarYusifov:ghp_xxxxxxxxxxxxxxxxxxxx@github.com/OnarYusifov/recorder.git
```

---

### 3️⃣ Push to GitHub

```bash
git push -u origin main
```

You should see:
```
Enumerating objects: 45, done.
Counting objects: 100% (45/45), done.
...
To https://github.com/OnarYusifov/recorder.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ **Done!** Your code is on GitHub!

---

## Verify Push Success

1. **Go to:** https://github.com/OnarYusifov/recorder
2. **You should see:**
   - All your files
   - package.json, src/, README.md, etc.
   - Latest commit message

---

## Alternative: SSH Key (Optional)

If you prefer SSH (more secure):

### 1. Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter 3 times (no passphrase)
```

### 2. Copy Public Key

```bash
cat ~/.ssh/id_ed25519.pub
```

### 3. Add to GitHub

1. Go to: https://github.com/settings/keys
2. Click **"New SSH key"**
3. Title: "Dokploy Server"
4. Paste the key
5. Click **"Add SSH key"**

### 4. Change Git Remote to SSH

```bash
git remote set-url origin git@github.com:OnarYusifov/recorder.git
git push -u origin main
```

---

## Troubleshooting

### Error: "Authentication failed"
- Token expired or incorrect
- Regenerate token and update remote URL

### Error: "Permission denied"
- Token doesn't have "repo" scope
- Generate new token with correct permissions

### Error: "Repository not found"
- Make sure repo exists at: https://github.com/OnarYusifov/recorder
- Check repository name is correct

---

## Next Steps After Successful Push

1. ✅ Code is on GitHub
2. ✅ Go to Dokploy: **https://server.trayb.az:3000**
3. ✅ Open guide: `DOKPLOY_STEP_BY_STEP.md`
4. ✅ Create 3 services in Dokploy
5. ✅ Deploy!

---

## Important Note for Dokploy

Once you've pushed to GitHub, **Dokploy will connect to GitHub directly**.

You'll configure GitHub integration in Dokploy dashboard:
- Dokploy → Settings → GitHub OAuth
- Connect your GitHub account
- Select repository: `OnarYusifov/recorder`

Then Dokploy can:
- ✅ Pull code automatically
- ✅ Auto-deploy on push
- ✅ Build and run services

No need to manually push again after initial setup!

---

**Current Status:**
- ✅ Code ready in `/root/recorder`
- ✅ Git branch renamed to `main`
- ✅ Remote added: `https://github.com/OnarYusifov/recorder.git`
- ⏳ **Next:** Authenticate and push (steps above)

