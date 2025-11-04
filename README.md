# 🪿 GOOSE — Social Media Application

**Author:** Alvin He  
**Vanderbilt Email:** alvin.t.he@vanderbilt.edu

---

## 🚀 Project Overview

GOOSE is a full-stack social media application built with a **React** frontend and a **Node.js + Express** backend, using **MongoDB** for persistence. It includes user authentication, posting, and media upload support (Cloudinary).

---

## ✅ Prerequisites

- Node.js (LTS recommended)
- MongoDB connection (local instance or cloud-hosted like MongoDB Atlas)
- (Optional) Cloudinary account for image uploads

---

## 📦 Installation & Running the App

### 1. Clone the repository:

```bash
git clone <repo_url>
cd <repo_folder>
```

### 2. Install and run the backend (server):

```bash
cd server
npm install
npm run dev
```

The server will run on `http://localhost:3000`

### 3. Install and run the frontend (client):

Open a new terminal window:

```bash
cd client
npm install
npm run dev
```

The client will run on `http://localhost:5173`

---

## 🔐 Environment Variables

### Client (.env in client folder):

```
VITE_API_URL=http://localhost:3000/api
```

### Server (.env in server folder):

```
PORT=3000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Note:** The `.env` files are included with this submission with working credentials.

---

## 💭 Reflection

This coding challenge was very difficult because it was my first time doing full-stack development. I felt that MongoDB and the API requests were pretty easy to understand, but I didn't expect the frontend to take as long as it did. The most challenging aspect was debugging and making sure that the user authentication was always working when it needed to.

---
