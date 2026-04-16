# 🏗️ Frontend Development Plan: EasyDine Epic 1

This document serves as the technical blueprint for developing the frontend of **EasyDine RTROM**. It maps directly to the finalized Spring Boot backend architecture.

---

## 🏛️ 1. Frontend Folder Structure (Feature-Based)
We will use a **Feature-Based Architecture** to ensure scalability.

```text
src/
├── api/                # Global Axios instance and interceptors
│   └── axiosConfig.js
├── components/         # Shared UI components (ShadCN/Common)
│   ├── ui/             # Atomic components (Buttons, Inputs)
│   └── common/         # Layout-specific (Navbar, Sidebar)
├── features/           # Module-specific logic
│   ├── auth/           # Login, Signup, AuthStore
│   ├── tables/         # Table cards, Management forms
│   └── reservations/   # Booking flow, Reservation cards
├── hooks/              # Global custom hooks (useToast, useMediaQuery)
├── pages/              # Page components (Routes)
├── store/              # Global State (Zustand)
│   ├── authStore.js
│   └── dataStore.js
└── utils/              # Formatters, Date helpers
```

---

## 🌐 2. API Integration Plan (Epic 1 Scope)

**Note**: All requests are prefixed with `/api`. Total structure: `RestaurantTable` and `Reservation`.

### 🔐 Authentication Module
| API Endpoint | Method | Used In | Flow |
| :--- | :--- | :--- | :--- |
| `/auth/signup` | POST | RegisterPage | Send `name`, `email`, `password`. No token needed. |
| `/auth/login` | POST | LoginPage | Send `email`, `password`. Store returned `token` in `authStore`. |

### 🍽️ Table Module
| API Endpoint | Method | Used In | Flow |
| :--- | :--- | :--- | :--- |
| `/tables` | GET | Dashboard / TableList | Admin: List all. Customer: List `AVAILABLE`. |
| `/tables/available` | GET | SearchPage | Query `date`, `time`, `capacity`. Filters real-time availability. |
| `/tables` | POST | Admin Panel | Admin creates `RestaurantTable` with `capacity`, `floorNumber`. |
| `/tables/{id}/status` | PATCH | Status Toggle | Admin toggles `MAINTENANCE` or `OCCUPIED`. |

### 📅 Reservation Module
| API Endpoint | Method | Used In | Flow |
| :--- | :--- | :--- | :--- |
| `/reservations` | POST | Booking Modal | Customer submits booking request. |
| `/reservations/my` | GET | MyBookings Page | Lists reservations for the logged-in user. |
| `/reservations` | GET | Admin Panel | Lists all reservations. Filters: `date`, `status`. |
| `/reservations/{id}/confirm`| PUT | Admin Action | Admin approves a `PENDING` request. |
| `/reservations/{id}/cancel` | PUT | Action Button | Updates status to `CANCELLED` and releases table. |

---

## 📱 3. Pages to Build

1.  **Auth Pages**:
    - `LoginPage`: Social-style auth with validation.
    - `RegisterPage`: Multi-step form for new users.
2.  **Dashboard (The Sidebar Hub)**:
    - **Sidebar**: Responsive navigation (Home, Tables, Reservations).
3.  **Customer Hub**:
    - `TableSearchPage`: Date/Time picker leading to a list of free `TableCards`.
    - `MyReservationsPage`: Chronological list of user's past and upcoming bookings.
4.  **Admin Command Center**:
    - `TableInventoryPage`: Grid of tables with "Edit Status" overlay.
    - `ReservationManager`: Tabbed view (Pending, Confirmed, Completed) with quick-action buttons.

---

## 🔄 4. User Flow (Step-by-Step)

### 👤 CUSTOMER FLOW
1. **Discover**: Login → Land on Search Dashboard.
2. **Search**: Enter Date (e.g., 2026-10-25) + Time + Guests.
3. **Query**: Call `GET /api/tables/available`.
4. **Select**: Browse `TableCard` components → Click "Reserve".
5. **Book**: Call `POST /api/reservations`.
6. **Confirm**: Receive "Success" message → Redirect to "My Reservations".

### 👑 ADMIN FLOW
1. **Overview**: Login → Land on Admin Dashboard.
2. **Review**: Open "Reservation Panel" → See `PENDING` list.
3. **Approve**: Click "Confirm" → Call `PUT /api/reservations/{id}/confirm`.
4. **Floor Ops**: Guests arrive → Update `Table Status` to `OCCUPIED`.
5. **Close**: Booking ends → Update `Table Status` to `AVAILABLE`.

---

## 🔐 5. Auth Flow & Security
- **Storage**: `token` stored in `localStorage` inside Zustand with `persist` middleware.
- **Interceptors**: 
  ```javascript
  axios.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  ```
- **Protected Routes**: Wrap pages with an `AuthGuard` that checks `user.role`.

---

## 🧠 6. Global State (Zustand)
We recommended **Zustand** for its simplicity over Redux.

- `useAuthStore`: `user`, `token`, `setAuth()`, `logout()`.
- `useDataStore`: `tables[]`, `reservations[]`, `loadingState`.

---

## 🎨 7. UI Component Plan
- **`TableCard`**: Displays table number, capacity, and current status badge.
- **`ReservationCard`**: Highlights time range and status color-coding.
- **`StatusBadge`**: Green (`AVAILABLE`), Blue (`RESERVED`), Orange (`OCCUPIED`), Red (`MAINTENANCE`).
- **`BookingForm`**: Modal-based form with date/time pickers.

---

## ⚠️ 8. Edge Case Handling
- **No Tables**: Redirect user to "Suggest different time" component.
- **Unauthorized**: If 403 error, clear token and redirect to Login.
- **Conflict**: If booking fails due to overlap, show toast: "Slot just taken! Please refresh."
- **Capacity**: Frontend validation to prevent selecting 6 guests for a 4-person table.

---

## 📦 9. Final Development Order
1. **Project Setup**: Vite + Tailwind + ShadCN.
2. **Axios/Zustand**: Basic auth state and interceptors.
3. **Auth Module**: Signup/Login pages.
4. **Table Module**: List and Availability search.
5. **Reservation Module**: Create booking flow & My Reservations view.
6. **Admin Module**: Confirm/Cancel actions and Status Management.
