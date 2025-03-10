# Attendly - Employee Management & HR Software



## 🚀 Overview

**Attendly** is a powerful **Employee Management & HR Software** designed to streamline **attendance tracking, task management, payroll processing, and analytics** in one place. It helps businesses manage employees effectively while providing a seamless user experience.

---

## 🎯 Features

✅ **Employee Dashboard** - Track attendance, check-ins, and real-time activities\
✅ **Team Management** - View team status (Active/Offline), departments, and notifications\
✅ **Task Management** - Assign & track tasks with descriptions and deadlines\
✅ **Scheduling & Events** - Integrated calendar with personal & company-wide events\
✅ **Analytics & Reports** - Graphical insights into attendance patterns, working hours, and more\
✅ **Payroll Management** - Employee salary records & overtime tracking\
✅ **Leave & Absence Management** - Apply for leaves with multiple leave types\
✅ **Admin Panel** - Manage users, tasks, and system-wide notifications

---

## 🛠 Tech Stack

| **Technology**           | **Usage**                      |
| ------------------------ | ------------------------------ |
| **Frontend**             | React + TypeScript             |
| **Backend**              | Node.js + Express.js           |
| **Database**             | PostgreSQL (AWS RDS)           |
| **Authentication**       | Firebase Auth (Google Sign-in) |
| **Hosting**              | Firebase Hosting / Vercel      |
| **Email Notifications**  | SendGrid + Cloud Functions     |
| **Logging & Monitoring** | Google Cloud Logging           |

---

## 🎬 Demo & Screenshots


![Screenshot (175)](https://github.com/user-attachments/assets/15d5049e-8b1d-499d-b73c-d5d0b51ceef1)

---

## 📌 Installation & Setup

### 1️⃣ Clone the Repository

```sh
 git clone https://github.com/Akutagawaaa/attendly-94.git
 cd Attendly
```

### 2️⃣ Backend Setup

```sh
 cd backend
 npm install
 node server.js  # Starts the Node.js server
```

### 3️⃣ Frontend Setup

```sh
 cd frontend
 npm install
 npm run dev  # Starts React development server
```

---

## 📂 Project Structure

```plaintext
Attendly/
├── backend/          # Node.js & Express backend
│   ├── db.js         # Database connection
│   ├── routes/       # API Routes
│   ├── server.js     # Main backend server
│   └── .env          # Environment variables
├── frontend/         # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   └── package.json
└── README.md         # Project Documentation
```

---

## 🚦 API Endpoints

### ✅ Authentication

```http
POST /api/auth/login  → Logs in a user
POST /api/auth/register  → Registers a new user
```

### ✅ Attendance

```http
POST /api/attendance  → Mark attendance
GET /api/attendance   → Get all attendance records
```

### ✅ Tasks & Scheduling

```http
POST /api/tasks  → Create a new task
GET /api/tasks   → Get all tasks assigned
```

More endpoints available in `/backend/routes/` 🚀

---

## 👥 User Roles

🔹 **Employee** - Mark attendance, manage tasks, track payroll, request leaves\
🔹 **Admin** - Manage employees, approve leaves, oversee payroll, and system notifications

---

## 🌐 Deployment

✅ **Frontend** → Firebase Hosting
✅ **Backend** → AWS EC2
✅ **Database** → AWS RDS (PostgreSQL)

---

## 💡 Future Enhancements

- 📌 **Mobile App (React Native)**
- 📌 **Biometric & QR-based Check-ins**
- 📌 **AI-powered Attendance Predictions**

---

## 💙 Contributing

Want to improve Attendly? Feel free to fork, raise issues, and submit pull requests! 🚀

```sh
git clone https://github.com/Akutagawaaa/attendly-94.git
```

---

## 📞 Contact & Support

📧 **Email**: [sushant.shrivastava.2603@gmail.com](mailto\:sushant.shrivastava.2603@gmail.com)\

---

🚀 **Attendly** - Making Workforce Management Smarter! 🚀

