# Eatlify Backend API

Eatlify Backend is a robust Node.js/TypeScript REST API designed to power restaurant management and point-of-sale (POS) systems. Built with Express.js, MongoDB, and comprehensive authentication, it provides all the backend services needed for restaurant operations including product management, sales tracking, user management, and real-time order processing.

---

## Overview

This backend API serves as the foundation for the Eatlify restaurant management system, providing secure, scalable, and feature-rich endpoints for restaurant owners, staff, and customers. The API is designed with modern development practices including JWT authentication, comprehensive error handling, and extensive API documentation via Swagger.

**Note:** This backend is deployed on Azure DevOps using a free account. To optimize costs and reduce latencies, Socket.IO functionality has been disabled in production. Real-time features are available in development mode only.

---

## Features

### Core Functionality
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Restaurant Management**: Complete CRUD operations for restaurant profiles and settings
- **Product Management**: Product catalog with categories, modifiers, and pricing
- **Sales & Orders**: Comprehensive sales tracking and order management
- **Cashier Management**: Multi-cashier support with individual tracking
- **User Management**: Customer accounts and final user management
- **Delivery System**: Delivery tracking and management
- **Pre-sales System**: Advanced pre-sales functionality
- **File Upload**: Cloudinary integration for image management
- **Real-time Updates**: Socket.IO for live order updates (development only)

### Technical Features
- **TypeScript**: Full TypeScript implementation for type safety
- **MongoDB**: NoSQL database with Mongoose ODM
- **Express.js**: Fast, unopinionated web framework
- **Dependency Injection**: TypeDI with `@Service` decorator for clean architecture
- **JWT Authentication**: Secure token-based authentication
- **Swagger Documentation**: Interactive API documentation
- **CORS Support**: Cross-origin resource sharing enabled
- **Security**: Helmet.js for security headers
- **Logging**: Morgan for HTTP request logging
- **Testing**: Jest testing framework with comprehensive test coverage

---

## API Documentation

### Interactive Swagger UI
Access the complete API documentation at: `/api-docs`

**Production**: https://eatlifybackend-cva3cnhzf7c6feaq.canadacentral-01.azurewebsites.net/api-docs  
**Development**: http://localhost:8000/api-docs

### Available Endpoints

#### Authentication & Restaurants
- `POST /restaurants` - Create new restaurant
- `POST /restaurants/login` - Restaurant login
- `GET /restaurants/:id` - Get restaurant details
- `PUT /restaurants/:id` - Update restaurant
- `DELETE /restaurants/:id` - Delete restaurant

#### Products & Categories
- `GET /products` - Get all products
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /categorias` - Get all categories
- `POST /categorias` - Create new category
- `PUT /categorias/:id` - Update category
- `DELETE /categorias/:id` - Delete category

#### Sales & Orders
- `GET /ventas` - Get all sales
- `POST /ventas` - Create new sale
- `PUT /ventas/:id` - Update sale
- `DELETE /ventas/:id` - Delete sale
- `GET /orders` - Get all orders
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order status
- `DELETE /orders/:id` - Delete order

#### Cashiers & Users
- `GET /cajeros` - Get all cashiers
- `POST /cajeros` - Create new cashier
- `PUT /cajeros/:id` - Update cashier
- `DELETE /cajeros/:id` - Delete cashier
- `GET /finalUsers` - Get all final users
- `POST /finalUsers` - Create new final user
- `PUT /finalUsers/:id` - Update final user
- `DELETE /finalUsers/:id` - Delete final user

#### Delivery & Pre-sales
- `GET /deliver` - Get all deliveries
- `POST /deliver` - Create new delivery
- `PUT /deliver/:id` - Update delivery
- `DELETE /deliver/:id` - Delete delivery
- `GET /preventas` - Get all pre-sales
- `POST /preventas` - Create new pre-sale
- `PUT /preventas/:id` - Update pre-sale
- `DELETE /preventas/:id` - Delete pre-sale

#### Modifier Groups
- `GET /modifier` - Get all modifier groups
- `POST /modifier` - Create new modifier group
- `PUT /modifier/:id` - Update modifier group
- `DELETE /modifier/:id` - Delete modifier group

---

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local or cloud instance)
- TypeScript
- npm or yarn

### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd eatlifyBackend

# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run dev

# Or start production server
npm start
```

