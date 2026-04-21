# 🎨 EasyDine - Visual Project Structure

## 📂 Project Directory Tree

```text
EasyDine/
├── 📄 README.md                    ← beta-0.8.0 Overview
├── 📄 api_reference_guide.md       ← Full API documentation
├── 📄 VISUAL_STRUCTURE.md          ← This file
│
├── 📂 backend/                     ← Spring Boot 3 Engine
│   ├── 📁 src/main/java/com/easydine/
│   │   ├── 📁 auth/                ← JWT Security & RBAC
│   │   ├── 📁 table/               ← Inventory & Status Management
│   │   ├── 📁 reservation/         ← booking Logic
│   │   ├── 📁 menu/                ← Menu Item CRUD
│   │   ├── 📁 orders/              ← Order placement & fulfillment
│   │   └── 📁 common/              ← Standardized DTOs & Exceptions
│   └── 📄 pom.xml                  ← Maven build file
│
└── 📂 frontend/                    ← React 18 / Vite / Tailwind
    ├── 📁 src/
    │   ├── 📁 components/          ← UI, Common, Layout
    │   ├── 📁 features/            ← Logic-heavy features
    │   │   ├── 📁 auth/            ← Login, Signup (Role-aware)
    │   │   ├── 📁 table/           ← Selection, Searching
    │   │   └── 📁 orders/          ← Menu browsing, Cart, Tracking
    │   ├── 📁 pages/               ← Main route entries
    │   │   ├── 📁 dashboard/       ← Role-specific hubs
    │   │   └── 📄 LandingPage.jsx  ← Public Hero section
    │   ├── 📁 store/               ← Zustand (Auth, Data, Cart)
    │   ├── 📁 api/                 ← Axios configurations
    │   └── 📁 utils/               ← Constants, DateHelpers
    └── 📄 tailwind.config.js       ← Premium Branding (Orange/Gold)
```

---

## 🗺️ Core Component Flows

### 🔓 Authentication Flow
1. **Landing** ➔ **Login/Signup** (User picks Role: Customer/Kitchen/Admin).
2. **Success** ➔ Result stored in `authStore.js` (JWT + Role).
3. **Redirections**:
   - `CUSTOMER` ➔ `/dashboard` (My Bookings).
   - `ADMIN` ➔ `/admin/dashboard` (Oversight).
   - `KITCHEN_STAFF` ➔ `/staff/dashboard` (Live Hub).

### 🥗 Customer Journey
1. **Discover** ➔ Search by Date/Time ➔ Pick available Table.
2. **Book** ➔ Table shows `RESERVED` status instantly.
3. **Order** ➔ Browse categorized Menu ➔ Add to Cart ➔ Place Order.
4. **Track** ➔ Live dashboard showing order status from Kitchen.

---

## 📋 Feature Progress Checklist

### Backend ✅
- [x] JWT Auth with Role-Based Access Control.
- [x] Collision-free Reservation Engine.
- [x] Menu & Order Persistence.
- [x] Global Exception Handling.

### Frontend ✅
- [x] Role Selection UI (Signup).
- [x] Interactive Table Map.
- [x] Shopping Cart & Session Persistence.
- [x] Order Tracking UI.
- [/] Kitchen Order Fulfillment (In Progress).

---

## 🏁 Port & Base Configuration
- **Frontend URL**: `http://localhost:5173`
- **Backend API**: `http://localhost:8080/api`
- **Database**: Port `3306` (Local/Cloud MySQL).
- **Default Admin Account**: Create via `/signup` with Admin role.
