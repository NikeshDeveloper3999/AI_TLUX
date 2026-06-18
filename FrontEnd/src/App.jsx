import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import axios from 'axios'
import ProtectedRoute from './Components/ProtectedRoute'
import Navbar from './Components/Navbar'
import Builder from './pages/Builder'
import Settings from './pages/Settings'
import { ThemeProvider } from './Context/ThemeContext'
import { Toaster } from "react-hot-toast"
export const ServerUrl = "http://localhost:8000"
export const CLIENT_URL = "http://localhost:5173"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {

    const fetchMe = async () => {
      try {
        const res = await axios.get(ServerUrl + "/api/user/current-user", { withCredentials: true })
        setUser(res.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    fetchMe()

  }, [])


  return (
    <ThemeProvider user={user}>

    <Toaster position='top-right'
      toastOptions={{
        className: 'dark:bg-gray-800 dark:text-white dark:border dark:border-gray-700',
        style: {
          borderRadius: '16px',
          padding: '12px 16px',
          fontSize: '14px',
        },
      }}
    />
      <Routes>

        <Route path='/login' element={<Login setUser={setUser}/>} />

        <Route path='/*' element={<ProtectedRoute user={user} loading={loading}>
          <Navbar setUser={setUser} user={user}/>
          <Routes>
            <Route path='/' element={<Home user={user}/>} />
            <Route path='/builder' element={<Builder user={user} setUser={setUser}/>}/>
            <Route path='/settings' element={<Settings/>}/>

            <Route path='*' element={<Navigate to="/" replace/>}/>
          </Routes>


        </ProtectedRoute>} />

      </Routes>

    </ThemeProvider>
  )
}

export default App
