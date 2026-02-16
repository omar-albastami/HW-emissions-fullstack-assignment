# 🌍 Highwood Emissions Data Platform

## 📋 Table of Contents

- [🌍 Highwood Emissions Data Platform](#-highwood-emissions-data-platform)
  - [📋 Table of Contents](#-table-of-contents)
  - [📎 Overview](#-overview)
  - [🛠 Technology Stack](#-technology-stack)
  - [🚀 Getting Started (Local Development)](#-getting-started-local-development)
    - [1. Clone the repository](#1-clone-the-repository)
    - [2. Create environment file](#2-create-environment-file)
    - [3. Build containers](#3-build-containers)
    - [4. Start the platform](#4-start-the-platform)
  - [🧪 Running API Tests](#-running-api-tests)
  - [🧭 How to Use the Platform](#-how-to-use-the-platform)
    - [Step 1: Create a site (required)](#step-1-create-a-site-required)
    - [Step 2: Ingest Measurements](#step-2-ingest-measurements)
    - [Step 3: View Analytics](#step-3-view-analytics)


## 📎 Overview

This project implements the core of an Emissions Ingestion & Analytics Engine focused on data integrity through idempotent ingestion and concurrency safety. It simulates how industrial methane emissions data can be reliably ingested, summarized, and monitored under unstable network conditions.

The system consists of:
- A **Node.js / Express** backend API
- A **React (Vite)** frontend dashboard
- A **PostgreSQL** database
- Fully containerized local development using **Docker Compose**

---

## 🛠 Technology Stack

**Backend**
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **Validation**: Zod
- **Containerization**: Docker

**Frontend**
- **Framwork**: React 18 (Vite)
- **UI Library**: Bootstrap 5
- **HTTP Client**: Axios

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/omar-albastami/HW-emissions-fullstack-assignment.git emissions_project

cd emissions_project
```

### 2. Create environment file
```bash
cp .env.example .env
```

### 3. Build containers
```bash
docker compose build
```

### 4. Start the platform
```bash
docker compose up
```

Once containers are running:
- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 🧪 Running API Tests

To run backend API tests locally:
```bash
cd apps/api
npm install
npm test
``` 

## 🧭 How to Use the Platform

### Step 1: Create a site (required)
**a. Using Postman or similar:**
```
POST http://localhost:3000/sites
{
    "name": "sites-1",
    "emission_limit": 123.5,
    "metadata": {
        "region": "AB"
    }
}
```

**b. Using curl or similar:**
```bash
curl -X POST http://localhost:3000/sites \
    -H "Content-Type: application/json" \
    -d '{
        "name": "site-1",
        "emission_limit": 123.5,
        "metadata": {
            "region": "AB"
        }
    }'
```
The response will include the created site's `id`.

### Step 2: Ingest Measurements
You can ingest emission measurements via the UI or directly through the API.

**API Example**
```
POST http://localhost:3000/ingest
{
    "batch_id": "85a336b9-1399-4b20-83ab-48688508ea10",
    "site_id": "<insert target site ID>",
    "measurements": [
        { 
            "measured_at": "2026-02-14T00:00:00Z",
            "methane_kg": 60 
        },
        { 
            "measured_at": "2026-02-14T01:00:00Z",
            "methane_kg": 5 
        }
    ]
}
```
⚠️ **Important**: The `batch_id` must remain the same if a request is retried to ensure idempotency and prevent duplicate emissions.

### Step 3: View Analytics
From the UI dashboard, you can:
- View all sites
- See total emissions to date per site
- See compliance status (Within Limit / Limit Exceeded)
- Safely retry failed ingestions

Alternatively, the API can be used to view sites and their associated metrics:
- `GET http://localhost:3000/sites`
- `GET http://localhost:3000/sites/:id/metrics`