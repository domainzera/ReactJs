import Item from './Item'

function ItemList({ products }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="lead text-muted">
          No se encontraron productos en esta categoría.
        </p>
      </div>
    )
  }

  return (
    <div className="row">
      {products.map((product) => (
        <Item key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ItemList
