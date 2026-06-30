import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProducts, getProductsByCategory } from '../services/asyncMock'
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
  const { categoryId } = useParams()

  useEffect(() => {
    setLoading(true)

    const asyncFunc = categoryId
      ? getProductsByCategory(categoryId)
      : getProducts()

    asyncFunc
      .then((response) => {
        setProducts(response)
      })
      .catch((error) => {
        console.error(error)
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

      {loading ? <Loader /> : <ItemList products={products} />}
    </section>
  )
}

export default ItemListContainer
