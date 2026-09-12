import { initialData } from './seedData';

const API_BASE = import.meta.env.VITE_API_URL || 'https://hariom-adku.onrender.com/api';
const LOCAL_DB_KEY = 'kumawat_homes_db';

// Initialize LocalStorage database if not present
function getLocalDB() {
  try {
    const raw = localStorage.getItem(LOCAL_DB_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(initialData));
      return JSON.parse(JSON.stringify(initialData));
    }
    return JSON.parse(raw);
  } catch (e) {
    return JSON.parse(JSON.stringify(initialData));
  }
}

function saveLocalDB(db) {
  try {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

async function fetchJSON(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  
  const token = localStorage.getItem('agy_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
    
    // Check if response is valid JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Non-JSON response from ${url}`);
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (err) {
    // If backend is not available (e.g. static Vercel deployment), fall back to LocalStorage DB
    console.warn(`Backend API unavailable for ${url}. Using local browser storage fallback.`, err.message);
    return handleLocalFallback(url, options);
  }
}

function handleLocalFallback(url, options = {}) {
  const db = getLocalDB();
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};
  const [path, queryString] = url.split('?');
  const params = new URLSearchParams(queryString || '');

  // 1. STATS
  if (path === '/stats' && method === 'GET') {
    const totalProjects = db.projects?.length || 0;
    const ongoingProjects = db.projects?.filter(p => p.status === 'ongoing').length || 0;
    const readyProjects = db.projects?.filter(p => p.status === 'ready').length || 0;
    const upcomingProjects = db.projects?.filter(p => p.status === 'upcoming').length || 0;
    const totalHomes = db.projects?.reduce((acc, p) => acc + (Number(p.totalHomes) || 0), 0) || 0;
    const availableHomes = db.properties?.filter(p => p.status === 'available').length || 0;
    const soldHomes = db.properties?.filter(p => p.status === 'sold').length || 0;
    const totalEnquiries = db.enquiries?.length || 0;
    const newEnquiries = db.enquiries?.filter(e => e.status === 'new').length || 0;
    return {
      totalProjects, ongoingProjects, readyProjects, upcomingProjects,
      totalHomes, availableHomes, soldHomes, totalEnquiries, newEnquiries
    };
  }

  // 2. SETTINGS
  if (path === '/settings') {
    if (method === 'GET') return db.settings || {};
    if (method === 'PUT') {
      db.settings = { ...db.settings, ...body };
      saveLocalDB(db);
      return db.settings;
    }
  }

  // 3. AUTH & LOGIN
  if (path === '/auth/login' && method === 'POST') {
    const { email, password } = body;
    const user = (db.users || []).find(u => u.email?.toLowerCase() === email?.toLowerCase() || u.username?.toLowerCase() === email?.toLowerCase() || (email?.toLowerCase() === 'admin' && u.role === 'Super Admin'));
    if (!user || user.password !== password) {
      throw new Error('गलत ईमेल या पासवर्ड (Invalid email or password)');
    }
    const token = 'token_' + Date.now();
    return {
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    };
  }

  // 4. USERS
  if (path === '/users') {
    if (method === 'GET') {
      return (db.users || []).map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, avatar: u.avatar }));
    }
    if (method === 'POST') {
      const newUser = { id: 'usr-' + Date.now(), ...body, createdAt: new Date().toISOString() };
      db.users.push(newUser);
      saveLocalDB(db);
      return newUser;
    }
  }

  // 5. PROJECTS
  if (path === '/projects') {
    if (method === 'GET') {
      const status = params.get('status');
      let projs = db.projects || [];
      if (status) projs = projs.filter(p => p.status === status);
      return projs;
    }
    if (method === 'POST') {
      const newProj = { id: 'proj-' + Date.now(), ...body };
      db.projects.push(newProj);
      saveLocalDB(db);
      return newProj;
    }
  }

  if (path.startsWith('/projects/')) {
    const projId = path.split('/')[2];
    if (method === 'GET') {
      const p = db.projects?.find(x => x.id === projId);
      if (!p) throw new Error('Project not found');
      return p;
    }
    if (method === 'PUT') {
      const idx = db.projects.findIndex(x => x.id === projId);
      if (idx !== -1) {
        db.projects[idx] = { ...db.projects[idx], ...body };
        saveLocalDB(db);
        return db.projects[idx];
      }
    }
    if (method === 'DELETE') {
      db.projects = db.projects.filter(x => x.id !== projId);
      db.properties = db.properties.filter(x => x.projectId !== projId);
      db.gallery = db.gallery.filter(x => x.projectId !== projId);
      saveLocalDB(db);
      return { success: true, message: 'Project deleted' };
    }
  }

  // 6. PROPERTIES
  if (path === '/properties') {
    if (method === 'GET') {
      let props = db.properties || [];
      const projectId = params.get('projectId');
      const status = params.get('status');
      if (projectId) props = props.filter(p => p.projectId === projectId);
      if (status) props = props.filter(p => p.status === status);
      return props;
    }
    if (method === 'POST') {
      const newProp = { id: 'prop-' + Date.now(), ...body };
      db.properties.push(newProp);
      saveLocalDB(db);
      return newProp;
    }
  }

  if (path.startsWith('/properties/')) {
    const propId = path.split('/')[2];
    if (method === 'PUT') {
      const idx = db.properties.findIndex(x => x.id === propId);
      if (idx !== -1) {
        db.properties[idx] = { ...db.properties[idx], ...body };
        saveLocalDB(db);
        return db.properties[idx];
      }
    }
    if (method === 'DELETE') {
      db.properties = db.properties.filter(x => x.id !== propId);
      saveLocalDB(db);
      return { success: true, message: 'Property deleted' };
    }
  }

  // 7. GALLERY
  if (path === '/gallery') {
    if (method === 'GET') {
      let gal = db.gallery || [];
      const cat = params.get('category');
      const proj = params.get('projectId');
      if (cat) gal = gal.filter(g => g.category === cat);
      if (proj) gal = gal.filter(g => g.projectId === proj);
      return gal;
    }
    if (method === 'POST') {
      const newItem = { id: 'gal-' + Date.now(), ...body, date: 'Recent' };
      db.gallery.unshift(newItem);
      saveLocalDB(db);
      return newItem;
    }
  }

  if (path.startsWith('/gallery/')) {
    const galId = path.split('/')[2];
    if (method === 'DELETE') {
      db.gallery = db.gallery.filter(x => x.id !== galId);
      saveLocalDB(db);
      return { success: true, message: 'Media deleted' };
    }
  }

  // 8. ENQUIRIES / LEADS CRM
  if (path === '/enquiries') {
    if (method === 'GET') {
      let enqs = db.enquiries || [];
      const status = params.get('status');
      if (status) enqs = enqs.filter(e => e.status === status);
      return enqs;
    }
    if (method === 'POST') {
      const newEnq = {
        id: 'enq-' + Date.now(),
        ...body,
        status: 'new',
        statusLabel: 'New Enquiry',
        createdAt: new Date().toISOString()
      };
      db.enquiries.unshift(newEnq);
      saveLocalDB(db);
      return { success: true, enquiry: newEnq };
    }
  }

  if (path.startsWith('/enquiries/')) {
    const enqId = path.split('/')[2];
    if (method === 'PUT') {
      const idx = db.enquiries.findIndex(x => x.id === enqId);
      if (idx !== -1) {
        db.enquiries[idx] = { ...db.enquiries[idx], ...body };
        saveLocalDB(db);
        return db.enquiries[idx];
      }
    }
    if (method === 'DELETE') {
      db.enquiries = db.enquiries.filter(x => x.id !== enqId);
      saveLocalDB(db);
      return { success: true, message: 'Enquiry deleted' };
    }
  }

  // 9. RESET DB
  if (path === '/reset-db') {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(initialData));
    return { success: true, message: 'Database reset to default seed data' };
  }

  return {};
}

