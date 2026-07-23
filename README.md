GreenBuddy

GreenBuddy is a full-stack web application that helps users manage and care for their plants in one place. It allows users to keep track of their plants, monitor their health, receive watering reminders, maintain a growth journal, and view weather-based care suggestions. The goal of this project is to make plant care simple, organized, and accessible for everyone.

This project was developed to strengthen my full-stack development skills using React, Spring Boot, and MySQL while learning how frontend and backend applications work together.

---

Features

User Features

* User Registration and Login
* Secure Authentication
* Personal Dashboard
* Add New Plants
* Edit Plant Information
* Delete Plants
* View Detailed Plant Information
* Mark Plants as Watered
* Track Plant Health Status
* Watering Schedule Management
* Fertilizer Schedule Management
* Favorite Plants
* Growth Journal with Photo Uploads
* Weather-Based Plant Care Suggestions
* Plant Encyclopedia (Wikipedia Links)
* Search and Filter Plants

Admin Features

* Manage Plant Database
* Manage Users
* Dashboard Analytics (basic implementation)

---

Tech Stack

 Frontend

* React (Vite)
* JavaScript
* HTML5
* CSS3
* Axios
* React Router

### Backend

* Spring Boot
* Spring Security
* Spring Data JPA
* REST APIs
* Lombok

### Database

* MySQL

---

Project Structure

```text
GreenBuddy/
│
├── backend/
│   ├── src/
│   ├── uploads/
│   ├── pom.xml
│   └── application.properties
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

Getting Started

### Clone the Repository

```bash
git clone https://github.com/swathikasomisetti/GreenBuddy.git
```

Move into the project directory:

```bash
cd GreenBuddy
```

---

 Backend Setup

1. Open the `backend` folder.
2. Create a MySQL database named:

```text
greenbuddy
```

3. Update your `application.properties` file with your database credentials and API keys.

4. Run the Spring Boot application.

The backend runs on:

```text
http://localhost:8082
```

---

Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

Screenshots

Screenshots will be added as the project continues to evolve.

* Dashboard
* Plant Details
* Add Plant
* Growth Journal
* Weather Suggestions
* Care Calendar

---

What I Learned

Working on GreenBuddy helped me improve my understanding of:

* Full-stack application development
* REST API design and integration
* Spring Boot architecture
* Authentication with Spring Security
* Database design using MySQL
* CRUD operations
* React component-based development
* State management
* File uploads
* Weather API integration
* Debugging and project organization

---

Future Improvements

Some features planned for future versions include:

* AI-powered plant disease detection
* Plant identification using uploaded images
* Marketplace for buying and selling plants
* Mobile responsiveness improvements
* Push notifications
* Personalized care recommendations
* Community plant sharing

---

 Author

**Swathika Somisetti**

Developed as a full-stack project to practice building scalable web applications using React, Spring Boot, and MySQL.
