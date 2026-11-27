
from app.services import analisis_oportunidades as servicio


def test_actualizar_importaciones_compara_tres_paises(monkeypatch):
    consultas = []
    estadisticas_guardadas = []

    def consultar_falso(**parametros):
        consultas.append(parametros)

        return [{
            "producto": parametros["nombre_producto"],
            "codigo_producto": parametros["codigo_producto"],
            "pais_importador": "Argentina",
            "pais_origen": {
                156: "China",
                76: "Brasil",
                842: "Estados Unidos"
            }[parametros["pais_origen"]],
            "periodo": "2024",
            "valor_fob_usd": 1000,
            "valor_cif_usd": 1200,
            "peso_neto_kg": 100,
            "fuente": "UN Comtrade"
        }]

    monkeypatch.setattr(
        servicio,
        "consultar_importaciones",
        consultar_falso
    )

    monkeypatch.setattr(
        servicio,
        "guardar_estadisticas_comtrade",
        lambda registros: estadisticas_guardadas.extend(registros)
    )

    monkeypatch.setattr(
        servicio,
        "listar_estadisticas_comtrade",
        lambda: estadisticas_guardadas
    )

    resultados = servicio.actualizar_importaciones_argentina()

    assert len(consultas) == 9
    assert len(resultados) == 9

    paises = {
        consulta["pais_origen"]
        for consulta in consultas
    }

    assert paises == {156, 76, 842}


def test_comparar_paises_por_producto(monkeypatch):
    registros_falsos = [
        {
            "producto": "Auriculares",
            "codigo_producto": "851830",
            "pais_importador": "Argentina",
            "pais_origen": "China",
            "periodo": "2024",
            "valor_cif_usd": 5000
        },
        {
            "producto": "Auriculares",
            "codigo_producto": "851830",
            "pais_importador": "Argentina",
            "pais_origen": "Brasil",
            "periodo": "2024",
            "valor_cif_usd": 3000
        },
        {
            "producto": "Auriculares",
            "codigo_producto": "851830",
            "pais_importador": "Argentina",
            "pais_origen": "Estados Unidos",
            "periodo": "2024",
            "valor_cif_usd": 4000
        }
    ]

    monkeypatch.setattr(
        servicio,
        "listar_estadisticas_comtrade",
        lambda: registros_falsos
    )

    resultados = servicio.comparar_paises_por_producto()

    assert len(resultados) == 1
    assert resultados[0]["pais_mayor_importacion"] == "China"
    assert resultados[0]["valor_cif_usd"] == 5000
    assert resultados[0]["paises_comparados"] == 3
