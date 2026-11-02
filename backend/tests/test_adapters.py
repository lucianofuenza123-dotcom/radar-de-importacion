
import pytest

from app.integrations.adapters import (
    AdaptadorProveedor,
    AdaptadorArchivoComercial
)


def test_adaptar_producto_proveedor():
    datos = {
        "product_name": "Auriculares",
        "category": "Electronica",
        "origin_country": "China",
        "unit_price": 12.50,
        "currency": "USD"
    }

    producto = AdaptadorProveedor().adaptar(datos)

    assert producto.nombre == "Auriculares"
    assert producto.precio == 12.50
    assert producto.moneda == "USD"


def test_adaptar_producto_archivo():
    datos = {
        "nombre_producto": "Teclado",
        "rubro": "Informatica",
        "pais": "China",
        "precio": 18.90,
        "moneda": "USD"
    }

    producto = AdaptadorArchivoComercial().adaptar(datos)

    assert producto.nombre == "Teclado"
    assert producto.precio == 18.90


def test_rechazar_precio_negativo():
    datos = {
        "product_name": "Mouse",
        "category": "Informatica",
        "origin_country": "China",
        "unit_price": -10,
        "currency": "USD"
    }

    with pytest.raises(ValueError):
        AdaptadorProveedor().adaptar(datos)


def test_rechazar_campo_faltante():
    datos = {
        "product_name": "Monitor",
        "category": "Electronica",
        "origin_country": "China",
        "unit_price": 100
    }

    with pytest.raises(ValueError):
        AdaptadorProveedor().adaptar(datos)


def test_rechazar_precio_no_numerico():
    datos = {
        "product_name": "Notebook",
        "category": "Informatica",
        "origin_country": "China",
        "unit_price": "abc",
        "currency": "USD"
    }

    with pytest.raises(ValueError):
        AdaptadorProveedor().adaptar(datos)
