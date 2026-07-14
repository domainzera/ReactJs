import { useState } from 'react'
import { Link } from 'react-router-dom'
import ItemCount from './ItemCount'
import { useCart } from '../context/CartContext'

function ItemDetail({ product }) {
  const { title, price, image, description, stock, category } = product
  const [added, setAdded] = useState(null)
  const { addToCart } = useCart()

  const handleAdd = (quantity) => {
    addToCart(product, quantity)
    setAdded(quantity)
  }

  return (
    <div className="item-detail container py-5">
      <Link to="/" className="btn btn-link mb-4 ps-0">
        ← Volver al catálogo
      </Link>
      <div className="row g-5 align-items-start">
        <div className="col-12 col-md-6">
          <img src={image} alt={title} className="img-fluid rounded shadow-sm" />
        </div>
        <div className="col-12 col-md-6">
          <span className="badge bg-secondary mb-2 text-uppercase">
            {category}
          </span>
          <h1 className="mb-3">{title}</h1>
          <p className="fs-3 fw-bold text-primary mb-3">
            ${price.toLocaleString('es-AR')}
          </p>
          <p className="text-muted mb-4">{description}</p>

          {!added && <ItemCount stock={stock} initial={1} onAdd={handleAdd} />}

          {added && (
            <div className="alert alert-success mt-3" role="alert">
              Agregaste {added} unidad{added > 1 ? 'es' : ''} de "{title}" al carrito.{' '}
              <Link to="/cart" className="alert-link">
                Ver carrito
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemDetail
