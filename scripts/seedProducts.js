// Script para cargar el catálogo local (src/data/products.js) dentro de la
// colección "products" de Firestore. Se corre una única vez (o cada vez que
// quieras resetear el catálogo) con: npm run seed
//
// Requiere tener un archivo ".env" completo en la raíz del proyecto
// (ver .env.example).
//
// Usa la API REST de Firestore directamente (fetch) en lugar del SDK,
// porque el SDK de Firebase abre una conexión streaming (gRPC/WebChannel)
// pensada para navegadores que en algunas terminales de Windows falla con
// errores "INVALID_ARGUMENT" al reintentar indefinidamente. La API REST
// solo hace pedidos HTTP simples y evita ese problema.

import 'dotenv/config'
import products from '../src/data/products.js'

const projectId = process.env.VITE_FIREBASE_PROJECT_ID
const apiKey = process.env.VITE_FIREBASE_API_KEY

if (!projectId || !apiKey) {
  console.error(
    'Faltan VITE_FIREBASE_PROJECT_ID y/o VITE_FIREBASE_API_KEY en tu archivo .env'
  )
  process.exit(1)
}

const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products`

// Convierte un objeto JS plano al formato de "fields" que exige la API REST
// de Firestore (cada valor tipado explícitamente).
function toFirestoreFields(data) {
  const fields = {}

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'number') {
      fields[key] = { doubleValue: value }
    } else {
      fields[key] = { stringValue: String(value) }
    }
  }

  return fields
}

async function seed() {
  console.log(`Subiendo ${products.length} productos a Firestore...`)

  for (const product of products) {
    const { id, ...data } = product
    const url = `${baseUrl}?documentId=${id}&key=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: toFirestoreFields(data) }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(
        `Error subiendo "${data.title}" (HTTP ${response.status}): ${errorBody}`
      )
    }

    console.log(`  ✓ ${data.title}`)
  }

  console.log('Listo. Catálogo cargado en la colección "products".')
}

seed().catch((error) => {
  console.error('Error al cargar el catálogo:', error.message)
  process.exit(1)
})
