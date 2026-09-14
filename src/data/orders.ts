export type OrderItem = {
  productId: number
  name: string
  price: number
  quantity: number
}

export type Order = {
  id: string
  customerName: string
  phone: string
  address: string
  paymentMethod: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status:
    | "Pending"
    | "Confirmed"
    | "Preparing"
    | "Ready"
    | "Out for Delivery"
    | "Completed"
  createdAt: string
}

const STORAGE_KEY = "zege-king-orders"

export function getOrders(): Order[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return []
    }

    return JSON.parse(saved)
  } catch {
    return []
  }
}

export function saveOrder(order: Order) {
  const currentOrders = getOrders()

  const updatedOrders = [order, ...currentOrders]

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedOrders),
  )

  return order
}

export function updateOrderStatus(
  orderId: string,
  status: Order["status"],
) {
  const currentOrders = getOrders()

  const updatedOrders = currentOrders.map((order) =>
    order.id === orderId
      ? { ...order, status }
      : order,
  )

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedOrders),
  )

  return updatedOrders
}

export function getOrderById(orderId: string) {
  return getOrders().find((order) => order.id === orderId)
}

export function clearOrders() {
  localStorage.removeItem(STORAGE_KEY)
}