import Header from './components/Header';
import Catalog from './components/Catalog';
import CartDrawer from './components/CartDrawer';
import './App.css';
import { useCartStore } from './store/CartStore';
import { useShallow } from 'zustand/shallow';

function App() {
  const { cartOpen, toggleCartDrawer } = useCartStore(useShallow((state) => ({ cartOpen: state.cartOpen, toggleCartDrawer: state.toggleCartDrawer })))

  return (
    <>
      <Header />
      <main className="main-content">
        <Catalog />
      </main>
      <CartDrawer isOpen={cartOpen} onClose={() => toggleCartDrawer()} />
    </>
  );
}

export default App;
