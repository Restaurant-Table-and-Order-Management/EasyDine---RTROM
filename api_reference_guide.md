# EasyDine API Reference Guide

Base URL: `http://localhost:8080/api`

---

## 🔐 Authentication
| Endpoint | Method | Description | Payload |
| :--- | :--- | :--- | :--- |
| `/auth/signup` | `POST` | Register a new user | `{ name, email, password, role }` |
| `/auth/login` | `POST` | Get JWT token | `{ email, password }` |

*Note: Roles supported are `CUSTOMER`, `ADMIN`, `KITCHEN_STAFF`.*

---

## 🛋️ Tables
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/tables` | `GET` | List all tables. |
| `/tables` | `POST` | [Admin] Create a new table. |
| `/tables/available`| `GET` | Search tables by date, time, and capacity. |
| `/tables/{id}/status`| `PATCH` | Update status (params: `status`). |
| `/tables/{id}` | `DELETE`| [Admin] Delete a table. |

---

## 📅 Reservations
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/reservations` | `POST` | Create a new booking for a table. |
| `/reservations/my` | `GET` | List current user's reservations. |
| `/reservations` | `GET` | [Admin] List all reservations (filter by status). |
| `/reservations/{id}`| `GET` | Get details for a specific reservation. |
| `/reservations/{id}/confirm`| `PUT` | [Admin] Confirm a pending booking. |

---

## 🥐 Menu
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/menu` | `GET` | Fetch entire categorized menu. |
| `/menu` | `POST` | [Admin] Create a new menu item. |
| `/menu/{id}` | `PUT` | [Admin] Update item price/availability/details. |
| `/menu/{id}` | `DELETE`| [Admin] Remove an item from the menu. |

---

## 🛒 Orders
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/orders` | `POST` | Place a new food order for a reservation session. |
| `/orders/my` | `GET` | Get current user's order history. |
| `/orders/reservation/{id}`| `GET` | Get all orders associated with a specific visit. |

---

## 📜 Unified Response Format
All successful responses return:
```json
{
  "success": true,
  "message": "User-friendly message",
  "data": { ... }
}
```
Errors return `success: false` with appropriate HTTP status codes.
