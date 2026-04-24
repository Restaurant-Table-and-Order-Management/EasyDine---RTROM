# 🍽️ EasyDine - RTROM

**Restaurant Table Reservation and Order Management System**

A fully-featured full-stack application for complete restaurant digital operations. Manage table reservations, process orders, track kitchen operations, handle payments, and generate billing—all in one integrated platform.

**Current Version**: v1.0.0 | **Status**: Production Ready ✅

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based secure login with role-based access (ADMIN/CUSTOMER/STAFF)
- User registration and profile management
- Session management and token refresh
- Password encryption with BCrypt

### 🍽️ Table Management & Reservations
- Complete table inventory management with floor mapping
- Intelligent collision detection prevents double-bookings
- Real-time availability search by date, time, and capacity
- Automated status transitions (AVAILABLE → RESERVED → OCCUPIED → MAINTENANCE)
- Admin dashboard for table configuration and status updates
- Reservation confirmation and cancellation workflows

### 🍱 Menu & Order Management
- Complete menu system with categories (Starters, Mains, Desserts, Drinks)
- Full menu CRUD operations for administrators
- Interactive digital menu for customers with item descriptions
- Shopping cart with add/remove/update quantity functionality
- Order placement and tracking
- Order history for customers with detailed information

### 👨‍🍳 Kitchen Operations & Real-Time Tracking
- Kitchen Display System (KDS) showing pending orders in real-time
- Order status workflow (NEW → PREPARING → READY → SERVED → COMPLETED)
- WebSocket integration for instant order updates
- Priority management for urgent orders
- Kitchen staff dashboard with filter options
- Real-time notifications for order status changes

### 💳 Billing, Payments & Analytics
- Automated bill generation with itemized breakdown
- Tax and service charge calculations
- Payment gateway integration (Stripe/Razorpay ready)
- Multiple payment method support
- PDF receipt generation and email delivery
- Customer order history and transaction records
- Admin analytics dashboard with sales metrics
- Revenue reports and order statistics

---

## 🛠️ Tech Stack

**Backend**: Java 21 | Spring Boot 3.2.4 | Spring Security | Spring WebSocket | MySQL 8.0 | Hibernate | JWT | Stripe/Razorpay SDK

**Frontend**: React 18 | Vite | Zustand | Tailwind CSS | Axios | WebSocket | jsPDF | Framer Motion | Lucide Icons

---

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8.0+
- Maven 3.9+

### Backend Setup
```bash
cd backend

# Create database
mysql -u root -p
> CREATE DATABASE easydine;

# Setup environment (.env)
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/easydine
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_secret_key_min_32_characters
JWT_EXPIRATION=86400000

# Run
mvn clean install
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Setup environment (.env.local)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000

# Run
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📁 Project Structure

```
backend/
├── src/main/java/com/easydine/
│   ├── auth/          → Authentication & JWT
│   ├── table/         → Table inventory & management
│   ├── reservation/   → Booking system & collision detection
│   ├── menu/          → Menu & category management
│   ├── order/         → Order processing & tracking
│   ├── kitchen/       → Kitchen operations & KDS
│   ├── bill/          → Invoice & bill generation
│   ├── payment/       → Payment processing & integration
│   ├── analytics/     → Sales metrics & reports
│   ├── user/          → User entity & profiles
│   ├── notification/  → WebSocket notifications
│   └── common/        → Exception handlers & utilities
└── pom.xml

frontend/
├── src/
│   ├── pages/
│   │   ├── Auth/               → Login, Register
│   │   ├── Customer/           → Reservations, Menu, Orders
│   │   ├── Kitchen/            → KDS Dashboard
│   │   ├── Admin/              → Management panels
│   │   └── Billing/            → Invoices & Payments
│   ├── components/             → Reusable UI components
│   ├── stores/                 → Zustand state management
│   ├── services/               → API & WebSocket services
│   ├── hooks/                  → Custom React hooks
│   └── utils/                  → Helper functions
└── package.json
```

---

## 📡 API Endpoints

```
Authentication
POST   /api/auth/signup              → Register
POST   /api/auth/login               → Login
POST   /api/auth/refresh             → Refresh token
POST   /api/auth/logout              → Logout

