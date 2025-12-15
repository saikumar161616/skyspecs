# TurbineOps Lite — Case Study Starter

A scaffold for candidates to implement the **Turbine → Inspection → Findings → Repair Plan** workflow.

## Quick Start

```bash
# 1) bootstrap
make dev-up
# wait a bit for DBs to be ready

# 2) run migrations & seed
make migrate
make seed

# 3) dev servers
make backend
make frontend

# Open: http://localhost:5173  (frontend)
# REST base: http://localhost:4000/api
# GraphQL:   http://localhost:4000/graphql
```

See `docs/INSTALL.md` and `docs/API.md` for details.


--------------------------------------------------------------------

# TurbineOps Lite - Architecture & Design Decisions
# Project Overview
TurbineOps Lite is a full-stack application designed to manage the lifecycle of wind turbine inspections, from data ingestion to repair plan generation. This document outlines the architectural choices made to ensure the system is scalable, maintainable, and type-safe while meeting the specific functional requirements of the case study.

# High-Level Architecture
The application follows a Microservices-ready Monolithic architecture. While currently deployed as a single backend service, the separation of concerns (REST vs. GraphQL, SQL vs. NoSQL) allows for future decoupling if scaling requirements demand it.

#Tech Stack Summary
Frontend: React, Vite, TypeScript, Bootstrap

Backend: Node.js, Express

Database: PostgreSQL (Prisma ORM), MongoDB (Mongoose)

Real-time: Socket.io

DevOps: Docker, Docker Compose

# Key Design Decisions & Justifications
# 1. Frontend: React + Vite + TypeScript
Why React?: Chosen for its component-based architecture which makes managing the UI for complex forms (Inspection details) and lists (Turbine dashboard) modular and reusable.

Why Vite?: Replaces Create-React-App to provide significantly faster hot-module replacement (HMR) and build times, improving developer experience.

Why TypeScript?: Enforces type safety across the entire stack. By sharing types between the frontend and backend (where possible), we reduce runtime errors related to data structures, specifically for the complex Finding and RepairPlan objects.

# 2. Backend: Hybrid REST + GraphQL
We implemented a side-by-side architecture using Express and Apollo Server.

REST API: Used for standard CRUD operations (e.g., creating Turbines, uploading raw inspection packages) where simple HTTP verbs and caching mechanisms are most effective. It adheres to the OpenAPI specification.

GraphQL: Used for complex data fetching, specifically for the Inspection Dashboard. It allows the frontend to query exactly what it needs (e.g., fetching a Turbine with its nested Inspections and their associated Findings) in a single request, preventing over-fetching and under-fetching of data.

# 3. Database Strategy: Polyglot Persistence
The application uses two distinct databases to handle different data shapes effectively:

PostgreSQL (via Prisma):

Purpose: Stores structured, relational core business data (Users, Turbines, Inspections, Findings, Repair Plans).

Reasoning: The strict relationships (e.g., One Inspection has Many Findings) and data integrity required for the core workflow demand a relational database. Prisma was chosen as the ORM for its superior type safety and auto-generated migrations.

MongoDB:

Purpose: Stores high-volume, unstructured Ingestion Logs and telemetry data.

Reasoning: Inspection logs can vary in format and volume. A NoSQL document store offers the flexibility to write these logs rapidly without adhering to a rigid schema, preventing the primary transactional database (Postgres) from being bogged down by logging writes.

# 4. Real-time Updates
Technology: Socket.io

Use Case: Notification of generated Repair Plans.

Reasoning: The "Repair Plan" generation is an asynchronous process involving business logic (calculating priorities and costs). Instead of forcing the user to refresh the page, the server pushes a notification immediately when the calculation is complete, providing a reactive and modern user experience.

# 5. Infrastructure & Containerization
Docker & Docker Compose:

The entire stack (Frontend, Backend, Postgres, Mongo) is containerized.

Benefit: This ensures "it works on my machine" translates to production. It isolates the environment variables and dependencies, allowing the application to be spun up with a single command (docker-compose up).

# 6. Security & Authorization
JWT (JSON Web Tokens): Stateless authentication mechanism.

Role-Based Access Control (RBAC): Distinct guards for ADMIN, ENGINEER, and VIEWER roles ensure that sensitive write operations (like creating a Repair Plan) are restricted to authorized personnel only.
