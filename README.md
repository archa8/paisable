# Paisable

Paisable is a **full-stack personal finance management app** built with **React (frontend), Node.js/Express (backend), MongoDB (database)**, and enhanced with **Google Gemini AI for OCR-based receipt scanning**. It helps users track income, expenses, receipts, and visualize financial analytics via charts.

## Features

* **Authentication** – JWT-based login & signup
* **Transactions Management** – Add income and expenses with categories
* **Analytics & Charts** – Visual breakdown by category, income/expense trends
* **Receipt Management** – Upload receipts and automatically extract expense details using **Google Gemini OCR**
* **Full-Stack Deployment Ready** – Backend on **Render**, frontend on **Netlify**
* **Account Settings** – View your profile and delete your account permanently from the app.

## Deployment Links

* Frontend: https://paisable.netlify.app/
* Backend: https://paisable.onrender.com

## Tech Stack

**Frontend:**

* React + Vite
* React Router
* Axios
* TailwindCSS

**Backend:**

* Node.js + Express
* MongoDB + Mongoose
* JWT Authentication
* Multer (for file uploads)
* Google Gemini AI SDK (for OCR)

**Dev Tools:**

* Nodemon
* dotenv

**Hosting:**

* Frontend → Netlify
* Backend → Render
* Database → MongoDB Atlas

### Project Structure

```
.
├── backend/
│ ├── server.js # Express app entry
│ ├── package.json
│ ├── config/
│ │ └── db.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── transactionRoutes.js
│ │ ├── receiptRoutes.js
| | └── userRoutes.js
│ ├── middleware/
│ ├── controllers/
│ ├── models/
│ └── uploads/ # static served files (receipts)
│
├── docs/
│ ├── openapi.yaml
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── contexts/
│ │ └── api/
│ │ └── config/
│ │ └── hooks/
│ ├── App.jsx
│ ├── main.jsx
│ ├── package.json
│ ├── vite.config.js
│ ├── tailwindcss.config.js
│
└── README.md
```

## Getting Started

### Fork the repository
Before cloning, make sure to fork the repository to your GitHub account.
1. Go to the GitHub repo page: https://github.com/Code-A2Z/paisable
2. Click Fork in the top-right corner.

### Clone your fork

```bash
git clone https://github.com/your-username/paisable.git
cd paisable
```

### Backend Setup

```bash
cd backend
npm install
```

Create a **`.env`** file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key


for welcome email setup:
SENDGRID_API_KEY=SG.your-sendgrid-api-key
EMAIL_FROM="Paisable <no-reply@paisable.com>"

EMAIL_USER=your@gmail.com
EMAIL_PASS=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_FROM="Paisable <no-reply@paisable.com>"
```

Start the backend:

```bash
npm run dev
```

Backend will run on → `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
```

Create a **`.env`** file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend will run on → `http://localhost:5173`

## API Documentation

The full API reference is defined in **OpenAPI 3.0** format.

See the file → [`docs/openapi.yaml`](./docs/openapi.yaml)

You can:

* Open it in [Swagger Editor](https://editor.swagger.io/)
* Import into **Postman** or **Insomnia**

## Core API Endpoints

### Auth

* `POST /api/auth/signup` → Register new user
* `POST /api/auth/login` → Login user
* `GET /api/auth/me` → Fetch logged-in user profile

### Transactions

* `GET /api/transactions` → Get all transactions (paginated)
* `POST /api/transactions` → Create a new transaction
* `GET /api/transactions/summary` → Get income, expense, balance, and recent transactions
* `GET /api/transactions/charts` → Get data for dashboard charts
* `GET /api/transactions/categories` → Get unique transaction categories
* `DELETE /api/transactions/category` → Delete a custom category

### Analytics

* `GET /api/analytics/summary` → Income vs Expense summary
* `GET /api/analytics/categories` → Expense breakdown by category

### Receipts

* `POST /api/receipts/upload` → Upload receipt, trigger Gemini OCR, and create a transaction in one step

### Users
* `DELETE /api/users/account` → Delete the authenticated user account permanently

## Deployment

### Backend → Render

* Configure **Start Command**: `npm start`
* Add environment variables in Render dashboard
* Example deployed backend: `https://your-backend.onrender.com`

### Frontend → Netlify

* Build Command: `npm run build`
* Publish Directory: `dist`
* Environment Variable: `VITE_API_URL=https://your-backend.onrender.com/api`

## License

This project is licensed under the [MIT License](LICENSE).

## Author

Developed by [**Archa**](https://github.com/archa8)



