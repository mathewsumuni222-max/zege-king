import { useMemo, useState } from "react"
import {
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Star,
  X,
} from "lucide-react"

import Checkout from "./pages/Checkout"
import Tracking from "./pages/Tracking"
import Admin from "./pages/Admin"
import AdminLogin from "./pages/AdminLogin"

import { menuItems as initialMenuItems } from "./data/menu"
import type { Order } from "./data/orders"

type Page =
  | "home"
  | "checkout"
  | "tracking"
  | "admin-login"
  | "admin"

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

const MENU_STORAGE_KEY = "zege-king-menu"

const formatPrice = (price: number) =>
  `TSh ${price.toLocaleString()}`

function getMenuItems(): MenuItem[] {
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

function App() {
  const [page, setPage] = useState<Page>("home")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] =
    useState<Record<number, number>>({})
  const [latestOrder, setLatestOrder] =
    useState<Order | null>(null)

  const [menuItems, setMenuItems] =
    useState<MenuItem[]>(getMenuItems)

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(menuItems.map((item) => item.category)),
    )

    return ["All", ...uniqueCategories]
  }, [menuItems])

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        category === "All" ||
        item.category === category

      const searchText = search.toLowerCase().trim()

      const matchesSearch =
        item.name.toLowerCase().includes(searchText) ||
        item.description
          .toLowerCase()
          .includes(searchText)

      return matchesCategory && matchesSearch
    })
  }, [category, search, menuItems])

  const cartItems = menuItems
    .filter((item) => cart[item.id])
    .map((item) => ({
      ...item,
      quantity: cart[item.id],
    }))

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0,
  )

  const deliveryFee = subtotal > 0 ? 2000 : 0
  const total = subtotal + deliveryFee

  const cartCount = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0,
  )

  const addToCart = (id: number) => {
    setCart((current) => ({
      ...current,
      [id]: (current[id] || 0) + 1,
    }))
  }

  const decreaseCart = (id: number) => {
    setCart((current) => {
      const next = { ...current }

      if (!next[id]) {
        return next
      }

      if (next[id] === 1) {
        delete next[id]
      } else {
        next[id] -= 1
      }

      return next
    })
  }

  const handleOrderPlaced = (order: Order) => {
    setLatestOrder(order)
    setCart({})
    setPage("tracking")
  }

  const openAdmin = () => {
    const loggedIn =
      sessionStorage.getItem(
        "zege-king-admin",
      ) === "true"

    if (loggedIn) {
      setPage("admin")
    } else {
      setPage("admin-login")
    }
  }

  const handleAdminLogin = () => {
    setPage("admin")
  }

  const logoutAdmin = () => {
    sessionStorage.removeItem(
      "zege-king-admin",
    )
    setPage("home")
  }

  const refreshMenu = () => {
    setMenuItems(getMenuItems())
  }

  if (page === "checkout") {
    return (
      <Checkout
        cartItems={cartItems}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        onBack={() => setPage("home")}
        onOrderPlaced={handleOrderPlaced}
      />
    )
  }

  if (page === "tracking") {
    return (
      <Tracking
        order={latestOrder}
        onBack={() => setPage("home")}
      />
    )
  }

  if (page === "admin-login") {
    return (
      <AdminLogin
        onLogin={handleAdminLogin}
        onBack={() => setPage("home")}
      />
    )
  }

  if (page === "admin") {
    return (
      <Admin
        onBack={() => {
          refreshMenu()
          setPage("home")
        }}
        onLogout={logoutAdmin}
      />
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">Z</div>

          <div>
            <strong>ZEGE KING</strong>
            <span>RULE EVERY BITE.</span>
          </div>
        </div>

        <div className="delivery-location">
          <small>Deliver to</small>
          <strong>Dar es Salaam</strong>
        </div>

        <div className="header-actions">
          <button
            className="search-button"
            onClick={() =>
              document
                .getElementById("menu")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            <Search size={20} />
          </button>

          <button
            className="cart-button"
            onClick={() =>
              setCartOpen(true)
            }
          >
            <ShoppingCart size={20} />
            Cart

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="admin-button"
            onClick={openAdmin}
          >
            Admin
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              🔥 MADE FOR THE KING
            </span>

            <h1>
              TANZANIA'S
              <br />
              <strong>KING OF ZEGE</strong>
            </h1>

            <p>
              Big taste. King energy.
              <br />
              Fresh chipsi yai made your way.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                document
                  .getElementById("menu")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Order Now
            </button>

            <div className="hero-rating">
              <Star
                size={18}
                fill="currentColor"
              />
              <strong>4.9</strong>
              <span>Top rated</span>
            </div>
          </div>

          <div className="hero-food">
            <div className="food-circle">
              🍟
            </div>
          </div>
        </section>

        <section
          id="menu"
          className="menu-section"
        >
          <div className="menu-heading">
            <div>
              <span className="eyebrow">
                OUR MENU
              </span>
              <h2>THE KING'S MENU</h2>
              <p>Choose your Zege.</p>
            </div>

            <div className="search-box">
              <Search size={18} />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search menu..."
              />
            </div>
          </div>

          <div className="categories">
            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>
            ))}
          </div>

          <div className="menu-grid">
            {filteredItems.map((item) => (
              <article
                className="menu-card"
                key={item.id}
              >
                <div className="food-image">
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

                  <div className="rating">
                    <Star
                      size={14}
                      fill="currentColor"
                    />
                    {item.rating}
                  </div>
                </div>

                <div className="menu-card-body">
                  <span className="category-label">
                    {item.category}
                  </span>

                  <h3>{item.name}</h3>

                  <p>{item.description}</p>

                  <div className="card-bottom">
                    <strong>
                      {formatPrice(item.price)}
                    </strong>

                    <button
                      className="add-button"
                      onClick={() =>
                        addToCart(item.id)
                      }
                    >
                      <Plus size={18} />
                      Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="empty-state">
              No Zege found. Try another search.
            </div>
          )}
        </section>
      </main>

      <footer>
        <div>
          <strong>ZEGE KING</strong>
          <span>RULE EVERY BITE.</span>
        </div>

        <button onClick={openAdmin}>
          Admin Dashboard
        </button>
      </footer>

      {cartOpen && (
        <div className="cart-overlay">
          <div className="cart-panel">
            <div className="cart-header">
              <div>
                <span className="eyebrow">
                  YOUR ORDER
                </span>

                <h2>Your Cart</h2>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setCartOpen(false)
                }
              >
                <X size={22} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div>🛒</div>

                <h3>Your cart is empty</h3>

                <p>
                  Add some Zege to continue.
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    setCartOpen(false)
                  }
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div
                      className="cart-item"
                      key={item.id}
                    >
                      <div className="cart-item-image">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          />
                        ) : (
                          item.emoji
                        )}
                      </div>

                      <div className="cart-item-info">
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {formatPrice(item.price)}
                        </span>

                        <div className="quantity-control">
                          <button
                            onClick={() =>
                              decreaseCart(
                                item.id,
                              )
                            }
                          >
                            <Minus size={15} />
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              addToCart(
                                item.id,
                              )
                            }
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>

                      <strong>
                        {formatPrice(
                          item.price *
                            item.quantity,
                        )}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>
                      {formatPrice(subtotal)}
                    </strong>
                  </div>

                  <div>
                    <span>Delivery</span>
                    <strong>
                      {formatPrice(deliveryFee)}
                    </strong>
                  </div>

                  <div className="cart-total">
                    <span>Total</span>
                    <strong>
                      {formatPrice(total)}
                    </strong>
                  </div>

                  <button
                    className="checkout-button"
                    onClick={() => {
                      setCartOpen(false)
                      setPage("checkout")
                    }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App