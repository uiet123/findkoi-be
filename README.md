# FindKoi Backend (Microservices)

Node.js + Express based microservices backend scaffold.

## Services

- API Gateway (`services/api-gateway`) -> Entry point (`http://localhost:3000`)
- Auth Service (`services/auth-service`) -> Signup/Login + JWT
- Koi Service (`services/koi-service`) -> Koi listing CRUD (in-memory)

## Architecture

Client -> API Gateway -> Individual services

- `/api/auth/*` routes to Auth Service
- `/api/koi/*` routes to Koi Service

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start all services:
   ```bash
   npm run dev
   ```

3. Health checks:
   - `GET http://localhost:3000/health`
   - `GET http://localhost:3001/health`
   - `GET http://localhost:3002/health`

## Example APIs (via Gateway)

1. Signup:
   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
   -H "Content-Type: application/json" \
   -d '{"name":"Rahul","email":"rahul@example.com","password":"123456"}'
   ```

2. Login:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{"email":"rahul@example.com","password":"123456"}'
   ```

3. Get koi listings:
   ```bash
   curl http://localhost:3000/api/koi
   ```

4. Add koi listing:
   ```bash
   curl -X POST http://localhost:3000/api/koi \
   -H "Content-Type: application/json" \
   -d '{"title":"Kohaku","price":18000,"city":"Pune"}'
   ```

## Notes

- Auth service uses a PostgreSQL database managed via Prisma ORM.
- Next natural step: add service-specific databases + message broker (RabbitMQ/Kafka) for additional microservices.
