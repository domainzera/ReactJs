import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="container text-center py-5">
      <h1 className="display-3 fw-bold text-primary mb-3">404</h1>
      <h2 className="mb-3">Página no encontrada</h2>
      <p className="text-muted mb-4">
        La página que estás buscando no existe o fue movida.
      </p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  )
}

export default NotFound
