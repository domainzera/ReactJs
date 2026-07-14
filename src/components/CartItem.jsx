import { useCart } from '../context/CartContext'

function CartItem({ item }) {
  const { removeItem } = useCart()
  const { id, title, image, price, quantity } = item
  const subtotal = price * quantity

  return (
    <tr>
      <td className="d-flex align-items-center gap-3">
        <img
          src={image}
          alt={title}
          style={{ width: 56, height: 56, objectFit: 'cover' }}
          className="rounded"
        />
        <span>{title}</span>
      </td>
      <td>${price.toLocaleString('es-AR')}</td>
      <td>{quantity}</td>
      <td className="fw-semibold">${subtotal.toLocaleString('es-AR')}</td>
      <td>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => removeItem(id)}
        >
          Quitar
        </button>
      </td>
    </tr>
  )
}

export default CartItem
