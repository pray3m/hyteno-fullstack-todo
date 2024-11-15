# 📝 Hyteno Fullstack Todo Application

A slick Todo app with Role-Based Access Control (RBAC), file uploads, search & filter, and notifications developed using React, NestJS, and PostgreSQL deployed on Vercel and a VPS.

## 🚀 Live URLs

- **Frontend:** [hyteno-fullstack-todo.vercel.app](https://hyteno-fullstack-todo.vercel.app/)
- **Backend:** [hy.petgomania.com.co](https://hy.petgomania.com.co)

> 🚢 The backend is proudly hosted on a subdomain of my freelance client's VPS, showcasing a smooth deployment and reliable performance .

## 🔑 Admin & User Credentials

- **Admin**

  - **Email:** admin@hy.com
  - **Password:** password

- **User**
  - **Email:** user@hy.com
  - **Password:** password

> _These credentials are seeded for testing purposes. Feel free to create your own!_

## ✨ Features

- **User Authentication & RBAC**
  - **Admin:** Manage all users and their todos.
  - **User:** Manage own todos and view all todos.
- **Todo Management**
  - Create, read, update, delete todos.
  - Upload files for todos.
- **Search, Sort & Filter**
  - Search by title and description.
  - Sort by due date.
  - Filter by status and creation date.
- **Notifications**
  - Receive a welcome notification upon registration.

## 🛠 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, shadcn UI, Zustand, Axios
- **Backend:** NestJS, Prisma, PostgreSQL, JWT, Cloudinary
- **DevOps:** Docker, Docker Compose, Nginx (reverse proxy), Vercel, VPS

## 💻 Setup Development Environment

### Prerequisites

- **Node.js** v18.x
- **Yarn**
- **Docker** & **Docker Compose**

### Frontend

1. **Clone the Repository**

   ```bash
   git clone https://github.com/pray3m/hyteno-fullstack-todo.git
   cd hyteno-fullstack-todo/client
   cp .env.example .env.local
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Run Development Server**

   ```bash
   yarn dev
   ```

### Backend

1. **Navigate to Backend Directory**

   ```bash
   cd ../server
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the `server` directory:

   ```env
   DATABASE_URL="postgresql://myuser:mypassword@postgres:5432/hyteno_fullstack_todo?schema=public"

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   PORT=3000
   ```

4. **Run Docker Containers**

   ```bash
   docker-compose up -d --build
   ```

5. **Apply Migrations & Seed Database**

   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

6. **Start Backend Server**

   ```bash
   yarn start:dev
   ```

## 📸 Project Screenshots

![Todo List](./screenshots/ss3.png)

![Dashboard](./screenshots/ss2.png)

![Todo Form](./screenshots/ss1.png)

## 📫 Contact

For questions or support, email [prem.gtm9@gmail.com](mailto:prem.gtm9@gmail.com).

> **Note:** This project was created as a task for a MERN Developer Intern position at Hyteno.
