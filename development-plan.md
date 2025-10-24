# Development Plan

## 1. Foundational Strategy & Technology Choices

### 1.1. Architectural Pattern Decision

**Decision**: Modular Monolith. This architecture is suitable for a solo developer project as it accelerates development velocity and minimizes operational overhead. There are no explicit requirements in the PRD for polyglot runtimes, disparate scaling needs, or data siloing mandates that would justify a microservices architecture.

### 1.2. Technology Stack Selection

*ENSURE ALL SPECIFIED VERSIONS ARE THE LATEST STABLE RELEASES.*

The technology stack is selected for developer experience, ecosystem maturity, and performance.

#### Frontend Framework & UI:
* **Framework**: Next.js
    * **Version**: Latest stable version (e.g., ~15.x)
    * **Rationale**: Next.js offers a premier React framework with a robust feature set including the App Router, which provides a modern, powerful approach to building layouts and fetching data.
* **UI Components**: shadcn/ui
    * **Version**: Latest version (e.g., ~0.9.x)
    * **Rationale**: shadcn/ui provides a set of unstyled, accessible components that are composed to build a custom UI. This avoids framework lock-in and allows for maximum design flexibility.

#### Backend Runtime & Framework:
* **Runtime**: Python
    * **Version**: Latest stable LTS version (e.g., ~3.12)
    * **Rationale**: Python is a mature, highly readable language with a vast ecosystem of libraries, making it an ideal choice for building robust and maintainable backend services quickly.
* **Framework**: FastAPI
    * **Version**: Latest version (e.g., ~0.116.x)
    * **Rationale**: FastAPI stands out for its incredible performance and developer-friendly features. Its built-in data validation with Pydantic and auto-generated API docs drastically reduce boilerplate code and accelerate the development cycle.

#### Primary Database:
* **Database**: MongoDB Atlas (Free Tier)
    * **Rationale**: MongoDB's document-based model offers exceptional flexibility, which is perfect for agile projects where schemas may evolve. It aligns seamlessly with the object-oriented nature of both our Python backend and JavaScript frontend, and the Atlas free tier is sufficient for development.

### 1.3. Core Infrastructure & Services (Local Development Focus)

Define the supporting services needed for an efficient local development loop. The primary goal is to eliminate unnecessary complexity and friction.

* **Local Development**: The project will be run with simple command-line instructions: `npm run dev` for the frontend and `uvicorn main:app --reload` for the backend. No containerization (e.g., Docker) is required.
* **File Storage**: For any file uploads specified in the PRD, a simple local filesystem approach will be used via a git-ignored `./uploads` directory in the backend project.
* **Authentication**: A standard, library-based JWT (JSON Web Tokens) approach will be implemented. This is a secure and stateless method perfect for a monolithic API architecture.
* **External Services**: Enumerate any third-party APIs essential to the project (e.g., Stripe, SendGrid, OpenAI).

### 1.4. Integration and API Strategy

* **API Style**: A versioned REST API (e.g., `/api/v1/...`) will be used for all communication between the frontend and backend.
* **Standard Formats**: All API responses will adhere to a consistent JSON structure for success and error states.

### 1.5. Deployment Infrastructure

Define the deployment strategy for both frontend and backend throughout the development process.

* **Frontend Deployment (Vercel)**:
  - Connect GitHub repository to Vercel
  - Enable automatic deployments from sprint branches
  - Each sprint branch will get its own preview URL
  - Environment variables: Configure in Vercel dashboard
  - Custom domain (optional): Configure after merging to main

* **Backend Deployment (Render)**:
  - Connect GitHub repository to Render
  - Create web service with automatic deploys
  - Configure branch deploys for sprint branches
  - Environment variables: Set in Render dashboard (DATABASE_URL, JWT_SECRET, etc.)
  - Ensure MongoDB Atlas allows connections from Render IPs

* **Deployment Testing**:
  - Each sprint must be tested on deployed infrastructure before PR approval
  - Frontend and backend must communicate correctly in deployed environment
  - All environment-specific issues must be resolved before merging to main

