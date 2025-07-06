# Subekshya's Artistry - MongoDB Portfolio

A dynamic art portfolio built with Next.js, React, Tailwind CSS, and MongoDB Atlas. This project has been migrated from static data to a fully dynamic MongoDB-backed system.

## 🚀 Features

- **Dynamic Content Management**: All content is stored in MongoDB Atlas
- **Secure Admin Panel**: Full-featured admin dashboard with authentication
- **Newsletter System**: Email subscription and automatic notifications
- **Password Reset**: Secure password reset via email
- **Serverless API Routes**: Vercel-compatible API endpoints
- **Real-time Data**: Content updates instantly without redeployment
- **Responsive Design**: Beautiful UI with Tailwind CSS and Framer Motion
- **Error Handling**: Comprehensive error states and loading indicators
- **SEO Optimized**: Next.js with proper meta tags and structure

## 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Vercel account (for deployment)

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd sujalart.portfolio-main
npm install
```

### 2. MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Create a new cluster (M0 Free tier recommended)

2. **Configure Database Access**
   - Go to Database Access
   - Create a new database user with read/write permissions
   - Note down username and password

3. **Configure Network Access**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (for Vercel deployment)
   - Or add your specific IP for local development

4. **Get Connection String**
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/art-portfolio?retryWrites=true&w=majority

# JWT Secret for Admin Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (for contact forms, password reset, and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
```

**Replace the following:**
- `your-username`: Your MongoDB Atlas username
- `your-password`: Your MongoDB Atlas password
- `your-cluster`: Your cluster name
- `your-email@gmail.com`: Your Gmail address
- `your-app-password`: Gmail app password

### 4. Seed Database

Run the database seeding script to populate your MongoDB collections:

```bash
# Install dependencies if not already done
npm install

# Run the seeding script
npm run seed

# Create admin user
npm run create-admin
```

This will create:
- **Artworks Collection**: 7 sample artworks from your original data
- **Hero Collection**: Hero section content
- **About Collection**: About section content
- **Footer Collection**: Footer contact and social links
- **Users Collection**: Admin user for dashboard access
- **Subscribers Collection**: Newsletter subscribers

### 5. Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see your portfolio.

## 🔐 Admin System

### Admin Dashboard Access

1. **Admin Login**: Visit `/signin` to access the admin dashboard
2. **Default Credentials**:
   - Email: `admin@sujalart.com`
   - Password: `Admin@1234`
3. **Change Password**: After first login, go to Settings to update your credentials

### Admin Features

#### 🎨 Artwork Management
- **Add New Artworks**: Upload and manage portfolio pieces
- **Edit Existing**: Update artwork details, descriptions, and images
- **Delete Artworks**: Remove artworks from portfolio
- **Auto-Notifications**: Subscribers automatically receive emails when new artworks are added

#### 📝 Content Management
- **Hero Section**: Update homepage banner content
- **About Section**: Modify artist bio and information
- **Footer**: Update contact details and social links

#### 👥 Subscriber Management
- **View Subscribers**: See all newsletter subscribers
- **Manage Subscriptions**: Remove subscribers if needed
- **Auto-Notifications**: System automatically emails subscribers about new artworks

#### ⚙️ Admin Settings
- **Update Email**: Change admin email address
- **Change Password**: Secure password updates
- **Profile Management**: Manage admin account details

### Password Reset System

1. **Forgot Password**: Click "Forgot Password?" on sign-in page
2. **Email Reset**: Receive secure reset link via email
3. **Set New Password**: Use the link to create a new password
4. **Auto-Expiry**: Reset links expire after 1 hour for security

### Email Notifications

The system automatically sends emails for:
- **New Artwork Alerts**: When admin adds new artworks
- **Password Reset**: Secure reset links
- **Newsletter Subscriptions**: Welcome emails (optional)

### Admin Dashboard Sections

1. **Dashboard Overview**: Statistics and quick actions
2. **Manage Artworks**: Full CRUD operations for portfolio pieces with image upload
3. **Edit Content**: Update all website content sections
4. **View Subscribers**: Newsletter subscriber management
5. **Settings**: Admin profile and security settings

### Image Upload Features

- **Direct File Upload**: Upload images directly to the server (5MB limit)
- **Drag & Drop Support**: Drag and drop images for easy upload
- **Image Preview**: Preview images before saving
- **Automatic Cleanup**: Old images are automatically deleted when artworks are removed
- **Supported Formats**: PNG, JPG, GIF, and other image formats
- **Multiple Upload Types**:
  - Artwork images (portfolio pieces)
  - Background images (hero section)
  - Profile images (about section)

## 📊 Database Schema

### Artworks Collection
```javascript
{
  id: Number,           // Unique artwork ID (auto-generated)
  title: String,        // Artwork title
  image: String,        // Image URL path
  description: String,  // Artwork description
  price: Number,        // Price in USD (optional)
  medium: String,       // Art medium (e.g., "Oil on canvas")
  dimensions: String,   // Artwork dimensions (e.g., "24 x 36 inches")
  category: String,     // Category (e.g., "Landscape", "Portrait")
  year: Number,         // Year created
  isAvailable: Boolean, // Available for purchase (default: true)
  createdAt: Date,      // Creation timestamp
  updatedAt: Date       // Last update timestamp
}
```

