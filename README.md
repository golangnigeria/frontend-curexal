# 🏥 Curexal | Intelligent Healthcare Ecosystem

Curexal is a modern, unified healthcare management platform designed to bridge the gap between patients, doctors, pharmacies, and laboratories. By integrating advanced digital solutions with real-time health monitoring and AI-driven support, Curexal provides a seamless experience for the entire medical community.

---

## 🌟 Key Features

### 👤 Role-Based Experience
- **Patients**: Manage appointments, book lab tests, log vitals, and receive digital prescriptions.
- **Doctors**: Full patient management, specialized appointment views, and digital prescription issuance.
- **Facilities (Lab/Pharmacy)**: Real-time order fulfillment for medications and streamlined lab test processing.
- **Logistics**: Integrated medication delivery tracking and field operations.
- **Care Agents**: Dedicated mobile-first tools for field interventions and patient assistance.

### 🤖 Intelligent Care
- **AI Health Assistant**: Integrated chat widget offering 24/7 support and guidance.
- **Emergency SOS System**: One-tap emergency triggers that alert nearby care agents and responders.
- **Real-time Vitals**: Proactive monitoring and logging of critical health metrics.

### 🔒 Security & Performance
- **Modern Auth**: Secure JWT-based authentication with email verification.
- **Role-Based Access (RBAC)**: Strict permission boundaries across all API endpoints.
- **Dark Mode Support**: Deeply integrated UI supporting both light and premium dark themes.

---

## 🛠️ Tech Stack

### Backend (Go)
- **Framework**: [Iris Web Framework](https://github.com/kataras/iris)
- **Database**: PostgreSQL (Persistence)
- **Migrations**: [Goose](https://github.com/pressly/goose)
- **Security**: Argon2/Bcrypt hashing, JWT Session management
- **Generation**: Templ (for server-side rendering where applicable)

### Frontend (React)
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **State Management**: Zustand
- **Charts**: Recharts

---

## 🚀 Getting Started

### Prerequisites
- **Go**: 1.21+
- **Node.js**: 18+ (LTS recommended)
- **PostgreSQL**: 14+
- **Make**: Standard utility for task runners

### Environment Setup
Create a `.env` file in the root directory:
```bash
PORT=8080
DATABASE_URL=postgres://user:password@localhost:5432/curexal?sslmode=disable
JWT_SECRET=your_super_secret_key
COOKIE_DOMAIN=localhost
FRONTEND_URL=http://localhost:5173
```

### Installation & Deployment

Curexal can be deployed as a unified container or as decoupled services (recommended for production).

#### 1. Backend Service (Go)
1. **Build & Run**
   ```bash
   go mod download
   make run
   ```
2. **Production Docker**
   ```bash
   docker build -t curexal-backend .
   ```

#### 2. Frontend Service (React)
1. **Environment Config**
   Create `frontend/.env` with your backend URL:
   ```text
   VITE_APP_DOMAIN=https://api.curexal.space
   ```
2. **Build & Run**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. **Production Docker**
   ```bash
   cd frontend
   docker build -t curexal-frontend .
   ```

---

## 📂 Project Structure

```text
├── cmd/api           # Application entry points & route definitions
├── internal/
│   ├── auth          # JWT & session logic
│   ├── handlers      # HTTP controllers (role-based logic)
│   ├── models        # Database schemas & TS translations
│   └── repository    # Persistent data layer (Postgres)
├── migrations        # SQL schema versioning (Goose)
└── frontend/         # React Application
    ├── src/assets    # UI assets & logos
    ├── src/layouts   # Dashboard & public layouts
    ├── src/pages     # Role-specific dashboard views
    └── src/utils     # Configs (Navigation, Role maps)
```

---

## 📜 License
Curexal is proprietary software. &copy; 2026 GolangNigeria. All rights reserved.
