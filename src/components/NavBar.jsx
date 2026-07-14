import { Link, NavLink } from 'react-router-dom'
import CartWidget from './CartWidget'

const categories = [
  { id: 'celulares', label: 'Celulares' },
  { id: 'notebooks', label: 'Notebooks' },
  { id: 'accesorios', label: 'Accesorios' },
]

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          TiendaReact
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                to="/"
                end
              >
                Inicio
              </NavLink>
            </li>
            {categories.map((category) => (
              <li className="nav-item" key={category.id}>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  to={`/category/${category.id}`}
                >
                  {category.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <CartWidget />
        </div>
      </div>
    </nav>
  )
}

export default NavBar
