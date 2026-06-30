function CartWidget() {
  return (
    <div className="cart-widget d-flex align-items-center">
      <span className="cart-icon me-1" role="img" aria-label="carrito">
        🛒
      </span>
      <span className="cart-count badge bg-primary rounded-pill">0</span>
    </div>
  )
}

export default CartWidget
