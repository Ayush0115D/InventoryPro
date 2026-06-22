# Inventory & Order Management System

A full-stack inventory and order management system built with **React**, **Python FastAPI**, and **PostgreSQL**. Fully containerized with Docker.

## Features

### Dashboard
- Summary cards showing total products, customers, and orders
- Low stock products alert table (quantity < 10)

### Product Management
- Add new products (name, SKU, price, quantity)
- View all products in a table
- Update product details (inline form)
- Delete products with confirmation
- Validation: unique SKU, non-negative price and quantity

### Customer Management
- Add new customers (name, email, phone)
- View all customers
- Delete customers with confirmation
- Validation: unique email

### Order Management
- Create orders by selecting a customer, product, and quantity
- Auto-calculates total amount (price × quantity)
- Auto-reduces product stock on order creation
- Validates stock availability before placing order
- View all orders in a table
- View detailed order info (customer name, product name, amount, date)
- Cancel/delete orders

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | PostgreSQL (primary), SQLite (local fallback) |
| Containerization | Docker, Docker Compose |
| Deployment | Render (backend), Vercel/Netlify (frontend) |

## Getting Started

### Local Development (No Docker)

#### Prerequisites
- Python 3.10+
- Node.js 20+
- PostgreSQL (optional — falls back to SQLite automatically)

#### Backend
```bash
cd backend
pip install -r requirements.txt
python run.py
```
API runs at `http://localhost:8000`

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173`

The Vite dev server proxies `/api` requests to the backend automatically.

### Docker (Full Stack)

#### Prerequisites
- Docker Desktop

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost/api/ |
| PostgreSQL | localhost:5432 |

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create product |
| GET | `/products` | List all products |
| GET | `/products/{id}` | Get product by ID |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/customers` | Create customer |
| GET | `/customers` | List all customers |
| GET | `/customers/{id}` | Get customer by ID |
| DELETE | `/customers/{id}` | Delete customer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create order |
| GET | `/orders` | List all orders |
| GET | `/orders/{id}` | Get order details |
| DELETE | `/orders/{id}` | Cancel order |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Get summary stats |

## Business Logic
- Product SKU and customer email must be unique
- Product quantity and price cannot be negative
- Orders cannot be placed if stock is insufficient
- Creating an order automatically reduces available stock
- Total order amount is auto-calculated by the backend
- All APIs include proper error handling with HTTP status codes

## Project Structure
```
├── backend/
│   ├── app/
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── routers/       # API route handlers
│   │   ├── database.py    # DB connection
│   │   └── main.py        # FastAPI app
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # Shared components (Layout)
│   │   ├── pages/         # Page components
│   │   ├── api.js         # API client
│   │   ├── App.jsx        # Router config
│   │   └── main.jsx       # Entry point
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

## Deployment

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repo, set root to `backend`
4. Select **Docker** as runtime
5. Set `DATABASE_URL` env var to Render PostgreSQL connection string

### Frontend (Vercel/Netlify)
1. Connect GitHub repo
2. Set root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set `VITE_API_URL` to your deployed backend URL

### Database (Render PostgreSQL)
1. Create a new PostgreSQL database on Render
2. Copy the internal connection string
3. Set as `DATABASE_URL` environment variable on backend service
