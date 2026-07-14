import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProducts, getProductsByCategory } from '../services/firestore'
import ItemList from './ItemList'
import Loader from './Loader'

const categoryNames = {
  celulares: 'Celulares',
  notebooks: 'Notebooks',
  accesorios: 'Accesorios',
}

function ItemListContainer({ greeting }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { categoryId } = useParams()

  useEffect(() => {
    setLoading(true)
    setError(false)

    const asyncFunc = categoryId
      ? getProductsByCategory(categoryId)
      : getProducts()

    asyncFunc
      .then((response) => {
        setProducts(response)
      })
      .catch((err) => {
        console.error(err)
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [categoryId])

  return (
    <section className="item-list-container container py-5">
      <h1 className="display-6 mb-2 text-center">
        {categoryId ? categoryNames[categoryId] ?? categoryId : greeting}
      </h1>
      <p className="lead text-muted text-center mb-5">
        {categoryId
          ? `Mostrando productos de la categoría ${categoryNames[categoryId] ?? categoryId}`
          : 'Descubrí todos nuestros productos disponibles'}
      </p>

      {loading && <Loader />}

      {!loading && error && (
        <div className="alert alert-danger text-center" role="alert">
          No pudimos cargar los productos desde Firestore. Verificá tu
          conexión o la configuración de <code>.env</code>.
        </div>
      )}

      {!loading && !error && <ItemList products={products} />}
    </section>
  )
}

export default ItemListContainer
