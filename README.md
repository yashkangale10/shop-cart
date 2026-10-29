# ShopCart — Deliverable 1

ShopCart is a shopping cart web application built with React, TypeScript, and Vite. This project implements the foundational architecture and UI for Deliverable 1, utilizing React Context API and `useReducer` for clean, decoupled state management.

---

## Features

- **Product Catalog**: Fetches products via a simulated REST API with loading and error states.
- **Cart State Management**:
  - Add items to the cart (increments quantity if already added, adds new entry if not).
  - Remove entire item entries from the cart.
  - Derived calculations for item subtotals, cart total, and badge count without duplicating state.
- **Decoupled Architecture**:
  - Separate `CartStateContext` and `CartDispatchContext` to avoid unnecessary re-renders in dispatch-only components (e.g. `ProductCard`).
  - Custom consumer hooks (`useCartState` and `useCartDispatch`) with explicit runtime validation.
- **Slide-Over Drawer**: Responsive cart drawer with backdrop and smooth sliding transitions.
- **Mock REST API**: Powered by `json-server` with a simulated 1.5-second network delay.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool / Dev Server**: [Vite](https://vitejs.dev/)
- **State Management**: React Context API + `useReducer`
- **Mock API**: `json-server@0.17.4`
- **Styling**: Pure semantic CSS (no third-party UI libraries)

---

## Component Hierarchy

```text
App
├── Header
│   └── Toolbar
│       └── CartBadge
├── Catalog
│   └── ProductCard
└── CartDrawer
    └── CartItemsList
```

---

## Project Structure

```text
shop-cart/
├── db.json                       # Mock API database (products & orders)
├── vite.config.ts                # Vite config with API proxy setup
├── package.json                  # Scripts & dependencies
├── src/
│   ├── types/
│   │   └── index.ts              # Shared TypeScript definitions (Product, CartItem, CheckoutResult)
│   ├── context/
│   │   └── CartContext.tsx       # Reducer, contexts, CartProvider, custom hooks
│   ├── components/
│   │   ├── Header.tsx            # Navigation container
│   │   ├── Toolbar.tsx           # Store branding and cart trigger
│   │   ├── CartBadge.tsx         # Total item count badge
│   │   ├── Catalog.tsx           # Product catalog grid and data fetcher
│   │   ├── ProductCard.tsx       # Individual product card (dispatch only)
│   │   ├── CartDrawer.tsx        # Slide-over sidebar drawer
│   │   └── CartItemsList.tsx     # Cart contents, subtotals, and remove actions
│   ├── App.tsx                   # Root component
│   ├── App.css                   # Global styling and component layout
│   └── main.tsx                  # Application entry point
```

---

## State Management Architecture

### Pure Reducer (`cartReducer`)
Manages cart state updates without side effects or mutations:
- `ADD_PRODUCT`: Finds existing product by ID; increments `quantity` if present, or appends a new item with `quantity: 1`.
- `REMOVE_PRODUCT`: Filters out the entire item entry by ID.

### Split Contexts for Performance
To prevent unnecessary re-renders:
- `CartStateContext`: Holds `{ items: CartItem[] }`. Consumed by components that display cart details (`CartBadge`, `CartItemsList`).
- `CartDispatchContext`: Holds `Dispatch<CartAction>`. Consumed by components that only trigger actions (`ProductCard`). When cart state updates, dispatch-only consumers do not re-render.

### Derived Values
Values such as:
- Total item quantity: `items.reduce((sum, item) => sum + item.quantity, 0)`
- Line item subtotal: `price * quantity`
- Cart total: `items.reduce((sum, item) => sum + item.price * item.quantity, 0)`

are calculated dynamically in the UI and are not duplicated in the reducer state.

---

## API Configuration & Proxy

- **Mock API**: `json-server` runs on port `3001` with a simulated delay of 1500ms:
  ```json
  "server": "json-server --watch db.json --port 3001 --delay 1500"
  ```
- **Vite Proxy**: The frontend interacts with `/api/products`. Vite forwards requests to `http://localhost:3001/products` via the proxy configured in `vite.config.ts`:
  ```ts
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  }
  ```

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Servers

Run the mock server and the Vite development server in two separate terminals:

**Terminal 1 — Mock API Server:**
```bash
npm run server
```
*Starts mock API on [http://localhost:3001](http://localhost:3001).*

**Terminal 2 — Frontend Application:**
```bash
npm run dev
```
*Starts frontend on [http://localhost:5173](http://localhost:5173).*

---

## Build & Verification

To verify TypeScript types and build the production bundle:

```bash
npm run build
```
