
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


PAISES_ORIGEN = [
    {"nombre": "China", "codigo": 156},
    {"nombre": "Brasil", "codigo": 76},
    {"nombre": "Estados Unidos", "codigo": 842}
]


ANIOS_ANALIZAR = [2023, 2024]


def actualizar_importaciones_argentina():
    resultados = []

    for anio in ANIOS_ANALIZAR:
        for pais in PAISES_ORIGEN:
            for producto in PRODUCTOS_ANALIZAR:
                try:
                    registros = consultar_importaciones(
                        pais_importador=32,
                        pais_origen=pais["codigo"],
                        codigo_producto=producto["codigo"],
                        periodo=anio,
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


def comparar_paises_por_producto():
    registros = listar_estadisticas_comtrade()

    comparaciones = {}

    for registro in registros:
        clave = (
            registro["codigo_producto"],
            registro["periodo"]
        )

        if clave not in comparaciones:
            comparaciones[clave] = {
                "producto": registro["producto"],
                "codigo_producto": registro["codigo_producto"],
                "periodo": registro["periodo"],
                "registros": []
            }

        comparaciones[clave]["registros"].append(registro)

    resultados = []

    for grupo in comparaciones.values():
        registros_validos = [
            registro
            for registro in grupo["registros"]
            if registro["valor_cif_usd"] is not None
        ]

        if not registros_validos:
            continue

        mayor = max(
            registros_validos,
            key=lambda registro: registro["valor_cif_usd"]
        )

        resultados.append({
            "producto": grupo["producto"],
            "codigo_producto": grupo["codigo_producto"],
            "periodo": grupo["periodo"],
            "pais_mayor_importacion": mayor["pais_origen"],
            "valor_cif_usd": mayor["valor_cif_usd"],
            "paises_comparados": len(registros_validos)
        })

    return resultados


def analizar_evolucion_importaciones():
    registros = listar_estadisticas_comtrade()

    comparaciones = {}

    for registro in registros:
        valor_cif = registro["valor_cif_usd"]

        if valor_cif is None:
            continue

        clave = (
            registro["codigo_producto"],
            registro["pais_origen"]
        )

        if clave not in comparaciones:
            comparaciones[clave] = {
                "producto": registro["producto"],
                "codigo_producto": registro["codigo_producto"],
                "pais_origen": registro["pais_origen"],
                "periodos": {}
            }

        comparaciones[clave]["periodos"][
            registro["periodo"]
        ] = valor_cif

    resultados = []

    for grupo in comparaciones.values():
        periodos = grupo["periodos"]

        if "2023" not in periodos or "2024" not in periodos:
            continue

        valor_anterior = periodos["2023"]
        valor_actual = periodos["2024"]

        if valor_anterior == 0:
            continue

        variacion = (
            (valor_actual - valor_anterior)
            / valor_anterior
        ) * 100

        if variacion > 0:
            tendencia = "Crecimiento"
        elif variacion < 0:
            tendencia = "Disminución"
        else:
            tendencia = "Estable"

        resultados.append({
            "producto": grupo["producto"],
            "codigo_producto": grupo["codigo_producto"],
            "pais_origen": grupo["pais_origen"],
            "periodo_anterior": "2023",
            "periodo_actual": "2024",
            "valor_cif_anterior": valor_anterior,
            "valor_cif_actual": valor_actual,
            "variacion_porcentual": round(variacion, 2),
            "tendencia": tendencia
        })

    return resultados
