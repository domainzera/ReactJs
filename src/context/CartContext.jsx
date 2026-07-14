import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const isInCart = (id) => cart.some((item) => item.id === id)

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id)

      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prevCart, { ...product, quantity }]
    })
  }

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const clear = () => {
    setCart([])
  }

  const totalUnits = cart.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  )

  const value = {
    cart,
    addToCart,
    removeItem,
    clear,
    isInCart,
    totalUnits,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }

  return context
}
