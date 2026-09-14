import { ArrowLeft, CheckCircle2, Clock3, CookingPot, Bike, PackageCheck } from "lucide-react"
import type { Order } from 
"../data/orders"
type TrackingProps = {
  order: Order | null
  onBack: () => void
}

const steps: Order["status"][] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Completed",
]

const formatPrice = (price: number) =>
  `TSh ${price.toLocaleString()}`

export default function Tracking({
  order,
  onBack,
}: TrackingProps) {
  if (!order) {
    return (
      <main className="tracking-page">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Menu
        </button>

        <div className="empty-state">
          <h1>No active order</h1>
          <p>Place an order first to track it here.</p>
        </div>
      </main>
    )
  }

  const currentStep = steps.indexOf(order.status)

  return (
    <main className="tracking-page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={18} />
        Back to Menu
      </button>

      <section className="tracking-card">
        <div className="tracking-top">
          <div>
            <span className="eyebrow">ZEGE KING</span>
            <h1>Track Your Order</h1>
            <p>
              Order <strong>{order.id}</strong>
            </p>
          </div>

          <div className="tracking-status">
            {order.status}
          </div>
        </div>

        <div className="tracking-progress">
          {steps.map((step, index) => {
            const completed = index <= currentStep

            return (
              <div
                className={`tracking-step ${
                  completed ? "completed" : ""
                }`}
                key={step}
              >
                <div className="step-icon">
                  {index === 0 && <Clock3 size={20} />}
                  {index === 1 && <CheckCircle2 size={20} />}
                  {index === 2 && <CookingPot size={20} />}
                  {index === 3 && <PackageCheck size={20} />}
                  {index === 4 && <Bike size={20} />}
                  {index === 5 && <CheckCircle2 size={20} />}
                </div>

                <strong>{step}</strong>
              </div>
            )
          })}
        </div>

        <div className="tracking-details">
          <div>
            <span>Customer</span>
            <strong>{order.customerName}</strong>
          </div>

          <div>
            <span>Phone</span>
            <strong>{order.phone}</strong>
          </div>

          <div>
            <span>Delivery Address</span>
            <strong>{order.address}</strong>
          </div>

          <div>
            <span>Payment</span>
            <strong>{order.paymentMethod}</strong>
          </div>
        </div>

        <div className="tracking-order">
          <h2>Order Items</h2>

          {order.items.map((item) => (
            <div className="tracking-item" key={item.productId}>
              <div>
                <strong>{item.name}</strong>
                <span>
                  {item.quantity} × {formatPrice(item.price)}
                </span>
              </div>

              <strong>
                {formatPrice(item.price * item.quantity)}
              </strong>
            </div>
          ))}

          <div className="tracking-total">
            <span>Total</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>
        </div>

        <div className="tracking-message">
          {order.status === "Pending" &&
            "👑 We received your order. Waiting for confirmation."}

          {order.status === "Confirmed" &&
            "✅ Your order has been confirmed by Zege King."}

          {order.status === "Preparing" &&
            "🔥 Your Zege is being prepared fresh."}

          {order.status === "Ready" &&
            "🍟 Your order is ready for pickup or delivery."}

          {order.status === "Out for Delivery" &&
            "🛵 Your order is on the way!"}

          {order.status === "Completed" &&
            "👑 Order completed. Thank you for choosing Zege King!"}
        </div>
      </section>
    </main>
  )
}