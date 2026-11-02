
from dataclasses import dataclass
from typing import Protocol


# Formato interno de productos de ImportaRadar
@dataclass
class Producto:
    nombre: str
    categoria: str
    pais_origen: str
    precio: float
    moneda: str


# Interfaz común de los adaptadores
class Adaptador(Protocol):

    def adaptar(self, datos: dict) -> Producto:
        ...


# Validaciones compartidas
def validar_producto(producto: Producto) -> Producto:

    if not producto.nombre.strip():
        raise ValueError("El nombre del producto es obligatorio.")

    if not producto.categoria.strip():
        raise ValueError("La categoria es obligatoria.")

    if not producto.pais_origen.strip():
        raise ValueError("El pais de origen es obligatorio.")

    if producto.precio <= 0:
        raise ValueError("El precio debe ser mayor que cero.")

    if not producto.moneda.strip():
        raise ValueError("La moneda es obligatoria.")

    return producto


# Adaptador para catálogos de proveedores
class AdaptadorProveedor:

    def adaptar(self, datos: dict) -> Producto:

        try:
            producto = Producto(
                nombre=datos["product_name"],
                categoria=datos["category"],
                pais_origen=datos["origin_country"],
                precio=float(datos["unit_price"]),
                moneda=datos["currency"]
            )

            return validar_producto(producto)

        except KeyError as error:
            raise ValueError(
                f"Falta el campo obligatorio: {error.args[0]}"
            ) from error

        except (TypeError, ValueError) as error:
            raise ValueError(
                f"Error en los datos del proveedor: {error}"
            ) from error


# Adaptador para archivos comerciales
class AdaptadorArchivoComercial:

    def adaptar(self, datos: dict) -> Producto:

        try:
            producto = Producto(
                nombre=datos["nombre_producto"],
                categoria=datos["rubro"],
                pais_origen=datos["pais"],
                precio=float(datos["precio"]),
                moneda=datos["moneda"]
            )

            return validar_producto(producto)

        except KeyError as error:
            raise ValueError(
                f"Falta el campo obligatorio: {error.args[0]}"
            ) from error

        except (TypeError, ValueError) as error:
            raise ValueError(
                f"Error en los datos del archivo comercial: {error}"
            ) from error
