# 🧾 Payroll Management System
Mini Project #1

A full-stack Payroll Management System built using **Next.js 16**, **Supabase**, **TanStack Table**, and **MUI**.

This system provides secure payroll management with **Role-Based Access Control (RBAC)**, server-side data handling, and payslip PDF storage.

---
## 🚀 Features

### 🔐 **Authentication & RBAC**
- Secure login with role-based access for Admins and Employees.
- Supabase Authentication (Email & OAuth)
- Protected routes (Server-side enforcement)
- Database-level security using Row Level Security (RLS)

---

### **👑 Admin Features**
- Manage Employees (CRUD)
- Manage Payroll Records
- Server-side pagination, sorting & filtering
- Upload payslip PDFs to Supabase Storage
- View all employee payroll data

---

### **👤 Employee Features**
- View personal payroll records
- Download payslip PDFs
- Secure access to own data only

---

## 🛠️ Tech Stack
![NextJS](https://img.shields.io/badge/NextJs-000000?style=flat&logo=next.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![TanStack Table](https://img.shields.io/badge/TanStack%20Table-FF5733?style=flat&logo=tanstack&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=flat&logo=mui&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## 📁 Project Structure
```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── admin/
│   ├── employees/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── payrolls/
│       ├── page.tsx
│       └── [id]/page.tsx
├── employee/
│   ├── payrolls/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── profile/page.tsx
├── layout.tsx
├── page.tsx
├── lib/
|   ├──── supabase/
|   |     ├── client.ts
|   |     ├── auth.ts
|   |     └── server.ts
|   ├──── queries/
|   |     └── payrolls.ts
```

## 📈 Performance & Security
- Server-side data fetching for optimal performance
- RLS policies for secure data access
- Efficient pagination and filtering for large datasets
- Secure file storage for payslips

## 📂 Database Schema
- **users**: id, email, password_hash, role (admin/employee), created_at
- **employees**: id(FK), employee_id, first_name, last_name, department, base_salary, hire_date, status, created_at, position, auth_user_id
- **payrolls**: id (FK), employee_id, period_id, bonus, deduction, tax, gross_salary, net_salary, status, created_at
- **payroll_periods**: id (FK), month, year, status, created_at
- **attendance**: id (FK), employee_id, attendance_date, status (present/absent/leave), check_in, check_out, created_at
- **payslips bucket**: id, payroll_id (FK), file_path, generated_at

Protected with Row Level Security (RLS).

---

## 📦 Installation & Setup
1. Clone the repository:
   ```bash
   git clone
    cd payroll-system
    ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:3000`
---

## ⚙️ Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📸 Screenshots

### Admin Dashboard
![Admin Dashboard](./screenshots/admin.png)

### Employee Payroll View
![Employee Payroll](./screenshots/employee.png)
