const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'Business-Matrix';
const jwtSecret = process.env.JWT_SECRET || 'secret';
const uploadDir = path.join(__dirname, 'uploads');

// Use a single MongoDB database for all app collections.
// Collections within this DB:
// - business_register
// - user_register

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

const client = new MongoClient(mongoUri, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
});

async function connectMongo() {
  try {
    await client.connect();
    const db = client.db(dbName);
    app.locals.db = db;
    console.log(`Connected to MongoDB: ${mongoUri}/${dbName}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

connectMongo();

const authRouter = express.Router();

const createToken = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

authRouter.post('/business-register', upload.single('profileImage'), async (req, res) => {
  try {
    const { businessName, businessEmail, phone, password } = req.body;
    if (!businessName || !businessEmail || !phone || !password) {
      return res.status(400).json({ message: 'Missing required registration fields' });
    }

    const db = app.locals.db;
    const businesses = db.collection('business_register');
    const existing = await businesses.findOne({ businessEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const profileImage = req.file
      ? {
          originalName: req.file.originalname,
          filename: req.file.filename,
          path: `/uploads/${req.file.filename}`,
          mimeType: req.file.mimetype,
          size: req.file.size,
        }
      : null;

    const insertResult = await businesses.insertOne({
      businessName,
      businessEmail,
      phone,
      passwordHash,
      profileImage,
      createdAt: new Date(),
    });

    const user = {
      id: insertResult.insertedId.toString(),
      businessName,
      businessEmail,
      phone,
      profileImage,
    };

    const token = createToken({ id: user.id, email: businessEmail, type: 'business' });
    return res.json({ user, token });
  } catch (error) {
    console.error('Business registration error:', error);
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

authRouter.post('/register', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required registration fields' });
    }

    const db = app.locals.db;
    const users = db.collection('user_register');
    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const profileImage = req.file
      ? {
          originalName: req.file.originalname,
          filename: req.file.filename,
          path: `/uploads/${req.file.filename}`,
          mimeType: req.file.mimetype,
          size: req.file.size,
        }
      : null;

    const insertResult = await users.insertOne({
      name,
      email,
      phone: phone || null,
      passwordHash,
      profileImage,
      createdAt: new Date(),
    });

    const user = {
      id: insertResult.insertedId.toString(),
      name,
      email,
      phone: phone || null,
      profileImage,
    };

    const token = createToken({ id: user.id, email, type: 'user' });
    return res.json({ user, token });
  } catch (error) {
    console.error('User registration error:', error);
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const db = app.locals.db;
    const users = db.collection('user_register');
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const responseUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
    };

    const token = createToken({ id: responseUser.id, email: responseUser.email, type: 'user' });
    return res.json({ user: responseUser, token });
  } catch (error) {
    console.error('User login error:', error);
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

authRouter.post('/business-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const db = app.locals.db;
    const businesses = db.collection('business_register');
    const business = await businesses.findOne({ businessEmail: email });
    if (!business) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, business.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = {
      id: business._id.toString(),
      businessName: business.businessName,
      businessEmail: business.businessEmail,
      phone: business.phone,
      profileImage: business.profileImage,
    };

    const token = createToken({ id: user.id, email: user.businessEmail, type: 'business' });
    return res.json({ user, token });
  } catch (error) {
    console.error('Business login error:', error);
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.use('/api/auth', authRouter);
app.use('/api', express.static(uploadDir));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'B-Matrix backend is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', db: !!app.locals.db });
});

app.get('/collections', async (req, res) => {
  try {
    const collections = await app.locals.db.listCollections().toArray();
    res.json(collections.map((collection) => collection.name));
  } catch (error) {
    res.status(500).json({ error: 'Unable to list collections', details: error.message });
  }
});

app.get('/api/businesses', async (req, res) => {
  try {
    const { status, industry, search, limit, page, addedBy } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (industry) {
      filter.industry = industry;
    }

    if (addedBy) {
      filter.addedBy = addedBy;
    }

    if (search) {
      const searchRegex = new RegExp(search.toString(), 'i');
      filter.$or = [
        { businessName: searchRegex },
        { description: searchRegex },
        { industry: searchRegex },
        { businessType: searchRegex },
      ];
    }

    const listings = app.locals.db.collection('add-business');
    const options = {
      sort: { createdAt: -1 },
    };

    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 0;

    const cursor = listings.find(filter, options);

    if (pageSize > 0) {
      cursor.skip((pageNumber - 1) * pageSize).limit(pageSize);
    }

    const results = await cursor.toArray();
    const mapped = results.map((doc) => ({
      id: doc._id.toString(),
      ...doc,
      _id: undefined,
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Fetch businesses error:', error);
    res.status(500).json({ message: 'Unable to fetch businesses', error: error.message });
  }
});

app.get('/api/businesses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const listings = app.locals.db.collection('add-business');
    const business = await listings.findOne({ _id: new ObjectId(id) });

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.json({ id: business._id.toString(), ...business, _id: undefined });
  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({ message: 'Unable to fetch business', error: error.message });
  }
});

app.post('/api/businesses', async (req, res) => {
  try {
    const {
      businessName,
      categories,
      businessType,
      website,
      description,
      image,
      address,
      phone,
      addedBy,
      city,
      state,
      zipCode,
    } = req.body;

    if (!businessName || !categories || !businessType || !description || !addedBy) {
      return res.status(400).json({ message: 'Missing required business fields' });
    }

    const listings = app.locals.db.collection('add-business');
    const newBusiness = {
      businessName,
      industry: categories,
      businessType,
      website: website || '',
      description,
      image: image || '',
      address: address || '',
      phone: phone || '',
      city: city || '',
      state: state || '',
      zipCode: zipCode || '',
      addedBy,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (req.body.selectedPackage) {
      newBusiness.selectedPackage = req.body.selectedPackage;
    }

    const insertResult = await listings.insertOne(newBusiness);
    const saved = await listings.findOne({ _id: insertResult.insertedId });

    res.status(201).json({ id: saved._id.toString(), ...saved, _id: undefined });
  } catch (error) {
    console.error('Create business error:', error);
    res.status(500).json({ message: 'Unable to create business', error: error.message });
  }
});

app.put('/api/businesses/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const listings = app.locals.db.collection('add-business');
    const updateResult = await listings.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'approved',
          approvedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!updateResult.value) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const approvedBusiness = updateResult.value;
    res.json({ id: approvedBusiness._id.toString(), ...approvedBusiness, _id: undefined });
  } catch (error) {
    console.error('Approve business error:', error);
    res.status(500).json({ message: 'Unable to approve business', error: error.message });
  }
});

app.put('/api/businesses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const listings = app.locals.db.collection('add-business');
    const updateData = { ...req.body };
    delete updateData._id; // Remove _id from update data

    const updateResult = await listings.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.status(200).json({ message: 'Business updated successfully' });
  } catch (error) {
    console.error('Update business error:', error);
    res.status(500).json({ message: 'Unable to update business', error: error.message });
  }
});

app.delete('/api/businesses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const listings = app.locals.db.collection('add-business');
    const deleteResult = await listings.deleteOne({ _id: new ObjectId(id) });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Delete business error:', error);
    res.status(500).json({ message: 'Unable to delete business', error: error.message });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    console.log('Job creation request received:', JSON.stringify(req.body, null, 2));
    
    const {
      title,
      company,
      location,
      salary,
      description,
      addedBy,
      contactEmail,
      contactPhone,
    } = req.body;

    // Check for missing fields
    if (!title) {
      console.log('Missing: title');
      return res.status(400).json({ message: 'Missing required job field: title' });
    }
    if (!company) {
      console.log('Missing: company');
      return res.status(400).json({ message: 'Missing required job field: company' });
    }
    if (!location) {
      console.log('Missing: location');
      return res.status(400).json({ message: 'Missing required job field: location' });
    }
    if (!salary) {
      console.log('Missing: salary');
      return res.status(400).json({ message: 'Missing required job field: salary' });
    }
    if (!description) {
      console.log('Missing: description');
      return res.status(400).json({ message: 'Missing required job field: description' });
    }
    if (!addedBy) {
      console.log('Missing: addedBy');
      return res.status(400).json({ message: 'Missing required job field: addedBy' });
    }

    const jobs = app.locals.db.collection('add-jobs');
    const newJob = {
      title,
      company,
      location,
      salary,
      description,
      addedBy,
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Inserting job into database:', JSON.stringify(newJob, null, 2));
    const insertResult = await jobs.insertOne(newJob);
    console.log('Job inserted successfully with ID:', insertResult.insertedId);
    
    const saved = await jobs.findOne({ _id: insertResult.insertedId });
    console.log('Job retrieved from database:', JSON.stringify(saved, null, 2));
    
    res.status(201).json({ id: saved._id.toString(), ...saved, _id: undefined });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Unable to create job', error: error.message });
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const { status, addedBy } = req.query;
    const jobs = app.locals.db.collection('add-jobs');
    const query = {};

    if (status) {
      query.status = status;
    }

    if (addedBy) {
      query.addedBy = addedBy;
    }

    const results = await jobs.find(query).toArray();
    const formatted = results.map((job) => ({
      id: job._id.toString(),
      ...job,
      _id: undefined,
    }));
    res.json(formatted);
  } catch (error) {
    console.error('Fetch jobs error:', error);
    res.status(500).json({ message: 'Unable to fetch jobs', error: error.message });
  }
});

app.put('/api/jobs/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const jobs = app.locals.db.collection('add-jobs');
    const updateResult = await jobs.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'approved',
          approvedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!updateResult.value) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const approvedJob = updateResult.value;
    res.json({ id: approvedJob._id.toString(), ...approvedJob, _id: undefined });
  } catch (error) {
    console.error('Approve job error:', error);
    res.status(500).json({ message: 'Unable to approve job', error: error.message });
  }
});

app.put('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const jobs = app.locals.db.collection('add-jobs');
    const updateData = { ...req.body };
    delete updateData._id; // Remove _id from update data

    const updateResult = await jobs.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job updated successfully' });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Unable to update job', error: error.message });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const jobs = app.locals.db.collection('add-jobs');
    const deleteResult = await jobs.deleteOne({ _id: new ObjectId(id) });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Unable to delete job', error: error.message });
  }
});

module.exports = app;
