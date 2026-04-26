<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=900&size=50&duration=3000&pause=500&color=0EA5E9&center=true&vCenter=true&width=900&height=120&lines=VaultCore+PDM;Product+Data+Management+System;Secure+%7C+Scalable+%7C+Production+Ready" />
</p>

<h1 align="center">🏗️ VaultCore PDM</h1>

<p align="center">
  <b>Enterprise-Ready Product Data Management System</b><br>
  Built with Node.js • Express • MongoDB • EJS
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-0EA5E9?style=for-the-badge&logo=github">
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js">
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb">
  <img src="https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens">
  <img src="https://img.shields.io/badge/UI-Bootstrap5-7952B3?style=for-the-badge&logo=bootstrap">
</p>

---

## 🚀 Overview

> **VaultCore PDM** is a scalable Product Data Management system designed for engineering workflows, enabling structured management of products, components, and hierarchical BOMs.

Unlike basic CRUD apps, this project demonstrates:
- Real-world **data relationships**
- Secure **RBAC architecture**
- **Document generation pipelines (PDF)**
- Clean **MVC backend design**

---

## 🧠 Why This Project Stands Out

| Typical Projects ❌ | VaultCore PDM ✅ |
|-------------------|----------------|
| Basic CRUD apps | ✔ Real-world PDM system |
| No access control | ✔ JWT + RBAC security |
| Flat data models | ✔ Hierarchical BOM structure |
| No reporting | ✔ PDF BOM generation |
| Minimal architecture | ✔ Clean MVC + middleware layering |

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-Based Access Control:
  - 👑 Admin
  - 📊 Manager
  - 🛠️ Engineer
- Route protection via middleware

---

### 📦 Product & BOM Management
- Full product lifecycle (CRUD)
- Hierarchical **Bill of Materials**
- Component-to-product relationships
- Scalable MongoDB schema design

---

### 📊 Dashboard UI
- Responsive Bootstrap 5 interface
- Clean navigation & admin controls
- Optimized for usability

---

### 📄 PDF Report Engine
- Generate BOM reports
- Styled tables via PDFKit
- Downloadable documentation pipeline

---

## 🎮 How It Works

```mermaid
graph LR
    A[Login] --> B[JWT Auth]
    B --> C{Role Check}
    C -->|Admin| D[User + Product Control]
    C -->|Manager| E[Product Management]
    C -->|Engineer| F[View + Limited Actions]
    D --> G[Database]
    E --> G
    F --> G
    G --> H[PDF Generation]
