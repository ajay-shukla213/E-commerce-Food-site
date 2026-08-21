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

### Cart Item Counter

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

### 🍔 Food Product Display & Cart Integration

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
