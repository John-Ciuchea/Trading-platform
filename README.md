# Trading platform take-home test solution

## Description

This is the solution for a scalable trading platform take-home challenge.  
The test requirement can be found [here](./requirements.pdf)

This system is a trading platform designed to manage deals between sellers and buyers. It leverages an event-driven
microservice architecture using NATS for event streaming, NestJS for building the services, and Prisma with PostgreSQL
for database interactions. The platform ensures scalability, performance, and reliability by implementing durable event
streams and handling concurrent processes effectively.

## Technologies Used
- NATS JetStream: For high-performance, durable event streaming.
- NestJS: For building scalable and maintainable server-side applications.
- Prisma: For database ORM and type-safe database access.
- PostgreSQL: As the relational database for persisting deal and buyer information.

## System Requirements

* NodeJs >= 20.11
* Docker. The project was tested with Docker Desktop 4.31.0

## Development setup
In the root directory run:
```shell
docker compose up -d
```
to start the databases and the NATS server.

### Setup seller service:
```shell
cd seller-service
npm i
npx prisma migrate dev
```

Seller service has 2 npm scripts:
- `npm run start:nats` to listen for stream events.
- `npm run start:http` to start the web server .
- `npm run start` runs both the above scripts in parallel.

To make the system QA easier, there is a npm run db:seed command that will create a dummy seller and some API keys for
HTTP authorization.

This service exposes 2 endpoints to create and update a deal. The authorization is done using an API key.

Example:
Create
```
curl --location 'localhost:3000/deal' \
--header 'accept: application/json' \
--header 'x-api-key: some-secret-api-key' \
--header 'Content-Type: application/json' \
--data '{
    "name": "john doe",
    "totalPrice": 122300,
    "currency": "GBP",
    "status": "sold",
    "discount": {
        "type": "flat",
        "amount": 1234
    },
    "items": [{
        "name": "deal1",
        "price": 12000
    }]
}'
```
Update
```shell
curl --location --request PUT 'localhost:3000/deal' \
--header 'accept: application/json' \
--header 'x-api-key: some-secret-api-key' \
--header 'Content-Type: application/json' \
--data '{
    "id": "56c5e92a-683b-430e-8466-5721c7cacb90",
    "sellerId": "90d57fe0-0fa1-4dae-a51c-917cc82bcdda",
    "name": "john-asdaasd",
    "totalPrice": 12133,
    "currency": "GBP",
    "status": "sold",
    "discount": {
        "type": "flat",
        "amount": 1234
    },
    "items": [{
        "name": "deal2",
        "price": 12000
    }, {
        "id": "9c01d992-7344-44c2-b7d1-a66ac08b1cb7",
        "name": "deal2",
        "price": 12000
    }],
    "createdAt": "2024-06-17 05:30:12.520",
    "updatedAt": "2024-06-17 05:30:12.520"
}'
```

### Setup buyers service
The setup is similar to the seller service.
```shell
cd buyer-service
npm i
npx prisma migrate dev
```
Buyer service has these npm scripts:
- `npm run start:nats` to listen for stream events.
- `npm run start:http` to start the web server
- `npm run start` runs both the above scripts in parallel.
- `npm run db:seed` seeds some QA data. The seller is hardcoded to match the one on the seller service.

The service exposes one endpoint to view buyers' authorized deals.
Example:
```
curl --location 'localhost:3001/deal' \
--header 'x-api-key: 90d57fe0-0fa1-4dae-a51c-917cc82bcddc'
```
To pass the authorization, you need to set `x-api-key` to the buyer's id.

The deal creation/update flow:
- The seller service receives the request, performs auth and validation, and emits a deal.created or deal.updated event.
  * The seller service NATS process will receive the events, validate, and create/update the deal in the database.
  * The buyer service will receive a copy of the same event, validate, persist the deal in the database, and then call
    all webhooks registered to the particular event. Each api call is made in a separate event.

## Deployment
Each service is designed to deploy independently, and each of the processes can run independently. The services can be
deployed on both lambda functions or docker containers.

We can deploy to a Kubernetes cluster as follows:
- A buyer service container that runs the web server, with as many replicas as needed.
- A buyer service container that runs the event consumer, with as many replicas as needed. The app is configured to use
  queue groups, meaning that if we have 10 containers, only 1 will receive a specific message, while the rest handle
  other messages. This avoids race conditions but ensures the minimum latency possible.

Depending on the code changes, we can use rolling or blue/green deployments with zero downtime. 

## Bid implementation
If consistency is not a strong requirement, I would follow the same pattern as with deals. The buyer service will
receive a request, validate the shape and build the object, emit an event, and return the object. Each service will
listen for that event and persist the entire or partial object in the local databases.

## Challenges
In distributed systems, failure is inevitable, and monitoring is critical. Overcoming this requires strong error
handling at the codebase level and good monitoring and alerting at the infrastructure level.

## Enhancements
When designing the system, the focus was on key points in the requirements, ignoring important features like:
- Security (auth in this system is just a placeholder)
- Logging
- Monitoring
- Versioning (both HTTP requests and events)
- Error handling (apart from app error handling, a Dead Letter Queue functionality is critical to handle failed events).
