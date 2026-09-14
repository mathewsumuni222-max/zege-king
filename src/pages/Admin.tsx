import { useState } from "react"
import {
  ArrowLeft,
  RefreshCw,
  Plus,
  Trash2,
  Save,
  UtensilsCrossed,
  Image as ImageIcon,
} from "lucide-react"
import {
  getOrders,
  updateOrderStatus,
} from "../data/orders"
import type { Order } from "../data/orders"
import { menuItems as initialMenuItems } from "../data/menu"

type AdminProps = {
  onBack: () => void
  onLogout: () => void
}

type MenuItem = {
  id: number
  name: string
  category: string
  price: number
  rating: number
  description: string
  emoji: string
  image: string
}

const statuses: Order["status"][] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Completed",
]

const MENU_STORAGE_KEY = "zege-king-menu"

const formatPrice = (price: number) =>
  `TSh ${price.toLocaleString()}`

const getMenuItems = (): MenuItem[] => {
  try {
    const saved = localStorage.getItem(MENU_STORAGE_KEY)

    if (!saved) {
      return initialMenuItems
    }

    const parsed = JSON.parse(saved)

    return parsed.map((item: MenuItem) => ({
      ...item,
      image: item.image || "",
    }))
  } catch {
    return initialMenuItems
  }
}

const saveMenuItems = (items: MenuItem[]) => {
  localStorage.setItem(
    MENU_STORAGE_KEY,
    JSON.stringify(items),
  )
}

