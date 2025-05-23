// src/pages/Login.tsx
import { useState, FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User } from '../types/user'

// กำหนดประเภทสำหรับ response จาก fakeLogin
interface LoginResponse {
  user: User;
  token: string;
}

export default function Login() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const refAuth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      // เรียก API Login จริงที่นี่
      const response = await fakeLogin(username, password) as LoginResponse
      if (refAuth?.login) {
        refAuth.login(response.user)
        console.log(from)
        navigate(from, { replace: true }) // กลับไปหน้าที่พยายามเข้าถึงก่อน login
      }
    } catch (err) {
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
              onChange={(e) => setUsername(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="mt-2 btn btn-primary w-full h-[42px]">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

// ฟังก์ชันจำลองการ Login
const fakeLogin = async (username: string, password: string): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === '1234') {
        resolve({
          user: { username: 'admin', fullname: 'Admin', password:password, factorie:'YPT',user_id:1,token:'yes' },
          token: 'fake-jwt-token'
        })
        console.log(`${username} ${password}`)
      } else {
        reject(new Error('Invalid credentials'))
      }
    }, 500)
  })
}