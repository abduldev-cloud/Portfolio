# EmailJS Setup Guide

## Quick Start (5 Minutes)

Follow these steps to enable your contact form:

### 1. Create Account
- Visit: https://www.emailjs.com/
- Click "Sign Up" (free tier is perfect)
- Verify your email

### 2. Add Email Service
1. Dashboard → **Email Services** → **Add New Service**
2. Choose your provider (Gmail recommended)
3. For Gmail:
   - Click "Connect Account"
   - Sign in with your Google account
   - Allow EmailJS permissions
4. Copy your **Service ID** (e.g., `service_abc123`)

### 3. Create Template
1. Dashboard → **Email Templates** → **Create New Template**
2. Template settings:
   - **Template Name**: Portfolio Contact Form
   - **Subject**: `New message from {{from_name}}`
3. **Content** (paste this):

```
Hello Abdul,

You have a new message from your portfolio contact form:

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
Sent via Portfolio Contact Form
```

4. Click **Save** and copy your **Template ID** (e.g., `template_xyz789`)

### 4. Get Public Key
1. Dashboard → **Account** → **General**
2. Find **Public Key** section
3. Copy your key (e.g., `abcdefghijklmnop`)

### 5. Update Your Code

Open `client/src/app/components/home/home.component.ts` and update these 3 lines:

**Line 42** (in constructor):
```typescript
emailjs.init('YOUR_PUBLIC_KEY_HERE'); // Replace with your actual public key
```

**Lines 195-196** (in sendEmail method):
```typescript
const response = await emailjs.send(
  'YOUR_SERVICE_ID_HERE',     // Replace with your service ID
  'YOUR_TEMPLATE_ID_HERE',    // Replace with your template ID
  {
    from_name: this.contactForm.name,
    from_email: this.contactForm.email,
    message: this.contactForm.message,
    to_name: 'Abdul Hameed'
  }
);
```

### 6. Test It!
1. Save the file (Angular will auto-reload)
2. Go to your portfolio: http://localhost:4200
3. Scroll to the contact section
4. Fill out the form and click "Send Message"
5. Check your email inbox! 📧

---

## Example Configuration

Here's what your code should look like after setup:

```typescript
// In constructor (line 42)
emailjs.init('abcdefghijklmnop');

// In sendEmail method (lines 195-196)
const response = await emailjs.send(
  'service_abc123',
  'template_xyz789',
  {
    from_name: this.contactForm.name,
    from_email: this.contactForm.email,
    message: this.contactForm.message,
    to_name: 'Abdul Hameed'
  }
);
```

---

## Troubleshooting

### "Failed to send" error?
- **Check credentials**: Ensure Service ID, Template ID, and Public Key are correct
- **Check internet**: EmailJS requires internet connection
- **Check console**: Open browser DevTools (F12) to see detailed error

### Not receiving emails?
- **Check spam folder**: EmailJS emails might be filtered
- **Verify email service**: Make sure your Gmail/email is connected in EmailJS dashboard
- **Test in EmailJS**: Use their "Send Test Email" feature in the template editor

### Form validation errors?
- All fields are required
- Email must be valid format
- Check browser console for specific errors

---

## Free Tier Limits

EmailJS free tier includes:
- ✅ 200 emails/month
- ✅ Unlimited templates
- ✅ All email services
- ✅ No credit card required

Perfect for a portfolio site!

---

## Alternative: Formspree

If you prefer not to use EmailJS, you can use Formspree instead:

1. Visit: https://formspree.io/
2. Create account and get your form endpoint
3. Update the form to use Formspree's endpoint

---

## Security Note

Your EmailJS Public Key is safe to expose in client-side code. It's designed for this purpose and has built-in rate limiting and spam protection.

---

**Need Help?**
- EmailJS Docs: https://www.emailjs.com/docs/
- EmailJS Support: support@emailjs.com