The API will be available at `http://localhost:8000`

### Development Commands

```bash
# Run in development mode with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run tests
npm test

# Run webpack build
npm run webpack

# Watch TypeScript compilation
npm run watch-ts
```

---

## Deployment

### Azure DevOps Deployment
This backend is deployed on Azure DevOps using a free tier account. The deployment includes:

- **Automatic CI/CD**: Code changes are automatically deployed
- **Environment Variables**: Securely configured in Azure
- **Health Monitoring**: Built-in health checks
- **Cost Optimization**: Socket.IO disabled to reduce costs and latencies

### Production Considerations
- Socket.IO functionality is disabled in production to optimize costs
- Real-time features are available in development mode only
- All API endpoints remain fully functional
- JWT authentication is enforced for all protected routes

---

## Architecture & Design Patterns

### Dependency Injection with TypeDI
This project implements a clean architecture using TypeDI for dependency injection. The `@Service()` decorator is used throughout the codebase to register services and controllers in the DI container.

#### Service Layer Example
```typescript
import { Service } from 'typedi';

@Service()
export class RestaurantService {
  constructor(private readonly commonServices: CommonServices) {}
  
  async login(res: Response, restaurantBody: IRestaurant) {
    // Service implementation
  }
}
```

#### Controller Layer Example
```typescript
import { Service } from 'typedi';

@Service()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}
  
  async login(req: Request, res: Response) {
    return this.restaurantService.login(res, req.body as IRestaurant);
  }
}
```

#### Benefits
- **Loose Coupling**: Services and controllers are loosely coupled
- **Testability**: Easy to mock dependencies for unit testing
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new services and controllers

### Container Configuration
The DI container is configured in `src/container.ts`:
```typescript
import 'reflect-metadata';
import { Container } from 'typedi';

export default Container;
```

## Database Schema

### Main Collections
- **Restaurants**: Restaurant profiles and settings
- **Products**: Product catalog with categories
- **Categories**: Product categorization
- **Sales**: Sales transactions and history
- **Orders**: Order management and tracking
- **Cashiers**: Cashier accounts and permissions
- **FinalUsers**: Customer accounts
- **Deliveries**: Delivery tracking
- **Pre-sales**: Pre-sale management
- **ModifierGroups**: Product modifiers and add-ons

---

## Security

### Authentication
- JWT-based authentication
- Bearer token required for protected routes
- Role-based access control
- Secure password hashing with bcrypt

### Security Headers
- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- Rate limiting (recommended for production)

---

## Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test files
npm test -- CashiersController.test.ts
```

Test files are located in:
- `src/controllers/__tests__/`
- `src/services/__tests__/`
- `src/tests/`

---

## Dependencies

### Core Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **typedi**: Dependency injection container
- **reflect-metadata**: Metadata reflection for decorators
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **socket.io**: Real-time communication (dev only)
- **cloudinary**: Image upload and management
- **multer**: File upload handling
- **swagger-jsdoc**: API documentation
- **swagger-ui-express**: Swagger UI

### Development Dependencies
- **typescript**: TypeScript compiler
- **jest**: Testing framework
- **nodemon**: Development server
- **webpack**: Module bundler
- **supertest**: API testing

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

---

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Write comprehensive tests for new features
- Update API documentation for new endpoints
- Follow the existing code style and structure

---

## Support

For support and questions:
- **Email**: support@eatlify.com
- **Documentation**: `/api-docs` endpoint
- **Issues**: GitHub Issues

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

- **Azure DevOps** for hosting and CI/CD
- **MongoDB** for database services
- **Cloudinary** for image management
- **Express.js** community for the excellent framework

---

> Built with ❤️ for the restaurant industry. Happy coding!
