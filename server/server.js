import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const SEED_PATH = path.join(__dirname, 'data', 'seedData.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to read DB
const readDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      if (fs.existsSync(SEED_PATH)) {
        const seed = fs.readFileSync(SEED_PATH, 'utf-8');
        fs.writeFileSync(DB_PATH, seed, 'utf-8');
      } else {
        return { settings: {}, users: [], projects: [], properties: [], gallery: [], enquiries: [] };
      }
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database:', err);
    return { settings: {}, users: [], projects: [], properties: [], gallery: [], enquiries: [] };
  }
};

// Helper to write DB
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database:', err);
    return false;
  }
};

// --- HEALTH & STATS ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/stats', (req, res) => {
  const db = readDB();
  const totalProjects = db.projects?.length || 0;
  const ongoingProjects = db.projects?.filter(p => p.status === 'ongoing').length || 0;
  const readyProjects = db.projects?.filter(p => p.status === 'ready').length || 0;
  const upcomingProjects = db.projects?.filter(p => p.status === 'upcoming').length || 0;
  
  const totalHomes = db.projects?.reduce((acc, p) => acc + (Number(p.totalHomes) || 0), 0) || 0;
  const availableHomes = db.properties?.filter(h => h.status === 'available').length || 0;
  const holdHomes = db.properties?.filter(h => h.status === 'hold').length || 0;
  const soldHomes = db.properties?.filter(h => h.status === 'sold').length || 0;

  const totalEnquiries = db.enquiries?.length || 0;
  const newEnquiries = db.enquiries?.filter(e => e.status === 'new').length || 0;
  const siteVisits = db.enquiries?.filter(e => e.status === 'site_visit').length || 0;
  const convertedLeads = db.enquiries?.filter(e => e.status === 'converted').length || 0;

  res.json({
    totalProjects,
    ongoingProjects,
    readyProjects,
    upcomingProjects,
    totalHomes,
    availableHomes,
    holdHomes,
    soldHomes,
    totalEnquiries,
    newEnquiries,
    siteVisits,
    convertedLeads
  });
});

// --- SETTINGS (About Us, Company Info, Contact) ---
app.get('/api/settings', (req, res) => {
  const db = readDB();
  res.json(db.settings || {});
});

app.put('/api/settings', (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  res.json({ success: true, settings: db.settings });
});

// --- AUTH & USERS ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const inputLower = (email || '').trim().toLowerCase();
  const user = db.users?.find(u => 
    (u.email?.toLowerCase() === inputLower || 
     u.username?.toLowerCase() === inputLower || 
     (inputLower === 'admin' && u.role === 'Super Admin')) && 
    u.password === password
  );
  
  if (user) {
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser, token: 'demo-jwt-token-' + user.id });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

app.get('/api/users', (req, res) => {
  const db = readDB();
  const safeUsers = (db.users || []).map(({ password, ...u }) => u);
  res.json(safeUsers);
});

app.post('/api/users', (req, res) => {
  const db = readDB();
  const newUser = {
    id: 'usr-' + Date.now(),
    name: req.body.name || 'Staff Member',
    email: req.body.email,
    password: req.body.password || 'welcome123',
    role: req.body.role || 'Editor',
    avatar: req.body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    createdAt: new Date().toISOString().split('T')[0]
  };
  db.users.push(newUser);
  writeDB(db);
  const { password: _, ...safe } = newUser;
  res.status(201).json(safe);
});

// --- PROJECTS ---
app.get('/api/projects', (req, res) => {
  const db = readDB();
  let projects = db.projects || [];
  if (req.query.status) {
    projects = projects.filter(p => p.status === req.query.status);
  }
  res.json(projects);
});

app.get('/api/projects/:id', (req, res) => {
  const db = readDB();
  const project = db.projects?.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  
  const properties = (db.properties || []).filter(h => h.projectId === req.params.id);
  res.json({ ...project, properties });
});

