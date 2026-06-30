import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../services/asyncMock'
import ItemDetail from './ItemDetail'
import Loader from './Loader'

function ItemDetailContainer() {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { itemId } = useParams()

  useEffect(() => {
    setLoading(true)
    setError(false)

    getProductById(itemId)
      .then((response) => {
        setProduct(response)
      })
      .catch(() => {
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [itemId])

  if (loading) {
    return <Loader />
  }

  if (error || !product) {
    return (
      <div className="container text-center py-5">
        <h2 className="mb-3">Producto no encontrado</h2>
        <p className="text-muted">
          El producto que buscás no existe o fue removido.
        </p>
      </div>
    )
  }

  return <ItemDetail product={product} />
}

export default ItemDetailContainer
