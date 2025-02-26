# Mamba Culture Campaign Manager 🎯

Technical Challenge!

---

## Table of Contents 📚

- [Mamba Culture Campaign Manager 🎯](#mamba-culture-campaign-manager-)
  - [Table of Contents 📚](#table-of-contents-)
  - [Introduction 🚀](#introduction-)
  - [Getting Started 🛠️](#getting-started-️)
    - [Prerequisites 📝](#prerequisites-)
    - [Installation 🧑‍💻](#installation-)
    - [Optional: Containerized Development Environment 🐳](#optional-containerized-development-environment-)
  - [Running the Application 🚀](#running-the-application-)
    - [Development Mode 🌱](#development-mode-)
    - [Production Mode 🚢](#production-mode-)
    - [Running Tests 🧪](#running-tests-)
  - [Project Structure 📂](#project-structure-)
  - [Documentation 📖](#documentation-)
    - [API Documentation 📜](#api-documentation-)
    - [Environment Variables 🔧](#environment-variables-)

---

## Introduction 🚀

Mamba Culture Campaign Manager is a backend API designed using [NestJS](https://nestjs.com/), a progressive Node.js framework, and [Prisma](https://www.prisma.io/), an ORM that streamlines database interactions. The application follows a layered architecture that divides responsibilities into presentation, application, domain, and infrastructure layers. This ensures the system is maintainable, scalable, and robust, making it an excellent choice for managing campaigns in a variety of use cases.

Key features include:
- **CRUD operations**: Create, retrieve, update, and soft delete campaigns.
- **Search & Pagination**: Retrieve campaign data efficiently with flexible search and pagination options.
- **Scalability**: Built with maintainability in mind, making it easy to extend and scale.

---

## Getting Started 🛠️

### Prerequisites 📝

Before running the application, ensure you have the following installed:

- **Node.js**: Check the version specified in `.nvmrc` or `package.json`.
- **pnpm**: This project uses [pnpm](https://pnpm.io/) as the package manager. Install it globally using:

  ```bash
  npm install -g pnpm
  ```

### Installation 🧑‍💻

1. **Clone the repository**:

   ```bash
   git clone https://github.com/paulocheloni/Mamba_culture.git
   cd Mamba_culture
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Set up the database with Prisma**:

   ```bash
   pnpm run prisma migrate dev
   ```

4. **Start the application in development mode**:

   ```bash
   pnpm run start:dev
   ```

   The server will now be available at [http://localhost:3000](http://localhost:3000).

5. **Code Formatting**:

   Before committing any changes, ensure your code is formatted according to the project standards:

   ```bash
   pnpm run format
   ```

### Optional: Containerized Development Environment 🐳

For a containerized setup, you can use Docker to spin up the necessary containers.

1. **Start the database container**:

   ```bash
   docker compose up -d
   ```

2. Once the container is running, follow the installation steps above.

---

## Running the Application 🚀

### Development Mode 🌱

To run the application in development mode with hot reloading, use:

```bash
pnpm run start:dev
```

### Production Mode 🚢

To build and run the application in production mode:

1. **Build the application**:

   ```bash
   pnpm run build
   ```

2. **Start the production server**:

   ```bash
   pnpm run start
   ```

### Running Tests 🧪

To ensure your application is working as expected, you can run the following tests:

- **Unit Tests**:

  ```bash
  pnpm run test
  ```

  The unit tests generate custom reports in the `ctrf` folder for detailed test coverage analysis. This is configured using `jest.config.js`.

  
- **End-to-End (e2e) Tests**:

  ```bash
  pnpm run test:e2e
  ```


- **Run Tests with Specific Patterns**:

  ```bash
  pnpm test "campaign.usecase"
  ```

---

## Project Structure 📂

The project follows a layered architecture designed for maintainability and scalability. Here’s an overview of the key directories:

```
.
├── biome.json
├── ctrf
│   └── ctrf-report.json
├── documentation
│   └── (Compodoc generated API and code documentation)
├── prisma
│   ├── migrations
│   └── schema.prisma
├── src
│   ├── campaign
│   │   ├── application         # Business logic and use cases (e.g., create, update, delete, get campaign)
│   │   ├── domain              # Domain entities, builders, and repository interfaces
│   │   ├── infra               # Database operations (Prisma repositories) and external integrations
│   │   └── presentation        # REST API controllers and request/response DTOs
│   ├── main.ts
│   └── shared                 # Shared utilities, error handling, interceptors, etc.
├── test                      # Unit and e2e tests
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
└── README.md
```

For a detailed view of the project structure, refer to the directory tree above.

---

## Documentation 📖

### API Documentation 📜

The API offers endpoints to manage campaigns, including:

- **POST /campaign**: Create a new campaign.
- **GET /campaign**: Retrieve a list of active campaigns, with search and pagination.
- **GET /campaign/:id**: Retrieve a specific campaign by ID.
- **PUT /campaign/:id**: Update an existing campaign.
- **DELETE /campaign/:id**: Soft delete a campaign.

**Swagger**: Integrated on ${host}:${port}/api -> <http://localhost:3000/api>

**Compodoc**: ```pnpm compodoc``` -> <http://localhost:8080> 

Interactive API documentation is available via Swagger UI when the application is running.

### Environment Variables 🔧

Make sure to set the following environment variables in your `.env` file or as system environment variables:

- **DATABASE_URL**: The connection string for your Prisma database.
- **FRONTEND_URL**: The URL of your frontend application (for CORS configuration).
- **NODE_ENV**: The environment mode (e.g., `development`, `production`, `test`).
- **PORT**: the host port to run the application:
- **DB_**: Variables to connect the application to prisma









