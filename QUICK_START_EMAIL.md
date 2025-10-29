# Quick Start: Nodemailer Email Setup

## 🚀 5-Minute Setup

### 1. Get Gmail App Password

1. Enable 2FA: <https://myaccount.google.com/security>
2. Create App Password: <https://myaccount.google.com/apppasswords>
3. Copy the 16-character password

### 2. Configure .env.local

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_SERVICE=gmail
```

### 3. Restart Server

```bash
cd todo_app
pnpm dev
```

### 4. Test

Visit: <http://localhost:3000/test-email>

## ✅ What's Working

- ✉️ Welcome emails on signup
- ✉️ Login notifications on signin
- ✉️ Beautiful HTML email templates
- ✉️ Server-side sending (secure)
- ✉️ Non-blocking (won't break login if email fails)

## 📁 Files Changed

- `/src/app/api/send-email/route.ts` - Email API
- `/src/app/signup/page.tsx` - Sends welcome email
- `/src/app/signin/page.tsx` - Sends login notification
- `/src/app/test-email/page.tsx` - Test email page
- `/.env.local` - Email credentials

## 🔍 Testing

```bash
# Test page
open http://localhost:3000/test-email

# Or sign up
open http://localhost:3000/signup

# Or sign in
open http://localhost:3000/signin
```

## 📖 Full Documentation

See `NODEMAILER_SETUP.md` for complete guide.
