# Mamba Culture Campaign Manager

HTTP API for creating, updating, listing, and soft-deleting campaigns. A campaign has a name, a category (`seasonal`, `regular`, or `special`), a start and end date, and a status (`active`, `paused`, or `expired`). The service is a NestJS application split into presentation, application, domain, and infrastructure layers, with PostgreSQL persistence through Prisma. Date order, expiry, and deletion rules live on the campaign entity, and use cases return a `Result` that a global interceptor turns into the HTTP response. Swagger UI is served at `/api` while the process is running.

## Tech stack

- **Runtime:** Node.js 20+ (required by NestJS 11) and TypeScript
- **HTTP:** NestJS 11 on Express
- **Data:** PostgreSQL, Prisma 6, and `nestjs-prisma`. The Prisma client is extended with `prisma-paginate`; the list query itself uses `skip` / `take` plus a count
- **Validation:** Zod for environment variables; `class-validator` and `class-transformer` for request bodies and queries
- **API docs:** `@nestjs/swagger`. A `compodoc` script generates static code documentation
- **Tests:** Jest 29 via `@swc/jest`, Supertest for HTTP e2e tests, and `@suites/unit` with `@suites/doubles.jest` for use-case and repository unit tests
- **Tooling:** pnpm, Biome, SWC as the Nest builder, and Docker Compose for a Postgres container

## Key features

- **Create.** `POST /campaign` stores a campaign as `active` and assigns a UUID. A name already used by a campaign that is still present (`deletedAt` unset) is rejected with `CAMPAIGN_ALREADY_EXISTS`.
- **Read.** `GET /campaign/:id` returns one campaign whose `deletedAt` is unset.
- **Update.** `PUT /campaign/:id` writes name, category, start date, end date, and status for a campaign that is still present.
- **Soft delete.** `DELETE /campaign/:id` sets `deletedAt`. Later reads and the list query omit that row.
- **Search and pagination.** `GET /campaign` matches `name` with a case-insensitive `contains` filter, pages with `page` and `limit`, and sorts by `orderBy` and `order`. The payload includes `metadata` (`currentPage`, `perPage`, `total`, `totalPages`, `hasPrevPage`, `hasNextPage`).
- **Domain rules.** `startDate` must be on or after `createdAt`, and `endDate` must be on or after `startDate`. When the entity is built, an `endDate` already in the past sets status to `expired`. The entity methods `pause` and `activate` refuse expired or deleted campaigns; those methods are covered by unit tests.
- **HTTP mapping.** Successful `POST` responses use 201. Successful `GET`, `PUT`, and `DELETE` responses use 200. The interceptor maps domain error codes to 400 (missing or invalid fields and illegal dates), 404 (`CAMPAIGN_NOT_FOUND`), or 409 (duplicate name, and the pause/activate codes above). Other failures use 500. `class-validator` errors go through `HttpExceptionFilter` and keep that exception's status.
- **CORS.** When `NODE_ENV` is `production`, the allowed origin is `FRONTEND_URL`. In `development` and `test`, the origin is `*`. Allowed methods are `GET`, `HEAD`, `PUT`, `PATCH`, `POST`, and `DELETE`, with credentials enabled.

Responses from the use cases use this envelope:

```json
{
  "isSuccess": true,
  "isFailure": false,
  "value": {},
  "error": { "code": "CAMPAIGN_NOT_FOUND", "message": "Campaign not found" }
}
```

`value` is present on success. `error` is present on failure.

## Architecture

```
src/
  main.ts                          # binds HOST and PORT
  campaign/
    application/                   # create, get, update, and delete use cases
    domain/campaign/               # Campaign entity, builder, ICampaignRepository
    infra/modules/                 # CampaignModule
    infra/repository/              # in-memory CampaignRepository
    infra/repository/prisma/       # Prisma write/read repository and search repository
    presentation/REST/             # CampaignController and request/response DTOs
  shared/
    domain/                        # Result, CampaignError, test-only repository reset
    infra/                         # AppModule, bootstrap, Zod env schema, Prisma,
                                   # Swagger, exception filter, Result interceptor
prisma/
  schema.prisma                    # Campaign model, CampaignStatus, Category
  migrations/                      # initial migration
test/                              # e2e specs
docker-compose.yml                 # Postgres service
```

`CampaignController` sends create, get, update, and delete through use cases. Those use cases depend on the `ICampaignRepository` token, bound to `CampaignPrismaRepository`. Listing stays on `SearchCampaignPrismaRepository` and queries Prisma directly, so search and pagination stay off the write-model repository. `CampaignRepository` is an in-memory implementation of the same contract, used by `test/campaign-in-memory.e2e-spec.ts`. `TestableRepository.reset()` clears stored rows only when `NODE_ENV` is `test`.

`bootstrap` registers the validation pipe (`transform: true`), `HttpExceptionFilter`, `ResultInterceptor`, `ClassSerializerInterceptor`, shutdown hooks, CORS, and Swagger at path `api`. `AppModule` validates the environment with Zod and registers a global extended Prisma client.

