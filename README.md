\# Custom Employee Portal with Zoho One Integration



A full-stack employee portal that provides secure role-based access to Zoho services through a custom authentication and authorization layer.



\## Features



\- Custom employee login

\- JWT-based authentication

\- Password hashing using bcrypt

\- PostgreSQL database using Neon

\- Role-Based Access Control (RBAC)

\- Admin-only management panel

\- User role management

\- User activation/deactivation

\- Audit logging

\- Secure backend authorization

\- Zoho OAuth 2.0 integration

\- Zoho Books API integration

\- Role-based Zoho service access

\- Responsive Next.js frontend



\## Technology Stack



\### Frontend

\- Next.js

\- React

\- TypeScript



\### Backend

\- Node.js

\- Express.js

\- JWT

\- bcryptjs

\- Axios



\### Database

\- PostgreSQL

\- Neon



\### Integration

\- Zoho OAuth 2.0

\- Zoho Books API



\## Architecture



```text

&#x20;                   ┌──────────────────────┐

&#x20;                   │   Next.js Frontend   │

&#x20;                   │                      │

&#x20;                   │ Login / Dashboard    │

&#x20;                   │ Admin Panel          │

&#x20;                   └──────────┬───────────┘

&#x20;                              │

&#x20;                              │ JWT

&#x20;                              ▼

&#x20;                   ┌──────────────────────┐

&#x20;                   │   Express Backend    │

&#x20;                   │                      │

&#x20;                   │ Authentication       │

&#x20;                   │ JWT Middleware       │

&#x20;                   │ RBAC Middleware      │

&#x20;                   │ Admin APIs           │

&#x20;                   │ Zoho Service Layer   │

&#x20;                   └───────┬───────┬──────┘

&#x20;                           │       │

&#x20;                    PostgreSQL     │

&#x20;                           │       │ OAuth/API

&#x20;                           ▼       ▼

&#x20;                   ┌──────────┐  ┌──────────────┐

&#x20;                   │  Neon DB │  │ Zoho Services│

&#x20;                   │          │  │              │

&#x20;                   │ Users    │  │ People       │

&#x20;                   │ Roles    │  │ CRM          │

&#x20;                   │ Perms    │  │ Desk         │

&#x20;                   │ Audit    │  │ Books        │

&#x20;                   └──────────┘  └──────────────┘




Role-Based Access



Role	Zoho Service

Admin	All services

HR	Zoho People

Sales	Zoho CRM

Support	Zoho Desk

Finance	Zoho Books



The backend enforces permissions for every protected endpoint. Frontend visibility is not treated as a security mechanism.



Database Design



The application uses the following tables:



users

roles

permissions

user\_roles

role\_permissions

audit\_logs



This provides a flexible RBAC structure where roles can be mapped to different permissions.



Authentication Flow

Employee enters their portal email and password.

Backend retrieves the user from PostgreSQL.

Password is verified using bcrypt.

Backend checks whether the account is active.

A signed JWT is generated.

The frontend stores the authentication session.

Protected API requests include the JWT.

Backend middleware validates the JWT before processing requests.


Request

&#x20;  │

&#x20;  ▼

JWT Authentication

&#x20;  │

&#x20;  ├── Invalid → 401 Unauthorized

&#x20;  │

&#x20;  ▼

Permission Check

&#x20;  │

&#x20;  ├── No Permission → 403 Forbidden

&#x20;  │

&#x20;  ▼

Authorized API Request





\*\* Zoho Integration \*\*



The backend uses Zoho OAuth 2.0 refresh-token authentication.



Zoho access tokens are obtained server-side and are not exposed to frontend users.



Currently, Zoho Books is connected through the real Zoho Books API.



The other Zoho service endpoints demonstrate the role-based integration architecture and authorization flow.


\*\*Admin Panel\*\*



Administrators can:



View employee users

View available roles

Change employee roles

Activate/deactivate employee accounts

View audit logs

Admin APIs are protected by backend Admin authorization middleware.

\*\* Audit Logging \*\*



Important actions are recorded in the audit\_logs table, including:



User login

Role changes

User activation

User deactivation



Audit records contain the user, action, resource, IP address and timestamp.

\*\*\*Demo Accounts\*\*\*



For local demonstration:



Role	Email	Password

Admin	admin@test.com	Admin@123

HR	hr@test.com	HR@123

Sales	sales@test.com	Sales@123

Support	support@test.com	Support@123

Finance	finance@test.com	Finance@123



These credentials are intended only for local/demo use.

\*\*\*Environment Variables\*\*\*



Create a .env file inside the backend directory:

PORT=5000



DATABASE\_URL=your\_neon\_postgresql\_connection\_string



JWT\_SECRET=your\_jwt\_secret



ZOHO\_CLIENT\_ID=your\_zoho\_client\_id

ZOHO\_CLIENT\_SECRET=your\_zoho\_client\_secret

ZOHO\_REFRESH\_TOKEN=your\_zoho\_refresh\_token

ZOHO\_ACCOUNTS\_URL=https://accounts.zoho.in

ZOHO\_API\_DOMAIN=https://www.zohoapis.in

ZOHO\_ORGANIZATION\_ID=your\_zoho\_books\_organization\_id

Never commit .env or OAuth credentials to GitHub.

Running the Project

\*Backend\*

cd backend

npm install

npm run dev



Backend runs on:



http://localhost:5000


\*Frontend\*



Open another terminal:



cd frontend

npm install

npm run dev



Frontend runs on:



http://localhost:3000


API Endpoints


Authentication

POST /api/auth/login

Zoho Services

GET /api/zoho/people

GET /api/zoho/crm

GET /api/zoho/desk

GET /api/zoho/books


ADMIN

GET /api/admin/users

GET /api/admin/roles

GET /api/admin/audit-logs



PUT /api/admin/users/:userId/role

PUT /api/admin/users/:userId/status



All protected endpoints require a valid JWT.

\*\*Security\*\*



The application implements:



Password hashing

JWT authentication

Server-side RBAC

Admin authorization middleware

Protected API endpoints

Inactive account blocking

Server-side Zoho credentials

OAuth refresh-token flow

Audit logging

Environment-based secret configuration

RBAC Testing



The following scenarios were tested:



Admin



Admin can:



Access the Admin Panel

View employees

Change employee roles

Activate/deactivate users

View audit logs

HR



HR can access:



Zoho People



HR cannot access Admin APIs.



Unauthorized Admin API requests return:



403 Forbidden

Sales



Sales can access:



Zoho CRM

Support



Support can access:



Zoho Desk

Finance



Finance can access:



Zoho Books



Finance successfully connects to the real Zoho Books API.

\*\*\*Project Structure\*\*\*

custom-employee-portal/

│

├── backend/

│   ├── src/

│   │   ├── config/

│   │   ├── controllers/

│   │   ├── middlewares/

│   │   ├── models/

│   │   ├── routes/

│   │   └── services/

│   │

│   ├── .env

│   ├── seedUsers.js

│   ├── server.js

│   └── package.json

│

├── frontend/

│   ├── app/

│   │   ├── admin/

│   │   ├── dashboard/

│   │   └── page.tsx

│   │

│   └── package.json

│

├── .gitignore

└── README.md

\*\*Future Improvements\*\*


Complete live API integrations for Zoho People, CRM and Desk

Production deployment

More granular permission management

Automated backend tests

Refresh-token/session improvements

Production-grade secret management