## 2. Application Anatomy & Design

### 2.1. Module Identification

* **Domain Modules**: (e.g., AuthModule, WorkloadModule, ResourceModule, BillingModule, MonitoringModule)
* **Infrastructure Modules**: (e.g., DatabaseModule, NotificationModule)
* **Shared Module**: (e.g., for common UI components, hooks, and type definitions)

### 2.2. Module Responsibilities and Interfaces

* **Responsibilities**: Define what each module owns (e.g., "The AuthModule is responsible for user registration, login, and session management. It controls the `users` collection and all related API endpoints.").
* **Interface**: Define how modules interact (e.g., "The ProjectModule exposes functions for other modules to use.").

### 2.3. Core Module Design

* **Folder Structure**: Propose a feature-based folder structure for the frontend and a logical structure for the backend (e.g., `/routers`, `/services`, `/models`).
* **Key Patterns**: Mention the use of the Repository Pattern for data access logic and a Service Layer for business logic.

## 3. Incremental Delivery Plan

### THE SPRINT PLAN

#### Sprint 0: Groundwork & Scaffolding
* **Sprint ID**: S0: Groundwork & Scaffolding
* **Project Context**: The MARA Hybrid Compute Platform (HCP) is a cloud-native orchestration system that dynamically allocates computational resources between Bitcoin mining and AI inference workloads based on real-time economic signals.
* **Goal**: To establish a fully configured, runnable project with a frontend and backend that can communicate, connect to the database, and are ready for feature development.
* **Tasks**:
  - **1. Repository Synchronization**: 
      * **USER INPUT REQUIRED**: Ask the user for the URL of their new, empty GitHub repository.
      * **WHY**: This is needed to set up version control and push the initial project structure.
      * **FORMAT**: Provide the full GitHub repository URL (e.g., `https://github.com/username/project-name.git`)
      * **ACTION**: Clone the repository locally and set up the initial project structure.
  - **2. Environment Configuration**: 
      * **USER INPUT REQUIRED**: Ask the user for their MongoDB Atlas connection string and any other required API keys. Ask for primary and secondary theme colors (hex codes).
      * **WHY**: MongoDB connection is needed for database setup, API keys for third-party integrations, and theme colors for UI customization.
      * **FORMAT**: 
        - MongoDB: `mongodb+srv://username:password@cluster.mongodb.net/database`
        - API Keys: As provided by the service (Stripe, SendGrid, etc.)
        - Theme Colors: Hex codes (e.g., `#3B82F6` for primary, `#1E40AF` for secondary)
      * **ACTION**: Create `.env.example` and `.env` files with the provided configuration.
  - **3. Project Structure**: Create a root directory with `frontend` and `backend` subdirectories. Initialize Git and create a root `.gitignore`.
  - **4. Backend Setup (Python/FastAPI)**: Set up a Python virtual environment in `/backend`. Install `fastapi`, `uvicorn`, `pydantic`, `python-dotenv`, and other core dependencies into `requirements.txt`. Create `.env.example` and `.env` files, populating the latter with the `DATABASE_URL`.
  - **5. Frontend Setup (Next.js)**: Scaffold a new Next.js app in `/frontend`. Initialize shadcn/ui and configure `tailwind.config.js` with the user-provided theme colors.
  - **6. Documentation**: Create a root `README.md` with the project context, tech stack, and instructions for running both frontend and backend servers.
  - **7. "Health Check" Verification**:
      * **Backend**: Create a `/api/v1/health` endpoint that connects to MongoDB and returns `{"status": "ok"}`.
      * **Frontend**: Create a page that fetches from the backend health endpoint and displays the status.
      * **USER INPUT REQUIRED**: Ask the user to run both services, open the browser, and confirm they see "Status: ok" and that the backend terminal shows a successful database connection.
      * **WHY**: This confirms the entire setup is working correctly before proceeding to feature development.
  - **8. Sprint Branch, Commit & Deployment**: After user confirmation, create sprint branch, commit, deploy, and create PR.
      * Create a new branch: `git checkout -b sprint-0`
      * Stage all files: `git add .`
      * Confirm with the user before committing
      * **Commit Format**:
        ```
        chore(sprint-0): initial project setup and scaffolding
        
        Sprint 0 Accomplishments:
        - Set up Next.js frontend with shadcn/ui and Tailwind CSS
        - Configured FastAPI backend with Python virtual environment
        - Integrated MongoDB Atlas database connection
        - Created environment configuration with .env files
        - Implemented health check endpoint and verification page
        - Added comprehensive README with setup instructions
        - Established version control with Git and GitHub
        ```
      * Push branch: `git push origin sprint-0`
      * **Deploy Frontend to Vercel**:
        - Connect the repository to Vercel (if first time)
        - Deploy from `sprint-0` branch
        - Note the preview URL (e.g., `https://project-name-sprint-0.vercel.app`)
      * **Deploy Backend to Render**:
        - Connect the repository to Render (if first time)
        - Create/update web service to deploy from `sprint-0` branch
        - Configure environment variables (DATABASE_URL, etc.)
        - Note the service URL (e.g., `https://project-name-sprint-0.onrender.com`)
      * **USER INPUT REQUIRED**: Ask user to test the deployed application using the Vercel and Render URLs
      * **WHY**: This confirms the application works in a production-like environment
      * **FORMAT**: User should confirm both frontend and backend are accessible and the health check works
      * Create Pull Request against `main` branch with title: "Sprint 0: Initial Project Setup and Scaffolding"
      * PR description should include:
        - Sprint accomplishments list
        - Vercel preview URL
        - Render backend URL
        - Testing instructions
