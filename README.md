# 🩸 Blood Donation Management Systems

A web-based blood bank platform built with Ruby on Rails (or adjust framework), enabling seamless management of donors, blood inventories, and mobile-based location-driven donor discovery.

## 🚀 Features

- **Donor management**: Register, update profile, and track donations.
- **Blood inventory**: Monitor stock levels by blood type.
- **Donation requests**: Hospitals and patients can request blood by specifying type and location.
- **Location-aware matching**: Connects seekers with nearby donors via geolocation.
- **Admin dashboard**: Oversee donors, requests, and inventory levels.

## 🧩 Tech Stack

- **Backend**: Ruby on Rails  
- **Database**: PostgreSQL (or MySQL / SQLite)  
- **Frontend**: ERB / HAML, JavaScript, Bootstrap  
- **Mobile Integration**: RESTful JSON API for mobile apps  
- **Testing**: RSpec / Minitest

## 🔧 Prerequisites

- Ruby ≥ 3.x  
- Rails ≥ 7.x  
- PostgreSQL (or alternative DB)  
- Node.js & Yarn (for frontend assets)  

## 🛠️ Setup & Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/SeavTh3an/BloodDonation.git
   cd BloodDonation
   
2. Additional installation
- For backend
  
   ```bash
   npm install express cors pg multer
   
- For Frontend

  ```bash
  npm install axios react react-dom
  npm install --save-dev vite @vitejs/plugin-react eslint eslint-plugin-react

3. Create .env file
   ```bash
   DB_HOST=your-host
   DB_USER=your-username
   DV_PORT=your-port
   DB_PASSWORD=your-password
   DB_NAME=your-db-name
