# 🍽️ EasyDine: RTROM System
**Restaurant Table Reservation and Order Management**

EasyDine is a professional full-stack platform designed to modernize restaurant operations. It bridges the gap between customer convenience and kitchen efficiency through a unified, role-based ecosystem.

---

## 🚀 CURRENT PROJECT STATUS
**Version: 0.8.0-beta** (Enterprise Auth & Orders Integrated)

### ✅ What's Implemented
- **Advanced Auth**: Production-grade JWT Authentication with **Role-Based Access Control** (Admin, Customer, kitchen Staff).
- **Table Logic**: Intelligent Table Inventory with **Time-Space Collision Detection** for reservations.
- **Menu Management**: Full CRUD operations for menu items with categories and availability toggles.
- **Live Ordering**: Functional Shopping Cart with session-based order placement (`POST /api/orders`).
- **Staff Hub**: Unified dashboard for managing live floor status and reservations.
- **Persistence**: Zustand state persistence across page refreshes.

---

## 🛠️ TECH STACK
- **Frontend**: React 18, Vite, Tailwind CSS, Zustand, Lucide Icons.
- **Backend**: Spring Boot 3.x, Spring Security (JWT), Hibernate/JPA.
- **Database**: MySQL (Relational Schema).
- **Communication**: RESTful API with Axios Interceptors.

---

## 🗺️ PROJECT ROADMAP

### 🟢 Epic 1: Table Inventory & Reservation (STABLE)
- [x] Intelligent Date/Time/Capacity search.
- [x] Booking submission and management.
- [x] Admin table status control.

### 🟢 Epic 2: Online Ordering & Menu Management (STABLE)
- [x] Menu Item CRUD (Admin).
- [x] Category filtering and search.
- [x] Shopping Cart and Order placement.

### 🟡 Epic 3: Kitchen Display & Order Fulfillment (IN PROGRESS)
- [x] Unified Staff Dashboard.
- [x] Live Session Tracking (Order history for active tables).
- [ ] Live Order Fulfillment (Pending -> Preparing -> Served status machine).

### ⚪ Epic 4: Billing & Analytics (PLANNED)
- [ ] Automated Bill Generation.
- [ ] Payment Gateway integration (Mock/Stripe).
- [ ] Sales and Occupancy Analytics.

---

## ⚙️ HOW TO RUN

### Prerequisites
- JDK 17+
- Node.js 18+
- MySQL Server

### 1. Backend Setup
1. Navigate to `/backend`.
2. Configure `application.yml` or `.env` with your DB credentials.
3. Run: `./mvnw spring-boot:run`

### 2. Frontend Setup
1. Navigate to `/frontend`.
2. Run: `npm install`
3. Run: `npm run dev`
4. Access at: `http://localhost:5173`

---

**Documentation:**
- [API Reference Guide](./api_reference_guide.md)
- [Visual Project Structure](./VISUAL_STRUCTURE.md)