* **Verification Criteria**: The developer can clone the repo, follow the README to install dependencies and run both services, and see a working "health check" page. All code is on the GitHub `main` branch.

---
#### Sprint 1: Core User Identity & Authentication
* **Sprint ID**: S1: Core User Identity & Authentication
* **Project Context**: The MARA Hybrid Compute Platform (HCP) is a cloud-native orchestration system that dynamically allocates computational resources between Bitcoin mining and AI inference workloads based on real-time economic signals. This sprint establishes the foundational user system, a prerequisite for any personalized content.
* **Previous Sprint's Accomplishments**: S0 delivered a runnable local development environment with a working frontend, backend, and database connection. The codebase is on GitHub.
* **Goal**: To implement a complete, secure user registration and login flow using JWTs.
* **Relevant Requirements & User Stories**:
  * "As a user, I need to create a new account with my email and password."
  * "As a user, I need to log in to access my personal dashboard."
* **Tasks**:
  - **1. Database Model**: Define a Pydantic model for the `User` collection in the backend (e.g., `email`, `hashed_password`).
  - **2. Backend: Registration Logic**:
      * Add `passlib` and `python-jose` to `requirements.txt` for hashing and JWTs.
      * Implement the `POST /api/v1/auth/register` endpoint to hash a password and create a new user in MongoDB.
      * **USER INPUT REQUIRED**: Ask the user to test this endpoint with an API client (e.g., Postman) and verify the new user appears in the MongoDB Atlas collection with a hashed password.
      * **WHY**: This confirms the registration logic works correctly and data is properly stored.
      * **FORMAT**: User should provide confirmation that they can see the new user in MongoDB Atlas.
  - **3. Backend: Login Logic**:
      * Implement the `POST /api/v1/auth/login` endpoint to verify credentials and return a JWT access token.
      * **USER INPUT REQUIRED**: Ask the user to test this endpoint with both correct and incorrect credentials.
      * **WHY**: This confirms authentication works correctly and handles invalid credentials properly.
      * **FORMAT**: User should confirm successful login with valid credentials and proper error handling with invalid credentials.
  - **4. Backend: Protected Route**:
      * Create a FastAPI dependency to validate JWTs from request headers.
      * Create a protected `GET /api/v1/users/me` endpoint that returns the current user's data.
      * **USER INPUT REQUIRED**: Ask the user to test this endpoint with and without a valid token.
      * **WHY**: This confirms JWT validation works correctly and protected routes are properly secured.
      * **FORMAT**: User should confirm access with valid token and denial without token.
  - **5. Frontend: UI & State**:
      * Build Login and Register pages using shadcn/ui components.
      * Set up a React Context for managing the user's session and token.
      * **USER INPUT REQUIRED**: Ask the user to review the pages in the browser.
      * **WHY**: This confirms the UI components render correctly and the design looks good.
      * **FORMAT**: User should confirm the pages look good and are responsive.
  - **6. Frontend: End-to-End Flow**:
      * Wire up the forms to call the backend registration and login endpoints.
      * Implement logic to store the JWT in local storage and update the session context.
      * Create a protected `/profile` page that redirects to `/login` if no valid token is present.
      * On the `/profile` page, fetch and display data from the `/api/v1/users/me` endpoint.
      * **USER INPUT REQUIRED**: Ask the user to perform a full end-to-end test: register, log in, view the protected profile page, log out, and then be denied access to the profile page.
      * **WHY**: This confirms the entire authentication flow works correctly from frontend to backend.
      * **FORMAT**: User should confirm they can complete the full user journey successfully.
  - **7. Sprint Branch, Commit & Deployment**: After user confirmation of all features, create sprint branch, commit, deploy, and create PR.
      * Create a new branch: `git checkout -b sprint-1`
      * Stage all files: `git add .`
      * Confirm with the user before committing
      * **Commit Format**:
        ```
        feat(sprint-1): implement user identity and authentication
        
        Sprint 1 Accomplishments:
        - Created User database model with email and hashed password
        - Implemented user registration endpoint with password hashing
        - Built login endpoint with JWT token generation
        - Added JWT validation middleware for protected routes
        - Created /api/v1/users/me endpoint for current user data
        - Designed and built Login and Register UI pages
        - Implemented React Context for session management
        - Established end-to-end authentication flow with token storage
        - Added protected route logic with authentication redirects
        ```
      * Push branch: `git push origin sprint-1`
      * **Deploy Frontend to Vercel**:
        - Deploy from `sprint-1` branch
        - Note the preview URL (e.g., `https://project-name-sprint-1.vercel.app`)
      * **Deploy Backend to Render**:
        - Update web service to deploy from `sprint-1` branch
        - Note the service URL (e.g., `https://project-name-sprint-1.onrender.com`)
      * **USER INPUT REQUIRED**: Ask user to test the authentication flow on deployed URLs
      * **WHY**: This confirms the authentication system works in production environment
      * **FORMAT**: User should confirm they can register, login, and access protected routes on the deployed app
      * Create Pull Request against `main` branch with title: "Sprint 1: User Identity and Authentication"
      * PR description should include:
        - Sprint accomplishments list
        - Vercel preview URL
        - Render backend URL
        - Testing instructions for authentication flow
