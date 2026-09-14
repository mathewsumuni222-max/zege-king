import { useState } from "react"
import type { FormEvent } from "react"
import { LockKeyhole, UserRound } from "lucide-react"

type AdminLoginProps = {
  onLogin: () => void
  onBack: () => void
}

export default function AdminLogin({
  onLogin,
  onBack,
}: AdminLoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (username === "admin" && password === "zegeking") {
      setError("")
      sessionStorage.setItem("zege-king-admin", "true")
      onLogin()
      return
    }

    setError("Incorrect username or password.")
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="brand-mark">Z</div>

          <div>
            <strong>ZEGE KING</strong>
            <span>ADMIN PORTAL</span>
          </div>
        </div>

        <div className="admin-login-heading">
          <span className="eyebrow">STAFF ONLY</span>
          <h1>Admin Login</h1>
          <p>
            Sign in to manage orders and monitor your restaurant.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Username

            <div className="login-input">
              <UserRound size={18} />

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
              />
            </div>
          </label>

          <label>
            Password

            <div className="login-input">
              <LockKeyhole size={18} />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button className="login-button" type="submit">
            Sign In
          </button>
        </form>

        <button
          className="login-back-button"
          onClick={onBack}
        >
          Back to Website
        </button>

        <small className="development-note">
          Development login — secure authentication will be added
          before production deployment.
        </small>
      </div>
    </main>
  )
}