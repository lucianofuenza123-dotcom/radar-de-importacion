
from app.integrations.comtrade import consultar_importaciones

from app.services.estadisticas_comtrade import (
    guardar_estadisticas_comtrade,
    listar_estadisticas_comtrade
)


PRODUCTOS_ANALIZAR = [
    {"nombre": "Auriculares y audífonos", "codigo": "851830"},
    {"nombre": "Teclados", "codigo": "847160"},
    {
        "nombre": "Calzado deportivo con parte superior textil",
        "codigo": "640411"
    }
]


def actualizar_importaciones_argentina():
    resultados = []

    for producto in PRODUCTOS_ANALIZAR:
        try:
            registros = consultar_importaciones(
                pais_importador=32,
                pais_origen=156,
                codigo_producto=producto["codigo"],
                periodo=2024,
                nombre_producto=producto["nombre"]
            )

            resultados.extend(registros)

        except ValueError:
            continue

    if resultados:
        guardar_estadisticas_comtrade(resultados)

    guardados = listar_estadisticas_comtrade()

    if not guardados:
        raise ValueError(
            "No hay estadísticas guardadas. "
            "UN Comtrade no respondió correctamente; "
            "intentá actualizar más tarde."
        )

    return guardados


def analizar_importaciones_argentina():
    return listar_estadisticas_comtrade()


def obtener_ranking_importaciones_argentina():
    return listar_estadisticas_comtrade()
