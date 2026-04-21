<<<<<<< HEAD
# API Reference Guide

## Base URL
`/api`

## Authentication
`POST /auth/login` - Authenticate users  
`POST /auth/register` - Register new user  

## Tables
`GET /tables` - Fetch all tables in system  
`POST /tables` - Create a new table  
`PUT /tables/{id}/status` - Update table status  
`DELETE /tables/{id}` - Delete a table  

## Orders
`GET /orders` - Fetch orders  
`POST /orders` - Place a new order  
`PUT /orders/{id}/status` - Update order progression status  

## Menu
`GET /menu` - Fetch all menu items  
`POST /menu` - Add a new menu item  
`PUT /menu/{id}` - Modify existing menu item  
`DELETE /menu/{id}` - Remove menu item
=======
# 📖 EasyDine Backend API Reference

This guide provides the exact specifications for all backend APIs currently implemented in the EasyDine project. Use this for Axios service layer development.

---

## 🛠️ Global Specifications

- **Base URL**: `http://localhost:8080/api`
- **Content-Type**: `application/json`
- **Auth Header**: `Authorization: Bearer <jwt_token>` (Required for all except `/auth/**`)
- **Global Response Envelope**:
  ```json
  {
    "success": true, 
    "message": "Operation description",
    "data": { ... } 
  }
  ```

---

## 🔐 1. Authentication APIs (`/auth`)

### Signup
- **Endpoint**: `/auth/signup`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response `data`**: `{ "token": "...", "user": { "id": 1, "email": "...", "name": "...", "role": "CUSTOMER" } }`

### Login
- **Endpoint**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response `data`**: Same as Signup.

---

## 🍽️ 2. Table Management APIs (`/tables`)

### List Tables
- **Endpoint**: `/tables`
- **Method**: `GET`
- **Privacy**: Role-dependent inside backend.
- **Response `data`**: Array of `TableDTO`.

### Search Available Tables
- **Endpoint**: `/tables/available`
- **Method**: `GET`
- **Params**: `date` (YYYY-MM-DD), `time` (HH:mm:ss), `capacity` (Integer)
- **Response `data`**: Array of `TableDTO` that are free for that slot.

### Create Table (ADMIN Only)
- **Endpoint**: `/tables`
- **Method**: `POST`
- **Body**: `{ "tableNumber": "T1", "capacity": 4, "location": "Window", "floorNumber": 1 }`

### Update Table Status (ADMIN Only)
- **Endpoint**: `/tables/{id}/status`
- **Method**: `PATCH`
- **Params**: `status` (String: AVAILABLE, RESERVED, OCCUPIED, MAINTENANCE)

---

## 📅 3. Reservation APIs (`/reservations`)

### Create Reservation
- **Endpoint**: `/reservations`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "tableId": 1,
    "reservationDate": "2026-10-25",
    "startTime": "18:00:00",
    "endTime": "20:00:00",
    "guestCount": 4,
    "specialRequests": "Birthday cake preferred"
  }
  ```

### View My Reservations (CUSTOMER Only)
- **Endpoint**: `/reservations/my`
- **Method**: `GET`
- **Response `data`**: Array of `ReservationDTO`.

### View All Reservations (ADMIN Only)
- **Endpoint**: `/reservations`
- **Method**: `GET`
- **Params (Optional)**: `date`, `status`
- **Response `data`**: Comprehensive list of all bookings.

### Confirm Reservation (ADMIN Only)
- **Endpoint**: `/reservations/{id}/confirm`
- **Method**: `PUT`

### Cancel Reservation
- **Endpoint**: `/reservations/{id}/cancel`
- **Method**: `PUT`

---

## 🏗️ Data Models (DTOs)

### `TableDTO`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Long | Unique Identifier |
| `tableNumber`| String | e.g. "A101" |
| `capacity` | Integer | Max guests |
| `status` | Enum | AVAILABLE, RESERVED, etc. |
| `location` | String | e.g. "Garden", "VIP" |
| `floorNumber`| Integer | 1, 2, or 3 |

### `ReservationDTO`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Long | Unique Identifier |
| `userId`/`userName`| Mixed | Linking to the customer |
| `tableId`/`tableNumber`| Mixed | Linking to the physical table |
| `reservationDate`| LocalDate | YYYY-MM-DD |
| `startTime`| LocalTime | HH:mm:ss |
| `status` | Enum | PENDING, CONFIRMED, CANCELLED |
| `guestCount` | Integer | Number of guests |
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
