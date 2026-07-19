# Task Manager

A full-stack task management application. Users can create an
account, sign in, and manage a private list of tasks from a responsive
dashboard. Each task can have a description, priority, status, and due date.

## Features

- Register, log in, and log out with JWT authentication
- Create, view, edit, and delete tasks
- Mark tasks as pending or completed
- Search tasks by title or description
- Filter the dashboard by task status
- View totals for all, pending, and completed tasks
- Request validation, security headers, CORS, and centralized error handling
- Interactive OpenAPI/Swagger documentation

Each API request is scoped to the authenticated user, so users can only access
their own tasks.

## Tech Stack

### Frontend

- React TypeScript
- Redux Toolkit and React Redux
- React Router
- Axios
- Tailwind CSS
- React Hook Form and Zod
- Lucide React icons

### Backend

- Node.js and Express.js
- MongoDB and Mongoose
- JSON Web Tokens and bcrypt
- Zod request validation
- Swagger/OpenAPI
- Helmet and CORS

## Project Structure

```text
my-tasks/
├── backend/      # Express REST API, MongoDB models, and Swagger docs
├── frontend/     # React dashboard
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js 20 or newer
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd my-tasks
```

### 2. Configure and start the backend

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env`, then set the environment
variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/my-tasks
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the development server:

```bash
node server
```

The API will be available at `http://localhost:5000/api/v1`.

### 3. Configure and start the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env` and configure the API URL:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in a browser.

## API

Base URL: `http://localhost:5000/api/v1`

Swagger documentation is available at:
`http://localhost:5000/api/docs`

Except for registration, login, and the health check, endpoints require a JWT
in the request header:

```http
Authorization: Bearer <token>
```

### Authentication

| Method | Endpoint         | Authentication | Description                                                          |
| ------ | ---------------- | -------------- | -------------------------------------------------------------------- |
| `GET`  | `/health`        | No             | Checks whether the API is running                                    |
| `POST` | `/auth/register` | No             | Creates a user and returns a JWT                                     |
| `POST` | `/auth/login`    | No             | Authenticates a user and returns a JWT                               |
| `POST` | `/auth/logout`   | Yes            | Validates logout for the current session; the client removes its JWT |

### Tasks

| Method   | Endpoint            | Description                               |
| -------- | ------------------- | ----------------------------------------- |
| `GET`    | `/tasks`            | Lists the current user's tasks            |
| `POST`   | `/tasks`            | Creates a task                            |
| `GET`    | `/tasks/:id`        | Gets one task                             |
| `PATCH`  | `/tasks/:id`        | Updates one or more task fields           |
| `DELETE` | `/tasks/:id`        | Deletes a task                            |
| `PATCH`  | `/tasks/:id/status` | Changes a task's pending/completed status |

The task list endpoint supports these query parameters:

| Parameter   | Accepted values                                          | Default     |
| ----------- | -------------------------------------------------------- | ----------- |
| `status`    | `all`, `pending`, `completed`                            | `all`       |
| `search`    | Up to 100 characters                                     | Empty       |
| `sortBy`    | `createdAt`, `updatedAt`, `dueDate`, `title`, `priority` | `createdAt` |
| `sortOrder` | `asc`, `desc`                                            | `desc`      |
| `page`      | Positive integer                                         | `1`         |
| `limit`     | Integer from 1 to 100                                    | `10`        |
