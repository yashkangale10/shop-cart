# ShopCart — Deliverable 2

ShopCart is a shopping cart web application built with React, TypeScript, and Vite. This project implements Deliverable 2, migrating state management from React Context to [Zustand](https://github.com/pmndrs/zustand) using a modular, sliced-store architecture, atomic and shallow-equality selectors (`useShallow`), and asynchronous side-effect handlers.

---

## Features

- **Product Catalog (`ProductSlice`)**:
  - Fetches product inventory asynchronously via a simulated REST API (`/api/products`).
  - Granular request lifecycle management (`idle`, `fetching`, `error`, `success`).
- **Cart State Management (`CartSlice`)**:
  - Add items to the cart (`addItem`: increments item quantity if existing, appends new item with `quantity: 1` if not, and resets checkout status).
  - Remove entire line items from the cart (`removeItem`).
  - Derived calculations for line item subtotals, cart total, and total item count badge without state duplication.
  - **Asynchronous Checkout (`checkout`)**: Validates cart contents and submits order details to `/api/orders` with explicit `submitting`, `success`, and `error` status reporting.
- **UI State Management (`UiSlice`)**:
  - Controls slide-over cart drawer visibility (`cartOpen`, `toggleCartDrawer`).
- **Optimized Rendering & Selectors**:
  - Action-only components (e.g. `ProductCard`) subscribe strictly to action creators, avoiding re-renders when cart or product state mutates.
  - Multi-property consumers (e.g. `CartDrawer`, `CartItemsList`, `Toolbar`, `App`) employ `useShallow` to ensure stable references and eliminate redundant re-render cycles.
- **Slide-Over Drawer**: Responsive sliding cart drawer with backdrop, empty cart placeholder, live status updates, and interactive checkout button.
- **Mock REST API**: Powered by `json-server` with a simulated delay to emulate real-world latency.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool / Dev Server**: [Vite](https://vitejs.dev/)
- **State Management**: [Zustand 5](https://github.com/pmndrs/zustand) (Sliced Store Pattern)
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
    ├── CartItemsList
    └── (Checkout Status Feedback)
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
│   ├── store/
│   │   └── CartStore.tsx         # Combined Zustand store with modular slices (Cart, Product, UI)
│   ├── components/
│   │   ├── Header.tsx            # Navigation container
│   │   ├── Toolbar.tsx           # Store branding and cart trigger
│   │   ├── CartBadge.tsx         # Total item count badge
│   │   ├── Catalog.tsx           # Product catalog grid and data fetcher
│   │   ├── ProductCard.tsx       # Individual product card (action subscriber)
│   │   ├── CartDrawer.tsx        # Slide-over sidebar drawer with checkout & live status
│   │   └── CartItemsList.tsx     # Cart contents, subtotals, and remove actions
│   ├── App.tsx                   # Root component
│   ├── App.css                   # Global styling and component layout
│   └── main.tsx                  # Application entry point
```

---

## State Management Architecture (Zustand)

The store is organized using Zustand's **Slice Pattern** (`StateCreator`), allowing logical domain separation into modular slices while exposing a single unified hook (`useCartStore`):

### 1. `ProductSlice`
Manages product catalog data and retrieval lifecycle:
- `products: Product[]`: Cached inventory items.
- `fetchStatus: 'idle' | 'fetching' | 'error' | 'success'`: Request status.
- `productError: string | null`: Error message on failure.
- `fetchProducts: () => Promise<void>`: Asynchronously loads `/api/products`.

### 2. `CartSlice`
Manages shopping cart operations and order processing:
- `items: CartItem[]`: Items currently in the cart with their respective quantities.
- `checkoutStatus: 'idle' | 'submitting' | 'error' | 'success'`: Order placement status.
- `cartError: string | null`: Error description if checkout fails.
- `addItem: (product: Product) => void`: Immutably adds or increments an item; resets previous checkout status.
- `removeItem: (id: string) => void`: Filters out an item by ID.
- `checkout: () => Promise<void>`: Submits an order object (`{ items, total, outcome }`) to `/api/orders` and clears the cart on success.

### 3. `UiSlice`
Manages local UI controls shared across decoupled components:
- `cartOpen: boolean`: Toggle state for the cart drawer.
- `toggleCartDrawer: () => void`: Inverts drawer visibility.

### 4. Fine-Grained Subscriptions & `useShallow`
To avoid unnecessary re-renders:
- Components subscribe to atomic primitives where possible:
  ```tsx
  const addToCart = useCartStore((s) => s.addItem);
  ```
- When extracting composite objects, `useShallow` from `zustand/shallow` ensures shallow reference comparison:
  ```tsx
  const { onCheckout, checkoutStatus, cartError, itemCount } = useCartStore(
    useShallow((state) => ({
      onCheckout: state.checkout,
      checkoutStatus: state.checkoutStatus,
      cartError: state.cartError,
      itemCount: state.items.length,
    }))
  );
  ```

### 5. Derived Values
Computed on-the-fly inside consumer components to avoid stale or duplicated state:
- **Total item quantity**: `items.reduce((sum, item) => sum + (item.quantity || 0), 0)`
- **Line item subtotal**: `item.price * item.quantity`
- **Cart total**: `items.reduce((sum, item) => sum + item.price * item.quantity, 0)`

---

## API Configuration & Proxy

- **Mock API**: `json-server` runs on port `3001` with a simulated delay of 1500ms:
  ```json
  "server": "json-server --watch db.json --port 3001 --delay 1500"
  ```
- **Endpoints**:
  - `GET /api/products`: Returns the catalog of products.
  - `POST /api/orders`: Records checkout orders.
- **Vite Proxy**: Configured in `vite.config.ts` to forward frontend `/api/*` calls to `http://localhost:3001/*`:
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
