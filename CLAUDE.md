# Macá — Web de Cervecería Artesanal

Sitio web para **Macá**, una cervecería artesanal que solo cocina y vende su producto: no tiene local físico de venta, todas las entregas son a domicilio. El sitio funciona como catálogo + pedido online, coordinando la entrega y el pago por WhatsApp.

## 🚀 Arquitectura de Funciones Clave

### 1. Catálogo de Cervezas

- **Listado de productos**: nombre, estilo (IPA, Stout, Lager, etc.), ABV, IBU, descripción, foto, precio y disponibilidad/stock.
- **Ficha de producto**: detalle ampliado de cada cerveza (ingredientes, maridaje sugerido, formato — botella/lata/growler y volumen).
- Productos sin stock se muestran como no disponibles (no se pueden agregar al carrito).

### 2. Carrito y Pedido

- Carrito de compra simple: agregar/quitar productos, ajustar cantidad, ver subtotal.
- Checkout liviano: el cliente completa datos de entrega (nombre, dirección/zona, horario preferido) — **sin cuenta de usuario ni login**.
- Al confirmar, se crea el pedido en el backend (estado `pendiente`) y se genera un link de WhatsApp (`wa.me`) con el resumen del pedido prellenado, que abre la conversación con Macá para coordinar **pago y entrega** (no hay pasarela de pago integrada).

### 3. Zonas y Costo de Envío

- El costo/disponibilidad de envío puede variar por zona (a definir con el negocio: zona fija, costo por distancia, o simplemente "a coordinar por WhatsApp" en la primera versión).

### 4. Panel de Administración (solo para Macá)

- Acceso protegido (login simple) para el dueño del negocio.
- Gestión de catálogo: alta/baja/edición de cervezas, precios y stock.
- Listado de pedidos recibidos, con cambio de estado: `pendiente` → `confirmado` → `entregado` (o `cancelado`).

## 🛠️ Stack Tecnológico

- **Frontend**: React + TypeScript + Vite, Tailwind CSS. Sitio web responsive, mobile-first (la mayoría del tráfico va a ser desde el celular).
- **Backend**: Node.js + Express, TypeScript. Prisma como ORM.
- **Base de datos**: PostgreSQL gestionado por **Supabase** (plan free). Prisma se conecta vía `DATABASE_URL` (pooler, puerto 6543) para runtime y `DIRECT_URL` (puerto 5432) para migraciones.
- **Autenticación**: solo para el panel de administración (JWT, usuario/contraseña del dueño del negocio). El cliente final no se autentica.
- **Storage de imágenes**: Supabase Storage (bucket público para fotos de cervezas), referenciado desde el backend por URL — no se guardan binarios en Postgres.
- **Integración WhatsApp**: sin API oficial en la primera versión — alcanza con generar un link `https://wa.me/<numero>?text=<resumen>` desde el frontend al confirmar el pedido.

## 📁 Estructura del repo

```
maca/
├── frontend/    # Sitio web (Vite + React + TypeScript + Tailwind)
├── backend/     # API Express (TypeScript + Prisma + PostgreSQL)
└── CLAUDE.md
```

## Agentes del proyecto

Este proyecto cuenta con dos subagentes dedicados en `.claude/agents/`:

- `frontend`: encargado de la UI/UX del sitio — catálogo de cervezas, ficha de producto, carrito, checkout y generación del link de WhatsApp, y las pantallas del panel de administración.
- `backend`: encargado de la API Express, el esquema de datos en PostgreSQL/Prisma, la lógica de catálogo/stock, pedidos y la autenticación del panel de administración.
