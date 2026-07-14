import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function CartWidget() {
  const { totalUnits } = useCart()

  return (
    <Link to="/cart" className="cart-widget d-flex align-items-center text-decoration-none">
      <span className="cart-icon me-1" role="img" aria-label="carrito">
        🛒
      </span>
      <span className="cart-count badge bg-primary rounded-pill">
        {totalUnits}
      </span>
    </Link>
  )
}

export default CartWidget
