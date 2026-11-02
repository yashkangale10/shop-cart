import { CheckoutActorContext } from '../machines/CheckoutActorContext';

/**
 * Subscribes to the machine's transition capabilities to declaratively
 * enable/disable itself. Uses `snapshot.can({ type: 'SUBMIT' })` so the
 * button is disabled whenever the guard (cart not empty) fails or the
 * machine is in a state that doesn't handle SUBMIT — no hardcoded
 * business validation in JSX.
 */
export default function CheckoutButton() {
  const actorRef = CheckoutActorContext.useActorRef();
  const canSubmit = CheckoutActorContext.useSelector((state) =>
    state.can({ type: 'SUBMIT' }),
  );
  const isSubmitting = CheckoutActorContext.useSelector((state) =>
    state.matches('submitting'),
  );

  return (
    <button
      className="btn btn-checkout"
      onClick={() => actorRef.send({ type: 'SUBMIT' })}
      disabled={!canSubmit}
    >
      {isSubmitting ? 'Processing...' : 'Checkout'}
    </button>
  );
}

