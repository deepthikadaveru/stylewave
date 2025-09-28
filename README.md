
# 👗 StyleWave

StyleWave is a **full-stack fashion web platform** built with the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.  
It allows designers, tailors, and resellers to register, manage profiles, and interact with customers in a seamless digital space.

---

## 🛠️ Tech Stack

**Frontend**
- React.js (functional components + hooks)
- Context API for state management
- React Router (protected routes)
- CSS modules for styling

**Backend**
- Node.js + Express.js REST API
- MongoDB (Mongoose for ODM)
- JWT authentication
- Middleware for auth/validation

**Tools**
- Git & GitHub
- dotenv for environment variables

---

## ✨ Features

- 👤 **User Roles** → Designer, Tailor, Reseller, Customer  
- 🔑 **Authentication** → Secure login/signup, password reset  
- 📄 **Profile Management** → Designer/Tailor/Reseller profiles  
- 📩 **Messaging System** between users  
- 📜 **Policy Pages** → Terms of Service, Privacy Policy  
- ⚡ **Protected Routes** for authenticated users  
- 📱 **Responsive Design** for mobile and desktop  

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/stylewave.git
cd stylewave
````

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Start backend:

```bash
npm start
```

### 3️⃣ Frontend Setup

```bash
cd ../frontend/style
npm install
npm start
```

Visit 👉 [http://localhost:3000](http://localhost:3000)

---

## 📂 Folder Structure

```
stylewave/
│
├─ backend/                  # Express + MongoDB server
│  ├─ config/                # DB and server config
│  ├─ controllers/           # API business logic
│  ├─ middleware/            # Auth & validation middlewares
│  ├─ models/                # Mongoose schemas
│  ├─ routes/                # API routes
│  ├─ utils/                 # Helper functions
│  ├─ .env                   # Environment variables
│  └─ index.js               # App entry point
│
├─ frontend/style/           # React client
│  ├─ src/
│  │  ├─ components/         # Reusable UI components (Navbar, Footer, Cards)
│  │  ├─ context/            # AuthContext for state management
│  │  ├─ pages/              # Screens (Register, Login, Profiles, Dashboard, etc.)
│  │  ├─ styles/             # CSS files
│  │  ├─ App.js              # Main React app
│  │  ├─ index.js            # ReactDOM entry
│  │  └─ page.tsx            # TypeScript page example
│  ├─ public/                # Static assets
│  └─ package.json
│
├─ .gitignore
└─ README.md
```

---

## 🖼️ UI Pages (Highlights)

* 🏠 **Home Page**

  <img width="1869" height="905" alt="image" src="https://github.com/user-attachments/assets/0e0e2294-1705-4436-9c6c-f39b342b41d7" />
  

* 👗 **Designer & Tailor Profiles**

  <img width="1867" height="905" alt="image" src="https://github.com/user-attachments/assets/c926f9bd-0bf0-4078-8644-676392633b68" />


  <img width="1871" height="900" alt="image" src="https://github.com/user-attachments/assets/d1c6578c-add2-45c0-a8e0-0946146fdad0" />

* 🛍️ **Registration & Login**


 <img width="1862" height="911" alt="image" src="https://github.com/user-attachments/assets/9b617b97-0177-475d-910f-a0298569be2a" />
 

* 🔒 **Protected Dashboard**

  <img width="1873" height="915" alt="image" src="https://github.com/user-attachments/assets/47083916-c68c-4e14-bf5a-7883bd5450f1" />


* 📩 **Messaging System**

 <img width="1877" height="922" alt="image" src="https://github.com/user-attachments/assets/74effa4a-f74b-495d-b19b-0c784a977a84" />

  
* 📜 **Privacy & Terms Pages**

All the above screenshots are taken using sample data.

---

## 📫 Connect with Me

📧 Email: [deepthikadaveru@gmail.com](mailto:deepthikadaveru@gmail.com)
💼 LinkedIn: [Deepthi Kadaveru](https://www.linkedin.com/in/deepthi-kadaveru-83248933b/)

---

```
```
