# Vehicle Rental System

## Project Overview

This is a comprehensive Vehicle Rental System built with **TypeScript**, **Express.js**, and **PostgreSQL**. The system provides a complete RESTful API for managing vehicle rentals, allowing users to browse available vehicles, make bookings, and manage their reservations. Administrators can manage the vehicle inventory, oversee all bookings, and handle returns.

## database:

The database schema consists of three main tables:

1. **Users**: Stores user information including name, email, password (hashed), phone number, and role (admin or customer).
2. **Vehicles**: Contains details about the vehicles available for rent, including vehicle name, type, registration number, daily rent price, and availability status.
3. **Bookings**: Records rental bookings, linking customers to vehicles along with rental start and end dates, and booking status (active, cancelled, returned).

### Key Features in this project

- **User Management**: User registration, authentication with JWT, and role-based access control (Admin & Customer)
- **Vehicle Management**: CRUD operations for vehicles with real-time availability tracking
- **Booking System**: Create, view, and manage vehicle bookings with date validation
- **Status Management**: Handle booking lifecycle (active, cancelled, returned)
- **Date Formatting**: Consistent date formatting into all endpoints
- **Data Enrichment**: Automatic population of customer and vehicle details in booking responses

### Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with pg driver
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security and authentication**: bcryptjs for password hashing and verification and jsonwebtoken for token bgeneration and validation
- **Environment Management**: dotenv for managing environment variables
- **Validation**: Custom middleware and input validation
- **Deployment**: Vercel-ready configuration

### Architecture

- trying RESTful API design
- Modular pattern with separate routes, controllers, and services
- Role-based middleware for authorization by admin and cutomer roles
- Database connection pooling it because optimal performance integratin with PostgreSQL
- Error handling and validation try to add multiple level

### Deployment Information

- api endpoint base url: https://vehical-rentl-system-assingment-2-9q893lehu.vercel.app

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm package manager

### Installation Steps

````

3. **Environment Configuration**

   Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=5000
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key

````

4. **Database Setup**

   The application will automatically create the required tables on first run:
   -container:neon DB

   - Users table (for authentication and user management)
   - Vehicles table (for vehicle inventory)
   - Bookings table (for rental bookings)

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Usage Instructions

### API Endpoints

#### Authentication Endpoints

**1. User Registration**

```http
POST /api/v1/auth/signup


{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "customer"
}
```

**2. User Login**

```http
POST /api/v1/auth/login


{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Vehicle Endpoints

**3. Create Vehicle (Admin only)**

```http
POST /api/v1/vehicles
Authorization: Bearer <admin_token>


{
  "vehicle_name": "Toyota Camry",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

**4. Get All Vehicles**

```http
GET /api/v1/vehicles
```

**5. Update Vehicle (Admin only)**

```http
PUT /api/v1/vehicles/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "daily_rent_price": 60,
  "availability_status": "available"
}
```

**6. Delete Vehicle (Admin only)**

```http
DELETE /api/v1/vehicles/:id
Authorization: Bearer <admin_token>
```

#### Booking Endpoints

**7. Create Booking (Customer)**

```http
POST /api/v1/bookings
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```

**8. Get All Bookings**

```http
GET /api/v1/bookings
Authorization: Bearer <token>
```

- Admin: Returns all bookings with customer details
- Customer: Returns only their own bookings

**9. Return Booking (Admin only)**

```http
PUT /api/v1/bookings/:bookingId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "returned"
}
```

**10. Cancel Booking (Customer)**

```http
PUT /api/v1/bookings/:bookingId
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "status": "cancelled"
}
```

### when user want to cheak all booking list then system will cheak automaticlly expired booking available or not if any expirde booking vaialable in databse, the system will uodate it .... and alternativly we can use corn job for this task...but for this assingment i have handled it justusing a function call..

#### User Management Endpoints

**11. Get All Users (Admin only)**

```http
GET /api/v1/users
Authorization: Bearer <admin_token>
```

**12. Update User**

```http
PUT /api/v1/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "phone": "9876543210"
}
```

**13. Delete User (Admin only)**

```http
DELETE /api/v1/users/:id
Authorization: Bearer <admin_token>
```

### Role-Based Access

- **Admin**: Full access to all endpoints including user management, vehicle management, and booking oversight
- **Customer**: Can create bookings, view their own bookings, cancel their bookings (before start date), and update their profile , also cheak all vehicle lst its totally public .without signup and log in anyone can see vehicle list

### Testing

Use tools like Postman Make sure to:

1. Register a user first
2. Login to get the JWT token
3. Include the token in the Authorization header for protected routes
