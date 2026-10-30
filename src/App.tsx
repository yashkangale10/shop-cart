import Header from './components/Header';
import Catalog from './components/Catalog';
import CartDrawer from './components/CartDrawer';
import './App.css';
import { useAtomValue, useSetAtom } from 'jotai';
import { cartOpenAtom, toggleCartDrawerAtom } from './atoms/CartAtoms';

function App() {
  const cartOpen = useAtomValue(cartOpenAtom);
  const toggleCartDrawer = useSetAtom(toggleCartDrawerAtom);

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
