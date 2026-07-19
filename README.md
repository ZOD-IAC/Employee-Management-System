# Employee Management System (EMS)

A full-stack Employee Management System with secure authentication, role-based access control, employee CRUD, organizational hierarchy, dashboard analytics, and CSV bulk import.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Material UI v7 |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (access token) + bcrypt, HttpOnly cookies |

## Features

- **Authentication**: Login, Logout, protected routes, bcrypt password hashing
- **RBAC**: 3 roles — Super Admin (full access), HR Manager (create/edit/view, no delete, no Super Admin assignment), Employee (view/edit own profile only)
- **Employee CRUD**: Auto-generated human-readable Employee ID (`EMP-YYYY-000N`), full field set per spec
- **Organizational Hierarchy**: Assign reporting manager, view nested org tree, circular-reporting prevention, view direct reports
- **Search, Filter, Sort**: By name/email, department, status , isDeleted; sortable by joining date and name
- **Dashboard**: Total/active/inactive employee counts, department count
- **Bonus**: Pagination, soft delete, CSV bulk import, dark mode

## Project Structure

```
employee-management-system/
  client/     Next.js frontend
  server/     Express backend
```

## Setup

### Backend

```bash
cd server
npm install
```

Create `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/EMS
JWT_ACCESS_SECRET=<your-secret>
CLIENT_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

> **Note:** MongoDB transactions require a replica set, even locally.
> Run: `mongod --replSet rs0 --dbpath <your-db-path>`, then in the mongo shell: `rs.initiate()`.
> MongoDB Atlas works out of the box (no extra setup).

```bash
npm run dev
```

### Frontend

```bash
cd client
npm install
```

Create `client/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

App runs at `http://localhost:3000`, API at `http://localhost:5000`.

## Roles & Permissions

| Action | Super Admin | HR Manager | Employee |
|---|---|---|---|
| View employees | ✅ | ✅ | Own profile only |
| Create employee | ✅ (any role) | ✅ (not Super Admin) | ❌ |
| Edit employee | ✅ | ✅ (not Super Admin) | Own profile, limited fields |
| Delete employee | ✅ | ❌ | ❌ |
| Assign reporting manager | ✅ | ✅ | ❌ |
| CSV import | ✅ | ✅ (not Super Admin rows) | ❌ |
| View dashboard | ✅ | ✅ | ✅ |

## Data Model

**Auth** (login identity): `email`, `password` (hashed), `role`, `isActive`, `refreshToken`

**Employee** (profile): `employeeId` (auto-generated), `authId` (ref Auth), `name`, `email`, `phone`, `department`, `designation`, `salary`, `joiningDate`, `status`, `reportingManager` (ref Employee), `profileImage`, `isDeleted`

> Role is stored only on `Auth` (single source of truth), populated onto Employee views as needed.

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for full endpoint reference.

## CSV Import Format

```
employeeId,name,email,phone,department,designation,salary,joiningDate,role,password
```
`employeeId` and `password` are optional — auto-generated / defaulted if omitted.