# K_M_Cart Security Checklist

## ✅ Pre-Deployment Security Audit

### 🔒 Environment Variables & Secrets

- [x] **`.env` files excluded from Git**
  - `.gitignore` includes `.env`, `server/.env`, `client/.env`
  - Verified with `git status` - no `.env` files tracked
  
- [x] **`.env.example` files created**
  - `server/.env.example` with placeholder values
  - `client/.env.example` with placeholder values
  
- [ ] **Production secrets are strong**
  - [ ] JWT_SECRET is 64+ characters random string
  - [ ] MongoDB password is strong (16+ characters)
  - [ ] Razorpay keys are production keys (rzp_live_)
  
- [ ] **Secrets rotated from development**
  - [ ] Different JWT_SECRET for production
  - [ ] Different MongoDB credentials
  - [ ] Different Razorpay keys

### 🗄️ Database Security

- [ ] **MongoDB Atlas configured**
  - [ ] IP whitelist set to `0.0.0.0/0` (required for Vercel)
  - [ ] Strong database password (no special characters)
  - [ ] Database user has minimal required permissions
  - [ ] Connection string uses `mongodb+srv://` (not localhost)
  
- [ ] **Database backups enabled**
  - [ ] Automated backups configured in Atlas
  - [ ] Backup retention policy set
  
- [ ] **Monitoring enabled**
  - [ ] Atlas alerts configured
  - [ ] Performance monitoring active

### 🔐 Authentication & Authorization

- [x] **JWT authentication implemented**
  - JWT tokens expire (check token expiry time)
  - Tokens stored securely (localStorage/sessionStorage)
  
- [x] **Admin middleware in place**
  - Admin routes protected with `adminMiddleware`
  - Role-based access control working
  
- [ ] **Password security**
  - [ ] Passwords hashed with bcrypt (salt rounds >= 10)
  - [ ] Password reset tokens expire
  - [ ] Rate limiting on login attempts (consider adding)

### 🌐 API Security

- [x] **CORS properly configured**
  - Whitelist specific origins (CLIENT_URL)
  - Credentials enabled for authenticated requests
  
- [x] **Input validation**
  - Request body size limited (10mb)
  - Input sanitization in place
  
- [ ] **Rate limiting** (Recommended to add)
  - [ ] Consider adding express-rate-limit
  - [ ] Limit requests per IP/user
  
- [x] **Error handling**
  - Errors don't expose sensitive information
  - Stack traces hidden in production

### 🔥 Firebase Security

- [ ] **Storage rules configured**
  - [ ] Read access: public
  - [ ] Write access: authenticated users only
  - [ ] File size limits enforced (2MB)
  - [ ] File type validation (JPG, PNG, WEBP)
  
- [x] **Firebase credentials**
  - API keys are public (safe for client-side)
  - Storage bucket properly configured

### 💳 Payment Security

- [ ] **Razorpay integration**
  - [ ] Using production keys (rzp_live_)
  - [ ] Webhook signature verification implemented
  - [ ] Payment amounts validated server-side
  - [ ] Order verification before fulfillment

### 📦 Dependencies

- [ ] **No known vulnerabilities**
  ```bash
  cd server && npm audit
  cd client && npm audit
  ```
  - [ ] Fix all high/critical vulnerabilities
  - [ ] Update outdated packages
  
- [ ] **Minimal dependencies**
  - Only necessary packages installed
  - No unused dependencies

### 🚀 Deployment Security

- [x] **Serverless configuration**
  - Admin routes included in `server/api/index.js`
  - All routes properly registered
  
- [ ] **Environment variables in Vercel**
  - [ ] All required variables set
  - [ ] No secrets in code
  - [ ] Production values used
  
- [ ] **HTTPS enforced**
  - [ ] Vercel provides HTTPS by default
  - [ ] No mixed content warnings
  
- [ ] **Security headers** (Consider adding)
  - [ ] Helmet.js for security headers
  - [ ] Content Security Policy
  - [ ] X-Frame-Options

### 📝 Code Security

- [x] **No hardcoded secrets**
  - All secrets in environment variables
  - No API keys in code
  
