# Regalos para Martina – v6

Sitio estático listo para publicar en GitHub Pages.

## Archivos principales

- `index.html`: estructura de la página.
- `styles.css`: diseño visual.
- `script.js`: filtros, tarjetas, estados y enlaces de WhatsApp/Mercado Libre.
- `gifts.js`: base editable de regalos.
- `assets/img/productos/`: imágenes ilustrativas por categoría.

## Cómo cambiar el estado de un regalo

Abrí `gifts.js`, buscá el regalo y cambiá el campo `estado`:

```js
estado: "Disponible"
```

Valores admitidos:

```js
"Disponible"
"Reservado"
"Comprado"
```

Los estados `Reservado` y `Comprado` bloquean el botón de WhatsApp y marcan la tarjeta de forma notoria.

## Cómo cambiar una descripción o característica

En `gifts.js`, modificá:

```js
descripcion: "Texto..."
caracteristicas: ["...", "...", "..."]
```

## Cómo cambiar el link de compra

Pegá una URL específica en `linkCompra`:

```js
linkCompra: "https://www.mercadolibre.com.ar/..."
```

Si `linkCompra` queda vacío, la página arma automáticamente una búsqueda en Mercado Libre usando el campo `busqueda`.

## Cómo cambiar la foto de un producto

Podés usar:

1. Una ruta local:

```js
imagen: "assets/img/productos/nombre-del-archivo.jpg"
```

2. Una URL externa directa:

```js
imagen: "https://.../foto.jpg"
```

## Cómo cambiar el WhatsApp

En `gifts.js`:

```js
const WHATSAPP_NUMBER = "5491164137699";
```

Usar formato internacional sin `+`, espacios ni guiones.

## Publicación en GitHub Pages

1. Crear repositorio público, por ejemplo `martina-regalos`.
2. Subir todos los archivos descomprimidos.
3. Ir a `Settings > Pages`.
4. Elegir `Deploy from a branch`.
5. Branch: `main`.
6. Folder: `/ (root)`.
7. Guardar.

La URL quedará similar a:

```txt
https://TU-USUARIO.github.io/martina-regalos/
```
