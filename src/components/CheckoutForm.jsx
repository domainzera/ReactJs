import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../services/firestore'
import Loader from './Loader'

function CheckoutForm() {
  const { cart, totalPrice, clear } = useCart()
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [orderId, setOrderId] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const id = await createOrder({
        buyer: form,
        items: cart,
        total: totalPrice,
      })
      setOrderId(id)
      clear()
    } catch (err) {
      console.error(err)
      setError(
        'No pudimos generar tu orden. Verificá tu conexión e intentá nuevamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (orderId) {
    return (
      <div className="container text-center py-5">
        <h2 className="mb-3 text-success">¡Compra confirmada!</h2>
        <p className="lead mb-2">Gracias por tu compra, {form.name}.</p>
        <p className="text-muted mb-4">
          Número de orden: <span className="fw-bold">{orderId}</span>
        </p>
        <Link to="/" className="btn btn-primary">
          Seguir comprando
        </Link>
      </div>
    )
  }

  if (loading) {
    return <Loader />
  }

  if (cart.length === 0) {
    return (
      <div className="container text-center py-5">
        <h2 className="mb-3">No hay nada para finalizar</h2>
        <p className="text-muted mb-4">
          Tu carrito está vacío. Agregá productos antes de continuar.
        </p>
        <Link to="/" className="btn btn-primary">
          Ir al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-5" style={{ maxWidth: 560 }}>
      <h1 className="mb-4">Finalizar compra</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Nombre y apellido
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="form-label">
            Teléfono
          </label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <p className="fs-5 mb-4">
          Total a pagar:{' '}
          <span className="fw-bold text-primary">
            ${totalPrice.toLocaleString('es-AR')}
          </span>
        </p>

        <button type="submit" className="btn btn-primary btn-lg w-100">
          Confirmar compra
        </button>
      </form>
    </div>
  )
}

export default CheckoutForm
