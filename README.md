


 🛠️ Frontend Tech Stack

The frontend of this E-Commerce Food Ordering Website is built using modern React technologies.

* **React.js** – Building the user interface
* **Vite** – Fast development and build tool
* **React Router DOM** – Client-side routing and navigation
* **Redux Toolkit** – State management
* **React Redux** – Connecting Redux with React components
* **Axios** – API requests and backend communication
* **Tailwind CSS** – Utility-first styling
* **Lucide React** – Modern icons
* **CSS** – Custom styling

 🚀 Run Frontend Locally

```bash
# Navigate to the frontend folder
cd frontend

# Install all dependencies
npm install

# Start the development server
npm run dev
```

 📦 Available Scripts

```bash
# Start development server
npm run dev

# Create production build
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

 🔗 Redux Provider Setup

The application is wrapped with the Redux Provider, which makes the Redux store available throughout the application.

// main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";
import "./index.css";

// Connect the entire React application with Redux Store
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
🛣️ Routing & Route Protection

The application uses React Router DOM for navigation and implements public, protected, and admin-only routes.

Protected Route
// Allow access only to authenticated users
const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // Redirect unauthenticated users to login
  return userInfo ? children : <Navigate to="/login" replace />;
};
Admin Route
// Allow access only to users with the admin role
const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // Redirect non-admin users to the home page
  return userInfo && userInfo.role === "admin"
    ? children
    : <Navigate to="/" replace />;
};
Application Routes
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/menu" element={<Menu />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/cart" element={<Cart />} />

  {/* Protected Customer Route */}
  <Route
    path="/my-orders"
    element={
      <ProtectedRoute>
        <MyOrders />
      </ProtectedRoute>
    }
  />

  {/* Admin Only Routes */}
  <Route
    path="/admin/dashboard"
    element={
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    }
  />

  <Route
    path="/admin/products"
    element={
      <AdminRoute>
        <AdminProducts />
      </AdminRoute>
    }
  />

  {/* Redirect unknown routes to home */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>

## 🗂️ Redux Store Configuration

The application uses **Redux Toolkit** for global state management. The Redux store combines authentication and cart reducers.

```jsx
// store/store.js

import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import cartReducer from "./cartSlice";

// Configure the global Redux store
const store = configureStore({
  reducer: {
    // Manages user authentication state
    auth: authReducer,

    // Manages shopping cart state
    cart: cartReducer,
  },
});

export default store;
```

The Redux store manages two main parts of the application:

* **Auth State** – User authentication and user information
* **Cart State** – Food items added to the shopping cart

## 🔐 Authentication State Management

The application uses **Redux Toolkit** to manage user authentication globally.

User information is stored in **localStorage**, which helps keep the user logged in even after refreshing the page.

### Key Features

* Stores authenticated user information
* Persists login data using localStorage
* Handles loading states
* Handles authentication errors
* Supports user logout
* Clears stored user data on logout

### Important Authentication Logic

```jsx
// authSlice.js

import { createSlice } from "@reduxjs/toolkit";

// Load saved user information from localStorage
const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// Initial authentication state
const initialState = {
  userInfo: userInfoFromStorage,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // Update loading state during authentication requests
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Store authentication errors
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Save logged-in user information
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.error = null;
      state.isLoading = false;

      // Persist user information in localStorage
      localStorage.setItem(
        "userInfo",
        JSON.stringify(action.payload)
      );
    },

    // Clear user data and logout
    logout: (state) => {
      state.userInfo = null;
      state.error = null;
      state.isLoading = false;

      // Remove saved user information
      localStorage.removeItem("userInfo");
    },
  },
});

export const {
  setCredentials,
  logout,
  setLoading,
  setError,
} = authSlice.actions;

export default authSlice.reducer;
```

### How It Works

When a user successfully logs in, the `setCredentials` action saves the user information in both **Redux state** and **localStorage**.

When the application reloads, the saved `userInfo` is loaded from localStorage and used as the initial authentication state.

When the user logs out, the Redux state is cleared and the stored user information is removed from localStorage.


## 🛒 Shopping Cart Management

The shopping cart is managed using **Redux Toolkit**. The cart state is also stored in **localStorage**, so cart data remains available even after refreshing the application.

### Cart Features

* Add food items to the cart
* Automatically increase quantity if the item already exists
* Remove individual items from the cart
* Update item quantity
* Automatically calculate the total amount
* Clear all cart items
* Persist cart data using localStorage

### Important Cart Logic

```jsx
// cartSlice.js

import { createSlice } from "@reduxjs/toolkit";

// Load saved cart data from localStorage
const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const totalAmountFromStorage = localStorage.getItem("totalAmount")
  ? JSON.parse(localStorage.getItem("totalAmount"))
  : 0;

