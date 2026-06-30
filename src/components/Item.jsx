import { Link } from 'react-router-dom'

function Item({ product }) {
  const { id, title, price, image, stock } = product

  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
      <div className="card h-100 shadow-sm item-card">
        <img src={image} className="card-img-top" alt={title} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{title}</h5>
          <p className="card-text fw-bold text-primary mb-1">
            ${price.toLocaleString('es-AR')}
          </p>
          <p className="card-text text-muted small mb-3">
            {stock > 0 ? `Stock disponible: ${stock}` : 'Sin stock'}
          </p>
          <Link
            to={`/item/${id}`}
            className="btn btn-outline-primary mt-auto"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Item
