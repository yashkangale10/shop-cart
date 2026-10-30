# ShopCart — Deliverable 3

ShopCart is a shopping cart web application built with React, TypeScript, and Vite. This project implements Deliverable 3, migrating state management to [Jotai](https://jotai.org/) using an atomic state architecture, primitive base atoms, derived read-only atoms, write-only action atoms, and granular reactive subscriptions (`useAtomValue` and `useSetAtom`).

---

## Features

- **Product Catalog State**:
  - Base atoms (`productsAtom`, `fetchStatusAtom`, `productErrorAtom`) manage inventory and retrieval status.
  - Fetches product inventory asynchronously via `fetchProductsAtom` from a simulated REST API (`/api/products`).
  - Granular request lifecycle management (`idle`, `fetching`, `error`, `success`).
- **Cart State Management**:
  - `cartItemsAtom`: Base primitive atom tracking line items and quantities.
  - `addItemAtom`: Write-only action atom that increments item quantity if existing, appends a new item with `quantity: 1` if not, and resets checkout status.
  - `removeItemAtom`: Action atom that filters out an item by ID.
  - `clearCartAtom`: Resets the cart to an empty array.
  - **Derived Read-Only Atoms**: `totalItemCountAtom` and `totalCartPriceAtom` compute total units and price dynamically from `cartItemsAtom` with automatic dependency tracking and zero state duplication.
  - **Asynchronous Checkout (`checkoutAtom`)**: Validates cart contents and submits order details to `/api/orders` with explicit `submitting`, `success`, and `error` status reporting.
- **UI State Management**:
  - Controls slide-over cart drawer visibility via `cartOpenAtom` and `toggleCartDrawerAtom`.
- **Optimized Rendering & Atomic Subscriptions**:
  - Action-only components (e.g. `ProductCard`, `Toolbar`) subscribe strictly to action atoms using `useSetAtom`, avoiding re-renders when cart or product state mutates.
  - Read-only consumers (e.g. `CartBadge`, `CartItemsList`) subscribe strictly to derived atoms using `useAtomValue`.
- **Slide-Over Drawer**: Responsive sliding cart drawer with backdrop, empty cart placeholder, live status updates, and interactive checkout button.
- **Mock REST API**: Powered by `json-server` with a simulated delay to emulate real-world latency.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool / Dev Server**: [Vite](https://vitejs.dev/)
- **State Management**: [Jotai 3](https://jotai.org/) (Atomic State Architecture)
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
│   ├── atoms/
│   │   └── CartAtoms.tsx         # Centralized Jotai atoms (Base, Derived, Actions)
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

## State Management Architecture (Jotai)

State is organized into composable **atoms** defined in `src/atoms/CartAtoms.tsx`:

### 1. Base State Atoms (`PrimitiveAtom`)
Hold primitive, mutable state and can be directly read or updated:
- `cartItemsAtom`: `PrimitiveAtom<CartItem[]>` — Items currently in the cart.
- `checkoutStatusAtom`: `PrimitiveAtom<CheckoutStatus>` — Current checkout status (`idle | submitting | error | success`).
- `cartErrorAtom`: `PrimitiveAtom<string | null>` — Error message if checkout fails.
- `productsAtom`: `PrimitiveAtom<Product[]>` — Product inventory items.
- `fetchStatusAtom`: `PrimitiveAtom<FetchStatus>` — Product retrieval status (`idle | fetching | error | success`).
- `productErrorAtom`: `PrimitiveAtom<string | null>` — Error message if product fetching fails.
- `cartOpenAtom`: `PrimitiveAtom<boolean>` — Slide-over drawer visibility state.

### 2. Derived Read-Only Atoms
Compute values dynamically from base atoms using Jotai's `get` function:
- `totalItemCountAtom`: Computes the sum of all item quantities (`sum + item.quantity`).
- `totalCartPriceAtom`: Computes the overall cart total (`sum + item.price * item.quantity`).

### 3. Action Atoms (Write-Only)
Encapsulate mutations and async side effects using write-only atoms (`atom(null, writeFn)`):
- `addItemAtom`: Appends or increments item quantities in `cartItemsAtom` and resets `checkoutStatusAtom`.
- `removeItemAtom`: Removes a specific item by its `id`.
- `clearCartAtom`: Empties the cart.
- `checkoutAtom`: Async atom that sends the cart payload to `/api/orders`, updates `checkoutStatusAtom`, and clears cart on success.
- `fetchProductsAtom`: Async atom that fetches `/api/products` and updates `productsAtom`, `fetchStatusAtom`, and `productErrorAtom`.
- `toggleCartDrawerAtom`: Inverts `cartOpenAtom`.

### 4. Granular Component Subscriptions

Components subscribe only to the exact slice of state they require using specialized hooks:
- **`useAtomValue`**: For components that only render data (e.g. `CartBadge` subscribes only to `totalItemCountAtom`).
- **`useSetAtom`**: For components that trigger mutations (e.g. `ProductCard` subscribes to `addItemAtom` without re-rendering when cart items change).

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
