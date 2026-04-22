# EasyDine RTROM

Restaurant Table Reservation and Order Management platform for modern dine-in operations.

EasyDine RTROM is a full-stack web application that helps restaurants manage reservations, menu operations, customer ordering, kitchen workflow, billing, and role-based dashboards from one system.

## What This Project Delivers

- Role-based workflows for admin, customer, waiter, and kitchen staff.
- JWT-based authentication and protected routes on both backend and frontend.
- Table discovery and reservation lifecycle management.
- Customer ordering with cart, order tracking, and order history.
- Admin tools for menu and billing management.

## Roles and Modules

### Admin
- Dashboard overview and operational control.
- Table management.
- Reservation management.
- Menu management.
- Billing dashboard.

### Customer
- Account registration and login.
- Table search and reservation booking.
- Digital menu browsing.
- Order placement, tracking, and order history.

### Waiter
- Waiter dashboard and ticket workflow.

### Kitchen Staff
- Kitchen dashboard for order handling.

## Architecture Overview

### Frontend
- React 18 + Vite 5 single-page application.
- Route-level guards using role-aware protected routes.
- State management with Zustand.
- API clients built on Axios with auth interceptors.
- Tailwind CSS based UI system.

### Backend
- Spring Boot 3.2.4 (Java 21).
- Spring Security + JWT authentication.
- Spring Data JPA + Hibernate.
- MySQL persistence layer.
- Validation and exception handling for stable API behavior.

### API Base
- Base URL: `http://localhost:8080/api`

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Zustand, Axios, Tailwind CSS, Framer Motion |
| Backend | Spring Boot, Spring Security, Spring Data JPA, Hibernate, JWT |
| Database | MySQL |
| Build Tools | Maven, npm |

## Repository Structure

```text
EasyDine---RTROM/
  backend/                  # Spring Boot API (Java 21)
    src/main/java/com/easydine/
      auth/ billing/ common/ config/ kitchen/ menu/ orders/ reservation/ table/
    src/main/resources/application.yml
  frontend/                 # React + Vite client
    src/
      api/ components/ features/ hooks/ pages/ store/ utils/
  api_reference_guide.md
  frontend_development_plan.md
  VISUAL_STRUCTURE.md
```

## Local Setup

### Prerequisites
- Java 21+
- Maven 3.9+
- Node.js 18+
- npm 9+
- MySQL 8+

### 1) Configure Backend Environment

Create a `.env` file inside `backend/` with:

```env
DB_URL=jdbc:mysql://localhost:3306/easydine?useSSL=false&serverTimezone=UTC
DB_USERNAME=your_mysql_user
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_very_strong_secret_key
```

Notes:
- Ensure database `easydine` exists.
- Backend runs on port `8080` with context path `/api`.

### 2) Start Backend

```bash
cd backend
mvn spring-boot:run
```

### 3) Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL is typically shown by Vite (commonly `http://localhost:5173`).

## Frontend Scripts

From `frontend/`:

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Backend Build Commands

From `backend/`:

```bash
mvn clean install
mvn test
mvn spring-boot:run
```

## Main Routes Snapshot

- Public: `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`
- Admin: `/admin/dashboard`, `/admin/tables`, `/admin/reservations`, `/admin/menu`, `/admin/billing`
- Customer: `/dashboard`, `/tables`, `/menu`, `/my-reservations`, `/my-orders`, `/order-track/:id`
- Staff: `/staff/dashboard`, `/kitchen/orders`, `/waiter/dashboard`

## Supporting Documentation

- API reference: [api_reference_guide.md](./api_reference_guide.md)
- Frontend implementation plan: [frontend_development_plan.md](./frontend_development_plan.md)
- Visual architecture: [VISUAL_STRUCTURE.md](./VISUAL_STRUCTURE.md)

## Current Status

Active development project with core reservation, ordering, dashboard, and authentication flows in place across frontend and backend modules.
