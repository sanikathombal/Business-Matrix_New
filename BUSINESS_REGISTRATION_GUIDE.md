# Business Registration & Login Flow

## Overview
This guide explains how the business registration and login system works in the B-Matrix application.

## Registration Flow

### 1. User Goes to Business Registration Page
- URL: `/business-register`
- User fills in the form with:
  - Business Name
  - Business Email
  - Phone Number
  - Password (with password strength requirements)
  - Confirm Password
  - Profile Image (optional)

### 2. Form Validation (Frontend)
The form validates:
- Business name: 2-100 characters
- Email: Valid email format
- Phone: Valid phone format
- Password strength requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

### 3. Submit to Backend
When the user clicks "Register Business":
1. Frontend creates FormData with the fields
2. Sends POST request to: `http://localhost:5000/api/auth/business-register`
3. Includes profile image if uploaded

### 4. Backend Processing
The backend (`/api/auth/business-register`):
1. Validates all input data
2. Checks if email already exists
3. Creates a new User with:
   - name: Business Name
   - email: Business Email
   - phone: Phone Number
   - password: Hashed password
   - role: "business"
   - profileImage: URL to uploaded image (if provided)
4. Generates JWT token
5. Returns:
   ```json
   {
     "message": "Business registered successfully",
     "user": {
       "id": "user_mongo_id",
       "name": "Business Name",
       "email": "business@example.com",
       "phone": "1234567890",
       "role": "business",
       "profileImage": "/uploads/filename"
     },
     "token": "jwt_token_here"
   }
   ```

### 5. Frontend Stores Data
After successful registration, the frontend:
1. Stores in localStorage:
   - `businessUser`: Full user object
   - `businessToken`: JWT token
   - `businessLoggedIn`: "true"
   - `businessEmail`: Email
   - `businessName`: Business name
2. Automatically redirects to `/business-login`
3. Pre-fills email and password in login form

## Login Flow

### 1. User Goes to Business Login Page
- URL: `/business-login`
- If coming from registration, email and password are pre-filled

### 2. Form Validation (Frontend)
Validates:
- Email: Valid format
- Password: Not empty

### 3. Submit to Backend
Sends POST request to: `http://localhost:5000/api/auth/business-login`
```
{
  "email": "business@example.com",
  "password": "password123"
}
```

### 4. Backend Authentication
The backend (`/api/auth/business-login`):
1. Finds user by email
2. Verifies email exists and user has "business" role
3. Compares password with hashed password
4. If valid, generates JWT token
5. Returns user data and token

### 5. Frontend Stores Data & Redirects
1. Stores in localStorage:
   - `businessToken`: JWT token
   - `businessUser`: User object
   - `businessLoggedIn`: "true"
   - `businessEmail`: Email
   - `businessName`: Business name
2. Redirects to `/dashboard`

## Data Storage

### MongoDB Collections

#### Users Collection
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: "business" | "user" | "admin",
  profileImage: String (URL),
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

#### Registration
```
POST /api/auth/business-register
Content-Type: multipart/form-data

businessName: "My Business"
businessEmail: "business@example.com"
phone: "1234567890"
password: "SecurePassword123!"
profileImage: <file>
```

**Response:**
```json
{
  "message": "Business registered successfully",
  "user": {...},
  "token": "jwt..."
}
```

#### Login
```
POST /api/auth/business-login
Content-Type: application/json

{
  "email": "business@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "message": "Business login successful",
  "user": {...},
  "token": "jwt..."
}
```

## Error Handling

### Registration Errors
- **Email already exists**: User with this email already registered
- **Validation errors**: Invalid input format
- **File upload errors**: Invalid image file or file too large (5MB limit)
- **Server errors**: MongoDB connection or other server issues

### Login Errors
- **Invalid credentials**: Email or password is incorrect
- **Not a business account**: User exists but doesn't have business role

## Next Steps (After Login)

1. **Create Business Profile**: Business can add full details
2. **Add Services**: List services/products
3. **Manage Leads**: View incoming leads
4. **View Reviews**: See customer reviews
5. **Analytics**: Access business analytics

## Testing

### Test Registration
1. Go to `http://localhost:8080/business-register`
2. Fill in form:
   - Business Name: "Test Business"
   - Email: "test@example.com"
   - Phone: "1234567890"
   - Password: "TestPass123!"
   - Confirm: "TestPass123!"
3. Click "Register Business"
4. Check MongoDB for new user in `bmatrix.users` collection

### Test Login
1. Use registered email and password
2. Should be redirected to dashboard
3. Check localStorage for stored token and user data

### Database Verification
```
# Connect to MongoDB
mongosh

# Check database
use bmatrix

# View registered users
db.users.find()

# Find specific business
db.users.find({ role: "business", email: "test@example.com" })
```

## Security Features

1. **Password Hashing**: Passwords are hashed with bcryptjs (12 salt rounds)
2. **JWT Authentication**: Secure token-based authentication
3. **Email Validation**: Valid email format required
4. **Password Strength**: Strong password requirements enforced
5. **File Upload Validation**: Image file type and size validation
6. **CORS**: Cross-origin requests properly configured
7. **Helmet**: Security headers added
8. **Rate Limiting**: API rate limiting enabled

## Troubleshooting

### Registration Fails with "Email already exists"
- The email is already registered in MongoDB
- Use a different email or reset the database

### Login Shows "Invalid credentials"
- Check email and password spelling
- Verify the account was registered successfully

### Profile Image Not Uploading
- Ensure file is an image (jpg, png, gif, webp)
- File size must be less than 5MB
- Check backend `/uploads` folder exists

### MongoDB Connection Error
- Verify MongoDB is running
- Check connection string in `.env`
- For Atlas: Ensure IP is whitelisted

## Files Involved

### Frontend
- `/frontend/src/components/BusinessRegistrationForm.tsx` - Registration form
- `/frontend/src/components/BusinessLoginForm.tsx` - Login form
- `/frontend/src/pages/BusinessRegistration.tsx` - Registration page
- `/frontend/src/pages/BusinessLogin.tsx` - Login page
- `/frontend/src/lib/api.ts` - API calls

### Backend
- `/backend/routes/auth.js` - Authentication routes
- `/backend/models/User.js` - User model
- `/backend/middleware/auth.js` - Authentication middleware
- `/backend/middleware/upload.js` - File upload handling
- `/backend/server.js` - Main server file
