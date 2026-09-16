\# Project KEYSTONE – Field Service Management Platform



\## Overview



Project KEYSTONE is a Field Service Management Platform designed to help organizations manage customers, service sites, work orders, technicians, parts, time tracking, notifications, audit logs, SLA tracking, and customer access from a centralized system.



The platform supports the complete work-order lifecycle:



NEW → ASSIGNED → IN\_PROGRESS → COMPLETED → CLOSED



\## Technology Stack



\### Backend

\- Java 17+

\- Spring Boot 4.0.8

\- Spring Security

\- JWT Authentication

\- Spring Data JPA / Hibernate

\- PostgreSQL

\- Maven

\- Swagger / OpenAPI



\### Frontend

\- React

\- TypeScript

\- Vite

\- HTML / CSS



\### Database

\- PostgreSQL 17+



\## Main Features



\- JWT-based authentication

\- Role-based access

\- User management

\- Customer management

\- Site management

\- Work-order creation and management

\- Technician assignment

\- Work-order status lifecycle

\- Work-order status history

\- SLA due-date and overdue tracking

\- Parts management

\- Time logging

\- Notifications

\- Audit logging

\- Customer portal

\- Dashboard

\- Swagger API documentation



\## Work-Order Lifecycle



A work order follows this workflow:



1\. NEW

2\. ASSIGNED

3\. IN\_PROGRESS

4\. COMPLETED

5\. CLOSED



Status changes are recorded in the work-order status history.



\## Project Structure



```text

demo/

├── src/

│   ├── main/

│   │   ├── java/

│   │   │   └── com.example.demo/

│   │   │       ├── config/

│   │   │       ├── controller/

│   │   │       ├── entity/

│   │   │       ├── repository/

│   │   │       ├── security/

│   │   │       └── service/

│   │   └── resources/

│   │       └── application.properties

│   └── test/

├── frontend/

├── pom.xml

├── README.md

└── .gitignore