- [x] **No sensitive data in logs**
  - Passwords not logged
  - Tokens not logged
  
- [ ] **SQL/NoSQL injection prevention**
  - [ ] Mongoose queries parameterized
  - [ ] User input sanitized

### 🔍 Monitoring & Logging

- [ ] **Error tracking**
  - [ ] Consider adding Sentry or similar
  - [ ] Monitor Vercel function logs
  
- [ ] **Access logs**
  - [ ] Monitor suspicious activity
  - [ ] Track failed login attempts
  
- [ ] **Performance monitoring**
  - [ ] Vercel Analytics enabled
  - [ ] Database performance monitored

---

## 🚨 Critical Actions Before Going Live

### Must Do:
1. ✅ Verify `.env` files are NOT in Git
2. ✅ Add admin routes to serverless handler
3. ⚠️ Change all development secrets to production secrets
4. ⚠️ Set MongoDB Atlas IP whitelist to `0.0.0.0/0`
5. ⚠️ Configure Firebase Storage rules
6. ⚠️ Switch to Razorpay live keys
7. ⚠️ Test all authentication flows
8. ⚠️ Test admin panel access control
9. ⚠️ Test payment flow end-to-end
10. ⚠️ Run security audit: `npm audit`

### Should Do:
- Add rate limiting to prevent abuse
- Set up error tracking (Sentry)
- Configure automated backups
- Add security headers (Helmet.js)
- Set up monitoring alerts
- Document incident response plan

### Nice to Have:
- Add 2FA for admin accounts
- Implement session management
- Add API versioning
- Set up staging environment
- Add automated security scanning

---

## 🛡️ Security Incident Response

### If Credentials Are Compromised:

1. **Immediate Actions:**
   - Rotate all affected credentials immediately
   - Revoke compromised JWT tokens
   - Check logs for unauthorized access
   - Notify affected users if needed

2. **MongoDB Credentials:**
   - Change database password in Atlas
   - Update `MONGODB_URI` in Vercel
   - Redeploy backend

3. **JWT Secret:**
   - Generate new JWT_SECRET
   - Update in Vercel environment variables
   - All users will need to re-login
   - Redeploy backend

4. **Razorpay Keys:**
   - Regenerate keys in Razorpay dashboard
   - Update in Vercel environment variables
   - Redeploy backend
   - Monitor for fraudulent transactions

5. **Firebase:**
   - Rotate Firebase credentials
   - Update Storage rules
   - Review access logs

### If Data Breach Suspected:

1. Isolate affected systems
2. Preserve logs and evidence
3. Assess scope of breach
4. Notify affected users
5. Report to authorities if required
6. Implement fixes
7. Conduct post-mortem

---

## 📋 Regular Security Maintenance

### Weekly:
- Review Vercel function logs
- Check for failed login attempts
- Monitor database performance

### Monthly:
- Run `npm audit` and fix vulnerabilities
- Review and update dependencies
- Check MongoDB Atlas alerts
- Review Firebase usage and rules

### Quarterly:
- Rotate JWT secrets
- Review and update security policies
- Conduct security audit
- Update documentation

### Annually:
- Full security assessment
- Penetration testing (if budget allows)
- Review and update incident response plan
- Security training for team

---

## 🔗 Security Resources

### Tools:
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Check for vulnerabilities
- [Snyk](https://snyk.io/) - Continuous security monitoring
- [OWASP ZAP](https://www.zaproxy.org/) - Security testing
- [Helmet.js](https://helmetjs.github.io/) - Security headers

### Documentation:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Vercel Security](https://vercel.com/docs/security)

---

## ✅ Final Security Sign-Off

Before deploying to production, ensure:

- [ ] All items in "Critical Actions" completed
- [ ] Security audit passed
- [ ] Team trained on security practices
- [ ] Incident response plan documented
- [ ] Monitoring and alerts configured
- [ ] Backup and recovery tested

**Signed off by:** _________________  
**Date:** _________________  
**Version:** 1.0.0

---

**Remember:** Security is an ongoing process, not a one-time task. Regular reviews and updates are essential to maintain a secure application.