### Hero Collection
```javascript
{
  title: String,           // Main heading
  subtitle: String,        // Subtitle text
  backgroundImage: String, // Background image URL
  ctaText: String,         // Call-to-action button text
  ctaLink: String          // Call-to-action link
}
```

### About Collection
```javascript
{
  title: String,        // Section title
  content: String,      // Main content
  image: String,        // Artist image URL
  artistName: String,   // Artist name
  artistBio: String,    // Artist biography
  specialties: [String], // Array of specialties
  experience: String    // Years of experience
}
```

### Footer Collection
```javascript
{
  email: String,           // Contact email
  phone: String,           // Contact phone
  address: String,         // Physical address
  socialLinks: {           // Social media links
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  newsletterText: String,  // Newsletter description
  copyrightText: String    // Copyright text
}
```

### Users Collection (Admin)
```javascript
{
  email: String,           // Admin email (unique)
  password: String,        // Hashed password
  role: String,            // User role (default: 'admin')
  resetToken: String,      // Password reset token
  resetTokenExpires: Date, // Token expiration
  createdAt: Date,         // Account creation date
  updatedAt: Date          // Last update
}
```

### Subscribers Collection
```javascript
{
  email: String,           // Subscriber email (unique)
  isActive: Boolean,       // Subscription status
  source: String,          // Subscription source (default: 'website')
  createdAt: Date,         // Subscription date
  updatedAt: Date          // Last update
}
```

## 🔧 API Endpoints

### GET `/api/artworks`
Returns all artworks from the database.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Sunset Serenity",
      "image": "/images/sunset-serenity.jpg",
      "description": "...",
      "price": 500
    }
  ]
}
```

### GET `/api/hero`
Returns hero section data.

### GET `/api/about`
Returns about section data.

### GET `/api/footer`
Returns footer section data.

## 🔐 Admin API Endpoints

### Authentication
- **POST `/api/auth/signin`** - Admin login
- **POST `/api/auth/forgot-password`** - Request password reset
- **POST `/api/auth/reset-password`** - Reset password with token

### Admin Artwork Management
- **GET `/api/admin/artworks`** - Get all artworks (admin only)
- **POST `/api/admin/artworks`** - Add new artwork (admin only)
- **PUT `/api/admin/artworks`** - Update artwork (admin only)
- **DELETE `/api/admin/artworks`** - Delete artwork (admin only)
- **POST `/api/admin/upload-image`** - Upload artwork image (admin only)

### Admin Content Management
- **GET `/api/admin/content?section=hero|about|footer`** - Get section content (admin only)
- **PUT `/api/admin/content`** - Update section content (admin only)

### Admin Profile Management
- **GET `/api/admin/profile`** - Get admin profile (admin only)
- **PUT `/api/admin/profile`** - Update admin profile/password (admin only)

### Subscriber Management
- **GET `/api/subscribers`** - Get all subscribers (admin only)
- **POST `/api/subscribers`** - Subscribe to newsletter (public)
- **DELETE `/api/subscribers`** - Unsubscribe user (admin only)

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add MongoDB integration"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repo to Vercel
   - Add environment variables in Vercel dashboard:
     - `MONGODB_URI`
     - `EMAIL_HOST`
     - `EMAIL_PORT`
     - `EMAIL_USER`
     - `EMAIL_PASS`
     - `NEXTAUTH_SECRET`

3. **Deploy**
   - Vercel will automatically deploy on push
   - Your site will be available at `https://your-project.vercel.app`

## 📝 Content Management

### Adding New Artworks

1. **Via MongoDB Atlas Dashboard:**
   - Go to your cluster → Browse Collections
   - Select `artworks` collection
   - Click "Insert Document"
   - Add artwork data following the schema

2. **Via API:**
   ```bash
   curl -X POST http://localhost:3000/api/artworks \
     -H "Content-Type: application/json" \
     -d '{
       "id": 8,
       "title": "New Artwork",
       "image": "/images/new-artwork.jpg",
       "description": "Description here",
       "price": 600
     }'
   ```

### Updating Content

1. **Hero Section:**
   - Update the single document in `hero` collection
   - Changes reflect immediately

2. **About Section:**
   - Update the single document in `about` collection

3. **Footer Section:**
   - Update the single document in `footer` collection

### Adding Images

1. Upload images to `/public/images/`
2. Reference them in your content as `/images/filename.jpg`

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your connection string
   - Check network access settings
   - Ensure username/password are correct

2. **Environment Variables Not Loading**
   - Restart your development server
   - Check `.env.local` file location
   - Verify variable names match exactly

3. **API Routes Not Working**
   - Check MongoDB connection
   - Verify collection names
   - Check browser console for errors

4. **Images Not Loading**
   - Ensure images are in `/public/images/`
   - Check file paths in database
   - Verify file permissions

### Development Tips

- Use MongoDB Atlas dashboard to view/edit data
- Check browser Network tab for API calls
- Use browser console for debugging
- Monitor Vercel function logs for API issues

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme changes
- Update component styles in respective files
- Add new animations with Framer Motion

### Content
- Update database collections for content changes
- Add new API endpoints for additional features
- Extend schemas for new data fields

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review MongoDB Atlas documentation
3. Check Vercel deployment logs
4. Open an issue in the repository

## 📄 License

This project is licensed under the MIT License.

---

**Happy coding! 🎨✨**
