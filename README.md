# Restaurant Management System

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

A robust and scalable backend system built with NestJS for managing restaurant operations including customers, products, orders, and reports.

## Features

- **Customer Management**: Track customer information and order history
- **Product Management**: Manage menu items with pricing and availability
- **Order Processing**: Create and track orders with line items
- **Reporting**: Generate sales and inventory reports
- **Caching**: Redis-based caching for improved performance
- **Data Validation**: Input validation using class-validator
- **Database**: MongoDB for data storage
- **API Documentation**: RESTful API endpoints with proper structure
- **Docker Support**: Easy deployment with Docker and docker-compose

## Technology Stack

- **Framework**: NestJS v11
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Validation**: class-validator and class-transformer
- **Configuration**: @nestjs/config with environment variables
- **Containerization**: Docker and docker-compose
- **Language**: TypeScript

## Project Structure

```
src/
├── app.module.ts          # Main application module
├── main.ts                # Application entry point
├── common/                # Common utilities and helpers
├── config/                # Configuration files
│   ├── database.config.ts # MongoDB configuration
│   └── redis.config.ts    # Redis configuration
├── modules/               # Feature modules
│   ├── customers/         # Customer management
│   ├── orders/            # Order processing
│   ├── products/          # Product management
│   └── reports/           # Reporting functionality
└── seed/                  # Database seeding scripts
```

## Prerequisites

- Node.js (v18+)
- MongoDB (or Docker)
- Redis (or Docker)
- Docker and docker-compose (for containerized deployment)

## Installation

### Using npm

```bash
# Clone the repository (if applicable)
git clone https://github.com/Abdallahhany/rest-mng-sys.git
cd rest-mng-sys

# Install dependencies
npm install

# Create .env file (see .env.example)
cp .env.example .env
# Edit .env with your configuration settings
```

### Using Docker

```bash
# Build and start the containers
docker-compose up -d

# The API will be available at http://localhost:3000/api
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=3000

# MongoDB
MONGO_URI=mongodb://localhost:27017/restaurant_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_TTL=3600
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

## Database Seeding

To populate the database with initial data:

```bash
npm run seed
```

## API Documentation
The Postman collection for the API is available in the `docs` directory. You can import it into Postman to test the endpoints.

## Docker Deployment

The application includes Docker and docker-compose configuration for easy deployment:

```bash
# Build and start services
docker-compose up -d

# Stop services
docker-compose down

# Stop services and remove volumes
docker-compose down -v
```

## Contributing
Contributions are welcome! If you have suggestions or improvements, please open an issue or submit a pull request.

## Author
Abdallah Hany - [GitHub](https://github.com/Abdallahhany)