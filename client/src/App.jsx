import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Homepage from './pages/homepage'
import Loginpage from './pages/Loginpage'
import Profilepage from './pages/Profilepage'

const App = () => {
  return (
    <div className="bg-[url('./src/assets/bgimage.jpg')] bg-contain ">
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Loginpage/>} />
        <Route path='/profile' element={<Profilepage/>} />

      </Routes>
      
    </div>
  )
}

export default App