 
import { Routes } from 'react-router-dom'
import './App.css'
import UserRoutes from './routes/UserRoutes'
import { Toaster } from 'react-hot-toast'

  const App: React.FC = () => {

  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
     <Routes>
       {UserRoutes()}
    </Routes>
    </>
  )
}

export default App
