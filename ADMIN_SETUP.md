# Admin Panel Setup & Testing Guide

## 🚀 Quick Setup

### 1. Environment Variables
Make sure your `.env.local` file includes:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://aayushshah820:TgGxTyXTSEwajVsB@artportfolio.sxe5oiw.mongodb.net/art-portfolio

# JWT Secret for Admin Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (for password reset and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Admin User
```bash
npm run create-admin
```

### 4. Start Development Server
```bash
npm run dev
```

## 🔐 Admin Access

### Login Credentials
- **URL**: `http://localhost:3000/signin`
- **Email**: `admin@sujalart.com`
- **Password**: `Admin@1234`

## 🧪 Testing Guide

### 1. Authentication Testing

#### Sign In
1. Go to `/signin`
2. Enter credentials: `admin@sujalart.com` / `Admin@1234`
3. Should redirect to `/admin` dashboard

#### Password Reset
1. Click "Forgot Password?" on sign-in page
2. Enter `admin@sujalart.com`
3. Check email for reset link (if SMTP configured)
4. Use reset link to set new password

### 2. Admin Dashboard Testing

#### Dashboard Overview
1. Visit `/admin` after login
2. Should see statistics cards and quick actions
3. Check that artwork and subscriber counts load

#### Artwork Management (`/admin/artworks`)
1. **View Artworks**: Should display existing artworks in grid
2. **Add Artwork**:
   - Click "Add Artwork"
   - Fill required fields (title, description)
   - **Image Upload**: Drag & drop or browse to upload (PNG, JPG, GIF up to 5MB)
   - Preview image before saving
   - Submit form
   - Check that subscribers receive email notification
3. **Edit Artwork**:
   - Click edit icon on any artwork
   - Modify details and save
   - Can upload new image to replace existing one
   - Previous uploaded images are automatically replaced
4. **Delete Artwork**:
   - Click delete icon
   - Confirm deletion
   - Uploaded images are automatically cleaned up

#### Content Management (`/admin/content`)
1. **Hero Section**:
   - Update title, subtitle, description
   - Change button text and link
   - **Background Image Upload**: Drag & drop or browse to upload background image
   - Save changes
2. **About Section**:
   - Edit bio content and skills
   - **Profile Image Upload**: Drag & drop or browse to upload profile image
   - Save changes
3. **Footer Section**:
   - Update contact information
   - Modify social links
   - Save changes

#### Subscriber Management (`/admin/subscribers`)
1. **View Subscribers**: Should list all newsletter subscribers
2. **Unsubscribe User**: Remove a subscriber (admin only)

#### Settings (`/admin/settings`)
1. **Update Email**: Change admin email address
2. **Change Password**:
   - Enter current password
   - Set new password (min 8 chars)
   - Confirm new password

### 3. Public Features Testing

#### Newsletter Subscription
1. Go to homepage footer
2. Enter email in newsletter form
3. Submit subscription
4. Should see success message
5. Check `/admin/subscribers` to verify addition

#### Email Notifications (if SMTP configured)
1. Add new artwork in admin panel
2. All subscribers should receive email notification
3. Email should include artwork image and details

### 4. Security Testing

#### Protected Routes
1. Try accessing `/admin` without login → Should redirect to `/signin`
2. Try accessing admin APIs without token → Should return 401 error
3. Logout and verify session is cleared

#### JWT Token Validation
1. Login and check localStorage for `adminToken`
2. Manually clear token and try accessing admin → Should redirect
3. Token should expire after 7 days

## 🛠️ API Testing

### Authentication Endpoints
```bash
# Sign In
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sujalart.com","password":"Admin@1234"}'

# Forgot Password
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sujalart.com"}'
```

### Admin Endpoints (Require Bearer Token)
```bash
# Get Artworks
curl -X GET http://localhost:3000/api/admin/artworks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Add Artwork
curl -X POST http://localhost:3000/api/admin/artworks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Art","description":"Test Description","image":"https://example.com/image.jpg"}'

# Upload Image
curl -X POST http://localhost:3000/api/admin/upload-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/your/image.jpg"

# Get Subscribers
curl -X GET http://localhost:3000/api/subscribers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Public Endpoints
```bash
# Subscribe to Newsletter
curl -X POST http://localhost:3000/api/subscribers \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 🚨 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
- Check `MONGODB_URI` in `.env.local`
- Ensure IP is whitelisted in MongoDB Atlas
- Verify database name in connection string

#### 2. JWT Authentication Error
- Check `JWT_SECRET` in `.env.local`
- Clear localStorage and login again
- Verify token format in API requests

#### 3. Email Not Sending
- Check SMTP credentials in `.env.local`
- Use Gmail App Password, not regular password
- Verify EMAIL_HOST and EMAIL_PORT settings

#### 4. Admin User Not Found
- Run `npm run create-admin` again
- Check MongoDB for users collection
- Verify admin credentials

### Development Tips

1. **Check Browser Console**: Look for JavaScript errors
2. **Check Network Tab**: Verify API responses
3. **Check Server Logs**: Monitor console for server errors
4. **MongoDB Compass**: Use GUI to inspect database collections

## 📱 Mobile Responsiveness

Test admin panel on different screen sizes:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

All admin features should be fully functional on mobile devices.

## 🔄 Production Deployment

### Vercel Environment Variables
Set these in your Vercel dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `NEXTAUTH_URL` (your production URL)

### Security Checklist
- [ ] Strong JWT_SECRET (32+ characters)
- [ ] Secure SMTP credentials
- [ ] MongoDB IP whitelist configured
- [ ] Admin password changed from default
- [ ] HTTPS enabled in production

## 🎯 Feature Checklist

### ✅ Completed Features
- [x] Secure admin authentication with JWT
- [x] Password reset via email
- [x] Full artwork CRUD operations
- [x] Direct image upload with drag & drop support
- [x] Automatic image cleanup on deletion
- [x] Content management (hero, about, footer)
- [x] Newsletter subscriber management
- [x] Email notifications for new artworks
- [x] Admin profile and password management
- [x] Responsive admin dashboard
- [x] Protected API routes
- [x] Session management
- [x] Error handling and validation

### 🔮 Future Enhancements
- [ ] Image upload to cloud storage (AWS S3, Cloudinary)
- [ ] Image compression and optimization
- [ ] Advanced email templates
- [ ] Analytics dashboard
- [ ] User roles and permissions
- [ ] Bulk artwork operations
- [ ] Email campaign management
- [ ] SEO optimization tools
- [ ] Backup and restore functionality
