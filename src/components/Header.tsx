import Toolbar from './Toolbar';

type Props = {
  onCartOpen: () => void;
};

export default function Header({ onCartOpen }: Props) {
  return (
    <header className="site-header">
      <Toolbar onCartOpen={onCartOpen} />
    </header>
  );
}

