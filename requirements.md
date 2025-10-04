# Requirements – Easy Dining

## 1. Project Overview

**Easy Dining** is a restaurant Point-of-Sale and QR ordering system.

* **Customers** scan a QR code at their table to view the menu, place an order, and pay online.
* **Staff** log into the POS dashboard to view and manage incoming orders.

---

## 2. Core Features (MVP)

### Customer (QR Ordering)

* Scan QR code → redirect to `table/{id}` page
* View restaurant menu (from API)
* Select items and quantity
* Enter contact info (phone/email)
* Make payment using **Stripe**
* Receive order confirmation

### Staff (POS Dashboard)

* Login (basic authentication for staff)
* View list of active orders
* View order details by ID
* Update order status (pending, in progress, completed)

---

## 3. Backend (ASP.NET Core Web API)

* Table management (fixed QR per table)
* Menu management (mock data for MVP, later use database)
* Order management (CRUD)
* Payment integration with Stripe API
* Basic authentication for staff dashboard
* API documentation with Swagger

---

## 4. Frontend (React + Tailwind CSS)

### Customer App

* Menu display page
* Cart functionality (add/remove items)
* Checkout page with contact info
* Stripe payment integration

### POS Dashboard

* Login page
* Order list page
* Order detail page with status update

---

## 5. Database (Phase 2 – After MVP)

* Use **EF Core** with **SQLite** (demo) or **SQL Server** (production-ready).
* Tables:

  * `MenuItems`
  * `Orders`
  * `OrderItems`
  * `Tables`
  * `Users` (staff/admin)

---

## 6. Non-functional Requirements

* Must run locally with minimal setup (for recruiters/demo)
* Clean code structure for scalability
* Simple deployment (Docker/Azure optional)
* Responsive UI (works on desktop & mobile)
