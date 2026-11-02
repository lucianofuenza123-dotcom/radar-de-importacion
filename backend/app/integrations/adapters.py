
from dataclasses import dataclass
from typing import Protocol


# Formato interno que utilizará ImportaRadar
@dataclass
class Producto:
    nombre: str
    categoria: str
    pais_origen: str
    precio: float
    moneda: str


# Interfaz común para todos los adaptadores
class Adaptador(Protocol):

    def adaptar(self, datos: dict) -> Producto:
        ...


# Adaptador para catálogos de proveedores
class AdaptadorProveedor:

    def adaptar(self, datos: dict) -> Producto:
        return Producto(
            nombre=datos["product_name"],
            categoria=datos["category"],
            pais_origen=datos["origin_country"],
            precio=float(datos["unit_price"]),
            moneda=datos["currency"]
        )


# Adaptador para archivos comerciales
class AdaptadorArchivoComercial:

    def adaptar(self, datos: dict) -> Producto:
        return Producto(
            nombre=datos["nombre_producto"],
            categoria=datos["rubro"],
            pais_origen=datos["pais"],
            precio=float(datos["precio"]),
            moneda=datos["moneda"]
        )
