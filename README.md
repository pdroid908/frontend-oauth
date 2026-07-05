# 🔐 Frontend OAuth

A modern authentication frontend built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**.

This application provides the user interface for user authentication and communicates with a dedicated Go backend. Authentication state is maintained using secure **HTTP-only cookies**, allowing users to stay signed in without exposing tokens to client-side JavaScript.

## Features

- User Login & Registration
- Protected Routes
- Session Persistence
- Automatic Authentication Check
- Logout
- Responsive UI
- API Integration
- Form Validation

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Fetch API

## Authentication Flow

```text
User
   │
   ▼
Frontend
   │
   ▼
Go Authentication API
   │
   ▼
HTTP-only Cookie
   │
   ▼
Authenticated Session
```

The frontend is responsible for:

- Rendering authentication pages
- Calling backend authentication APIs
- Managing UI authentication state
- Protecting authenticated pages
- Sending authenticated requests using cookies

## Getting Started

```bash
git clone https://github.com/pdroid908/frontend-oauth.git

cd frontend-oauth

npm install

npm run dev
```

## Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Backend

This project communicates with:

https://github.com/pdroid908/oauth-go-backend

## Author

**Putra Rohman**

Backend & Full Stack Developer
