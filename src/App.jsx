import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import ItemListContainer from './components/ItemListContainer'
import ItemDetailContainer from './components/ItemDetailContainer'
import Cart from './components/Cart'
import CheckoutForm from './components/CheckoutForm'
import NotFound from './components/NotFound'
import { CartProvider } from './context/CartContext'
import './App.css'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app">
          <NavBar />
          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <ItemListContainer greeting="¡Bienvenido a nuestra tienda online!" />
                }
              />
              <Route
                path="/category/:categoryId"
                element={
                  <ItemListContainer greeting="¡Bienvenido a nuestra tienda online!" />
                }
              />
              <Route path="/item/:itemId" element={<ItemDetailContainer />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<CheckoutForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
