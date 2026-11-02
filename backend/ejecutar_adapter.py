
from app.integrations.adapters import (
    AdaptadorProveedor,
    AdaptadorArchivoComercial
)


# Datos recibidos de un proveedor
datos_proveedor = {
    "product_name": "Auriculares Bluetooth",
    "category": "Electrónica",
    "origin_country": "China",
    "unit_price": 12.50,
    "currency": "USD"
}

# Datos recibidos de un archivo comercial
datos_archivo = {
    "nombre_producto": "Teclado mecánico",
    "rubro": "Informática",
    "pais": "China",
    "precio": 18.90,
    "moneda": "USD"
}


# Aplicamos los adaptadores
adaptador_proveedor = AdaptadorProveedor()
adaptador_archivo = AdaptadorArchivoComercial()

producto1 = adaptador_proveedor.adaptar(datos_proveedor)
producto2 = adaptador_archivo.adaptar(datos_archivo)


# Mostramos los resultados unificados
print("PRODUCTOS IMPORTADOS")

for producto in [producto1, producto2]:
    print("-------------------------")
    print(f"Nombre: {producto.nombre}")
    print(f"Categoría: {producto.categoria}")
    print(f"País: {producto.pais_origen}")
    print(f"Precio: {producto.precio} {producto.moneda}")
