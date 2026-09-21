# 🌿 GreenBuddy — Intelligent Plant Management & Botanical AI Platform

**GreenBuddy** is a modern, full-stack botanical management web application that helps users monitor, diagnose, and care for their plants in one place. Powered by **React 19, Spring Boot, MySQL, and Botanical Machine Learning Intelligence**, GreenBuddy combines daily garden tracking with automated disease diagnosis, predictive watering algorithms, and an interactive AI care companion.

---

## ✨ Features

### 🩺 AI & Machine Learning Features
* **AI Plant Doctor & Disease Diagnostic Studio (`/ai-doctor`)**: Upload leaf photos or select symptoms (yellowing, brown tips, powdery mildew, pests, drooping) to receive instant disease diagnosis, severity scoring, pathogen identification, and organic home remedies (neem oil, cinnamon dusting, hydrogen peroxide flush).
* **Machine Learning Plant Vitality & Hydration Predictor**: An algorithmic vitality engine calculating real-time Health Index (0–100%), dehydration risks, overwatering risks, and precision hydration countdowns based on watering frequency, elapsed days, and plant categories.
* **Contextual In-Page AI Care Specialist**: On-demand botanical consultation built directly into each plant's details page with 1-click questions regarding pet safety, leaf discoloration, and propagation.
* **AI Plant Auto-Filler**: Automatically generate complete botanical specifications (scientific name, category, watering/fertilizer cadence, sunlight, soil, pet toxicity) with 1 click.
* **Interactive AI Chatbot (`GreenBuddy AI`)**: Floating conversational assistant connected to your personal garden collection.
* **Resilient Fallback Botanical Knowledge Engine**: Works seamlessly both online with Google Gemini API and offline with built-in heuristic decision models.

### 🏡 Core Garden Management Features
* **Personal Dashboard**: Botanical postcard collection layout with real-time health badges, animated counters, and care schedules.
* **Plant CRUD**: Add, edit, delete, and inspect detailed plant profiles with photo uploads.
* **Watering & Fertilizer Cadence**: Record last-watered dates and track next hydration schedules.
* **Care Calendar**: Interactive timeline and monthly overview of upcoming garden tasks.
* **Growth Journal**: Photo diary documenting plant growth, repotting, and milestones.
* **Weather-Aware Plant Care**: Real-time temperature, humidity, and weather-driven advice for your city.
* **Secure Authentication**: JWT-based login, registration, and user profile management.

---

## 🛠️ Tech Stack

### Frontend
* **React 19** with **Vite**
* **Framer Motion** for smooth animations & parallax
* **Lucide React & React Icons**
* **FullCalendar** for interactive scheduling
* **Recharts** for garden analytics
* **Axios** & **React Router 7**
* **React Toastify** for instant user notifications

### Backend
* **Java 21 / 25** with **Spring Boot 3**
* **Spring Data JPA & Hibernate**
* **Spring Security & JWT Authentication**
* **Spring WebFlux WebClient** for external API integrations
* **Lombok**
* **Heuristic Botanical Machine Learning Classifier**

### Database
* **MySQL 8.0+**

---

## 📂 Project Structure

```text
GreenBuddy/
│
├── backend/
│   ├── src/main/java/com/greenbuddy/greenbuddy/
│   │   ├── config/              # Security & CORS configuration
│   │   ├── controller/          # REST endpoints (AI, Plants, Journal, Calendar, Auth, Profile)
│   │   ├── dto/ai/              # AIDiagnosis, HealthPrediction, PlantCare DTOs
│   │   ├── model/               # JPA Entities (Plant, User, Journal, Reminder)
│   │   ├── repository/          # Spring Data JPA repositories
│   │   ├── security/            # JWT authentication filters & UserDetails
│   │   └── service/ai/          # GeminiService, PlantHealthPredictorService, JsonExtractor
│   ├── uploads/                 # Local directory for uploaded photos
│   └── pom.xml                  # Maven dependencies
│
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios API clients (aiApi, plantApi, authApi, etc.)
│   │   ├── components/          # Navbar, PlantCard, AIChatbot, WeatherCard, Analytics
│   │   ├── pages/               # AIDoctor, Dashboard, PlantDetails, AddPlant, Journal, Calendar
│   │   ├── assets/              # Botanical photographs, stickers & backgrounds
│   │   ├── App.jsx              # Routes & navigation guards
│   │   └── main.jsx             # Entrypoint
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/swathikasomisetti/GreenBuddy.git
cd GreenBuddy
```

### 2. Backend Setup
1. Create a MySQL database named `greenbuddy`:
   ```sql
   CREATE DATABASE greenbuddy;
   ```
2. Verify or configure your database credentials in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/greenbuddy
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```
3. *(Optional)* Add your Gemini API key in `application.properties` (or test with the built-in fallback engine):
   ```properties
   gemini.api.key=YOUR_GEMINI_KEY
   ```
4. Start the Spring Boot backend:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   *The backend runs on `http://localhost:8082`*

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend runs on `http://localhost:5173`*

---

## 🩺 Using the AI Features

1. **AI Plant Doctor**: Navigate to `/ai-doctor` via the navigation bar or click **"🩺 AI Check"** on any plant card. Select observed symptoms (e.g. Yellow Leaves, Brown Tips, Powdery Mildew) or upload a leaf photo to receive an instant diagnostic breakdown and treatment plan.
2. **Predictive Vitality Simulator**: On `/ai-doctor`, switch to the **"Smart Vitality & Hydration Predictor"** tab to test environmental sliders and observe real-time health score calculations and watering risk curves.
3. **Plant Details Specialist**: Visit any plant page (`/plant/:id`) to review its live Health Index ring, dehydration risk meter, and consult the AI with custom questions directly on the page.
4. **Auto-Fill New Plants**: Go to `/add-plant`, enter a name or choose from popular picks (Monstera, Pothos, Snake Plant), and click **"✨ Auto-Fill with AI"** to generate all care data instantly.

---

## 👩‍💻 Author

**Swathika Somisetti**  
Full-stack developer passionate about building clean, performant, and intelligent web applications.