const initialState = {
  cartItems: cartItemsFromStorage,
  totalAmount: totalAmountFromStorage,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // Add a food item to the cart
    addToCart: (state, action) => {
      const item = action.payload;

      // Check if the item already exists in the cart
      const existItem = state.cartItems.find(
        (x) => x._id === item._id
      );

      // Increase quantity if the item exists
      if (existItem) {
        existItem.quantity += 1;
      } else {
        // Add a new item with quantity 1
        state.cartItems.push({
          ...item,
          quantity: 1,
        });
      }

      // Calculate the updated total amount
      state.totalAmount = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      // Save cart data in localStorage
      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      );

      localStorage.setItem(
        "totalAmount",
        JSON.stringify(state.totalAmount)
      );
    },

    // Remove an item from the cart
    removeFromCart: (state, action) => {
      const id = action.payload;

      state.cartItems = state.cartItems.filter(
        (item) => item._id !== id
      );

      // Recalculate total after removing the item
      state.totalAmount = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      // Update localStorage
      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      );

      localStorage.setItem(
        "totalAmount",
        JSON.stringify(state.totalAmount)
      );
    },

    // Update the quantity of a cart item
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const item = state.cartItems.find(
        (item) => item._id === id
      );

      // Update quantity only if it is greater than zero
      if (item && quantity > 0) {
        item.quantity = quantity;
      }

      // Recalculate the total amount
      state.totalAmount = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      // Save updated cart data
      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      );

      localStorage.setItem(
        "totalAmount",
        JSON.stringify(state.totalAmount)
      );
    },

    // Clear all items from the cart
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;

      // Remove cart data from localStorage
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalAmount");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
```

### How It Works

When a user adds a food item, the application first checks whether the item already exists in the cart. If it exists, its quantity is increased; otherwise, the item is added with an initial quantity of `1`.

The total cart amount is recalculated whenever an item is added, removed, or its quantity is updated. Both the cart items and total amount are stored in **localStorage**, allowing the cart to persist after a page refresh.

### Redux Actions

| Action           | Purpose                                   |
| ---------------- | ----------------------------------------- |
| `addToCart`      | Adds a new item or increases its quantity |
| `removeFromCart` | Removes an item from the cart             |
| `updateQuantity` | Updates the quantity of an existing item  |
| `clearCart`      | Removes all items and resets the total    |



### 🧭 Navigation & User Access

The application includes a dynamic navigation bar that changes according to the user's authentication status and role.

* Users can navigate to **Home**, **Menu**, and **Cart**.
* The cart icon displays the total quantity of items added to the cart.
* Logged-in users can access **My Orders** and log out securely.
* Admin users can additionally access the **Admin Dashboard** and **Product Management** pages.
* The logout process communicates with the backend and clears the user's authentication state.

  Cart Item Counter

```jsx
const totalCartCount = cartItems.reduce(
  (acc, item) => acc + item.quantity,
  0
);
```

This dynamically displays the total number of food items currently added to the cart.

### Role-Based Navigation

```jsx
{userInfo.role === "admin" && (
  <Link to="/admin/dashboard">Admin</Link>
)}
```

Admin-specific navigation options are displayed only when the logged-in user has the `admin` role.

 🍔 Food Product Display & Cart Integration

Each food item is displayed using a reusable `FoodCard` component.

The component includes:

* Food image, name, description, category, and price
* Add-to-cart functionality using Redux
* Temporary **Added** confirmation after adding an item
* Food availability checking
* **Sold Out** state for unavailable items

### Add to Cart Logic

```jsx
const handleAddToCart = () => {
  dispatch(addToCart(item));

  // Show temporary "Added" confirmation
  setAdded(true);

  setTimeout(() => {
    setAdded(false);
  }, 1500);
};
```

The selected food item is added to the Redux cart state, and the user receives visual feedback after successfully adding the item.






### 🏠 Home Page

The Home page provides a clean and modern introduction to the **BiteRush Food Ordering Platform**.

It is designed to give users a quick overview of the platform and guide them toward exploring the available food menu.

### Key Highlights

* Modern and responsive hero section
* Clear call-to-action button for exploring the food menu
* Fast delivery information
* Quality assurance highlights
* Live order tracking information
* Modern UI built with **React** and **Tailwind CSS**
* Interactive navigation using **React Router**

### Hero Section

The hero section introduces the platform and includes a direct navigation link to the food menu.

```jsx
<Link
  to="/menu"
  className="inline-flex items-center space-x-3"
>
  <span>Explore Menu</span>
  <ArrowRight className="h-5 w-5" />
