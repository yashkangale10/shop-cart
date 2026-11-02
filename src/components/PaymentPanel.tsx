import { CheckoutActorContext } from '../machines/CheckoutActorContext';

/**
 * Sibling panel to CartDrawer rendered directly inside App.tsx.
 * Shares the same checkout actor and displays payment processing status,
 * error alerts, and action triggers ("Submit Payment", "Cancel").
 *
 * Each selector subscribes to a specific state slice so the component
 * only re-renders when its subscribed values change.
 */
export default function PaymentPanel() {
  const actorRef = CheckoutActorContext.useActorRef();
  const isReviewing = CheckoutActorContext.useSelector((state) =>
    state.matches('reviewing'),
  );
  const isSubmitting = CheckoutActorContext.useSelector((state) =>
    state.matches('submitting'),
  );
  const isSuccess = CheckoutActorContext.useSelector((state) =>
    state.matches('success'),
  );
  const error = CheckoutActorContext.useSelector(
    (state) => state.context.error,
  );
  const itemCount = CheckoutActorContext.useSelector(
    (state) => state.context.items.length,
  );
  const canSubmit = CheckoutActorContext.useSelector((state) =>
    state.can({ type: 'SUBMIT' }),
  );

  return (
    <section className="payment-panel">
      <div className="payment-panel-header">Payment</div>

      <div className="payment-panel-body">
        {isSubmitting && (
          <div className="payment-status payment-status--submitting">
            ⏳ Processing payment…
          </div>
        )}
        {isSuccess && (
          <div className="payment-status payment-status--success">
            ✅ Order placed successfully!
          </div>
        )}
        {error && (
          <div className="payment-status payment-status--error">❌ {error}</div>
        )}
        {isReviewing && !error && (
          <div className="payment-status payment-status--idle">
            {itemCount > 0
              ? `${itemCount} item${itemCount !== 1 ? 's' : ''} ready for checkout`
              : 'Add items to cart to begin checkout'}
          </div>
        )}
      </div>

      <div className="payment-panel-actions">
        <button
          className="btn btn-submit-payment"
          onClick={() => actorRef.send({ type: 'SUBMIT' })}
          disabled={!canSubmit}
        >
          Submit Payment
        </button>
        <button
          className="btn btn-cancel-payment"
          onClick={() => actorRef.send({ type: 'CANCEL' })}
          disabled={!isSubmitting}
        >
          Cancel
        </button>
      </div>
    </section>
  );
}

