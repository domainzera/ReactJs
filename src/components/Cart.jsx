import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItem from './CartItem'

function Cart() {
  const { cart, clear, totalPrice } = useCart()

  if (cart.length === 0) {
    return (
      <div className="container text-center py-5">
        <h2 className="mb-3">Tu carrito está vacío</h2>
        <p className="text-muted mb-4">
          Todavía no agregaste productos. Explorá el catálogo para empezar.
        </p>
        <Link to="/" className="btn btn-primary">
          Ir al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Carrito de compras</h1>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={clear}>
          Vaciar carrito
        </button>

        <div className="text-sm-end">
          <p className="fs-4 mb-2">
            Total: <span className="fw-bold text-primary">${totalPrice.toLocaleString('es-AR')}</span>
          </p>
          <Link to="/checkout" className="btn btn-primary btn-lg">
            Finalizar compra
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
