import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const productsCollection = collection(db, 'products')
const ordersCollection = collection(db, 'orders')

const mapProductDoc = (docSnap) => ({ id: docSnap.id, ...docSnap.data() })

export const getProducts = async () => {
  const snapshot = await getDocs(productsCollection)
  return snapshot.docs.map(mapProductDoc)
}

export const getProductsByCategory = async (categoryId) => {
  const q = query(productsCollection, where('category', '==', categoryId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(mapProductDoc)
}

export const getProductById = async (itemId) => {
  const productRef = doc(db, 'products', itemId)
  const snapshot = await getDoc(productRef)

  if (!snapshot.exists()) {
    throw new Error('Producto no encontrado')
  }

  return mapProductDoc(snapshot)
}

export const getCategories = async () => {
  const snapshot = await getDocs(productsCollection)
  const categories = new Set(snapshot.docs.map((d) => d.data().category))
  return [...categories]
}

// Descuenta stock de cada producto comprado. Se llama al confirmar la orden.
const updateStock = async (items) => {
  await Promise.all(
    items.map((item) => {
      const productRef = doc(db, 'products', item.id)
      return updateDoc(productRef, {
        stock: item.stock - item.quantity,
      })
    })
  )
}

// Crea la orden en Firestore y descuenta el stock comprado.
// Devuelve el id del documento generado para mostrárselo al usuario.
export const createOrder = async (order) => {
  const orderToSave = {
    buyer: order.buyer,
    items: order.items.map(({ id, title, price, quantity }) => ({
      id,
      title,
      price,
      quantity,
    })),
    total: order.total,
    date: serverTimestamp(),
  }

  const orderRef = await addDoc(ordersCollection, orderToSave)
  await updateStock(order.items)

  return orderRef.id
}