export const api = {
  // Stats & Settings
  getStats: () => fetchJSON('/stats'),
  getSettings: () => fetchJSON('/settings'),
  updateSettings: (data) => fetchJSON('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  resetDatabase: () => fetchJSON('/reset-db', { method: 'POST' }),

  // Auth & Users
  login: (email, password) => fetchJSON('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getUsers: () => fetchJSON('/users'),
  createUser: (data) => fetchJSON('/users', { method: 'POST', body: JSON.stringify(data) }),

  // Projects
  getProjects: (status) => fetchJSON(status ? `/projects?status=${status}` : '/projects'),
  getProjectById: (id) => fetchJSON(`/projects/${id}`),
  createProject: (data) => fetchJSON('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) => fetchJSON(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id) => fetchJSON(`/projects/${id}`, { method: 'DELETE' }),
  addProgressUpdate: (id, data) => fetchJSON(`/projects/${id}/progress-update`, { method: 'POST', body: JSON.stringify(data) }),

  // Properties / Units
  getProperties: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetchJSON(params ? `/properties?${params}` : '/properties');
  },
  getPropertyById: (id) => fetchJSON(`/properties/${id}`),
  createProperty: (data) => fetchJSON('/properties', { method: 'POST', body: JSON.stringify(data) }),
  updateProperty: (id, data) => fetchJSON(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProperty: (id) => fetchJSON(`/properties/${id}`, { method: 'DELETE' }),

  // Gallery
  getGallery: (category, projectId) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (projectId) params.append('projectId', projectId);
    return fetchJSON(params.toString() ? `/gallery?${params.toString()}` : '/gallery');
  },
  createGalleryItem: (data) => fetchJSON('/gallery', { method: 'POST', body: JSON.stringify(data) }),
  deleteGalleryItem: (id) => fetchJSON(`/gallery/${id}`, { method: 'DELETE' }),

  // Enquiries / Leads CRM
  getEnquiries: (status) => fetchJSON(status ? `/enquiries?status=${status}` : '/enquiries'),
  submitEnquiry: (data) => fetchJSON('/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  updateEnquiry: (id, data) => fetchJSON(`/enquiries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEnquiry: (id) => fetchJSON(`/enquiries/${id}`, { method: 'DELETE' })
};
