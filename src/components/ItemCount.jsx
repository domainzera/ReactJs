import { useState } from 'react'

function ItemCount({ stock, initial = 1, onAdd }) {
  const [count, setCount] = useState(initial)

  const increment = () => {
    if (count < stock) {
      setCount(count + 1)
    }
  }

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1)
    }
  }

  if (stock === 0) {
    return (
      <span className="badge bg-danger fs-6 px-3 py-2">Sin stock</span>
    )
  }

  return (
    <div className="item-count">
      <div className="d-flex align-items-center gap-3 mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={decrement}
          disabled={count <= 1}
        >
          −
        </button>
        <span className="fs-5 fw-semibold" style={{ minWidth: '2ch', textAlign: 'center' }}>
          {count}
        </span>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={increment}
          disabled={count >= stock}
        >
          +
        </button>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => onAdd && onAdd(count)}
      >
        Agregar al carrito
      </button>
    </div>
  )
}

export default ItemCount