Tables
GET    /api/tables                   → List all
GET    /api/tables/available         → Find available
POST   /api/tables                   → Create (ADMIN)
PUT    /api/tables/{id}              → Update (ADMIN)
PATCH  /api/tables/{id}/status       → Update status (ADMIN)
DELETE /api/tables/{id}              → Delete (ADMIN)

Reservations
POST   /api/reservations             → Create
GET    /api/reservations/my          → My bookings
GET    /api/reservations             → All (ADMIN)
GET    /api/reservations/{id}        → Get details
PUT    /api/reservations/{id}/confirm         → Confirm (ADMIN)
PUT    /api/reservations/{id}/cancel          → Cancel

Menu
GET    /api/menu                     → Get all items
GET    /api/menu/categories          → Get categories
GET    /api/menu/{id}                → Get item details
POST   /api/menu                     → Add item (ADMIN)
PUT    /api/menu/{id}                → Update (ADMIN)
DELETE /api/menu/{id}                → Delete (ADMIN)

Orders
POST   /api/orders                   → Place order
GET    /api/orders                   → Get orders
GET    /api/orders/{id}              → Get order details
GET    /api/orders/my                → My orders (CUSTOMER)
PUT    /api/orders/{id}/status       → Update status (STAFF/ADMIN)
GET    /api/orders/filter            → Filter orders (KITCHEN)

Bills & Payments
POST   /api/bills                    → Generate bill
GET    /api/bills/{id}               → Get bill details
POST   /api/payments                 → Process payment
GET    /api/payments/history         → Payment history
GET    /api/invoices/{id}/pdf        → Download invoice PDF

Analytics
GET    /api/analytics/sales          → Sales metrics
GET    /api/analytics/orders         → Order statistics
GET    /api/analytics/revenue        → Revenue report
GET    /api/analytics/top-items      → Top selling items
```

---

## 🛣️ Roadmap - All Epics Complete ✅

| Epic | Status | Description |
|------|--------|-------------|
| **1: Auth & Tables** | ✅ Complete | JWT authentication, table inventory, reservations |
| **2: Menu & Orders** | ✅ Complete | Menu CRUD, shopping cart, order management |
| **3: Kitchen Operations** | ✅ Complete | KDS, real-time tracking, order status updates |
| **4: Billing & Payments** | ✅ Complete | Invoice generation, payment processing, analytics |

**v1.0.0 Released** - All core features implemented and tested

---

## 👥 User Roles & Permissions

### Customer
- Register and manage profile
- Search and book table reservations
- View menu and place orders
- Track order status in real-time
- View order history and bills
- Download receipts

### Kitchen Staff
- View Kitchen Display System (KDS)
- See incoming orders in real-time
- Update order status (Preparing → Ready → Served)
- Filter and prioritize orders
- Mark orders as completed

### Administrator
- Manage table inventory and configuration
- View and confirm all reservations
- Create and manage menu items and categories
- Generate reports and analytics
- Monitor all orders and kitchen operations
- View financial reports and payment history
- Manage system users and roles

---

## 🎯 Core Functionalities Implemented

### Reservation System
- ✅ Date & time selection with availability check
- ✅ Capacity-based table allocation
- ✅ Collision detection to prevent double-bookings
- ✅ Special requests and notes
- ✅ Status tracking (PENDING → CONFIRMED → OCCUPIED → COMPLETED)
- ✅ Cancellation with admin notification

### Order Management
- ✅ Browse digital menu by categories
- ✅ Add/remove items from cart
- ✅ Quantity adjustment with real-time price calculation
- ✅ Order placement with delivery/dine-in options
- ✅ Order tracking with status updates
- ✅ Order history with filters

### Kitchen Operations
- ✅ Real-time Kitchen Display System
- ✅ Order queue with priority levels
- ✅ Status workflow management
- ✅ Completion tracking
- ✅ WebSocket for instant updates
- ✅ Filter by order type, priority, time

### Billing & Payments
- ✅ Automated invoice generation
- ✅ Itemized bill breakdown
- ✅ Tax and service charge calculation
- ✅ Multiple payment methods (Card, Cash, etc.)
- ✅ Payment gateway integration (Stripe/Razorpay)
- ✅ PDF receipt generation
- ✅ Email receipt delivery

### Analytics Dashboard
- ✅ Daily/weekly/monthly sales metrics
- ✅ Revenue reports
- ✅ Top-selling menu items
- ✅ Order statistics and trends
- ✅ Peak hours analysis
- ✅ Customer preferences

---

## 🏗️ Architecture

- **Backend**: Layered architecture (Controller → Service → Repository → Entity)
- **Security**: JWT tokens + Spring Security + BCrypt password hashing
- **Frontend**: Component-based with Zustand state management
- **Database**: MySQL with Hibernate ORM
- **Communication**: RESTful APIs + WebSocket for real-time updates

---

## 🔧 Environment Files

### Backend (.env)
```env
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/easydine
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRATION=86400000
SERVER_PORT=8080
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000
VITE_WEBSOCKET_URL=ws://localhost:8080
```

---

## 📝 Common Commands

```bash
# Backend
mvn clean install           # Build
mvn spring-boot:run         # Run
mvn test                    # Test

