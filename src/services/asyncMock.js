import products from '../data/products'

const SIMULATED_DELAY = 600

export const getProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products)
    }, SIMULATED_DELAY)
  })
}

export const getProductsByCategory = (categoryId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = products.filter((item) => item.category === categoryId)
      resolve(filtered)
    }, SIMULATED_DELAY)
  })
}

export const getProductById = (itemId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = products.find((item) => item.id === itemId)
      if (found) {
        resolve(found)
      } else {
        reject(new Error('Producto no encontrado'))
      }
    }, SIMULATED_DELAY)
  })
}

export const getCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = [...new Set(products.map((item) => item.category))]
      resolve(categories)
    }, SIMULATED_DELAY)
  })
}
