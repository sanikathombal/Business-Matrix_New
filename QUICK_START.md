# Quick Start - Business Registration & Login

## Step 1: Ensure Both Servers Are Running

### Terminal 1 - Frontend
```bash
cd c:\Users\HP\OneDrive\Desktop\b-matrix-new\frontend
npm run dev
```
Runs on: `http://localhost:8080/`

### Terminal 2 - Backend  
```bash
cd c:\Users\HP\OneDrive\Desktop\b-matrix-new\backend
npm run dev
```
Runs on: `http://localhost:5000/`

## Step 2: Register a Business

1. Open browser: `http://localhost:8080/business-register`
2. Fill in the form:
   ```
   Business Name: ABC Company
   Business Email: abc@example.com
   Phone: (555) 123-4567
   Password: SecurePass123!
   Confirm Password: SecurePass123!
   ```
3. (Optional) Upload a business profile image
4. Click **"Register Business"** button

## Step 3: What Happens

✅ **Frontend**:
- Validates all form fields
- Uploads data to backend
- Shows success message
- Automatically redirects to login page with pre-filled credentials

✅ **Backend**:
- Receives registration request
- Validates input
- Checks if email already exists
- Hashes password with bcryptjs
- Creates new User in MongoDB with role: "business"
- Generates JWT token
- Returns user data and token

✅ **MongoDB**:
- New document created in `bmatrix.users` collection:
  ```
  {
    _id: ObjectId,
    name: "ABC Company",
    email: "abc@example.com",
    password: "$2a$12$...", // hashed
    phone: "(555) 123-4567",
    role: "business",
    profileImage: "/uploads/filename.jpg",
    isVerified: false,
    createdAt: Date,
    updatedAt: Date
  }
  ```

## Step 4: Login with Registered Business

1. Email and password should already be pre-filled
2. Click **"Login"** button

✅ **What happens**:
- Backend authenticates credentials
- Compares password with hashed version
- Generates new JWT token
- Returns authenticated user data
- Frontend stores token in localStorage
- Redirected to business dashboard

## Step 5: Verify Data in MongoDB

```bash
# Open MongoDB client
mongosh

# Select database
use bmatrix

# View all users
db.users.find()

# View only business users
db.users.find({ role: "business" })

# View specific business
db.users.find({ email: "abc@example.com" })
```

## API Flow Diagram

```
REGISTRATION
============
User fills form
       ↓
Frontend validation
       ↓
POST /api/auth/business-register
       ↓
Backend validation + check if email exists
       ↓
Hash password with bcryptjs
       ↓
Create User in MongoDB
       ↓
Generate JWT token
       ↓
Return user data + token
       ↓
Frontend stores in localStorage
       ↓
Redirect to login


LOGIN
=====
User enters credentials
       ↓
Frontend validation
       ↓
POST /api/auth/business-login
       ↓
Backend finds user by email
       ↓
Compare password with hash
       ↓
If valid: Generate JWT token
       ↓
Return authenticated user + token
       ↓
Frontend stores token in localStorage
       ↓
Redirect to dashboard
```

## Data Flow

### Registration Data
```
Frontend Form Data
  ↓
  ├─ businessName: "ABC Company"
  ├─ businessEmail: "abc@example.com"
  ├─ phone: "(555) 123-4567"
  ├─ password: "SecurePass123!"
  └─ profileImage: File
  
  ↓ (FormData)
  
Backend Receives
  ↓
  ├─ Validates all fields
  ├─ Checks email not in use
  ├─ Hashes password
  └─ Prepares user object
  
  ↓ (MongoDB)
  
Database Stores
  {
    name: "ABC Company",
    email: "abc@example.com",
    password: hashed,
    phone: "(555) 123-4567",
    role: "business",
    profileImage: URL,
    createdAt: timestamp,
    updatedAt: timestamp
  }
  
  ↓ (Response)
  
Frontend Receives
  {
    token: "jwt...",
    user: {...}
  }
  
  ↓ (localStorage)
  
Stores:
  - businessToken
  - businessUser
  - businessLoggedIn
  - businessEmail
  - businessName
```

## Troubleshooting

### ❌ "Email already exists"
- Use a different email address
- Or check MongoDB and delete the duplicate

### ❌ "Invalid email format"
- Make sure email has @ and domain
- Example: `business@example.com`

### ❌ "Password does not meet requirements"
- Must have: 8+ chars, uppercase, lowercase, number, special char
- Example: `SecurePass123!` ✅

### ❌ "Cannot POST /api/auth/business-register"
- Backend not running
- Or wrong endpoint URL
- Check terminal for "Server running on port 5000"

### ❌ "MongoDB connection error"
- MongoDB not running
- Check connection string in `/backend/.env`
- For local: should be `mongodb://localhost:27017/bmatrix`

### ❌ File upload not working
- Image file only
- Less than 5MB
- Check `/backend/uploads/` folder exists

## Next Steps After Login

1. **Complete Business Profile**
   - Add full business description
   - Set business hours
   - Add services/products

2. **Create Business Listings**
   - Add detailed business information
   - Upload business images
   - Set contact information

3. **Manage Leads**
   - View incoming inquiries
   - Update lead status
   - Track conversions

4. **Monitor Performance**
   - View analytics
   - Track reviews and ratings
   - Monitor website traffic

## Important Files

| File | Purpose |
|------|---------|
| `/frontend/src/components/BusinessRegistrationForm.tsx` | Registration form UI |
| `/frontend/src/components/BusinessLoginForm.tsx` | Login form UI |
| `/backend/routes/auth.js` | Authentication routes |
| `/backend/models/User.js` | User schema |
| `/backend/.env` | Backend configuration |
| `/backend/uploads/` | Uploaded images storage |

## Database Commands

```bash
# Connect
mongosh

# Use database
use bmatrix

# View structure
db.users.findOne()

# Count users
db.users.countDocuments()

# Find by role
db.users.find({ role: "business" }).pretty()

# Delete user (for testing)
db.users.deleteOne({ email: "test@example.com" })
```

**You're all set! 🎉 Follow the steps above to test the complete registration and login flow.**
