# PortalApp - Full-Stack Dashboard & Client Management System

This is the development repository for **PortalApp**, a full-stack dashboard and client management application built using React (frontend), Node.js / Express (backend), and a PostgreSQL database layer. 

## Project Overview

PortalApp is designed to connect clients with service helpers, featuring dedicated interfaces for Clients, Helpers, and Administrators. It includes transaction ledger management, user directory moderation, and real-time security logging.

---

## Active Issues & Feature Requests (To Be Resolved)

Before delivering this application to the client, we have a few outstanding issues and features that need to be addressed. The current codebase is fully structured, and changes should be clean, targeted, and well-integrated.

### 1. [Bug] Login Redirect Instability (Frontend)
*   **Description**: Sometimes, after a user successfully signs in, they are not redirected to the correct dashboard page (e.g., Client Portal vs. Helper Portal). This bug is inconsistent, but it is definitely a frontend-side routing or state handling issue.
*   **Target Scope**: Inspect the login handlers, local storage token checks, and route redirection logic in the React code.

### 2. [Bug] Dashboard Filtering Inaccuracy (Backend/API)
*   **Description**: The dashboard has a filter option that is not returning the correct data subset, indicating that the API query or filtering parameters are off.
*   **Target Scope**: Inspect the backend endpoints (specifically the SQL queries or filter criteria logic) handling database filters.

### 3. [Feature] CSV Export Button (Dashboard)
*   **Description**: Add a simple, clean "Export to CSV" button to the dashboard table. This button should allow users to download a CSV file of the records currently shown in their table.
*   **Target Scope**: Add a button on the React dashboard interface and implement CSV generation logic (either client-side or server-side).

---

## Technical Stack

*   **Frontend**: React (SPA)
*   **Backend**: Node.js & Express REST API
*   **Database**: PostgreSQL
*   **Authentication**: JSON Web Token (JWT)

---

## Setup & Local Development

### Prerequisites
*   Node.js (v18 or higher)
*   npm

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/hubert-m-dev/portalapp.git
    cd portalapp
    ```

2.  **Install dependencies**:
    *   **Frontend**:
        ```bash
        npm install
        ```
    *   **Backend Server**:
        ```bash
        cd server
        npm install
        cd ..
        ```

### Running the App

Run both the frontend and backend concurrently from the root directory:
```bash
npm run dev
```

*   **Frontend Client**: http://localhost:5173
*   **Backend Server**: http://localhost:5000
