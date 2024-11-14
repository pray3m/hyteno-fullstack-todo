````markdown
# Hyteno Fullstack Todo Application

A feature-rich Todo app with Role-Based Access Control (RBAC), file uploads, search & filter, and notifications. Frontend deployed on Vercel and backend on a VPS.

## Live URLs

- **Frontend:** [hyteno-fullstack-todo.vercel.app](https://hyteno-fullstack-todo.vercel.app/)
- **Backend:** [hy.petgomania.com.co](https://hy.petgomania.com.co)

## Features

- **User Authentication & RBAC**
  - Admin and User roles
- **Todo Management**
  - Create, read, update, delete todos
  - File uploads for todos
- **Search, Sort & Filter**
  - Search by title and description
  - Sort by due date
  - Filter by status and creation date
- **Notifications**
  - Welcome notification on user creation

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, shadcn UI, Zustand, Axios
- **Backend:** NestJS, Prisma, PostgreSQL, JWT, Cloudinary
- **DevOps:** Docker, Docker Compose, Nginx (reverse proxy), Vercel, VPS

## Setup Development Environment

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
````

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

## Deployment

- **Frontend:** Deployed on Vercel at [hyteno-fullstack-todo.vercel.app](https://hyteno-fullstack-todo.vercel.app/)
- **Backend:** Deployed on VPS at [hy.petgomania.com.co](https://hy.petgomania.com.co)

## Quick Commands

- **Frontend**

  - Install: `yarn install`
  - Start: `yarn dev`
  - Build: `yarn build`

- **Backend**
  - Install: `yarn install`
  - Migrate: `npx prisma migrate deploy`
  - Seed: `npx prisma db seed`
  - Start: `yarn start:dev`
  - Docker Compose: `docker-compose up -d --build`

## Contact

For questions or support, email [prem.gtm9@gmail.com](mailto:prem.gtm9@gmail.com).

> **Note:** This project was created as a task for a MERN Developer Intern position at Hyteno.
