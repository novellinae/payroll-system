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
- Manage Payroll Records
- Server-side pagination, sorting & filtering
- Upload payslip PDFs to Supabase Storage
- View all employee payroll data

---

### **👤 Employee Features**
- View personal payroll records
- View Attendance Information
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
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
│
├── admin/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── action.ts
│   │   ├── dashboard-client.tsx
│   │   └── types.ts
│   │
│   ├── employees/
│   │   ├── page.tsx
│   │   ├── columns.tsx
│   │   ├── table.tsx
│   │   └── action.ts
│   │
│   └── payroll/
│       ├── page.tsx
│       ├── columns.tsx
│       ├── payroll-table.tsx
│       ├── action.ts
│       │
│       ├── create/
│       │   ├── page.tsx
│       │   ├── create-payroll-form.tsx
│       │   └── action.ts
│       │
│       └── [id]/
│           ├── page.tsx
│           └── edit-payroll-form.tsx
│
├── employees/   # employee role area
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── employee-dashboard-client.tsx
│   │   └── action.ts
│   │
│   ├── payroll/
│   │   ├── page.tsx
│   │   ├── payroll-table.tsx
│   │   ├── employee-view.tsx
│   │   └── [id]/page.tsx
│   │
│   └── employee/
│       ├── page.tsx
│       ├── columns.tsx
│       └── table.tsx
│
├── layout.tsx
├── layout-client.tsx
├── page.tsx
├── provider.tsx
├── ThemeRegistry.tsx
├── globals.css
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   │
│   ├── queries/
│   │   ├── payroll.ts
│   │   ├── employee.ts
│   │   └── dashboard.ts
│   │
│   └── utils/
│       ├── formatCurrency.ts
│       └── constants.ts
│
├── ui/
│
public/
README.md
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
<img width="1822" height="911" alt="Payroll-sys (2)" src="https://github.com/user-attachments/assets/75dafb44-949f-4b68-b01e-6df15dfc8b7a" />


### Admin Payroll View
<img width="1899" height="866" alt="Payroll-sys (4)" src="https://github.com/user-attachments/assets/bcb437fe-836d-46e6-8a2b-eb53e1659180" />

### Employee Dashboard
<img width="1898" height="926" alt="image" src="https://github.com/user-attachments/assets/25352e95-6fe7-41b9-84a2-993764457c74" />