* **Verification Criteria**: A new user can register, log in, view a protected profile page, and log out. All user data is correctly stored and secured in MongoDB. All code is on the `main` branch.

---
#### Sprint 2: Economic Optimization Engine - Real-time Price Ingestion
* **Sprint ID**: S2: Economic Optimization Engine - Real-time Price Ingestion
* **Project Context**: The MARA Hybrid Compute Platform (HCP) is a cloud-native orchestration system that dynamically allocates computational resources between Bitcoin mining and AI inference workloads based on real-time economic signals. This sprint focuses on ingesting real-time price data for electricity, GPU spot rates, and BTC prices, which is crucial for the economic optimization engine.
* **Previous Sprint's Accomplishments**: S1 delivered a complete user identity and authentication system with secure registration and login flows.
* **Goal**: To implement real-time price ingestion for electricity prices, GPU spot rates, and BTC prices, enabling the economic optimization engine to make informed decisions.
* **Relevant Requirements & User Stories**:
  * "As a system, I need to ingest real-time electricity prices from various sources."
  * "As a system, I need to ingest real-time GPU spot rates from various providers."
  * "As a system, I need to ingest real-time BTC prices from various exchanges."
* **Tasks**:
  - **1. Database Model & Schema Design**:
      * Define Pydantic models for storing electricity prices, GPU spot rates, and BTC prices.
      * Create database tables/collections for storing the ingested data.
      * Implement data validation and constraints.
      * Document field types, relationships, and business rules.
      * **USER INPUT REQUIRED**: Ask user to review database schema design for price data.
      * **WHY**: Ensures data structure supports all required operations for price ingestion and analysis.
      * **FORMAT**: User should confirm schema includes all necessary fields and indexes for price data.
  - **2. Backend: Real-time Price Ingestion Logic**:
      * Implement API endpoints for ingesting electricity prices from various sources (e.g., ERCOT).
      * Implement API endpoints for ingesting GPU spot rates from various providers (e.g., AWS, Azure, GCP).
      * Implement API endpoints for ingesting BTC prices from various exchanges (e.g., Coinbase, Binance).
      * Add request/response validation with Pydantic models.
      * Implement error handling and status codes.
      * Implement authentication/authorization where needed.
      * **USER INPUT REQUIRED**: Ask user to test all API endpoints for price ingestion.
      * **WHY**: Confirms all backend operations work correctly for ingesting real-time price data.
      * **FORMAT**: User should confirm they can successfully send price data to the API endpoints and that the data is stored correctly in the database.
  - **3. Backend: Data Processing and Storage**:
      * Implement data processing and transformation logic for the ingested price data.
      * Store the processed price data in the database.
      * Implement data aggregation and summarization logic.
      * Add performance optimizations and caching.
      * **USER INPUT REQUIRED**: Ask user to confirm that the ingested price data is being processed and stored correctly in the database.
      * **WHY**: Confirms business logic works correctly for price data processing and storage.
      * **FORMAT**: User should confirm all business rules are properly implemented for price data.
  - **4. Frontend: Monitoring UI**:
      * Build UI components for monitoring real-time price data using shadcn/ui.
      * Implement data visualization for price trends.
      * Implement form validation and error handling.
      * Set up React state management (Context/Redux).
      * Add loading states and optimistic updates.
      * Implement proper error boundaries.
      * **USER INPUT REQUIRED**: Ask user to review UI components and interactions for price monitoring.
      * **WHY**: Confirms UI provides intuitive user experience for monitoring real-time price data.
      * **FORMAT**: User should confirm UI looks good and all interactions work smoothly for price monitoring.
  - **5. Frontend: End-to-End Flow**:
      * Wire up frontend to backend API calls for fetching real-time price data.
      * Implement data flow from UI to database.
      * Add comprehensive error handling.
      * Implement real-time updates if needed.
      * Add analytics and performance monitoring.
      * **USER INPUT REQUIRED**: Ask user to perform complete end-to-end testing of the price ingestion and monitoring system.
      * **WHY**: Confirms entire feature works correctly from frontend to backend for real-time price data.
      * **FORMAT**: User should confirm they can complete the full user journey successfully for price data ingestion and monitoring.
  - **6. Sprint Branch, Commit & Deployment**: After user confirmation of all features, create sprint branch, commit, deploy, and create PR.
      * Create a new branch: `git checkout -b sprint-2`
      * Stage all files: `git add .`
      * Confirm with the user before committing
      * **Commit Format**:
        ```
        feat(sprint-2): implement real-time price ingestion for economic optimization engine
        
        Sprint 2 Accomplishments:
        - Created database schema for storing electricity prices, GPU spot rates, and BTC prices
        - Implemented API endpoints for ingesting real-time price data from various sources
        - Implemented data processing and transformation logic for price data
        - Built UI components for monitoring real-time price data
        - Implemented end-to-end flow for price data ingestion and monitoring
        ```
      * Push branch: `git push origin sprint-2`
      * **Deploy Frontend to Vercel**:
        - Deploy from `sprint-2` branch
        - Note the preview URL (e.g., `https://project-name-sprint-2.vercel.app`)
      * **Deploy Backend to Render**:
        - Update web service to deploy from `sprint-2` branch
        - Note the service URL (e.g., `https://project-name-sprint-2.onrender.com`)
      * **USER INPUT REQUIRED**: Ask user to test the complete feature flow on deployed URLs for price ingestion and monitoring.
      * **WHY**: This confirms the feature works correctly in production environment for real-time price data.
      * **FORMAT**: User should confirm they can complete the full user journey on the deployed app for price data ingestion and monitoring.
      * Create Pull Request against `main` branch with title: "Sprint 2: Economic Optimization Engine - Real-time Price Ingestion"
      * PR description should include:
        - Sprint accomplishments list
        - Vercel preview URL
        - Render backend URL
        - Testing instructions for price data ingestion and monitoring