</Link>
```

When the user clicks **Explore Menu**, they are redirected to the `/menu` page to browse available food items.

### Platform Features

The Home page highlights three main services provided by the platform:

#### ⚡ Super Fast Delivery

The platform promotes fast food delivery, providing users with quick access to their selected meals.

#### 🛡️ Quality Assurance

The application highlights food quality and the use of fresh ingredients.

#### 🚚 Live Order Tracking

Users are informed about real-time order status updates, allowing them to track the progress of their orders from preparation to delivery.

### UI Design

The page uses:

* **Tailwind CSS** for responsive styling
* **Lucide React** for modern icons
* **React Router DOM** for navigation
* A responsive grid layout for feature cards
* Hover and transition effects for improved user interaction

The Home page acts as the main entry point of the application and encourages users to explore the menu and use the food ordering features.

🏠 Home
<img width="1915" height="991" alt="Screenshot (2)" src="https://github.com/user-attachments/assets/80f910d6-70da-423f-9ad2-0cd014dd3db1" />



### 🛒 Shopping Cart & Checkout

The application provides a complete shopping cart and checkout system where users can manage food items, update quantities, provide a delivery address, and place orders through online payment.

### Cart Management

Users can:

* View all added food items
* Increase or decrease item quantity
* Remove individual items from the cart
* Automatically remove an item when its quantity becomes zero
* View item-wise prices
* View the total item amount
* Clear the cart after a successful order

### Quantity Management

```jsx
const handleQuantityChange = (item, newQty) => {
  if (newQty <= 0) {
    dispatch(removeFromCart(item._id));
  } else {
    dispatch(
      updateQuantity({
        id: item._id,
        quantity: newQty,
      })
    );
  }
};
```

🛒 Shopping Cart & Checkout
<img width="1917" height="998" alt="Screenshot (4)" src="https://github.com/user-attachments/assets/90735868-57ee-44b6-b238-8f82eeae6ea6" />

### 💰 Order Summary

The checkout page automatically calculates:

* Items subtotal
* Delivery charge
* Grand total

```jsx
const deliveryFee = cartItems.length > 0 ? 40 : 0;
const grandTotal = totalAmount + deliveryFee;
```

### 📍 Delivery Address

Before placing an order, the user must provide a delivery address. The application validates the address before proceeding with checkout.

### 💳 Online Payment Integration

The application integrates **Razorpay** for online payment processing.

The Razorpay checkout script is dynamically loaded when the Cart page is opened.

```jsx
useEffect(() => {
  const script = document.createElement("script");

  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;

  script.onload = () => setRzpLoaded(true);

  document.body.appendChild(script);
}, []);
```

### 🔐 Checkout Process

The checkout flow follows these steps:

1. The application checks whether the user is logged in.
2. The delivery address is validated.
3. Cart items and pricing information are prepared.
4. A payment order is created through the backend.
5. The Razorpay payment window is opened.
6. The payment is verified by the backend.
7. After successful verification, the food order is created.
8. The shopping cart is cleared.
9. The user is redirected to the **My Orders** page.

### Order Creation Logic

```jsx
const { data } = await axiosClient.post(
  "/payment/create-order",
  {
    amount: grandTotal,
    receipt: `order_${Date.now()}`,
  }
);
```

After successful payment verification, the application creates the order and clears the cart. The checkout implementation also includes error handling and loading states to provide feedback while an order is being processed.

### Empty Cart State

When there are no items in the cart, the user sees an **empty cart message** with a button to navigate back to the food menu and continue shopping.

## 📁 Frontend Project Structure

```text
frontend/
│
├── public/                    # Static public files
│
├── src/
│   │
│   ├── api/                   # Axios configuration and API communication
│   │
│   ├── assets/                # Images and other static assets
│   │
│   ├── components/            # Reusable UI components
│   │   ├── FoodCard.jsx       # Displays individual food items
│   │   ├── Footer.jsx         # Application footer
│   │   └── Navbar.jsx         # Navigation, cart count, user/admin access
│   │
│   ├── context/               # React context-related files
│   │
│   ├── pages/                 # Main application pages
│   │   ├── Home.jsx           # Landing page and platform highlights
│   │   ├── Menu.jsx           # Displays available food items
│   │   ├── Login.jsx          # User login page
│   │   ├── Register.jsx       # User registration page
│   │   ├── Cart.jsx           # Cart, checkout and Razorpay payment
│   │   ├── MyOrders.jsx       # Displays user orders
│   │   ├── AdminDashboard.jsx # Admin dashboard
│   │   └── AdminProducts.jsx  # Admin product management
│   │
│   ├── store/                 # Redux state management
│   │   ├── authSlice.js       # Authentication state and localStorage persistence
│   │   ├── cartSlice.js       # Shopping cart state and total calculation
│   │   └── store.js           # Redux store configuration
│   │
│   ├── App.jsx                # Routing and protected/admin routes
│   ├── main.jsx               # Application entry point and Redux Provider
│   ├── App.css                # Application-specific styles
│   └── index.css              # Global styles
│
├── package.json               # Dependencies and project scripts
└── README.md                  # Project documentation
```

### Structure Overview

The frontend follows a component-based architecture using React. Reusable UI elements are separated into the `components` folder, while complete application views are organized inside the `pages` folder.

Global application state, including **authentication** and **shopping cart data**, is managed through Redux Toolkit inside the `store` folder. API-related configuration is separated into the `api` folder to keep backend communication organized.

The application also uses protected routes and role-based routing to separate normal user functionality from admin functionality.



# ⚙️  Backend

The backend of BiteRush is built using Node.js and Express.js. It handles authentication, food management, orders, payments, real-time updates, and database communication.

 🛠️ Backend Tech Stack

- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Cookie Parser
- CORS
- Helmet
- Express Rate Limit
- Dotenv

## 📂 Backend Structure

```text
backend/
│
├── config/                 # Database, JWT and Cloudinary configuration
│   ├── db.js
│   ├── jwtToken.js
│   └── cloudinary.js
│
├── controllers/            # Application business logic
│   ├── authController.js
│   ├── foodController.js
│   ├── orderController.js
│   └── paymentController.js
│
├── middlewares/            # Authentication and error handling middleware
│
├── models/                 # MongoDB database models
│
├── routes/                 # API routes
│   ├── authRoutes.js
│   ├── foodRoutes.js
│   ├── orderRoutes.js
│   └── paymentRoutes.js
│
├── .env                    # Environment variables
├── .env.example            # Example environment variables
├── package.json
└── server.js               # Main backend server
```

## 🚀 Server Features

The main server is responsible for:

- Connecting the application with MongoDB.
- Handling REST APIs for authentication, food, orders, and payments.
- Using JWT-based authentication.
- Supporting secure HTTP cookies.
- Providing real-time updates using Socket.IO.
- Protecting APIs using Helmet and Rate Limiting.
- Handling cross-origin requests with CORS.

## 🔌 API Routes

| Route | Description |
|------|-------------|
| `/api/auth` | User authentication and authorization |
| `/api/food` | Food product management |
| `/api/orders` | Order creation and management |
| `/api/payment` | Payment-related operations |

## ⚡ Real-Time Updates

Socket.IO is integrated into the backend to support real-time communication.

```js
io.on("connection", (socket) => {
  socket.on("joinUserRoom", (userId) => {
    socket.join(userId);
  });
});
```

This allows users to join their own room and receive real-time order-related updates.

## 🛡️ Security

The backend includes multiple security features:

- **Helmet** for setting secure HTTP headers.
- **Express Rate Limit** to prevent excessive API requests.
- **CORS** configuration for frontend-backend communication.
- **Cookie Parser** for handling authentication cookies.
- **JWT** for user authentication and protected routes.

## ▶️ Run Backend Locally

```bash
# Move to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the development server
npm run dev
```

The backend server runs on:

```text
http://localhost:5000
```

 📦 Backend Dependencies

The backend uses the following technologies and packages:

- **Express.js** – Backend server and REST API development.
- **MongoDB & Mongoose** – Database connection and data modeling.
- **JWT** – User authentication and authorization.
- **bcryptjs** – Password hashing and security.
- **Socket.IO** – Real-time communication and order updates.
- **Cloudinary** – Cloud-based image storage and management.
- **Multer** – Handling file and image uploads.
- **Razorpay** – Online payment integration.
- **Cookie Parser** – Handling HTTP cookies.
- **CORS** – Frontend and backend cross-origin communication.
- **Helmet** – Security HTTP headers.
- **Express Rate Limit** – API rate limiting and request protection.
- **Dotenv** – Managing environment variables.
- **Nodemon** – Automatically restarting the development server.

## 📜 Available Backend Scripts

```bash
# Start the backend server
npm start

