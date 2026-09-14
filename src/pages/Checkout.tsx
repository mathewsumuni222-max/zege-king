import { useState } from "react"
import type { FormEvent } from "react"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { saveOrder } from "../data/orders"
import type { Order } from "../data/orders"

type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
}

type CheckoutProps = {
  cartItems: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  onBack: () => void
  onOrderPlaced: (order: Order) => void
}

const formatPrice = (price: number) => `TSh ${price.toLocaleString()}`

export default function Checkout({
  cartItems,
  subtotal,
  deliveryFee,
  total,
  onBack,
  onOrderPlaced,
}: CheckoutProps) {
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery")
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert("Please fill in your name, phone number and delivery address.")
      return
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.")
      return
    }

    const order: Order = {
      id: `ZK-${Date.now().toString().slice(-6)}`,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      paymentMethod,
      items: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      deliveryFee,
      total,
      status: "Pending",
      createdAt: new Date().toISOString(),
    }

    saveOrder(order)
    setSubmitted(true)

    setTimeout(() => {
      onOrderPlaced(order)
    }, 700)
  }

  if (submitted) {
    return (
      <main className="checkout-page success-page">
        <div className="success-card">
          <CheckCircle2 size={64} />
          <h1>Order Received!</h1>
          <p>
            Your Zege King order has been placed successfully.
          </p>
          <p>
            Order number: <strong>{`ZK-${Date.now().toString().slice(-6)}`}</strong>
          </p>
          <p>Taking you to order tracking...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={18} />
        Back to Menu
      </button>

      <div className="checkout-layout">
        <section className="checkout-form-card">
          <div className="section-heading">
            <span>ZEGE KING</span>
            <h1>Checkout</h1>
            <p>Enter your delivery details and place your order.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Full Name
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </label>

            <label>
              Phone Number
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XXXXXXXX"
                required
              />
            </label>

            <label>
              Delivery Address
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, area, building or landmark"
                rows={4}
                required
              />
            </label>

            <label>
              Payment Method
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option>Cash on Delivery</option>
                <option>Mobile Money</option>
                <option>Card</option>
              </select>
            </label>

            <label>
              Order Notes <span>(optional)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Extra instructions..."
                rows={3}
              />
            </label>

            <button className="place-order-button" type="submit">
              Place Order • {formatPrice(total)}
            </button>
          </form>
        </section>

        <aside className="order-summary-card">
          <h2>Your Order</h2>

          <div className="checkout-items">
            {cartItems.map((item) => (
              <div className="checkout-item" key={item.id}>
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
          </div>

          <div className="summary-line">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <div className="summary-line">
            <span>Delivery</span>
            <strong>{formatPrice(deliveryFee)}</strong>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <div className="delivery-note">
            🚴 Delivery available in Dar es Salaam
          </div>
        </aside>
      </div>
    </main>
  )
}