## Running locally

Install Node.js 20 or newer, pnpm, and Docker if you want the bundled Postgres service.

```bash
git clone https://github.com/paulocheloni/Mamba_culture.git
cd Mamba_culture
pnpm install
cp .env.example .env
```

Set the variables listed below before starting the app. `NODE_ENV` is required and is absent from `.env.example`; use `development` for a local server. Set `DATABASE_URL` to a full PostgreSQL connection string. `.env.example` writes that value with `${DB_USER}`, `${DB_PASS}`, `${DB_HOST}`, `${DB_PORT}`, and `${DB_NAME}` placeholders; put the resolved URL in `.env` so Prisma and Nest receive a literal string. The sample host, port, database, and user are `localhost`, `5434`, `postgres`, and `postgres`.

`docker-compose.yml` starts `postgres:latest` as container `postgres_mamba`. It loads `.env`, sets `PGUSER`, `PGPASSWORD`, `PGDB`, and `PGPORT` from `DB_USER`, `DB_PASS`, `DB_NAME`, and `DB_PORT`, publishes `${DB_PORT}:${DB_PORT}`, and stores data in the `mamba_postgres` volume. The app connects with `DATABASE_URL`.

```bash
docker compose up -d
pnpm generate
pnpm migrate
pnpm start:dev
```

`pnpm generate` runs `prisma generate`. `pnpm migrate` runs `prisma migrate dev`. With the sample `PORT`, open Swagger UI at [http://localhost:3000/api](http://localhost:3000/api). The process listens on `HOST` and `PORT` (`0.0.0.0` and `3000` in `.env.example`).

| Script | What it runs |
| --- | --- |
| `pnpm start` | `nest start` |
| `pnpm start:dev` | `nest start --watch` |
| `pnpm start:debug` | `nest start --debug --watch` |
| `pnpm build` | compile to `dist/` |
| `pnpm start:prod` | `node dist/main` |
| `pnpm lint` | Biome check with `--fix` on `{src,apps,libs,test}/**/*.ts` |
| `pnpm compodoc` | Compodoc from `tsconfig.json` (output directory `documentation/` is gitignored) |

## Tests

Unit tests sit beside the code as `*.spec.ts`. The default Jest config transforms TypeScript with `@swc/jest`, collects coverage from `src/**/*.{ts,tsx}`, and writes a CTRF report to `test-results/report.json` plus a JUnit report to `test-results/results.xml`.

```bash
pnpm test
pnpm test:watch
pnpm test:cov
pnpm test:debug
pnpm test -- campaign.usecase
```

End-to-end tests match `*.e2e-spec.ts` and run in band:

```bash
pnpm test:e2e
```

`test/campaign.e2e-spec.ts` uses `CampaignPrismaRepository` and deletes every `Campaign` row before each test, so it needs a reachable database and the same environment variables as the app. `test/campaign-in-memory.e2e-spec.ts` overrides `ICampaignRepository` with the in-memory `CampaignRepository` and sets `NODE_ENV` to `test`. Loading `AppModule` still validates the full environment schema.

## Environment variables

Names validated in `src/shared/infra/env/env.schema.ts`. `docker-compose.yml` also reads `DB_USER`, `DB_PASS`, `DB_NAME`, and `DB_PORT`.

| Name | Required | Role |
| --- | --- | --- |
| `PORT` | yes | HTTP port |
| `HOST` | yes | HTTP bind address |
| `NODE_ENV` | yes | `development`, `production`, or `test` |
| `FRONTEND_URL` | no | CORS origin when `NODE_ENV` is `production` |
| `DB_HOST` | yes | database host |
| `DB_PORT` | yes | database port; also the published Compose port |
| `DB_USER` | yes | database user |
| `DB_PASS` | yes | database password |
| `DB_NAME` | yes | database name |
| `DATABASE_URL` | yes | Prisma connection string |

## HTTP API

| Method | Path | Request | Result |
| --- | --- | --- | --- |
| `POST` | `/campaign` | JSON body: `name` (string), `category` (`seasonal`, `regular`, or `special`), `startDate`, `endDate`. `status` (`active` or `paused`) is optional on the DTO; the create use case persists `active`. | `value.id` of the new campaign |
| `GET` | `/campaign` | Query: `page` (default 1), `limit` (default 10), `search` (name substring), `order` (`asc` or `desc`, default `asc`), `orderBy` (alphanumeric, default `name`) | `value` array plus `metadata` |
| `GET` | `/campaign/:id` | Path id | one campaign |
| `PUT` | `/campaign/:id` | Same body fields as create, including optional `status` | empty success `Result` |
| `DELETE` | `/campaign/:id` | Path id | empty success `Result` after `deletedAt` is set |

Campaign fields returned by get and list are `id`, `name`, `category`, `status`, `createdAt`, `startDate`, and `endDate`.