# Start the backend server with Nodemon
npm run dev
```

 Development Server

For development, Nodemon automatically restarts the server whenever changes are made.

```bash
npm run dev
```

 Production Server

To start the backend normally:

```bash
npm start
```

 🗄️ Database Connection

The application uses **MongoDB** as its database, and **Mongoose** is used to connect the Node.js backend with MongoDB.

The database connection is configured using an environment variable, keeping sensitive credentials outside the source code.

```js
// config/db.js

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};
```

   How It Works

- The MongoDB connection string is stored in `MONGO_URI`.
- Mongoose connects the backend to the MongoDB database.
- On successful connection, the database host is logged.
- If the connection fails, the error is displayed and the server stops safely.


## 🔐 JWT Authentication & Secure Cookies

The application uses **JSON Web Tokens (JWT)** for user authentication. After successful login or registration, a JWT token is generated using the user's ID.

The token is stored in an **HTTP-only cookie**, which helps prevent client-side JavaScript from directly accessing the authentication token.

### Token Generation

```js
const token = jwt.sign(
  { userId },
  process.env.JWT_SECRET,
  { expiresIn: "30d" }
);
```

### Secure Cookie Configuration

```js
res.cookie("token", token, {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
});
```

 Authentication Flow

1. The user successfully logs in or registers.
2. A JWT token is generated using the user's ID.
3. The token has a validity period of **30 days**.
4. The token is stored in an HTTP-only cookie.
5. Protected routes use the authentication token to verify the user.
6. The user remains authenticated until the token expires or the user logs out.

 Security Features

- **JWT-based authentication**
- **HTTP-only cookies**
- **30-day token expiration**
- **SameSite cookie protection**
- JWT secret managed through environment variables


 ☁️ Cloudinary Image Management

The application uses **Cloudinary** for cloud-based image storage and management.

Food or product images can be uploaded and managed through Cloudinary instead of storing image files directly on the backend server.

 Cloudinary Configuration

```js
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

 Features

