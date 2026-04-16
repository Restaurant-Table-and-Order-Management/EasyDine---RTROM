# 🍽️ EasyDine: RTROM System

**R**estaurant **T**able **R**eservation and **O**rder **M**anagement system.

---

## ✅ WHAT'S DONE

### 🏗️ Backend (Epic 1 Complete)
- **Security**: Production-grade JWT Auth with role-based access control (ADMIN/CUSTOMER).
- **Inventory**: Managed Table Inventory with `RestaurantTable` entity (renamed to avoid SQL conflicts).
- **Logic**: Intelligent Reservation Engine with **Time-Space Collision Detection** (no double-bookings).
- **States**: Automated Status Machine (`AVAILABLE` → `RESERVED` → `OCCUPIED`).
- **Clean Architecture**: Standardized DTOs, manual Mappers, and Global Exception Handling.

### 📋 Planning
- **Detailed Frontend Plan**: [frontend_development_plan.md](./frontend_development_plan.md)
- **API Reference Guide**: [api_reference_guide.md](./api_reference_guide.md)

### 🎨 Frontend (Foundation Ready)
- **Landing Page**: Professional hero-section and feature highlights implemented.
- **Auth Module**: Fully functional `LoginPage` and `RegisterPage` integrated with backend signatures.
- **Vite Setup**: Performance-optimized React + Vite project structure.

---

## 🛠️ PROJECT ROADMAP

### 🎨 Epic 1: Table Inventory & Reservation (Frontend)
- [/] **Refine UI/UX**: Polish Landing, Login, and Signup pages (Assignee).
- [ ] **Discovery**: Implement Date/Time/Capacity search for tables.
- [ ] **Booking**: Create the reservation submission flow.
- [ ] **Admin**: Dashboard for managing table status and confirming bookings.

### 🍱 Epic 2: Online Ordering & Menu Management
- [ ] **Menu CRUD**: Build categories (Starters, Mains, Drinks) and Item management.
- [ ] **Digital Menu**: Interactive menu browsing for customers.
- [ ] **Cart & Order**: Implement cart logic and "Place Order" flow.

### 👨‍🍳 Epic 3: Kitchen Order Management & Tracking
- [ ] **Kitchen Display (KDS)**: Real-time dashboard for chefs to view pending orders.
- [ ] **Order Tracking**: Status updates (Preparing → Ready → Served).
- [ ] **Notifications**: Real-time alerts for customers when food is ready.

### 💳 Epic 4: Billing & Payment Integration
- [ ] **Bill Generation**: Automated calculation of totals, taxes, and service charges.
- [ ] **Payments**: Integration with payment gateways (Simulation/Stripe/Razorpay).
- [ ] **History**: User order history and digital receipts.

---

## 🚀 How to Run

### Backend
1. Ensure MySQL is running and DB `easydine` is created.
2. Navigate to `/backend`.
3. Run `mvn spring-boot:run` (or use your IDE launcher).

### Frontend
1. Navigate to `/frontend`.
2. Run `npm install`.
3. Run `npm run dev`.

---

**Current Version**: 0.1.0-alpha (Epic 1 Stable)