app.post('/api/projects', (req, res) => {
  const db = readDB();
  const newProject = {
    id: 'proj-' + Date.now(),
    name: req.body.name || 'New Landmark Project',
    nameHi: req.body.nameHi || req.body.name || 'नया प्रोजेक्ट',
    tagline: req.body.tagline || 'Modern Residential Living',
    status: req.body.status || 'ongoing',
    statusLabel: req.body.status === 'ready' ? 'Ready to Move' : req.body.status === 'upcoming' ? 'Upcoming Launch' : req.body.status === 'sold_out' ? 'Sold Out' : 'Ongoing Construction',
    location: req.body.location || 'Jaipur, Rajasthan',
    city: req.body.city || 'Jaipur, Rajasthan',
    totalHomes: Number(req.body.totalHomes) || 20,
    availableHomes: Number(req.body.availableHomes) || 20,
    soldHomes: Number(req.body.soldHomes) || 0,
    startingPrice: req.body.startingPrice || '₹45.0 Lakhs',
    startingPriceVal: Number(req.body.startingPriceVal) || 4500000,
    possessionDate: req.body.possessionDate || 'December 2027',
    reraNumber: req.body.reraNumber || 'Applied',
    totalArea: req.body.totalArea || '3.5 Acres',
    configurations: req.body.configurations || ['2 BHK', '3 BHK'],
    heroImage: req.body.heroImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    galleryImages: req.body.galleryImages || [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    description: req.body.description || 'Modern architecture with state-of-the-art facilities.',
    features: req.body.features || [
      { icon: 'Building', title: 'Modern Architecture', titleHi: 'आधुनिक आर्किटेक्चर' },
      { icon: 'Car', title: 'Covered Parking', titleHi: 'कार पार्किंग' },
      { icon: 'ShieldCheck', title: '24x7 Security', titleHi: '24x7 सुरक्षा' }
    ],
    constructionProgress: req.body.constructionProgress || {
      percentage: 10,
      currentStageTitle: 'Site Work Started',
      currentStageHi: 'साइट कार्य शुरू',
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      stages: [
        { id: 's1', name: 'Foundation Work', nameHi: 'नींव कार्य', status: 'running', progress: 50, date: 'Current' },
        { id: 's2', name: 'Structure Work', nameHi: 'स्ट्रक्चर कार्य', status: 'pending', progress: 0, date: 'Upcoming' },
        { id: 's3', name: 'Finishing & Handover', nameHi: 'फिनिशिंग व पजेशन', status: 'pending', progress: 0, date: 'Upcoming' }
      ],
      monthlyUpdates: []
    },
    locationDetails: req.body.locationDetails || {
      mapEmbedUrl: 'https://maps.google.com/maps?q=Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed',
      address: req.body.location || 'Jaipur',
      distances: [
        { place: 'Main Highway', placeHi: 'मुख्य हाईवे', distance: '1.5 km', time: '3 mins' },
        { place: 'Railway Station', placeHi: 'रेलवे स्टेशन', distance: '5.0 km', time: '12 mins' }
      ]
    },
    houseModels: req.body.houseModels || [
      {
        id: 'hm-' + Date.now(),
        type: '2 BHK',
        carpetArea: '1,150 sq.ft.',
        superArea: '1,380 sq.ft.',
        price: req.body.startingPrice || '₹45.0 Lakhs',
        priceNum: Number(req.body.startingPriceVal) || 4500000,
        bedrooms: 2,
        bathrooms: 2,
        balconies: 2,
        features: ['Modular Kitchen', 'Vastu Compliant'],
        floorPlanImg: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
      }
    ]
  };

  db.projects.push(newProject);
  writeDB(db);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const db = readDB();
  const index = db.projects.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Project not found' });
  
  db.projects[index] = { ...db.projects[index], ...req.body };
  writeDB(db);
  res.json(db.projects[index]);
});

app.delete('/api/projects/:id', (req, res) => {
  const db = readDB();
  const projectId = req.params.id;
  
  // 1. Remove project
  db.projects = (db.projects || []).filter(p => p.id !== projectId);
  
  // 2. Cascade remove all properties/houses belonging to this project
  db.properties = (db.properties || []).filter(p => p.projectId !== projectId);
  
  // 3. Cascade remove gallery items belonging to this project
  db.gallery = (db.gallery || []).filter(g => g.projectId !== projectId);
  
  writeDB(db);
  console.log(`Cascade deleted project ${projectId} and all its associated units/media.`);
  res.json({ success: true, message: 'Project and associated units deleted permanently' });
});

// Post quick construction update
app.post('/api/projects/:id/progress-update', (req, res) => {
  const db = readDB();
  const project = db.projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const { percentage, currentStageTitle, currentStageHi, updateTitle, description, photo, videoUrl } = req.body;

  if (percentage !== undefined) project.constructionProgress.percentage = Number(percentage);
  if (currentStageTitle) project.constructionProgress.currentStageTitle = currentStageTitle;
  if (currentStageHi) project.constructionProgress.currentStageHi = currentStageHi;
  
  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  project.constructionProgress.lastUpdated = todayStr;

  if (updateTitle || description || photo) {
    const newUpdate = {
      id: 'up-' + Date.now(),
      date: todayStr,
      monthTitle: updateTitle || 'Construction Progress Update',
      description: description || '',
      descriptionHi: description || '',
      photo: photo || project.heroImage,
      videoUrl: videoUrl || ''
    };
    if (!project.constructionProgress.monthlyUpdates) project.constructionProgress.monthlyUpdates = [];
    project.constructionProgress.monthlyUpdates.unshift(newUpdate);
  }

  writeDB(db);
  res.json(project);
});

// --- PROPERTIES / INDIVIDUAL HOUSES ---
app.get('/api/properties', (req, res) => {
  const db = readDB();
  let properties = db.properties || [];
  
  if (req.query.projectId) {
    properties = properties.filter(p => p.projectId === req.query.projectId);
  }
  if (req.query.status) {
    properties = properties.filter(p => p.status === req.query.status);
  }
  if (req.query.bhk) {
    properties = properties.filter(p => p.bhk.includes(req.query.bhk));
  }
  
  res.json(properties);
});

app.get('/api/properties/:id', (req, res) => {
  const db = readDB();
  const property = db.properties?.find(p => p.id === req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json(property);
});

app.post('/api/properties', (req, res) => {
  const db = readDB();
  const project = db.projects?.find(p => p.id === req.body.projectId);
  
  const newProperty = {
    id: 'prop-' + Date.now(),
    houseNo: req.body.houseNo || ('Unit-' + Math.floor(Math.random() * 900 + 100)),
    projectId: req.body.projectId || (project ? project.id : 'proj-1'),
    projectName: project ? project.name : (req.body.projectName || 'Aadya Residency'),
    bhk: req.body.bhk || '3 BHK',
    type: req.body.type || 'Luxury Apartment',
    area: req.body.area || '1,450 sq.ft.',
    price: req.body.price || '₹55.0 Lakhs',
    priceVal: Number(req.body.priceVal) || 5500000,
    floor: req.body.floor || '2nd Floor',
    facing: req.body.facing || 'East Facing',
    status: req.body.status || 'available',
    statusLabel: req.body.status === 'sold' ? 'Sold Out' : req.body.status === 'hold' ? 'On Hold' : 'Available',
    features: req.body.features || ['Modular Kitchen', 'Balcony', 'Covered Parking'],
    image: req.body.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    floorPlan: req.body.floorPlan || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
  };

  db.properties.push(newProperty);
  
  if (project) {
    project.availableHomes = db.properties.filter(p => p.projectId === project.id && p.status === 'available').length;
    project.soldHomes = db.properties.filter(p => p.projectId === project.id && p.status === 'sold').length;
  }

  writeDB(db);
  res.status(201).json(newProperty);
});

app.put('/api/properties/:id', (req, res) => {
  const db = readDB();
  const index = db.properties.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Property not found' });

  const updated = { ...db.properties[index], ...req.body };
  if (req.body.status) {
    updated.statusLabel = req.body.status === 'sold' ? 'Sold Out' : req.body.status === 'hold' ? 'On Hold' : 'Available';
  }
  db.properties[index] = updated;

  const project = db.projects?.find(p => p.id === updated.projectId);
  if (project) {
    project.availableHomes = db.properties.filter(p => p.projectId === project.id && p.status === 'available').length;
    project.soldHomes = db.properties.filter(p => p.projectId === project.id && p.status === 'sold').length;
  }

  writeDB(db);
  res.json(updated);
});

app.delete('/api/properties/:id', (req, res) => {
  const db = readDB();
  const prop = db.properties.find(p => p.id === req.params.id);
  db.properties = db.properties.filter(p => p.id !== req.params.id);
  
  if (prop) {
    const project = db.projects?.find(p => p.id === prop.projectId);
    if (project) {
      project.availableHomes = db.properties.filter(p => p.projectId === project.id && p.status === 'available').length;
      project.soldHomes = db.properties.filter(p => p.projectId === project.id && p.status === 'sold').length;
    }
  }

  writeDB(db);
  res.json({ success: true, message: 'Property deleted' });
});

// --- GALLERY ---
app.get('/api/gallery', (req, res) => {
  const db = readDB();
  let gallery = db.gallery || [];
  if (req.query.category && req.query.category !== 'all') {
    gallery = gallery.filter(g => g.category === req.query.category);
  }
  if (req.query.projectId) {
    gallery = gallery.filter(g => g.projectId === req.query.projectId);
  }
  res.json(gallery);
});

app.post('/api/gallery', (req, res) => {
  const db = readDB();
  const project = db.projects?.find(p => p.id === req.body.projectId);

  const newItem = {
    id: 'gal-' + Date.now(),
    title: req.body.title || 'Site Photograph',
    titleHi: req.body.titleHi || req.body.title || 'साइट फोटो',
    type: req.body.type || 'photo',
    category: req.body.category || 'construction',
    projectId: req.body.projectId || '',
    projectName: project ? project.name : (req.body.projectName || 'General Site'),
    url: req.body.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    videoUrl: req.body.videoUrl || '',
    date: req.body.date || new Date().toISOString().split('T')[0]
  };

  db.gallery.unshift(newItem);
  writeDB(db);
  res.status(201).json(newItem);
});

app.delete('/api/gallery/:id', (req, res) => {
  const db = readDB();
  db.gallery = db.gallery.filter(g => g.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// --- ENQUIRIES & LEADS CRM ---
app.get('/api/enquiries', (req, res) => {
  const db = readDB();
  let enquiries = db.enquiries || [];
  if (req.query.status && req.query.status !== 'all') {
    enquiries = enquiries.filter(e => e.status === req.query.status);
  }
  res.json(enquiries);
});

app.post('/api/enquiries', (req, res) => {
  const db = readDB();
  const project = db.projects?.find(p => p.id === req.body.projectId);

  const newEnquiry = {
    id: 'enq-' + Date.now(),
    name: req.body.name || 'Visitor',
    phone: req.body.phone || '',
    email: req.body.email || '',
    projectId: req.body.projectId || '',
    projectName: project ? project.name : (req.body.projectName || 'General Enquiry'),
    propertyType: req.body.propertyType || '3 BHK',
    budget: req.body.budget || '₹50 - 75 Lakhs',
    preferredVisitDate: req.body.preferredVisitDate || '',
    message: req.body.message || '',
    status: 'new',
    statusLabel: 'New Enquiry',
    notes: '',
    createdAt: new Date().toISOString()
  };

  db.enquiries.unshift(newEnquiry);
  writeDB(db);
  res.status(201).json({ success: true, enquiry: newEnquiry, message: 'Enquiry submitted successfully! Our team will contact you shortly.' });
});

app.put('/api/enquiries/:id', (req, res) => {
  const db = readDB();
  const index = db.enquiries.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Enquiry not found' });

  const statusLabels = {
    new: 'New Enquiry',
    contacted: 'Contacted (Call Done)',
    site_visit: 'Site Visit Scheduled',
    follow_up: 'Follow-Up In Progress',
    converted: 'Converted / Booked 🎉',
    closed: 'Closed / Not Interested'
  };

  const updated = { ...db.enquiries[index], ...req.body };
  if (req.body.status && statusLabels[req.body.status]) {
    updated.statusLabel = statusLabels[req.body.status];
  }

  db.enquiries[index] = updated;
  writeDB(db);
  res.json(updated);
});

app.delete('/api/enquiries/:id', (req, res) => {
  const db = readDB();
  db.enquiries = db.enquiries.filter(e => e.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Enquiry deleted' });
});

// --- RESET DB TO SEED ---
app.post('/api/reset-db', (req, res) => {
  try {
    const seed = fs.readFileSync(SEED_PATH, 'utf-8');
    fs.writeFileSync(DB_PATH, seed, 'utf-8');
    res.json({ success: true, message: 'Database reset to default seed data successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// --- SERVE CLIENT BUILD IN PRODUCTION ---
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {

  console.log("Server running on port " + PORT);
});