- Cloud-based image storage
- Product and food image management
- Environment-based configuration
- Secure storage of Cloudinary credentials

All Cloudinary credentials are stored in environment variables and are not exposed directly in the source code.

## 🛡️ Authentication & Authorization Middleware

The backend uses middleware to protect private routes and control access based on user roles.

### 🔐 Protected Routes

The `protect` middleware verifies whether a valid JWT token is available before allowing access to private API routes.

The token can be received from:

- An HTTP-only cookie
- An `Authorization` header using the `Bearer` token format

```js
let token = req.cookies?.token;

if (!token) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
}

const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

After successful token verification, the authenticated user is fetched from the database without exposing the password and attached to the request object.

```js
const user = await User.findById(decoded.userId)
  .select("-password");

req.user = user;
```

### 👨‍💼 Admin Authorization

The `isAdmin` middleware provides role-based access control for admin-only routes.

```js
if (req.user.role !== "admin") {
  return res.status(403).json({
    success: false,
    message: "Access denied. Admin only.",
  });
}
```

### Middleware Features

- Protects private API routes
- Verifies JWT tokens
- Supports both cookie and Bearer token authentication
- Retrieves authenticated user information
- Excludes the user password from the request data
- Provides admin-only route protection
- Returns appropriate error responses for invalid or expired tokens

## 👤 User Model & Password Security

The application uses a MongoDB user model to manage user accounts and authentication-related information.

### User Information

Each user contains the following fields:

| Field | Description |
|---|---|
| `name` | User's name |
| `email` | Unique email address used for authentication |
| `password` | Securely hashed user password |
| `role` | User role: `customer` or `admin` |
| `phone` | User contact number |
| `createdAt` | Automatically generated account creation time |
| `updatedAt` | Automatically generated account update time |

### 🔒 Password Hashing

User passwords are never stored directly in plain text. Before saving a user, the password is hashed using **bcryptjs**.

```js
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

### 🔑 Password Verification

During login, the entered password is compared with the stored hashed password using bcrypt.

```js
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(
    enteredPassword,
    this.password
  );
};
```

### 👥 Role-Based Users

The application supports two user roles:

- **Customer** – Can browse food items, manage the cart, place orders, and view their orders.
- **Admin** – Has additional access to administrative features such as product management and the admin dashboard.

### Model Features

- Name validation and maximum length
- Unique and validated email addresses
- Minimum password length validation
- Secure password hashing using bcryptjs
- Password field excluded from normal database queries
- Customer and admin role support
- Automatic `createdAt` and `updatedAt` timestamps


## 🍔 Food/Product Model

The application uses a MongoDB model to manage all food and product information available on the platform.

Each food item is stored with its details, pricing, category, image information, availability status, and ratings.

### Food Information

| Field | Description |
|---|---|
| `name` | Name of the food item |
| `description` | Detailed description of the food item |
| `price` | Price of the food item |
| `image` | Cloudinary image URL |
| `cloudinaryId` | Cloudinary image identifier |
| `category` | Food category |
| `isAvailable` | Indicates whether the item is available |
| `ratings` | Food rating between 0 and 5 |
| `createdAt` | Automatically generated creation time |
| `updatedAt` | Automatically generated update time |

### 📂 Food Categories

The application supports the following food categories:

- Starters
- Main Course
- Desserts
- Beverages
- Fast Food

### 🖼️ Image Storage

Each food item stores both the image URL and the Cloudinary public identifier.

```js
image: {
  type: String,
  required: true,
},

cloudinaryId: {
  type: String,
  required: true,
},
```

This allows the application to display food images and manage them through Cloudinary.

### ✅ Food Availability

The availability of a food item is managed using the `isAvailable` field.

```js
isAvailable: {
  type: Boolean,
  default: true,
},
```

When a food item is unavailable, it can be displayed as **Sold Out** on the frontend.

### ⭐ Ratings

The model supports food ratings between `0` and `5`.

```js
ratings: {
  type: Number,
  default: 0,
  min: 0,
  max: 5,
},
```

### Model Features

- Food name and description validation
- Price validation to prevent negative values
- Category-based food organization
- Cloudinary image integration
- Food availability management
- Rating support from 0 to 5
- Automatic creation and update timestamps


## 📦 Order Management Model

The application uses a MongoDB order model to manage customer orders, including ordered food items, delivery details, payment information, pricing, and real-time order status.

