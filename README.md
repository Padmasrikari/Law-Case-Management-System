# ⚖️ LegalEase — Legal Case Management & Lawyer Booking System

A full-stack MERN application with three portals: Client, Lawyer, and Admin.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

---

## 🔧 Backend Setup

```bash
cd legal-system/backend
npm install
```

Create a `.env` file (copy from `.env.example`):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/legal-system
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### Seed Admin Account
After starting, create the admin manually via MongoDB or use this one-time API call:

**POST** `http://localhost:5000/api/auth/register`
```json
{
  "name": "Admin",
  "email": "admin@legalease.com",
  "password": "admin123",
  "role": "admin"
}
```
> ⚠️ Change admin password after first login in production!

---

## 💻 Frontend Setup

```bash
cd legal-system/frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Demo Accounts

After seeding, use these credentials on the login page:

| Role   | Email                   | Password  |
|--------|-------------------------|-----------|
| Admin  | admin@legalease.com     | admin123  |
| Client | (register at /register) | your pass |
| Lawyer | (register at /register) | your pass |

> **Note:** Lawyer accounts need admin approval before they can access the dashboard.

---

## 📁 Project Structure

```
legal-system/
├── backend/
│   ├── controllers/      # Business logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routes
│   ├── middleware/        # Auth + Upload
│   ├── uploads/          # Uploaded files (auto-created)
│   └── server.js
└── frontend/
    └── src/
        ├── pages/
        │   ├── client/   # Client portal pages
        │   ├── lawyer/   # Lawyer portal pages
        │   └── admin/    # Admin portal pages
        ├── components/   # Shared components
        ├── context/      # Auth context
        └── utils/        # Axios instance
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint            | Description     |
|--------|---------------------|-----------------|
| POST   | /api/auth/register  | Register user   |
| POST   | /api/auth/login     | Login           |
| GET    | /api/auth/me        | Get current user|

### Lawyers
| Method | Endpoint                   | Description          |
|--------|----------------------------|----------------------|
| GET    | /api/lawyers               | Get all lawyers      |
| GET    | /api/lawyers/dashboard     | Lawyer dashboard     |
| GET    | /api/lawyers/:id           | Lawyer profile       |
| PUT    | /api/lawyers/profile       | Update profile       |
| POST   | /api/lawyers/documents     | Upload documents     |
| PUT    | /api/lawyers/timeslots     | Set time slots       |

### Appointments
| Method | Endpoint                      | Description        |
|--------|-------------------------------|--------------------|
| POST   | /api/appointments             | Book appointment   |
| GET    | /api/appointments/client      | Client appointments|
| GET    | /api/appointments/lawyer      | Lawyer appointments|
| PUT    | /api/appointments/:id         | Update status      |

### Cases
| Method | Endpoint                      | Description        |
|--------|-------------------------------|--------------------|
| POST   | /api/cases                    | Create case        |
| GET    | /api/cases                    | Get cases          |
| GET    | /api/cases/:id                | Case details       |
| PUT    | /api/cases/:id                | Update case        |
| POST   | /api/cases/:id/hearings       | Add hearing        |
| POST   | /api/cases/:id/documents      | Upload documents   |
| POST   | /api/cases/:id/timeline       | Add timeline entry |

### Admin
| Method | Endpoint                        | Description         |
|--------|---------------------------------|---------------------|
| GET    | /api/admin/dashboard            | Admin stats         |
| GET    | /api/admin/pending-lawyers      | Pending lawyers     |
| PUT    | /api/admin/approve-lawyer/:id   | Approve lawyer      |
| PUT    | /api/admin/reject-lawyer/:id    | Reject lawyer       |
| GET    | /api/admin/users                | All users           |
| PUT    | /api/admin/block-user/:id       | Block user          |
| DELETE | /api/admin/user/:id             | Delete user         |
| GET    | /api/admin/cases                | All cases           |

---

## 🛠️ Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React 18 + Vite + TailwindCSS |
| Backend    | Node.js + Express.js          |
| Database   | MongoDB + Mongoose            |
| Auth       | JWT + Bcrypt                  |
| Files      | Multer                        |
| Charts     | Recharts                      |
| Icons      | Lucide React                  |
| HTTP       | Axios                         |

---

## ✨ Features

### Client Portal
- Register/Login
- Browse & search verified lawyers (by specialization, rating, experience)
- View lawyer profiles with reviews
- Book appointments with time slot selection
- Track case status with visual timeline & progress bar
- Submit star ratings & reviews

### Lawyer Portal
- Register (pending admin approval)
- Manage professional profile & time slots
- Upload case documents (PDF, images, video)
- Manage appointments (accept/reject)
- Create & track cases with hearings
- View analytics dashboard with charts

### Admin Portal
- Approve/reject lawyer registrations
- View platform analytics with charts
- Monitor all cases and users
- Block/delete users

---

## 📝 Notes

- File uploads are stored in `/backend/uploads/`
- JWT tokens expire in 30 days
- Admin account must be created manually (no public registration for admin)
