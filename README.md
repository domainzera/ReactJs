# Backend - API de Productos y Carritos

API REST hecha con Node.js, Express y MongoDB (Mongoose) para gestionar un
catálogo de productos y carritos de compra, con vistas en Handlebars y
actualización en tiempo real vía Socket.io.

## Tecnologías

- Node.js + Express
- MongoDB / Mongoose (persistencia)
- mongoose-paginate-v2 (paginación)
- Handlebars (vistas del lado del servidor)
- Socket.io (listado de productos en tiempo real)

## Instalación

```bash
npm install
cp .env.example .env
```

Completar `.env` con la URI de tu cluster de MongoDB (Atlas o local):

```
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/backend
PORT=8080
```

Cargar productos de prueba (opcional):

```bash
npm run seed
```

Levantar el servidor:

```bash
npm start        # producción
npm run dev       # con reinicio automático al guardar cambios
```

Por defecto queda escuchando en `http://localhost:8080`.

## Estructura del proyecto

```
server/
  app.js                  # entry point, configuración de Express y Socket.io
  config/
    db.config.js           # conexión a MongoDB
  models/
    product.model.js        # schema de Product (con paginación)
    cart.model.js            # schema de Cart (referencia a Product)
  managers/
    ProductManager.js        # lógica de acceso a datos de productos
    CartManager.js            # lógica de acceso a datos de carritos
  routes/
    products.router.js        # endpoints /api/products
    carts.router.js            # endpoints /api/carts
    views.router.js             # rutas que renderizan vistas Handlebars
  views/                        # templates Handlebars
  public/                       # CSS y JS del cliente
  scripts/
    seed.js                      # carga productos de ejemplo
```

## Endpoints

### Productos — `/api/products`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Lista productos. Soporta `?limit=&page=&sort=asc\|desc&query=` |
| GET | `/:pid` | Devuelve un producto por id |
| POST | `/` | Crea un producto |
| PUT | `/:pid` | Actualiza un producto |
| DELETE | `/:pid` | Elimina un producto |

`GET /` devuelve:

```json
{
  "status": "success",
  "payload": [ /* productos */ ],
  "totalPages": 3,
  "prevPage": null,
  "nextPage": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "/api/products?limit=10&page=2"
}
```

`query` filtra por categoría (`query=Electronica`) o por disponibilidad
(`query=availability:true`).

### Carritos — `/api/carts`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/` | Crea un carrito |
| GET | `/:cid` | Trae el carrito con los productos completos (populate) |
| POST | `/:cid/product/:pid` | Agrega un producto al carrito (o suma 1 si ya está) |
| PUT | `/:cid` | Reemplaza todos los productos del carrito |
| PUT | `/:cid/products/:pid` | Actualiza la cantidad de un producto puntual |
| DELETE | `/:cid/products/:pid` | Elimina un producto del carrito |
| DELETE | `/:cid` | Vacía el carrito |

### Vistas

| Ruta | Descripción |
|---|---|
| `/` o `/products` | Listado de productos con paginación y filtros |
| `/products/:pid` | Detalle de un producto |
| `/carts/:cid` | Detalle de un carrito |
| `/realtimeproducts` | Listado en tiempo real (alta/baja vía websockets) |

El carrito asociado a la sesión del navegador se guarda en una cookie, así
el botón "Agregar al carrito" funciona sin necesidad de login.