Each order is connected to a registered user and can contain multiple food items.

### 🛒 Order Information

| Field | Description |
|---|---|
| `user` | Reference to the user who placed the order |
| `orderItems` | List of food items included in the order |
| `shippingAddress` | Customer delivery address |
| `paymentMethod` | Selected payment method |
| `paymentStatus` | Current payment status |
| `transactionId` | Payment transaction identifier |
| `itemsPrice` | Total price of all food items |
| `taxPrice` | Tax amount |
| `deliveryPrice` | Delivery charge |
| `totalPrice` | Final order amount |
| `status` | Current order delivery status |
| `isPaid` | Indicates whether the order has been paid |
| `paidAt` | Date and time of successful payment |

### 🍔 Order Items

Each order can contain multiple food items. Every item stores its own details, including:

- Food name
- Quantity
- Image
- Price
- Reference to the original Food document

```js
orderItems: [
  {
    name: String,
    quantity: Number,
    image: String,
    price: Number,
    food: mongoose.Schema.Types.ObjectId,
  },
];
```

### 📍 Delivery Address

The order model stores the customer's delivery information.

```js
shippingAddress: {
  address: String,
  city: String,
  postalCode: String,
}
```

### 💳 Payment Management

The application tracks payment details using:

- `paymentMethod`
- `paymentStatus`
- `transactionId`
- `isPaid`
- `paidAt`

The supported payment statuses are:

```text
Pending
Completed
Failed
```

### 🚚 Order Status Tracking

Each order moves through different stages during the delivery process:

```text
Placed
   ↓
Preparing
   ↓
Out for Delivery
   ↓
Delivered
```

An order can also be marked as:

```text
Cancelled
```

### 📊 Pricing Structure

The total order amount is managed using separate fields:

```text
Items Price
+ Tax Price
+ Delivery Price
----------------
= Total Price
```

This structure makes it easier to track individual pricing components and calculate the final order amount.

### Model Features

- User-based order association
- Multiple food items per order
- Delivery address management
- Payment status tracking
- Transaction ID storage
- Separate item, tax, and delivery pricing
- Multiple order delivery stages
- Paid/unpaid order tracking
- Automatic `createdAt` and `updatedAt` timestamps


## 🔑 Authentication System

The backend provides a complete authentication system for user registration, login, logout, and profile management.

### Available Authentication Features

- User registration
- User login
- JWT token generation
- HTTP-only cookie authentication
- Secure password verification using bcrypt
- User logout
- Protected user profile access
- Customer and admin role support

### 📝 User Registration

When a new user registers, the application first checks whether an account with the same email already exists.

```js
const userExists = await User.findOne({ email });

if (userExists) {
  return res.status(400).json({
    message: "User already exists with this email",
  });
}

const user = await User.create({
  name,
  email,
  password,
  phone,
  role: role || "customer",
});
```

After successful registration, a JWT token is generated and stored in an HTTP-only cookie.

### 🔐 User Login

During login, the application verifies the user's email and securely compares the entered password with the hashed password stored in the database.

```js
const user = await User.findOne({ email }).select("+password");

if (user && await user.matchPassword(password)) {
  const token = generateTokenAndSetCookie(res, user._id);
}
```

### 🚪 User Logout

The logout functionality clears the authentication cookie.

```js
res.cookie("token", "", {
  httpOnly: true,
  expires: new Date(0),
});
```

### 👤 User Profile

Authenticated users can access their profile through a protected route. User information is provided by the authentication middleware.

```text
GET /api/auth/profile
```

### Authentication Flow

```text
Register / Login
       ↓
Password Verification
       ↓
JWT Token Generation
       ↓
HTTP-Only Cookie
       ↓
Protected Routes
       ↓
User Profile Access
```

🔐 Login / Authentication
<img width="1912" height="982" alt="Screenshot (6)" src="https://github.com/user-attachments/assets/4340b1f2-9071-44d1-8320-7447aea6baae" />



## 🍽️ Food Management System

The backend provides APIs to manage food items. Users can view all available food items, while admin users can create and delete food products.

### Available Features

- View all food items
- Create new food items
- Upload food images to Cloudinary
- Add food using an image URL
- Delete food items
- Admin-only food management

### 📋 Get All Food Items

All food items are fetched from MongoDB and sorted by the latest created items.

```js
const foods = await Food.find({})
  .sort({ createdAt: -1 });
```

```text
GET /api/food
```

### ➕ Create Food Item

Admin users can create a new food item by providing:

- Name
- Description
- Price
- Category
- Food image or image URL

```js
const food = await Food.create({
  name,
  description,
  price: Number(price),
  category,
  image: finalImageUrl,
  cloudinaryId,
});
```

### 🖼️ Image Upload

If an image file is uploaded, it is stored in Cloudinary.