# Frontend
npm install                 # Install
npm run dev                 # Dev server
npm run build               # Build
npm run lint                # Lint
```

---

## 🐛 Troubleshooting

**Port 8080 already in use**
```bash
lsof -i :8080
kill -9 <PID>
```

**MySQL connection error**
- Verify MySQL is running: `mysql -u root -p`
- Create database: `CREATE DATABASE easydine;`
- Check .env credentials match your setup

**Frontend can't connect to backend**
- Ensure backend is running on port 8080
- Check `VITE_API_BASE_URL` in .env.local
- Check browser console for CORS errors

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/name`
3. Make changes and test
4. Commit: `git commit -m "Add feature"`
5. Push and create PR

**Guidelines**: Follow existing code style, add comments for complex logic, test thoroughly.

---

## 🚢 Deployment & Production

### Backend Deployment
```bash
# Build production JAR
mvn clean package

# Run with production profile
java -jar target/easydine-backend-1.0.0.jar --spring.profiles.active=production
```

### Frontend Deployment
```bash
# Build optimized production bundle
npm run build

# Deploy dist folder to any web server (Nginx, Apache, Vercel, etc.)
# For Docker:
docker build -t easydine-frontend .
docker run -p 80:80 easydine-frontend
```

### Database Migration
```bash
# Backup current database
mysqldump -u root -p easydine > backup.sql

# Update to latest schema
# Spring Boot automatically migrates on startup with:
# spring.jpa.hibernate.ddl-auto=update
```

### Environment Setup for Production
```env
# Backend Production (.env)
SPRING_DATASOURCE_URL=jdbc:mysql://prod-db-server:3306/easydine
SPRING_DATASOURCE_USERNAME=prod_user
SPRING_DATASOURCE_PASSWORD=secure_password
JWT_SECRET=production_secret_key_very_secure_min_32_chars
JWT_EXPIRATION=86400000
SERVER_PORT=8080
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING.PROFILES.ACTIVE=production

# Payment Gateway
STRIPE_API_KEY=sk_live_xxxxx
RAZORPAY_API_KEY=xxxx
RAZORPAY_SECRET=xxxx

# Email Service
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=noreply@easydine.com
MAIL_PASSWORD=xxxx
```

---

## 📄 License

MIT License - See LICENSE file

---

## 📊 Status

**v1.0.0 - Production Ready** ✅ (April 2026)
- Epic 1 (Auth & Tables): ✅ Complete
- Epic 2 (Menu & Orders): ✅ Complete
- Epic 3 (Kitchen Operations): ✅ Complete
- Epic 4 (Billing & Payments): ✅ Complete
- All features tested and production-ready

**Future Enhancements (v1.1.0+)**
- Mobile app (React Native)
- SMS/Email notifications
- Advanced analytics ML models
- Multi-language support
- Dark mode UI theme

---

**Repository**: https://github.com/Restaurant-Table-and-Order-Management/EasyDine---RTROM | **Status**: Production Ready ✅

**Version**: v1.0.0 | **Last Updated**: April 23, 2026 | **License**: MIT
