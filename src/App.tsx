import Header from './components/Header';
import Catalog from './components/Catalog';
import CartDrawer from './components/CartDrawer';
import PaymentPanel from './components/PaymentPanel';
import CartSynchronizer from './components/CartSynchronizer';
import OrderCompletionBridge from './components/OrderCompletionBridge';
import { CheckoutActorContext } from './machines/CheckoutActorContext';
import './App.css';
import { useCartStore } from './store/CartStore';
import { useShallow } from 'zustand/shallow';

function App() {
  const { cartOpen, toggleCartDrawer } = useCartStore(useShallow((state) => ({ cartOpen: state.cartOpen, toggleCartDrawer: state.toggleCartDrawer })))

  return (
    <CheckoutActorContext.Provider>
      <CartSynchronizer />
      <OrderCompletionBridge />
      <Header />
      <main className="main-content">
        <Catalog />
      </main>
      <CartDrawer isOpen={cartOpen} onClose={() => toggleCartDrawer()} />
      <PaymentPanel />
    </CheckoutActorContext.Provider>
  );
}

export default App;
