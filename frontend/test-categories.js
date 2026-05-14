// Test script to add sample businesses for category testing
const sampleBusinesses = [
  {
    id: "test-restaurant-1",
    businessName: "Mario's Italian Kitchen",
    industry: "Restaurants",
    businessType: "Restaurant",
    city: "New York",
    state: "NY",
    address: "123 Main St",
    phone: "(555) 123-4567",
    description: "Authentic Italian cuisine",
    selectedPackage: "Premium",
    addedBy: "test@example.com",
    status: "approved",
    approvedAt: new Date().toISOString()
  },
  {
    id: "test-tech-1",
    businessName: "Tech Solutions Inc",
    industry: "Technology",
    businessType: "Software Company",
    city: "San Francisco",
    state: "CA",
    address: "456 Tech Blvd",
    phone: "(555) 987-6543",
    description: "Custom software development",
    selectedPackage: "Basic",
    addedBy: "test@example.com",
    status: "approved",
    approvedAt: new Date().toISOString()
  },
  {
    id: "test-restaurant-2",
    businessName: "Golden Dragon Chinese",
    industry: "Restaurants",
    businessType: "Restaurant",
    city: "Los Angeles",
    state: "CA",
    address: "789 Chinatown Ave",
    phone: "(555) 456-7890",
    description: "Traditional Chinese cuisine",
    selectedPackage: "Standard",
    addedBy: "test@example.com",
    status: "approved",
    approvedAt: new Date().toISOString()
  }
];

// Add to approved businesses
const existingApproved = JSON.parse(localStorage.getItem("approvedBusinesses") || "[]");
const updatedApproved = [...existingApproved, ...sampleBusinesses];
localStorage.setItem("approvedBusinesses", JSON.stringify(updatedApproved));

console.log("Sample businesses added for testing categories!");