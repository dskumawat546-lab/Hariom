# 🏠 Aadya Dream Homes & Builders — Home Building Website & Admin CMS Portal

A complete, production-grade Real Estate Construction platform featuring a modern **Public Website** for homebuyers and a powerful **Admin Panel (CMS & CRM)** for managing projects, house inventory, live construction stages, photo/video gallery, customer enquiries, and site settings without code changes.

---

## 🌟 Quick Start Guide

### 1. Requirements
- Node.js (v18+)
- npm

### 2. Running the Application
The project is split into two lightweight services (Backend API + Frontend Client):

#### Backend Server (Express + JSON Database)
```bash
# Inside project root:
cd server
npm install
npm start
# Runs at http://localhost:5000
```

#### Frontend Client (React 18 + Vite + Tailwind CSS)
```bash
# Inside project root:
cd client
npm install
npm run dev
# Runs at http://localhost:3000
```

---

## 🔐 Admin Panel Credentials (`/admin/login`)

The system comes pre-configured with 3 role-based demo accounts (with convenient 1-click login buttons on the login screen):

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Super Admin** | `admin@aadyahomes.com` | `admin123` | Full Website & Settings Control, Users, CRM, Projects, Inventory |
| **Project Manager** | `manager@aadyahomes.com` | `manager123` | Projects, House Inventory, Construction Progress & Leads CRM |
| **Content Editor** | `editor@aadyahomes.com` | `editor123` | Gallery Photos/Videos, Construction Logs & Site Content |

---

## 🚀 Public Website Features (`http://localhost:3000`)

1. **🏠 Home Page (`/`)**:
   - Hero banner carousel with luxury project photography and quick CTA buttons.
   - Live stats counter: 15+ Years Trust, 15+ Projects Delivered, 100+ Happy Families, 4.8M+ Sq.ft.
   - Categorized project showcase (🟢 *Ongoing Construction*, 🔵 *Ready to Move*, 🟡 *Upcoming Launch*).
   - Featured ready-to-move homes with real-time availability badges.
   - Why Choose Us & Quality construction specifications.
   - Interactive Loan EMI Calculator.
   - Floating WhatsApp & Instant Call actions.

2. **🏢 Projects Catalog (`/projects`)**:
   - Filter by status, search by name/location, filter by BHK.
   - Project cards with live progress bars, available units counters, and starting prices.

3. **📄 Project Details Page (`/projects/:id`)**:
   - Detailed project overview (RERA number, possession date, total/available units, location address).
   - Tabbed House Models (2 BHK, 3 BHK, 4 BHK, Luxury Villas) with carpet area, super area, specifications, and **Interactive HD Floor Plan modal viewer**.
   - **Live Construction Progress Tracker**: Overall percentage bar, dynamic stage milestones (Foundation, Structure, Slab, Brickwork, MEP, Finishing, Handover) with badges (✅ Completed, 🔄 Running, ⏳ Pending), and monthly photo/video updates with supervisor notes.
   - **Location & Connectivity Section**: Interactive map and distance indicators to highway, railway station, airport, schools, hospitals, and markets.
   - Available Units in this Project table.
   - Schedule Site Visit & Enquiry form.
   - EMI Calculator with instant monthly breakdown.

4. **🔑 Ready-to-Move Homes (`/properties`)**:
   - Individual house inventory (House No., BHK, sq.ft., facing, floor, price, floor plan).
   - Real-time status tags: 🟢 *Available*, 🟡 *On Hold*, 🔴 *Sold Out*.

5. **🚧 Construction Updates Hub (`/construction-updates`)**:
   - Project-by-project timeline feed of monthly photo/video logs, progress %, and engineering statements.

6. **🖼️ Photo & Video Gallery (`/gallery`)**:
   - Categorized filters (Exterior, Interior, Construction, Completed, Drone/Walkthrough).
   - Fullscreen Lightbox modal with video player.

7. **📍 Strategic Location & Connectivity (`/location`)**:
   - Interactive project location finder and landmark distance matrix.

8. **ℹ️ About Us (`/about`)**:
   - Company heritage, Vision, Mission, Leadership team, and Founder's message.

9. **📞 Contact & Free Site Visit Booking (`/contact`)**:
   - Smart enquiry lead form, office address, map, direct call, and WhatsApp trigger.

---

## 🛠️ Admin CMS & CRM Features (`http://localhost:3000/admin`)

- **📊 Dashboard (`/admin`)**:
  - Live metric summary cards (Total Projects, Ongoing, Ready to Move, Available Homes, Sold Homes, Total Enquiries, New Leads).
  - Recent Enquiries CRM quick table with one-click WhatsApp/Call triggers.
  - Project health indicators.
  - Reset Demo Database button to easily restore sample seed data.

- **🏗️ Project Management (`/admin/projects`)**:
  - Add new project, edit details, change status, update starting price, total units, hero image, and description.
  - Delete project.

- **🏠 House / Unit Inventory Manager (`/admin/properties`)**:
  - Add individual house units (House No., BHK, Carpet area, Price, Facing, Floor, Floor plan).
  - Instant One-Click Status Changer: `Available` ➔ `On Hold` ➔ `Sold Out` — automatically syncs project availability numbers and updates the customer website immediately.

- **🚧 Construction Progress Manager (`/admin/progress`)**:
  - Select project, drag 0-100% completion slider.
  - Update current active stage in English & Hindi.
  - Toggle stage statuses (Foundation, Structure, Finishing).
  - Post new monthly construction update with photos, YouTube video embed, and engineer notes.

- **📩 Customer Leads & CRM Manager (`/admin/leads`)**:
  - List all enquiries submitted on public website with contact details, project interest, visit date, and customer message.
  - Pipeline Status dropdown (`New` ➔ `Contacted` ➔ `Site Visit Scheduled` ➔ `Follow-Up` ➔ `Converted` ➔ `Closed`).
  - Add internal follow-up remarks/notes.
  - Click-to-WhatsApp with prefilled personalized message.
  - Click-to-Call.
  - **Export All Leads to CSV**.

- **📸 Media Gallery Manager (`/admin/gallery`)**:
  - Add photos and videos with category and project tags.
  - Delete media items.

- **⚙️ Website Settings CMS (`/admin/settings`)**:
  - Edit Company Name, Tagline, Primary/Secondary Phone numbers, WhatsApp number, Email, Office Address, Mission, Vision, and Founder's statement.
  - Changes instantly appear across the entire public website without touching any code.

- **👥 Team & User Management (`/admin/users`)**:
  - Create new staff credentials and assign roles (Super Admin, Manager, Editor).

---

## 🗄️ Database Architecture (`server/data/db.json`)
The application uses a persistent, atomic JSON database with structured schemas for:
- `settings`: Site branding, contact info, vision/mission, stats counters.
- `users`: Admin and staff credentials and roles.
- `projects`: Project details, amenities, construction progress, stages, monthly logs, house models, and distances.
- `properties`: Unit-by-unit inventory with live status tags.
- `gallery`: Photos and videos categorized with project links.
- `enquiries`: Full customer lead CRM repository with pipeline stages and internal remarks.
