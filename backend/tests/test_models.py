import pytest

from app.models.usuario import Usuario
from app.models.producto import Producto
from app.models.proveedor import Proveedor
from app.models.cotizacion import Cotizacion
from app.models.orden_importacion import OrdenImportacion
from app.models.envio import Envio
from app.models.reclamo import Reclamo


def test_usuario():
    usuario = Usuario(1, "Luciano", "luciano@email.com", "Administrador")

    assert usuario.obtener_informacion()["nombre"] == "Luciano"
    usuario.desactivar()
    assert usuario.activo is False


def test_producto():
    producto = Producto(1, "Auriculares", "Bluetooth", "Electrónica")

    assert producto.obtener_informacion()["nombre"] == "Auriculares"
    producto.desactivar()
    assert producto.activo is False


def test_proveedor():
    proveedor = Proveedor(1, "Proveedor ABC", "China", "Juan")

    assert proveedor.obtener_informacion()["pais"] == "China"
    proveedor.desactivar()
    assert proveedor.activo is False


def test_cotizacion():
    cotizacion = Cotizacion(
        1, 1, 1, 25.50, "USD", 10
    )

    informacion = cotizacion.obtener_informacion()

    assert informacion["precio_unitario"] == 25.50
    assert informacion["moneda"] == "USD"


def test_orden_importacion():
    orden = OrdenImportacion(1, 1, "2026-11-02")

    orden.agregar_producto(1, 5, 20.0, "USD")

    assert len(orden.productos) == 1
    assert orden.productos[0]["cantidad"] == 5

    orden.cambiar_estado("Aprobada")
    assert orden.estado == "Aprobada"


def test_orden_rechaza_cantidad_invalida():
    orden = OrdenImportacion(1, 1, "2026-11-02")

    with pytest.raises(ValueError):
        orden.agregar_producto(1, 0, 20.0, "USD")


def test_envio():
    envio = Envio(1, 1)

    envio.cambiar_estado("En tránsito", "En camino")

    assert envio.estado == "En tránsito"
    assert len(envio.historial) == 1


def test_envio_rechaza_estado_invalido():
    with pytest.raises(ValueError):
        Envio(1, 1, estado="Estado incorrecto")


def test_reclamo():
    reclamo = Reclamo(
        1,
        1,
        "El producto llegó con problemas"
    )

    reclamo.registrar_respuesta("Se revisará el inconveniente")

    assert reclamo.estado == "Respondido"
    assert reclamo.respuesta == "Se revisará el inconveniente"