* **Verification Criteria**: The system can successfully ingest real-time price data from various sources, store the data in the database, and display the data in the frontend UI. All code is on the `main` branch.

---
#### Sprint 3: Economic Optimization Engine - Profitability Calculator
* **Sprint ID**: S3: Economic Optimization Engine - Profitability Calculator
* **Project Context**: The MARA Hybrid Compute Platform (HCP) is a cloud-native orchestration system that dynamically allocates computational resources between Bitcoin mining and AI inference workloads based on real-time economic signals. This sprint focuses on implementing the profitability calculator, which will calculate the ROI for each workload type per resource.
* **Previous Sprint's Accomplishments**: S2 delivered real-time price ingestion for electricity prices, GPU spot rates, and BTC prices.
* **Goal**: To implement the profitability calculator, enabling the system to calculate the ROI for each workload type per resource based on real-time price data.
* **Relevant Requirements & User Stories**:
  * "As a system, I need to calculate the ROI for each workload type (Bitcoin mining, AI inference) per resource (GPU, ASIC)."
  * "As a system, I need to take into account electricity prices, GPU spot rates, BTC prices, and resource utilization when calculating ROI."
* **Tasks**:
  - **1. Database Model & Schema Design**:
      * Define Pydantic models for storing resource utilization data and workload performance metrics.
      * Create database tables/collections for storing the calculated ROI values.
      * Implement data validation and constraints.
      * Document field types, relationships, and business rules.
      * **USER INPUT REQUIRED**: Ask user to review database schema design for ROI data.
      * **WHY**: Ensures data structure supports all required operations for storing and analyzing ROI data.
      * **FORMAT**: User should confirm schema includes all necessary fields and indexes for ROI data.
  - **2. Backend: Profitability Calculation Logic**:
      * Implement API endpoints for calculating the ROI for each workload type per resource.
      * Implement logic to fetch real-time price data from the database.
      * Implement logic to fetch resource utilization data from the database.
      * Implement the ROI calculation algorithm.
      * Add request/response validation with Pydantic models.
      * Implement error handling and status codes.
      * Implement authentication/authorization where needed.
      * **USER INPUT REQUIRED**: Ask user to test all API endpoints for profitability calculation.
      * **WHY**: Confirms all backend operations work correctly for calculating ROI.
      * **FORMAT**: User should confirm they can successfully send requests to the API endpoints and that the calculated ROI values are correct.
  - **3. Backend: Data Processing and Storage**:
      * Implement data processing and transformation logic for the calculated ROI values.
      * Store the calculated ROI values in the database.
      * Implement data aggregation and summarization logic.
      * Add performance optimizations and caching.
      * **USER INPUT REQUIRED**: Ask user to confirm that the calculated ROI values are being processed and stored correctly in the database.
      * **WHY**: Confirms business logic works correctly for ROI data processing and storage.
      * **FORMAT**: User should confirm all business rules are properly implemented for ROI data.
  - **4. Frontend: Monitoring UI**:
      * Build UI components for monitoring the calculated ROI values using shadcn/ui.
      * Implement data visualization for ROI trends.
      * Implement form validation and error handling.
      * Set up React state management (Context/Redux).
      * Add loading states and optimistic updates.
      * Implement proper error boundaries.
      * **USER INPUT REQUIRED**: Ask user to review UI components and interactions for ROI monitoring.
      * **WHY**: Confirms UI provides intuitive user experience for monitoring ROI data.
      * **FORMAT**: User should confirm UI looks good and all interactions work smoothly for ROI monitoring.
  - **5. Frontend: End-to-End Flow**:
      * Wire up frontend to backend API calls for fetching the calculated ROI values.
      * Implement data flow from UI to database.
      * Add comprehensive error handling.
      * Implement real-time updates if needed.
      * Add analytics and performance monitoring.
      * **USER INPUT REQUIRED**: Ask user to perform complete end-to-end testing of the profitability calculation and monitoring system.
      * **WHY**: Confirms entire feature works correctly from frontend to backend for ROI data.
      * **FORMAT**: User should confirm they can complete the full user journey successfully for ROI calculation and monitoring.
  - **6. Sprint Branch, Commit & Deployment**: After user confirmation of all features, create sprint branch, commit, deploy, and create PR.
      * Create a new branch: `git checkout -b sprint-3`
      * Stage all files: `git add .`
      * Confirm with the user before committing
      * **Commit Format**:
        ```
        feat(sprint-3): implement profitability calculator for economic optimization engine
        
        Sprint 3 Accomplishments:
        - Created database schema for storing resource utilization data and workload performance metrics
        - Implemented API endpoints for calculating the ROI for each workload type per resource
        - Implemented data processing and transformation logic for ROI values
        - Built UI components for monitoring the calculated ROI values
        - Implemented end-to-end flow for ROI calculation and monitoring
        ```
      * Push branch: `git push origin sprint-3`
      * **Deploy Frontend to Vercel**:
        - Deploy from `sprint-3` branch
        - Note the preview URL (e.g., `https://project-name-sprint-3.vercel.app`)
      * **Deploy Backend to Render**:
        - Update web service to deploy from `sprint-3` branch
        - Note the service URL (e.g., `https://project-name-sprint-3.onrender.com`)
      * **USER INPUT REQUIRED**: Ask user to test the complete feature flow on deployed URLs for ROI calculation and monitoring.
      * **WHY**: This confirms the feature works correctly in production environment for ROI data.
      * **FORMAT**: User should confirm they can complete the full user journey successfully for ROI calculation and monitoring.
