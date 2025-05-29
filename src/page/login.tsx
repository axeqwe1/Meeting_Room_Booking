import { useState, FormEvent, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoginRequest } from '../types/RequestDTO'

export default function Login() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isRemembered, setIsRemembered] = useState(false)
  const [error, setError] = useState<string>('')
  // const [isLoading, setIsLoading] = useState<boolean>(false)
  const refAuth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  // Redirect ไป dashboard ถ้า login แล้ว (หลังโหลดเสร็จ)
  useEffect(() => {
    if (!refAuth.loading && refAuth.isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [refAuth.loading, refAuth.isAuthenticated, navigate])

  if (refAuth.isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    let data: LoginRequest = {
      username,
      password,
      rememberMe: isRemembered
    }

    try {
      const success = await refAuth.login(data)
      if (success) {
        navigate('/dashboard', { replace: true })
      } else {
        setError('Login failed')
      }
    } catch {
      setError('Login failed')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-box">
        <h2 className="text-3xl font-bold text-center text-primary">Login</h2>
        {error && (
          <div className="alert alert-error text-sm py-2 px-3">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="input input-primary w-full"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-control mb-2">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox"
                checked={isRemembered}
                onChange={() => setIsRemembered(!isRemembered)}
              />
              <span className="label-text ml-2">Remember me</span>
            </label>
          </div>
          <button type="submit" className="mt-2 btn btn-primary w-full h-[42px]">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}