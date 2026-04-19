# Deploy DevForge to is-a.dev

## 📋 Prerequisites

1. ✅ Build is successful (already verified)
2. ✅ You have a GitHub account
3. ✅ You have an is-a.dev subdomain registered

---

## 🚀 Step-by-Step Deployment Guide

### Step 1: Register Your Subdomain on is-a.dev

1. Go to: **https://is-a.dev**
2. Click on **"Register a domain"** or visit their GitHub repo: **https://github.com/is-a-dev/register**
3. Read their registration guidelines
4. Create a GitHub issue or PR in their repository with your desired subdomain
   - Example: `devforge.is-a.dev`
5. Wait for approval (usually takes 24-48 hours)

---

### Step 2: Deploy to Vercel (Recommended)

Since your project already has `.vercel` folder, Vercel is the easiest option:

#### Option A: Deploy via Vercel Dashboard

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with your GitHub account
3. **Click "Add New..."** → **Project**
4. **Import your repository** from GitHub
5. **Configure project**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. **Add Environment Variables** (IMPORTANT):
   - Click on "Environment Variables"
   - Add all variables from your `.env` file:
     ```
     VITE_CLERK_PUBLISHABLE_KEY=your_key_here
     VITE_ADMIN_EMAIL=theprimesam0@gmail.com
     VITE_WHATSAPP_NUMBER=917549159228
     VITE_RAZORPAY_KEY_ID=your_razorpay_key
     VITE_FIREBASE_API_KEY=your_firebase_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```
7. **Click "Deploy"**
8. Wait for deployment to complete (~2-3 minutes)
9. You'll get a URL like: `devforge-xxx.vercel.app`

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: devforge
# - Directory: ./
# - Override settings? N

# Add environment variables
vercel env add VITE_CLERK_PUBLISHABLE_KEY
vercel env add VITE_ADMIN_EMAIL
vercel env add VITE_WHATSAPP_NUMBER
vercel env add VITE_RAZORPAY_KEY_ID
# ... add all other env variables

# Deploy to production
vercel --prod
```

---

### Step 3: Configure Custom Domain (is-a.dev)

#### In Vercel:

1. **Go to your project** in Vercel Dashboard
2. **Click on "Settings"** tab
3. **Click on "Domains"** in the left sidebar
4. **Add your domain**:
   - Enter: `devforge.is-a.dev` (or your registered subdomain)
   - Click "Add"
5. **Vercel will show you the DNS configuration**:
   - Record Type: `CNAME`
   - Name: `devforge` (or your subdomain)
   - Value: `cname.vercel-dns.com`

#### In is-a.dev (GitHub):

1. **Go to is-a-dev/register repository** on GitHub
2. **Find your domain configuration file** (usually in `domains/` folder)
3. **Edit your domain's JSON file** to add Vercel's CNAME:
   ```json
   {
     "description": "DevForge - Script to EXE Converter & IT Services",
     "domain": "devforge.is-a.dev",
     "record": {
       "CNAME": "cname.vercel-dns.com"
     }
   }
   ```
4. **Submit a PR** to update the configuration
5. **Wait for merge** (usually 24-48 hours)

---

### Step 4: Alternative - Deploy to GitHub Pages + is-a.dev

If you prefer GitHub Pages:

#### 1. Install gh-pages package:
```bash
npm install --save-dev gh-pages
```

#### 2. Update package.json scripts:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

#### 3. Update vite.config.ts:
```typescript
export default defineConfig({
  base: '/', // Change if using custom domain
  plugins: [react()],
  // ... rest of config
})
```

#### 4. Deploy:
```bash
npm run deploy
```

#### 5. Configure GitHub Pages:
1. Go to your repo on GitHub
2. Settings → Pages
3. Source: Deploy from branch
4. Branch: `gh-pages`
5. Save

#### 6. Configure is-a.dev DNS:
Point your is-a.dev domain to GitHub Pages:
```json
{
  "description": "DevForge",
  "domain": "devforge.is-a.dev",
  "record": {
    "A": [
      "185.199.108.153",
      "185.199.109.153",
      "185.199.110.153",
      "185.199.111.153"
    ]
  }
}
```

---

## ✅ Verification Checklist

After deployment:

- [ ] Site loads at `devforge.is-a.dev`
- [ ] HTTPS is working (green lock icon)
- [ ] All pages navigate correctly
- [ ] Sign In/Sign Up works (Clerk authentication)
- [ ] File upload works in Converter section
- [ ] WhatsApp buttons open correctly
- [ ] Payment integration works (test mode first!)
- [ ] Theme sync works (light/dark mode)
- [ ] Mobile responsive design works
- [ ] No console errors in browser

---

## 🔒 Important Security Notes

1. **NEVER commit `.env` file to GitHub**
   - Your `.env` is already in `.gitignore` ✅
   - Add environment variables in Vercel dashboard only

2. **Test payments in Razorpay test mode first**
   - Use test API keys before going live
   - Verify webhook notifications work

3. **Enable Vercel's security headers**
   - Go to Vercel → Settings → Security
   - Enable automatic HTTPS

---

## 🎯 Quick Deploy Command (If using Vercel)

```bash
# One-line deploy (after initial setup)
npm run build && vercel --prod
```

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **is-a.dev Docs**: https://github.com/is-a-dev/register
- **Clerk Setup**: https://clerk.com/docs
- **Razorpay Testing**: https://razorpay.com/docs/payments/payments/test-card-upi-details/

---

## 🎉 Done!

Your DevForge app is now live at `devforge.is-a.dev` with:
- ✅ Automatic HTTPS
- ✅ Theme sync (light/dark)
- ✅ Payment integration
- ✅ WhatsApp notifications
- ✅ Authentication system