* **Verification Criteria**: The system can successfully calculate the ROI for each workload type per resource, store the ROI values in the database, and display the ROI values in the frontend UI. All code is on the `main` branch.

---
#### Sprint 4: Workload Router - Workload Classification
* **Sprint ID**: S4: Workload Router - Workload Classification
* **Project Context**: The MARA Hybrid Compute Platform (HCP) is a cloud-native orchestration system that dynamically allocates computational resources between Bitcoin mining and AI inference workloads based on real-time economic signals. This sprint focuses on implementing workload classification, which will identify the workload type and its requirements.
* **Previous Sprint's Accomplishments**: S3 delivered the profitability calculator, enabling the system to calculate the ROI for each workload type per resource.
* **Goal**: To implement workload classification, enabling the system to identify the workload type and its requirements for intelligent routing.
* **Tasks**:
  - **1. Database Model & Schema Design**:
      * Define Pydantic models for storing workload types and their requirements.
      * Create database tables/collections for storing the workload classification rules.
      * Implement data validation and constraints.
      * Document field types, relationships, and business rules.
      * **USER INPUT REQUIRED**: Ask user to review database schema design for workload classification data.
      * **WHY**: Ensures data structure supports all required operations for storing and analyzing workload classification data.
      * **FORMAT**: User should confirm schema includes all necessary fields and indexes for workload classification data.
  - **2. Backend: Workload Classification Logic**:
      * Implement API endpoints for classifying incoming workloads.
      * Implement logic to identify the workload type based on its characteristics.
      * Implement logic to extract the workload requirements (GPU type, memory, latency).
      * Add request/response validation with Pydantic models.
      * Implement error handling and status codes.
      * Implement authentication/authorization where needed.
      * **USER INPUT REQUIRED**: Ask user to test all API endpoints for workload classification.
      * **WHY**: Confirms all backend operations work correctly for classifying workloads.
      * **FORMAT**: User should confirm they can successfully send requests to the API endpoints and that the workloads are classified correctly.
  - **3. Backend: Data Processing and Storage**:
      * Implement data processing and transformation logic for the classified workloads.
      * Store the classified workloads in the database.
      * Implement data aggregation and summarization logic.
      * Add performance optimizations and caching.
      * **USER INPUT REQUIRED**: Ask user to confirm that the classified workloads are being processed and stored correctly in the database.
      * **WHY**: Confirms business logic works correctly for workload classification data processing and storage.
      * **FORMAT**: User should confirm all business rules are properly implemented for workload classification data.
  - **4. Frontend: Monitoring UI**:
      * Build UI components for monitoring the workload classification process using shadcn/ui.
      * Implement data visualization for workload types and their requirements.
      * Implement form validation and error handling.
      * Set up React state management (Context/Redux).
      * Add loading states and optimistic updates.
      * Implement proper error boundaries.
      * **USER INPUT REQUIRED**: Ask user to review UI components and interactions for workload classification monitoring.
      * **WHY**: Confirms UI provides intuitive user experience for monitoring workload classification data.
      * **FORMAT**: User should confirm UI looks good and all interactions work smoothly for workload classification monitoring.
  - **5. Frontend: End-to-End Flow**:
      * Wire up frontend to backend API calls for classifying incoming workloads.
      * Implement data flow from UI to database.
      * Add comprehensive error handling.
      * Implement real-time updates if needed.
      * Add analytics and performance monitoring.
      * **USER INPUT REQUIRED**: Ask user to perform complete end-to-end testing of the workload classification system.
      * **WHY**: Confirms entire feature works correctly from frontend to backend for workload classification data.
      * **FORMAT**: User should confirm they can complete the full user journey successfully for workload classification.
  - **6. Sprint Branch, Commit & Deployment**: After user confirmation of all features, create sprint branch, commit, deploy, and create PR.
      * Create a new branch: `git checkout -b sprint-4`
      * Stage all files: `git add .`
      * Confirm with the user before committing
      * **Commit Format**:
        ```
        feat(sprint-4): implement workload classification for workload router
        
        Sprint 4 Accomplishments:
        - Created database schema for storing workload types and their requirements
        - Implemented API endpoints for classifying incoming workloads
        - Implemented data processing and transformation logic for classified workloads
        - Built UI components for monitoring the workload classification process
        - Implemented end-to-end flow for workload classification
        ```
      * Push branch: `git push origin sprint-4`
      * **Deploy Frontend to Vercel**:
        - Deploy from `sprint-4` branch
        - Note the preview URL (e.g., `https://project-name-sprint-4.vercel.app`)
      * **Deploy Backend to Render**:
        - Update web service to deploy from `sprint-4` branch
        - Note the service URL (e.g., `https://project-name-sprint-4.onrender.com`)
      * **USER INPUT REQUIRED**: Ask user to test the complete feature flow on deployed URLs for workload classification.
      * **WHY**: This confirms the feature works correctly in production environment for workload classification data.
      * **FORMAT**: User should confirm they can complete the full user journey successfully for workload classification.
      * Create Pull Request against `main` branch with title: "Sprint 4: Workload Router - Workload Classification"
      * PR description should include:
        - Sprint accomplishments list
        - Vercel preview URL
        - Render backend URL
        - Testing instructions for workload classification
* **Verification Criteria**: The system can successfully classify incoming workloads based on their type and requirements, store the classified workloads in the database, and display the workload classification data in the frontend UI. All code is on the `main` branch.

---
#### Sprint 5: Workload Router - Intelligent Routing
* **Sprint ID**: S5: Workload Router - Intelligent Routing
* **Project Context**: The MAR
