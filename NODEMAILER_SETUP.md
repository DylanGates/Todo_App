# Nodemailer Setup Guide

## Overview

Your Todo App now uses **Nodemailer** to send emails. Nodemailer is more reliable and runs server-side via Next.js API routes.

## ✅ What Was Set Up

1. **API Route**: `/api/send-email` - Handles all email sending
2. **Updated Pages**: Sign In, Sign Up, and Test Email pages now use Nodemailer
3. **Environment Variables**: New `.env.local` configuration

## 📧 Email Configuration

### Step 1: Get Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account:

   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Google will generate a 16-character password
   - Copy this password (you'll use it in `.env.local`)

### Step 2: Configure Environment Variables

Edit `/todo_app/.env.local` and add your credentials:

```env
# Email Configuration (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_SERVICE=gmail
```

**Example:**

```env
EMAIL_USER=todoapp@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=todoapp@gmail.com
EMAIL_SERVICE=gmail
```

### Step 3: Restart Development Server

```bash
cd todo_app
# Stop current server (Ctrl+C if running)
pnpm dev
```

## 🧪 Testing

### Option 1: Use the Test Page

1. Start dev server: `pnpm dev`
2. Visit: http://localhost:3000/test-email
3. Enter your email address
4. Click "Send Test Email"
5. Check your inbox (and spam folder!)

### Option 2: Test via Sign Up

1. Go to http://localhost:3000/signup
2. Create a new account with a real email
3. You should receive a welcome email

### Option 3: Test via Sign In

1. Go to http://localhost:3000/signin
2. Sign in with an existing account
3. You should receive a sign-in notification

## 📝 How It Works

### Architecture

```
Client (Browser)          →    API Route           →    Gmail Server
┌─────────────────┐            ┌──────────────┐         ┌────────────┐
│ signup/signin   │  fetch()   │ /api/send-   │  SMTP   │   Gmail    │
│ pages           │  ────────> │  email       │ ──────> │  servers   │
│                 │  <──────── │              │ <────── │            │
└─────────────────┘   response └──────────────┘  Email  └────────────┘
```

### API Route (`/api/send-email/route.ts`)

Accepts POST requests with:

```json
{
  "to": "user@example.com",
  "subject": "Email Subject",
  "text": "Plain text content",
  "html": "<h1>HTML content</h1>"
}
```

Returns:

```json
{
  "success": true,
  "messageId": "<...>",
  "message": "Email sent successfully"
}
```

### Email Templates

#### Sign Up Email

- **Subject**: "Welcome to Todo App! 🎉"
- **Content**: Welcome message with styled HTML
- **Sent**: After account creation

#### Sign In Email

- **Subject**: "Sign In Notification - Todo App"
- **Content**: Login notification with security note
- **Sent**: After successful sign in

## 🔧 Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solution:**

- Make sure you're using an **App Password**, not your regular Gmail password
- Ensure 2FA is enabled on your Gmail account
- Generate a new App Password if needed

### Error: "Missing environment variables"

**Solution:**

```bash
# Check if .env.local exists
cat .env.local

# Verify variables are set correctly
# Then restart dev server:
pnpm dev
```

### Emails not received

**Check:**

1. ✅ Spam/Junk folder
2. ✅ Email address is correct
3. ✅ App Password is correct (16 characters)
4. ✅ Dev server was restarted after editing `.env.local`
5. ✅ Check browser console for errors
6. ✅ Check terminal for API errors

### "ECONNREFUSED" error

**Solution:**

- Check your internet connection
- Gmail SMTP might be blocked by firewall
- Try using a different network (not corporate/school network)

## 🔐 Security Notes

- ✅ **Server-side only**: Email credentials are never exposed to the browser
- ✅ **Environment variables**: Credentials are in `.env.local` (gitignored)
- ✅ **App Password**: Using App Password instead of actual Gmail password
- ✅ **Non-blocking**: Email failures don't prevent user from signing in/up

## 📚 Alternative Email Services

Nodemailer supports many email services. To use a different service:

### Option 1: Other Email Services

```env
# Outlook/Hotmail
EMAIL_SERVICE=hotmail
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password

# Yahoo
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password

# Custom SMTP
EMAIL_SERVICE=custom
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

### Option 2: SendGrid (Recommended for Production)

```bash
pnpm add @sendgrid/mail
```

Update `/api/send-email/route.ts` to use SendGrid API.

### Option 3: AWS SES (Scalable)

Use AWS Simple Email Service for high-volume emails.

## 🚀 Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. **Add environment variables** in your hosting platform:

   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `EMAIL_FROM`
   - `EMAIL_SERVICE`

2. **Consider rate limiting** to prevent abuse:

   ```typescript
   // Add to API route
   const rateLimiter = rateLimit({
     interval: 60 * 1000, // 1 minute
     max: 5, // 5 emails per minute
   });
   ```

3. **Use a dedicated email service**:
   - SendGrid (free tier: 100 emails/day)
   - Mailgun
   - AWS SES
   - Postmark

## 📊 Monitoring

Add logging to track email delivery:

```typescript
// In API route
console.log(`Email sent to ${to}: ${info.messageId}`);

// In production, use proper logging:
// - Sentry for error tracking
// - DataDog for metrics
// - CloudWatch if using AWS
```

## 🎯 Next Steps

1. **Test the email functionality** using the test page
2. **Configure your Gmail App Password** in `.env.local`
3. **Restart the dev server**
4. **Try signing up** with a real email address
5. **Check your inbox** for the welcome email

## 📖 Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords Guide](https://support.google.com/accounts/answer/185833)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [SendGrid Setup Guide](https://docs.sendgrid.com/for-developers/sending-email/api-getting-started)

## 🆘 Still Having Issues?

If you're still having problems:

1. Check the browser console (F12) for client-side errors
2. Check the terminal for API route errors
3. Try the test page at `/test-email`
4. Verify your Gmail settings allow less secure apps
5. Try generating a new App Password

---

**Need help?** Open the test page at `/test-email` to debug your configuration.
