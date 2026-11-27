
from app.services.estadisticas_comtrade import (
    guardar_estadisticas_comtrade,
    listar_estadisticas_comtrade
)


def test_guardar_y_listar_estadisticas():
    registros = [
        {
            "producto": "Auriculares y audífonos",
            "codigo_producto": "851830",
            "pais_importador": "Argentina",
            "pais_origen": "China",
            "periodo": "2024",
            "valor_fob_usd": 35035229.87,
            "valor_cif_usd": 36995052.15,
            "peso_neto_kg": 1200021.79,
            "fuente": "UN Comtrade"
        }
    ]

    guardar_estadisticas_comtrade(registros)

    resultados = listar_estadisticas_comtrade()

    encontrado = next(
        (
            registro for registro in resultados
            if registro["codigo_producto"] == "851830"
            and registro["pais_importador"] == "Argentina"
            and registro["pais_origen"] == "China"
            and registro["periodo"] == "2024"
        ),
        None
    )

    assert encontrado is not None
    assert encontrado["producto"] == "Auriculares y audífonos"
    assert encontrado["valor_cif_usd"] == 36995052.15
    assert encontrado["fuente"] == "UN Comtrade"


def test_actualizar_estadistica_existente():
    registro = {
        "producto": "Auriculares y audífonos",
        "codigo_producto": "851830",
        "pais_importador": "Argentina",
        "pais_origen": "China",
        "periodo": "2024",
        "valor_fob_usd": 36000000.00,
        "valor_cif_usd": 38000000.00,
        "peso_neto_kg": 1250000.00,
        "fuente": "UN Comtrade"
    }

    guardar_estadisticas_comtrade([registro])

    resultados = listar_estadisticas_comtrade()

    encontrado = next(
        (
            item for item in resultados
            if item["codigo_producto"] == "851830"
            and item["pais_importador"] == "Argentina"
            and item["pais_origen"] == "China"
            and item["periodo"] == "2024"
        ),
        None
    )

    assert encontrado is not None
    assert encontrado["valor_cif_usd"] == 38000000.00