```js
const stream = cloudinary.uploader.upload_stream(
  { folder: "biterush_menu" },
  (error, result) => {
    if (error) return reject(error);
    resolve(result);
  }
);
```

The application also supports directly providing an image URL.

### 🗑️ Delete Food Item

Admin users can delete a food item using its MongoDB ID.

```js
const food = await Food.findById(req.params.id);

if (!food) {
  return res.status(404).json({
    message: "Food item not found",
  });
}

await food.deleteOne();
```

```text
DELETE /api/food/:id
```

 🔒 Access Control

| Feature | Access |
|---|---|
| View Food Items | Public |
| Create Food Item | Admin Only |
| Delete Food Item | Admin Only |

### Food Management Flow

```text
Admin
  ↓
Add Food Details
  ↓
Upload Image / Provide Image URL
  ↓
Cloudinary
  ↓
MongoDB Database
  ↓
Food Available on Frontend
```



## 📦 Order Management System

The backend provides a complete order management system for customers and administrators.

Customers can place orders and view their previous orders, while administrators can manage all orders, update order statuses, and access sales analytics.

### Available Features

- Create new orders
- Support multiple food items in one order
- Shipping address management
- Cash on Delivery (COD) and online payment support
- Payment status tracking
- Transaction ID generation
- View logged-in user's orders
- Admin order management
- Order status updates
- Real-time order status notifications
- Sales and popular item analytics

---

### 🛒 Create Order

When a customer places an order, the application validates and normalizes the order items and shipping address before saving the order.

MongoDB transactions are used to safely create the order.

```js
const session = await mongoose.startSession();

session.startTransaction();

const order = new Order({
  user: req.user._id,
  orderItems: normalizedItems,
  shippingAddress: normalizedShippingAddress,
  paymentMethod: selectedPaymentMethod,
  totalPrice: totalPriceValue,
});

const createdOrder = await order.save({ session });

await session.commitTransaction();
```

If an error occurs during order creation, the transaction is aborted.

---

### 📋 Customer Orders

Authenticated users can view only their own orders.

```js
const orders = await Order.find({
  user: req.user._id,
}).sort({
  createdAt: -1,
});
```

```text
GET /api/orders/myorders
```

Orders are sorted with the newest orders displayed first.

---

 👨‍💼 Admin Order Management

Administrators can access all orders and view customer information.

```js
const orders = await Order.find({})
  .populate("user", "name email")
  .sort({ createdAt: -1 });
```

```text
GET /api/orders
```

This allows the admin dashboard to manage and monitor customer orders.

---

### 🔄 Order Status Management

Administrators can update the status of an order.

Supported order statuses:

```text
Placed
Preparing
Out for Delivery
Delivered
Cancelled
```

The order status is validated before updating.

```js
if (!allowedStatus.includes(status)) {
  return res.status(400).json({
    success: false,
    message: "Invalid order status",
  });
}
```

---


👨‍💼Admin Dashboard & Order Management
<img width="1920" height="998" alt="Screenshot (7)" src="https://github.com/user-attachments/assets/26db7af5-af26-4098-8e25-fda8ddc4edf0" />




### ⚡ Real-Time Order Updates

When an admin changes the order status, the update is sent to the specific customer using Socket.IO.

```js
io.to(order.user.toString()).emit(
  "orderStatusUpdated",
  {
    orderId: order._id,
    status: order.status,
  }
);
```

🍔 Admin Product Panel

<img width="1918" height="964" alt="Screenshot (8)" src="https://github.com/user-attachments/assets/b841894f-a3a4-4bfc-a4e5-83b8d56f21e7" />


This allows customers to receive real-time updates about their order progress.

---

### 💳 Payment Handling

The order system manages both COD and online payment orders.

```text
COD Order
    ↓
Payment Status: Pending

Online Payment
    ↓
Payment Status: Completed
    ↓
Transaction ID Generated
```

The order also stores:

- Payment method
- Payment status
- Transaction ID
- Paid/unpaid status
- Payment date

---

### 📊 Admin Analytics

The admin dashboard includes order analytics generated from MongoDB aggregation.

The analytics provide:

- Total sales
- Total number of orders
- Average order value
- Popular food items
- Quantity sold for each item
- Revenue generated by individual food items

```js
const analytics = await Order.aggregate([
  {
    $match: {
      status: { $ne: "Cancelled" },
    },
  },
  {
    $group: {
      _id: null,
      totalSales: { $sum: "$totalPrice" },
      totalOrders: { $sum: 1 },
      averageOrderValue: { $avg: "$totalPrice" },
    },
  },
]);
```

---

### 🔌 Order API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Private | Create a new order |
| `GET` | `/api/orders/myorders` | Private | Get logged-in user's orders |
| `GET` | `/api/orders` | Admin | Get all orders |
| `GET` | `/api/orders/admin/analytics` | Admin | Get sales and order analytics |
| `PUT` | `/api/orders/:id/status` | Admin | Update order status |

---

### 🔄 Order Flow

