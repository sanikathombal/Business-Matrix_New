# BusinessMatrix Category Testing

## Test Files for Category Functionality

### 1. Add Test Businesses
**File:** `add-test-businesses.html`

This file adds 3 sample businesses to test the category filtering:
- **Mario's Italian Kitchen** (Restaurants) - New York, NY
- **Tech Solutions Inc** (Technology) - San Francisco, CA
- **Golden Dragon Chinese Restaurant** (Restaurants) - Los Angeles, CA

**How to use:**
1. Open `add-test-businesses.html` in your web browser
2. Click "Add These 3 Businesses" button
3. The businesses will be added to approved businesses (no admin approval needed)

### 2. Clear Test Businesses
**File:** `clear-test-businesses.html`

This file helps you manage the test data:
- **Clear Test Businesses Only**: Removes only the test businesses (ids starting with "test-")
- **Clear ALL Businesses**: Removes all businesses from both approved and pending
- **Show Current Businesses**: Displays all current businesses

**How to use:**
1. Open `clear-test-businesses.html` in your web browser
2. Choose the appropriate action

## Testing the Categories

1. **Start your app:**
   ```bash
   cd B-matrix
   npm run dev
   ```

2. **Add test businesses** using `add-test-businesses.html`

3. **Test category filtering:**
   - Go to your app (usually http://localhost:8083)
   - Click "Categories" in the navbar
   - Click "Restaurants" → Should show 2 restaurants
   - Click "Technology" → Should show 1 tech company
   - Click other categories → Should be empty

## What the Categories Do

- When you add a business with a category, it gets stored with `industry: "CategoryName"`
- Admin approves businesses, moving them from `pendingBusinesses` to `approvedBusinesses`
- Category pages filter `approvedBusinesses` by `biz.industry === category`
- Each category page shows only businesses in that specific category

## Real Business Flow

1. Business owner adds business → goes to `pendingBusinesses`
2. Admin approves → moves to `approvedBusinesses`
3. Users browse categories → see filtered businesses

The test businesses bypass step 2 and go directly to approved status.