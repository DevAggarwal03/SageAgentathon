import { Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './Pages/LandingPage'
import SwapPage from './Pages/SwapPage'
import TokensPage from './Pages/TokensPage'
import PoolsPage from './Pages/PoolsPage'
import ChatPage from './Pages/ChatPage'

function App() {

  return (
    <div className='bg-gray-900 min-h-screen'>
      <Routes>
        <Route index element={<LandingPage/>}/>
        <Route path='/swap' element={<SwapPage/>}/>
        <Route path='/tokens' element={<TokensPage/>}/>
        <Route path='/pools' element={<PoolsPage/>}/>
        <Route path='/chat' element={<ChatPage/>}/>
      </Routes>
    </div>
  )
}

export default App
