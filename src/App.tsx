import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Catalog from './components/Catalog';
import CartDrawer from './components/CartDrawer';
import './App.css';

function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <CartProvider>
      <Header onCartOpen={() => setCartOpen(true)} />
      <main className="main-content">
        <Catalog />
      </main>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </CartProvider>
  );
}

export default App;