```text
Customer
   ↓
Add Food to Cart
   ↓
Place Order
   ↓
Order Validation
   ↓
MongoDB Transaction
   ↓
Order Created
   ↓
Admin Manages Order
   ↓
Status Updated
   ↓
Socket.IO Notification
   ↓
Customer Receives Update
```


## 💳 Razorpay Payment Integration

The application integrates **Razorpay** to support online payments for food orders.

The payment system creates a Razorpay order on the backend and verifies the payment signature after a successful transaction.

### Available Features

- Create Razorpay payment orders
- Indian Rupee (INR) support
- Amount conversion from Rupees to Paise
- Secure payment signature verification
- Razorpay test/mock mode support
- Environment variable-based Razorpay configuration

---

### 💰 Create Payment Order

Before opening the payment gateway, the backend creates a Razorpay order.

The amount is converted from Rupees to Paise because Razorpay processes the amount in the smallest currency unit.

```js
const amountInPaise = Math.round(
  Number(amount || 0) * 100
);

const order = await razorpay.orders.create({
  amount: amountInPaise,
  currency: "INR",
  receipt,
});
```

The payment order is then sent to the frontend.

```text
POST /api/payment/create-order
```

---

### 🔐 Payment Verification

After the payment is completed, the backend verifies the Razorpay payment signature using HMAC SHA-256.

```js
const body =
  `${razorpay_order_id}|${razorpay_payment_id}`;

const expectedSignature = crypto
  .createHmac(
    "sha256",
    process.env.RAZORPAY_KEY_SECRET
  )
  .update(body)
  .digest("hex");

const isValid =
  expectedSignature === razorpay_signature;
```

This ensures that the payment response is verified on the backend.

```text
POST /api/payment/verify
```

---

### 🧪 Mock/Test Mode

The payment controller also supports a mock mode.

If Razorpay credentials are not available, the application can return a mock payment order for testing and development purposes.

```text
Razorpay Credentials Available
            ↓
      Razorpay Payment

Razorpay Credentials Missing
            ↓
        Mock Mode
```

---

 🔑 Environment Variables

Razorpay credentials are stored securely using environment variables:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Never expose the Razorpay secret key in the frontend or commit it to GitHub.

---

### 🔌 Payment API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/payment/create-order` | Create a Razorpay payment order |
| `POST` | `/api/payment/verify` | Verify Razorpay payment signature |

---

### 💳 Payment Flow

```text
Customer
   ↓
Place Order
   ↓
Select Online Payment
   ↓
Backend Creates Razorpay Order
   ↓
Razorpay Payment Gateway
   ↓
Payment Completed
   ↓
Backend Verifies Signature
   ↓
Payment Confirmed
```

📦 My Orders & Order Tracking ← ye last mein

<img width="1920" height="982" alt="Screenshot (9)" src="https://github.com/user-attachments/assets/7f377e04-f646-438a-ae8d-e7bd5c93a7f4" />



## 📂 Backend Project Structure

```text
backend/
│
├── config/                         # Configuration files
│   ├── db.js                       # MongoDB database connection
│   ├── jwtToken.js                 # JWT token generation and cookie setup
│   └── cloudinary.js               # Cloudinary configuration
│
├── controllers/                    # Application business logic
│   ├── authController.js           # Register, login, logout and user profile
│   ├── foodController.js           # Food item management
│   ├── orderController.js          # Orders, status updates and analytics
│   └── paymentController.js        # Razorpay payment handling and verification
│
├── middlewares/                    # Custom middleware
│   └── authMiddleware.js           # JWT authentication and admin authorization
│
├── models/                         # MongoDB database models
│   ├── userModel.js                # User schema and password hashing
│   ├── foodModel.js                # Food item schema
│   └── orderModel.js               # Order and payment schema
│
├── routes/                         # API route definitions
│   ├── authRoutes.js               # Authentication routes
│   ├── foodRoutes.js               # Food management routes
│   ├── orderRoutes.js              # Order management routes
│   └── paymentRoutes.js            # Payment routes
│
├── .env                            # Environment variables (not committed)
├── .env.example                    # Example environment configuration
├── package.json                    # Dependencies and scripts
└── server.js                       # Main Express server and Socket.IO setup
```


 ⚙️ Backend

 📂 Backend Project Structure

 🛠️ Backend Tech Stack

 🗄️ Database Connection

 🔐 JWT Authentication & Secure Cookies

 🛡️ Authentication & Authorization Middleware

 👤 User Model & Password Security

 🍔 Food/Product Model

 📦 Order Management Model

 🔑 Authentication System

 🍽️ Food Management System

 📦 Order Management System

 💳 Razorpay Payment Integration

 ⚡ Real-Time Updates

 ☁️ Cloudinary Image Management

 🛡️ Security

 📦 Backend Dependencies

 📜 Available Backend Scripts

 ▶️ Run Backend Locally








