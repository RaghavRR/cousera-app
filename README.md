# 🎓 Course Selling Backend App

A full-featured backend system for a Coursera/Udemy-style learning platform — **secure, scalable, and tested** with Postman. This project includes **Admin** and **User** role-based access with full course lifecycle management.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Role-based access control for **Admin** and **Users**
- JWT-based authentication system
- Passwords hashed using `bcrypt` (no plain text stored)
- Protected routes with token validation in headers

### 🛠 Admin Functionalities
- Admin registration and login
- Create new courses
- Edit/update existing courses
- Delete courses
- Manage full course lifecycle
- Creator ID verification from headers

### 👨‍🎓 User Functionalities
- User registration and login
- Browse and purchase courses
- View all enrolled courses
- Receive confirmation message after course purchase
- Access only own enrolled content

---

## ⚙ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT, bcrypt
- **Environment Config:** dotenv
- **Testing:** Postman
- **Dev Tools:** nodemon

---


