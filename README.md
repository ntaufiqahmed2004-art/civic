<p align="center">
  <h1 align="center">🏙️ CivicFix</h1>
  <p align="center">
    <strong>Scan. Report. Fixed.</strong><br/>
    AI-powered civic issue reporting platform that helps citizens and authorities build better neighborhoods together.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Spring%20Boot-4.0-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Gemini%20AI-1.5%20Flash-8E75B2?logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [User Roles & Workflows](#-user-roles--workflows)
- [AI Integration](#-ai-integration)
- [Screenshots](#-screenshots)
- [Team](#-team)

---

## 🌟 Overview

**CivicFix** is a full-stack web application that streamlines the process of reporting and resolving civic issues such as potholes, broken streetlights, garbage dumping, and damaged public infrastructure. It leverages **Google Gemini AI** for intelligent image analysis — automatically verifying submitted photos, detecting privacy concerns (human faces), and generating issue descriptions.

The platform supports three user types:
- **Guests** — can quickly report issues without creating an account
- **Citizens** — registered users who can track their report history
- **Admins** — municipal department officials who review, manage, and resolve complaints

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **AI-Powered Verification** | Every uploaded image is analyzed by Gemini AI to confirm it depicts a genuine civic issue |
| 🔒 **Privacy Protection** | AI automatically rejects images containing human faces to protect citizen privacy |
| ✨ **AI Description Suggestion** | One-click AI-generated description of the civic issue from the uploaded photo |
| 📍 **Auto Location Detection** | Browser geolocation with reverse geocoding to automatically detect the reporter's city |
| 👤 **Guest Quick Reporting** | Report issues instantly without registration |
| 📊 **Admin Dashboard** | Department-filtered views with status management (Not Reviewed → Reviewed → Resolved) |
| 📈 **Citizen Dashboard** | Personal report history with real-time status tracking |
| 🗺️ **Google Maps Integration** | Embedded map view for each complaint location in the admin detail modal |
| 📁 **Image Upload & Storage** | Local file storage for complaint images served via static resource mapping |

---

## 🏗️ Architecture

```
┌─────────────────────┐         HTTP/REST          ┌─────────────────────────┐
│                     │ ◄──────────────────────────►│                         │
│   React Frontend    │    (Axios, Port 5173)       │   Spring Boot Backend   │
│   (Vite + React 19) │                             │   (Port 8080)           │
│                     │                             │                         │
└─────────────────────┘                             └────────┬────────────────┘
                                                             │
                                                    ┌────────┼────────────────┐
                                                    │        │                │
                                               ┌────▼───┐ ┌─▼──────────┐ ┌───▼──────────┐
                                               │ MySQL  │ │ Gemini AI  │ │ File Storage │
                                               │  DB    │ │ (Google)   │ │ (C:/CIVIC/   │
                                               │        │ │            │ │  uploads/)   │
                                               └────────┘ └────────────┘ └──────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2 | UI library |
| **Vite** | 7.x | Build tool & dev server |
| **Axios** | 1.13 | HTTP client for API calls |
| **Lucide React** | 0.575 | Icon library |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Spring Boot** | 4.0.3 | Application framework |
| **Spring Data JPA** | — | ORM & database access |
| **MySQL Connector** | — | Database driver |
| **Lombok** | — | Boilerplate code reduction |
| **Google Gemini AI** | 1.5 Flash | Image analysis & verification |

### Database
| Technology | Purpose |
|---|---|
| **MySQL** | Relational database for users & complaints |

---

## 📁 Project Structure

```
CIVIC/
├── backend/
│   └── civic/                          # Spring Boot project root
│       ├── pom.xml                     # Maven dependencies
│       ├── mvnw / mvnw.cmd            # Maven wrapper
│       └── src/main/
│           ├── java/com/devopstitans/civic/
│           │   ├── CivicApplication.java         # Main entry point
│           │   ├── config/
│           │   │   └── WebConfig.java            # Static resource mapping (/uploads)
│           │   ├── controller/
│           │   │   ├── AuthController.java       # Login & Registration endpoints
│           │   │   └── ComplaintController.java   # Complaint CRUD & AI endpoints
│           │   ├── model/
│           │   │   ├── User.java                 # User entity (CITIZEN/ADMIN roles)
│           │   │   └── Complaint.java            # Complaint entity
│           │   ├── repository/
│           │   │   ├── UserRepository.java       # User data access
│           │   │   └── ComplaintRepository.java  # Complaint data access (with filtering)
│           │   └── service/
│           │       ├── GeminiService.java         # Gemini AI integration
│           │       └── ImageAnalysisService.java  # Image analysis via Gemini AI
│           └── resources/
│               └── application.properties        # App config (DB, file upload, API key)
│
├── frontend/
│   ├── index.html                      # HTML entry point
│   ├── package.json                    # NPM dependencies
│   ├── vite.config.js                  # Vite configuration
│   └── src/
│       ├── main.jsx                    # React entry point
│       ├── App.jsx                     # Root component & routing logic
│       ├── App.css                     # Global app styles
│       ├── index.css                   # Base CSS styles
│       ├── constants.js                # Department list constants
│       ├── utils/
│       │   └── locationHelper.js       # Browser geolocation & reverse geocoding
│       └── pages/
│           ├── LandingPage.jsx         # Public homepage
│           ├── LoginPage.jsx           # User login form
│           ├── RegisterPage.jsx        # User registration form
│           ├── RegisterPage.css        # Registration page styles
│           ├── ReportPage.jsx          # Issue reporting form (Guest & Citizen)
│           ├── ReportPage.css          # Report page styles
│           ├── AdminDashboard.jsx      # Admin complaint management
│           ├── AdminDashboard.css      # Admin dashboard styles
│           ├── CitizenDashboard.jsx    # Citizen report history
│           └── CitizenDashboard.css    # Citizen dashboard styles
│
├── uploads/                            # Uploaded complaint images
└── README.md                           # This file
```

---

## 📦 Prerequisites

Before running CivicFix, make sure you have the following installed:

| Requirement | Version | Download |
|---|---|---|
| **Java JDK** | 17+ | [Download](https://adoptium.net/) |
| **Node.js** | 18+ | [Download](https://nodejs.org/) |
| **MySQL** | 8.x | [Download](https://dev.mysql.com/downloads/) |
| **Maven** | 3.9+ | (included via `mvnw` wrapper) |
| **Google Gemini API Key** | — | [Get API Key](https://aistudio.google.com/app/apikey) |

---

## 🚀 Getting Started

### 1. Database Setup

Create the MySQL database:

```sql
CREATE DATABASE civicfix_db;
```

> The tables (`users`, `complaints`) are auto-created by Spring Boot JPA on first run (`ddl-auto=update`).

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend/civic

# Set the Gemini API key as an environment variable
# Windows (PowerShell):
$env:GEMINI_API_KEY_ENV="your-gemini-api-key-here"

# Windows (CMD):
set GEMINI_API_KEY_ENV=your-gemini-api-key-here

# Linux / macOS:
export GEMINI_API_KEY_ENV=your-gemini-api-key-here

# Run the Spring Boot application
./mvnw spring-boot:run
```

The backend server will start at **http://localhost:8080**.

> **Note:** Update `application.properties` if your MySQL credentials differ from the defaults (`root` / `taufiq123`).

### 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend dev server will start at **http://localhost:5173**.

---

## 🔐 Environment Variables

| Variable | Location | Description |
|---|---|---|
| `GEMINI_API_KEY_ENV` | System Environment | Google Gemini API key for AI image analysis |
| `spring.datasource.url` | `application.properties` | MySQL connection URL |
| `spring.datasource.username` | `application.properties` | MySQL username |
| `spring.datasource.password` | `application.properties` | MySQL password |
| `file.upload-dir` | `application.properties` | Directory path for uploaded images |

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | `{ name, email, password, department, location, role }` |
| `POST` | `/api/auth/login` | Login with credentials | `{ email, password }` |

### Complaints

| Method | Endpoint | Description | Parameters |
|---|---|---|---|
| `GET` | `/api/complaints/all` | Get all complaints (with optional filters) | `?department=Roads&city=Coimbatore` |
| `POST` | `/api/complaints/submit` | Submit a new complaint | `multipart/form-data`: `email`, `description`, `department`, `location`, `image` |
| `POST` | `/api/complaints/describe` | Get AI-generated description for an image | `multipart/form-data`: `image` |
| `PUT` | `/api/complaints/{id}/status` | Update complaint status | `?status=REVIEWED` or `?status=RESOLVED` |

### Static Resources

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/uploads/{filename}` | Serve uploaded complaint images |

---

## 👥 User Roles & Workflows

### 🚀 Guest Flow
1. Visit the landing page → Click **"Quick Report (Guest)"**
2. Fill in email, select department, detect location, upload photo
3. Optionally click **"✨ AI Suggest Description"** to auto-generate a description
4. Submit → AI verifies the image → Complaint is registered

### 🧑 Citizen Flow
1. **Register** with name, email, password, location, and role `CITIZEN`
2. **Login** → Redirected to **Citizen Dashboard**
3. View personal report history with status tracking
4. Submit new reports via the embedded report form
5. Track status: `NOT_REVIEWED` → `REVIEWED` → `RESOLVED`

### 🛡️ Admin Flow
1. **Register** with name, email, password, department (e.g., `Roads`), location, and role `ADMIN`
2. **Login** → Redirected to **Admin Dashboard**
3. View complaints filtered by **department** and **city**
4. Navigate between tabs: **Not Reviewed** | **Reviewed** | **Resolved**
5. Click a complaint card → View details with photo, description, and embedded Google Map
6. Update complaint status from the detail modal

---

## 🤖 AI Integration

CivicFix uses **Google Gemini 1.5 Flash** for intelligent image analysis. The AI performs three critical checks on every submitted image:

```
                    ┌─────────────────┐
                    │  Image Uploaded  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Gemini AI      │
                    │  Analysis       │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───────┐ ┌───▼────────┐ ┌───▼──────────────┐
     │ PRIVACY_ERROR  │ │   VALID    │ │ NOT_CIVIC_ISSUE  │
     │ (Human face    │ │ (Genuine   │ │ (Unrelated       │
     │  detected)     │ │  civic     │ │  image)          │
     │                │ │  issue)    │ │                  │
     │ → Rejected ❌  │ │ → Accepted │ │ → Rejected ❌    │
     │ Image deleted  │ │ + AI Desc  │ │ Image deleted    │
     └────────────────┘ └────────────┘ └──────────────────┘
```

### AI Prompt Engineering

The Gemini API is prompted to act as a **civic authority inspector** with strict rules:
1. **Privacy Gate** — If a human face is in the foreground, respond with `PRIVACY_ERROR`
2. **Validity Gate** — If the image shows a civic issue (pothole, trash, damage, etc.), respond with `VALID | [description]`
3. **Rejection** — For all non-civic images, respond with `NOT_CIVIC_ISSUE`

---

## 🖼️ Screenshots

> *Screenshots can be added here showing:*
> - Landing Page
> - Guest Report Form with AI suggestion
> - Citizen Dashboard
> - Admin Dashboard with complaint cards
> - Admin Detail Modal with Google Maps embed

---

## 📂 Supported Departments

The following civic departments are supported out of the box:

- 🛣️ **Roads**
- 🧹 **Sanitation**
- ⚡ **Electricity**
- 💧 **Water Supply**
- 🌳 **Public Parks**

---

## ⚙️ Configuration Notes

- **CORS**: The backend allows cross-origin requests from `http://localhost:5173` (Vite dev server)
- **File Upload Limit**: Maximum file size is `10MB` per image
- **Image Storage**: Images are stored locally at `C:/CIVIC/uploads/` and served at `/uploads/**`
- **Database DDL**: Set to `update` mode — tables are auto-created/updated on startup
- **Password Storage**: Currently uses plain text (intended for hackathon use). **Use BCrypt for production.**

---

## 🛣️ Roadmap

- [ ] Password hashing with BCrypt
- [ ] JWT-based authentication
- [ ] Real-time notifications for status updates
- [ ] Admin analytics dashboard with charts
- [ ] Mobile-responsive PWA support
- [ ] Email notifications on complaint status change
- [ ] Geospatial proximity filtering (5km radius)

---

## 👨‍💻 Team

**DevOps Titans** (`com.devopstitans`)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <strong>Built with ❤️ by DevOps Titans</strong><br/>
  <em>Helping citizens and authorities build better neighborhoods together.</em>
</p>