export default function Admin({
  onBack,
  onLogout,
}: AdminProps) {
  const [orders, setOrders] = useState<Order[]>(getOrders())
  const [menu, setMenu] = useState<MenuItem[]>(getMenuItems())
  const [activeTab, setActiveTab] = useState<
    "orders" | "menu"
  >("orders")

  const refreshOrders = () => {
    setOrders(getOrders())
  }

  const changeStatus = (
    orderId: string,
    status: Order["status"],
  ) => {
    const updated = updateOrderStatus(orderId, status)
    setOrders(updated)
  }

  const updateMenuItem = (
    id: number,
    field: keyof MenuItem,
    value: string | number,
  ) => {
    setMenu((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    )
  }

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now(),
      name: "New Zege",
      category: "Popular",
      price: 7000,
      rating: 5,
      description: "Delicious Zege King special",
      emoji: "🍟",
      image: "",
    }

    setMenu((current) => [newItem, ...current])
  }

  const deleteMenuItem = (id: number) => {
    const confirmed = window.confirm(
      "Delete this menu item?",
    )

    if (!confirmed) {
      return
    }

    setMenu((current) =>
      current.filter((item) => item.id !== id),
    )
  }

  const saveMenu = () => {
    saveMenuItems(menu)
    alert("Menu saved successfully.")
  }

  const resetMenu = () => {
    const confirmed = window.confirm(
      "Reset menu to the original products?",
    )

    if (!confirmed) {
      return
    }

    setMenu(initialMenuItems)
    saveMenuItems(initialMenuItems)
  }

  const totalSales = orders.reduce(
    (sum, order) => sum + order.total,
    0,
  )

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending",
  ).length

  const activeOrders = orders.filter(
    (order) => order.status !== "Completed",
  ).length

  return (
    <main className="admin-page">
      <div className="admin-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Website
        </button>

        <div className="admin-header-actions">
          <button
            className="refresh-button"
            onClick={refreshOrders}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <section className="admin-title">
        <span className="eyebrow">ZEGE KING</span>
        <h1>Admin Dashboard</h1>
        <p>
          Manage orders, menu items and restaurant
          operations.
        </p>
      </section>

      <div className="admin-tabs">
        <button
          className={
            activeTab === "orders"
              ? "admin-tab active"
              : "admin-tab"
          }
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>

        <button
          className={
            activeTab === "menu"
              ? "admin-tab active"
              : "admin-tab"
          }
          onClick={() => setActiveTab("menu")}
        >
          <UtensilsCrossed size={17} />
          Menu Management
        </button>
      </div>

      {activeTab === "orders" && (
        <>
          <section className="admin-stats">
            <div className="stat-card">
              <span>Total Orders</span>
              <strong>{orders.length}</strong>
            </div>

            <div className="stat-card">
              <span>Pending</span>
              <strong>{pendingOrders}</strong>
            </div>

            <div className="stat-card">
              <span>Active Orders</span>
              <strong>{activeOrders}</strong>
            </div>

            <div className="stat-card">
              <span>Total Sales</span>
              <strong>{formatPrice(totalSales)}</strong>
            </div>
          </section>

          <section className="orders-section">
            <div className="orders-heading">
              <div>
                <span className="eyebrow">ORDERS</span>
                <h2>Customer Orders</h2>
              </div>

              <span className="order-count">
                {orders.length} orders
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="empty-state admin-empty">
                <div>👑</div>
                <h2>No orders yet</h2>
                <p>
                  Orders placed through the website will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <article
                    className="admin-order"
                    key={order.id}
                  >
                    <div className="admin-order-top">
                      <div>
                        <span className="order-number">
                          {order.id}
                        </span>

                        <h3>{order.customerName}</h3>

                        <p>
                          {order.phone} • {order.address}
                        </p>
                      </div>

                      <div className="order-total">
                        <strong>
                          {formatPrice(order.total)}
                        </strong>

                        <span>
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="admin-order-items">
                      {order.items.map((item) => (
                        <div
                          key={item.productId}
                          className="admin-item"
                        >
                          <span>
                            {item.quantity} × {item.name}
                          </span>

                          <strong>
                            {formatPrice(
                              item.price * item.quantity,
                            )}
                          </strong>
                        </div>
                      ))}
                    </div>

                    <div className="admin-order-bottom">
                      <span>
                        {new Date(
                          order.createdAt,
                        ).toLocaleString()}
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          changeStatus(
                            order.id,
                            e.target.value as Order["status"],
                          )
                        }
                      >
                        {statuses.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {activeTab === "menu" && (
        <section className="menu-management">
          <div className="menu-management-header">
            <div>
              <span className="eyebrow">MENU</span>
              <h2>Menu Management</h2>
              <p>
                Edit the products customers see on the
                website.
              </p>
            </div>

            <div className="menu-management-actions">
              <button
                className="add-menu-button"
                onClick={addMenuItem}
              >
                <Plus size={18} />
                Add Product
              </button>

              <button
                className="save-menu-button"
                onClick={saveMenu}
              >
                <Save size={18} />
                Save Menu
              </button>
            </div>
          </div>

          <div className="menu-management-list">
            {menu.map((item) => (
              <article
                className="menu-management-card"
                key={item.id}
              >
                <div className="menu-management-icon">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  ) : (
                    <span>{item.emoji}</span>
                  )}
                </div>

                <div className="menu-management-fields">
                  <label className="full-width">
                    <span>
                      <ImageIcon size={15} />
                      Product Image URL
                    </span>

                    <input
                      type="url"
                      value={item.image}
                      onChange={(e) =>
                        updateMenuItem(
                          item.id,
                          "image",
                          e.target.value,
                        )
                      }
                      placeholder="https://example.com/zege.jpg"
                    />

                    <small>
                      Paste a direct image link. Leave empty
                      to use the emoji.
                    </small>
                  </label>

                  <label>
                    Product Name
                    <input
                      value={item.name}
                      onChange={(e) =>
                        updateMenuItem(
                          item.id,
                          "name",
                          e.target.value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Category
                    <input
                      value={item.category}
                      onChange={(e) =>
                        updateMenuItem(
                          item.id,
                          "category",
                          e.target.value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Price
                    <input
                      type="number"
                      min="0"
                      value={item.price}
                      onChange={(e) =>
                        updateMenuItem(
                          item.id,
                          "price",
                          Number(e.target.value),
                        )
                      }
                    />
                  </label>

                  <label>
                    Rating
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={item.rating}
                      onChange={(e) =>
                        updateMenuItem(
                          item.id,
                          "rating",
                          Number(e.target.value),
                        )
                      }
                    />
                  </label>

                  <label className="full-width">
                    Description
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        updateMenuItem(
                          item.id,
                          "description",
                          e.target.value,
                        )
                      }
                      rows={3}
                    />
                  </label>
                </div>

                <button
                  className="delete-menu-button"
                  onClick={() =>
                    deleteMenuItem(item.id)
                  }
                  title="Delete product"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </article>
            ))}
          </div>

          <div className="menu-reset-area">
            <button
              className="reset-menu-button"
              onClick={resetMenu}
            >
              Reset to Original Menu
            </button>
          </div>
        </section>
      )}
    </main>
  )
}