import { Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Home from './pages/Home'
import About from './pages/About'
import Store from './pages/Store'
import Navbar from './components/Navbar'
import { ShoppingCartProvider } from './CartContext'
import Order from './pages/Order'

const App = () => {
  return (
    <>
      <ShoppingCartProvider>
        <Navbar></Navbar>
        <Container className="mb-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/about" element={<About />} />
            <Route path="/order" element={<Order/>} />
          </Routes>
        </Container>
      </ShoppingCartProvider>
    </>
  )
}

export default App
